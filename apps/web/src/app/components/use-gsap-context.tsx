"use client"
import { createContext, useContext } from "react";
import gsap from "gsap";

const GsapContext = createContext<gsap.core.Timeline | null>(null);

export const GsapProvider = GsapContext.Provider;

export const useGsapContext = () => {
  const context = useContext(GsapContext);
  if (!context) {
    throw new Error("useGsapContext must be used within a GsapProvider");
  }
  return context;
};