export default function DailyQuestionPreview() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-xl rounded-[32px] border border-[#2B2320]/10 bg-white/70 p-8 text-center shadow-[0_30px_60px_-30px_rgba(43,35,32,0.25)] md:p-12">
        <p className="font-mono mb-4 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          today's question
        </p>
        <p className="font-display mb-8 text-2xl italic leading-snug md:text-3xl">
          "What's a small moment from this year you don't want to forget?"
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7B7A4] font-mono text-xs">
            you
          </div>
          <span className="text-xs text-[#2B2320]/40">answered</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8A9A7E]/40 font-mono text-xs">
            ?
          </div>
          <span className="text-xs text-[#2B2320]/40">waiting</span>
        </div>
        <p className="mt-6 text-xs text-[#2B2320]/45">
          Answers reveal to both of you only once you've both replied.
        </p>
      </div>
    </section>
  );
}
