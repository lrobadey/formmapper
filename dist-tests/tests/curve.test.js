"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const curve_1 = require("../src/state/curve");
const testUtils_1 = require("./testUtils");
const basePoints = [
    { id: "p1", sec: 0, y: 0.2, rightTransition: { type: "linear", param: 0 } },
    { id: "p2", sec: 4, y: 0.6, rightTransition: { type: "linear", param: 0 } },
];
(0, testUtils_1.test)("addCurvePoint inserts in time order and resolves ties", () => {
    const { points, id } = (0, curve_1.addCurvePoint)(basePoints, 2, 0.4, 0, 1);
    const ids = points.map((p) => p.id);
    (0, testUtils_1.assertCondition)(ids.indexOf(id) === 1, "New point should be inserted between p1 and p2");
    const { points: tieResolved } = (0, curve_1.addCurvePoint)(points, 2, 0.5, 0, 1);
    (0, testUtils_1.assertCondition)(tieResolved[2].sec > tieResolved[1].sec, "Tied sec should be nudged forward");
});
(0, testUtils_1.test)("moveCurvePoint clamps y and keeps ordering", () => {
    const moved = (0, curve_1.moveCurvePoint)(basePoints, "p2", 3.5, 2, 0, 1);
    const target = moved.find((p) => p.id === "p2");
    (0, testUtils_1.assertEqual)(target?.y, 1);
    (0, testUtils_1.assertCondition)(moved[1].sec > moved[0].sec, "Ordering should be preserved after move");
});
