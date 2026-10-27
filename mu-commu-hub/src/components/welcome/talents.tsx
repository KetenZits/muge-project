"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/SplitText";
import { welcomeTalents, type WelcomeTalent } from "@/data/welcome";

gsap.registerPlugin(ScrollTrigger);

const INTRO_END = 0.115;
const SECOND_PROFILE_START = 0.195;
const PROFILE_STEP = 0.15;

function categoryForProgress(progress: number) {
  return progress < SECOND_PROFILE_START
    ? 0
    : Math.min(welcomeTalents.length - 1, 1 + Math.floor((progress - SECOND_PROFILE_START) / PROFILE_STEP));
}

function TalentCard({ talent, reduced }: { talent: WelcomeTalent; reduced: boolean }) {
  const isPresent = useIsPresent();
  return (
    <motion.article
      className="welcome-talent-card"
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, y: reduced ? 0 : -8, transition: { duration: reduced ? 0.01 : 0.36, ease: "easeInOut" } }}
      aria-hidden={!isPresent}
      style={{ "--talent-accent": talent.accent, pointerEvents: isPresent ? "auto" : "none" } as React.CSSProperties}
    >
      <div className="welcome-talent-photo"><Image src={talent.image} alt={talent.imageAlt} fill sizes="(max-width: 900px) 90vw, 560px" className="welcome-talent-photo-image" /></div>
      <div className="welcome-talent-details">
        <span className="welcome-talent-index">FICTIONAL PROFILE / STOCK PHOTOGRAPHY</span>
        <div>
          <span className="welcome-talent-category">{talent.category} / EXAMPLE PROFILE</span>
          <h3>{talent.name}<span>.</span></h3>
          <strong>{talent.role}</strong>
          <p className="welcome-talent-description">{talent.description}</p>
          <div className="welcome-talent-skills">{talent.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        <span className="welcome-talent-project">{talent.project}</span>
      </div>
    </motion.article>
  );
}

export default function Talents() {
  const root = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  const layout = useRef<HTMLDivElement>(null);
  const cardAnchor = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setDesktop(wide.matches); setReduced(motionPreference.matches); };
    sync();
    wide.addEventListener("change", sync);
    motionPreference.addEventListener("change", sync);
    return () => { wide.removeEventListener("change", sync); motionPreference.removeEventListener("change", sync); };
  }, []);

  useLayoutEffect(() => {
    if (!desktop || reduced || !root.current || !nav.current || !layout.current || !cardAnchor.current) return;
    const section = root.current;
    const categories = nav.current;
    const grid = layout.current;
    const anchor = cardAnchor.current;
    const context = gsap.context(() => {
      const buttons = gsap.utils.toArray<HTMLButtonElement>(categories.querySelectorAll("button"));
      const centeredX = () => window.innerWidth / 2 - (grid.getBoundingClientRect().right - anchor.offsetWidth / 2);
      const enlargedScale = () => Math.min(1.2, (window.innerWidth - 72) / anchor.offsetWidth);
      gsap.set(anchor, { x: centeredX, y: 18, scale: enlargedScale });
      gsap.set(categories, { autoAlpha: 0, x: -22 });
      gsap.set(buttons, { autoAlpha: 0, y: 10 });
      const intro = gsap.timeline({ paused: true });
      intro.fromTo(anchor, {
        x: centeredX,
        y: 18,
        scale: enlargedScale,
      }, { x: 0, y: 0, scale: 1, duration: 1, ease: "power2.inOut", immediateRender: true }, 0);
      intro.fromTo(categories, { autoAlpha: 0, x: -22 }, {
        autoAlpha: 1, x: 0, duration: 0.58, ease: "power2.out", immediateRender: true,
      }, 0.25);
      intro.fromTo(buttons, { autoAlpha: 0, y: 10 }, {
        autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.055, ease: "power2.out", immediateRender: true,
      }, 0.34);
      const sync = (progress: number) => {
        intro.progress(Math.min(1, progress / INTRO_END));
        const next = categoryForProgress(progress);
        if (activeRef.current !== next) {
          activeRef.current = next;
          setActive(next);
        }
      };
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => sync(self.progress),
        onRefresh: (self) => { intro.invalidate(); sync(self.progress); },
      });
    }, section);
    return () => context.revert();
  }, [desktop, reduced]);

  const choose = (index: number) => {
    if (desktop && !reduced && root.current) {
      const box = root.current.getBoundingClientRect();
      const top = window.scrollY + box.top;
      const travel = root.current.offsetHeight - window.innerHeight;
      const progress = index === 0 ? INTRO_END + 0.025 : SECOND_PROFILE_START + (index - 0.5) * PROFILE_STEP;
      window.scrollTo({ top: top + travel * progress, behavior: "smooth" });
    } else {
      activeRef.current = index;
      setActive(index);
      const container = tabs.current;
      const button = container?.querySelectorAll("button")[index];
      if (!container || !button) return;
      const containerBox = container.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      const left = container.scrollLeft + buttonBox.left - containerBox.left - (container.clientWidth - button.clientWidth) / 2;
      container.scrollTo({ left, behavior: reduced ? "instant" : "smooth" });
    }
  };

  return (
    <section ref={root} className={`welcome-talents ${reduced ? "welcome-talents-reduced" : ""}`} aria-labelledby="welcome-talents-title">
      <div className="welcome-talent-sticky">
        <div className="welcome-talent-section-label"><span className="welcome-kicker">02 / MEET THE MAKERS</span><span>EXAMPLE STUDENT PROFILES</span></div>
        <h2 id="welcome-talents-title" className="welcome-talent-heading"><SplitText text="There's room for" tag="span" className="welcome-talent-heading-first" trigger="view" effect="rise" splitType="words" duration={0.85} delay={110} textAlign="left" /> <em><SplitText text="your kind of brilliant." tag="span" className="welcome-talent-heading-emphasis" trigger="view" effect="blur" splitType="words" duration={0.9} delay={100} textAlign="left" /></em></h2>
        <div ref={tabs} className="welcome-talent-mobile-nav" role="tablist" aria-label="Talent categories">
          {welcomeTalents.map((talent, index) => (
            <button key={talent.id} id={`talent-tab-${talent.id}`} type="button" role="tab" aria-selected={active === index} aria-controls="talent-panel" tabIndex={active === index ? 0 : -1} className={active === index ? "is-active" : ""} onClick={() => choose(index)} onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                const direction = event.key === "ArrowRight" ? 1 : -1;
                const next = (index + direction + welcomeTalents.length) % welcomeTalents.length;
                choose(next);
                tabs.current?.querySelectorAll("button")[next]?.focus({ preventScroll: true });
              }
            }}>{talent.category}</button>
          ))}
        </div>
        <div ref={layout} className="welcome-talent-layout">
          <nav ref={nav} className="welcome-talent-desktop-nav" aria-label="Talent categories">
            <span>DISCOVER BY SKILL</span>
            <div className="welcome-talent-category-window"><div className="welcome-talent-category-track">
              {welcomeTalents.map((talent, index) => (
                <button key={talent.id} type="button" className={active === index ? "is-active" : ""} aria-current={active === index ? "true" : undefined} onClick={() => choose(index)}>
                  <small>0{index + 1}</small>{talent.category}<i aria-hidden="true" />
                </button>
              ))}
            </div></div>
          </nav>
          <div ref={cardAnchor} className="welcome-talent-card-anchor">
            <div className="welcome-talent-card-stage" id="talent-panel" role="tabpanel" aria-labelledby={`talent-tab-${welcomeTalents[active].id}`}>
              <AnimatePresence mode="sync" initial={false}><TalentCard key={welcomeTalents[active].id} talent={welcomeTalents[active]} reduced={reduced} /></AnimatePresence>
            </div>
          </div>
        </div>
        <span className="welcome-talent-progress">0{active + 1} <i /> 0{welcomeTalents.length}</span>
      </div>
    </section>
  );
}
