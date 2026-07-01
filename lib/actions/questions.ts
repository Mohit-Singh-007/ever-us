"use server";


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { DAILY_QUESTION_PROMPTS } from "../data/daily-questions";


function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Ensures a DailyQuestion row exists for today, creating one from the
 * prompt pool if not. Avoids repeating any of the last 20 prompts used.
 */
async function getOrCreateTodaysQuestion() {
  const today = startOfToday();

  const existing = await prisma.dailyQuestion.findUnique({
    where: { date: today },
  });
  if (existing) return existing;

  const recentPrompts = await prisma.dailyQuestion.findMany({
    orderBy: { date: "desc" },
    take: 20,
    select: { prompt: true },
  });
  const recentSet = new Set(recentPrompts.map((r) => r.prompt));

  const available = DAILY_QUESTION_PROMPTS.filter((p) => !recentSet.has(p));
  const pool = available.length > 0 ? available : DAILY_QUESTION_PROMPTS;
  const prompt = pool[Math.floor(Math.random() * pool.length)];

  try {
    return await prisma.dailyQuestion.create({ data: { prompt, date: today } });
  } catch {
    // Race condition guard: another request created it first (date is @unique).
    return prisma.dailyQuestion.findUniqueOrThrow({ where: { date: today } });
  }
}

async function requireCoupleContext() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  const couple = await prisma.couple.findFirst({
    where: {
      OR: [{ partnerOneId: session.user.id }, { partnerTwoId: session.user.id }],
    },
    include: {
      partnerOne: { select: { id: true, name: true, image: true } },
      partnerTwo: { select: { id: true, name: true, image: true } },
    },
  });
  if (!couple) throw new Error("No couple connected yet");

  const partner = couple.partnerOneId === session.user.id ? couple.partnerTwo : couple.partnerOne;

  return { session, couple, partner };
}

export async function getDailyQuestionState() {
  const { session, couple, partner } = await requireCoupleContext();
  const question = await getOrCreateTodaysQuestion();

  const answers = await prisma.dailyAnswer.findMany({
    where: { dailyQuestionId: question.id, coupleId: couple.id },
  });

  const myAnswer = answers.find((a) => a.userId === session.user.id) ?? null;
  const partnerAnswer = answers.find((a) => a.userId === partner.id) ?? null;
  const bothAnswered = Boolean(myAnswer && partnerAnswer);

  return {
    prompt: question.prompt,
    date: question.date.toISOString(),
    myAnswer: myAnswer?.answer ?? null,
    partnerAnswer: bothAnswered ? partnerAnswer!.answer : null,
    partnerAnswered: Boolean(partnerAnswer),
    partnerName: partner.name,
    bothAnswered,
  };
}

type ActionResult = { ok: true } | { ok: false; error: string };

export async function submitDailyAnswer(answer: string): Promise<ActionResult> {
  const trimmed = answer.trim();
  if (!trimmed) return { ok: false, error: "Write something before submitting." };
  if (trimmed.length > 1000) return { ok: false, error: "Keep it under 1000 characters." };

  const { session, couple } = await requireCoupleContext();
  const question = await getOrCreateTodaysQuestion();

  await prisma.dailyAnswer.upsert({
    where: {
      dailyQuestionId_userId: { dailyQuestionId: question.id, userId: session.user.id },
    },
    create: {
      dailyQuestionId: question.id,
      coupleId: couple.id,
      userId: session.user.id,
      answer: trimmed,
    },
    update: { answer: trimmed },
  });

  revalidatePath("/dashboard/question");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Past questions both partners have answered, most recent first. */
export async function getDailyQuestionHistory(limit = 10) {
  const { session, couple, partner } = await requireCoupleContext();

  const questions = await prisma.dailyQuestion.findMany({
    where: {
      date: { lt: startOfToday() },
      answers: { some: { coupleId: couple.id } },
    },
    orderBy: { date: "desc" },
    take: limit,
    include: { answers: { where: { coupleId: couple.id } } },
  });

  return questions
    .map((q) => {
      const mine = q.answers.find((a) => a.userId === session.user.id);
      const theirs = q.answers.find((a) => a.userId === partner.id);
      if (!mine || !theirs) return null;
      return {
        prompt: q.prompt,
        date: q.date.toISOString(),
        myAnswer: mine.answer,
        partnerAnswer: theirs.answer,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}