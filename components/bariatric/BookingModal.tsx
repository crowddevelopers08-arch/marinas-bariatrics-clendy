"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_S = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Monday - Saturday only
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAY_S = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Available appointment slots: 4:30 PM - 7:00 PM
// (Last appointment ends at 7:00 PM)
const TIMES = [
  "4:30 pm",
  "5:00 pm",
  "5:30 pm",
  "6:00 pm",
  "6:30 pm",
];

const END_TIME: Record<string, string> = {
  "4:30 pm": "5:00 pm",
  "5:00 pm": "5:30 pm",
  "5:30 pm": "6:00 pm",
  "6:00 pm": "6:30 pm",
  "6:30 pm": "7:00 pm",
};

function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

type Step = "calendar" | "form" | "success";

const inputCls = "w-full rounded-xl border border-[#d4e8e8] bg-[#f8fdfd] px-4 py-3 text-[14px] text-[#163030] outline-none transition placeholder:text-[#9ab8b8] focus:border-[#126e6e] focus:bg-white";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#163030] tracking-wide";

function RadioGroup({
  label, options, value, onChange, required,
}: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-[#163030] tracking-wide">
        {label}{required && <span className="ml-0.5 text-red-400"> *</span>}
      </p>
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e3f0f0] bg-[#f8fdfd] px-4 py-3 transition hover:border-[#126e6e] hover:bg-[#eef9f9]"
            onClick={() => onChange(opt)}>
            <span className={`mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full border-2 transition
              ${value === opt ? "border-[#126e6e] bg-[#126e6e]" : "border-[#b8d8d8] bg-white"}`}>
              {value === opt && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="text-[13px] leading-snug text-[#3d5656]">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function BookingModal() {
  const router = useRouter();
  const now = new Date();
  const [open, setOpen]             = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [year, setYear]             = useState(now.getFullYear());
  const [month, setMonth]           = useState(now.getMonth());
  const [day, setDay]               = useState<number | null>(null);
  const [time, setTime]             = useState<string | null>(null);
  const [pending, setPending]       = useState<string | null>(null);
  const [step, setStep]             = useState<Step>("calendar");
  const [bookedSlots, setBooked]    = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", location:"" });
  const [symptomType, setSymptomType] = useState("");
  const [hadSurgery,  setHadSurgery]  = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [decisionMaker, setDecision]  = useState("");
  const [timeline,    setTimeline]    = useState("");
  const [prevConsult, setPrevConsult] = useState("");

  function resetAll() {
    setDay(null); setTime(null); setPending(null); setStep("calendar");
    setForm({ firstName:"", lastName:"", email:"", phone:"", location:"" });
    setSymptomType(""); setHadSurgery(""); setPrimaryGoal("");
    setDecision(""); setTimeline(""); setPrevConsult("");
    setBooked([]); setSlotsLoading(false);
  }

  useEffect(() => {
    if (!day || !open) return;
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSlotsLoading(true);
    fetch(`/api/slots?date=${dateKey}`)
      .then(r => r.json())
      .then(d => setBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => setBooked([]))
      .finally(() => setSlotsLoading(false));
  }, [day, month, year, open]);

  useEffect(() => {
    function handleClick(e: Event) {
      const link = (e.target as HTMLElement).closest('a[href="#book"]');
      if (!link) return;
      e.preventDefault();
      resetAll();
      setOpen(true);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    function handleOpen() {
      setDay(null); setTime(null); setPending(null); setStep("calendar");
      setForm({ firstName:"", lastName:"", email:"", phone:"", location:"" });
      setSymptomType(""); setHadSurgery(""); setPrimaryGoal("");
      setDecision(""); setTimeline(""); setPrevConsult("");
      setBooked([]); setSlotsLoading(false);
      setOpen(true);
    }
    window.addEventListener("open-booking-modal", handleOpen);
    return () => window.removeEventListener("open-booking-modal", handleOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setDay(null); setTime(null); setPending(null); setStep("calendar");
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setDay(null); setTime(null); setPending(null); setStep("calendar");
  }

  function isAvailable(d: number) {
    const date  = new Date(year, month, d);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date >= today && date.getDay() !== 0;
  }
  function isToday(d: number) {
    return year === now.getFullYear() && month === now.getMonth() && d === now.getDate();
  }

  const selDateObj = day ? new Date(year, month, day) : null;
  const selDayName = selDateObj ? DAY_NAMES[selDateObj.getDay()] : "";
  const selDayS    = selDateObj ? DAY_S[selDateObj.getDay()] : "";
  const blanks     = firstWeekday(year, month);
  const total      = daysInMonth(year, month);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0a1e1e]/70 p-4 backdrop-blur-[8px] max-[620px]:p-0"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="relative flex h-[90vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl animate-[modal-in_0.22s_ease] max-[620px]:h-[100dvh] max-[620px]:rounded-none">

        {/* ── Header ── */}
        <div className="flex flex-none items-center gap-4 bg-[#163030] px-8 py-4 max-[620px]:px-4 max-[620px]:py-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#42c8c8]/15 max-[620px]:h-8 max-[620px]:w-8">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#42c8c8" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#42c8c8]">Bariatric Consultation</p>
            <p className="text-[14px] font-semibold text-white">Pick a time that works for you.</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close"
            className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full bg-white/8 text-white/50 transition hover:bg-white/15 hover:text-white">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        {/* ── Calendar view ── */}
        {step === "calendar" && (
          <div className="flex flex-1 overflow-hidden bg-white max-[620px]:flex-col max-[620px]:overflow-y-auto">

            {/* Left — calendar */}
            <div className="flex flex-1 flex-col px-8 py-7 max-[620px]:px-4 max-[620px]:py-5">

              {/* Month navigation */}
              <div className="mb-6 flex items-center justify-between">
                <button onClick={prevMonth}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#5a8080] transition hover:bg-[#e3f9f9] hover:text-[#163030]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <p className="text-[16px] font-bold text-[#163030]">{MONTHS[month]} {year}</p>
                <button onClick={nextMonth}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#5a8080] transition hover:bg-[#e3f9f9] hover:text-[#163030]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              {/* Weekday labels */}
              <div className="mb-2 grid grid-cols-7 text-center">
                {DAYS.map(d => (
                  <span key={d} className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#b0cccc]">{d}</span>
                ))}
              </div>

              {/* Date grid */}
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {Array.from({ length: blanks }).map((_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: total }).map((_, i) => {
                  const d     = i + 1;
                  const avail = isAvailable(d);
                  const sel   = day === d;
                  const today = isToday(d);
                  const isSun = new Date(year, month, d).getDay() === 0;
                  return (
                    <button key={d} disabled={!avail}
                      onClick={() => { setDay(d); setPending(null); }}
                      className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-[14px] font-medium transition-all
                        ${sel
                          ? "bg-[#126e6e] font-bold text-white"
                          : avail
                            ? "cursor-pointer text-[#163030] hover:bg-[#e3f9f9] hover:text-[#126e6e]"
                            : "cursor-not-allowed text-[#c8dcdc]"
                        }
                        ${isSun && !sel ? "text-[#c8dcdc] cursor-not-allowed" : ""}
                      `}
                    >
                      {d}
                      {today && !sel && (
                        <span className="absolute bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#42c8c8]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Timezone */}
              <div className="mt-auto flex items-center gap-2 pt-5 text-[12px] text-[#9ab8b8]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>India Standard Time (IST)</span>
              </div>
            </div>

            {/* Right — time slots */}
            <div className="flex w-[260px] flex-col bg-[#f8fdfd] px-5 py-7 max-[620px]:w-full max-[620px]:px-4 max-[620px]:py-5">
              {!day ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center max-[620px]:py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e3f9f9]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ab8b8" strokeWidth="1.8">
                      <rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                  </div>
                  <p className="text-[13px] leading-snug text-[#9ab8b8]">Select a date to see<br/>available times</p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <p className="text-[15px] font-bold text-[#163030]">{selDayName}</p>
                    <p className="text-[12px] text-[#7a9898]">{MONTHS[month]} {day}, {year}</p>
                  </div>
                  <div className="flex flex-col gap-2 max-[620px]:grid max-[620px]:grid-cols-2">
                    {slotsLoading ? (
                      <p className="col-span-2 py-6 text-center text-[13px] text-[#9ab8b8]">Checking availability…</p>
                    ) : TIMES.map(t => {
                      const isPending = pending === t;
                      const isBooked  = bookedSlots.includes(t);
                      return (
                        <div key={t} className={isPending ? "max-[620px]:col-span-2" : ""}>
                          <button
                            disabled={isBooked}
                            onClick={() => setPending(isPending ? null : t)}
                            className={`w-full rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-all
                              ${isBooked
                                ? "cursor-not-allowed bg-[#f0f8f8] text-[#b8cccc]"
                                : isPending
                                  ? "bg-[#126e6e] text-white"
                                  : "bg-white text-[#126e6e] border border-[rgba(18,110,110,0.15)] hover:bg-[#e3f9f9] hover:text-[#0d5252]"
                              }`}
                          >
                            {t}
                            {isBooked && <span className="ml-1.5 text-[11px] font-normal text-[#b8cccc]">Booked</span>}
                          </button>
                          {isPending && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <button onClick={() => setPending(null)}
                                className="cursor-pointer rounded-xl bg-[#eef9f9] py-2 text-[12px] font-semibold text-[#3d5656] transition hover:bg-[#d4f0f0]">
                                Cancel
                              </button>
                              <button onClick={() => { setTime(t); setPending(null); setStep("form"); }}
                                className="cursor-pointer rounded-xl bg-[#126e6e] py-2 text-[12px] font-bold text-white transition hover:bg-[#0d5252]">
                                Confirm
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Form / Success view ── */}
        {(step === "form" || step === "success") && (
          <div className="flex flex-1 overflow-hidden bg-white max-[620px]:flex-col max-[620px]:overflow-y-auto">

            {/* Mobile top bar */}
            <div className="hidden max-[620px]:flex max-[620px]:flex-none max-[620px]:items-center max-[620px]:justify-between max-[620px]:px-4 max-[620px]:py-3">
              <button onClick={() => { setStep("calendar"); setTime(null); }}
                className="flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[#3d5656]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                Back
              </button>
              <div className="text-right">
                <p className="text-[12px] font-bold text-[#126e6e]">{time} – {END_TIME[time!]}</p>
                <p className="text-[11px] text-[#7a9898]">{selDayS}, {MONTHS_S[month]} {day}</p>
              </div>
            </div>

            {/* Desktop left info panel */}
            <div className="flex w-[300px] flex-none flex-col bg-[#f5fcfc] px-8 py-8 max-[620px]:hidden">
              <button onClick={() => { setStep("calendar"); setTime(null); }}
                className="mb-6 flex cursor-pointer items-center gap-1.5 text-[12.5px] font-semibold text-[#5a8080] transition hover:text-[#126e6e]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                Back to calendar
              </button>

              <img
                src="https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png"
                alt="Marina's"
                className="mb-6 h-12 w-auto object-contain object-left"
              />

              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#7a9898]">Marina&apos;s Hospitals</p>
              <p className="mb-6 text-[16px] font-bold leading-snug text-[#163030]">
                Bariatric Consultation<br/>
                <span className="text-[14px] font-medium text-[#5a8080]">with Dr. Preethi Mrinalini</span>
              </p>

              {/* Appointment summary card */}
              <div className="rounded-xl bg-white p-4 border border-[rgba(18,110,110,0.10)]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-[13px] text-[#3d5656]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#42c8c8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span>30 min consultation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <svg className="mt-0.5 flex-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#42c8c8" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <div>
                      <p className="text-[13px] font-semibold text-[#163030]">{time} – {END_TIME[time!]}</p>
                      <p className="text-[12px] text-[#7a9898]">{selDayName}, {MONTHS[month]} {day}, {year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-[#3d5656]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#42c8c8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>India Standard Time</span>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[12px] leading-relaxed text-[#9ab8b8]">
                We&apos;ll review your Bariatric symptoms, go through your reports, and walk you through your treatment options.
              </p>
            </div>

            {/* Right — form or success */}
            <div className="flex flex-1 flex-col overflow-y-auto px-10 py-8 max-[620px]:px-4 max-[620px]:py-5">

              {step === "form" && (
                <>
                  <img
                    src="https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png"
                    alt="Marina's"
                    className="mb-4 hidden h-12 w-auto object-contain object-left max-[620px]:block"
                  />
                  <p className="mb-1 text-[22px] font-bold text-[#163030] max-[620px]:text-[18px]">Your Details</p>
                  <p className="mb-6 text-[13px] text-[#7a9898] max-[620px]:mb-4">Fill in your info to confirm the slot.</p>

                  <form className="flex flex-col gap-4 pb-4" onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      setSubmitError("");
                      try {
                        const res = await fetch("/api/submissions", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            source:          "Bariatric-cdy-Booking",
                            firstName:       form.firstName,
                            lastName:        form.lastName,
                            email:           form.email,
                            phone:           form.phone,
                            location:        form.location,
                            dateKey:         `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                            appointmentDate: `${selDayName}, ${MONTHS[month]} ${day}, ${year}`,
                            appointmentTime: time,
                            symptomType,
                            hadSurgery,
                            primaryGoal,
                            decisionMaker,
                            timeline,
                            prevConsult,
                            pageUrl:         window.location.href,
                          }),
                        });
                        if (!res.ok) throw new Error("Submission failed");
                        router.push("/thank-you");
                      } catch {
                        setSubmitError("Something went wrong. Please try again.");
                        setSubmitting(false);
                      }
                    }}>

                    <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
                      <div>
                        <label className={labelCls}>First name <span className="text-red-400">*</span></label>
                        <input required value={form.firstName}
                          onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Last name <span className="text-red-400">*</span></label>
                        <input required value={form.lastName}
                          onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                          className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                      <input required type="email" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Phone Number <span className="text-red-400">*</span></label>
                      <div className="flex overflow-hidden rounded-xl border border-[#d4e8e8] bg-[#f8fdfd] transition focus-within:border-[#126e6e] focus-within:bg-white">
                        <div className="flex items-center gap-2 border-r border-[#d4e8e8] px-3.5 text-[13.5px] text-[#3d5656]">
                          <span>🇮🇳</span>
                          <span className="font-semibold">+91</span>
                        </div>
                        <input required type="tel" value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          className="flex-1 bg-transparent px-3.5 py-3 text-[14px] text-[#163030] outline-none placeholder:text-[#9ab8b8]" />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Where are you located? <span className="text-red-400">*</span></label>
                      <input required placeholder="City, State" value={form.location}
                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        className={inputCls} />
                    </div>

                    <div className="my-1" />

                    <RadioGroup
                      label="What type of Bariatric symptom do you have?"
                      required value={symptomType} onChange={setSymptomType}
                      options={["Abdominal bulge or lump","Groin pain or swelling","Post-pregnancy bulge (diastasis recti)","Post-surgery concern","Not sure — need evaluation"]}
                    />
                    <RadioGroup
                      label="Have you been advised surgery before?"
                      required value={hadSurgery} onChange={setHadSurgery}
                      options={["Yes — I want a second opinion","No — this is my first consultation","Currently evaluating options"]}
                    />
                    <RadioGroup
                      label="What is your primary goal with this consultation?"
                      required value={primaryGoal} onChange={setPrimaryGoal}
                      options={["Understand my condition clearly","Get a second opinion","Explore non-surgical treatment","Understand surgery risks and recovery"]}
                    />
                    <RadioGroup
                      label="Are you the decision-maker for treatment?"
                      required value={decisionMaker} onChange={setDecision}
                      options={["Yes","No","Need to discuss with family"]}
                    />
                    <RadioGroup
                      label="How soon are you planning to start treatment?"
                      required value={timeline} onChange={setTimeline}
                      options={["As soon as possible","Within 1 month","Within 3 months","Just exploring for now"]}
                    />
                    <RadioGroup
                      label="Have you consulted another doctor for this before?"
                      required value={prevConsult} onChange={setPrevConsult}
                      options={["Yes — looking for specialist opinion","No — this is my first consultation","Yes — but reports were inconclusive"]}
                    />

                    <div className="my-1" />

                    <p className="text-[12px] leading-relaxed text-[#9ab8b8]">
                      By proceeding, you agree to our{" "}
                      <span className="font-semibold text-[#126e6e]">Terms</span> and{" "}
                      <span className="font-semibold text-[#126e6e]">Privacy Notice.</span>
                    </p>

                    {submitError && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">{submitError}</p>
                    )}

                    <button type="submit" disabled={submitting}
                      className="w-full rounded-xl bg-[#126e6e] py-3.5 text-[15px] font-bold text-white transition hover:bg-[#0d5252] disabled:cursor-not-allowed disabled:opacity-60 max-[620px]:py-3">
                      {submitting ? "Submitting…" : "Confirm Appointment →"}
                    </button>
                  </form>
                </>
              )}

              {step === "success" && (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e3f9f9]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#126e6e" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <p className="mb-1 text-[22px] font-bold text-[#163030]">You&apos;re scheduled!</p>
                  <p className="text-[14px] text-[#5a8080]">{selDayName}, {MONTHS[month]} {day} · {time} IST</p>
                  <p className="mt-3 max-w-[28ch] text-[13px] leading-relaxed text-[#9ab8b8]">
                    Dr. Preethi&apos;s team will confirm your slot within 24 hours.
                  </p>
                  <button onClick={() => setOpen(false)}
                    className="mt-7 rounded-xl bg-[#126e6e] px-8 py-3 text-[14px] font-bold text-white transition hover:bg-[#0d5252]">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
