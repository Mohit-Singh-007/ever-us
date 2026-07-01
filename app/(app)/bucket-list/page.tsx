import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCoupleForUser } from "@/lib/actions/couple";
import { getBucketItems } from "@/lib/actions/bucket";
import {
  BUCKET_CATEGORIES,
  BUCKET_CATEGORY_LABELS,
} from "@/zod/category-bucket-schema";

import { Progress } from "@/components/ui/progress";
import { ListChecks, Heart } from "lucide-react";
import Link from "next/link";
import { AddBucketItemDialog } from "@/components/bucket/AddBucketItemDialog";
import { BucketRowItem } from "@/components/bucket/BucketRowItem";

export default async function BucketListPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const couple = await getCoupleForUser(session.user.id);
  if (!couple) return <NoPartnerEmptyState />;

  const items = await getBucketItems();
  const completedCount = items.filter((i) => i.completed).length;
  const pct =
    items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono mb-2 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
            bucket list
          </p>
          <h1 className="font-display text-2xl md:text-3xl">
            Things you want to do together.
          </h1>
        </div>
        <AddBucketItemDialog />
      </div>

      {items.length > 0 && (
        <div className="mb-8 rounded-2xl border border-[#2B2320]/10 bg-white/60 p-5">
          <div className="mb-2 flex items-center justify-between text-xs text-[#2B2320]/60">
            <span>
              {completedCount} of {items.length} complete
            </span>
            <span className="font-medium text-[#C4685A]">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#2B2320]/15 p-12 text-center">
          <ListChecks
            className="h-6 w-6 text-[#2B2320]/40"
            strokeWidth={1.75}
          />
          <p className="font-display text-lg">The list is empty.</p>
          <p className="max-w-xs text-sm text-[#2B2320]/55">
            Add the trip, the restaurant, the thing you keep talking about.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {BUCKET_CATEGORIES.map((category) => {
            const categoryItems = items.filter((i) => i.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <section key={category}>
                <h2 className="font-mono mb-3 text-xs uppercase tracking-wide text-[#8A9A7E]">
                  {BUCKET_CATEGORY_LABELS[category]}{" "}
                  <span className="text-[#2B2320]/30">
                    ({categoryItems.filter((i) => i.completed).length}/
                    {categoryItems.length})
                  </span>
                </h2>
                <div className="flex flex-col gap-2">
                  {categoryItems.map((item) => (
                    <BucketRowItem key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
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
        This list is built for two.
      </h1>
      <p className="mb-7 text-sm leading-relaxed text-[#2B2320]/60">
        Connect with your partner to start your shared bucket list.
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
