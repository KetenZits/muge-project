"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { ScenePointer } from "./community-scene";

const CommunityScene = dynamic(() => import("./community-scene"), {
  ssr: false,
  loading: () => null,
});

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function SceneFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="absolute h-[270px] w-[270px] rounded-full border border-[#b7cce7]/70 sm:h-[360px] sm:w-[360px]" />
      <div className="absolute h-[205px] w-[205px] rotate-[-25deg] rounded-full border border-[#d5bf80]/75 sm:h-[280px] sm:w-[280px]" />
      <div className="absolute h-[145px] w-[145px] rotate-[24deg] rounded-[34%] bg-[#17468c] shadow-[0_25px_65px_#17468c38] sm:h-[185px] sm:w-[185px]" />
      <div className="absolute h-[175px] w-[175px] rounded-full border border-white/40 sm:h-[220px] sm:w-[220px]" />
      <span className="absolute left-[19%] top-[33%] h-5 w-5 rounded-full border-4 border-white bg-[#fac334] shadow-md" />
      <span className="absolute right-[20%] top-[26%] h-4 w-4 rounded-full border-2 border-white bg-[#17468c] shadow-md" />
      <span className="absolute bottom-[23%] right-[26%] h-5 w-5 rounded-full border-4 border-white bg-[#fac334] shadow-md" />
    </div>
  );
}

export function HeroNetwork() {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef<ScenePointer>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [everVisible, setEverVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEverVisible(true);
      },
      { rootMargin: "100px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mobileQuery = matchMedia("(max-width: 639px)");
    const pointerQuery = matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMobile(mobileQuery.matches);
      setFinePointer(pointerQuery.matches);
      setReducedMotion(motionQuery.matches);
      setTabVisible(document.visibilityState === "visible");
    };
    update();
    mobileQuery.addEventListener("change", update);
    pointerQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      pointerQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!everVisible || reducedMotion) return;
    const timer = window.setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", {
          failIfMajorPerformanceCaveat: true,
        });
        setWebgl(Boolean(context));
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setWebgl(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [everVisible, reducedMotion]);

  const sceneReady = everVisible && webgl && !reducedMotion;

  return (
    <div
      ref={container}
      className="relative mx-auto h-[340px] w-full max-w-[550px] overflow-hidden rounded-[30px] border border-[#dce7f3] bg-[radial-gradient(circle_at_center,#f8fbff_0%,#eef4fc_63%,#fdf9eb_100%)] shadow-[0_25px_65px_#17468c14] sm:h-[460px]"
      onPointerMove={(event) => {
        if (!finePointer) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current.x = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointer.current.y = (event.clientY - bounds.top) / bounds.height - 0.5;
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
      data-scene-state={
        reducedMotion ? "reduced" : sceneReady ? "webgl" : "fallback"
      }
      data-scene-active={sceneReady && visible && tabVisible}
      aria-label="Illustration of students and shared interests connecting around a campus community"
      role="img"
    >
      <div
        className="brand-grid absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <SceneFallback />
      {sceneReady && (
        <div className="absolute inset-0" aria-hidden="true">
          <SceneErrorBoundary>
            <CommunityScene
              mobile={mobile}
              active={visible && tabVisible}
              pointer={pointer}
            />
          </SceneErrorBoundary>
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-5 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-[0_8px_24px_#17468c12] sm:left-6 sm:top-7 sm:px-4 sm:py-3">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8b9aad]">
          Shared interests
        </span>
        <strong className="text-xs text-[#17468c] sm:text-sm">
          AI · Design · Ideas
        </strong>
      </div>
      <div className="pointer-events-none absolute bottom-5 right-4 rounded-2xl border border-[#f4e6bd] bg-white/90 px-3 py-2 shadow-[0_8px_24px_#17468c12] sm:bottom-7 sm:right-6 sm:px-4 sm:py-3">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#9a8652]">
          Better together
        </span>
        <strong className="text-xs text-[#17468c] sm:text-sm">
          Your next team starts here
        </strong>
      </div>
    </div>
  );
}
