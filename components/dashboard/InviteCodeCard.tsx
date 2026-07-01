"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

function formatExpiry(iso: string): string {
  const days = Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return days <= 1 ? "Expires today" : `Expires in ${days} days`;
}

export function InviteCodeCard({
  code,
  expiresAt,
}: {
  code: string;
  expiresAt: string;
}) {
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState(`/invite/${code}`);

  useEffect(() => {
    setInviteUrl(`${window.location.origin}/invite/${code}`);
  }, [code]);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full rounded-3xl border border-[#2B2320]/10 bg-white/70 p-7">
      <p className="font-mono mb-4 text-3xl tracking-[0.3em] text-[#2B2320]">
        {code}
      </p>

      <button
        type="button"
        onClick={handleCopy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2B2320] px-5 py-3 text-sm font-medium text-[#FBF3EF] transition-transform hover:-translate-y-0.5"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy invite link
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-[#2B2320]/40">
        {formatExpiry(expiresAt)}
      </p>
    </div>
  );
}
