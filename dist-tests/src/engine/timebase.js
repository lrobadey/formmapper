"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSecLabel = exports.measureDurationSec = void 0;
const measureDurationSec = (tempo) => {
    const beatSec = 60 / tempo.bpm;
    return tempo.timeSig.numerator * beatSec;
};
exports.measureDurationSec = measureDurationSec;
const formatSecLabel = (sec, view, tempo) => {
    if (view === "measuresComputed" && tempo.enabled) {
        const measure = Math.floor(sec / (0, exports.measureDurationSec)(tempo)) + 1;
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
exports.formatSecLabel = formatSecLabel;
