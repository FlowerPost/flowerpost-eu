"use client";

import { Suspense, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import type { GLTF } from "three-stdlib";

const MODEL_PATH = "/models/flowerpost-box.glb";

const LID_MAX_ANGLE = Math.PI * 0.82;

const DOLLY_END = 0.4;
const LID_END = 0.7;

const CAMERA_Z_START = 12.8;
const CAMERA_Z_END = 7.2;
const CAMERA_Y = 3.1;
const LOOK_AT_Y = 0.55;
const ORBIT_MAX_ANGLE = 0.28;

const WRAP_HIDE_AT = DOLLY_END + 0.02;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function remap(t: number, start: number, end: number): number {
  return clamp01((t - start) / (end - start));
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

type FlowerpostGLTF = GLTF & {
  nodes: {
    Box_Body: THREE.Object3D;
    Box_Lid: THREE.Object3D;
    Box_Ribbon: THREE.Object3D;
    Bow: THREE.Object3D;
  };
};

function useFlowerpostModel(): FlowerpostGLTF {
  return useGLTF(MODEL_PATH) as unknown as FlowerpostGLTF;
}

useGLTF.preload(MODEL_PATH);

function Lights() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight position={[-4, 6, 3]} intensity={1.2} color="#fff3e0" />
      <directionalLight position={[6, 3, 2]} intensity={0.5} color="#f2ede2" />
      <directionalLight position={[0, 2.5, -6]} intensity={0.35} color="#d7dce8" />
    </>
  );
}

interface ProgressRigProps {
  progressRef: MutableRefObject<number>;
}

function CameraRig({ progressRef }: ProgressRigProps) {
  useFrame(({ camera }) => {
    const t = progressRef.current;
    const dollyT = easeInOutCubic(remap(t, 0, DOLLY_END));
    const orbitT = easeInOutCubic(remap(t, 0.9, 1));
    const z = THREE.MathUtils.lerp(CAMERA_Z_START, CAMERA_Z_END, dollyT);
    const angle = orbitT * ORBIT_MAX_ANGLE;
    camera.position.x = Math.sin(angle) * z;
    camera.position.z = Math.cos(angle) * z;
    camera.position.y = CAMERA_Y;
    camera.lookAt(0, LOOK_AT_Y, 0);
  });
  return null;
}

function BoxModel({ progressRef }: ProgressRigProps) {
  const { nodes } = useFlowerpostModel();
  const lidRef = useRef<THREE.Object3D>(null);
  const ribbonRef = useRef<THREE.Object3D>(null);
  const bowRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    const t = progressRef.current;
    const lidT = easeInOutCubic(remap(t, DOLLY_END, LID_END));
    if (lidRef.current) {
      lidRef.current.rotation.x = LID_MAX_ANGLE * lidT;
    }
    const wrapVisible = t < WRAP_HIDE_AT;
    if (ribbonRef.current) ribbonRef.current.visible = wrapVisible;
    if (bowRef.current) bowRef.current.visible = wrapVisible;
  });

  return (
    <group rotation={[0, Math.PI, 0]}>
      <primitive object={nodes.Box_Body} />
      <primitive ref={lidRef} object={nodes.Box_Lid} />
      <primitive ref={ribbonRef} object={nodes.Box_Ribbon} />
      <primitive ref={bowRef} object={nodes.Bow} />
    </group>
  );
}

function StaticBoxModel() {
  const { nodes } = useFlowerpostModel();

  return (
    <group rotation={[0, Math.PI, 0]}>
      <primitive object={nodes.Box_Body} />
      <primitive object={nodes.Box_Lid} rotation={[LID_MAX_ANGLE * 0.55, 0, 0]} />
      <primitive object={nodes.Box_Ribbon} visible={false} />
      <primitive object={nodes.Bow} visible={false} />
    </group>
  );
}

function AnimatedScene({ progress }: { progress: MotionValue<number> }) {
  const progressRef = useRef(0);

  useFrame(() => {
    progressRef.current = progress.get();
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={32} position={[0, CAMERA_Y, CAMERA_Z_START]} />
      <CameraRig progressRef={progressRef} />
      <Lights />
      <group position={[0, -0.5, 0]}>
        <BoxModel progressRef={progressRef} />
      </group>
    </>
  );
}

function StaticScene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={32}
        position={[0, CAMERA_Y, (CAMERA_Z_START + CAMERA_Z_END) / 2]}
      />
      <Lights />
      <group position={[0, -0.5, 0]}>
        <StaticBoxModel />
      </group>
    </>
  );
}

interface FlowerpostBox3DProps {
  progress: MotionValue<number>;
  className?: string;
}

export function FlowerpostBox3D({ progress, className }: FlowerpostBox3DProps) {
  const prefersReducedMotion = useReducedMotion();

  // r3f's useMeasure sometimes measures a 0-size container during Fast
  // Refresh (HMR after a WebGL context loss) and never re-measures on its
  // own, leaving the canvas stuck at the browser's 300x150 default. A
  // resize nudge shortly after mount is enough to trigger a fresh
  // measurement. Dev-only: production never hits the HMR context-loss path.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {prefersReducedMotion ? <StaticScene /> : <AnimatedScene progress={progress} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
