"use server";


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { MemoryFormValues, memorySchema } from "@/zod/memory-validation";


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

export async function createMemory(values: MemoryFormValues): Promise<ActionResult> {
  const parsed = memorySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid memory." };
  }
  const { userId, coupleId } = await requireCoupleContext();

  const memory = await prisma.memory.create({
    data: {
      coupleId,
      uploadedById: userId,
      imageUrl: parsed.data.imageUrl,
      caption: parsed.data.caption || null,
      location: parsed.data.location || null,
      date: new Date(parsed.data.date),
    },
  });

  const couple = await prisma.couple.findUnique({
    where: { id: coupleId },
    select: { partnerOneId: true, partnerTwoId: true },
  });
  if (couple) {
    const partnerId = couple.partnerOneId === userId ? couple.partnerTwoId : couple.partnerOneId;
    await prisma.notification.create({
      data: {
        userId: partnerId,
        type: "MEMORY_UPLOADED",
        title: "New memory added",
        body: parsed.data.caption || "A new photo was just added to your timeline.",
        link: "/memories",
      },
    });
  }

  revalidatePath("/memories");
  revalidatePath("/dashboard");
  return { ok: true, id: memory.id };
}

export async function updateMemory(
  memoryId: string,
  values: MemoryFormValues,
): Promise<ActionResult> {
  const parsed = memorySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid memory." };
  }
  const { coupleId } = await requireCoupleContext();

  const result = await prisma.memory.updateMany({
    where: { id: memoryId, coupleId },
    data: {
      imageUrl: parsed.data.imageUrl,
      caption: parsed.data.caption || null,
      location: parsed.data.location || null,
      date: new Date(parsed.data.date),
    },
  });

  if (result.count === 0) return { ok: false, error: "Memory not found." };

  revalidatePath("/memories");
  return { ok: true };
}

export async function deleteMemory(memoryId: string): Promise<ActionResult> {
  const { coupleId } = await requireCoupleContext();

  await prisma.memory.deleteMany({ where: { id: memoryId, coupleId } });

  revalidatePath("/memories");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function getMemories({ search = "" }: { search?: string } = {}) {
  const { coupleId } = await requireCoupleContext();

  const where = {
    coupleId,
    ...(search
      ? {
          OR: [
            { caption: { contains: search, mode: "insensitive" as const } },
            { location: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  return prisma.memory.findMany({
    where,
    orderBy: { date: "desc" },
    include: { uploadedBy: { select: { name: true } } },
  });
}