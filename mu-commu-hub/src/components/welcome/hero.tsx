"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/SplitText";

const LightRays = dynamic(() => import("@/components/LightRays"), { ssr: false });
const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false });
const UniversityEmblem = dynamic(() => import("./university-emblem"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

const collage = [
  { src: "/images/welcome/programming.png", name: "Programming", className: "welcome-collage-one", x: -210, y: -110, base: -8, rotate: -16 },
  { src: "/images/welcome/design.png", name: "Design", className: "welcome-collage-two", x: -250, y: 135, base: 9, rotate: 20 },
  { src: "/images/welcome/collaboration.png", name: "Collaboration", className: "welcome-collage-three", x: 240, y: -100, base: 7, rotate: 16 },
  { src: "/images/welcome/pitching.png", name: "Pitching", className: "welcome-collage-four", x: 220, y: 145, base: -9, rotate: -18 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const spacious = window.matchMedia("(min-width: 1200px)");
    const sync = () => { setReduced(media.matches); setWide(spacious.matches); };
    sync();
    media.addEventListener("change", sync);
    spacious.addEventListener("change", sync);
    return () => { media.removeEventListener("change", sync); spacious.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    if (!root.current || reduced) return;
    const context = gsap.context(() => {
      const desktop = window.matchMedia("(min-width: 900px)").matches;
      const cards = gsap.utils.toArray<HTMLElement>(".welcome-collage-card");
      cards.forEach((card, index) => {
        const item = collage[index];
        gsap.fromTo(card,
          { x: 0, y: 0, rotation: item.base, opacity: 1 },
          {
            x: item.x, y: item.y, rotation: item.base + item.rotate, opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: desktop ? root.current : ".welcome-white-hero",
              start: desktop ? "top top" : "top 35%",
              end: desktop ? () => `+=${Math.round(window.innerHeight * 0.6)}` : "bottom 25%",
              scrub: 0.8,
            },
          },
        );
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  return (
    <section ref={root} className="welcome-hero" aria-labelledby="welcome-title">
      <div className="welcome-blue-hero">
        <div className="welcome-blue-grain" aria-hidden="true" />
        <div className="welcome-css-stars" aria-hidden="true" />
        {wide && !reduced && <Galaxy className="welcome-galaxy" aria-hidden="true" density={0.62} layers={2} starSpeed={0.07} speed={0.28} rotationSpeed={0.006} twinkleIntensity={0.55} starSize={0.9} glowIntensity={0.55} flareIntensity={0.45} starColors={["#ffffff", "#d6e9ff", "#9bd8ff", "#77a9e8"]} mouseInteraction={false} mouseRepulsion={false} clickWarp={false} intro={false} transparent dpr={1} opacity={0.85} />}
        <div className="welcome-ambient-words" aria-hidden="true"><span>CONNECT</span><span>CREATE</span><span>COLLABORATE</span></div>
        {!reduced && <LightRays className="welcome-light-rays" raysOrigin="top-center" raysColor="#c4e2ff" raysSpeed={0.28} lightSpread={0.47} rayLength={2.15} rayDensity={1.08} raySharpness={0.54} glow={0.76} haze={0.35} atmosphere={0.78} intensity={1.32} fadeDistance={1.2} pulsating={false} followMouse={false} intro={false} maxDevicePixelRatio={1.25} />}
        <span className="welcome-blue-orbit welcome-blue-orbit-one" aria-hidden="true" />
        <span className="welcome-blue-orbit welcome-blue-orbit-two" aria-hidden="true" />
        <UniversityEmblem />
        <div className="welcome-hero-caption" aria-hidden="true">
          <span>IDEAS FIND THEIR PEOPLE</span>
          <span>EST. ON CAMPUS · 2026</span>
        </div>
        <svg className="welcome-hero-curve" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 8 C330 150 1055 150 1440 8 L1440 160 L0 160 Z" fill="white" />
        </svg>
      </div>
      <div className="welcome-white-hero">
        <div className="welcome-collage" aria-hidden="true">
          {collage.map((item) => (
            <div key={item.name} className={`welcome-collage-card ${item.className}`}>
              <Image src={item.src} alt="" fill sizes="(max-width: 640px) 135px, 230px" className="welcome-collage-image" priority={item.name === "Programming"} />
              <span className="welcome-collage-label">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="welcome-hero-copy">
          <span className="welcome-eyebrow"><i /> THE NEXT CHAPTER STARTS HERE</span>
          <SplitText text="MU CONNECT" tag="h1" className="welcome-wordmark" trigger="load" effect="rise" splitType="chars" delay={70} duration={1.15} from={{ opacity: 0, y: 68, filter: "blur(12px)" }} to={{ opacity: 1, y: 0, filter: "blur(0px)" }} />
          <p>Meet the people who make your next idea possible.</p>
          <span className="welcome-scroll-hint"><span /> SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
}
