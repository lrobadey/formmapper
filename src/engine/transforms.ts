import type { ViewportState } from "../state/viewport";

export const basePixelsPerSecond = 64; // visual density; adjusted by zoom

export const secToPx = (sec: number, viewport: ViewportState): number => {
  const scale = viewport.zoomX * basePixelsPerSecond;
  return (sec - viewport.panSec) * scale;
};

export const pxToSec = (px: number, viewport: ViewportState): number => {
  const scale = viewport.zoomX * basePixelsPerSecond;
  return px / scale + viewport.panSec;
};
