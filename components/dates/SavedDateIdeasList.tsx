"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { unsaveDateIdea } from "@/lib/actions/date-ideas";
import { DATE_CATEGORY_LABELS } from "@/utils/date-ideas";

type SavedIdea = {
  dateIdeaId: string;
  dateIdea: { title: string; category: string };
};

export function SavedDateIdeasList({ saved }: { saved: SavedIdea[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove(dateIdeaId: string) {
    startTransition(async () => {
      await unsaveDateIdea(dateIdeaId);
      router.refresh();
    });
  }

  if (saved.length === 0) {
    return (
      <p className="text-sm text-[#2B2320]/50">
        Ideas you save will show up here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {saved.map(({ dateIdeaId, dateIdea }) => (
        <div
          key={dateIdeaId}
          className="group flex items-center justify-between gap-3 rounded-xl border border-[#2B2320]/8 bg-white/60 p-4"
        >
          <div>
            <p className="text-sm text-[#2B2320]">{dateIdea.title}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#2B2320]/40">
              {
                DATE_CATEGORY_LABELS[
                  dateIdea.category as keyof typeof DATE_CATEGORY_LABELS
                ]
              }
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleRemove(dateIdeaId)}
            disabled={isPending}
            aria-label="Remove from saved"
            className="text-[#2B2320]/30 opacity-0 transition-opacity hover:text-[#C4685A] group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
