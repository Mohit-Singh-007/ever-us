import { CoupleWithPartners } from "@/lib/actions/couple";

export function getPartner(couple: NonNullable<CoupleWithPartners>, userId: string) {
  return couple.partnerOneId === userId ? couple.partnerTwo : couple.partnerOne;
}