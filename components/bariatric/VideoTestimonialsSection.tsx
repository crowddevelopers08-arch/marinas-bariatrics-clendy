"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./Shared";

const videos = [
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762970/video1_kaazse.mp4" },
  // { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video2_qtujea.mp4" },
  { src: "https://res.cloudinary.com/dthj7fakc/video/upload/v1781762972/video3_rpzmq3.mp4" },
  // { src: "https://ik.imagekit.io/tpucbav8z/marinias1_squished.mp4" },
  // { src: "https://ik.imagekit.io/tpucbav8z/output%201hernia_squished.mp4" },
];

export default function VideoTestimonialsSection() {
  const [active, setActive] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const prevVideoRef = useRef<HTMLVideoElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const n = videos.length;

  const pauseAllVideos = (except?: HTMLVideoElement) => {
    [prevVideoRef.current, activeVideoRef.current, nextVideoRef.current].forEach((video) => {
      if (video && video !== except) video.pause();
    });
  };

  const handleActivePlay = (video: HTMLVideoElement) => {
    setIsAutoPaused(true);
    pauseAllVideos(video);
  };

  const changeActive = (getNextIndex: (current: number) => number) => {
    pauseAllVideos();
    setActive(getNextIndex);
  };

  const prev = () => changeActive((i) => (i - 1 + n) % n);
  const next = () => changeActive((i) => (i + 1) % n);

  useEffect(() => {
    if (isAutoPaused) return;
    const t = setInterval(() => {
      [prevVideoRef.current, activeVideoRef.current, nextVideoRef.current].forEach((video) => video?.pause());
      setActive((i) => (i + 1) % n);
    }, 10000);
    return () => clearInterval(t);
  }, [isAutoPaused, n]);
  const prevIdx = (active - 1 + n) % n;
  const nextIdx = (active + 1) % n;

  return (
    <section className="bg-[#f4fefe] overflow-hidden">
      <div className="w-[min(1080px,92%)] mx-auto text-center">
        <SectionHeading eyebrow="What Doctor Say" title="Stories From Those Who Chose Change" center />
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
                ref={prevVideoRef}
                src={videos[prevIdx].src}
                playsInline
                preload="metadata"
                onPlay={(event) => pauseAllVideos(event.currentTarget)}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          </div>

          {/* ── Center / Active video ── */}
          <div className="flex-none relative z-10">
            <div className="w-[300px] max-[640px]:w-[80vw] aspect-[9/16] rounded-[24px] overflow-hidden">
              <video
                ref={activeVideoRef}
                key={active}
                src={videos[active].src}
                controls
                playsInline
                preload="metadata"
                onPlay={(event) => handleActivePlay(event.currentTarget)}
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
                ref={nextVideoRef}
                src={videos[nextIdx].src}
                playsInline
                preload="metadata"
                onPlay={(event) => pauseAllVideos(event.currentTarget)}
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
            onClick={() => changeActive(() => i)}
            aria-label={`Video ${i + 1}`}
            className={`h-[7px] rounded-full transition-all duration-300 ${
              i === active
                ? "w-7 bg-[#126e6e]"
                : "w-[7px] bg-[rgba(22,48,48,0.18)]"
            }`}
          />
        ))}
      </div>

      <div className="w-[min(760px,92%)] mx-auto mt-7 pb-10 text-center">
        <p className="text-[#3d5656] text-[clamp(.94rem,1.4vw,1.05rem)] leading-relaxed">
          Want to watch the full patient stories and more doctor videos?
        </p>
        <a
          href="https://www.instagram.com/dr.preethimrinalini?igsh=YWkzdmlsc3l0aWF5"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-[.96rem] font-bold text-[#126e6e] underline underline-offset-4 transition-colors duration-200 hover:text-[#0d5252]"
        >
          Watch full videos on Instagram
        </a>
      </div>
    </section>
  );
}
