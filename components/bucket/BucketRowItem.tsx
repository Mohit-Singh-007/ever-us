"use client";

import { useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleBucketItem, deleteBucketItem } from "@/lib/actions/bucket";
import { cn } from "@/lib/utils";

export function BucketRowItem({
  item,
}: {
  item: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdBy: { name: string };
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    item.completed,
  );

  function handleToggle() {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      await toggleBucketItem(item.id);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteBucketItem(item.id);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-[#2B2320]/8 bg-white/60 p-4 transition-opacity",
        isPending && "opacity-70",
      )}
    >
      <Checkbox
        checked={optimisticCompleted}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="mt-0.5"
      />
      <div className="flex-1">
        <p
          className={cn(
            "text-sm text-[#2B2320]",
            optimisticCompleted && "text-[#2B2320]/40 line-through",
          )}
        >
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-xs text-[#2B2320]/50">{item.description}</p>
        )}
        <p className="mt-1 text-[10px] uppercase tracking-wide text-[#2B2320]/35">
          added by {item.createdBy.name}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete item"
        className="opacity-0 transition-opacity hover:text-[#C4685A] group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
