export default function MetaBar() {
  const items: [string, string, boolean?][] = [
    ["Mode", "In-Clinic"],
    ["Booking", "Available", true],
    ["Speciality", "Bariatric"],
    ["Slots", "Limited"],
  ];
  return (
    <div className="bg-[#e3f9f9] py-6">
      <div className="w-[min(1080px,92%)] mx-auto flex items-stretch gap-4 max-[640px]:grid max-[640px]:grid-cols-2">
        {items.map(([key, value, gold]) => (
          <div
            key={key}
            className="flex-1 bg-white rounded-2xl px-6 py-5 text-center flex flex-col gap-[5px] border-t-[3px] border-[#42c8c8]"
          >
            <div className="text-[#126e6e] text-[.64rem] font-bold tracking-[.18em] uppercase">{key}</div>
            <div className={`[font-family:var(--serif)] text-[1.6rem] font-extrabold leading-none ${gold ? "text-[#163030]" : "text-[#163030]"}`}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
