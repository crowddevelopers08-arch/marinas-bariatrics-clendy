"use client";

import { useEffect, useState } from "react";
import { BookButton } from "./Shared";

export default function UrgencyBar() {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 bg-white/[.98] border-t-2 border-[#126e6e] py-3 ">
      <div className="w-[min(1080px,92%)] mx-auto flex items-center justify-between gap-4">
        <span className="text-[#3d5656] text-[.92rem] font-medium max-[640px]:hidden">
          Limited slots available. Book before they&apos;re filled -
        </span>
        <span className="[font-family:var(--serif)] text-[#126e6e] font-extrabold text-[1.3rem] tracking-[.04em] tabular-nums">
          {minutes}:{seconds}
        </span>
        <BookButton className="inline-flex items-center gap-[10px] cursor-pointer border-none font-bold tracking-[.01em] bg-[#126e6e] text-white px-[22px] py-[11px] max-[640px]:py-[10px] max-[640px]:px-[18px] text-[.92rem] max-[640px]:text-[.85rem] rounded-full transition-all duration-200 hover:bg-[#0d5252] hover:-translate-y-[2px]">
          Reserve My Slot
        </BookButton>
      </div>
    </div>
  );
}
