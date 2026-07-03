import { cache } from "react";
import prisma from "../prisma";


const partnerSelect = {
  id: true,
  name: true,
  image: true,
} as const;

/**
 * Same dedupe reasoning as session-data.ts — the "is this user connected
 * to a partner" check happens in the layout guard AND again in almost
 * every page for its own empty-state logic. cache() collapses repeat
 * calls with the same userId into one query per request.
 */
export const getCoupleForUser = cache(async (userId: string) => {
  return prisma.couple.findFirst({
    where: {
      OR: [{ partnerOneId: userId }, { partnerTwoId: userId }],
    },
    include: {
      partnerOne: { select: partnerSelect },
      partnerTwo: { select: partnerSelect },
    },
  });
});

export type CoupleWithPartners = Awaited<ReturnType<typeof getCoupleForUser>>;