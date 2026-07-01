"use server";

import prisma from "../prisma";

const partnerSelect = {
  id: true,
  name: true,
  image: true,
} as const;

export async function getCoupleForUser(userId: string) {
  const couple = await prisma.couple.findFirst({
    where: {
      OR: [{ partnerOneId: userId }, { partnerTwoId: userId }],
    },
    include: {
      partnerOne: { select: partnerSelect },
      partnerTwo: { select: partnerSelect },
    },
  });

  return couple;
}

export type CoupleWithPartners = Awaited<ReturnType<typeof getCoupleForUser>>;