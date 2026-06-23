"use client";

import { useState } from "react";

export default function FaqAccordion({ items }: { items: readonly (readonly [string, string])[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-3">
      {items.map(([question, answer], index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={question}
            className={`rounded-2xl overflow-hidden transition-all duration-300 border ${isOpen ? "border-[#42c8c8]/30" : "border-[rgba(22,48,48,0.07)]"}`}
          >
            <button
              className={`w-full text-left cursor-pointer font-semibold text-[1rem] p-5 flex justify-between gap-4 items-center transition-colors duration-300 ${isOpen ? "bg-[#163030] text-white" : "bg-white text-[#163030]"}`}
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              {question}
              <span className={`text-[1.4rem] flex-none transition-all duration-300 ${isOpen ? "rotate-45 text-[#42c8c8]" : "text-[#126e6e]"}`}>
                +
              </span>
            </button>
            <div className="overflow-hidden transition-[max-height] duration-[350ms] bg-white" style={{ maxHeight: isOpen ? 280 : 0 }}>
              <p className="px-5 py-4 text-[#3d5656] leading-relaxed text-[.95rem]">{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
