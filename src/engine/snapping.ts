import type { TimebaseView } from "../state/types";

const timeSteps = [0.25, 0.5, 1, 2, 4];

export const snapSec = (sec: number, view: TimebaseView = "time"): number => {
  if (view !== "time") {
    return sec; // placeholder; other modes handled later
  }
  const step = pickStep();
  return Math.round(sec / step) * step;
};

const pickStep = () => timeSteps[1]; // foundation default = 0.5s

