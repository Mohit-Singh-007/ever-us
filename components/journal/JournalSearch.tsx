"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function JournalSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function handleChange(next: string) {
    setValue(next);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (next) {
        params.set("q", next);
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2B2320]/35" />
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search entries…"
        className="pl-9"
      />
    </div>
  );
}
