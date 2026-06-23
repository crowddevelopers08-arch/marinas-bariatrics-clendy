"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "./Shared";

const videos = [
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762970/video1_kaazse.mp4" },
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video2_qtujea.mp4" },
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video3_rpzmq3.mp4" },
];

export default function VideoTestimonialsSection() {
  const [active, setActive] = useState(0);
  const n = videos.length;
  const prev = () => setActive((i) => (i - 1 + n) % n);
  const next = () => setActive((i) => (i + 1) % n);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % n), 10000);
    return () => clearInterval(t);
  }, [n]);
  const prevIdx = (active - 1 + n) % n;
  const nextIdx = (active + 1) % n;

  return (
    <section className="bg-[#f4fefe] overflow-hidden">
      <div className="w-[min(1080px,92%)] mx-auto text-center">
        <SectionHeading eyebrow="Real Patient Journeys" title="Hear It From Those Who Took the Step" center />
      </div>

      {/* ── Carousel stage ── */}
      <div className="relative mt-10">

        {/* Edge gradient fades — make side-peek cut-off look intentional */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-36 z-10 bg-gradient-to-r from-[#e3f9f9] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-36 z-10 bg-gradient-to-l from-[#e3f9f9] to-transparent" />

        <div className="flex items-center justify-center gap-5 max-[640px]:gap-2">

          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="relative z-20 flex-none w-11 h-11 max-[640px]:w-9 max-[640px]:h-9 rounded-full bg-white text-[#126e6e] text-[1.7rem] max-[640px]:text-[1.3rem] flex items-center justify-center border border-[rgba(18,110,110,0.15)] transition-all duration-200 hover:bg-[#126e6e] hover:text-white hover:scale-105"
          >
            ‹
          </button>

          {/* Prev peek — desktop only, scaled + faded */}
          <div
            className="hidden min-[768px]:block flex-none cursor-pointer origin-right scale-[0.80] opacity-35 transition-all duration-500 hover:opacity-50"
            onClick={prev}
          >
            <div className="w-[210px] aspect-[9/16] rounded-[18px] bg-[#163030] overflow-hidden">
              <video
                src={videos[prevIdx].src}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          </div>

          {/* ── Center / Active video ── */}
          <div className="flex-none relative z-10">
            <div className="w-[300px] max-[640px]:w-[80vw] aspect-[9/16] rounded-[24px] overflow-hidden">
              <video
                key={active}
                src={videos[active].src}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

          {/* Next peek — desktop only, scaled + faded */}
          <div
            className="hidden min-[768px]:block flex-none cursor-pointer origin-left scale-[0.80] opacity-35 transition-all duration-500 hover:opacity-50"
            onClick={next}
          >
            <div className="w-[210px] aspect-[9/16] rounded-[18px] overflow-hidden">
              <video
                src={videos[nextIdx].src}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next"
            className="relative z-20 flex-none w-11 h-11 max-[640px]:w-9 max-[640px]:h-9 rounded-full bg-white text-[#126e6e] text-[1.7rem] max-[640px]:text-[1.3rem] flex items-center justify-center border border-[rgba(18,110,110,0.15)] transition-all duration-200 hover:bg-[#126e6e] hover:text-white hover:scale-105"
          >
            ›
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-7 pb-1">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Video ${i + 1}`}
            className={`h-[7px] rounded-full transition-all duration-300 ${
              i === active
                ? "w-7 bg-[#126e6e]"
                : "w-[7px] "
            }`}
          />
        ))}
      </div>
    </section>
  );
}
