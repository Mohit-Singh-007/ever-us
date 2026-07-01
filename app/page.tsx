import { Metadata } from "next";
import Nav from "@/components/hero/Nav";
import Hero, { TrustLine } from "@/components/hero/Hero";
import FinalCta from "@/components/hero/FinalCta";
import Footer from "@/components/hero/Footer";
import DailyQuestionPreview from "@/components/hero/DailyQuestionPreview";
import Features from "@/components/hero/Features";

export const metadata: Metadata = {
  title: "Couple Space — A private place for two",
  description:
    "Keep your memories, your questions, your unfinished list of dreams — all in one quiet space built for two people.",
};

export default function page0() {
  return (
    <div
      className={`font-body relative overflow-hidden bg-[#FBF3EF] text-[#2B2320]`}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-full w-px -translate-x-1/2 md:block"
        preserveAspectRatio="none"
        viewBox="0 0 2 2000"
      >
        <path
          d="M1 0 L1 2000"
          stroke="#C4685A"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>

      <Nav />
      <Hero />
      <TrustLine />
      <Features />
      <DailyQuestionPreview />
      <FinalCta />
      <Footer />
    </div>
  );
}
