import { L } from "@/components/lang";
import styles from "./visual-search.module.css";

/* Means of the six participants' own condition means (each = 5 trials), with 95% CI
   half-widths from the t distribution (df = 5). Recomputed from log_merge.csv. */
const levels = [
  { label: "Low", n: 9 },
  { label: "Medium", n: 25 },
  { label: "High", n: 49 },
];

const series = [
  { key: "contrast", name: "Contrast", dx: -11, mean: [1229, 1252, 1332], ci: [796, 780, 710] },
  { key: "addition", name: "Addition", dx: 11, mean: [1374, 1390, 1456], ci: [798, 657, 615] },
  { key: "mixed", name: "Contrast + Addition", dx: 0, mean: [2558, 5395, 5623], ci: [900, 2599, 2910] },
] as const;

const W = 680;
const H = 420;
const left = 70;
const right = 650;
const top = 62;
const bottom = 350;
const yMax = 9000;
const xs = [190, 360, 530];
const y = (v: number) => bottom - (v / yMax) * (bottom - top);

function Marker({ kind, x, cy }: { kind: string; x: number; cy: number }) {
  if (kind === "contrast") return <circle cx={x} cy={cy} r={5} />;
  if (kind === "addition") return <rect x={x - 4.5} y={cy - 4.5} width={9} height={9} />;
  return <path d={`M${x} ${cy - 6} L${x + 6} ${cy + 5} L${x - 6} ${cy + 5} Z`} />;
}

export function SearchChart() {
  const summary = "Mean visual search time in milliseconds by object count. Contrast stays near 1.2 to 1.3 seconds and Addition near 1.4 to 1.5 seconds at 9, 25 and 49 objects. Contrast plus Addition rises from about 2.6 seconds at 9 objects to about 5.4 seconds at 25 and 5.6 seconds at 49.";
  return (
    <figure className={styles.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        {[0, 3000, 6000, 9000].map((t) => (
          <g key={t}>
            <line className={styles.grid} x1={left} x2={right} y1={y(t)} y2={y(t)} />
            <text className={styles.tick} x={left - 10} y={y(t) + 4} textAnchor="end">{t === 0 ? "0" : `${t / 1000} s`}</text>
          </g>
        ))}
        {levels.map((l, i) => (
          <text key={l.label} className={styles.tick} x={xs[i]} y={bottom + 26} textAnchor="middle">{l.label} · {l.n}</text>
        ))}
        <text className={styles.axis} x={(left + right) / 2} y={bottom + 54} textAnchor="middle">object count (items on screen)</text>
        {series.map((s) => (
          <g key={s.key} className={styles[s.key]}>
            <polyline fill="none" points={xs.map((x, i) => `${x + s.dx},${y(s.mean[i])}`).join(" ")} />
            {xs.map((x, i) => (
              <g key={i}>
                <line className={styles.whisker} x1={x + s.dx} x2={x + s.dx} y1={y(s.mean[i] + s.ci[i])} y2={y(s.mean[i] - s.ci[i])} />
                <line className={styles.whisker} x1={x + s.dx - 4} x2={x + s.dx + 4} y1={y(s.mean[i] + s.ci[i])} y2={y(s.mean[i] + s.ci[i])} />
                <line className={styles.whisker} x1={x + s.dx - 4} x2={x + s.dx + 4} y1={y(s.mean[i] - s.ci[i])} y2={y(s.mean[i] - s.ci[i])} />
                <Marker kind={s.key} x={x + s.dx} cy={y(s.mean[i])} />
              </g>
            ))}
          </g>
        ))}
        {series.map((s, i) => (
          <g key={s.key} className={styles[s.key]} transform={`translate(${left + 6 + i * 150}, 22)`}>
            <Marker kind={s.key} x={6} cy={0} />
            <text className={styles.legend} x={20} y={4}>{s.name}</text>
          </g>
        ))}
      </svg>
      <figcaption>
        <L
          en="Mean search time (ms) by object count. Each point is the mean of six participants' own means; whiskers are 95% confidence intervals (n = 6)."
          zh="不同物体数量下的平均搜索时间（毫秒）。每个点是 6 位被试各自均值的平均；须线为 95% 置信区间（n = 6）。"
        />
      </figcaption>
    </figure>
  );
}
