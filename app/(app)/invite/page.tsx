import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCoupleForUser } from "@/lib/actions/couple";
import { getOrCreateInvitation } from "@/lib/actions/invitation";

import { Heart } from "lucide-react";
import { InviteCodeCard } from "@/components/dashboard/InviteCodeCard";

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const couple = await getCoupleForUser(session.user.id);
  if (couple) redirect("/dashboard");

  const invitation = await getOrCreateInvitation();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
        <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
      </div>
      <p className="font-mono mb-3 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
        invite your partner
      </p>
      <h1 className="font-display mb-2 text-2xl">Send them this link.</h1>
      <p className="mb-8 text-sm leading-relaxed text-[#2B2320]/60">
        They'll sign in with Google and you'll both land in the same space — no
        separate accounts to set up.
      </p>

      <InviteCodeCard
        code={invitation.code}
        expiresAt={invitation.expiresAt.toISOString()}
      />
    </div>
  );
}
