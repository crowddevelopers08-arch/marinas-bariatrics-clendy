import { afterItems, beforeItems } from "./data";
import { SectionHeading } from "./Shared";

export default function BeforeAfterSection() {
  return (
    <section className="bg-[#f4fefe]">
      <div className="w-[min(1080px,92%)] mx-auto text-center">
        <SectionHeading eyebrow="The Transformation" title="Life Before vs. Life After Treatment" center />
      </div>
      <div className="w-[min(1080px,92%)] mx-auto">
        <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-5 mt-9">

          {/* Before — neutral, muted */}
          <div className="bg-white rounded-2xl p-7 border border-[rgba(22,48,48,0.07)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-[#c05858] font-extrabold text-sm flex-none">✕</div>
              <span className="font-extrabold text-[#c05858] tracking-[.12em] uppercase text-[.72rem]">Before Treatment</span>
            </div>
            <ul className="list-none grid gap-0">
              {beforeItems.map((item, i) => (
                <li key={item} className={`flex gap-3 text-[#3d5656] py-3 items-start ${i < beforeItems.length - 1 ? "border-b border-[#f5f5f5]" : ""}`}>
                  <span className="text-[#d08080] font-extrabold flex-none text-[.85rem] mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After — dark teal, premium */}
          <div className="bg-[#163030] rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-[#42c8c8]/20 flex items-center justify-center text-[#42c8c8] font-extrabold text-sm flex-none">✓</div>
              <span className="font-extrabold text-[#42c8c8] tracking-[.12em] uppercase text-[.72rem]">After Treatment</span>
            </div>
            <ul className="list-none grid gap-0">
              {afterItems.map((item, i) => (
                <li key={item} className={`flex gap-3 text-white/75 py-3 items-start ${i < afterItems.length - 1 ? "border-b border-white/10" : ""}`}>
                  <span className="text-[#42c8c8] font-extrabold flex-none text-[.85rem] mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
