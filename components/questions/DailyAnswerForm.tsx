"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitDailyAnswer } from "@/lib/actions/questions";

export function DailyAnswerForm({
  existingAnswer,
}: {
  existingAnswer: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(existingAnswer ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitDailyAnswer(value);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="Take your time..."
        disabled={isPending}
      />
      {error && <p className="text-xs text-[#C4685A]">{error}</p>}
      <Button
        type="submit"
        disabled={isPending || !value.trim()}
        className="self-start rounded-full bg-[#2B2320] px-6 text-[#FBF3EF] hover:bg-[#2B2320]/90"
      >
        {isPending
          ? "Saving…"
          : existingAnswer
            ? "Update answer"
            : "Submit answer"}
      </Button>
    </form>
  );
}
