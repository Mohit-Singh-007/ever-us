"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { acceptInvitation } from "@/lib/actions/invitation";

export function AcceptInviteButton({ code }: { code: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAccept() {
    setError(null);
    startTransition(async () => {
      const result = await acceptInvitation(code);
      if (result.ok) {
        router.push("/dashboard");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAccept}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-[#2B2320] px-6 py-3 text-sm font-medium text-[#FBF3EF] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isPending ? "Connecting…" : "Accept invite"}
      </button>
      {error && <p className="mt-4 text-xs text-[#C4685A]">{error}</p>}
    </div>
  );
}
