"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@vendly/ui/lib/utils";
import Image from "next/image";

type ImageItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  span: string;
};

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems }) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-background py-2 sm:py-4"
    >
      {/* Optional heading / intro */}
      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-4 text-center"
      >
        {/* content here */}
      </motion.div>

      {/* Viewport wrapper (scrollable) */}
      <div
        className="
        relative mt-0 ml-2 w-full overflow-x-auto pb-4 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        cursor-default
      "
      >
        {/* Scrollable track */}
        <div className="min-w-full w-max pr-4">
          {/* Grid */}
          <motion.div
            className="
            grid grid-flow-col grid-rows-2
            auto-cols-[9rem] gap-2 px-2

            md:grid-flow-row md:grid-rows-none
            md:grid-cols-4 lg:grid-cols-5
            md:auto-cols-auto md:px-5
          "
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {imageItems.map((item) => (
              <motion.div
                key={item.id}
                className={cn(
                  "group relative flex h-full min-h-36 w-full min-w-0 cursor-pointer items-end overflow-hidden rounded-lg border border-border/60 bg-card p-2 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-w-44 md:p-2.5",
                  item.span,
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                tabIndex={0}
                aria-label={`View ${item.title}`}
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 70vw, 50vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                {/* Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                {/* Text */}
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold leading-tight tracking-tight text-white md:text-base">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );

};

export default InteractiveImageBentoGallery;
