"use client";

export const btnPrimary =
  "inline-flex items-center gap-[10px] cursor-pointer border-none font-bold text-[1rem] tracking-[.01em] bg-[#126e6e] text-white px-[30px] py-[16px] rounded-full transition-all duration-200 hover:bg-[#0d5252] hover:-translate-y-[2px]";

export const btnGhost =
  "inline-flex items-center gap-[10px] cursor-pointer font-bold text-[1rem] tracking-[.01em] bg-white text-[#126e6e] border border-[rgba(18,110,110,.32)] px-[30px] py-[16px] rounded-full transition-all duration-200 hover:bg-[#e3f9f9] hover:text-[#0d5252]";

export function LogoChip({ className }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col leading-none min-w-[142px] text-[#163030] ${className ?? ""}`} aria-label="Marina's Clinic">
      <span className="[font-family:var(--serif)] text-[1.35rem] font-extrabold">Marina&apos;s</span>
      <span className="text-[.76rem] font-extrabold tracking-[.18em] uppercase text-[#126e6e] mt-[4px]">Clinic</span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, lead, center = false }: {
  eyebrow: string; title: string; lead?: string; center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : undefined}>
      <span className="inline-block font-bold tracking-[.18em] uppercase text-[.72rem] text-[#126e6e] px-[14px] py-[7px] border border-[rgba(66,200,200,.35)] rounded-full bg-[rgba(66,200,200,.10)] mb-[18px]">
        {eyebrow}
      </span>
      <h2 className={`text-[clamp(1.6rem,3.6vw,2.55rem)] mb-[14px] max-w-[22ch]${center ? " mx-auto" : ""}`}>
        {title}
      </h2>
      {lead && (
        <p className={`text-[#3d5656] text-[clamp(1rem,1.6vw,1.12rem)] max-w-[60ch]${center ? " mx-auto" : ""}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

export function BookButton({ children, className = btnPrimary }: {
  children: React.ReactNode; className?: string;
}) {
  const open = () => window.dispatchEvent(new CustomEvent("open-booking-modal"));
  return <button type="button" className={className} onClick={open}>{children}</button>;
}

export function PlayButton({ small = false }: { small?: boolean }) {
  return (
    <span className={small
      ? "w-[62px] h-[62px] rounded-full flex items-center justify-center bg-[#126e6e] text-white text-[.72rem] z-10 cursor-pointer pl-[6px]"
      : "w-[84px] h-[84px] rounded-full flex items-center justify-center bg-[#126e6e] text-white text-[1.8rem] z-10 cursor-pointer animate-[pulse_2.4s_infinite] pl-[6px]"
    }>
      Play
    </span>
  );
}
