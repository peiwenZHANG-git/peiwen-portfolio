"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

const MILESTONE_PROGRESS = 0.7;
const ROAD_HALF_WIDTH = 1.35;

type Controls = {
  progress: number;
  targetProgress: number;
  lateral: number;
  targetLateral: number;
  forward: number;
  sideways: number;
  speed: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function makePath() {
  return new THREE.CatmullRomCurve3(
    [
      [5.8, 0, 5],
      [7.1, 0, 0],
      [5.4, 0, -5.5],
      [2.1, 0, -10.5],
      [-3.2, 0, -15.5],
      [-5.8, 0, -22],
      [-5.1, 0, -29],
      [-1.8, 0, -35.5],
      [3.8, 0, -41],
      [6.2, 0, -47],
      [3.8, 0, -53],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "centripetal",
  );
}

function roadSample(curve: THREE.CatmullRomCurve3, index: number, segments: number) {
  const t = index / segments;
  const point = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t).normalize();
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
  const width = ROAD_HALF_WIDTH + Math.sin(t * 18.5) * 0.07 + Math.sin(t * 7.2 + 0.8) * 0.04;
  return {
    left: point.clone().addScaledVector(normal, width),
    right: point.clone().addScaledVector(normal, -width),
  };
}

function makeRoadGeometry(curve: THREE.CatmullRomCurve3) {
  const segments = 220;
  const vertices: number[] = [];
  const indices: number[] = [];
  const edges: number[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const { left, right } = roadSample(curve, index, segments);
    vertices.push(left.x, 0.025, left.z, right.x, 0.025, right.z);

    if (index < segments) {
      const offset = index * 2;
      indices.push(offset, offset + 2, offset + 1, offset + 2, offset + 3, offset + 1);
      if (![54, 55, 136, 137, 192].includes(index)) {
        const next = roadSample(curve, index + 1, segments);
        edges.push(
          left.x, 0.04, left.z, next.left.x, 0.04, next.left.z,
          right.x, 0.04, right.z, next.right.x, 0.04, next.right.z,
        );
      }
    }
  }

  const ribbon = new THREE.BufferGeometry();
  ribbon.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  ribbon.setIndex(indices);
  ribbon.computeVertexNormals();

  const edgeLines = new THREE.BufferGeometry();
  edgeLines.setAttribute("position", new THREE.Float32BufferAttribute(edges, 3));
  return { ribbon, edgeLines };
}

function Road({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const geometry = useMemo(() => makeRoadGeometry(curve), [curve]);

  useEffect(() => () => {
    geometry.ribbon.dispose();
    geometry.edgeLines.dispose();
  }, [geometry]);

  return (
    <group>
      <mesh geometry={geometry.ribbon} receiveShadow>
        <meshStandardMaterial color="#f3f0e7" roughness={1} />
      </mesh>
      <lineSegments geometry={geometry.edgeLines}>
        <lineBasicMaterial color="#34332e" />
      </lineSegments>
    </group>
  );
}

function Peiwen({
  curve,
  controls,
  reducedMotion,
}: {
  curve: THREE.CatmullRomCurve3;
  controls: MutableRefObject<Controls>;
  reducedMotion: boolean;
}) {
  const character = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!character.current) return;
    const point = curve.getPointAt(controls.current.progress);
    const tangent = curve.getTangentAt(controls.current.progress).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    point.addScaledVector(normal, controls.current.lateral);

    const stride = reducedMotion ? 0 : Math.min(1, controls.current.speed * 180);
    const phase = Math.sin(clock.elapsedTime * 8.5) * stride;
    character.current.position.set(point.x, 0.08 + Math.abs(phase) * 0.035, point.z);
    character.current.rotation.y = Math.atan2(tangent.x, tangent.z);
    if (leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
      leftArm.current.rotation.x = phase * 0.32;
      rightArm.current.rotation.x = -phase * 0.32;
      leftLeg.current.rotation.x = -phase * 0.28;
      rightLeg.current.rotation.x = phase * 0.28;
    }
  });

  return (
    <group ref={character}>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 20]} />
        <meshBasicMaterial color="#d7d2c5" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 1.31, -0.025]}>
        <sphereGeometry args={[0.25, 14, 10]} />
        <meshStandardMaterial color="#2e2d29" roughness={1} />
      </mesh>
      <mesh position={[0, 1.27, 0.12]} scale={[0.86, 0.88, 0.55]}>
        <sphereGeometry args={[0.22, 14, 10]} />
        <meshStandardMaterial color="#ead8c3" roughness={1} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <capsuleGeometry args={[0.2, 0.38, 4, 8]} />
        <meshStandardMaterial color="#87949a" roughness={1} />
      </mesh>
      <group ref={leftArm} position={[-0.24, 1, 0]} rotation={[0, 0, -0.08]}>
        <mesh position={[0, -0.23, 0]}>
          <capsuleGeometry args={[0.055, 0.34, 3, 6]} />
          <meshStandardMaterial color="#34332e" roughness={1} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.24, 1, 0]} rotation={[0, 0, 0.08]}>
        <mesh position={[0, -0.23, 0]}>
          <capsuleGeometry args={[0.055, 0.34, 3, 6]} />
          <meshStandardMaterial color="#34332e" roughness={1} />
        </mesh>
      </group>
      <group ref={leftLeg} position={[-0.1, 0.57, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.065, 0.36, 3, 6]} />
          <meshStandardMaterial color="#34332e" roughness={1} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.1, 0.57, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.065, 0.36, 3, 6]} />
          <meshStandardMaterial color="#34332e" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

function Fireflies({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * (active ? 0.08 : 0.2);
  });

  return (
    <group ref={group}>
      {[
        [-1.5, 1, 0.4],
        [-0.9, 1.45, -0.5],
        [0.2, 1.15, 0.1],
        [0.9, 1.6, -0.35],
        [1.45, 0.9, 0.35],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[active ? 0.065 : 0.045, 8, 8]} />
          <meshBasicMaterial color="#c5ad58" />
        </mesh>
      ))}
    </group>
  );
}

function Milestone({
  curve,
  active,
  reducedMotion,
}: {
  curve: THREE.CatmullRomCurve3;
  active: boolean;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const placement = useMemo(() => {
    const point = curve.getPointAt(MILESTONE_PROGRESS);
    const tangent = curve.getTangentAt(MILESTONE_PROGRESS).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    return {
      position: point.addScaledVector(normal, -3.15),
      rotation: Math.atan2(tangent.x, tangent.z),
    };
  }, [curve]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = active ? 1.03 : 1;
    const next = reducedMotion ? target : THREE.MathUtils.damp(group.current.scale.x, target, 4, delta);
    group.current.scale.setScalar(next);
  });

  return (
    <group ref={group} position={placement.position} rotation={[0, placement.rotation, 0]}>
      <group rotation={[0.03, 0, -0.025]}>
        <mesh position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.16, 0.23, 2.9, 7]} />
          <meshStandardMaterial color="#676055" roughness={1} />
        </mesh>
        <mesh position={[-0.18, 3.05, 0]} scale={[1.15, 0.9, 1]}>
          <dodecahedronGeometry args={[1.25, 0]} />
          <meshStandardMaterial color={active ? "#929d83" : "#b7b6aa"} roughness={1} />
        </mesh>
      </group>
      <group position={[-1.65, 0.48, 0.3]} rotation={[0, -0.08, -0.025]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.75, 0.18, 0.42]} />
          <meshStandardMaterial color="#807463" roughness={1} />
        </mesh>
        <mesh position={[0, 0.72, 0.18]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[1.75, 0.16, 0.28]} />
          <meshStandardMaterial color="#807463" roughness={1} />
        </mesh>
        <mesh position={[-0.65, 0.05, 0]}>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color="#34332e" />
        </mesh>
        <mesh position={[0.65, 0.05, 0]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color="#34332e" />
        </mesh>
      </group>
      <group position={[1.6, 0.9, 0.15]} rotation={[0, 0.08, 0.035]}>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.1, 1.35, 0.1]} />
          <meshStandardMaterial color="#34332e" />
        </mesh>
        <mesh>
          <boxGeometry args={[1.15, 0.46, 0.12]} />
          <meshStandardMaterial color={active ? "#d8cda8" : "#e4e0d3"} roughness={1} />
        </mesh>
      </group>
      <Fireflies active={active} reducedMotion={reducedMotion} />
    </group>
  );
}

function ExperienceScene({
  controls,
  reducedMotion,
  active,
  onMilestoneChange,
}: {
  controls: MutableRefObject<Controls>;
  reducedMotion: boolean;
  active: boolean;
  onMilestoneChange: (active: boolean) => void;
}) {
  const curve = useMemo(() => makePath(), []);
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const milestoneState = useRef(false);

  /* eslint-disable react-hooks/immutability -- R3F frame state is intentionally transient and ref-backed. */
  useFrame((_, delta) => {
    const control = controls.current;
    const near = Math.abs(control.progress - MILESTONE_PROGRESS) < 0.105;
    const movementScale = near ? 0.62 : 1;
    control.targetProgress = clamp(control.targetProgress + control.forward * delta * 0.075 * movementScale, 0.015, 0.985);
    control.targetLateral = clamp(control.targetLateral + control.sideways * delta * 0.85, -0.78, 0.78);

    const previous = control.progress;
    control.progress = THREE.MathUtils.damp(control.progress, control.targetProgress, near ? 3.2 : 5, delta);
    control.lateral = THREE.MathUtils.damp(control.lateral, control.targetLateral, 7, delta);
    control.speed = Math.abs(control.progress - previous) / Math.max(delta, 0.001);

    const point = curve.getPointAt(control.progress);
    const tangent = curve.getTangentAt(control.progress).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const characterPoint = point.clone().addScaledVector(normal, control.lateral);
    const cameraTarget = characterPoint
      .clone()
      .addScaledVector(tangent, -5.2)
      .addScaledVector(normal, 2.2)
      .add(new THREE.Vector3(0, 3.35, 0));
    const ahead = curve.getPointAt(Math.min(0.995, control.progress + 0.035)).add(new THREE.Vector3(0, 1.05, 0));

    const cameraEase = reducedMotion ? 7 : 3.4;
    camera.position.lerp(cameraTarget, 1 - Math.exp(-cameraEase * delta));
    lookAt.current.lerp(ahead, 1 - Math.exp(-4 * delta));
    camera.lookAt(lookAt.current);

    const nowNear = Math.abs(control.progress - MILESTONE_PROGRESS) < 0.085;
    if (nowNear !== milestoneState.current) {
      milestoneState.current = nowNear;
      onMilestoneChange(nowNear);
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <color attach="background" args={["#faf9f3"]} />
      <fog attach="fog" args={["#faf9f3", 18, 48]} />
      <ambientLight intensity={2.1} />
      <directionalLight position={[4, 9, 5]} intensity={1.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, -24]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#faf9f3" roughness={1} />
      </mesh>
      <Road curve={curve} />
      <Milestone curve={curve} active={active} reducedMotion={reducedMotion} />
      <Peiwen curve={curve} controls={controls} reducedMotion={reducedMotion} />
    </>
  );
}

export default function ExperiencePrototype() {
  const controls = useRef<Controls>({
    progress: 0.03,
    targetProgress: 0.03,
    lateral: 0,
    targetLateral: 0,
    forward: 0,
    sideways: 0,
    speed: 0,
  });
  const pressed = useRef(new Set<string>());
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [nearMilestone, setNearMilestone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const relevant = new Set(["w", "s", "a", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
    const updateDirections = () => {
      const keys = pressed.current;
      controls.current.forward = Number(keys.has("w") || keys.has("ArrowUp")) - Number(keys.has("s") || keys.has("ArrowDown"));
      controls.current.sideways = Number(keys.has("d") || keys.has("ArrowRight")) - Number(keys.has("a") || keys.has("ArrowLeft"));
    };
    const down = (event: KeyboardEvent) => {
      if (!relevant.has(event.key)) return;
      event.preventDefault();
      pressed.current.add(event.key);
      updateDirections();
    };
    const up = (event: KeyboardEvent) => {
      if (!relevant.has(event.key)) return;
      pressed.current.delete(event.key);
      updateDirections();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return (
    <main
      className="prototype-shell"
      onWheel={(event) => {
        controls.current.targetProgress = clamp(controls.current.targetProgress + event.deltaY * 0.00045, 0.015, 0.985);
      }}
      onPointerDown={(event) => {
        pointer.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!pointer.current) return;
        const deltaX = event.clientX - pointer.current.x;
        const deltaY = event.clientY - pointer.current.y;
        controls.current.targetProgress = clamp(controls.current.targetProgress - deltaY * 0.00085, 0.015, 0.985);
        controls.current.targetLateral = clamp(controls.current.targetLateral + deltaX * 0.006, -0.78, 0.78);
        pointer.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={() => { pointer.current = null; }}
      onPointerCancel={() => { pointer.current = null; }}
    >
      <a className="skip-link" href="#experience-content">Skip to experience details</a>
      <div className="scene-canvas" tabIndex={0} aria-label="Walk with Peiwen along the Experience path">
        <Canvas
          camera={{ position: [7, 3.5, 10], fov: 39, near: 0.1, far: 90 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          fallback={<p className="canvas-fallback">The spatial view is unavailable. Experience details remain available.</p>}
        >
          <ExperienceScene
            controls={controls}
            reducedMotion={reducedMotion}
            active={nearMilestone}
            onMilestoneChange={setNearMilestone}
          />
        </Canvas>
      </div>

      <header className="prototype-intro" data-hidden={nearMilestone}>
        <p>Peiwen Zhang</p>
        <h1>Walk with me through my experiences.</h1>
      </header>

      <p className="controls-hint">
        <span className="desktop-controls">Wheel or W/S to walk · A/D to wander gently</span>
        <span className="mobile-controls">Swipe to walk · sideways to wander gently</span>
      </p>

      <article id="experience-content" className="milestone-copy" data-active={nearMilestone} tabIndex={-1}>
        <p className="eyebrow">Experience</p>
        <h2>Université Paris-Saclay</h2>
        <p>Human-Computer Interaction</p>
        <p className="details-note">Details coming soon.</p>
      </article>
      <p className="arrival-status" aria-live="polite">
        {nearMilestone ? "You have reached the Université Paris-Saclay experience landmark." : ""}
      </p>
    </main>
  );
}
