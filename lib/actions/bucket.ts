"use server";


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { BucketItemFormValues, bucketItemSchema } from "@/zod/category-bucket-schema";


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

type ActionResult = { ok: true } | { ok: false; error: string };

export async function createBucketItem(
  values: BucketItemFormValues,
): Promise<ActionResult> {
  const parsed = bucketItemSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please fill in a title and category." };
  }

  const { coupleId, userId } = await requireCoupleId();

  await prisma.bucketItem.create({
    data: {
      coupleId,
      createdById: userId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category,
    },
  });

  revalidatePath("/bucket-list");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function toggleBucketItem(itemId: string): Promise<ActionResult> {
  const { coupleId } = await requireCoupleId();

  const item = await prisma.bucketItem.findFirst({
    where: { id: itemId, coupleId },
  });
  if (!item) return { ok: false, error: "Item not found." };

  await prisma.bucketItem.update({
    where: { id: itemId },
    data: {
      completed: !item.completed,
      completedAt: !item.completed ? new Date() : null,
    },
  });

  revalidatePath("/bucket-list");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteBucketItem(itemId: string): Promise<ActionResult> {
  const { coupleId } = await requireCoupleId();

  await prisma.bucketItem.deleteMany({
    where: { id: itemId, coupleId },
  });

  revalidatePath("/bucket-list");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function getBucketItems() {
  const { coupleId } = await requireCoupleId();

  return prisma.bucketItem.findMany({
    where: { coupleId },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    include: { createdBy: { select: { name: true } } },
  });
}