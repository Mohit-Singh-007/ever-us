import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCoupleForUser } from "@/lib/actions/couple";
import { getJournalEntries } from "@/lib/actions/journal";

import { BookOpen, Heart } from "lucide-react";
import Link from "next/link";
import { NewJournalEntryDialog } from "@/components/journal/NewJournalEntryDialog";
import { JournalSearch } from "@/components/journal/JournalSearch";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { JournalPagination } from "@/components/journal/JournalPagination";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const couple = await getCoupleForUser(session.user.id);
  if (!couple) return <NoPartnerEmptyState />;

  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = q?.trim() ?? "";

  const { entries, totalPages } = await getJournalEntries({ page, search });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono mb-2 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
            shared journal
          </p>
          <h1 className="font-display text-2xl md:text-3xl">
            The story you're both writing.
          </h1>
        </div>
        <NewJournalEntryDialog />
      </div>

      <div className="mb-6">
        <JournalSearch />
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#2B2320]/15 p-12 text-center">
          <BookOpen className="h-6 w-6 text-[#2B2320]/40" strokeWidth={1.75} />
          <p className="font-display text-lg">
            {search ? "No entries match your search." : "Nothing written yet."}
          </p>
          {!search && (
            <p className="max-w-xs text-sm text-[#2B2320]/55">
              The first entry starts your shared story.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {entries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              currentUserId={session.user.id}
            />
          ))}
        </div>
      )}

      <JournalPagination page={page} totalPages={totalPages} />
    </div>
  );
}

function NoPartnerEmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
        <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
      </div>
      <h1 className="font-display mb-2 text-2xl">This journal is shared.</h1>
      <p className="mb-7 text-sm leading-relaxed text-[#2B2320]/60">
        Connect with your partner to start writing entries together.
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
