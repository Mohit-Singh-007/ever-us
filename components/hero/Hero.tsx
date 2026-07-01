import { FEATURES } from "@/app/utils/constant";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-20 pt-10 text-center md:pb-32 md:pt-16">
      <div className="relative mb-14 h-[168px] w-[280px] md:h-[220px] md:w-[360px]">
        <div
          className="absolute left-0 top-0 h-[150px] w-[150px] rotate-[-8deg] rounded-[28px] border border-[#2B2320]/10 bg-linear-to-br from-[#F1D9BE] to-[#E7B7A4] shadow-[0_18px_40px_-18px_rgba(43,35,32,0.35)] md:h-[190px] md:w-[190px]"
          style={{ animation: "settle-left 900ms ease-out both" }}
        />
        <div
          className="absolute right-0 top-6 h-[150px] w-[150px] rotate-[8deg] rounded-[28px] border border-[#2B2320]/10 bg-linear-to-br from-[#CBD6BE] to-[#8A9A7E] shadow-[0_18px_40px_-18px_rgba(43,35,32,0.35)] md:h-[190px] md:w-[190px]"
          style={{ animation: "settle-right 900ms ease-out both" }}
        />
        <div
          className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FBF3EF] shadow-md"
          style={{ animation: "pop-in 900ms 500ms ease-out both" }}
        >
          <Heart className="h-4 w-4 fill-[#C4685A] text-[#C4685A]" />
        </div>
      </div>

      <p className="font-mono mb-5 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
        for two people, and no one else
      </p>
      <h1 className="font-display max-w-3xl text-4xl leading-[1.1] tracking-tight text-[#2B2320] sm:text-5xl md:text-6xl">
        The story you're both
        <br />
        <span className="italic text-[#C4685A]">still writing.</span>
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-[#2B2320]/70 md:text-lg">
        A private space to keep the memories, ask the questions, and finish the
        list of things you keep meaning to do together.
      </p>

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 rounded-full bg-[#2B2320] px-7 py-3.5 text-sm font-medium text-[#FBF3EF] transition-transform hover:-translate-y-0.5"
        >
          Continue with Google
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <span className="text-xs text-[#2B2320]/50">
          Just you two. No public profiles, ever.
        </span>
      </div>
    </section>
  );
}

export function TrustLine() {
  const items = [
    "Private by default",
    "No ads, no strangers",
    "Built for one relationship at a time",
  ];
  return (
    <div className="relative z-10 border-y border-[#2B2320]/8 bg-white/40">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-xs uppercase tracking-wide text-[#2B2320]/50 md:justify-between">
        {items.map((item) => (
          <span key={item} className="font-mono">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
