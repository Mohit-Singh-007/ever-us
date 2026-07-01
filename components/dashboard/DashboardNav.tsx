"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Image as ImageIcon,
  BookOpen,
  ListChecks,
  Sparkles,
  UserRound,
  Heart,
  MessageCircleQuestion,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { SignOutButton } from "../login/SignOutButton";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  {
    href: "/dashboard/question",
    label: "Daily question",
    icon: MessageCircleQuestion,
  },
  { href: "/memories", label: "Memories", icon: ImageIcon },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/bucket-list", label: "Bucket list", icon: ListChecks },
  { href: "/dates", label: "Date ideas", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/partner", label: "Partner", icon: Heart },
] as const;

export function DashboardNav({
  user,
  hasPartner,
}: {
  user: { name: string; image?: string };
  hasPartner: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* mobile top bar */}
      <div className="flex items-center justify-between border-b border-[#2B2320]/8 bg-[#FBF3EF] px-6 py-4 md:hidden">
        <span className="font-display text-lg italic">couple space</span>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="rounded-full p-2 hover:bg-[#2B2320]/5"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } w-full shrink-0 border-b border-[#2B2320]/8 bg-[#FBF3EF] px-4 py-4 md:block md:w-64 md:border-b-0 md:border-r md:px-5 md:py-8`}
      >
        <Link
          href="/dashboard"
          className="font-display mb-8 hidden px-2 text-lg italic tracking-tight md:block"
        >
          couple space
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#2B2320] text-[#FBF3EF]"
                    : "text-[#2B2320]/70 hover:bg-[#2B2320]/6 hover:text-[#2B2320]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        {!hasPartner && (
          <Link
            href="/invite"
            className="mt-6 block rounded-xl border border-dashed border-[#C4685A]/40 px-3 py-3 text-xs leading-relaxed text-[#C4685A]"
          >
            You haven't connected with a partner yet. Invite them →
          </Link>
        )}

        <div className="mt-8 flex flex-col gap-3 px-2 md:absolute md:bottom-8 md:left-5 md:right-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#E7B7A4] text-xs font-medium">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-xs text-[#2B2320]/60">{user.name}</span>
          </div>
          <SignOutButton className="pl-11" />
        </div>
      </aside>
    </>
  );
}
