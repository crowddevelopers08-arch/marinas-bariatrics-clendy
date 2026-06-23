import { conditions } from "./data";
import { SectionHeading } from "./Shared";

export default function ConditionSection() {
  return (
    <section className="bg-white">
      <div className="w-[min(1080px,92%)] mx-auto">

        <SectionHeading eyebrow="Understand Your Condition" title="Two Conditions, One Medical Approach" />

        <div className="mt-10 grid gap-5">
          {conditions.map((condition, ci) => (
            <div
              key={condition.title}
              className="grid grid-cols-[200px_1fr] max-[640px]:grid-cols-1 overflow-hidden rounded-2xl border border-[rgba(22,48,48,0.08)]"
            >
              {/* ── Left: dark label panel ── */}
              <div className="bg-[#163030] px-7 py-8 flex flex-col justify-between max-[640px]:flex-row max-[640px]:items-center max-[640px]:py-5">
                <div>
                  <span className="[font-family:var(--serif)] text-[2.8rem] font-extrabold text-[#42c8c8]/20 leading-none block">
                    0{ci + 1}
                  </span>
                  <h3 className="[font-family:var(--serif)] text-white text-[1.15rem] font-bold leading-snug mt-2 max-[640px]:mt-0">
                    {condition.title}
                  </h3>
                </div>
                <div className="w-8 h-[3px] bg-[#42c8c8] rounded-full mt-6 max-[640px]:hidden" />
              </div>

              {/* ── Right: mist items panel ── */}
              <div className="bg-[#f7fdfd] px-8 py-7">
                <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-x-6 gap-y-3">
                  {condition.items.map((item) => (
                    <div key={item} className="flex gap-3 items-start">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#42c8c8] flex-none mt-[7px]" />
                      <p className="text-[#3d5656] text-[.93rem] leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
