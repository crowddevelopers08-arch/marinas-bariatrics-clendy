import Image from "next/image";

const transformations = [
  {
    src: "https://res.cloudinary.com/daclbrdse/image/upload/v1782805703/2_nbkgnk.png",
    alt: "Male bariatric patient before and after bariatric treatment",
  },
  {
    src: "https://res.cloudinary.com/daclbrdse/image/upload/v1782805703/1_psrsbj.png",
    alt: "Female bariatric patient before and after bariatric treatment",
  },
  {
    src: "https://res.cloudinary.com/daclbrdse/image/upload/v1782805703/3_ilod5l.png",
    alt: "Female bariatric patient before and after bariatric treatment",
  },
] as const;

export default function BeforeAfterGallery() {
  return (
    <section className="bg-[#f4fefe]">
      <div className="mx-auto w-[min(1080px,92%)]">
        <div className="mx-auto mb-9 max-w-[720px] text-center">
          <span className="mb-4 inline-block rounded-full border border-[rgba(66,200,200,.35)] bg-[rgba(66,200,200,.10)] px-[14px] py-[7px] text-[.72rem] font-bold uppercase tracking-[.18em] text-[#126e6e]">
            Real Transformations
          </span>
          <h2 className="mb-3 text-[clamp(1.6rem,3.6vw,2.55rem)] leading-[1.18] text-[#163030] [font-family:var(--serif)]">
            Before and After Results
          </h2>
          <p className="mx-auto max-w-[58ch] text-[clamp(1rem,1.6vw,1.12rem)] leading-relaxed text-[#3d5656]">
            A closer look at real patient transformation journeys from Marina&apos;s Clinic.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 max-[768px]:flex max-[768px]:snap-x max-[768px]:snap-mandatory max-[768px]:overflow-x-auto max-[768px]:pb-4 max-[768px]:[-ms-overflow-style:none] max-[768px]:[scrollbar-width:none] max-[768px]:[&::-webkit-scrollbar]:hidden">
          {transformations.map((item, index) => (
            <article
              key={item.src}
              className={`group overflow-hidden rounded-[18px] bg-white p-2 shadow-[0_18px_50px_-28px_rgba(18,110,110,0.55)] ring-1 ring-[rgba(22,48,48,0.08)] max-[768px]:w-[82vw] max-[768px]:max-w-[360px] max-[768px]:flex-none max-[768px]:snap-center ${
                index === 1 ? "min-[769px]:-translate-y-4" : ""
              }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-[14px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1080}
                  height={1080}
                  sizes="(max-width: 768px) 92vw, 340px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority={index === 0}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
