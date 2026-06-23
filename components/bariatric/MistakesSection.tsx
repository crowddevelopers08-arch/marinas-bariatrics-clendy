import { mistakes } from "./data";
import { SectionHeading } from "./Shared";

export default function MistakesSection() {
  return (
    <section className="bg-[#f4fefe] overflow-hidden">
      <div className="w-[min(1080px,92%)] mx-auto">
        <SectionHeading eyebrow="The Biggest Mistake" title="What Most Weight Loss Patients Do Wrong" />
        <p className="text-[#3d5656] max-w-[58ch] mb-10 text-[1.05rem] leading-relaxed">
          Obesity is not a willpower problem. It is a medical condition that often requires medical intervention.
        </p>
      </div>

      {/* ── Desktop: static 4-col grid ── */}
      <div className="w-[min(1080px,92%)] mx-auto max-[640px]:hidden">
        <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 gap-5">
          {mistakes.map((item, index) => (
            <div
              key={item}
              className="relative bg-white rounded-2xl p-7 border border-[rgba(22,48,48,0.07)] overflow-hidden group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-2 right-4 [font-family:var(--serif)] text-[5rem] font-extrabold text-[rgba(18,110,110,0.06)] leading-none select-none">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="w-10 h-[3px] bg-[#42c8c8] rounded-full mb-5" />
              <p className="text-[#163030] font-medium leading-snug relative z-10">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: slow auto-scroll ── */}
      <div className="hidden max-[640px]:block">
        <div
          className="flex gap-4 animate-[scroll_28s_linear_infinite]"
          style={{ width: "max-content" }}
        >
          {[...mistakes, ...mistakes].map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-6 border border-[rgba(22,48,48,0.07)] overflow-hidden flex-none w-[72vw]"
            >
              <div className="absolute top-2 right-4 [font-family:var(--serif)] text-[5rem] font-extrabold text-[rgba(18,110,110,0.06)] leading-none select-none">
                {String((index % mistakes.length) + 1).padStart(2, "0")}
              </div>
              <div className="w-10 h-[3px] bg-[#42c8c8] rounded-full mb-4" />
              <p className="text-[#163030] font-medium leading-snug relative z-10">{item}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
