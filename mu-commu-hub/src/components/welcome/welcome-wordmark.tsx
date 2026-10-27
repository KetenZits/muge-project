"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GradientText from "@/components/GradientText";
import StrokeText from "@/components/StrokeText";

interface WordmarkMetrics {
  size: number;
  family: string;
}

export default function WelcomeWordmark({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [complete, setComplete] = useState(false);
  const [metrics, setMetrics] = useState<WordmarkMetrics | null>(null);
  const finish = useCallback(() => setComplete(true), []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const measure = () => {
      const style = getComputedStyle(node);
      const size = Number.parseFloat(style.fontSize);
      const family = style.fontFamily;
      setMetrics((previous) => previous && Math.abs(previous.size - size) < 0.5 && previous.family === family
        ? previous
        : { size, family });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div ref={root} className={`welcome-wordmark-stack ${visible && !reduced ? "is-animating" : ""} ${complete || reduced ? "is-ready" : ""}`}>
      <h1 className="welcome-wordmark">MU CONNECT</h1>
      {visible && metrics && !reduced && (
        <span className="welcome-wordmark-outline" aria-hidden="true">
          <StrokeText
            text="MU CONNECT"
            trigger="mount"
            fontSize={metrics.size}
            fontFamily={metrics.family}
            fontWeight={800}
            letterSpacing={metrics.size * -0.09}
            strokeColor="#1765b0"
            fillColor="#103b70"
            strokeWidth={Math.max(1.15, metrics.size * 0.013)}
            drawDuration={1.08}
            fillDelay={0.05}
            stagger={0.035}
            fillMode="wipe"
            ease="power2.inOut"
            onComplete={finish}
          />
        </span>
      )}
      <span className="welcome-wordmark-sheen" aria-hidden="true">
        <GradientText colors={["#003366", "#0057b8", "#2188e8", "#70c9ff", "#124b90"]} animationSpeed={8} scale={2.5} variant="linear" yoyo className="welcome-wordmark-gradient">MU CONNECT</GradientText>
      </span>
    </div>
  );
}
