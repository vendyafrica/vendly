'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const faqItems = [
  {
    id: "item-1",
    question: "How can I sell on Instagram without a website?",
    answer:
      "Vendly gives you a storefront link you can place in your Instagram bio. You can list products, organize your catalog, and start receiving WhatsApp orders without building a full ecommerce website.",
  },
  {
    id: "item-2",
    question: "Can customers place orders through WhatsApp?",
    answer:
      "Yes. Buyers can browse your storefront and place orders directly through WhatsApp, making it easy to close sales through chat.",
  },
  {
    id: "item-3",
    question: "How do I create an Instagram storefront link?",
    answer:
      "After you set up your products in Vendly, you get one storefront link. Add that link to your Instagram bio, stories, and DMs so customers can browse and order quickly.",
  },
  {
    id: "item-4",
    question: "Is Vendly built for African sellers?",
    answer:
      "Yes. Vendly is designed for African social sellers and small businesses that rely on Instagram and WhatsApp to manage orders and customer conversations.",
  },
  {
    id: "item-5",
    question: "Can I share my store on TikTok and Facebook too?",
    answer:
      "Yes. Your storefront link works across social channels, including TikTok, Facebook, and WhatsApp, so you can drive sales from anywhere you have an audience.",
  },
];

export function FAQ() {
  return (
    <section className="bg-background @container py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-[10vw] md:text-[6vw] font-black tracking-tighter uppercase leading-[0.85] text-balance">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg sm:text-2xl font-mono font-bold lowercase text-balance">
            Everything you need to know about selling on Instagram with Vendly.
          </p>
        </div>
        <Card className="mt-12 p-2">
          <Accordion type="single" collapsible>
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b-0 px-4">
                <AccordionTrigger className="cursor-pointer py-4 text-base md:text-lg font-black tracking-tighter uppercase text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground pb-4 text-base font-mono font-bold lowercase">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Still have questions?{" "}
          <Link href="#" className="text-primary font-medium hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </section>
  );
}
