"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampPan = exports.clampZoom = exports.initialViewport = void 0;
const initialViewport = () => ({
    panSec: 0,
    zoomX: 1,
});
exports.initialViewport = initialViewport;
const clampZoom = (zoom) => Math.min(Math.max(zoom, 0.1), 20);
exports.clampZoom = clampZoom;
const clampPan = (pan) => Math.max(0, pan);
exports.clampPan = clampPan;
