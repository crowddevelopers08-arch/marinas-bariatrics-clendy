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
        <div className="max-[640px]:hidden">
          <BookButton className={btnGhost}>Book Consultation</BookButton>
        </div>
      </div>
    </header>
  );
}
