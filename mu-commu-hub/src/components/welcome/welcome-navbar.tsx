"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/SplitText";
import GradientText from "@/components/GradientText";
import BlurText from "@/components/BlurText";
import driftImages from "@/data/drift-wall-images.json";

const DriftWall = dynamic(() => import("@/components/DriftWall"), { ssr: false });
gsap.registerPlugin(ScrollTrigger);

export default function WelcomeNavbar() {
  const nav = useRef<HTMLElement>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const [wallReady, setWallReady] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const header = nav.current;
    const logo = brand.current;
    const content = cta.current;
    const backdrop = wall.current;
    const marker = document.getElementById("welcome-final");
    if (!header || !logo || !content || !backdrop || !marker) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const expandedPosition = () => window.innerWidth < 640
      ? { top: 12, left: 12, width: "calc(100% - 24px)", height: "calc(100dvh - 24px)", borderRadius: 26 }
      : { top: 16, left: 16, width: "calc(100% - 32px)", height: "calc(100dvh - 32px)", borderRadius: 30 };
    const syncExpanded = () => {
      const top = marker.getBoundingClientRect().top;
      if (top < window.innerHeight) setWallReady(true);
      else if (top > window.innerHeight * 1.5) setWallReady(false);
      setExpanded(top < window.innerHeight * 0.4);
    };
    const context = gsap.context(() => {
      if (reduced) {
        gsap.set(header, { yPercent: 0, opacity: 1 });
        const enter = () => {
          setWallReady(true);
          setExpanded(true);
          gsap.set(header, { ...expandedPosition(), backgroundColor: "#071e40" });
          gsap.set([content, backdrop], { autoAlpha: 1 });
        };
        const leave = () => {
          setWallReady(false);
          setExpanded(false);
          gsap.set(header, { clearProps: "top,left,width,height,borderRadius,backgroundColor,boxShadow" });
          gsap.set([content, backdrop], { autoAlpha: 0 });
        };
        ScrollTrigger.create({ trigger: marker, start: "top 30%", onEnter: enter, onLeaveBack: leave });
        return;
      }

      gsap.fromTo(header, { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, ease: "power3.out", delay: 0.08 });
      gsap.set([content, backdrop], { autoAlpha: 0 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: marker,
          start: () => window.innerWidth >= 900 ? "top 50%" : "top 85%",
          end: "top 3%",
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.03) setWallReady(true);
          },
        },
      });
      timeline.to(header, {
        top: () => expandedPosition().top,
        left: () => expandedPosition().left,
        width: () => expandedPosition().width,
        height: () => expandedPosition().height,
        borderRadius: () => expandedPosition().borderRadius,
        backgroundColor: "#071e40", boxShadow: "0 22px 80px rgba(5, 27, 61, .23)",
        ease: "none", duration: 1,
      }, 0);
      timeline.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 0.58, duration: 0.38, ease: "none" }, 0.4);
      timeline.fromTo(content, { autoAlpha: 0, y: 38, filter: "blur(14px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.38, ease: "power2.out" }, 0.62);
    }, header);
    if (!reduced) {
      window.addEventListener("scroll", syncExpanded, { passive: true });
      window.addEventListener("resize", syncExpanded);
      syncExpanded();
    }
    return () => {
      window.removeEventListener("scroll", syncExpanded);
      window.removeEventListener("resize", syncExpanded);
      context.revert();
    };
  }, []);

  return (
    <header ref={nav} className={expanded ? "welcome-navbar is-expanded" : "welcome-navbar"} style={{ backdropFilter: "blur(22px) saturate(140%)", WebkitBackdropFilter: "blur(22px) saturate(140%)" }}>
      <Link href="/" ref={brand} className="welcome-navbar-brand" aria-label="MU Connect welcome page">MU <span>CONNECT</span></Link>
      <div ref={wall} className="welcome-nav-wall" aria-hidden="true" inert>
        {wallReady && <DriftWall items={driftImages.map((item) => ({ image: item.src, title: item.alt }))} columns={5} tileWidth={215} tileHeight={160} gap={19} radius={16} tilt={11} turn={-10} speed={15} variance={0.18} parallax={0.25} dim={0.74} fade={0.48} overlayColor="#102d58" />}
      </div>
      <div className="welcome-nav-overlay" aria-hidden="true" />
      <div ref={cta} className="welcome-nav-cta" aria-hidden={!expanded}>
        <span className="welcome-nav-kicker">YOUR NEXT CHAPTER IS WAITING</span>
        {expanded ? (
          <>
            <h2><SplitText text="Find your people." tag="span" className="welcome-cta-split" trigger="load" effect="rise" splitType="words" delay={95} duration={0.92} /><br /><em className="welcome-cta-emphasis"><SplitText text="Build something" tag="span" className="welcome-cta-split" trigger="load" effect="blur" splitType="words" delay={92} duration={0.95} /> <GradientText colors={["#f6d184", "#ffffff", "#f9d575"]} animationSpeed={13} scale={2.4} className="welcome-cta-gradient">together.</GradientText></em></h2>
            <BlurText text="One connection can change what's possible." className="welcome-cta-description" trigger="load" animateBy="words" effect="focus" delay={45} stepDuration={0.24} />
          </>
        ) : (
          <><h2>Find your people.<br /><em>Build something together.</em></h2><p>One connection can change what&apos;s possible.</p></>
        )}
        <Link href="/login" className="welcome-start-button" tabIndex={expanded ? 0 : -1}>Start <ArrowUpRight size={20} aria-hidden="true" /></Link>
      </div>
      <div className="welcome-nav-foot" aria-hidden={!expanded}><span>MU CONNECT / AN INDEPENDENT PROTOTYPE</span><span>MADE FOR WHAT&apos;S NEXT · 2026</span></div>
    </header>
  );
}
