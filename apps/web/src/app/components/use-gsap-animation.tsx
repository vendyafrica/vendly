"use client"
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

export const useGsapAnimation = (scope: React.RefObject<HTMLElement | null>) => {
  useLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 0.8 }
      );
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 1 }
      );
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 1.2 }
      );
      gsap.fromTo(
        ".storefront-ui",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.75)", delay: 1.5 }
      );

      // Floating animations for decorative cards
      const floatingCards = gsap.utils.toArray(".floating-card");
      floatingCards.forEach((card, i) => {
        gsap.fromTo(
          card as gsap.TweenTarget,
          { y: 0, rotate: 0 },
          {
            y: `random(-20, 20)`,
            rotate: `random(-5, 5)`,
            duration: `random(3, 5)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          }
        );
      });

      // Scroll-triggered animations for features section
      const tlFeatures = gsap.timeline({
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      });
      tlFeatures.fromTo(
        ".feature-card",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );

      // Scroll-triggered timeline for "how it works" section
      const tlHow = gsap.timeline({
        scrollTrigger: {
          trigger: ".how-section",
          start: "top center",
          end: "bottom center",
          scrub: 1,
          markers: false,
        },
      });
      tlHow.fromTo(
        ".timeline-step",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.3, ease: "power3.out" }
      );
    }, scope);

    return () => ctx.revert();
  }, [scope]);
};