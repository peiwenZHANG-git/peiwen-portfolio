// Rope shapes in 1448 x 1086 illustration units (desktop stage).
const C = [9.376263546522076e-14, -4.5625567792277554e-10, 8.213574349135036e-07, -0.0008162532349829653, 0.5001760329313447, 182.73006693101902];
const XMIN = -20;
const XMAX = 1440;
const poly = (x: number) => C.reduce((y, c) => y * x + c, 0);
function dpolyReal(x: number) {
  let d = 0;
  for (let i = 0; i < C.length - 1; i++) d = d * x + C[i] * (C.length - 1 - i);
  return d;
}

/** Upper rope: drawn as an SVG line across the stage. */
export function upperRope(x: number) {
  if (x < XMIN) return poly(XMIN) + dpolyReal(XMIN) * (x - XMIN);
  if (x > XMAX) return poly(XMAX) + dpolyReal(XMAX) * (x - XMAX);
  return poly(x);
}
export function upperSlope(x: number) { return dpolyReal(Math.max(XMIN, Math.min(XMAX, x))); }

/** Lower rope: painted into the background image. */
const LOWER_END = 1419; // the painted rope ends here
const lowerCurve = (x: number) => { const t = (x - 807) / 641; return 554 + 109 * t - 138 * t * t; };
export function lowerSlope(x: number) { const t = (Math.min(x, LOWER_END) - 807) / 641; return (109 - 276 * t) / 641; }
export function lowerRope(x: number) { return x <= LOWER_END ? lowerCurve(x) : lowerCurve(LOWER_END) + lowerSlope(LOWER_END) * (x - LOWER_END); }

/** SVG path along the upper rope. `bend` adds a live displacement (rope spring); `step` is the sample spacing. */
export function upperRopePath(offset = 0, wave = 0, wavelength = 7, phase = 0, bend?: (x: number) => number, step = 2) {
  let d = "";
  for (let x = -10; x <= 1458; x += step) {
    const y = upperRope(x) + offset + 0.6 * Math.sin(x / 41) + 0.35 * Math.sin(x / 11.3) + wave * Math.sin((x / wavelength) * 2 * Math.PI + phase) + (bend ? bend(x) : 0);
    d += `${d ? "L" : "M"}${x} ${y.toFixed(2)}`;
  }
  return d;
}

/** Tiny frayed fibres poking out of the twine, at fixed pseudo-random spots. */
export function upperRopeFibres(bend?: (x: number) => number) {
  const rand = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  let d = "";
  for (let k = 0; k < 62; k++) {
    const x = 6 + k * 23.5 + rand(k) * 16;
    const y = upperRope(x) + 0.6 * Math.sin(x / 41) + 0.35 * Math.sin(x / 11.3) + (bend ? bend(x) : 0);
    const up = rand(k + 90) > 0.5 ? -1 : 1;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}l${((rand(k + 30) - 0.3) * 4).toFixed(1)} ${(up * (1.6 + rand(k + 60) * 2.6)).toFixed(1)}`;
  }
  return d;
}
