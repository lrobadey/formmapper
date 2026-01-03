import type { CurvePoint, TransitionType } from "./types";

const TIE_EPS = 1e-4;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

const sortAndResolve = (points: CurvePoint[]): CurvePoint[] => {
  const sorted = [...points].sort((a, b) => a.sec - b.sec || a.id.localeCompare(b.id));
  let lastSec = -Infinity;
  return sorted.map((p) => {
    let sec = p.sec;
    if (sec <= lastSec) {
      sec = lastSec + TIE_EPS;
    }
    lastSec = sec;
    return { ...p, sec };
  });
};

const makeId = () => `pt-${Math.random().toString(36).slice(2, 8)}`;

export const addCurvePoint = (
  points: CurvePoint[],
  sec: number,
  y: number,
  yMin: number,
  yMax: number
): { points: CurvePoint[]; id: string } => {
  const clampedY = clamp(y, yMin, yMax);
  const id = makeId();
  const next = [...points, { id, sec, y: clampedY, rightTransition: { type: "linear", param: 0 } }];
  return { points: sortAndResolve(next), id };
};

export const moveCurvePoint = (
  points: CurvePoint[],
  id: CurvePoint["id"],
  sec: number,
  y: number,
  yMin: number,
  yMax: number
): CurvePoint[] => {
  const clampedY = clamp(y, yMin, yMax);
  const next = points.map((p) => (p.id === id ? { ...p, sec, y: clampedY } : p));
  return sortAndResolve(next);
};

export const updateSegmentTransition = (
  points: CurvePoint[],
  segmentIndex: number,
  type: TransitionType,
  param: number
): CurvePoint[] => {
  if (!points[segmentIndex]) return points;
  const clampedParam = clamp(param, -1, 1);
  const next = [...points];
  next[segmentIndex] = {
    ...next[segmentIndex],
    rightTransition: { type, param: clampedParam },
  };
  return next;
};
