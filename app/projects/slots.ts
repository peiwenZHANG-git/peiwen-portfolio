import type { CSSProperties } from "react";
import { lowerRope, lowerSlope, upperRope, upperSlope } from "./rope-math";

/**
 * Desktop hanging slots, in units of the 1448 x 1086 attic illustration.
 * x = clip centre at scroll 0, w/h = paper size, cx = clip position across the paper (0..1),
 * dy = paper top below the rope, rot = resting tilt in degrees. Decor papers are pre-tilted art.
 */
export type Slot = { x: number; w: number; h: number; cx: number; dy: number; rot: number };

export const slots: Record<string, Slot> = {
  "decor:sprig": { x: 87, w: 66, h: 110, cx: 0.55, dy: -12, rot: 0 },
  "reso:ill": { x: 225, w: 161, h: 214, cx: 0.3, dy: 4, rot: 10 },
  "reso:note": { x: 400, w: 139, h: 186, cx: 0.38, dy: 16, rot: 7 },
  "arm-swing:ill": { x: 553, w: 159, h: 200, cx: 0.28, dy: 19, rot: 4.5 },
  "arm-swing:note": { x: 744, w: 140, h: 210, cx: 0.44, dy: 8, rot: 0.5 },
  "tangram:ill": { x: 891, w: 170, h: 200, cx: 0.28, dy: 6, rot: -1.5 },
  "tangram:note": { x: 1103, w: 137, h: 190, cx: 0.36, dy: 7, rot: -3 },
  "decor:cat": { x: 1276.5, w: 126, h: 162, cx: 0.52, dy: -24, rot: 0 },
  "music-vr:ill": { x: 1505, w: 160, h: 205, cx: 0.3, dy: 12, rot: -2 },
  "music-vr:note": { x: 1676, w: 139, h: 186, cx: 0.38, dy: 14, rot: -4 },
  "maze:ill": { x: 1858, w: 160, h: 205, cx: 0.3, dy: 8, rot: 1 },
  "decor:edge": { x: 1420, w: 50, h: 84, cx: 0.55, dy: -10, rot: 0 },
  "maze:note": { x: 2034, w: 139, h: 190, cx: 0.4, dy: 10, rot: 3 },

  "decor:botanical": { x: 891, w: 84, h: 140, cx: 0.55, dy: -15, rot: 0 },
  "flight:ill": { x: 1002, w: 118, h: 148, cx: 0.5, dy: 8, rot: -2 },
  "flight:note": { x: 1124, w: 108, h: 136, cx: 0.5, dy: 9, rot: 3 },
  "decor:flowers": { x: 1240, w: 106, h: 146, cx: 0.5, dy: -15, rot: 0 },
  "chess:ill": { x: 1356, w: 118, h: 148, cx: 0.5, dy: 8, rot: 2 },
  "chess:note": { x: 1478, w: 108, h: 136, cx: 0.5, dy: 9, rot: -2 },
  "decor:wip": { x: 1596, w: 120, h: 166, cx: 0.51, dy: -15, rot: 0 },
  "zoo:ill": { x: 1716, w: 118, h: 148, cx: 0.5, dy: 8, rot: -3 },
  "zoo:note": { x: 1838, w: 108, h: 136, cx: 0.5, dy: 9, rot: 2 },
  "decor:peiwen": { x: 1962, w: 140, h: 202, cx: 0.51, dy: -16, rot: 0 },
};

const lowerKeys = new Set(["decor:botanical", "flight:ill", "flight:note", "decor:flowers", "chess:ill", "chess:note", "decor:wip", "zoo:ill", "zoo:note", "decor:peiwen"]);
/** Rope viewport top edges in illustration units (must match projects.module.css). */
export const ropeOrigin = { featured: 165, smaller: 520 } as const;

export function slotProps(key: string) {
  const s = slots[key];
  // Resting position at scroll 0, so the server render already hangs on the rope.
  const lower = lowerKeys.has(key);
  const ropeY = lower ? lowerRope : upperRope;
  const slope = lower ? lowerSlope : upperSlope;
  const ry = ropeY(s.x) + s.dy - (lower ? ropeOrigin.smaller : ropeOrigin.featured);
  return {
    "data-slot": key,
    "data-x": s.x,
    "data-dy": s.dy,
    "data-rot": s.rot,
    style: { "--x": s.x, "--w": s.w, "--h": s.h, "--cx": s.cx, "--dy": s.dy, "--ry": Number(ry.toFixed(2)), "--rot": s.rot } as CSSProperties,
  };
}
