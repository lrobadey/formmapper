import { addCurvePoint, moveCurvePoint } from "../src/state/curve";
import type { CurvePoint } from "../src/state/types";
import { assertCondition, assertEqual, test } from "./testUtils";

const basePoints: CurvePoint[] = [
  { id: "p1", sec: 0, y: 0.2, rightTransition: { type: "linear", param: 0 } },
  { id: "p2", sec: 4, y: 0.6, rightTransition: { type: "linear", param: 0 } },
];

test("addCurvePoint inserts in time order and resolves ties", () => {
  const { points, id } = addCurvePoint(basePoints, 2, 0.4, 0, 1);
  const ids = points.map((p) => p.id);
  assertCondition(ids.indexOf(id) === 1, "New point should be inserted between p1 and p2");
  const { points: tieResolved } = addCurvePoint(points, 2, 0.5, 0, 1);
  assertCondition(tieResolved[2].sec > tieResolved[1].sec, "Tied sec should be nudged forward");
});

test("moveCurvePoint clamps y and keeps ordering", () => {
  const moved = moveCurvePoint(basePoints, "p2", 3.5, 2, 0, 1);
  const target = moved.find((p) => p.id === "p2");
  assertEqual(target?.y, 1);
  assertCondition(moved[1].sec > moved[0].sec, "Ordering should be preserved after move");
});
