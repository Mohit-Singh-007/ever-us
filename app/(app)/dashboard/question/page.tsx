import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCoupleForUser } from "@/lib/actions/couple";

import { Heart, Lock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getDailyQuestionHistory, getDailyQuestionState } from "@/lib/actions/questions";
import { DailyAnswerForm } from "@/components/questions/DailyAnswerForm";

export default async function DailyQuestionPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const couple = await getCoupleForUser(session.user.id);
  if (!couple) return <NoPartnerEmptyState />;

  const state = await getDailyQuestionState();
  const history = await getDailyQuestionHistory();

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <p className="font-mono mb-2 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          {format(new Date(state.date), "EEEE, MMMM d")}
        </p>
        <h1 className="font-display text-2xl italic leading-snug md:text-3xl">
          "{state.prompt}"
        </h1>
      </div>

      <div className="rounded-3xl border border-[#2B2320]/10 bg-white/70 p-7 md:p-9">
        {state.myAnswer === null ? (
          <DailyAnswerForm existingAnswer={null} />
        ) : !state.bothAnswered ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2B2320]/5">
              <Lock className="h-4 w-4 text-[#2B2320]/40" strokeWidth={1.75} />
            </div>
            <p className="font-display text-lg">Your answer is in.</p>
            <p className="max-w-xs text-sm text-[#2B2320]/55">
              {state.partnerName}'s answer will unlock here once they've
              answered too.
            </p>
            <details className="mt-2 w-full text-left">
              <summary className="cursor-pointer text-xs text-[#C4685A]">
                Edit your answer
              </summary>
              <div className="mt-3">
                <DailyAnswerForm existingAnswer={state.myAnswer} />
              </div>
            </details>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnswerBlock label="You" answer={state.myAnswer} />
            <div className="h-px bg-[#2B2320]/8" />
            <AnswerBlock
              label={state.partnerName}
              answer={state.partnerAnswer!}
            />
          </div>
        )}
      </div>

      {history.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display mb-4 text-xl">Past questions</h2>
          <div className="flex flex-col gap-4">
            {history.map((h) => (
              <div
                key={h.date}
                className="rounded-2xl border border-[#2B2320]/8 bg-white/50 p-5"
              >
                <p className="font-mono mb-2 text-[10px] uppercase tracking-wide text-[#2B2320]/40">
                  {format(new Date(h.date), "MMMM d")}
                </p>
                <p className="font-display mb-3 text-sm italic text-[#2B2320]/80">
                  "{h.prompt}"
                </p>
                <AnswerBlock label="You" answer={h.myAnswer} compact />
                <AnswerBlock label="Them" answer={h.partnerAnswer} compact />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AnswerBlock({
  label,
  answer,
  compact,
}: {
  label: string;
  answer: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "mt-2" : ""}>
      <p className="font-mono mb-1 text-[10px] uppercase tracking-wide text-[#8A9A7E]">
        {label}
      </p>
      <p
        className={
          compact ? "text-sm text-[#2B2320]/75" : "text-base text-[#2B2320]"
        }
      >
        {answer}
      </p>
    </div>
  );
}

function NoPartnerEmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
        <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
      </div>
      <h1 className="font-display mb-2 text-2xl">This question is for two.</h1>
      <p className="mb-7 text-sm leading-relaxed text-[#2B2320]/60">
        Connect with your partner to start answering daily questions together.
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
