import React from "react";
import { Timeline } from "@vendly/ui/components/timeline";

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
    <section className="bg-background" id={id}>
      <div className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Join <span className="text-primary">Vendly</span> and see how easy selling can be
          </h2>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-4xl overflow-clip">
          <Timeline data={data} />
        </div>
        
        <div className="mx-auto mt-16 max-w-3xl bg-background">
          <h3 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
            <span className="text-primary">Why </span>it works for you
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>No migration. Quick setup.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Built in tools for your business.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Focus on selling and your customers.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
