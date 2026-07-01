"use client";

import { useTransition } from "react";
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

  function handleToggle() {
    startTransition(async () => {
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
        isPending && "opacity-50",
      )}
    >
      <Checkbox
        checked={item.completed}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="mt-0.5"
      />
      <div className="flex-1">
        <p
          className={cn(
            "text-sm text-[#2B2320]",
            item.completed && "text-[#2B2320]/40 line-through",
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
