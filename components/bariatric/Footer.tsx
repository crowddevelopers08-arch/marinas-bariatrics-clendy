import Image from "next/image";

export default function Footer() {
  return (
    <footer className="pt-12 pb-20">
      <div className="w-[min(1080px,92%)] mx-auto grid grid-cols-[minmax(0,680px)_360px] gap-6 items-start justify-center max-[768px]:grid-cols-1 max-[768px]:text-center">
        <div>
                <div className="flex justify-start mb-1 items-center max-[768px]:justify-center">
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
        <div className="w-12 h-px bg-black mb-3 max-[768px]:mx-auto" />
        <p className="text-black/85 text-[.76rem] max-w-[68ch] leading-[1.75]">
          Disclaimer: The information provided on this page is for general awareness and educational purposes only and does not constitute medical advice. Individual results from bariatric and metabolic surgery vary and are not guaranteed. Eligibility for any procedure is determined only after a clinical evaluation. Please consult a qualified surgeon before making any treatment decision. © Marina&apos;s Clinic - Gastro &amp; General Surgery.
        </p>
        </div>

        <div className="w-full pt-6 pl-6 border-l border-[rgba(18,110,110,.16)] text-left max-[768px]:mx-auto max-[768px]:pt-6 max-[768px]:pl-0 max-[768px]:border-l-0 max-[768px]:border-t max-[768px]:text-center">
          <div className="text-[#126e6e] text-[.76rem] font-extrabold tracking-[.16em] uppercase mb-5">
            Contact Details
          </div>

          <div className="space-y-5">
            <div>
              <div className="text-black/45 text-[.72rem] font-bold tracking-[.12em] uppercase mb-2">
                Address
              </div>
              <address className="not-italic text-black/85 text-[.95rem] leading-[1.65]">
                40 &amp; 54, Josier St,<br />
                Nungambakkam,
                Chennai 600034
              </address>
            </div>

            <div>
              <div className="text-black/45 text-[.72rem] font-bold tracking-[.12em] uppercase mb-2">
                Phone
              </div>
              <a
                href="tel:+919884000171"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(18,110,110,.24)] px-5 py-3 text-[#126e6e] font-bold text-[.95rem] transition-colors duration-200 hover:bg-[#e3f9f9] hover:text-[#0d5252]"
              >
                +91 98840 00171
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
