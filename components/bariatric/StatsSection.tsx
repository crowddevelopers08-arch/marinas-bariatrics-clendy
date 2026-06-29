const stats = [
  { value: "5,000+", label: "Happy Patients" },
  { value: "1,000+", label: "Online Appointments" },
  { value: "12+", label: "Years Of Experience" },
  { value: "15+", label: "Doctors and Staff" },
];

export default function StatsSection() {
  return (
    <section className="bg-[#42c8c8] py-[46px] max-[768px]:py-14">
      <div className="w-[min(1200px,92%)] mx-auto grid grid-cols-4 gap-10 text-center text-white max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
        {stats.map((item) => (
          <div key={item.label}>
            <div className="[font-family:var(--serif)] text-[clamp(2.1rem,3.4vw,3rem)] font-extrabold leading-none mb-4">
              {item.value}
            </div>
            <div className="text-[clamp(.9rem,1.2vw,1.05rem)] font-semibold leading-tight">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
