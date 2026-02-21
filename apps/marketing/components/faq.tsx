'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

const faqItems = [
  {
    id: "item-1",
    question: "Do buyers need to create an account?",
    answer: "No. Name, phone, address, pay. That's it. We removed every step that wasn't absolutely necessary — because every extra field loses you a sale.",
  },
  {
    id: "item-2",
    question: "What if I don't have many followers yet?",
    answer: "Then every buyer you do reach matters more. Shopvendly makes sure none of them fall through the cracks. Start with 100 followers. Grow from there.",
  },
  {
    id: "item-3",
    question: "How does the creator referral work?",
    answer: "You generate a product link with a creator's tag. They share it. When someone buys through it, both dashboards show the sale. You set the commission. We track it automatically.",
  },
  {
    id: "item-4",
    question: "Is it really free to start?",
    answer: "Yes. Your first 10 completed orders cost you nothing. After that, we take 4% of each sale. No monthly subscription, no upfront cost. You only pay when you make money.",
  },
  {
    id: "item-5",
    question: "What about delivery?",
    answer: "Your buyer gives their address at checkout. You arrange delivery your way — your rider, your boda, whatever works. We handle the order and the payment. You handle the last mile.",
  },
  {
    id: "item-6",
    question: "Can I use it for TikTok too?",
    answer: "Yes. The link works anywhere. Post it anywhere — Instagram bio, TikTok caption, WhatsApp status. It always leads back to your Shopvendly store.",
  },
];

export function FAQ() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Left: Heading */}
          <div className="md:sticky md:top-28">
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#5B4BFF] mb-5">FAQ</div>
            <h2
              className="text-[clamp(32px,5vw,52px)] font-extrabold text-[#0A0A0F] leading-[1.06] mb-5"
              style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1.5px' }}
            >
              Good<br />questions.
            </h2>
            <p className="text-[15px] text-[#3D3D4E] leading-relaxed mb-6">
              Everything you need to know about selling on Shopvendly.
            </p>
            <Link
              href="mailto:hello@vendlyafrica.store"
              className="text-[13px] font-semibold text-[#5B4BFF] hover:underline"
            >
              Still have questions? Contact us →
            </Link>
          </div>

          {/* Right: Accordion */}
          <div>
            <Accordion type="single" collapsible className="flex flex-col divide-y divide-[#EBEBF0]">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-0 py-1">
                  <AccordionTrigger
                    className="text-[15px] font-bold text-[#0A0A0F] text-left py-5 hover:no-underline cursor-pointer hover:text-[#5B4BFF] transition-colors"
                    style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-[14px] text-[#8A8A9E] leading-relaxed pb-5">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
