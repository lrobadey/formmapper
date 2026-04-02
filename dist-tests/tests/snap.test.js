"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snapping_1 = require("../src/engine/snapping");
const timebase_1 = require("../src/engine/timebase");
const testUtils_1 = require("./testUtils");
const tempo = { enabled: true, bpm: 120, timeSig: { numerator: 4, denominator: 4 } };
(0, testUtils_1.test)("time view snapping respects zoom thresholds", () => {
    (0, testUtils_1.assertEqual)((0, snapping_1.snapSec)(1.24, "time", tempo, 3), 1.25);
    (0, testUtils_1.assertEqual)((0, snapping_1.snapSec)(1.24, "time", tempo, 0.5), 1);
});
(0, testUtils_1.test)("measuresComputed snaps to measure duration", () => {
    const measureSec = (0, timebase_1.measureDurationSec)(tempo);
    (0, testUtils_1.assertClose)((0, snapping_1.snapSec)(9.3, "measuresComputed", tempo, 1), Math.round(9.3 / measureSec) * measureSec);
});
(0, testUtils_1.test)("measuresAbstract snaps to whole units", () => {
    (0, testUtils_1.assertEqual)((0, snapping_1.snapSec)(3.6, "measuresAbstract", tempo, 1), 4);
});
(0, testUtils_1.test)("grid step matches view mode", () => {
    (0, testUtils_1.assertEqual)((0, snapping_1.gridStepSec)("measuresAbstract", tempo, 1), 1);
    (0, testUtils_1.assertClose)((0, snapping_1.gridStepSec)("measuresComputed", tempo, 1), (0, timebase_1.measureDurationSec)(tempo));
});
