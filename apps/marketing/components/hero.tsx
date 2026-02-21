
"use client"

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Ensure the video plays automatically on load
      videoRef.current.play().catch(error => {
        console.log("Video auto-play was prevented by browser:", error);
      });
    }
  }, []);

  return (
    <main className="relative overflow-hidden min-h-screen flex flex-col items-center justify-end pt-24 pb-16 md:pb-24">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://cdn.cosmos.so/08020ebf-2819-4bb1-ab66-ae3642a73697.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay Gradient for Readability */}
      <div className="absolute inset-0 bg-black/50 z-1 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/60 z-2 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <h1 className="text-center text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-semibold tracking-[-0.03em] text-white leading-[1.05] drop-shadow-lg">
            Commerce built for <span className="text-white/60">Social brands.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-center text-lg md:text-xl text-white/80 font-medium leading-relaxed drop-shadow-md">
            Sell through your social media and content.
          </p>
        </motion.div>
      </div>
    </main>
  )
}

