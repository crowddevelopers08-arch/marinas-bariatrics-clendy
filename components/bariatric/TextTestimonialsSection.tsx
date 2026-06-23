"use client";

import { useEffect, useState } from "react";
import { textTestimonials } from "./data";

export default function TextTestimonialsSection() {
  const [active, setActive] = useState(0);
  const total = textTestimonials.length;

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % total), 4000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <section className="">
      <div className="w-[min(1080px,92%)] mx-auto">

        {/* ── Heading ── */}
        <div className="text-center mb-10">
          <span className="inline-block text-[.68rem] font-bold tracking-[.18em] uppercase text-[#126e6e] px-[14px] py-[7px] border border-[rgba(66,200,200,.35)] rounded-full bg-[rgba(66,200,200,.10)] mb-5">
            Patient Words
          </span>
          <h2 className="text-[#163030] text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.15] max-w-[24ch] mx-auto">
            What Patients Say After Their Consultation
          </h2>
        </div>

        {/* ── 3-col row — all visible, active card is dark ── */}
        <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-5">
          {textTestimonials.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.name}
                onClick={() => setActive(i)}
                className={`text-left rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden transition-all duration-500 border ${
                  isActive
                    ? "bg-[#163030] border-[#163030]"
                    : "bg-white border-[rgba(22,48,48,0.07)] opacity-75 hover:opacity-100 max-[640px]:hidden"
                }`}
              >
                {/* Watermark quote */}
                <div
                  className={`absolute top-2 right-4 [font-family:var(--serif)] text-[5.5rem] leading-none select-none pointer-events-none transition-colors duration-500 ${
                    isActive ? "text-white/[0.06]" : "text-[#42c8c8]/15"
                  }`}
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="text-[#42c8c8] tracking-[4px] text-[.82rem]">★★★★★</div>

                {/* Quote */}
                <p
                  className={`leading-relaxed text-[.93rem] flex-1 relative z-10 transition-colors duration-500 ${
                    isActive ? "text-white/80" : "text-[#3d5656]"
                  }`}
                >
                  {item.text}
                </p>

                {/* Author */}
                <div
                  className={`flex items-center gap-3 pt-4 border-t transition-colors duration-500 ${
                    isActive ? "border-white/[0.10]" : "border-[rgba(22,48,48,0.07)]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full font-extrabold flex items-center justify-center text-[.78rem] flex-none transition-colors duration-500 ${
                      isActive ? "bg-[#42c8c8] text-[#163030]" : "bg-[#163030] text-[#42c8c8]"
                    }`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <div
                      className={`font-semibold text-[.88rem] transition-colors duration-500 ${
                        isActive ? "text-white" : "text-[#163030]"
                      }`}
                    >
                      {item.name}
                    </div>
                    <div
                      className={`text-[.72rem] tracking-wide transition-colors duration-500 ${
                        isActive ? "text-white/40" : "text-[#3d5656]"
                      }`}
                    >
                      Verified Patient
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Dots ── */}
        <div className="flex justify-center gap-2 mt-7">
          {textTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-[7px] rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-[#126e6e]" : "w-[7px] bg-[rgba(22,48,48,0.18)]"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
