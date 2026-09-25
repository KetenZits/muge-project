"use client";

import { useReducedMotion } from "motion/react";
import { motionTiming } from "./config";

export function useCardMotion({
  reveal = false,
  delay = 0,
}: {
  reveal?: boolean;
  delay?: number;
} = {}) {
  const reducedMotion = useReducedMotion();

  return {
    initial: reveal && !reducedMotion ? { opacity: 0, y: 12 } : false,
    whileInView: reveal ? { opacity: 1, y: 0 } : undefined,
    viewport: reveal ? { once: true, amount: 0.08 } : undefined,
    whileHover: reducedMotion
      ? undefined
      : { y: -3, transition: { duration: motionTiming.fast } },
    transition: {
      duration: reducedMotion ? 0 : motionTiming.normal,
      ease: motionTiming.easeOut,
      delay: reducedMotion ? 0 : delay,
    },
  };
}
