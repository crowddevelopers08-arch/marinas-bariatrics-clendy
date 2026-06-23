import Image from "next/image";
import { LogoChip } from "./Shared";

export default function Footer() {
  return (
    <footer className="pt-12 pb-20 text-center">
      <div className="w-[min(1080px,92%)] mx-auto">
                <div className="flex justify-center mb-1 items-center">
                  <Image
                    src="/Marina-logo.png"
                    alt="Marina's Clinic"
                    width={300}
                    height={200}
                    priority
                    className="h-[96px] max-[1024px]:h-[80px] max-[640px]:h-[64px] w-auto object-contain"
                  />
                </div>
        <div className="[font-family:var(--serif)] text-black text-[1.15rem] mb-1">Dr. Preethi Mrinalini</div>
        <div className="text-[#42c8c8] text-[.78rem] tracking-[.08em] uppercase mb-3">Bariatric &amp; Metabolic Surgeon</div>
        <div className="w-12 h-px bg-black mx-auto mb-3" />
        <p className="text-black/85 text-[.76rem] max-w-[68ch] mx-auto leading-[1.75]">
          Disclaimer: The information provided on this page is for general awareness and educational purposes only and does not constitute medical advice. Individual results from bariatric and metabolic surgery vary and are not guaranteed. Eligibility for any procedure is determined only after a clinical evaluation. Please consult a qualified surgeon before making any treatment decision. © Marina&apos;s Clinic - Gastro &amp; General Surgery.
        </p>
      </div>
    </footer>
  );
}
