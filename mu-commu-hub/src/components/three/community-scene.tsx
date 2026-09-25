"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Group, InstancedMesh, MathUtils, Object3D } from "three";
import type { RefObject } from "react";

type Position = [number, number, number];
export type ScenePointer = { x: number; y: number };

const DESKTOP_NODES: Position[] = [
  [-1.85, 0.7, 0.1],
  [-1.2, 1.55, -0.5],
  [0.35, 1.85, -0.3],
  [1.6, 1.15, 0.15],
  [1.9, -0.35, -0.35],
  [1.1, -1.55, 0.1],
  [-0.4, -1.85, -0.2],
  [-1.7, -1.05, 0.35],
  [0.5, 0.4, -1.7],
  [-0.9, -0.3, 1.65],
];

const MOBILE_NODES = DESKTOP_NODES.filter((_, index) =>
  [0, 2, 3, 5, 6, 7].includes(index),
);

function Network({
  mobile,
  pointer,
}: {
  mobile: boolean;
  pointer: RefObject<ScenePointer>;
}) {
  const group = useRef<Group>(null);
  const core = useRef<Group>(null);
  const orbitAngle = useRef(0);
  const blue = useRef<InstancedMesh>(null);
  const gold = useRef<InstancedMesh>(null);
  const positions = mobile ? MOBILE_NODES : DESKTOP_NODES;
  const blueNodes = positions.filter((_, index) => index % 3 !== 0);
  const goldNodes = positions.filter((_, index) => index % 3 === 0);
  const linePositions = useMemo(
    () =>
      new Float32Array(positions.flatMap(([x, y, z]) => [0, 0, 0, x, y, z])),
    [positions],
  );
  const particles = useMemo(() => {
    const count = mobile ? 8 : 22;
    return new Float32Array(
      Array.from({ length: count }, (_, index) => {
        const angle = index * 2.39996;
        const radius = 2.15 + (index % 4) * 0.13;
        return [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(index * 1.7) * 0.8,
        ];
      }).flat(),
    );
  }, [mobile]);

  useEffect(() => {
    const object = new Object3D();
    for (const [mesh, nodes] of [
      [blue.current, blueNodes],
      [gold.current, goldNodes],
    ] as const) {
      if (!mesh) continue;
      nodes.forEach(([x, y, z], index) => {
        object.position.set(x, y, z);
        object.updateMatrix();
        mesh.setMatrixAt(index, object.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  }, [blueNodes, goldNodes]);

  useFrame(({ clock }, delta) => {
    if (!group.current || !core.current) return;
    const step = Math.min(delta, 0.05);
    orbitAngle.current += step * 0.09;
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      orbitAngle.current + pointer.current.x * 0.18,
      1.4,
      step,
    );
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      -0.12 + pointer.current.y * 0.13,
      1.4,
      step,
    );
    core.current.rotation.y += step * 0.11;
    core.current.rotation.z += step * 0.035;
    core.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.9) * 0.012);
  });

  return (
    <>
      <ambientLight intensity={1.9} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} color="#ffffff" />
      <group ref={group}>
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial
              color="#17468c"
              metalness={0.12}
              roughness={0.48}
              flatShading
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.12, 20, 14]} />
            <meshBasicMaterial
              color="#9dbbe2"
              wireframe
              transparent
              opacity={0.17}
              depthWrite={false}
            />
          </mesh>
        </group>
        <mesh rotation={[0.3, 0.55, 0]}>
          <torusGeometry args={[1.45, 0.012, 5, 72]} />
          <meshBasicMaterial color="#a5812d" transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[1.15, -0.35, 0]}>
          <torusGeometry args={[1.68, 0.009, 5, 72]} />
          <meshBasicMaterial color="#91afd5" transparent opacity={0.5} />
        </mesh>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#7396c5"
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </lineSegments>
        <instancedMesh
          ref={blue}
          args={[undefined, undefined, blueNodes.length]}
        >
          <sphereGeometry args={[0.105, 10, 8]} />
          <meshStandardMaterial color="#4c7dbb" roughness={0.55} />
        </instancedMesh>
        <instancedMesh
          ref={gold}
          args={[undefined, undefined, goldNodes.length]}
        >
          <sphereGeometry args={[0.13, 10, 8]} />
          <meshStandardMaterial color="#fac334" roughness={0.5} />
        </instancedMesh>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial color="#a5812d" size={0.04} sizeAttenuation />
        </points>
      </group>
    </>
  );
}

export default function CommunityScene({
  mobile,
  active,
  pointer,
}: {
  mobile: boolean;
  active: boolean;
  pointer: RefObject<ScenePointer>;
}) {
  return (
    <Canvas
      key={mobile ? "mobile" : "desktop"}
      dpr={mobile ? 1 : [1, 1.4]}
      camera={{ position: [0, 0, mobile ? 7.1 : 6], fov: mobile ? 42 : 45 }}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <Network mobile={mobile} pointer={pointer} />
    </Canvas>
  );
}
