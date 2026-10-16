"use client";

import { motion, useReducedMotion } from "motion/react";
import { motionTiming } from "@/lib/motion/config";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      // The first render must match the server, where motion preferences are
      // unknown. Reduced motion reveals immediately, including offscreen copy.
      initial={{ opacity: 0, y }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reducedMotion ? 0 : motionTiming.large,
        ease: motionTiming.easeOut,
        delay: reducedMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
