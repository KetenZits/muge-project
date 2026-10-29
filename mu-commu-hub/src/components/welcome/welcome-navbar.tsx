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

const DriftWall = dynamic(() => import("@/components/DriftWall"), {
  ssr: false,
});
const wallItems = driftImages.map((item) => ({
  image: item.src,
  title: item.alt,
}));
gsap.registerPlugin(ScrollTrigger);

export default function WelcomeNavbar() {
  const nav = useRef<HTMLElement>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const glass = useRef<HTMLDivElement>(null);
  const [wallReady, setWallReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [wallActive, setWallActive] = useState(false);

  useEffect(() => {
    const header = nav.current,
      logo = brand.current,
      content = cta.current,
      backdrop = wall.current;
    const marker = document.getElementById("welcome-final");
    if (!header || !logo || !content || !backdrop || !marker) return;
    // Mount/decode ahead of the transition and retain the tracks on reverse scroll.
    const prewarm = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWallReady(true);
          prewarm.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    prewarm.observe(marker);
    const media = gsap.matchMedia();
    media.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        animate: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const reduced = Boolean(context.conditions?.reduce);
        let shown = false,
          running = false;
        const sync = (progress: number) => {
          const nextShown = progress > 0.58,
            nextRunning = progress > 0.01;
          if (shown !== nextShown) {
            shown = nextShown;
            setExpanded(shown);
          }
          if (running !== nextRunning) {
            running = nextRunning;
            setWallActive(running);
            if (running) setWallReady(true);
          }
        };
        // All geometry is read only on setup/refresh. Header, CTA and wall retain
        // their final dimensions throughout the scrub, avoiding descendant layout.
        const compact = () => {
          const mobile = window.innerWidth < 640;
          const box = header.getBoundingClientRect();
          const x = mobile
            ? 14 - box.left
            : Math.max(20, (window.innerWidth - 1080) / 2) - box.left;
          const y = (mobile ? 14 : 20) - box.top;
          const width = mobile
            ? window.innerWidth - 28
            : Math.min(1080, window.innerWidth - 40);
          const height = mobile ? 60 : 66;
          return {
            x,
            y,
            clip: `inset(${y}px ${box.width - x - width}px ${box.height - y - height}px ${x}px round ${height / 2}px)`,
          };
        };
        const finalClip = () =>
          `inset(0px 0px 0px 0px round ${window.innerWidth < 640 ? 26 : 30}px)`;
        gsap.set(header, { opacity: 1 });
        gsap.set([content, backdrop], { autoAlpha: 0 });
        if (reduced) {
          const collapse = () => {
            const box = compact();
            gsap.set(header, { clipPath: box.clip });
            gsap.set(logo, { x: box.x, y: box.y });
            gsap.set(surface.current, { opacity: 0 });
            gsap.set(glass.current, { autoAlpha: 1 });
            gsap.set([content, backdrop], { autoAlpha: 0 });
            sync(0);
          };
          const expand = () => {
            gsap.set(header, { clipPath: finalClip() });
            gsap.set(logo, { x: 0, y: 0 });
            gsap.set(surface.current, { opacity: 1 });
            gsap.set(glass.current, { autoAlpha: 0 });
            gsap.set(content, { autoAlpha: 1 });
            gsap.set(backdrop, { autoAlpha: 0.58 });
            sync(1);
          };
          collapse();
          ScrollTrigger.create({
            trigger: marker,
            start: "top 30%",
            onEnter: expand,
            onLeaveBack: collapse,
            onRefresh: (self) => (self.progress > 0 ? expand() : collapse()),
          });
          return;
        }
        const timeline = gsap.timeline({
          onUpdate() {
            sync(this.progress());
          },
          scrollTrigger: {
            trigger: marker,
            start: () => (window.innerWidth >= 900 ? "top 50%" : "top 85%"),
            end: "top 3%",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });
        timeline.fromTo(
          header,
          { clipPath: () => compact().clip },
          { clipPath: finalClip, duration: 1, ease: "none" },
          0,
        );
        timeline.fromTo(
          logo,
          { x: () => compact().x, y: () => compact().y },
          { x: 0, y: 0, duration: 1, ease: "none" },
          0,
        );
        timeline.fromTo(
          surface.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "none" },
          0,
        );
        timeline.fromTo(
          glass.current,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.25, ease: "none" },
          0,
        );
        timeline.fromTo(
          backdrop,
          { autoAlpha: 0 },
          { autoAlpha: 0.58, duration: 0.38, ease: "none" },
          0.4,
        );
        timeline.fromTo(
          content,
          { autoAlpha: 0, y: 38 },
          { autoAlpha: 1, y: 0, duration: 0.38, ease: "power2.out" },
          0.62,
        );
      },
    );
    return () => {
      prewarm.disconnect();
      media.revert();
    };
  }, []);

  return (
    <header
      ref={nav}
      className={expanded ? "welcome-navbar is-expanded" : "welcome-navbar"}
    >
      <div
        ref={glass}
        className="welcome-nav-glass"
        aria-hidden="true"
        style={{
          backdropFilter: "blur(22px) saturate(140%)",
          WebkitBackdropFilter: "blur(22px) saturate(140%)",
        }}
      />
      <div ref={surface} className="welcome-nav-surface" aria-hidden="true" />
      <Link
        href="/"
        ref={brand}
        className="welcome-navbar-brand"
        aria-label="MU Connect welcome page"
      >
        MU <span>CONNECT</span>
      </Link>
      <div ref={wall} className="welcome-nav-wall" aria-hidden="true" inert>
        {wallReady && (
          <DriftWall
            decorative
            active={wallActive}
            items={wallItems}
            columns={5}
            tileWidth={215}
            tileHeight={160}
            gap={19}
            radius={16}
            tilt={11}
            turn={-10}
            speed={15}
            variance={0.18}
            dim={0.74}
          />
        )}
      </div>
      <div className="welcome-nav-overlay" aria-hidden="true" />
      <div
        ref={cta}
        className="welcome-nav-cta"
        aria-hidden={!expanded}
        inert={!expanded}
      >
        <span className="welcome-nav-kicker">YOUR NEXT CHAPTER IS WAITING</span>
        {expanded ? (
          <>
            <h2>
              <SplitText
                text="Find your people."
                tag="span"
                className="welcome-cta-split"
                trigger="load"
                effect="rise"
                splitType="words"
                delay={95}
                duration={0.92}
              />
              <br />
              <em className="welcome-cta-emphasis">
                <SplitText
                  text="Build something"
                  tag="span"
                  className="welcome-cta-split"
                  trigger="load"
                  effect="blur"
                  splitType="words"
                  delay={92}
                  duration={0.95}
                />{" "}
                <GradientText
                  colors={["#f6d184", "#ffffff", "#f9d575"]}
                  animationSpeed={13}
                  scale={2.4}
                  className="welcome-cta-gradient"
                >
                  together.
                </GradientText>
              </em>
            </h2>
            <BlurText
              text="One connection can change what's possible."
              className="welcome-cta-description"
              trigger="load"
              animateBy="words"
              effect="focus"
              delay={45}
              stepDuration={0.24}
            />
          </>
        ) : (
          <>
            <h2>
              Find your people.
              <br />
              <em>Build something together.</em>
            </h2>
            <p>One connection can change what&apos;s possible.</p>
          </>
        )}
        <Link
          href="/login"
          className="welcome-start-button"
          tabIndex={expanded ? 0 : -1}
        >
          Start <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
      <div className="welcome-nav-foot" aria-hidden={!expanded}>
        <span>MU CONNECT / AN INDEPENDENT PROTOTYPE</span>
        <span>MADE FOR WHAT&apos;S NEXT · 2026</span>
      </div>
    </header>
  );
}
