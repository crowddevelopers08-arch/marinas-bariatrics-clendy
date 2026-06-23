import { consultationIncludes, whoShouldBook } from "./data";
import { BookButton } from "./Shared";

export default function BookingSection() {
  return (
    <section className="bg-white" id="book">
      <div className="w-[min(1080px,92%)] mx-auto">

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <span className="inline-block text-[.68rem] font-bold tracking-[.18em] uppercase text-[#126e6e] px-[14px] py-[7px] border border-[rgba(66,200,200,.35)] rounded-full bg-[rgba(66,200,200,.10)] mb-5">
            Book a Consultation
          </span>
          <h2 className="text-[#163030] text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.15] max-w-[28ch] mx-auto">
            One Consultation. Everything You Need to Decide.
          </h2>
        </div>

        {/* ── Equal 2-col grid ── */}
        <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-5 items-stretch">

          {/* ── Left: dark price card ── */}
          <div className="bg-[#163030] rounded-2xl p-[clamp(28px,4vw,48px)] flex flex-col gap-7 relative overflow-hidden">
            {/* Decorative ring */}
            <div
              className="absolute top-0 right-0 w-52 h-52 rounded-full pointer-events-none"
              style={{ border: "32px solid rgba(66,200,200,0.07)", transform: "translate(36%,-36%)" }}
            />

            {/* Price */}
            <div className="relative z-10">
              <div className="text-[#42c8c8] text-[.68rem] font-bold tracking-[.18em] uppercase mb-1">
                 Book My
              </div>
              <div className="[font-family:var(--serif)] text-[clamp(3rem,5vw,4rem)] text-white font-extrabold leading-none mb-2">
                Consultation
              </div>
              <div className="text-white/45 text-[.82rem]">
                One-time · In-clinic · Limited slots per week
              </div>
            </div>

            <div className="w-full h-px bg-white/[0.08]" />

            {/* Includes */}
            <ul className="list-none grid gap-[14px] flex-1 relative z-10">
              {consultationIncludes.map((item) => (
                <li key={item} className="flex gap-3 items-start text-white/70 text-[.88rem]">
                  <span className="text-[#42c8c8] font-extrabold flex-none text-[.8rem] mt-[2px]">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="relative z-10">
              <BookButton className="w-full inline-flex items-center justify-center gap-2 font-bold text-[.95rem]  bg-[#126e6e] text-white px-6 py-[15px] max-sm:px-3 max-sm:py-3 rounded-full transition-all duration-200 hover:bg-white hover:-translate-y-[2px]">
                Book My Consultation
              </BookButton>
            </div>
          </div>

          {/* ── Right: teal who-should-book card ── */}
          <div className="bg-[#42c8c8] rounded-2xl p-[clamp(28px,4vw,48px)] flex flex-col gap-7 relative overflow-hidden">
            {/* Decorative ring */}
            <div
              className="absolute bottom-0 left-0 w-52 h-52 rounded-full pointer-events-none"
              style={{ border: "32px solid rgba(22,48,48,0.08)", transform: "translate(-36%,36%)" }}
            />

            {/* Heading */}
            <div className="relative z-10">
              <div className="text-[#163030]/85 text-[.68rem] font-bold tracking-[.18em] uppercase mb-3">
                Is This for You?
              </div>
              <h3 className="[font-family:var(--serif)] text-[#163030] text-[1.5rem] font-bold leading-snug">
                Who Should Book This Consultation
              </h3>
              <p className="text-[#163030]/90 text-[.84rem] mt-2 leading-relaxed">
                Designed for people who are serious about understanding their options.
              </p>
            </div>

            <div className="w-full h-px bg-[#163030]/10" />

            {/* Who should book list */}
            <ul className="list-none grid gap-[14px] flex-1 relative z-10">
              {whoShouldBook.map((item) => (
                <li key={item} className="flex gap-3 items-start text-[#163030]/95 text-[.88rem]">
                  <span className="w-5 h-5 rounded-full bg-[#163030]/10 text-[#163030] font-extrabold flex items-center justify-center text-[.62rem] flex-none mt-0.5">
                    ✓
                  </span>
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
