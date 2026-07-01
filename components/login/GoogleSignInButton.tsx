"use client";

import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
export function GoogleSignInButton() {
  const [isPending, startTransition] = useTransition();

  function handleSignIn() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/login?error=google",
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isPending}
      className="group flex w-full items-center justify-center gap-3 rounded-full border border-[#2B2320]/15 bg-white px-6 py-3.5 text-sm font-medium text-[#2B2320] shadow-[0_10px_30px_-16px_rgba(43,35,32,0.4)] transition-all hover:-translate-y-0.5 hover:border-[#2B2320]/25 hover:shadow-[0_14px_34px_-16px_rgba(43,35,32,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <GoogleMark />
      {isPending ? "Redirecting to Google…" : "Continue with Google"}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.32 0-6.03-2.75-6.03-6.15S8.68 5.86 12 5.86c1.89 0 3.16.8 3.88 1.49l2.65-2.55C16.98 3.24 14.7 2.2 12 2.2 6.98 2.2 2.9 6.28 2.9 11.3s4.08 9.1 9.1 9.1c5.25 0 8.74-3.69 8.74-8.89 0-.6-.07-1.05-.15-1.51H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.24l3.24 2.38c.88-2.07 2.87-3.53 5.16-3.53 1.56 0 2.94.58 4 1.53L18.9 5c-1.66-1.42-3.7-2.28-6.1-2.28-3.98 0-7.4 2.28-9 5.52z"
      />
      <path
        fill="#FBBC05"
        d="M12 20.4c2.6 0 4.78-.86 6.37-2.34l-3.11-2.55c-.86.58-1.98.98-3.26.98-2.5 0-4.62-1.69-5.38-3.96L3.34 15c1.59 3.19 4.9 5.4 8.66 5.4z"
      />
      <path
        fill="#4285F4"
        d="M20.64 11.51c0-.6-.07-1.05-.15-1.51H12v3.96h5.52c-.25 1.3-.99 2.4-2.11 3.14l3.11 2.55c1.82-1.68 2.87-4.15 2.87-8.14z"
      />
    </svg>
  );
}
