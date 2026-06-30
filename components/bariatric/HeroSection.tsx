"use client";

import { useEffect, useState } from "react";
import { BookButton } from "./Shared";

const BG_IMAGES = [
  "https://ik.imagekit.io/tpucbav8z/image-1.jpg",
  "https://ik.imagekit.io/tpucbav8z/image-3.jpg",
  "https://ik.imagekit.io/tpucbav8z/image-2.jpg",

];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[#e3f9f9] overflow-hidden py-10 md:py-14">

      <style>{`
        @keyframes zoomInOut {
          0%   { transform: scale(1.0); }
          50%  { transform: scale(1.18); }
          100% { transform: scale(1.0); }
        }
      `}</style>

      <div className="w-[min(1200px,92%)] mx-auto">

        {/* ── Hero card with slideshow background ── */}
        <div className="relative rounded-[28px] overflow-hidden border border-[rgba(66,200,200,0.22)]">

          {/* Slideshow images inside the card */}
          {BG_IMAGES.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(${src})`,
                opacity: i === active ? 1 : 0,
                transition: "opacity 1.6s ease-in-out",
                animation: "zoomInOut 10s ease-in-out infinite",
              }}
            />
          ))}

          {/* White overlay so card text stays readable */}
          <div className="absolute inset-0 bg-white/82" />

          {/* Decorative ring — top right */}
          <div
            className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full pointer-events-none z-[1]"
            style={{ border: "44px solid rgba(66,200,200,0.07)", transform: "translate(32%,-44%)" }}
          />
          {/* Decorative ring — bottom left */}
          <div
            className="absolute bottom-0 left-0 w-[220px] h-[220px] rounded-full pointer-events-none z-[1]"
            style={{ border: "30px solid rgba(18,110,110,0.06)", transform: "translate(-40%,44%)" }}
          />

          {/*
            Desktop : 2-col grid — left col badge+title (row1) + desc+btn (row2), video spans both rows right
            Mobile  : flex-col — badge+title → video → desc+btn
          */}
          <div className="relative z-[2] grid grid-cols-[1fr_52%] max-[768px]:flex max-[768px]:flex-col">

            {/* ── Badge + Title  (desktop col-1 row-1 | mobile first) ── */}
            <div className="col-start-1 row-start-1 flex flex-col px-[clamp(28px,4.5vw,60px)] pt-[clamp(28px,4.5vw,58px)] pb-3 max-[768px]:items-center max-[768px]:text-center max-[768px]:px-6 max-[768px]:pt-8 max-[768px]:pb-3">

              <span className="inline-flex items-center gap-2 text-[.68rem] font-bold tracking-[.18em] uppercase text-[#126e6e] px-[14px] py-[7px] border border-[rgba(66,200,200,0.40)] rounded-full bg-[rgba(66,200,200,0.10)] mb-6 self-start max-[768px]:self-center">
                <span className="w-[6px] h-[6px] rounded-full bg-[#42c8c8] animate-pulse" />
                Important Message for Weight Loss Patients
              </span>

              <h1 className="text-[#163030] text-[clamp(1.75rem,2.9vw,2.75rem)] max-[768px]:text-[clamp(1.55rem,5.5vw,2rem)] leading-[1.11] tracking-[-0.018em] max-w-[14ch] max-[768px]:max-w-none">
                Watch This Before You Decide What To Do About Your Weight
              </h1>

            </div>

            {/* ── Video  (desktop col-2 row-1–2 | mobile second) ── */}
            <div className="col-start-2 row-start-1 row-span-2 p-6 flex items-center max-[768px]:px-5 max-[768px]:py-4">
              <div className="relative w-full rounded-2xl overflow-hidden aspect-video shadow-[0_8px_40px_rgba(18,110,110,0.13)] ring-1 ring-[rgba(66,200,200,0.18)]">
                <video
                  src="https://res.cloudinary.com/daclbrdse/video/upload/v1782813489/VSL_out_1_final_squished_gibpjp.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover block"
                />
              </div>
            </div>

            {/* ── Description + Button  (desktop col-1 row-2 | mobile third) ── */}
            <div className="col-start-1 row-start-2 flex flex-col px-[clamp(28px,4.5vw,60px)] pt-3 pb-[clamp(28px,4.5vw,58px)] max-[768px]:items-center max-[768px]:text-center max-[768px]:px-6 max-[768px]:pt-3 max-[768px]:pb-8">

              <p className="text-[#3d5656] text-[clamp(.92rem,1.2vw,1.03rem)] max-w-[42ch] mb-9 leading-relaxed max-[768px]:mx-auto">
                Discover why thousands of people continue struggling with obesity, failed diets, and health complications without realising that a permanent, medically proven solution exists.
              </p>

              <div className="max-[768px]:w-full max-[768px]:flex max-[768px]:justify-center">
                <BookButton className="inline-flex items-center justify-center gap-3 font-bold text-[1rem] tracking-[.01em] bg-[#126e6e] text-white px-9 max-sm:px-4 max-sm:py-3 py-[17px] rounded-full transition-all duration-200 hover:bg-[#0d5252] hover:-translate-y-[2px] max-[768px]:w-[min(320px,100%)]">
                  Book My Consultation
                </BookButton>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
