import type { TempoModel, TimebaseView } from "../state/types";
import { measureDurationSec } from "./timebase";

const timeSteps = [0.1, 0.25, 0.5, 1, 2, 4, 8];

export const snapSec = (
  sec: number,
  view: TimebaseView = "time",
  tempo?: TempoModel,
  zoomX = 1
): number => {
  if (view === "measuresComputed" && tempo?.enabled) {
    const measure = measureDurationSec(tempo);
    return Math.round(sec / measure) * measure;
  }
  if (view === "measuresAbstract") {
    return Math.round(sec);
  }
  const step = pickTimeStep(zoomX);
  return Math.round(sec / step) * step;
};

export const gridStepSec = (view: TimebaseView, tempo: TempoModel, zoomX: number): number => {
  if (view === "measuresComputed" && tempo.enabled) {
    return measureDurationSec(tempo);
  }
  if (view === "measuresAbstract") {
    return 1;
  }
  return pickTimeStep(zoomX);
};

const pickTimeStep = (zoomX: number) => {
  if (zoomX >= 6) return timeSteps[0]; // 0.1s
  if (zoomX >= 3) return timeSteps[1]; // 0.25s
  if (zoomX >= 1.5) return timeSteps[2]; // 0.5s
  if (zoomX >= 0.8) return timeSteps[3]; // 1s
  if (zoomX >= 0.4) return timeSteps[4]; // 2s
  if (zoomX >= 0.2) return timeSteps[5]; // 4s
  return timeSteps[6]; // 8s
};
