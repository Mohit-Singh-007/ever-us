import { Heart } from "lucide-react";

type Couple = {
  id: string;
  anniversaryDate: Date | null;
  partnerOneId: string;
  partnerTwoId: string;
  partnerOne: { name: string; image?: string | null };
  partnerTwo: { name: string; image?: string | null };
} | null;

export function PartnerBadge({
  couple,
  currentUserId,
}: {
  couple: Couple;
  currentUserId: string;
}) {
  if (!couple) {
    return (
      <span className="font-mono text-xs uppercase tracking-wide text-[#2B2320]/40">
        not connected
      </span>
    );
  }

  const partner =
    couple.partnerOneId === currentUserId
      ? couple.partnerTwo
      : couple.partnerOne;

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5">
      <Heart className="h-3.5 w-3.5 fill-[#C4685A] text-[#C4685A]" />
      <span className="text-xs text-[#2B2320]/70">with {partner.name}</span>
    </div>
  );
}
