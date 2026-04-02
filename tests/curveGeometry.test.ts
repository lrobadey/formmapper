import {
  distanceToQuadraticCurve,
  getCurveControlPoint,
  isPointNearQuadraticCurve,
  pointOnQuadratic,
} from "../src/engine/curveGeometry";
import { assertClose, assertCondition, test } from "./testUtils";

test("curve control point stays linear at param 0 and bends on opposite sides", () => {
  const start = { x: 0, y: 0 };
  const end = { x: 10, y: 0 };

  const neutral = getCurveControlPoint(start, end, 0);
  assertClose(neutral.x, 5);
  assertClose(neutral.y, 0);

  const bentUp = getCurveControlPoint(start, end, 1);
  const bentDown = getCurveControlPoint(start, end, -1);
  assertCondition(bentUp.y > neutral.y, "Positive params should bend to one side");
  assertCondition(bentDown.y < neutral.y, "Negative params should bend to the opposite side");
  assertClose(bentUp.x, bentDown.x);
});

test("curve hit-testing tracks the visible curve geometry", () => {
  const start = { x: 0, y: 0 };
  const end = { x: 100, y: 0 };
  const param = 1;
  const control = getCurveControlPoint(start, end, param);
  const midpoint = pointOnQuadratic(start, control, end, 0.5);

  assertCondition(isPointNearQuadraticCurve(midpoint.x, midpoint.y, start, end, param, 1), "Point on the curve should hit");
  assertCondition(distanceToQuadraticCurve(midpoint.x, midpoint.y, start, end, param) <= 1, "Distance should be small on the curve");
});
