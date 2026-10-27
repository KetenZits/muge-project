"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Box3, Group, Vector3 } from "three";
import { gsap } from "gsap";

const MODEL_URL = "/models/mu-emblem.glb";

class EmblemBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function EmblemMesh({ reduced }: { reduced: boolean }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const group = useRef<Group>(null);
  const geometry = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const scale = 2.85 / Math.max(size.x, size.y);
    return { scene, center, scale };
  }, [gltf.scene]);

  useEffect(() => {
    if (!group.current) return;
    const emblem = group.current;
    if (reduced) {
      emblem.position.y = 0;
      emblem.rotation.set(0, 0, 0);
      return;
    }
    const timeline = gsap.timeline({ delay: 0.28 });
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

  useFrame(({ clock }) => {
    if (group.current && !reduced && group.current.position.y > -0.02) {
      group.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.035;
    }
  });

  return (
    <group ref={group}>
      <group scale={geometry.scale} position={geometry.center.clone().multiplyScalar(-geometry.scale).toArray()}>
        <primitive object={geometry.scene} />
      </group>
    </group>
  );
}

export default function UniversityEmblem() {
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState<boolean | null>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { useLoader.preload(GLTFLoader, MODEL_URL); }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

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
          frameloop={reduced || !visible ? "demand" : "always"}
          aria-hidden="true"
        >
          <ambientLight intensity={1.65} />
          <directionalLight position={[-2, 4, 5]} intensity={2.2} />
          <directionalLight position={[3, -1, 2]} intensity={1.1} />
          <directionalLight position={[0, 0, -3]} intensity={0.55} />
          <EmblemMesh reduced={reduced} />
        </Canvas>
      </Suspense></EmblemBoundary> : null}
    </div>
  );
}
