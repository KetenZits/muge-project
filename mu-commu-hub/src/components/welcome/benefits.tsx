"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Folder from "@/components/Folder";
import ScrollReveal from "@/components/ScrollReveal";
import BlurText from "@/components/BlurText";
import { welcomeBenefits } from "@/data/welcome";

gsap.registerPlugin(ScrollTrigger);

export default function Benefits() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(".welcome-benefit-card", { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.78, stagger: 0.09, ease: "power3.out",
        scrollTrigger: { trigger: ".welcome-benefit-grid", start: "top 88%", toggleActions: "play none none reverse" },
      });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} className="welcome-benefits" aria-labelledby="welcome-benefits-title">
      <div className="welcome-section-heading">
        <span className="welcome-kicker">01 / THE POSSIBILITIES</span>
        <div id="welcome-benefits-title"><ScrollReveal mode="enter" effect="rise" splitBy="lines" duration={1.05} baseOpacity={0.3} baseOffset={28} blurStrength={8} baseRotation={0} containerClassName="welcome-benefit-reveal" textClassName="welcome-benefit-headline">Good things begin<br /><em>together.</em></ScrollReveal></div>
        <BlurText text="MU Connect gives your next idea a place to find its people. Open a folder to see where you could begin." className="welcome-benefit-description" animateBy="words" trigger="view" effect="focus" delay={28} stepDuration={0.22} />
      </div>
      <div className="welcome-benefit-grid">
        {welcomeBenefits.map((benefit) => (
          <article key={benefit.number} className="welcome-benefit-card">
            <div className="welcome-benefit-top"><span>{benefit.number} / 04</span><span>EXPLORE</span></div>
            <div className="welcome-benefit-folder">
              <Folder
                label={benefit.title}
                items={[...benefit.items]}
                color={benefit.color}
                variant="matte"
                theme="light"
                size={0.82}
                draggable={false}
                zoomOnClick
                peek
                intro={false}
                openOn="click"
              />
            </div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
            <Link href={benefit.href} className="welcome-benefit-link">{benefit.action}<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
