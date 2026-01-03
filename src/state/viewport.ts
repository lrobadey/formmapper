export interface ViewportState {
  panSec: number;
  zoomX: number; // 1 = base scale
}

export const initialViewport = (): ViewportState => ({
  panSec: 0,
  zoomX: 1,
});

export const clampZoom = (zoom: number): number => Math.min(Math.max(zoom, 0.1), 20);

export const clampPan = (pan: number): number => Math.max(0, pan);

