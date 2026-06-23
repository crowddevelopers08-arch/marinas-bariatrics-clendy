import { faqs } from "./data";
import FaqAccordion from "./FaqAccordion";
import { SectionHeading } from "./Shared";

export default function FaqSection() {
  return (
    <section className="bg-[#f4fefe]">
      <div className="w-[min(1080px,92%)] mx-auto text-center">
        <SectionHeading eyebrow="Common Questions" title="Your Bariatric Surgery Questions, Answered" center />
      </div>
      <div className="w-[min(1080px,92%)] mx-auto mt-[34px]">
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
