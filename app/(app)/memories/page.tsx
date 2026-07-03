import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCoupleForUser } from "@/lib/actions/couple";
import { getMemories } from "@/lib/actions/memory";
import { Image as ImageIcon, Heart } from "lucide-react";
import Link from "next/link";
import { AddMemoryDialog } from "@/components/memories/AddMemoryDialog";
import { MemorySearch } from "@/components/memories/MemorySearch";
import { MemoryTimeline } from "@/components/memories/MemoryTimeline";

export default async function MemoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const couple = await getCoupleForUser(session.user.id);
  if (!couple) return <NoPartnerEmptyState />;

  const { q } = await searchParams;
  const search = q?.trim() ?? "";
  const memories = await getMemories({ search });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono mb-2 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
            memory timeline
          </p>
          <h1 className="font-display text-2xl md:text-3xl">
            Every moment, in order.
          </h1>
        </div>
        <AddMemoryDialog />
      </div>

      <div className="mb-8">
        <MemorySearch />
      </div>

      {memories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#2B2320]/15 p-16 text-center">
          <ImageIcon className="h-6 w-6 text-[#2B2320]/40" strokeWidth={1.75} />
          <p className="font-display text-lg">
            {search
              ? "No memories match your search."
              : "The timeline is empty."}
          </p>
          {!search && (
            <p className="max-w-xs text-sm text-[#2B2320]/55">
              The first photo you add here starts the story.
            </p>
          )}
        </div>
      ) : (
        <MemoryTimeline
          memories={memories}
          currentUserName={session.user.name}
        />
      )}
    </div>
  );
}

function NoPartnerEmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
        <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
      </div>
      <h1 className="font-display mb-2 text-2xl">
        The timeline is built for two.
      </h1>
      <p className="mb-7 text-sm leading-relaxed text-[#2B2320]/60">
        Connect with your partner to start your shared timeline.
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
