"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

const MILESTONE_PROGRESS = 0.24;
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
      <mesh geometry={geometry.ribbon} receiveShadow renderOrder={0}>
        <meshBasicMaterial color="#f5f1e7" polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>
      <lineSegments geometry={geometry.edgeLines} renderOrder={1}>
        <lineBasicMaterial color="#4b4942" />
      </lineSegments>
      <lineSegments geometry={geometry.echoLines} renderOrder={2}>
        <lineBasicMaterial color="#77736a" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={geometry.markLines} renderOrder={2}>
        <lineBasicMaterial color="#77736a" transparent opacity={0.28} depthWrite={false} />
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

function GroundContact({
  position,
  radius = 1,
  strength = 1,
}: {
  position: Vec3;
  radius?: number;
  strength?: number;
}) {
  // One shared irregular blob silhouette, reused at different sizes under every grounded
  // object (Eiffel, the vignette, Peiwen). Deliberately local to each object's own footprint
  // rather than one continuous line, so the milestone doesn't read as objects on a stage.
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, -0.12);
    s.bezierCurveTo(-0.88, -0.36, 0.42, -0.29, 0.94, -0.07);
    s.bezierCurveTo(1.18, 0.1, 0.32, 0.32, -0.18, 0.23);
    s.bezierCurveTo(-0.61, 0.32, -1.15, 0.08, -1, -0.12);
    return s;
  }, []);

  return (
    <group position={position}>
      {[1, 1.2, 1.42].map((spread, index) => (
        <mesh key={spread} rotation={[-Math.PI / 2, 0, -0.06]} scale={[spread * radius, spread * radius, 1]}>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color="#8a8069"
            transparent
            opacity={(0.09 - index * 0.024) * strength}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
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
      {/* Distant sky layer */}
      <WorldSprite src={CLOUD_TEXTURES[0]} position={pathPosition(curve, 0.08, 5.4, 3.45)} scale={[2.35, 1.12, 1]} opacity={0.32} reducedMotion={reducedMotion} />
      <WorldSprite src={CLOUD_TEXTURES[1]} position={pathPosition(curve, 0.27, -5.8, 3.75)} scale={[2.6, 1.2, 1]} opacity={0.3} reducedMotion={reducedMotion} />
      {!compact && <WorldSprite src={CLOUD_TEXTURES[2]} position={pathPosition(curve, 0.47, -6.1, 3.6)} scale={[2.9, 1.28, 1]} opacity={0.32} reducedMotion={reducedMotion} />}

      {/* Immediate invitation: one small garden patch, opposite the intro copy. */}
      <WorldSprite src={GRASS_TEXTURES[1]} position={pathPosition(curve, 0.065, 2.25, 0.34)} scale={[0.7, 0.82, 1]} motion="sway" phase={0.5} opacity={0.76} reducedMotion={reducedMotion} />
      <WorldSprite src={FLOWER_TEXTURES[0]} position={pathPosition(curve, 0.078, 2.72, 0.27)} scale={[0.38, 0.46, 1]} opacity={0.72} reducedMotion={reducedMotion} />
      <WorldSprite src={GRASS_TEXTURES[0]} position={pathPosition(curve, 0.135, -2.35, 0.29)} scale={[0.52, 0.62, 1]} motion="sway" phase={1.8} opacity={0.58} reducedMotion={reducedMotion} />

      {/* First bend: wind on one side, a grounded cluster on the other. */}
      <WorldSprite src={GRASS_TEXTURES[2]} position={pathPosition(curve, 0.215, -2.5, 0.4)} scale={[0.78, 0.9, 1]} motion="sway" phase={2.4} opacity={0.72} reducedMotion={reducedMotion} />
      <WorldSprite src={FLOWER_TEXTURES[1]} position={pathPosition(curve, 0.225, -2.88, 0.3)} scale={[0.42, 0.5, 1]} opacity={0.7} reducedMotion={reducedMotion} />
      <WorldSprite src="/assets/world/dandelion-seeds-v1.webp" position={pathPosition(curve, 0.235, 2.9, 1.85)} scale={[1.25, 0.8, 1]} opacity={0.44} motion="float" phase={0.4} reducedMotion={reducedMotion} />

      {/* Paris-Saclay approach: vegetation stays left, preserving right-side text space. */}
      <WorldSprite src={GRASS_TEXTURES[3]} position={pathPosition(curve, 0.39, -2.25, 0.36)} scale={[0.78, 0.88, 1]} motion="sway" phase={0.8} opacity={0.72} reducedMotion={reducedMotion} />
      <WorldSprite src={FLOWER_TEXTURES[2]} position={pathPosition(curve, 0.405, -2.7, 0.32)} scale={[0.44, 0.54, 1]} opacity={0.72} reducedMotion={reducedMotion} />

      {/* The path continues without implying another Experience milestone. */}
      <WorldSprite src={GRASS_TEXTURES[1]} position={pathPosition(curve, 0.57, 2.35, 0.36)} scale={[0.64, 0.76, 1]} motion="sway" phase={2.8} opacity={0.62} reducedMotion={reducedMotion} />
      <WorldSprite src="/assets/world/dandelion-seeds-v1.webp" position={pathPosition(curve, 0.63, -3.1, 1.75)} scale={[1.02, 0.68, 1]} opacity={0.38} motion="float" phase={2.2} reducedMotion={reducedMotion} />

      {/* One deliberate foreground edge, allowed to occlude only when spatially closer. */}
      <WorldSprite src={GRASS_TEXTURES[3]} position={pathPosition(curve, 0.018, -3.25, 0.58)} scale={[1.05, 1.3, 1]} motion="sway" phase={1.1} opacity={0.38} renderOrder={25} reducedMotion={reducedMotion} />
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
      {/* Same warm-gray tone as GroundContact, so Peiwen's shadow belongs to the same
          shared grounding system as the milestone's, rather than its own separate cue. */}
      <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <circleGeometry args={[0.34, 20]} />
        <meshBasicMaterial color="#8a8069" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <sprite ref={sprite} position={[0, 0.84, 0]} scale={[1.22, 1.82, 1]} renderOrder={20}>
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
  [1.1, 1.05, 4.65],
  [2.0, 2.3, 5.1],
  [-1.2, 1.15, 1.3],
  [-0.85, 0.78, 1.05],
  [0.1, 1.32, 1.6],
  [-0.2, 0.7, 0.95],
  [-0.42, 1.05, 1.35],
];
const COMPACT_FIREFLY_POSITIONS: [number, number, number][] = [
  [0.35, 0.95, 8.65],
  [0.55, 1.95, 9.1],
  [0.3, 0.95, 7.0],
  [0.75, 0.7, 6.8],
  [-0.55, 1.05, 7.25],
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
  active,
  approaching,
  reducedMotion,
}: {
  curve: THREE.CatmullRomCurve3;
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
  const groundLine = useMemo(() => new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.15, 0, -0.08), new THREE.Vector3(-0.74, 0, -0.035),
    new THREE.Vector3(-0.66, 0, -0.02), new THREE.Vector3(-0.13, 0, 0.014),
    new THREE.Vector3(0.03, 0, 0.008), new THREE.Vector3(0.7, 0, 0.055),
  ]), []);
  useEffect(() => () => groundLine.dispose(), [groundLine]);
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

  // Read left-to-right as: sheet, lamp leaning over it, book resting at the lamp's foot.
  // The order matters and was wrong in the first pass - the sheet sat on the far side, so
  // the lamp's head (which points screen-left in the artwork) turned away from the thing it
  // is meant to be lighting, and the sheet ended up pressed against Peiwen's silhouette,
  // fully hidden behind her through the last stretch of the approach. With the sheet moved
  // to the lamp-head side, the light now falls across it, the cluster pulls away from the
  // walker, and the piece nearest her is the small low book rather than a tall pale rectangle.
  // Every piece sits with its own bottom edge on the ground - y is the rendered half-height,
  // sunk ~0.02 - so vertical staging comes from depth, not from floating at three altitudes.
  // Mobile is composed separately rather than scaled down from this: the portrait canvas has
  // only ~22 degrees of horizontal field of view, so the cluster is parked further down the
  // path, carries less size compensation (1.18, down from 1.45) to buy real air between the
  // pieces, and sits well to the left of the tower instead of across its legs.
  const vignette: {
    notebook: Vec3;
    diagram: Vec3;
    lamp: Vec3;
    pairAnchor: Vec3;
    sheetAnchor: Vec3;
  } = compact
    ? {
        // The cluster's local x axis runs close to the view direction at the portrait arrival
        // camera, so sliding along it swings pieces across the frame and even flips which side
        // they land on. Mobile therefore keeps the x band that verified clean against the
        // subtitle and buys its breathing room by carrying less size compensation instead.
        diagram: [-0.62, 0.39, 7.25],
        lamp: [0.38, 0.43, 6.95],
        notebook: [0.9, 0.3, 6.7],
        pairAnchor: [0.64, 0.04, 6.85],
        sheetAnchor: [-0.62, 0.04, 7.25],
      }
    : {
        // Same caveat as mobile: this axis is near-parallel to the view direction at the
        // arrival camera, so sliding the cluster along it is not a safe "move left" - a 0.47
        // nudge swung the order around and pushed the sheet out of frame entirely. These are
        // the values verified on screen.
        diagram: [0.25, 0.385, 1.75],
        lamp: [-1.25, 0.43, 1.4],
        notebook: [-0.81, 0.3, 1.1],
        pairAnchor: [-1.03, 0.04, 1.25],
        sheetAnchor: [0.25, 0.04, 1.75],
      };
  const vignetteScale = compact ? 1.02 : 1;
  // Eiffel reads as a landmark further down the road rather than a prop she walks
  // straight past. Parked beside the path it swung out of frame before the arrival
  // text appeared, and swelled from ~49% to ~112% of viewport height on the way.
  // Brought down the road AND in toward the walker's side, because distance alone barely
  // moved it: at z 7.4 it still only gained ~2% of frame height, since the viewing distance
  // here is dominated by the group's -3.15 lateral offset rather than by z. Desktop now sits
  // at local x 1.4 / z 4.8 with the sprite trimmed to 4.2 tall, which reads ~51% of viewport
  // height at arrival (was ~45%) with its base 7% lower in frame - the cue that actually says
  // "near" - while the tip keeps the same headroom as before. It also holds still: across the
  // whole run-up it stays within x 17-37% of the frame, where the old placement swung from
  // the left edge across to 95% (into the text column) and back. y stays derived from the
  // sprite height so the feet keep meeting the shadow.
  // Mobile clears the subtitle by trimming ~11% of the tower's height rather than by pushing
  // it further down the path: depth is not a usable lever here, since on the portrait camera
  // every unit of z also slides the tower sideways (z 8.8 -> 10.4 moved it ~90px right and
  // clipped it against the frame edge). Height drops the tip without moving it horizontally.
  const eiffel: Vec3 = compact
    ? [0.1, 1.66 * portraitScale, 8.8]
    : [1.4, 2.08, 4.8];
  const eiffelBase: Vec3 = compact ? [0.1, 0.045, 8.6] : [1.4, 0.045, 4.6];

  return (
    <group ref={group} position={placement.position} rotation={[0, placement.rotation, 0]}>
      <WorldSprite
        src="/assets/world/eiffel-landmark-v1.webp"
        position={eiffel}
        scale={compact ? [2.17 * portraitScale, 3.36 * portraitScale, 1] : [2.71, 4.2, 1]}
        opacity={active ? 0.94 : 0.78}
        renderOrder={4}
        reducedMotion={reducedMotion}
      />
      {/* The tower artwork fills its sprite frame down to the last 0.4%, so centring it
          at y=1.65 buried its feet 0.82 below the ground the shadow sits on. The centre
          height is now derived from that measurement instead of eyeballed. */}
      <GroundContact position={eiffelBase} radius={0.95} strength={1.1} />

      <WorldSprite
        src="/assets/world/saclay-notebook-v1.webp"
        position={vignette.notebook}
        scale={[0.7 * vignetteScale, 0.63 * vignetteScale, 1]}
        opacity={active ? 0.82 : 0.68}
        tilt={-0.065}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/saclay-research-diagram-v1.webp"
        position={vignette.diagram}
        scale={[0.74 * vignetteScale, 0.8 * vignetteScale, 1]}
        opacity={active ? 0.94 : 0.72}
        tilt={0.05}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/saclay-desk-lamp-v1.webp"
        position={vignette.lamp}
        scale={[1.0 * vignetteScale, 0.88 * vignetteScale, 1]}
        opacity={active ? 0.9 : 0.68}
        tilt={0.015}
        reducedMotion={reducedMotion}
      />
      {/* Same blob family and tone as Eiffel's, but two footprints rather than one mat:
          the lamp-and-notebook pair share a contact, the sheet keeps its own smaller one,
          so the air between the two beats stays real instead of being bridged by shadow. */}
      <GroundContact position={vignette.pairAnchor} radius={0.82 * vignetteScale} strength={1} />
      <GroundContact position={vignette.sheetAnchor} radius={0.46 * vignetteScale} strength={0.85} />
      <lineSegments
        geometry={groundLine}
        position={[vignette.pairAnchor[0], vignette.pairAnchor[1] + 0.006, vignette.pairAnchor[2] + 0.2]}
        scale={[vignetteScale, 1, vignetteScale]}
      >
        <lineBasicMaterial color="#8a8069" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={groundLine} position={eiffelBase} scale={[1.3, 1, 1]}>
        <lineBasicMaterial color="#8a8069" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      {/* Minor environment details: tinted and dimmed a step further so they sit behind
          Eiffel, Peiwen, and the vignette in the reading order instead of competing. */}
      <WorldSprite
        src={GRASS_TEXTURES[0]}
        position={compact ? [3.12, 0.12, 1.3] : [3.12, 0.18, 1.45]}
        scale={[0.3, 0.38, 1]}
        opacity={0.44}
        tint="#d8d2c0"
        motion="sway"
        phase={2.1}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src={FLOWER_TEXTURES[0]}
        position={compact ? [0.59, 0.12, 1.86] : [-2.62, 0.12, 1.68]}
        scale={[0.18, 0.22, 1]}
        opacity={0.38}
        tint="#d8d2c0"
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/dandelion-seeds-v1.webp"
        position={[2.72, 1.72, -0.8]}
        scale={[0.66, 0.42, 1]}
        opacity={0.2}
        tint="#d8d2c0"
        motion="float"
        phase={2.6}
        renderOrder={4}
        reducedMotion={reducedMotion}
      />
      <Fireflies active={active} approaching={approaching} compact={compact} reducedMotion={reducedMotion} />
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
  const { camera, size, gl } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const milestoneState = useRef<MilestonePhase>("distant");
  const movingState = useRef(false);

  /* eslint-disable react-hooks/immutability -- R3F frame state is intentionally transient and ref-backed. */
  useFrame((_, delta) => {
    const control = controls.current;
    const near = Math.abs(control.progress - MILESTONE_PROGRESS) < 0.07;
    const movementScale = near ? 0.62 : 1;
    control.targetProgress = clamp(control.targetProgress + control.forward * delta * 0.048 * movementScale, 0.015, 0.985);
    control.targetLateral = clamp(control.targetLateral + control.sideways * delta * 0.85, -0.78, 0.78);

    const previous = control.progress;
    control.progress = THREE.MathUtils.damp(control.progress, control.targetProgress, near ? 2.8 : 4, delta);
    control.lateral = THREE.MathUtils.damp(control.lateral, control.targetLateral, 7, delta);
    control.speed = Math.abs(control.progress - previous) / Math.max(delta, 0.001);

    const point = curve.getPointAt(control.progress);
    const tangent = curve.getTangentAt(control.progress).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const characterPoint = point.clone().addScaledVector(normal, control.lateral);
    const distance = Math.abs(control.progress - MILESTONE_PROGRESS);
    const editorialFraming = clamp(1 - distance / 0.13, 0, 1);
    // Measure the page, not the canvas: the mobile CSS widens the canvas by 20rem to
    // buy horizontal field of view, which used to push this over 700 and silently
    // disable the compact camera lift on exactly the screens that need it.
    const shellWidth = gl.domElement.closest(".prototype-shell")?.clientWidth ?? size.width;
    const mobileVerticalRoom = clamp((700 - shellWidth) / 380, 0, 1) * 0.48;
    const cameraTarget = characterPoint
      .clone()
      .addScaledVector(tangent, -5.2)
      .addScaledVector(normal, 2.2 + editorialFraming * 0.34)
      .add(new THREE.Vector3(0, 3.35 + mobileVerticalRoom, 0));
    const ahead = curve
      .getPointAt(Math.min(0.995, control.progress + 0.035))
      .add(new THREE.Vector3(0, 1.05 + mobileVerticalRoom, 0));

    const cameraEase = reducedMotion ? 7 : 3.4;
    camera.position.lerp(cameraTarget, 1 - Math.exp(-cameraEase * delta));
    lookAt.current.lerp(ahead, 1 - Math.exp(-4 * delta));
    camera.lookAt(lookAt.current);

    // Windows are absolute progress units, so they were retuned along with the shorter
    // run-up: at the old 0.082/0.18 the walker would have been "approaching" almost from
    // the first wheel tick, and the arrival text would have appeared before she arrived.
    const nextPhase: MilestonePhase = distance < 0.055
      ? "active"
      : distance < 0.105
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
      {/* No lights: the road (meshBasicMaterial), the ground plane (meshBasicMaterial),
          and every sprite (spriteMaterial) here are unlit by construction, so an
          ambientLight/directionalLight would affect nothing — removed rather than kept
          as inert code. Depth and shading come from opacity, tint (WorldSprite's `tint`
          prop), and GroundContact's shared shadows instead. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, -24]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#faf9f3" />
      </mesh>
      <Road curve={curve} />
      <PathsideEnvironment curve={curve} reducedMotion={reducedMotion} />
      <GuideFireflies curve={curve} reducedMotion={reducedMotion} />
      <Milestone
        curve={curve}
        active={milestonePhase === "active"}
        approaching={milestonePhase === "approaching"}
        reducedMotion={reducedMotion}
      />
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
    // Review aid only: ?arrival=1 seeds progress at the Paris-Saclay milestone so the
    // static arrival composition can be inspected/screenshotted without scrolling in.
    // Camera and control logic are untouched; the camera still eases to this position
    // over ~1-2s the same way it would after walking there, it just starts already there.
    if (new URLSearchParams(window.location.search).get("arrival") !== "1") return;
    controls.current.progress = MILESTONE_PROGRESS;
    controls.current.targetProgress = MILESTONE_PROGRESS;
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
      onWheel={(event) => {
        controls.current.targetProgress = clamp(controls.current.targetProgress + event.deltaY * 0.0003, 0.015, 0.985);
      }}
      onPointerDown={(event) => {
        pointer.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!pointer.current) return;
        const deltaX = event.clientX - pointer.current.x;
        const deltaY = event.clientY - pointer.current.y;
        controls.current.targetProgress = clamp(controls.current.targetProgress - deltaY * 0.00055, 0.015, 0.985);
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
            milestonePhase={milestonePhase}
            onMilestonePhaseChange={setMilestonePhase}
            onMovingChange={handleMovingChange}
          />
        </Canvas>
      </div>

      {/* Hidden as soon as she takes a step, not only once the milestone is near: with the
          shorter run-up the tower enters frame within a tick or two and used to pass behind
          this headline. */}
      <header className="prototype-intro" data-hidden={hasMoved || milestonePhase !== "distant"}>
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
        data-side="right"
        tabIndex={-1}
      >
        <p className="eyebrow">Experience</p>
        <h2>Université Paris-Saclay</h2>
        <p>Human-Computer Interaction · 2025–Present</p>
      </article>
      <p className="arrival-status" aria-live="polite">
        {milestonePhase === "active" ? "You have reached the Université Paris-Saclay experience landmark." : ""}
      </p>
    </main>
  );
}
