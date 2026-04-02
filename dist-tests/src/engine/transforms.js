"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pxToSec = exports.secToPx = exports.basePixelsPerSecond = void 0;
exports.basePixelsPerSecond = 64; // visual density; adjusted by zoom
const secToPx = (sec, viewport) => {
    const scale = viewport.zoomX * exports.basePixelsPerSecond;
    return (sec - viewport.panSec) * scale;
};
exports.secToPx = secToPx;
const pxToSec = (px, viewport) => {
    const scale = viewport.zoomX * exports.basePixelsPerSecond;
    return px / scale + viewport.panSec;
};
exports.pxToSec = pxToSec;
