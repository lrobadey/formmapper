"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridStepSec = exports.snapSec = void 0;
const timebase_1 = require("./timebase");
const timeSteps = [0.1, 0.25, 0.5, 1, 2, 4, 8];
const snapSec = (sec, view = "time", tempo, zoomX = 1) => {
    if (view === "measuresComputed" && tempo?.enabled) {
        const measure = (0, timebase_1.measureDurationSec)(tempo);
        return Math.round(sec / measure) * measure;
    }
    if (view === "measuresAbstract") {
        return Math.round(sec);
    }
    const step = pickTimeStep(zoomX);
    return Math.round(sec / step) * step;
};
exports.snapSec = snapSec;
const gridStepSec = (view, tempo, zoomX) => {
    if (view === "measuresComputed" && tempo.enabled) {
        return (0, timebase_1.measureDurationSec)(tempo);
    }
    if (view === "measuresAbstract") {
        return 1;
    }
    return pickTimeStep(zoomX);
};
exports.gridStepSec = gridStepSec;
const pickTimeStep = (zoomX) => {
    if (zoomX >= 6)
        return timeSteps[0]; // 0.1s
    if (zoomX >= 3)
        return timeSteps[1]; // 0.25s
    if (zoomX >= 1.5)
        return timeSteps[2]; // 0.5s
    if (zoomX >= 0.5)
        return timeSteps[3]; // 1s
    if (zoomX >= 0.25)
        return timeSteps[4]; // 2s
    if (zoomX >= 0.2)
        return timeSteps[5]; // 4s
    return timeSteps[6]; // 8s
};
