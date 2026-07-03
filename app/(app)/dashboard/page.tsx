import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCoupleForUser } from "@/lib/actions/couple";
import { getDashboardData } from "@/lib/actions/dashboard"; // implement: returns stats/memories/question for a couple
import { ArrowRight, Heart, Image as ImageIcon } from "lucide-react";
import { RecentMemoriesGrid } from "@/components/dashboard/RecentMemoryGrid";

export default async function DashboardHomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const couple = await getCoupleForUser(session!.user.id);

  if (!couple) {
    return <NoPartnerEmptyState />;
  }

  const data = await getDashboardData(couple.id, session!.user.id);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <section className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          {data.relationshipDurationLabel}
        </p>
        <h1 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
          Welcome back, {data.firstName}.
        </h1>
        {data.anniversaryCountdownLabel && (
          <p className="text-sm text-[#2B2320]/60">
            {data.anniversaryCountdownLabel}
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#2B2320]/10 bg-[#2B2320]/10 sm:grid-cols-4">
        <Stat label="Memories" value={data.stats.memoryCount} />
        <Stat label="Journal entries" value={data.stats.journalCount} />
        <Stat
          label="Bucket list"
          value={`${data.stats.bucketCompletionPct}%`}
        />
        <Stat label="Streak" value={`${data.stats.streakDays}d`} />
      </section>

      <DailyQuestionCard question={data.dailyQuestion} />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">Recent memories</h2>
          <Link
            href="/memories"
            className="flex items-center gap-1 text-xs text-[#C4685A] hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {data.recentMemories.length === 0 ? (
          <EmptyCard
            icon={ImageIcon}
            title="No memories yet"
            body="The first photo you add here starts the timeline."
            cta={{ href: "/memories", label: "Add a memory" }}
          />
        ) : (
          <RecentMemoriesGrid
            memories={data.recentMemories}
            currentUserName={session!.user.name}
          />
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#FBF3EF] p-5">
      <p className="font-display text-2xl">{value}</p>
      <p className="font-mono mt-1 text-[10px] uppercase tracking-wide text-[#2B2320]/45">
        {label}
      </p>
    </div>
  );
}

function DailyQuestionCard({
  question,
}: {
  question: {
    prompt: string;
    userAnswered: boolean;
    partnerAnswered: boolean;
  } | null;
}) {
  if (!question) return null;

  return (
    <Link
      href="/dashboard/question"
      className="block rounded-3xl border border-[#2B2320]/10 bg-white/70 p-7 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(43,35,32,0.3)] md:p-9"
    >
      <p className="font-mono mb-3 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
        today's question
      </p>
      <p className="font-display mb-5 text-xl italic leading-snug md:text-2xl">
        "{question.prompt}"
      </p>
      <div className="flex items-center gap-3 text-xs text-[#2B2320]/50">
        <StatusDot filled={question.userAnswered} /> you
        <StatusDot filled={question.partnerAnswered} /> your partner
      </div>
    </Link>
  );
}

function StatusDot({ filled }: { filled: boolean }) {
  return (
    <span
      className={`h-2 w-2 rounded-full ${
        filled ? "bg-[#C4685A]" : "bg-[#2B2320]/15"
      }`}
    />
  );
}

function EmptyCard({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: typeof ImageIcon;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-[#2B2320]/15 p-8">
      <Icon className="h-5 w-5 text-[#2B2320]/40" strokeWidth={1.75} />
      <div>
        <p className="font-display text-base">{title}</p>
        <p className="mt-1 text-sm text-[#2B2320]/55">{body}</p>
      </div>
      <Link
        href={cta.href}
        className="mt-1 flex items-center gap-1 text-xs font-medium text-[#C4685A] hover:underline"
      >
        {cta.label} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function NoPartnerEmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
        <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
      </div>
      <h1 className="font-display mb-2 text-2xl">This space is half-full.</h1>
      <p className="mb-7 text-sm leading-relaxed text-[#2B2320]/60">
        Everything here — the timeline, the journal, the daily question — is
        built for two. Invite your partner to start filling it in.
      </p>
      <Link
        href="/invite"
        className="rounded-full bg-[#2B2320] px-6 py-3 text-sm font-medium text-[#FBF3EF] transition-transform hover:-translate-y-0.5"
      >
        Invite your partner
      </Link>
    </div>
  );
}
