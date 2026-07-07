// Moteur Monte Carlo : GBM (mouvement brownien géométrique) calibré sur
// l'historique réel de chaque titre (2 ans de clôtures quotidiennes).
// Deux dérives simulées : « historique » (momentum passé prolongé) et
// « neutre » (dérive nulle = prudent, seule la volatilité joue).

export interface ConePoint {
  day: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

export interface HorizonStats {
  days: number;
  label: string;
  median: number;
  p5: number;
  p95: number;
  probUp: number; // P(prix final > prix actuel)
  probTP1: number | null; // P(touche TP1 avant l'horizon)
  probObj: number | null; // P(touche l'objectif avant l'horizon)
  probStop: number | null; // P(touche le stop avant l'horizon)
}

export interface McScenario {
  driftAnnual: number;
  cone: ConePoint[];
  horizons: HorizonStats[];
}

export interface McResult {
  ticker: string;
  s0: number;
  muAnnual: number; // dérive historique annualisée (log)
  sigmaAnnual: number; // volatilité historique annualisée
  histDays: number;
  nPaths: number;
  levels: { tp1: number | null; obj: number | null; stop: number | null };
  hist: McScenario; // dérive historique
  neutral: McScenario; // dérive nulle
  computedAt: string;
}

const HORIZONS = [
  { days: 63, label: "3 mois" },
  { days: 126, label: "6 mois" },
  { days: 252, label: "12 mois" },
  { days: 504, label: "24 mois" },
];

const N_PATHS = 4000;
const N_DAYS = 504;
const CONE_STEP = 6;

// RNG déterministe (mulberry32) → résultats reproductibles par ticker/prix.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function percentile(sorted: number[], p: number): number {
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function simulate(
  s0: number,
  muDaily: number,
  sigmaDaily: number,
  levels: { tp1: number | null; obj: number | null; stop: number | null },
  rng: () => number
): McScenario {
  const values = new Float64Array(N_PATHS).fill(s0);
  const hitTP1 = new Int32Array(N_PATHS).fill(-1);
  const hitObj = new Int32Array(N_PATHS).fill(-1);
  const hitStop = new Int32Array(N_PATHS).fill(-1);
  const cone: ConePoint[] = [];
  const atHorizon: Record<number, Float64Array> = {};

  const drift = muDaily - 0.5 * sigmaDaily * sigmaDaily;

  // Box-Muller par paires
  let spare: number | null = null;
  const gauss = () => {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    let u = 0;
    let v = 0;
    while (u === 0) u = rng();
    v = rng();
    const mag = Math.sqrt(-2.0 * Math.log(u));
    spare = mag * Math.sin(2.0 * Math.PI * v);
    return mag * Math.cos(2.0 * Math.PI * v);
  };

  for (let d = 1; d <= N_DAYS; d++) {
    for (let i = 0; i < N_PATHS; i++) {
      const z = gauss();
      values[i] *= Math.exp(drift + sigmaDaily * z);
      const v = values[i];
      if (levels.tp1 !== null && hitTP1[i] < 0 && v >= levels.tp1) hitTP1[i] = d;
      if (levels.obj !== null && hitObj[i] < 0 && v >= levels.obj) hitObj[i] = d;
      if (levels.stop !== null && hitStop[i] < 0 && v <= levels.stop) hitStop[i] = d;
    }
    if (d % CONE_STEP === 0 || d === 1 || d === N_DAYS) {
      const sorted = Array.from(values).sort((a, b) => a - b);
      cone.push({
        day: d,
        p5: percentile(sorted, 0.05),
        p25: percentile(sorted, 0.25),
        p50: percentile(sorted, 0.5),
        p75: percentile(sorted, 0.75),
        p95: percentile(sorted, 0.95),
      });
    }
    if (HORIZONS.some((h) => h.days === d)) {
      atHorizon[d] = Float64Array.from(values);
    }
  }

  const horizons: HorizonStats[] = HORIZONS.map((h) => {
    const vals = Array.from(atHorizon[h.days]).sort((a, b) => a - b);
    let up = 0;
    for (const v of vals) if (v > s0) up++;
    const frac = (arr: Int32Array) => {
      let n = 0;
      for (let i = 0; i < N_PATHS; i++) if (arr[i] >= 0 && arr[i] <= h.days) n++;
      return n / N_PATHS;
    };
    return {
      days: h.days,
      label: h.label,
      median: percentile(vals, 0.5),
      p5: percentile(vals, 0.05),
      p95: percentile(vals, 0.95),
      probUp: up / N_PATHS,
      probTP1: levels.tp1 !== null ? frac(hitTP1) : null,
      probObj: levels.obj !== null ? frac(hitObj) : null,
      probStop: levels.stop !== null ? frac(hitStop) : null,
    };
  });

  return { driftAnnual: muDaily * 252, cone, horizons };
}

export function runMonteCarlo(
  ticker: string,
  closes: number[],
  levels: { tp1: number | null; obj: number | null; stop: number | null }
): McResult | { error: string } {
  if (closes.length < 60) {
    return { error: "Historique insuffisant (minimum 60 séances) — rafraîchissez les cours d'abord." };
  }
  const s0 = closes[closes.length - 1];
  const logReturns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1] > 0 && closes[i] > 0) logReturns.push(Math.log(closes[i] / closes[i - 1]));
  }
  const n = logReturns.length;
  const muDaily = logReturns.reduce((a, b) => a + b, 0) / n;
  const variance = logReturns.reduce((a, b) => a + (b - muDaily) ** 2, 0) / (n - 1);
  const sigmaDaily = Math.sqrt(variance);

  const seed = hashSeed(`${ticker}:${s0.toFixed(2)}:${n}`);
  const hist = simulate(s0, muDaily, sigmaDaily, levels, mulberry32(seed));
  const neutral = simulate(s0, 0, sigmaDaily, levels, mulberry32(seed ^ 0x9e3779b9));

  return {
    ticker,
    s0,
    muAnnual: muDaily * 252,
    sigmaAnnual: sigmaDaily * Math.sqrt(252),
    histDays: closes.length,
    nPaths: N_PATHS,
    levels,
    hist,
    neutral,
    computedAt: new Date().toISOString(),
  };
}
