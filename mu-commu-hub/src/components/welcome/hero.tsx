"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/SplitText";
import GradientText from "@/components/GradientText";
import { welcomeCollage } from "@/data/welcome";

const LightRays = dynamic(() => import("@/components/LightRays"), { ssr: false });
const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false });
const UniversityEmblem = dynamic(() => import("./university-emblem"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [wide, setWide] = useState(false);
  const [headlineReady, setHeadlineReady] = useState(false);

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
        const item = welcomeCollage[index];
        gsap.fromTo(card,
          { x: 0, y: 0, rotation: item.baseRotation, opacity: 1 },
          {
            x: () => item.scatterX * (window.innerWidth < 700 ? 0.5 : window.innerWidth < 1200 ? 0.72 : 1),
            y: () => item.scatterY * (window.innerWidth < 700 ? 0.6 : 1),
            rotation: item.baseRotation + item.scatterRotation,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: desktop ? root.current : ".welcome-white-hero",
              start: desktop ? "top top" : "top 35%",
              end: desktop ? () => `+=${Math.round(window.innerHeight * 0.6)}` : "bottom 25%",
              scrub: 0.8,
              invalidateOnRefresh: true,
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
        {wide && !reduced && <Galaxy className="welcome-galaxy" aria-hidden="true" density={0.78} layers={3} starSpeed={0.78} speed={0.9} rotationSpeed={0.025} twinkleIntensity={0.95} starSize={0.78} glowIntensity={0.38} flareIntensity={0.32} starColors={["#ffffff", "#d6e9ff", "#9bd8ff", "#77a9e8"]} mouseInteraction mouseRepulsion={false} clickWarp={false} intro={false} transparent dpr={1} opacity={0.9} />}
        <div className="welcome-ambient-words" aria-hidden="true"><span>CONNECT</span><span>CREATE</span><span>COLLABORATE</span></div>
        {!reduced && <LightRays className="welcome-light-rays" raysOrigin="top-center" raysColor="#b8dcff" raysSpeed={0.6} lightSpread={0.43} rayLength={2.15} rayDensity={1.16} raySharpness={0.68} glow={0.72} haze={0.18} atmosphere={0.58} intensity={1.4} fadeDistance={1.2} pulsating followMouse mouseInfluence={0.08} cursorShadow={false} clickPulse={false} intro={false} maxDevicePixelRatio={1.2} />}
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
          {welcomeCollage.map((item, index) => (
            <div key={item.id} className={`welcome-collage-card welcome-collage-${item.id}`} data-mobile={item.mobile} data-tablet={item.tablet}>
              <div className="welcome-collage-float" style={{ "--float-duration": `${item.floatDuration}s`, "--float-delay": `${index * -0.57}s` } as CSSProperties}>
                <Image src={item.image} alt="" fill sizes="(max-width: 699px) 120px, (max-width: 1199px) 150px, 210px" className="welcome-collage-image" priority={index < 2} />
                <span className="welcome-collage-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="welcome-hero-copy">
          <span className="welcome-eyebrow"><i /> THE NEXT CHAPTER STARTS HERE</span>
          <div className={`welcome-wordmark-stack ${headlineReady ? "is-ready" : ""}`}>
            <SplitText text="MU CONNECT" tag="h1" className="welcome-wordmark" trigger="load" effect="rise" splitType="chars" delay={70} duration={1.15} from={{ opacity: 0, y: 68, filter: "blur(12px)" }} to={{ opacity: 1, y: 0, filter: "blur(0px)" }} onLetterAnimationComplete={() => setHeadlineReady(true)} />
            <span className="welcome-wordmark-sheen" aria-hidden="true"><GradientText colors={["#0d2e58", "#1b5da8", "#7db8ed", "#164d91"]} animationSpeed={12} scale={2.8} variant="linear" yoyo className="welcome-wordmark-gradient">MU CONNECT</GradientText></span>
          </div>
          <p>Meet the people who make your next idea possible.</p>
          <span className="welcome-scroll-hint"><span /> SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
}
