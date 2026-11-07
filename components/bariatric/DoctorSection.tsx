const DOC_IMG = "https://res.cloudinary.com/dxntva1vn/image/upload/v1794027007/doctor-1_c8ms3x.png";

const stats = [["300+", "Surgeries"], ["95%", "Success Rate"], ["12+", "Years Exp."]];

export default function DoctorSection() {
  return (
    <section style={{ background: "radial-gradient(ellipse at 20% 50%, #e3f9f9 0%, #fff 55%)" }}>
      <div className="w-[min(1280px,94%)] mx-auto">
        <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-10 max-[1024px]:gap-8 items-stretch">

          {/* Photo — desktop */}
          <div className="max-[640px]:hidden relative min-h-[520px]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden ring-1 ring-[rgba(66,200,200,0.30)]">
              <img src={DOC_IMG} alt="Dr. Preethi Mrinalini" className="w-full h-full object-cover object-top block" />
            </div>
          </div>

          <div className="flex flex-col justify-center py-4">
            {/* Badge */}
            <span className="self-start inline-block text-[.7rem] font-bold tracking-[.18em] uppercase text-[#126e6e] px-3 py-[6px] rounded-full bg-[rgba(66,200,200,.12)] border border-[rgba(66,200,200,.3)] mb-5">
              Your Surgeon
            </span>

            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] mb-1">Dr. Preethi Mrinalini</h2>
            <span className="block text-[#126e6e] font-semibold tracking-[.05em] uppercase text-[.82rem] mb-5">
              Bariatric &amp; Metabolic Surgeon
            </span>

            {/* Mobile photo */}
            <div className="hidden max-[640px]:block max-w-[280px] mx-auto my-5 rounded-2xl overflow-hidden ring-1 ring-[rgba(22,48,48,0.10)]">
              <img src={DOC_IMG} alt="Dr. Preethi Mrinalini" className="w-full object-cover object-top block" />
            </div>

            <p className="text-[#3d5656] mb-5 leading-relaxed">
              Over 12 years, Dr. Preethi Mrinalini has helped patients struggling with obesity understand their medical options and achieve lasting results through advanced laparoscopic bariatric procedures with a focus on safety, metabolic outcomes, and long-term patient support.
            </p>

            {/* Mission quote */}
            <div className="bg-[#f4fefe] rounded-2xl px-6 py-5 mb-7 border-l-4 border-[#42c8c8]">
              <p className="[font-family:var(--serif)] italic text-[#163030] text-[1.08rem] leading-relaxed">
                &ldquo;To help every patient make an informed decision before obesity affects their health beyond repair.&rdquo;
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(([n, l]) => (
                <div key={l} className="bg-[#163030] rounded-2xl py-5 px-3 text-center">
                  <div className="[font-family:var(--serif)] text-[clamp(1.4rem,3vw,1.9rem)] text-[#42c8c8] font-extrabold leading-none">{n}</div>
                  <div className="text-[.72rem] tracking-[.06em] uppercase text-white/55 mt-2 leading-tight">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
