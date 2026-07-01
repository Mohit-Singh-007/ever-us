"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 text-xs text-[#2B2320]/50 transition-colors hover:text-[#C4685A] disabled:opacity-50",
        className,
      )}
    >
      <LogOut className="h-3.5 w-3.5" />
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
