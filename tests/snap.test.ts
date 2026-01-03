import { snapSec, gridStepSec } from "../src/engine/snapping";
import { measureDurationSec } from "../src/engine/timebase";
import type { TempoModel } from "../src/state/types";
import { assertEqual, assertClose, test } from "./testUtils";

const tempo: TempoModel = { enabled: true, bpm: 120, timeSig: { numerator: 4, denominator: 4 } };

test("time view snapping respects zoom thresholds", () => {
  assertEqual(snapSec(1.24, "time", tempo, 3), 1.25);
  assertEqual(snapSec(1.24, "time", tempo, 0.5), 1);
});

test("measuresComputed snaps to measure duration", () => {
  const measureSec = measureDurationSec(tempo);
  assertClose(snapSec(9.3, "measuresComputed", tempo, 1), Math.round(9.3 / measureSec) * measureSec);
});

test("measuresAbstract snaps to whole units", () => {
  assertEqual(snapSec(3.6, "measuresAbstract", tempo, 1), 4);
});

test("grid step matches view mode", () => {
  assertEqual(gridStepSec("measuresAbstract", tempo, 1), 1);
  assertClose(gridStepSec("measuresComputed", tempo, 1), measureDurationSec(tempo));
});
