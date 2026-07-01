import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28 text-center md:px-10">
      <h2 className="font-display mx-auto max-w-xl text-3xl leading-tight tracking-tight md:text-4xl">
        Start where you are.
        <br />
        <span className="italic text-[#C4685A]">The rest fills in.</span>
      </h2>
      <Link
        href="/login"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#2B2320] px-7 py-3.5 text-sm font-medium text-[#FBF3EF] transition-transform hover:-translate-y-0.5"
      >
        Continue with Google
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
