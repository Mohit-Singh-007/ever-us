import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { PartnerBadge } from "@/components/dashboard/PartnerBadge";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { getCoupleForUser } from "@/lib/actions/couple";
import { getSession } from "@/lib/data/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const couple = await getCoupleForUser(session.user.id);

  return (
    <div className={`font-body min-h-svh bg-[#FBF3EF] text-[#2B2320] md:flex`}>
      <DashboardNav
        user={{
          name: session.user.name,
          image: session.user.image ?? undefined,
        }}
        hasPartner={Boolean(couple)}
      />

      <div className="flex min-h-svh flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#2B2320]/8 bg-white/40 px-6 py-4 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8A9A7E]">
            couple space
          </p>
          <PartnerBadge couple={couple} currentUserId={session.user.id} />
        </header>

        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
