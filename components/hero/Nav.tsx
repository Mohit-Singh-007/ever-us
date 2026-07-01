import Link from "next/link";

export default function Nav() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
      <span className="font-display text-lg italic tracking-tight text-[#2B2320]">
        couple space
      </span>
      <Link
        href="/login"
        className="rounded-full border border-[#2B2320]/15 px-5 py-2 text-sm font-medium text-[#2B2320] transition-colors hover:border-[#C4685A]/50 hover:bg-white/60"
      >
        Sign in
      </Link>
    </header>
  );
}
