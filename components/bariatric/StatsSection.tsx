"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 5000, suffix: "+", label: "Happy Patients" },
  { value: 1000, suffix: "+", label: "Online Appointments" },
  { value: 12, suffix: "+", label: "Years Of Experience" },
  { value: 15, suffix: "+", label: "Doctors and Staff" },
];

export default function StatsSection() {
  return (
    <section className="bg-[#42c8c8] py-[46px] max-[768px]:py-14">
      <div className="w-[min(1200px,92%)] mx-auto grid grid-cols-4 gap-10 text-center text-white max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
        {stats.map((item) => (
          <div key={item.label}>
            <StatCounter value={item.value} suffix={item.suffix} />
            <div className="text-[clamp(.9rem,1.2vw,1.05rem)] font-semibold leading-tight">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    let frame = 0;
    let start = 0;
    const duration = 1400;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        function step(timestamp: number) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setCount(Math.floor(eased * value));

          if (progress < 1) {
            frame = requestAnimationFrame(step);
          } else {
            setCount(value);
          }
        }

        frame = requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div
      className="[font-family:var(--serif)] text-[clamp(2.1rem,3.4vw,3rem)] font-extrabold leading-none mb-4"
      ref={ref}
    >
      {count.toLocaleString("en-IN")}
      {suffix}
    </div>
  );
}
