"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { DateCategory } from "@/generated/prisma";


async function requireCoupleId(): Promise<{ coupleId: string; userId: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");

  const couple = await prisma.couple.findFirst({
    where: {
      OR: [{ partnerOneId: session.user.id }, { partnerTwoId: session.user.id }],
    },
    select: { id: true },
  });
  if (!couple) throw new Error("No couple connected yet");

  return { coupleId: couple.id, userId: session.user.id };
}

export async function getRandomDateIdea(category: DateCategory | "ANY") {
  const where = category === "ANY" ? {} : { category };
  const count = await prisma.dateIdea.count({ where });
  if (count === 0) return null;

  const skip = Math.floor(Math.random() * count);
  const [idea] = await prisma.dateIdea.findMany({ where, take: 1, skip });
  return idea ?? null;
}

type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveDateIdea(dateIdeaId: string): Promise<ActionResult> {
  const { coupleId, userId } = await requireCoupleId();

  await prisma.savedDateIdea.upsert({
    where: { dateIdeaId_coupleId: { dateIdeaId, coupleId } },
    create: { dateIdeaId, coupleId, savedById: userId },
    update: {},
  });

  revalidatePath("/dates");
  return { ok: true };
}

export async function unsaveDateIdea(dateIdeaId: string): Promise<ActionResult> {
  const { coupleId } = await requireCoupleId();

  await prisma.savedDateIdea.deleteMany({
    where: { dateIdeaId, coupleId },
  });

  revalidatePath("/dates");
  return { ok: true };
}

export async function getSavedDateIdeas() {
  const { coupleId } = await requireCoupleId();

  return prisma.savedDateIdea.findMany({
    where: { coupleId },
    orderBy: { createdAt: "desc" },
    include: { dateIdea: true },
  });
}