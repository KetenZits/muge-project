"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Box3, DirectionalLight, Group, MathUtils, Vector3 } from "three";
import { gsap } from "gsap";

const MODEL_URL = "/models/mu-emblem.glb";

class EmblemBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function EmblemLighting({ reduced }: { reduced: boolean }) {
  const key = useRef<DirectionalLight>(null);
  useFrame(({ clock }) => {
    if (key.current && !reduced) key.current.intensity = 2.3 + Math.sin(clock.elapsedTime * 0.72) * 0.1;
  });
  return (
    <>
      <ambientLight intensity={1.65} />
      <hemisphereLight args={["#f8fbff", "#b8cee8", 0.9]} />
      <directionalLight ref={key} position={[-2, 4, 5]} intensity={2.3} />
      <directionalLight position={[3, 0, 4]} intensity={1.35} color="#eaf3ff" />
      <directionalLight position={[0, 1, -3]} intensity={0.48} color="#f4dc9a" />
    </>
  );
}

function EmblemMesh({ reduced, pointer }: { reduced: boolean; pointer: RefObject<{ x: number; y: number }> }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const entrance = useRef<Group>(null);
  const idle = useRef<Group>(null);
  const ready = useRef(false);
  const idleTime = useRef(0);
  const geometry = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const scale = 2.85 / Math.max(size.x, size.y);
    return { scene, center, scale };
  }, [gltf.scene]);

  useEffect(() => {
    if (!entrance.current) return;
    const emblem = entrance.current;
    ready.current = false;
    idleTime.current = 0;
    if (reduced) {
      emblem.position.y = 0;
      emblem.rotation.set(0, 0, 0);
      return;
    }
    const timeline = gsap.timeline({ delay: 0.28, onComplete: () => { ready.current = true; } });
    timeline.fromTo(
      emblem.position,
      { y: -4.2 },
      { y: 0, duration: 2.25, ease: "power4.out" },
      0,
    );
    timeline.fromTo(
      emblem.rotation,
      { x: -0.28, y: -Math.PI * 2, z: -0.12 },
      { x: 0, y: 0, z: 0, duration: 2.3, ease: "power3.out" },
      0,
    );
    return () => { timeline.kill(); };
  }, [reduced]);

  useFrame((_, delta) => {
    const model = idle.current;
    if (!model || reduced || !ready.current) return;
    idleTime.current += Math.min(delta, 0.05);
    const t = idleTime.current;
    const blend = Math.min(1, t / 1.2);
    model.position.y = MathUtils.damp(model.position.y, Math.sin(t * 1.15) * 0.09 * blend + pointer.current.y * 0.035, 3.2, delta);
    model.position.x = MathUtils.damp(model.position.x, pointer.current.x * 0.045, 2.4, delta);
    model.rotation.y = MathUtils.damp(model.rotation.y, Math.sin(t * 0.7) * 0.065 * blend + pointer.current.x * 0.045, 2.4, delta);
    model.rotation.x = MathUtils.damp(model.rotation.x, pointer.current.y * -0.04, 2.4, delta);
  });

  return (
    <group ref={entrance}>
      <group ref={idle}>
        <group scale={geometry.scale} position={geometry.center.clone().multiplyScalar(-geometry.scale).toArray()}>
          <primitive object={geometry.scene} />
        </group>
      </group>
    </group>
  );
}

export default function UniversityEmblem() {
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState<boolean | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => { useLoader.preload(GLTFLoader, MODEL_URL); }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const move = (event: PointerEvent) => {
      const bounds = root.current?.parentElement?.getBoundingClientRect();
      if (!bounds || window.innerWidth < 900 || event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        pointer.current.x = 0;
        pointer.current.y = 0;
        return;
      }
      pointer.current.x = MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1);
      pointer.current.y = MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * 2, -1, 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced]);

  useEffect(() => {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    const frame = requestAnimationFrame(() => setSupported(Boolean(gl)));
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.02 });
    observer.observe(root.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={root} className="welcome-emblem" role="img" aria-label="Three-dimensional MU university emblem">
      {supported ? <EmblemBoundary><Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5.4], fov: 43, near: 0.1, far: 100 }}
          dpr={[1, 1.65]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => { gl.toneMappingExposure = 1.15; }}
          frameloop={reduced || !visible ? "demand" : "always"}
          aria-hidden="true"
        >
          <EmblemLighting reduced={reduced} />
          <EmblemMesh reduced={reduced} pointer={pointer} />
        </Canvas>
      </Suspense></EmblemBoundary> : null}
    </div>
  );
}
