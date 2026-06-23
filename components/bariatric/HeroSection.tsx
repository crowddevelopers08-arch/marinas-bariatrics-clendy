import { BookButton } from "./Shared";

export default function HeroSection() {
  return (
    <section className="bg-[#e3f9f9] overflow-hidden">
      <div className="w-[min(1200px,92%)] mx-auto">

        {/* ── Hero card ── */}
        <div className="relative bg-white rounded-[28px] overflow-hidden border border-[rgba(66,200,200,0.22)] grid grid-cols-[1fr_42%] max-[768px]:grid-cols-1">

          {/* Decorative ring — top right */}
          <div
            className="absolute top-0 right-[42%] w-[360px] h-[360px] rounded-full pointer-events-none z-0"
            style={{ border: "44px solid rgba(66,200,200,0.07)", transform: "translate(32%,-44%)" }}
          />
          {/* Decorative ring — bottom left */}
          <div
            className="absolute bottom-0 left-0 w-[220px] h-[220px] rounded-full pointer-events-none z-0"
            style={{ border: "30px solid rgba(18,110,110,0.06)", transform: "translate(-40%,44%)" }}
          />

          {/* ── Copy ── */}
          <div className="relative z-10 p-[clamp(36px,5vw,68px)] flex flex-col justify-center max-[768px]:items-center max-[768px]:text-center">

            <span className="inline-flex items-center gap-2 text-[.68rem] font-bold tracking-[.18em] uppercase text-[#126e6e] px-[14px] py-[7px] border border-[rgba(66,200,200,0.40)] rounded-full bg-[rgba(66,200,200,0.10)] mb-7 self-start max-[768px]:self-center">
              <span className="w-[6px] h-[6px] rounded-full bg-[#42c8c8] animate-pulse" />
              Important Message for Weight Loss Patients
            </span>

            <h1 className="text-[#163030] text-[clamp(1.85rem,3.5vw,3rem)] max-[768px]:text-[clamp(1.65rem,6vw,2.2rem)] leading-[1.11] tracking-[-0.018em] mb-5 max-w-[14ch] max-[768px]:max-w-none">
              Watch This Before You Decide What To Do About Your Weight
            </h1>

            <p className="text-[#3d5656] text-[clamp(.96rem,1.3vw,1.06rem)] max-w-[44ch] mb-9 leading-relaxed max-[768px]:mx-auto">
              Discover why thousands of people continue struggling with obesity, failed diets, and health complications without realising that a permanent, medically proven solution exists.
            </p>

            <div className="max-[768px]:w-full max-[768px]:flex max-[768px]:justify-center">
              <BookButton className="inline-flex items-center justify-center gap-3 font-bold text-[1rem] tracking-[.01em] bg-[#126e6e] text-white px-9 max-sm:px-3 max-sm:py-3 py-[17px] rounded-full transition-all duration-200 hover:bg-[#0d5252] hover:-translate-y-[2px] max-[768px]:w-[min(320px,100%)]">
                Book My Consultation
              </BookButton>
            </div>

          </div>

          {/* ── Video — full right panel, bleeds to card edge ── */}
          <div className="relative min-h-[480px] max-[768px]:min-h-0 max-[768px]:aspect-[4/5]">
            {/* Fade from white panel into video */}
            <div
              className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, white, transparent)" }}
            />
            <video
              src="https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video2_qtujea.mp4"
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover block"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
