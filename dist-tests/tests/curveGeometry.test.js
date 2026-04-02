"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const curveGeometry_1 = require("../src/engine/curveGeometry");
const testUtils_1 = require("./testUtils");
(0, testUtils_1.test)("curve control point stays linear at param 0 and bends on opposite sides", () => {
    const start = { x: 0, y: 0 };
    const end = { x: 10, y: 0 };
    const neutral = (0, curveGeometry_1.getCurveControlPoint)(start, end, 0);
    (0, testUtils_1.assertClose)(neutral.x, 5);
    (0, testUtils_1.assertClose)(neutral.y, 0);
    const bentUp = (0, curveGeometry_1.getCurveControlPoint)(start, end, 1);
    const bentDown = (0, curveGeometry_1.getCurveControlPoint)(start, end, -1);
    (0, testUtils_1.assertCondition)(bentUp.y > neutral.y, "Positive params should bend to one side");
    (0, testUtils_1.assertCondition)(bentDown.y < neutral.y, "Negative params should bend to the opposite side");
    (0, testUtils_1.assertClose)(bentUp.x, bentDown.x);
});
(0, testUtils_1.test)("curve hit-testing tracks the visible curve geometry", () => {
    const start = { x: 0, y: 0 };
    const end = { x: 100, y: 0 };
    const param = 1;
    const control = (0, curveGeometry_1.getCurveControlPoint)(start, end, param);
    const midpoint = (0, curveGeometry_1.pointOnQuadratic)(start, control, end, 0.5);
    (0, testUtils_1.assertCondition)((0, curveGeometry_1.isPointNearQuadraticCurve)(midpoint.x, midpoint.y, start, end, param, 1), "Point on the curve should hit");
    (0, testUtils_1.assertCondition)((0, curveGeometry_1.distanceToQuadraticCurve)(midpoint.x, midpoint.y, start, end, param) <= 1, "Distance should be small on the curve");
});
