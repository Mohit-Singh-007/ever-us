import { FEATURES } from "@/app/utils/constant";

export default function Features() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <div className="mb-16 max-w-lg">
        <p className="font-mono mb-3 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          what's inside
        </p>
        <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
          Not another app to manage.
          <br />A place to actually show up.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#2B2320]/10 bg-[#2B2320]/10 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="group relative bg-[#FBF3EF] p-8 transition-colors hover:bg-white md:p-10"
          >
            <Icon className="mb-5 h-5 w-5 text-[#C4685A]" strokeWidth={1.75} />
            <h3 className="font-display mb-2 text-xl">{title}</h3>
            <p className="text-sm leading-relaxed text-[#2B2320]/65">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
