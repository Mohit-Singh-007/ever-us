import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCoupleForUser } from "@/lib/actions/couple";
import { getSavedDateIdeas } from "@/lib/actions/date-ideas";

import { Heart } from "lucide-react";
import Link from "next/link";
import { DateGenerator } from "@/components/dates/DateGenerator";
import { SavedDateIdeasList } from "@/components/dates/SavedDateIdeasList";

export default async function DatesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const couple = await getCoupleForUser(session.user.id);
  if (!couple) return <NoPartnerEmptyState />;

  const saved = await getSavedDateIdeas();
  const savedIds = new Set(saved.map((s) => s.dateIdeaId));

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="font-mono mb-2 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          date generator
        </p>
        <h1 className="font-display text-2xl md:text-3xl">
          Out of ideas? We've got a few.
        </h1>
      </div>

      <DateGenerator savedIds={savedIds} />

      <section className="mt-10">
        <h2 className="font-display mb-4 text-xl">Saved for later</h2>
        <SavedDateIdeasList saved={saved} />
      </section>
    </div>
  );
}

function NoPartnerEmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
        <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
      </div>
      <h1 className="font-display mb-2 text-2xl">Ideas are better shared.</h1>
      <p className="mb-7 text-sm leading-relaxed text-[#2B2320]/60">
        Connect with your partner to start saving date ideas together.
      </p>
      <Link
        href="/invite"
        className="rounded-full bg-[#2B2320] px-6 py-3 text-sm font-medium text-[#FBF3EF]"
      >
        Invite your partner
      </Link>
    </div>
  );
}
