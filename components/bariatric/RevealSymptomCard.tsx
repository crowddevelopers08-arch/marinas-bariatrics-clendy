"use client";

import { useEffect, useRef, useState } from "react";

export default function RevealSymptomCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        window.setTimeout(() => setVisible(true), index * 100);
        observer.unobserve(node);
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-5 flex gap-4 items-start border border-[rgba(22,48,48,0.07)] hover:-translate-y-0.5 transition-all duration-[600ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {children}
    </div>
  );
}
