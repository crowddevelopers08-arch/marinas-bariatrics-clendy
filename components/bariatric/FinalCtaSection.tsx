import { BookButton } from "./Shared";

export default function FinalCtaSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#163030]"
      style={{
        backgroundImage: "url('/gettyimages.jpg')", // replace with your image file in /public
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Dark overlay so text stays readable above image */}
      <div className="absolute inset-0 bg-[#163030]/58" />

      {/* Teal radial glow from bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 110%, rgba(66,200,200,0.22) 0%, transparent 60%)" }}
      />

      {/* Subtle top border accent */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#42c8c8] to-transparent" />

      {/* ── Content ── */}
      <div className="w-[min(1080px,92%)] mx-auto relative z-10 py-[clamp(34px,7vw,100px)]">
        <div className="grid grid-cols-[1fr_auto] max-[768px]:grid-cols-1 gap-16 max-[1024px]:gap-10 items-center">

          {/* Left: text */}
          <div>
            <span className="inline-block text-[.68rem] font-bold tracking-[.18em] uppercase text-[#42c8c8] px-[14px] py-[7px] border border-[rgba(66,200,200,0.28)] rounded-full bg-[rgba(66,200,200,0.10)] mb-6">
              Start Today
            </span>
            <h2 className="text-white text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.12] mb-5 max-w-[18ch]">
              Take the First Step Towards a Healthier Life
            </h2>
            <p className="text-white/95 text-[clamp(.96rem,1.4vw,1.08rem)] leading-relaxed max-w-[44ch]">
              Obesity is a medical condition, not a personal failure. A proper evaluation can change everything.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3 mt-8">
              {["500+ Surgeries", "Laparoscopic Expert", "Confidential Consultation"].map((chip) => (
                <span
                  key={chip}
                  className="text-[.72rem] font-semibold tracking-[.06em] text-white/90 px-4 py-[7px] border border-white/[0.10] rounded-full"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="bg-white/[0.06] border border-white/[0.10] rounded-2xl p-8 flex flex-col items-center gap-5 text-center min-w-[260px] max-[768px]:w-full">
            <div className="text-[#42c8c8] text-[.68rem] font-bold tracking-[.18em] uppercase mb-0">
              Book My
            </div>
            <div className="[font-family:var(--serif)] text-white text-[3rem] font-extrabold leading-none">
              Consultation
            </div>
            <div className="text-white/80 text-[.78rem] leading-relaxed text-center">
              One-time · In-clinic<br />Limited slots per week
            </div>
            <div className="w-full h-px bg-white/[0.08]" />
            <BookButton className="w-full inline-flex items-center justify-center gap-2 font-bold text-[.95rem]  bg-[#126e6e] text-white px-6 py-[15px] max-sm:px-3 max-sm:py-3 rounded-full transition-all duration-200 hover:bg-white hover:-translate-y-[2px]">
              Book My Consultation
            </BookButton>
            <p className="text-white/80 text-[.72rem]">Book Consultation · Paid at clinic</p>
          </div>

        </div>
      </div>
    </section>
  );
}
