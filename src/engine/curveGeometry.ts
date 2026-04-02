export interface Point2D {
  x: number;
  y: number;
}

const CURVE_OFFSET_RATIO = 0.25;
const DEFAULT_SAMPLE_COUNT = 24;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export const getCurveControlPoint = (start: Point2D, end: Point2D, param: number): Point2D => {
  const clampedParam = clamp(param, -1, 1);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return { x: midX, y: midY };
  }

  const normalX = -dy / length;
  const normalY = dx / length;
  const offset = length * CURVE_OFFSET_RATIO * clampedParam;

  return {
    x: midX + normalX * offset,
    y: midY + normalY * offset,
  };
};

export const pointOnQuadratic = (start: Point2D, control: Point2D, end: Point2D, t: number): Point2D => {
  const clampedT = clamp(t, 0, 1);
  const oneMinusT = 1 - clampedT;
  const a = oneMinusT * oneMinusT;
  const b = 2 * oneMinusT * clampedT;
  const c = clampedT * clampedT;

  return {
    x: a * start.x + b * control.x + c * end.x,
    y: a * start.y + b * control.y + c * end.y,
  };
};

const distanceToLineSegment = (px: number, py: number, start: Point2D, end: Point2D): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return Math.hypot(px - start.x, py - start.y);
  }

  const t = clamp(((px - start.x) * dx + (py - start.y) * dy) / lengthSq, 0, 1);
  const nearestX = start.x + t * dx;
  const nearestY = start.y + t * dy;
  return Math.hypot(px - nearestX, py - nearestY);
};

export const distanceToQuadraticCurve = (
  px: number,
  py: number,
  start: Point2D,
  end: Point2D,
  param: number,
  sampleCount = DEFAULT_SAMPLE_COUNT
): number => {
  const control = getCurveControlPoint(start, end, param);
  const chordLength = Math.hypot(end.x - start.x, end.y - start.y);
  const count = Math.max(sampleCount, Math.ceil(chordLength / 12));

  let minDistance = Number.POSITIVE_INFINITY;
  let previous = start;

  for (let i = 1; i <= count; i += 1) {
    const current = pointOnQuadratic(start, control, end, i / count);
    minDistance = Math.min(minDistance, distanceToLineSegment(px, py, previous, current));
    previous = current;
  }

  return minDistance;
};

export const isPointNearQuadraticCurve = (
  px: number,
  py: number,
  start: Point2D,
  end: Point2D,
  param: number,
  thresholdPx: number
): boolean => distanceToQuadraticCurve(px, py, start, end, param) <= thresholdPx;
