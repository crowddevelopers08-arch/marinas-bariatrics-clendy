import Image from "next/image";
import { BookButton, btnGhost } from "./Shared";

export default function Header() {
  return (
    <header className="py-3 bg-white/[.96] border-b border-[rgba(22,48,48,0.07)] backdrop-blur-[10px]">
      <div className="w-[min(1080px,92%)] mx-auto flex items-center justify-between max-[640px]:justify-center gap-4 flex-wrap">
        <div className="flex items-center">
          <Image
            src="/Marina-logo.png"
            alt="Marina's Clinic"
            width={300}
            height={200}
            priority
            className="h-[96px] max-[1024px]:h-[80px] max-[640px]:h-[64px] w-auto object-contain"
          />
        </div>
        <span className="text-[#3d5656] text-[.85rem] tracking-[.04em] font-extrabold">
          Bariatric &amp; Metabolic Surgery
        </span>
        <div className="flex items-center gap-3 max-[640px]:w-full max-[640px]:justify-center max-[640px]:gap-2 max-[640px]:[&_button]:px-[21px] max-[640px]:[&_button]:py-[12px]">
          <a
            href="tel:+919884000171"
            className="inline-flex items-center gap-[10px] cursor-pointer font-bold text-[1rem] tracking-[.01em] text-[#126e6e] border border-transparent px-[30px] py-[16px] rounded-full transition-all duration-200 hover:bg-[#e3f9f9] hover:text-[#0d5252] hover:border-[rgba(18,110,110,.32)] hover:-translate-y-[2px] max-[640px]:px-[14px] max-[640px]:py-[12px] max-[640px]:text-[.86rem]"
          >
            +91 98840 00171
          </a>
          <BookButton className={btnGhost}>Book Consultation</BookButton>
        </div>
      </div>
    </header>
  );
}
