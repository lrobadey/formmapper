import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type React from "react";
import "./CanvasStage.css";
import type { Project } from "../state/types";
import type { Selection } from "../state/selection";
import { clampPan, clampZoom } from "../state/viewport";
import type { ViewportState } from "../state/viewport";
import { renderScene, SECTION_BAR_HEIGHT, computeLayout } from "../render/render";
import { pxToSec, secToPx } from "../engine/transforms";
import { snapSec } from "../engine/snapping";
import { rippleResizeSections } from "../state/sections";
import type { Section, CurvePoint } from "../state/types";
import { addCurvePoint, moveCurvePoint } from "../state/curve";

interface Props {
  project: Project;
  onProjectChange: Dispatch<SetStateAction<Project>>;
  viewport: ViewportState;
  onViewportChange: (next: ViewportState) => void;
  selection: Selection;
  onSelectionChange: (next: Selection) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

type DragState =
  | null
  | {
      kind: "sectionEdge";
      sectionId: Section["id"];
      initialSections: Section[];
    }
  | {
      kind: "curvePoint";
      pointId: CurvePoint["id"];
    };

export function CanvasStage({
  project,
  onProjectChange,
  viewport,
  onViewportChange,
  selection,
  onSelectionChange,
  canvasRef: canvasRefProp,
}: Props) {
  const fallbackRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = canvasRefProp ?? fallbackRef;
  const dragRef = useRef<DragState>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderScene(canvasRef.current, project, viewport, selection);
  }, [project, viewport, selection]);

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

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!canvasRef.current) return;
    const hit = hitTest(e, project, viewport, canvasRef.current);
    if (!hit) return;

    if (hit.type === "curvePoint") {
      onSelectionChange({ type: "curvePoint", id: hit.id });
      dragRef.current = { kind: "curvePoint", pointId: hit.id };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return;
    }

    if (hit.type === "section") {
      onSelectionChange({ type: "section", id: hit.id });
      if (hit.edge === "right") {
        dragRef.current = {
          kind: "sectionEdge",
          sectionId: hit.id,
          initialSections: project.sections,
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
      return;
    }
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!canvasRef.current) return;
    const hit = hitTest(e, project, viewport, canvasRef.current);
    if (!hit) {
      onSelectionChange({ type: "none" });
      return;
    }
    if (hit.type === "curvePoint") {
      onSelectionChange({ type: "curvePoint", id: hit.id });
      return;
    }
    if (hit.type === "curveSegment") {
      onSelectionChange({ type: "curveSegment", index: hit.index });
      return;
    }
    if (hit.type === "section") {
      onSelectionChange({ type: "section", id: hit.id });
      return;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const layout = computeLayout(rect.width, rect.height);

    if (dragRef.current.kind === "sectionEdge") {
      const x = e.clientX - rect.left;
      const sec = pxToSec(x, viewport);
      const snapped = snapSec(sec, project.timebaseView, project.tempoModel, viewport.zoomX);
      const { sectionId, initialSections } = dragRef.current;
      onProjectChange((prev) => {
        const nextSections = rippleResizeSections(initialSections, sectionId, snapped);
        return { ...prev, sections: nextSections };
      });
      return;
    }

    if (dragRef.current.kind === "curvePoint") {
      const x = e.clientX - rect.left;
      const sec = snapSec(pxToSec(x, viewport), project.timebaseView, project.tempoModel, viewport.zoomX);
      const yVal = eventToCurveValue(e, rect, layout, project);
      const pointId = dragRef.current.pointId;
      onProjectChange((prev) => {
        const points = moveCurvePoint(
          prev.energyCurve.points,
          pointId,
          sec,
          yVal,
          prev.energyCurve.yMin,
          prev.energyCurve.yMax
        );
        return { ...prev, energyCurve: { ...prev.energyCurve, points } };
      });
    }
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const layout = computeLayout(rect.width, rect.height);
    const x = e.clientX - rect.left;
    const sec = snapSec(pxToSec(x, viewport), project.timebaseView, project.tempoModel, viewport.zoomX);
    const yVal = eventToCurveValue(e, rect, layout, project);
    onProjectChange((prev) => {
      const { points, id } = addCurvePoint(prev.energyCurve.points, sec, yVal, prev.energyCurve.yMin, prev.energyCurve.yMax);
      onSelectionChange({ type: "curvePoint", id });
      return { ...prev, energyCurve: { ...prev.energyCurve, points } };
    });
  };

  return (
    <div
      className="canvas-stage"
      onWheel={handleWheel}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => handleDoubleClick(e)}
    >
      <canvas ref={canvasRef} />
      <div className="selection-readout">
        {selection.type === "none" ? "No selection" : `Selection: ${selection.type}`}
      </div>
    </div>
  );
}

const EDGE_HIT_PX = 6;
const POINT_HIT_RADIUS = 8;
const SEGMENT_HIT_PX = 6;

type HitResult =
  | { type: "curvePoint"; id: CurvePoint["id"] }
  | { type: "curveSegment"; index: number }
  | { type: "section"; id: Section["id"]; edge?: "right" }
  | null;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function eventToCurveValue(
  e: MouseEvent | React.MouseEvent<HTMLDivElement>,
  rect: DOMRect,
  layout: ReturnType<typeof computeLayout>,
  project: Project
): number {
  const y = e.clientY - rect.top;
  const ratio = clamp((layout.curveBottom - y) / layout.curveHeight, 0, 1);
  const { yMin, yMax } = project.energyCurve;
  return yMin + ratio * (yMax - yMin);
}

function hitTest(
  e: React.MouseEvent<HTMLDivElement>,
  project: Project,
  viewport: ViewportState,
  canvas: HTMLCanvasElement
): HitResult {
  const rect = canvas.getBoundingClientRect();
  const layout = computeLayout(rect.width, rect.height);
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const pointHit = hitTestCurvePoint(x, y, project, viewport, layout);
  if (pointHit) return pointHit;

  const segmentHit = hitTestCurveSegment(x, y, project, viewport, layout);
  if (segmentHit) return segmentHit;

  const sectionHit = hitTestSection(x, y, project, viewport, layout);
  if (sectionHit) return sectionHit;

  return null;
}

function hitTestCurvePoint(
  px: number,
  py: number,
  project: Project,
  viewport: ViewportState,
  layout: ReturnType<typeof computeLayout>
): HitResult {
  const { yMin, yMax } = project.energyCurve;
  const range = yMax - yMin || 1;
  for (const p of project.energyCurve.points) {
    const x = secToPx(p.sec, viewport);
    const norm = (p.y - yMin) / range;
    const y = layout.curveBottom - norm * layout.curveHeight;
    const dist = Math.hypot(px - x, py - y);
    if (dist <= POINT_HIT_RADIUS) return { type: "curvePoint", id: p.id };
  }
  return null;
}

function hitTestCurveSegment(
  px: number,
  py: number,
  project: Project,
  viewport: ViewportState,
  layout: ReturnType<typeof computeLayout>
): HitResult {
  const pts = project.energyCurve.points;
  if (pts.length < 2) return null;
  const { yMin, yMax } = project.energyCurve;
  const range = yMax - yMin || 1;

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const x1 = secToPx(a.sec, viewport);
    const x2 = secToPx(b.sec, viewport);
    if (px < Math.min(x1, x2) - SEGMENT_HIT_PX || px > Math.max(x1, x2) + SEGMENT_HIT_PX) continue;

    const y1 = layout.curveBottom - ((a.y - yMin) / range) * layout.curveHeight;
    const y2 = layout.curveBottom - ((b.y - yMin) / range) * layout.curveHeight;
    const dist = distanceToSegment(px, py, x1, y1, x2, y2, a.rightTransition.type);
    if (dist <= SEGMENT_HIT_PX) return { type: "curveSegment", index: i };
  }
  return null;
}

function distanceToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: CurvePoint["rightTransition"]["type"]
): number {
  if (type === "step") {
    const horizontal = Math.abs(py - y1);
    const dx = Math.abs(px - x2);
    const withinY = py >= Math.min(y1, y2) && py <= Math.max(y1, y2);
    const vertical = withinY ? dx : Math.hypot(dx, py < Math.min(y1, y2) ? py - Math.min(y1, y2) : py - Math.max(y1, y2));
    return Math.min(horizontal, vertical);
  }
  if (type === "curve") {
    return distanceToLine(px, py, x1, y1, x2, y2);
  }
  return distanceToLine(px, py, x1, y1, x2, y2);
}

function distanceToLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D || 1;
  const param = clamp(dot / lenSq, 0, 1);

  const xx = x1 + param * C;
  const yy = y1 + param * D;
  const dx = px - xx;
  const dy = py - yy;
  return Math.hypot(dx, dy);
}

function hitTestSection(
  px: number,
  py: number,
  project: Project,
  viewport: ViewportState,
  layout: ReturnType<typeof computeLayout>
): HitResult {
  const barTop = layout.sectionY;
  const barBottom = layout.sectionY + SECTION_BAR_HEIGHT;
  if (py < barTop || py > barBottom) return null;

  for (const section of project.sections) {
    const x1 = secToPx(section.startSec, viewport);
    const x2 = secToPx(section.endSec, viewport);
    if (px < x1 || px > x2) continue;
    if (Math.abs(px - x2) <= EDGE_HIT_PX) {
      return { type: "section", id: section.id, edge: "right" };
    }
    return { type: "section", id: section.id };
  }
  return null;
}
