import { GoogleSignInButton } from "@/components/login/GoogleSignInButton";
import { auth } from "@/lib/auth";
import { Heart } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign in — Couple Space",
  description: "Continue with Google to enter your space.",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");
  return (
    <div
      className={` font-body relative flex min-h-svh items-center justify-center overflow-hidden bg-[#FBF3EF] px-6 text-[#2B2320]`}
    >
      {/* ambient stitched thread, echoes landing page signature */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
        preserveAspectRatio="none"
        viewBox="0 0 2 2000"
      >
        <path
          d="M1 0 L1 2000"
          stroke="#C4685A"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>

      <Link
        href="/"
        className="font-display absolute left-6 top-6 text-base italic tracking-tight text-[#2B2320]/70 transition-colors hover:text-[#2B2320] md:left-10 md:top-8"
      >
        couple space
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        {/* two cards settling into one, smaller echo of the hero motif */}
        <div className="relative mx-auto mb-10 h-[92px] w-[150px]">
          <div
            className="absolute left-0 top-0 h-[78px] w-[78px] rotate-[-8deg] rounded-[18px] border border-[#2B2320]/10 bg-linear-to-br from-[#F1D9BE] to-[#E7B7A4] shadow-[0_12px_28px_-14px_rgba(43,35,32,0.35)]"
            style={{ animation: "settle-left 700ms ease-out both" }}
          />
          <div
            className="absolute right-0 top-3 h-[78px] w-[78px] rotate-[8deg] rounded-[18px] border border-[#2B2320]/10 bg-linear-to-br from-[#CBD6BE] to-[#8A9A7E] shadow-[0_12px_28px_-14px_rgba(43,35,32,0.35)]"
            style={{ animation: "settle-right 700ms ease-out both" }}
          />
          <div
            className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FBF3EF] shadow-md"
            style={{ animation: "pop-in 700ms 400ms ease-out both" }}
          >
            <Heart className="h-3.5 w-3.5 fill-[#C4685A] text-[#C4685A]" />
          </div>
        </div>

        <div className="text-center">
          <p className="font-mono mb-3 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
            welcome back
          </p>
          <h1 className="font-display mb-2 text-3xl leading-tight tracking-tight">
            Your space is waiting.
          </h1>
          <p className="mb-9 text-sm leading-relaxed text-[#2B2320]/60">
            Sign in with the Google account you started with — everything picks
            up right where you left it.
          </p>
        </div>

        <Suspense fallback={<ButtonSkeleton />}>
          <GoogleSignInButton />
        </Suspense>

        <p className="mt-8 text-center text-xs leading-relaxed text-[#2B2320]/40">
          No passwords, no separate accounts to remember —
          <br />
          just the Google sign-in you already trust.
        </p>
      </div>
    </div>
  );
}

function ButtonSkeleton() {
  return (
    <div className="h-[50px] w-full animate-pulse rounded-full border border-[#2B2320]/10 bg-white" />
  );
}
