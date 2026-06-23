import { symptoms } from "./data";
import { BookButton } from "./Shared";

export default function CandidateSection() {
  return (
    <section className="overflow-hidden" id="candidate">
      <div className="w-[min(1080px,92%)] mx-auto">

        <div className="overflow-hidden rounded-3xl border border-[rgba(66,200,200,0.22)] grid grid-cols-[480px_1fr] max-[768px]:grid-cols-1">

          {/* ── Left: teal (vk-lime) panel ── */}
          <div className="bg-[#42c8c8] p-[clamp(32px,5vw,52px)] flex flex-col justify-between gap-10 relative overflow-hidden">

            {/* Decorative ring */}
            <div
              className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ border: "36px solid rgba(22,48,48,0.08)", transform: "translate(35%, 35%)" }}
            />

            <div className="relative z-10">
              <span className="inline-block text-[.68rem] font-bold tracking-[.18em] uppercase text-[#163030] px-[14px] py-[7px] border border-[rgba(22,48,48,0.22)] rounded-full bg-[rgba(22,48,48,0.09)] mb-6">
                Are You a Candidate?
              </span>
              <h2 className="text-[#163030] text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.15]">
                If You Relate to Any of These, This Consultation Is for You
              </h2>
              <div className="w-10 h-[3px] bg-[#163030]/25 rounded-full mt-6" />
            </div>

            <div className="relative z-10">
              <BookButton className="inline-flex items-center justify-center gap-3 font-bold text-[1rem] tracking-[.01em] bg-[#126e6e] text-white max-sm:px-3 max-sm:py-3 px-8 py-[16px] rounded-full transition-all duration-200 hover:bg-[#0d5252] hover:-translate-y-[2px] max-[768px]:w-full">
                Book My Consultation
              </BookButton>
            </div>
          </div>

          {/* ── Right: white panel with 2-col symptom list ── */}
          <div className="bg-white p-[clamp(28px,4vw,48px)]">
            <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-x-8 gap-y-5">
              {symptoms.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <span className="w-7 h-7 rounded-lg bg-[#e3f9f9] text-[#126e6e] font-extrabold text-[.72rem] flex items-center justify-center flex-none mt-0.5">
                    ✓
                  </span>
                  <p className="text-[#3d5656] leading-snug text-[.95rem] pt-0.5">{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
