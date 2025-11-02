import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function Process({id}: {id?: string}) {
  const data = [
    {
      title: "1. Connect your socials",
      content: (
        <div>
          <p className="mb-8 text-sm font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Photos, captions, prices in your posts. Vendly pulls content from
            your social media and vendly sets up your storefront in minutes.
          </p>
        </div>
      ),
    },
    {
      title: "2. Get your Storefront",
      content: (
        <div>
          <p className="mb-8 text-sm font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Get a stunning store that&apos;s made to sell. Design fast with AI,
            choose a stylish theme and remain in full control.
          </p>
        </div>
      ),
    },
    {
      title: "3. Payments and Delivery",
      content: (
        <div>
          <p className="mb-8 text-sm font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Confirm new orders from your social media and setup delivery all in
            one place.
          </p>
        </div>
      ),
    },
    {
      title: "4. You grow without stress",
      content: (
        <div>
          <p className="text-sm font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Your storefront is now your one stop for your followers to become
            buyers. Buyers come back with one tap and share beyond your network.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section id={id}>
    <div className="py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-4xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
          Join <span className="text-primary">vendly</span> and see how easy
          selling can be
        </h2>
      </div>

      <div className="relative mx-auto mt-12 w-full max-w-4xl overflow-clip">
        <Timeline data={data} />
      </div>
      <div className="mx-auto mt-16 max-w-3xl text-left">
        <h3 className="mb-4 text-4xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
          Why it <span className="text-primary">works</span> for you
        </h3>
        <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>No migration. Quick setup.</li>
          <li>Built in tools for your business.</li>
          <li>Focus on selling and your customers.</li>
        </ul>
      </div>
    </div>
    </section>
  );
}
