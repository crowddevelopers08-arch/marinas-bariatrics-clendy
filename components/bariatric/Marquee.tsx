const marqueeItems = ["Advanced Bariatric Surgery", "Laparoscopic Weight Loss", "Sleeve Gastrectomy", "Gastric Bypass", "Metabolic Surgery", "Diabetes Remission", "Long-term Results", "Same-Day Consultations"];

export default function Marquee() {
  return (
    <div className="bg-white border-y border-[rgba(22,48,48,0.08)] py-[13px] overflow-hidden whitespace-nowrap group" aria-hidden="true">
      <div className="inline-flex animate-[scroll_32s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span
            key={i}
            className="text-[#163030] font-semibold tracking-[.05em] text-[.98rem] px-7 relative after:content-['◆'] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:text-[#42c8c8] after:text-[.95rem]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
