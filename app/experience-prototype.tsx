"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import {
  getFraming, getJourneyState, getMilestone, getNearestMilestone, getProgressTarget,
  getSlowdownWeight, type JourneyState, type MilestonePhase, type Milestone as JourneyMilestone,
} from "@/lib/journey";

const SACLAY = getMilestone("paris-saclay")!;
const ROAD_HALF_WIDTH = 1.35;
const PEIWEN_WALK_FRAMES = [1, 2, 3, 4].map(
  (frame) => `/assets/character/peiwen-back-walk-${frame}.webp`,
);
const SACLAY_ASSETS = {
  campus: "/assets/world/saclay/campus-cluster.webp",
  road: "/assets/world/saclay/snow-road-surface.webp",
  edgeLeft: "/assets/world/saclay/snow-edge-left.webp",
  edgeRight: "/assets/world/saclay/snow-edge-right.webp",
  snowBank: "/assets/world/saclay/snow-bank.webp",
  vegetation: "/assets/world/saclay/winter-vegetation.webp",
  foregroundLeft: "/assets/world/saclay/foreground-left.webp",
  foregroundUpperRight: "/assets/world/saclay/foreground-upper-right.webp",
} as const;

type Vec3 = [number, number, number];

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

function updateProgressTarget(control: Controls, delta: number) {
  control.targetProgress = getProgressTarget(control.progress, control.targetProgress, delta);
}

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
  const uvs: number[] = [];
  const indices: number[] = [];
  const edges: number[] = [];
  const echoEdges: number[] = [];
  const pencilMarks: number[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const { left, right } = roadSample(curve, index, segments);
    vertices.push(left.x, 0.025, left.z, right.x, 0.025, right.z);
    const progress = index / segments;
    uvs.push(progress, 0, progress, 1);

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
  ribbon.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
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
  const texture = useLoader(THREE.TextureLoader, SACLAY_ASSETS.road);

  useEffect(() => () => {
    geometry.ribbon.dispose();
    geometry.edgeLines.dispose();
    geometry.echoLines.dispose();
    geometry.markLines.dispose();
  }, [geometry]);

  return (
    <group>
      <mesh geometry={geometry.ribbon} receiveShadow renderOrder={0}>
        <meshBasicMaterial
          map={texture}
          color="#ececef"
          transparent
          opacity={0.1}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <lineSegments geometry={geometry.edgeLines} renderOrder={1}>
        <lineBasicMaterial color="#858bab" transparent opacity={0.2} />
      </lineSegments>
      <lineSegments geometry={geometry.echoLines} renderOrder={2}>
        <lineBasicMaterial color="#9da2bd" transparent opacity={0.1} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={geometry.markLines} renderOrder={2}>
        <lineBasicMaterial color="#959ab8" transparent opacity={0.08} depthWrite={false} />
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
  tint = "#ffffff",
  motion = "still",
  phase = 0,
  tilt = 0,
  renderOrder = 5,
  reducedMotion,
}: {
  src: string;
  position: [number, number, number];
  scale: [number, number, number];
  opacity?: number;
  /** Multiplicative tint. Leave white for full clarity; use a muted warm-gray to push
   * an element back a depth tier (the simplest available recession cue for raster sprites). */
  tint?: string;
  motion?: "still" | "float" | "sway";
  phase?: number;
  tilt?: number;
  renderOrder?: number;
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
      sprite.current.material.rotation = tilt + Math.sin(time * 0.31) * 0.025;
    } else {
      sprite.current.material.rotation = tilt + Math.sin(time * 0.55) * 0.018;
    }
  });

  return (
    <sprite ref={sprite} position={position} scale={scale} renderOrder={renderOrder}>
      <spriteMaterial
        map={texture}
        color={tint}
        transparent
        alphaTest={0.025}
        depthWrite={false}
        depthTest
        opacity={opacity}
        rotation={tilt}
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
  const { size, gl } = useThree();
  const compact = (gl.domElement.closest(".prototype-shell")?.clientWidth ?? size.width) <= 700;
  return (
    <group>
      <WorldSprite
        src={SACLAY_ASSETS.vegetation}
        position={pathPosition(curve, 0.12, -3.4, compact ? 1.1 : 1.35)}
        scale={compact ? [1.7, 2.02, 1] : [2.25, 2.67, 1]}
        opacity={0.72}
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
        <sprite key={index} position={position} scale={[0.42, 0.42, 1]} renderOrder={6}>
          <spriteMaterial map={texture} transparent alphaTest={0.02} depthWrite={false} depthTest opacity={0.76 - index * 0.12} toneMapped={false} />
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
  const { size, gl } = useThree();
  const compact = (gl.domElement.closest(".prototype-shell")?.clientWidth ?? size.width) <= 700;
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
    // Gait rate follows the slower travel speed; at the old 7Hz she read as jogging in
    // place once the wheel/keyboard steps were softened.
    const nextFrame = walking && !reducedMotion ? Math.floor(clock.elapsedTime * 5.2) % 4 : 3;
    const bounce = walking && !reducedMotion ? Math.abs(Math.sin(clock.elapsedTime * 5.2)) * 0.03 : 0;
    if (nextFrame !== frameRef.current) {
      frameRef.current = nextFrame;
      setFrame(nextFrame);
    }
    character.current.position.set(point.x, 0.08, point.z);
    if (sprite.current) {
      sprite.current.position.y = (compact ? 0.84 : 0.62) + bounce;
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
      <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <circleGeometry args={[compact ? 0.34 : 0.25, 20]} />
        <meshBasicMaterial color="#6d7397" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <sprite
        ref={sprite}
        position={[0, compact ? 0.84 : 0.62, 0]}
        scale={compact ? [1.22, 1.82, 1] : [0.9, 1.34, 1]}
        renderOrder={20}
      >
        <spriteMaterial
          map={textures[frame]}
          transparent
          alphaTest={0.08}
          depthWrite
          depthTest
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

// Two by the tower, three around the diagram/lamp, two inviting from the path.
// Indices 0-1 travel with the tower and 2-4 with the vignette, so the groups stay
// attached to what they are pointing at; 5-6 stay near Peiwen on the road.
const MILESTONE_FIREFLY_POSITIONS: [number, number, number][] = [
  [2.35, 1.2, 4.4],
  [1.75, 2.1, 4.8],
  [-1.9, 1.15, 4.4],
  [-0.9, 0.82, 3.75],
  [-0.25, 1.42, 3.9],
  [0.15, 0.72, 1.15],
  [-0.35, 1.08, 1.65],
];
const COMPACT_FIREFLY_POSITIONS: [number, number, number][] = [
  [1.3, 0.95, 7.9],
  [0.8, 1.8, 8.2],
  [-0.65, 1.05, 7.8],
  [-0.15, 0.72, 7.1],
  [0.5, 1.18, 7.3],
  [0.52, 0.66, 1.05],
  [0.27, 1.08, 1.55],
];

function Fireflies({
  active,
  approaching,
  compact,
  reducedMotion,
}: {
  active: boolean;
  approaching: boolean;
  compact: boolean;
  reducedMotion: boolean;
}) {
  const sprites = useRef<Array<THREE.Sprite | null>>([]);
  const texture = useLoader(THREE.TextureLoader, "/assets/world/firefly-v2.webp");
  const positions = compact ? COMPACT_FIREFLY_POSITIONS : MILESTONE_FIREFLY_POSITIONS;

  useFrame(({ clock }, delta) => {
    const visibility = active ? 1 : approaching ? 0.68 : 0;
    const targetScale = active ? 0.62 : approaching ? 0.52 : 0.36;
    const targetOpacity = active ? 0.94 : approaching ? 0.76 : 0.28;
    const time = clock.getElapsedTime();

    sprites.current.forEach((sprite, index) => {
      if (!sprite) return;
      const base = positions[index];
      const material = sprite.material as THREE.SpriteMaterial;
      const gather = active ? 1 : approaching ? 0.55 : 0;
      const gatherOffset = index >= 5 ? gather * 0.08 : 0;
      const emphasis = index >= 2 && index <= 4 ? 1 : 0.76;
      // On compact the tower and vignette groups sit ~6-8 further down the path, so
      // their fireflies get the same size compensation the props themselves get.
      const distanceBoost = compact && index <= 4 ? 1.5 : 1;
      const scale = targetScale * emphasis * distanceBoost;
      const opacity = targetOpacity * (index >= 5 ? 0.88 : 1);

      if (reducedMotion) {
        sprite.position.set(base[0] - gatherOffset, base[1], base[2]);
        sprite.scale.set(scale, scale, 1);
        material.opacity = opacity;
        return;
      }

      const drift = 0.35 + visibility * 0.65;
      sprite.position.set(
        base[0] - gatherOffset + Math.sin(time * 0.24 + index * 1.7) * 0.045 * drift,
        base[1] + Math.sin(time * 0.42 + index * 1.2) * 0.055 * drift,
        base[2] - gatherOffset * 0.45 + Math.cos(time * 0.28 + index) * 0.035 * drift,
      );
      const nextScale = THREE.MathUtils.damp(sprite.scale.x, scale, 3.2, delta);
      sprite.scale.set(nextScale, nextScale, 1);
      material.opacity = THREE.MathUtils.damp(material.opacity, opacity, 3.2, delta);
    });
  });

  return (
    <group>
      {positions.map((position, index) => (
        <sprite
          key={index}
          ref={(node) => {
            sprites.current[index] = node;
          }}
          position={position}
          scale={[0.36, 0.36, 1]}
          renderOrder={6}
        >
          <spriteMaterial
            map={texture}
            color="#ffd426"
            transparent
            alphaTest={0.003}
            depthWrite={false}
            depthTest
            opacity={0.28}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  );
}

function Milestone({
  curve,
  milestone,
  active,
  approaching,
  reducedMotion,
}: {
  curve: THREE.CatmullRomCurve3;
  milestone: JourneyMilestone;
  active: boolean;
  approaching: boolean;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { size, gl } = useThree();
  // The portrait render surface has extra room on the right; artwork follows the page width.
  const compositionWidth = gl.domElement.closest(".prototype-shell")?.clientWidth ?? size.width;
  const compact = compositionWidth <= 700;
  const portraitScale = compositionWidth < 360 ? 0.9 : 1;
  const framing = getFraming(milestone, compact)!;
  const placement = useMemo(() => {
    const point = curve.getPointAt(milestone.progress.center);
    const tangent = curve.getTangentAt(milestone.progress.center).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    return {
      position: point.addScaledVector(normal, framing.landmarkLateral),
      rotation: Math.atan2(tangent.x, tangent.z),
    };
  }, [curve, milestone.progress.center, framing.landmarkLateral]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = active ? 1.03 : 1;
    const next = reducedMotion ? target : THREE.MathUtils.damp(group.current.scale.x, target, 4, delta);
    group.current.scale.setScalar(next);
  });

  const composition = compact
    ? {
        campus: [0.9, 0.82, 9.6] as Vec3,
        campusScale: [3.1 * portraitScale, 1.58 * portraitScale, 1] as Vec3,
        eiffel: [2.45, 0.68, 9.5] as Vec3,
        eiffelScale: [0.72 * portraitScale, 1.3 * portraitScale, 1] as Vec3,
        vegetation: [2.85, 1.38, 7.7] as Vec3,
        vegetationScale: [1.95, 2.31, 1] as Vec3,
        foregroundLeft: [3.5, 1.42, 4] as Vec3,
        foregroundUpperRight: [-3.8, 3.8, 6.6] as Vec3,
      }
    : {
        campus: [1, 0.72, 12] as Vec3,
        campusScale: [4.4, 2.24, 1] as Vec3,
        eiffel: [5.5, 0.56, 14] as Vec3,
        eiffelScale: [0.7, 1.28, 1] as Vec3,
        vegetation: [3.3, 1.6, 3.7] as Vec3,
        vegetationScale: [2.35, 2.79, 1] as Vec3,
        foregroundLeft: [4, 1.65, 0.5] as Vec3,
        foregroundUpperRight: [-7.2, 4.65, 1.2] as Vec3,
      };

  return (
    <group ref={group} position={placement.position} rotation={[0, placement.rotation, 0]}>
      <WorldSprite
        src="/assets/world/eiffel-landmark-v1.webp"
        position={composition.eiffel}
        scale={composition.eiffelScale}
        opacity={active ? 0.3 : 0.22}
        tint="#b7bacb"
        renderOrder={4}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src={SACLAY_ASSETS.campus}
        position={composition.campus}
        scale={composition.campusScale}
        opacity={active ? 0.7 : 0.58}
        tint="#ced0dc"
        renderOrder={5}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src={SACLAY_ASSETS.vegetation}
        position={composition.vegetation}
        scale={composition.vegetationScale}
        opacity={0.72}
        tint="#d0d3e0"
        renderOrder={7}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src={SACLAY_ASSETS.foregroundLeft}
        position={composition.foregroundLeft}
        scale={compact ? [4.1, 2.82, 1] : [4.8, 3.3, 1]}
        opacity={compact ? 0.72 : 0.86}
        renderOrder={22}
        reducedMotion={reducedMotion}
      />
      {!compact && (
        <WorldSprite
          src={SACLAY_ASSETS.foregroundUpperRight}
          position={composition.foregroundUpperRight}
          scale={[5.4, 3, 1]}
          opacity={0.92}
          renderOrder={24}
          reducedMotion={reducedMotion}
        />
      )}
      <Fireflies active={active} approaching={approaching} compact={compact} reducedMotion={reducedMotion} />
    </group>
  );
}

function ExperienceScene({
  controls,
  reducedMotion,
  journeyState,
  onJourneyStateChange,
  onMovingChange,
}: {
  controls: MutableRefObject<Controls>;
  reducedMotion: boolean;
  journeyState: JourneyState;
  onJourneyStateChange: (state: JourneyState) => void;
  onMovingChange: (moving: boolean) => void;
}) {
  const curve = useMemo(() => makePath(), []);
  const { camera, size, gl } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const milestoneState = useRef<JourneyState>(journeyState);
  const movingState = useRef(false);
  const saclayPhase: MilestonePhase = journeyState.milestoneId === SACLAY.id ? journeyState.phase : "distant";

  /* eslint-disable react-hooks/immutability -- R3F frame state is intentionally transient and ref-backed. */
  useFrame((_, delta) => {
    const control = controls.current;
    const near = getSlowdownWeight(control.progress) > 0;
    const movementScale = near ? 0.62 : 1;
    updateProgressTarget(control, control.forward * delta * 0.048 * movementScale);
    control.targetLateral = clamp(control.targetLateral + control.sideways * delta * 0.85, -0.78, 0.78);

    const previous = control.progress;
    control.progress = THREE.MathUtils.damp(control.progress, control.targetProgress, near ? 2.8 : 4, delta);
    control.lateral = THREE.MathUtils.damp(control.lateral, control.targetLateral, 7, delta);
    control.speed = Math.abs(control.progress - previous) / Math.max(delta, 0.001);

    const point = curve.getPointAt(control.progress);
    const tangent = curve.getTangentAt(control.progress).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const characterPoint = point.clone().addScaledVector(normal, control.lateral);
    // Measure the page, not the canvas: the mobile CSS widens the canvas by 20rem to
    // buy horizontal field of view, which used to push this over 700 and silently
    // disable the compact camera lift on exactly the screens that need it.
    const shellWidth = gl.domElement.closest(".prototype-shell")?.clientWidth ?? size.width;
    const nearestMilestone = getNearestMilestone(control.progress);
    const framing = getFraming(nearestMilestone, shellWidth <= 700);
    const distance = Math.abs(control.progress - nearestMilestone.progress.center);
    const editorialFraming = framing ? clamp(1 - distance / framing.cameraEmphasisRadius, 0, 1) : 0;
    const mobileVerticalRoom = clamp((700 - shellWidth) / 380, 0, 1) * 0.48;
    const cameraTarget = characterPoint
      .clone()
      .addScaledVector(tangent, -5.2)
      .addScaledVector(normal, 2.2 + editorialFraming * (framing?.cameraLateralBias ?? 0))
      .add(new THREE.Vector3(0, 3.35 + mobileVerticalRoom, 0));
    const ahead = curve
      .getPointAt(Math.min(0.995, control.progress + 0.035))
      .add(new THREE.Vector3(0, 1.05 + mobileVerticalRoom, 0));

    const cameraEase = reducedMotion ? 7 : 3.4;
    camera.position.lerp(cameraTarget, 1 - Math.exp(-cameraEase * delta));
    lookAt.current.lerp(ahead, 1 - Math.exp(-4 * delta));
    camera.lookAt(lookAt.current);

    const nextState = getJourneyState(control.progress, previous, milestoneState.current);
    if (nextState.milestoneId !== milestoneState.current.milestoneId || nextState.phase !== milestoneState.current.phase) {
      milestoneState.current = nextState;
      onJourneyStateChange(nextState);
    }

    const isMoving =
      control.speed > 0.0015 ||
      Math.abs(control.forward) > 0 ||
      Math.abs(control.sideways) > 0 ||
      Math.abs(control.targetProgress - control.progress) > 0.002 ||
      Math.abs(control.targetLateral - control.lateral) > 0.01;
    if (isMoving !== movingState.current) {
      movingState.current = isMoving;
      onMovingChange(isMoving);
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <color attach="background" args={["#929ac3"]} />
      <fog attach="fog" args={["#929ac3", 24, 62]} />
      {/* No lights: the road (meshBasicMaterial), the ground plane (meshBasicMaterial),
          and every sprite (spriteMaterial) here are unlit by construction, so an
          ambientLight/directionalLight would affect nothing — removed rather than kept
          as inert code. Depth and shading come from opacity, tint (WorldSprite's `tint`
          prop), and GroundContact's shared shadows instead. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, -24]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#c9cee6" />
      </mesh>
      <Road curve={curve} />
      <PathsideEnvironment curve={curve} reducedMotion={reducedMotion} />
      <GuideFireflies curve={curve} reducedMotion={reducedMotion} />
      <Milestone
        curve={curve}
        milestone={SACLAY}
        active={saclayPhase === "active"}
        approaching={saclayPhase === "approaching"}
        reducedMotion={reducedMotion}
      />
      <Peiwen
        curve={curve}
        controls={controls}
        reducedMotion={reducedMotion}
        milestoneActive={saclayPhase === "active"}
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
  const [journeyState, setJourneyState] = useState<JourneyState>(() => getJourneyState(0.03));
  const milestone = getMilestone(journeyState.milestoneId)!;
  const hasNarration = Boolean(milestone.narration.organization);
  // Keep confirmed details reachable by the existing skip link while CUC has no narration.
  const narrationMilestone = hasNarration ? milestone : SACLAY;
  const narration = narrationMilestone.narration;
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
    // Preserve ?arrival=1; named IDs also allow logical milestone review without debug UI.
    const arrival = new URLSearchParams(window.location.search).get("arrival");
    const reviewMilestone = getMilestone(arrival === "1" ? SACLAY.id : arrival ?? "");
    if (!reviewMilestone) return;
    controls.current.progress = reviewMilestone.progress.center;
    controls.current.targetProgress = reviewMilestone.progress.center;
  }, []);

  useEffect(() => {
    const show = window.setTimeout(() => setSelfTalk("Let's see where this goes..."), 850);
    const hide = window.setTimeout(() => setSelfTalk(""), 4200);
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
      data-milestone={journeyState.milestoneId}
      data-phase={journeyState.phase}
      onWheel={(event) => {
        updateProgressTarget(controls.current, event.deltaY * 0.0003);
      }}
      onPointerDown={(event) => {
        pointer.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!pointer.current) return;
        const deltaX = event.clientX - pointer.current.x;
        const deltaY = event.clientY - pointer.current.y;
        updateProgressTarget(controls.current, -deltaY * 0.00055);
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
          // No tone mapping: this is a flat, unlit, hand-drawn scene. R3F's default
          // ACES filmic curve was grading the road and ground plane (the only
          // non-`toneMapped={false}` materials) from warm paper down to neutral grey,
          // which is what split the frame into a cream sky over a grey field.
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
          }}
          fallback={<p className="canvas-fallback">The spatial view is unavailable. Experience details remain available.</p>}
        >
          <ExperienceScene
            controls={controls}
            reducedMotion={reducedMotion}
            journeyState={journeyState}
            onJourneyStateChange={setJourneyState}
            onMovingChange={handleMovingChange}
          />
        </Canvas>
      </div>

      {/* Hidden as soon as she takes a step, not only once the milestone is near: with the
          shorter run-up the tower enters frame within a tick or two and used to pass behind
          this headline. */}
      <header className="prototype-intro" data-hidden={hasMoved || journeyState.phase === "approaching" || journeyState.phase === "active"}>
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
        data-active={hasNarration && journeyState.phase === "active"}
        data-phase={hasNarration ? journeyState.phase : "distant"}
        data-side={getFraming(narrationMilestone, false)?.textSide}
        tabIndex={-1}
      >
        <p className="eyebrow">Experience</p>
        <h2>{narration.organization}</h2>
        <p>{[narration.identity, narration.period].filter(Boolean).join(" · ")}</p>
        {narration.summary && <p>{narration.summary}</p>}
      </article>
      <p className="arrival-status" aria-live="polite">
        {journeyState.phase === "active" ? milestone.narration.arrivalAnnouncement ?? "" : ""}
      </p>
    </main>
  );
}
