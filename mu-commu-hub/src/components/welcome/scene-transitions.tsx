"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SceneTransitions() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".welcome-white-hero");
    const benefits = document.querySelector<HTMLElement>(".welcome-benefits");
    const talents = document.querySelector<HTMLElement>(".welcome-talents");
    const final = document.querySelector<HTMLElement>(".welcome-final");
    if (!hero || !benefits || !talents || !final) return;

    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const connect = (outgoing: HTMLElement, incoming: HTMLElement) => {
        ScrollTrigger.create({
          trigger: outgoing,
          start: "bottom bottom",
          endTrigger: incoming,
          end: "top top",
          pin: outgoing,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        incoming.inert = true;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: incoming,
            start: "top 85%",
            end: "top 5%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const leaving = self.progress > 0.69;
              outgoing.inert = leaving;
              outgoing.style.pointerEvents = leaving ? "none" : "";
              incoming.inert = self.progress < 0.66;
            },
          },
        });
        timeline.to(outgoing, { autoAlpha: 0, duration: 0.46, ease: "none" }, 0.24);
        timeline.fromTo(incoming, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "none" }, 0.6);
      };

      connect(hero, benefits);
      connect(benefits, talents);

      final.inert = true;
      const closing = gsap.timeline({
        scrollTrigger: {
          trigger: final,
          start: "top 85%",
          end: "top 8%",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            talents.inert = self.progress > 0.55;
            talents.style.pointerEvents = self.progress > 0.55 ? "none" : "";
            final.inert = self.progress < 0.55;
          },
        },
      });
      closing.to(talents, { autoAlpha: 0, duration: 0.53, ease: "none" }, 0.08);
      closing.fromTo(final, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "none" }, 0.5);
      ScrollTrigger.sort();
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        for (const element of [hero, benefits, talents, final]) {
          element.inert = false;
          element.style.pointerEvents = "";
        }
      };
    });

    media.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
      for (const section of [benefits, talents]) {
        gsap.fromTo(section, { opacity: 0.55 }, {
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 92%", end: "top 45%", scrub: 0.35 },
        });
      }
    });

    return () => media.revert();
  }, []);

  return null;
}
