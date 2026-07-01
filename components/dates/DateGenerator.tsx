"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, RefreshCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRandomDateIdea, saveDateIdea } from "@/lib/actions/date-ideas";

import { cn } from "@/lib/utils";
import { DATE_CATEGORIES, DATE_CATEGORY_LABELS } from "@/utils/date-ideas";

type Idea = {
  id: string;
  title: string;
  description: string | null;
  category: string;
};

export function DateGenerator({ savedIds }: { savedIds: Set<string> }) {
  const router = useRouter();
  const [category, setCategory] = useState<string>("ANY");
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isPending, startTransition] = useTransition();
  const [notFound, setNotFound] = useState(false);

  const isSaved = idea ? savedIds.has(idea.id) : false;

  function handleGenerate() {
    setNotFound(false);
    startTransition(async () => {
      const result = await getRandomDateIdea(category as never);
      if (result) {
        setIdea(result);
      } else {
        setIdea(null);
        setNotFound(true);
      }
    });
  }

  function handleSave() {
    if (!idea) return;
    startTransition(async () => {
      await saveDateIdea(idea.id);
      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl border border-[#2B2320]/10 bg-white/70 p-7 md:p-9">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          need an idea?
        </p>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any category</SelectItem>
            {DATE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {DATE_CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {idea ? (
        <div className="mb-6">
          <span className="font-mono mb-3 inline-block rounded-full bg-[#2B2320]/6 px-3 py-1 text-[10px] uppercase tracking-wide text-[#2B2320]/60">
            {
              DATE_CATEGORY_LABELS[
                idea.category as keyof typeof DATE_CATEGORY_LABELS
              ]
            }
          </span>
          <p className="font-display text-xl leading-snug md:text-2xl">
            {idea.title}
          </p>
        </div>
      ) : notFound ? (
        <p className="mb-6 text-sm text-[#2B2320]/50">
          No ideas in that category yet.
        </p>
      ) : (
        <p className="mb-6 text-sm text-[#2B2320]/50">
          Pick a category (or leave it open) and generate a suggestion.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="gap-2 rounded-full bg-[#2B2320] text-[#FBF3EF] hover:bg-[#2B2320]/90"
        >
          {idea ? (
            <>
              <RefreshCw className="h-4 w-4" /> Try another
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate an idea
            </>
          )}
        </Button>

        {idea && (
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isPending || isSaved}
            className="gap-2 rounded-full"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isSaved && "fill-[#C4685A] text-[#C4685A]",
              )}
            />
            {isSaved ? "Saved" : "Save this idea"}
          </Button>
        )}
      </div>
    </div>
  );
}
