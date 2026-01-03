import type { TimebaseView, TempoModel } from "../state/types";

export const measureDurationSec = (tempo: TempoModel): number => {
  const beatSec = 60 / tempo.bpm;
  return tempo.timeSig.numerator * beatSec;
};

export const formatSecLabel = (sec: number, view: TimebaseView, tempo: TempoModel) => {
  if (view === "measuresComputed" && tempo.enabled) {
    const measure = Math.floor(sec / measureDurationSec(tempo)) + 1;
    return `M${measure}`;
  }
  if (view === "measuresAbstract") {
    return `m${Math.floor(sec) + 1}`;
  }
  // default: time mm:ss
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};
