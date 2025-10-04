"use client";
import { Button } from "@/app/components/ui/button";
import { Container } from "./container";

export default function CtaBand() {
  return (
    <section id="pricing" className="section-y">
      <Container>
        <div className="relative overflow-hidden rounded-xl border p-8 md:p-12 brand-gradient text-white">
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold">
                Grow your digital selling empire
              </h3>
              <p className="mt-2 max-w-xl text-white/85">
                Spin up your storefront in minutes and turn followers into loyal
                customers.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="brand" className="shadow">
                Start free
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Book demo
              </Button>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
        </div>
      </Container>
    </section>
  );
}
