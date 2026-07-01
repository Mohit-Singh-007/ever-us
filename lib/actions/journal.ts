"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { JournalEntryFormValues, journalEntrySchema } from "@/zod/journal-schema";
import { sanitizeJournalHtml } from "../sanitize-html";


const PAGE_SIZE = 6;

async function requireCoupleContext() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  const couple = await prisma.couple.findFirst({
    where: {
      OR: [{ partnerOneId: session.user.id }, { partnerTwoId: session.user.id }],
    },
    select: { id: true },
  });
  if (!couple) throw new Error("No couple connected yet");

  return { userId: session.user.id, coupleId: couple.id };
}

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createJournalEntry(
  values: JournalEntryFormValues,
): Promise<ActionResult> {
  const parsed = journalEntrySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid entry." };
  }
  const { userId, coupleId } = await requireCoupleContext();

  const entry = await prisma.journal.create({
    data: {
      coupleId,
      authorId: userId,
      title: parsed.data.title || null,
      content: sanitizeJournalHtml(parsed.data.content),
      mood: parsed.data.mood || null,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  await notifyPartner(coupleId, userId, "NEW_JOURNAL", "New journal entry", `${entry.title || "A new entry"} was just posted.`);

  revalidatePath("/journal");
  revalidatePath("/dashboard");
  return { ok: true, id: entry.id };
}

export async function updateJournalEntry(
  entryId: string,
  values: JournalEntryFormValues,
): Promise<ActionResult> {
  const parsed = journalEntrySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid entry." };
  }
  const { userId, coupleId } = await requireCoupleContext();

  const result = await prisma.journal.updateMany({
    where: { id: entryId, coupleId, authorId: userId },
    data: {
      title: parsed.data.title || null,
      content: sanitizeJournalHtml(parsed.data.content),
      mood: parsed.data.mood || null,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  if (result.count === 0) return { ok: false, error: "Entry not found." };

  revalidatePath("/journal");
  return { ok: true };
}

export async function deleteJournalEntry(entryId: string): Promise<ActionResult> {
  const { userId, coupleId } = await requireCoupleContext();

  await prisma.journal.deleteMany({
    where: { id: entryId, coupleId, authorId: userId },
  });

  revalidatePath("/journal");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function getJournalEntries({
  page = 1,
  search = "",
}: {
  page?: number;
  search?: string;
}) {
  const { coupleId } = await requireCoupleContext();

  const where = {
    coupleId,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [entries, total] = await Promise.all([
    prisma.journal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        author: { select: { id: true, name: true, image: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { name: true } } },
        },
        reactions: true,
      },
    }),
    prisma.journal.count({ where }),
  ]);

  return { entries, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function addJournalComment(
  journalId: string,
  content: string,
): Promise<ActionResult> {
  const trimmed = content.trim();
  if (!trimmed) return { ok: false, error: "Comment can't be empty." };

  const { userId, coupleId } = await requireCoupleContext();

  const entry = await prisma.journal.findFirst({ where: { id: journalId, coupleId } });
  if (!entry) return { ok: false, error: "Entry not found." };

  await prisma.journalComment.create({
    data: { journalId, authorId: userId, content: trimmed },
  });

  revalidatePath("/journal");
  return { ok: true };
}

export async function deleteJournalComment(commentId: string): Promise<ActionResult> {
  const { userId } = await requireCoupleContext();

  await prisma.journalComment.deleteMany({
    where: { id: commentId, authorId: userId },
  });

  revalidatePath("/journal");
  return { ok: true };
}

export async function toggleJournalReaction(
  journalId: string,
  emoji: string,
): Promise<ActionResult> {
  const { userId, coupleId } = await requireCoupleContext();

  const entry = await prisma.journal.findFirst({ where: { id: journalId, coupleId } });
  if (!entry) return { ok: false, error: "Entry not found." };

  const existing = await prisma.journalReaction.findUnique({
    where: { journalId_userId_emoji: { journalId, userId, emoji } },
  });

  if (existing) {
    await prisma.journalReaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.journalReaction.create({ data: { journalId, userId, emoji } });
  }

  revalidatePath("/journal");
  return { ok: true };
}

async function notifyPartner(
  coupleId: string,
  authorId: string,
  type: "NEW_JOURNAL",
  title: string,
  body: string,
) {
  const couple = await prisma.couple.findUnique({
    where: { id: coupleId },
    select: { partnerOneId: true, partnerTwoId: true },
  });
  if (!couple) return;

  const partnerId = couple.partnerOneId === authorId ? couple.partnerTwoId : couple.partnerOneId;

  await prisma.notification.create({
    data: { userId: partnerId, type, title, body, link: "/journal" },
  });
}