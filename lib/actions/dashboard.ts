"use server";

import {  type CoupleWithPartners } from "@/lib/actions/couple";
import prisma from "../prisma";
import { getPartner } from "@/utils/couple-utils";
import { formatAnniversaryCountdown, formatRelationshipDuration } from "@/utils/dashboard-utils";

export async function getDashboardData(
  coupleId: string,
  userId: string,
) {
  const couple = await prisma.couple.findUniqueOrThrow({
    where: { id: coupleId },
    include: {
      partnerOne: { select: { id: true, name: true, image: true } },
      partnerTwo: { select: { id: true, name: true, image: true } },
    },
  });

  const [
    memoryCount,
    journalCount,
    bucketTotal,
    bucketCompleted,
    recentMemories,
    todayQuestion,
  ] = await Promise.all([
    prisma.memory.count({ where: { coupleId } }),
    prisma.journal.count({ where: { coupleId } }),
    prisma.bucketItem.count({ where: { coupleId } }),
    prisma.bucketItem.count({ where: { coupleId, completed: true } }),
    prisma.memory.findMany({
      where: { coupleId },
      orderBy: { date: "desc" },
      take: 8,
      select: { id: true, imageUrl: true, caption: true },
    }),
    getTodaysQuestion(coupleId, userId),
  ]);

  const partner =  getPartner(couple as NonNullable<CoupleWithPartners>, userId);
  const me =
    couple.partnerOneId === userId ? couple.partnerOne : couple.partnerTwo;

  return {
    firstName: me.name.split(" ")[0],
    relationshipDurationLabel: formatRelationshipDuration(couple.createdAt),
    anniversaryCountdownLabel: couple.anniversaryDate
      ? formatAnniversaryCountdown(couple.anniversaryDate)
      : null,
    stats: {
      memoryCount,
      journalCount,
      bucketCompletionPct:
        bucketTotal === 0 ? 0 : Math.round((bucketCompleted / bucketTotal) * 100),
      streakDays: await getCurrentStreak(coupleId),
    },
    dailyQuestion: todayQuestion,
    recentMemories,
    partner,
  };
}


async function getTodaysQuestion(coupleId: string, userId: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const question = await prisma.dailyQuestion.findFirst({
    where: { date: { gte: startOfToday } },
    orderBy: { date: "desc" },
    include: {
      answers: {
        where: { coupleId },
        select: { userId: true },
      },
    },
  });

  if (!question) return null;

  const couple = await prisma.couple.findUniqueOrThrow({
    where: { id: coupleId },
    select: { partnerOneId: true, partnerTwoId: true },
  });
  const partnerId =
    couple.partnerOneId === userId ? couple.partnerTwoId : couple.partnerOneId;

  const answeredUserIds = new Set(question.answers.map((a) => a.userId));

  return {
    prompt: question.prompt,
    userAnswered: answeredUserIds.has(userId),
    partnerAnswered: answeredUserIds.has(partnerId),
  };
}

async function getCurrentStreak(coupleId: string): Promise<number> {
  // Streak = consecutive days (ending today) where both partners answered
  // the daily question. Pulls the last 60 answered days and walks backward.
  const answers = await prisma.dailyAnswer.findMany({
    where: { coupleId },
    orderBy: { createdAt: "desc" },
    take: 120,
    select: { createdAt: true, userId: true },
  });

  if (answers.length === 0) return 0;

  const byDay = new Map<string, Set<string>>();
  for (const a of answers) {
    const key = a.createdAt.toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, new Set());
    byDay.get(key)!.add(a.userId);
  }

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    const answeredBoth = (byDay.get(key)?.size ?? 0) >= 2;
    if (!answeredBoth) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}