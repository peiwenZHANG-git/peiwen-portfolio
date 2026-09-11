"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

const MILESTONE_PROGRESS = 0.7;
const ROAD_HALF_WIDTH = 1.35;
const PEIWEN_WALK_FRAMES = [1, 2, 3, 4].map(
  (frame) => `/assets/character/peiwen-back-walk-${frame}.webp`,
);
const GRASS_TEXTURES = [1, 2, 3, 4].map(
  (index) => `/assets/world/grass-tuft-${index}.webp`,
);
const FLOWER_TEXTURES = [1, 2, 3].map(
  (index) => `/assets/world/flowers-${index}.webp`,
);
const CLOUD_TEXTURES = [1, 2, 3].map(
  (index) => `/assets/world/cloud-${index}.webp`,
);

type MilestonePhase = "distant" | "approaching" | "active";

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
  const edgeJitter =
    Math.sin(index * 1.73) * 0.026 +
    Math.sin(index * 0.47 + 1.4) * 0.04;
  const width =
    ROAD_HALF_WIDTH +
    Math.sin(t * 18.5) * 0.1 +
    Math.sin(t * 7.2 + 0.8) * 0.065 +
    edgeJitter;
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
  const echoEdges: number[] = [];
  const pencilMarks: number[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const { left, right } = roadSample(curve, index, segments);
    vertices.push(left.x, 0.025, left.z, right.x, 0.025, right.z);

    if (index < segments) {
      const offset = index * 2;
      indices.push(offset, offset + 2, offset + 1, offset + 2, offset + 3, offset + 1);
      const broken = index % 31 === 13 || index % 47 === 22;
      if (!broken) {
        const next = roadSample(curve, index + 1, segments);
        edges.push(
          left.x, 0.04, left.z, next.left.x, 0.04, next.left.z,
          right.x, 0.04, right.z, next.right.x, 0.04, next.right.z,
        );
        if (index % 3 !== 1) {
          const tangent = curve.getTangentAt(index / segments).normalize();
          const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
          const offset = 0.045 + Math.sin(index * 0.91) * 0.018;
          const ghostLeft = left.clone().addScaledVector(normal, offset);
          const ghostRight = right.clone().addScaledVector(normal, -offset);
          const nextGhostLeft = next.left.clone().addScaledVector(normal, offset);
          const nextGhostRight = next.right.clone().addScaledVector(normal, -offset);
          echoEdges.push(
            ghostLeft.x, 0.043, ghostLeft.z, nextGhostLeft.x, 0.043, nextGhostLeft.z,
            ghostRight.x, 0.043, ghostRight.z, nextGhostRight.x, 0.043, nextGhostRight.z,
          );
        }
      }

      if (index > 8 && index % 24 === 0) {
        const t = index / segments;
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const start = point.clone().addScaledVector(normal, Math.sin(index) * 0.48);
        const end = start
          .clone()
          .addScaledVector(tangent, 0.24 + (index % 5) * 0.025)
          .addScaledVector(normal, 0.035);
        pencilMarks.push(start.x, 0.046, start.z, end.x, 0.046, end.z);
      }
    }
  }

  const ribbon = new THREE.BufferGeometry();
  ribbon.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  ribbon.setIndex(indices);
  ribbon.computeVertexNormals();

  const edgeLines = new THREE.BufferGeometry();
  edgeLines.setAttribute("position", new THREE.Float32BufferAttribute(edges, 3));
  const echoLines = new THREE.BufferGeometry();
  echoLines.setAttribute("position", new THREE.Float32BufferAttribute(echoEdges, 3));
  const markLines = new THREE.BufferGeometry();
  markLines.setAttribute("position", new THREE.Float32BufferAttribute(pencilMarks, 3));
  return { ribbon, edgeLines, echoLines, markLines };
}

function Road({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const geometry = useMemo(() => makeRoadGeometry(curve), [curve]);

  useEffect(() => () => {
    geometry.ribbon.dispose();
    geometry.edgeLines.dispose();
    geometry.echoLines.dispose();
    geometry.markLines.dispose();
  }, [geometry]);

  return (
    <group>
      <mesh geometry={geometry.ribbon} receiveShadow>
        <meshBasicMaterial color="#f5f1e7" />
      </mesh>
      <lineSegments geometry={geometry.edgeLines}>
        <lineBasicMaterial color="#3f3d37" transparent opacity={0.82} />
      </lineSegments>
      <lineSegments geometry={geometry.echoLines}>
        <lineBasicMaterial color="#77736a" transparent opacity={0.22} />
      </lineSegments>
      <lineSegments geometry={geometry.markLines}>
        <lineBasicMaterial color="#77736a" transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

function pathPosition(
  curve: THREE.CatmullRomCurve3,
  progress: number,
  lateral: number,
  height: number,
): [number, number, number] {
  const point = curve.getPointAt(progress);
  const tangent = curve.getTangentAt(progress).normalize();
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
  point.addScaledVector(normal, lateral);
  return [point.x, height, point.z];
}

function WorldSprite({
  src,
  position,
  scale,
  opacity = 1,
  motion = "still",
  phase = 0,
  reducedMotion,
}: {
  src: string;
  position: [number, number, number];
  scale: [number, number, number];
  opacity?: number;
  motion?: "still" | "float" | "sway";
  phase?: number;
  reducedMotion: boolean;
}) {
  const sprite = useRef<THREE.Sprite>(null);
  const texture = useLoader(THREE.TextureLoader, src);
  const baseHeight = position[1];

  useFrame(({ clock }) => {
    if (!sprite.current || reducedMotion || motion === "still") return;
    const time = clock.elapsedTime + phase;
    if (motion === "float") {
      sprite.current.position.y = baseHeight + Math.sin(time * 0.42) * 0.08;
      sprite.current.material.rotation = Math.sin(time * 0.31) * 0.025;
    } else {
      sprite.current.material.rotation = Math.sin(time * 0.55) * 0.018;
    }
  });

  return (
    <sprite ref={sprite} position={position} scale={scale}>
      <spriteMaterial
        map={texture}
        transparent
        alphaTest={0.025}
        depthWrite={false}
        opacity={opacity}
        toneMapped={false}
      />
    </sprite>
  );
}

function PathsideEnvironment({
  curve,
  reducedMotion,
}: {
  curve: THREE.CatmullRomCurve3;
  reducedMotion: boolean;
}) {
  return (
    <group>
      <WorldSprite src={CLOUD_TEXTURES[0]} position={pathPosition(curve, 0.12, 5.5, 3.55)} scale={[2.4, 1.18, 1]} opacity={0.34} reducedMotion={reducedMotion} />
      <WorldSprite src={CLOUD_TEXTURES[1]} position={pathPosition(curve, 0.38, 6.4, 3.75)} scale={[2.7, 1.3, 1]} opacity={0.34} reducedMotion={reducedMotion} />
      <WorldSprite src={CLOUD_TEXTURES[2]} position={pathPosition(curve, 0.73, -6.3, 3.65)} scale={[3.4, 1.5, 1]} opacity={0.36} reducedMotion={reducedMotion} />

      {[
        [0.08, -2.15, 0, 0],
        [0.17, 2.25, 1, 1.2],
        [0.29, -2.5, 2, 2.1],
        [0.42, 2.3, 3, 0.8],
        [0.54, -2.35, 1, 2.8],
        [0.64, 2.2, 0, 1.7],
        [0.79, -2.4, 3, 2.4],
      ].map(([progress, lateral, textureIndex, phase], index) => (
        <WorldSprite
          key={`grass-${index}`}
          src={GRASS_TEXTURES[textureIndex]}
          position={pathPosition(curve, progress, lateral, 0.34)}
          scale={[0.62 + (index % 3) * 0.08, 0.72 + (index % 2) * 0.12, 1]}
          motion="sway"
          phase={phase}
          opacity={0.78}
          reducedMotion={reducedMotion}
        />
      ))}

      {[
        [0.2, 2.65, 0],
        [0.47, -2.65, 1],
        [0.58, -1.9, 2],
      ].map(([progress, lateral, textureIndex], index) => (
        <WorldSprite
          key={`flowers-${index}`}
          src={FLOWER_TEXTURES[textureIndex]}
          position={pathPosition(curve, progress, lateral, 0.3)}
          scale={[0.48, 0.58, 1]}
          opacity={0.8}
          reducedMotion={reducedMotion}
        />
      ))}

      <WorldSprite
        src="/assets/world/dandelion-seeds-v1.webp"
        position={pathPosition(curve, 0.3, 3.2, 2.1)}
        scale={[1.4, 0.9, 1]}
        opacity={0.48}
        motion="float"
        phase={0.4}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/dandelion-seeds-v1.webp"
        position={pathPosition(curve, 0.56, -3.3, 1.8)}
        scale={[1.1, 0.72, 1]}
        opacity={0.42}
        motion="float"
        phase={2.2}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

function GuideFireflies({
  curve,
  reducedMotion,
}: {
  curve: THREE.CatmullRomCurve3;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/assets/world/firefly-v2.webp");

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 0.08;
    group.current.position.z = -Math.sin(clock.elapsedTime * 0.28) * 0.12;
  });

  return (
    <group ref={group}>
      {[
        pathPosition(curve, 0.1, -0.35, 1.25),
        pathPosition(curve, 0.125, 0.2, 1.55),
        pathPosition(curve, 0.15, -0.1, 1.05),
      ].map((position, index) => (
        <sprite key={index} position={position} scale={[0.42, 0.42, 1]}>
          <spriteMaterial map={texture} transparent alphaTest={0.02} depthWrite={false} opacity={0.76 - index * 0.12} toneMapped={false} />
        </sprite>
      ))}
    </group>
  );
}

function Peiwen({
  curve,
  controls,
  reducedMotion,
  milestoneActive,
}: {
  curve: THREE.CatmullRomCurve3;
  controls: MutableRefObject<Controls>;
  reducedMotion: boolean;
  milestoneActive: boolean;
}) {
  const character = useRef<THREE.Group>(null);
  const sprite = useRef<THREE.Sprite>(null);
  const textures = useLoader(THREE.TextureLoader, PEIWEN_WALK_FRAMES);
  const [frame, setFrame] = useState(3);
  const frameRef = useRef(3);

  useFrame(({ clock }) => {
    if (!character.current) return;
    const point = curve.getPointAt(controls.current.progress);
    const tangent = curve.getTangentAt(controls.current.progress).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    point.addScaledVector(normal, controls.current.lateral);

    const walking = controls.current.speed > 0.0015;
    const nextFrame = walking && !reducedMotion ? Math.floor(clock.elapsedTime * 7) % 4 : 3;
    const bounce = walking && !reducedMotion ? Math.abs(Math.sin(clock.elapsedTime * 7)) * 0.035 : 0;
    if (nextFrame !== frameRef.current) {
      frameRef.current = nextFrame;
      setFrame(nextFrame);
    }
    character.current.position.set(point.x, 0.08, point.z);
    if (sprite.current) {
      sprite.current.position.y = 0.84 + bounce;
      const reaction = milestoneActive && !walking && !reducedMotion ? -0.045 : 0;
      sprite.current.material.rotation = THREE.MathUtils.lerp(
        sprite.current.material.rotation,
        reaction,
        0.08,
      );
    }
  });

  return (
    <group ref={character}>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 20]} />
        <meshBasicMaterial color="#d7d2c5" transparent opacity={0.35} />
      </mesh>
      <sprite ref={sprite} position={[0, 0.84, 0]} scale={[1.22, 1.82, 1]}>
        <spriteMaterial
          map={textures[frame]}
          transparent
          alphaTest={0.04}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

function Fireflies({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/assets/world/firefly-v2.webp");

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
        <sprite
          key={index}
          position={position as [number, number, number]}
          scale={active ? [0.72, 0.72, 1] : [0.5, 0.5, 1]}
        >
          <spriteMaterial
            map={texture}
            transparent
            alphaTest={0.02}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  );
}

function EiffelVignette({ active }: { active: boolean }) {
  const geometry = useMemo(() => {
    const lines = [
      -0.72, 0, 0, 0, 2.05, 0,
      0.72, 0, 0, 0, 2.05, 0,
      -0.72, 0, 0, -0.32, 0.82, 0,
      0.72, 0, 0, 0.32, 0.82, 0,
      -0.43, 0.55, 0, 0.43, 0.55, 0,
      -0.25, 1.12, 0, 0.25, 1.1, 0,
      -0.76, 0.02, 0, -0.28, 0.02, 0,
      0.28, 0.02, 0, 0.76, 0.02, 0,
      -0.53, 0.1, 0, -0.18, 0.48, 0,
      0.53, 0.1, 0, 0.18, 0.48, 0,
    ];
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
    return result;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group position={[1.65, 0.08, 0.18]} rotation={[0.02, -0.08, 0.025]} scale={active ? 1.03 : 1}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={active ? "#575148" : "#8b877d"} transparent opacity={active ? 0.82 : 0.48} />
      </lineSegments>
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
      <WorldSprite
        src="/assets/world/tree-v1.webp"
        position={[0, 2.1, 0]}
        scale={[3.15, 4.3, 1]}
        opacity={active ? 0.96 : 0.78}
        motion="sway"
        phase={1.4}
        reducedMotion={reducedMotion}
      />
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
      <EiffelVignette active={active} />
      <Fireflies active={active} reducedMotion={reducedMotion} />
    </group>
  );
}

function ExperienceScene({
  controls,
  reducedMotion,
  milestonePhase,
  onMilestonePhaseChange,
  onMovingChange,
}: {
  controls: MutableRefObject<Controls>;
  reducedMotion: boolean;
  milestonePhase: MilestonePhase;
  onMilestonePhaseChange: (phase: MilestonePhase) => void;
  onMovingChange: (moving: boolean) => void;
}) {
  const curve = useMemo(() => makePath(), []);
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const milestoneState = useRef<MilestonePhase>("distant");
  const movingState = useRef(false);

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

    const distance = Math.abs(control.progress - MILESTONE_PROGRESS);
    const nextPhase: MilestonePhase = distance < 0.082
      ? "active"
      : distance < 0.18
        ? "approaching"
        : "distant";
    if (nextPhase !== milestoneState.current) {
      milestoneState.current = nextPhase;
      onMilestonePhaseChange(nextPhase);
    }

    const isMoving =
      control.speed > 0.0015 ||
      Math.abs(control.forward) > 0 ||
      Math.abs(control.targetProgress - control.progress) > 0.002;
    if (isMoving !== movingState.current) {
      movingState.current = isMoving;
      onMovingChange(isMoving);
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
        <meshBasicMaterial color="#faf9f3" />
      </mesh>
      <Road curve={curve} />
      <PathsideEnvironment curve={curve} reducedMotion={reducedMotion} />
      <GuideFireflies curve={curve} reducedMotion={reducedMotion} />
      <Milestone curve={curve} active={milestonePhase === "active"} reducedMotion={reducedMotion} />
      <Peiwen
        curve={curve}
        controls={controls}
        reducedMotion={reducedMotion}
        milestoneActive={milestonePhase === "active"}
      />
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
  const [milestonePhase, setMilestonePhase] = useState<MilestonePhase>("distant");
  const [moving, setMoving] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [selfTalk, setSelfTalk] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleMovingChange = useCallback((nextMoving: boolean) => {
    setMoving(nextMoving);
    if (nextMoving) {
      setHasMoved(true);
      setSelfTalk("");
    }
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const show = window.setTimeout(() => setSelfTalk("走走看？"), 850);
    const hide = window.setTimeout(() => setSelfTalk(""), 3300);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (moving || !hasMoved) return;
    let hide = 0;
    const show = window.setTimeout(() => {
      setSelfTalk("hmm...");
      hide = window.setTimeout(() => setSelfTalk(""), 1900);
    }, 6500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [hasMoved, moving]);

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
            milestonePhase={milestonePhase}
            onMilestonePhaseChange={setMilestonePhase}
            onMovingChange={handleMovingChange}
          />
        </Canvas>
      </div>

      <header className="prototype-intro" data-hidden={milestonePhase !== "distant"}>
        <p>Peiwen Zhang</p>
        <h1>Walk with me through my experiences.</h1>
      </header>

      <p className="controls-hint" data-subdued={hasMoved}>
        <span className="desktop-controls">Scroll / WASD to walk</span>
        <span className="mobile-controls">Swipe to walk · sideways to wander gently</span>
      </p>

      <p className="self-talk" data-visible={Boolean(selfTalk)} aria-hidden={!selfTalk}>
        {selfTalk}
      </p>

      <article
        id="experience-content"
        className="milestone-copy"
        data-active={milestonePhase === "active"}
        data-phase={milestonePhase}
        tabIndex={-1}
      >
        <p className="eyebrow">Experience</p>
        <h2>Université Paris-Saclay</h2>
        <p>Human-Computer Interaction</p>
        <p className="details-note">Details coming soon.</p>
      </article>
      <p className="arrival-status" aria-live="polite">
        {milestonePhase === "active" ? "You have reached the Université Paris-Saclay experience landmark." : ""}
      </p>
    </main>
  );
}
