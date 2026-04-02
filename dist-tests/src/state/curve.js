"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSegmentTransition = exports.moveCurvePoint = exports.addCurvePoint = void 0;
const TIE_EPS = 1e-4;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const sortAndResolve = (points) => {
    const sorted = [...points].sort((a, b) => a.sec - b.sec || a.id.localeCompare(b.id));
    let lastSec = -Infinity;
    return sorted.map((p) => {
        let sec = p.sec;
        if (sec <= lastSec) {
            sec = lastSec + TIE_EPS;
        }
        lastSec = sec;
        return { ...p, sec };
    });
};
const makeId = () => `pt-${Math.random().toString(36).slice(2, 8)}`;
const addCurvePoint = (points, sec, y, yMin, yMax) => {
    const clampedY = clamp(y, yMin, yMax);
    const id = makeId();
    const rightTransition = { type: "linear", param: 0 };
    const next = [...points, { id, sec, y: clampedY, rightTransition }];
    return { points: sortAndResolve(next), id };
};
exports.addCurvePoint = addCurvePoint;
const moveCurvePoint = (points, id, sec, y, yMin, yMax) => {
    const clampedY = clamp(y, yMin, yMax);
    const next = points.map((p) => (p.id === id ? { ...p, sec, y: clampedY } : p));
    return sortAndResolve(next);
};
exports.moveCurvePoint = moveCurvePoint;
const updateSegmentTransition = (points, segmentIndex, type, param) => {
    if (!points[segmentIndex])
        return points;
    const clampedParam = clamp(param, -1, 1);
    const next = [...points];
    next[segmentIndex] = {
        ...next[segmentIndex],
        rightTransition: { type, param: clampedParam },
    };
    return next;
};
exports.updateSegmentTransition = updateSegmentTransition;
