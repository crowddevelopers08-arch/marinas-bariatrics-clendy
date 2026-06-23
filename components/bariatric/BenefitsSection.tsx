import { benefits } from "./data";

export default function BenefitsSection() {
  return (
    <section className="bg-white">
      <div className="w-[min(1080px,92%)] mx-auto">

        {/* ── Two-col layout: heading left, benefits right ── */}
        <div className="grid grid-cols-[260px_1fr] max-[768px]:grid-cols-1 gap-14 max-[1024px]:gap-10 items-start">

          {/* Left: heading */}
          <div>
            <span className="inline-block text-[.68rem] font-bold tracking-[.18em] uppercase text-[#126e6e] px-[14px] py-[7px] border border-[rgba(66,200,200,.35)] rounded-full bg-[rgba(66,200,200,.10)] mb-5">
              Modern Treatment
            </span>
            <h2 className="text-[#163030] text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.15] mb-6">
              Why Bariatric Surgery Is Different Today
            </h2>
            <div className="w-10 h-[3px] bg-[#42c8c8] rounded-full" />
          </div>

          {/* Right: 2-col benefit rows */}
          <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-x-10">
            {benefits.map(([icon, title, copy], i) => (
              <div
                key={title}
                className={`py-6 px-4 -mx-4 rounded-xl transition-colors duration-200 hover:bg-[#f0fcfc] cursor-default ${i < benefits.length - 2 ? "border-b border-[rgba(22,48,48,0.07)]" : ""}`}
              >
                <span className="inline-block text-[.62rem] font-bold tracking-[.14em] uppercase text-[#42c8c8] bg-[#e3f9f9] px-3 py-1 rounded-full mb-3">
                  {icon}
                </span>
                <h3 className="text-[#163030] font-bold text-[1rem] mb-2 leading-snug">{title}</h3>
                <p className="text-[#3d5656] text-[.88rem] leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
