import { useEffect, useRef } from "react";
import "./CanvasStage.css";
import type { Project } from "../state/types";
import type { Selection } from "../state/selection";
import { clampPan, clampZoom } from "../state/viewport";
import type { ViewportState } from "../state/viewport";
import { renderScene } from "../render/render";

interface Props {
  project: Project;
  viewport: ViewportState;
  onViewportChange: (next: ViewportState) => void;
  selection: Selection;
  onSelectionChange: (next: Selection) => void;
}

export function CanvasStage({ project, viewport, onViewportChange, selection, onSelectionChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderScene(canvasRef.current, project, viewport);
  }, [project, viewport]);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      // Foundation: clear selection on empty canvas click
      onSelectionChange({ type: "none" });
    }
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const isZoomGesture = e.ctrlKey || e.metaKey;
    e.preventDefault();
    if (isZoomGesture) {
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      onViewportChange({ ...viewport, zoomX: clampZoom(viewport.zoomX * factor) });
      return;
    }
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    const deltaSec = delta * 0.01 * (1 / viewport.zoomX);
    onViewportChange({
      ...viewport,
      panSec: clampPan(viewport.panSec + deltaSec),
    });
  };

  return (
    <div className="canvas-stage" onWheel={handleWheel} onClick={handleClick}>
      <canvas ref={canvasRef} />
      <div className="selection-readout">
        {selection.type === "none" ? "No selection" : `Selection: ${selection.type}`}
      </div>
    </div>
  );
}
