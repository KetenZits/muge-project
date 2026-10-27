"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { welcomeTalents, type WelcomeTalent } from "@/data/welcome";

gsap.registerPlugin(ScrollTrigger);

function TalentCard({ talent, reduced }: { talent: WelcomeTalent; reduced: boolean }) {
  return (
    <motion.article
      key={talent.id}
      className="welcome-talent-card"
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: reduced ? 0.01 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ "--talent-accent": talent.accent } as React.CSSProperties}
    >
      <div className="welcome-talent-photo"><Image src={talent.image} alt={talent.imageAlt} fill sizes="(max-width: 900px) 90vw, 560px" className="welcome-talent-photo-image" /></div>
      <div className="welcome-talent-details">
        <span className="welcome-talent-index">THE PEOPLE BEHIND THE POSSIBILITIES</span>
        <div>
          <span className="welcome-talent-category">{talent.category} / EXAMPLE PROFILE</span>
          <h3>{talent.name}<span>.</span></h3>
          <strong>{talent.role}</strong>
          <p>{talent.description}</p>
          <div className="welcome-talent-skills">{talent.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        <span className="welcome-talent-project">{talent.project}</span>
      </div>
    </motion.article>
  );
}

export default function Talents() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cardStage = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!desktop || reduced || !root.current || !cardStage.current || !nav.current || !stage.current) return;
    const section = root.current;
    const profile = cardStage.current;
    const categories = nav.current;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = Math.max(0, self.progress - 0.18) / 0.7;
            const next = Math.min(welcomeTalents.length - 1, Math.floor(progress * welcomeTalents.length));
            setActive((previous) => previous === next ? previous : next);
          },
        },
      });
      timeline.to(profile, { x: "22vw", scale: 0.78, ease: "power2.inOut", duration: 0.24 }, 0);
      timeline.fromTo(categories, { opacity: 0, x: -38 }, { opacity: 1, x: 0, ease: "power2.out", duration: 0.16 }, 0.09);
      gsap.fromTo(categories.querySelectorAll("button"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.035, duration: 0.12, ease: "power2.out", scrollTrigger: { trigger: section, start: "top top", end: "+=70%", scrub: 0.5 } });
    }, section);
    return () => context.revert();
  }, [desktop, reduced]);

  const choose = (index: number) => {
    setActive(index);
    if (desktop && !reduced && root.current) {
      const box = root.current.getBoundingClientRect();
      const top = window.scrollY + box.top;
      const travel = root.current.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + travel * (0.26 + index * 0.22), behavior: "smooth" });
    } else {
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
      <div ref={stage} className="welcome-talent-sticky">
        <div className="welcome-talent-section-label"><span className="welcome-kicker">02 / MEET THE MAKERS</span><span>EXAMPLE STUDENT PROFILES</span></div>
        <h2 id="welcome-talents-title" className="welcome-talent-heading">There&apos;s room for <em>your kind of brilliant.</em></h2>
        <div ref={nav} className="welcome-talent-desktop-nav" aria-label="Talent categories">
          <span>DISCOVER BY SKILL</span>
          {welcomeTalents.map((talent, index) => (
            <button key={talent.id} type="button" className={active === index ? "is-active" : ""} aria-current={active === index ? "true" : undefined} onClick={() => choose(index)}>
              <small>0{index + 1}</small>{talent.category}<i aria-hidden="true" />
            </button>
          ))}
        </div>
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
        <div className="welcome-talent-card-anchor">
          <div ref={cardStage} className="welcome-talent-card-stage" id="talent-panel" role="tabpanel" aria-labelledby={`talent-tab-${welcomeTalents[active].id}`}>
            <AnimatePresence mode="wait" initial={false}><TalentCard key={welcomeTalents[active].id} talent={welcomeTalents[active]} reduced={reduced} /></AnimatePresence>
          </div>
        </div>
        <span className="welcome-talent-progress">0{active + 1} <i /> 0{welcomeTalents.length}</span>
      </div>
    </section>
  );
}
