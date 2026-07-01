"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "../prisma";

export async function getPartnerProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const couple = await prisma.couple.findFirst({
    where: {
      OR: [{ partnerOneId: session.user.id }, { partnerTwoId: session.user.id }],
    },
    select: { partnerOneId: true, partnerTwoId: true },
  });

  if (!couple) return null;

  const partnerId =
    couple.partnerOneId === session.user.id
      ? couple.partnerTwoId
      : couple.partnerOneId;

  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
    select: {
      name: true,
      image: true,
      nickname: true,
      bio: true,
      birthday: true,
      favoriteMovie: true,
      favoriteFood: true,
      loveLanguage: true,
      interests: true,
    },
  });

  return partner;
}