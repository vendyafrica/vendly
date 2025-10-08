import { useState } from "react";
import { Menu, Sparkle, Sparkles, X } from "lucide-react";

export default function HeroSection() {


  return (
    <div className="overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:pt-20 xl:pb-0">
        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-flex px-4 py-2 text-base text-gray-700 border border-gray-300 rounded-full bg-white/60 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 mr-2" />
              Launch your store in minutes
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
              A New Way to Build, Sell, Deliver.
            </h1>
            <p className="max-w-md mx-auto mt-6 text-base leading-7 text-gray-700">
              Vendly turns your WhatsApp or Instagram business into a full
              digital store complete with payments, delivery, and order
              tracking. Launch in minutes, grow for life.
            </p>
            {/* Gradient Button */}
            <div className="relative inline-flex mt-10 group">
              <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"></div>
              <a
                href="#"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
