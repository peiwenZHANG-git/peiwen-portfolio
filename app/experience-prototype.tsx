"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

const MILESTONE_PROGRESS = 0.47;
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
      <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <circleGeometry args={[0.34, 20]} />
        <meshBasicMaterial color="#d7d2c5" transparent opacity={0.3} depthWrite={false} />
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

const MILESTONE_FIREFLY_POSITIONS: [number, number, number][] = [
  // Two by the tower, three around the diagram/lamp, two inviting from the path.
  [2.1, 1.08, 1.35],
  [3.1, 2.45, 1.8],
  [0.48, 1.5, 1.7],
  [-0.2, 1.08, 1.05],
  [-0.08, 1.84, 2.15],
  [-1.7, 0.68, 0.85],
  [-1.95, 1.1, 1.5],
];
const COMPACT_FIREFLY_POSITIONS: [number, number, number][] = [
  [3.15, 0.95, 1.55],
  [3.28, 2.1, 2.1],
  [1.58, 1.3, 1.85],
  [0.82, 0.88, 1.85],
  [1.32, 1.68, 2.35],
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
      const scale = targetScale * emphasis;
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
  const groundWash = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -0.12);
    shape.bezierCurveTo(-0.88, -0.36, 0.42, -0.29, 0.94, -0.07);
    shape.bezierCurveTo(1.18, 0.1, 0.32, 0.32, -0.18, 0.23);
    shape.bezierCurveTo(-0.61, 0.32, -1.15, 0.08, -1, -0.12);
    return shape;
  }, []);
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

  return (
    <group ref={group} position={placement.position} rotation={[0, placement.rotation, 0]}>
      <WorldSprite
        src="/assets/world/eiffel-landmark-v1.webp"
        position={compact ? [2.7, 1.2 * portraitScale, 1.8] : [2.5, 1.65, 1.5]}
        scale={compact ? [2.436 * portraitScale, 3.78 * portraitScale, 1] : [3.216, 4.98, 1]}
        opacity={active ? 0.94 : 0.78}
        renderOrder={4}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/saclay-notebook-v1.webp"
        position={compact ? [0.82, 0.35, 1.7] : [-0.52, 0.36, 1.02]}
        scale={[0.67, 0.6, 1]}
        opacity={active ? 0.82 : 0.68}
        tilt={-0.065}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/saclay-research-diagram-v1.webp"
        position={compact ? [1.65, 0.88, 2.55] : [0.69, 1.0, 1.95]}
        scale={compact ? [0.85, 0.92, 1] : [1.03, 1.12, 1]}
        opacity={active ? 0.94 : 0.72}
        tilt={0.035}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/saclay-desk-lamp-v1.webp"
        position={compact ? [1.22, 0.49, 2.05] : [0.05, 0.56, 1.5]}
        scale={[0.86, 0.75, 1]}
        opacity={active ? 0.9 : 0.68}
        tilt={0.025}
        reducedMotion={reducedMotion}
      />
      {/* A few translucent, uneven washes anchor the fragments without a desk. */}
      <group position={compact ? [1.17, 0.04, 2.04] : [0.01, 0.04, 1.5]}>
        {[1, 1.18, 1.4].map((spread, index) => (
          <mesh key={spread} rotation={[-Math.PI / 2, 0, -0.06]} scale={[spread, spread, 1]}>
            <shapeGeometry args={[groundWash]} />
            <meshBasicMaterial color="#8a8069" transparent opacity={0.024 - index * 0.007} depthWrite={false} />
          </mesh>
        ))}
        <lineSegments geometry={groundLine} position={[0, 0.006, 0.2]}>
          <lineBasicMaterial color="#8a8069" transparent opacity={0.17} depthWrite={false} />
        </lineSegments>
      </group>
      <lineSegments geometry={groundLine} position={compact ? [2.7, 0.045, 1.3] : [2.5, 0.045, 1.3]} scale={[0.7, 1, 1]}>
        <lineBasicMaterial color="#8a8069" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
      <WorldSprite
        src={GRASS_TEXTURES[0]}
        position={compact ? [3.12, 0.12, 1.3] : [3.12, 0.18, 1.45]}
        scale={[0.3, 0.38, 1]}
        opacity={0.54}
        motion="sway"
        phase={2.1}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src={FLOWER_TEXTURES[0]}
        position={compact ? [0.59, 0.12, 1.86] : [-0.82, 0.12, 1.15]}
        scale={[0.18, 0.22, 1]}
        opacity={0.48}
        reducedMotion={reducedMotion}
      />
      <WorldSprite
        src="/assets/world/dandelion-seeds-v1.webp"
        position={[2.72, 1.72, -0.8]}
        scale={[0.66, 0.42, 1]}
        opacity={0.26}
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
  const { camera, size } = useThree();
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
    const distance = Math.abs(control.progress - MILESTONE_PROGRESS);
    const editorialFraming = clamp(1 - distance / 0.2, 0, 1);
    const mobileVerticalRoom = clamp((700 - size.width) / 380, 0, 1) * 0.48;
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
    const show = window.setTimeout(() => setSelfTalk("Let's see where this goes..."), 850);
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
