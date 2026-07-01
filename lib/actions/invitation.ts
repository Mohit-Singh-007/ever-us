"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import prisma from "../prisma";

const INVITE_TTL_DAYS = 7;

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not authenticated");
  return session;
}

function generateCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/**
 * Returns the sender's current pending invitation if one exists,
 * otherwise creates a new one. Keeps a user from spamming codes.
 */
export async function getOrCreateInvitation() {
  const session = await requireSession();
  const userId = session.user.id;

  const existingCouple = await prisma.couple.findFirst({
    where: { OR: [{ partnerOneId: userId }, { partnerTwoId: userId }] },
  });
  if (existingCouple) {
    throw new Error("You're already connected with a partner.");
  }

  const existing = await prisma.invitation.findFirst({
    where: { senderId: userId, status: "PENDING", expiresAt: { gt: new Date() } },
  });
  if (existing) return existing;

  const invitation = await prisma.invitation.create({
    data: {
      code: generateCode(),
      senderId: userId,
      expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return invitation;
}

export async function revokeInvitation(invitationId: string) {
  const session = await requireSession();

  await prisma.invitation.updateMany({
    where: { id: invitationId, senderId: session.user.id, status: "PENDING" },
    data: { status: "REVOKED" },
  });

  revalidatePath("/invite");
}

type AcceptInvitationResult =
  | { ok: true; coupleId: string }
  | { ok: false; error: string };

export async function acceptInvitation(code: string): Promise<AcceptInvitationResult> {
  const session = await requireSession();
  const userId = session.user.id;

  const invitation = await prisma.invitation.findUnique({
    where: { code },
  });

  if (!invitation) return { ok: false, error: "That invite code doesn't exist." };
  if (invitation.status === "REVOKED")
    return { ok: false, error: "This invite has been revoked." };
  if (invitation.status === "ACCEPTED")
    return { ok: false, error: "This invite has already been used." };
  if (invitation.expiresAt < new Date())
    return { ok: false, error: "This invite has expired." };
  if (invitation.senderId === userId)
    return { ok: false, error: "You can't accept your own invite." };

  const [senderAlreadyCoupled, userAlreadyCoupled] = await Promise.all([
    prisma.couple.findFirst({
      where: { OR: [{ partnerOneId: invitation.senderId }, { partnerTwoId: invitation.senderId }] },
    }),
    prisma.couple.findFirst({
      where: { OR: [{ partnerOneId: userId }, { partnerTwoId: userId }] },
    }),
  ]);

  if (senderAlreadyCoupled)
    return { ok: false, error: "This person already connected with someone else." };
  if (userAlreadyCoupled)
    return { ok: false, error: "You're already connected with a partner." };

  const couple = await prisma.$transaction(async (tx) => {
    const newCouple = await tx.couple.create({
      data: {
        partnerOneId: invitation.senderId,
        partnerTwoId: userId,
      },
    });

    await tx.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED", coupleId: newCouple.id, acceptedAt: new Date() },
    });

    await tx.notification.create({
      data: {
        userId: invitation.senderId,
        type: "PARTNER_JOINED",
        title: "Your partner joined!",
        body: `${session.user.name} accepted your invite.`,
        link: "/dashboard",
      },
    });

    return newCouple;
  });

  revalidatePath("/dashboard");
  return { ok: true, coupleId: couple.id };
}

export async function getInvitationByCode(code: string) {
  return prisma.invitation.findUnique({
    where: { code },
    include: { sender: { select: { name: true, image: true } } },
  });
}