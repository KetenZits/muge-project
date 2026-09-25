export const motionTiming = {
  fast: 0.16,
  normal: 0.28,
  large: 0.55,
  easeOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  softSpring: { type: "spring" as const, stiffness: 260, damping: 30 },
  quickSpring: { type: "spring" as const, stiffness: 420, damping: 30 },
};
