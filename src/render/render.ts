import type { Project, Section, CurvePoint } from "../state/types";
import type { ViewportState } from "../state/viewport";
import { secToPx } from "../engine/transforms";
import { formatSecLabel } from "../engine/timebase";
import { gridStepSec } from "../engine/snapping";
import { getPalette } from "../state/appState";
import type { Selection } from "../state/selection";

const background = "#0f1518";
const axisColor = "#cdd5df";
const curveColor = "#f0f4ff";
const textColor = "#e3e7ec";

export const SECTION_BAR_HEIGHT = 28;

const paletteMap = new Map(getPalette().map((p) => [p.id, p.hex]));

const getSectionColor = (section: Section) => paletteMap.get(section.colorId) ?? "#3a4a55";

export interface Layout {
  width: number;
  height: number;
  bottomPadding: number;
  axisY: number;
  curveTop: number;
  curveBottom: number;
  curveHeight: number;
  sectionY: number;
}

export const computeLayout = (width: number, height: number): Layout => {
  const bottomPadding = 40;
  const curveTop = 12;
  const axisY = height - bottomPadding;
  const curveBottom = axisY - 12;
  const curveHeight = curveBottom - curveTop;
  const sectionY = axisY - SECTION_BAR_HEIGHT;
  return { width, height, bottomPadding, axisY, curveTop, curveBottom, curveHeight, sectionY };
};

export function renderScene(
  canvas: HTMLCanvasElement,
  project: Project,
  viewport: ViewportState,
  selection: Selection
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const layout = computeLayout(rect.width, rect.height);

  ctx.save();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, layout.width, layout.height);

  drawSections(ctx, project, viewport, layout, selection);
  drawCurve(ctx, project, viewport, layout, selection);
  drawAxis(ctx, project, viewport, layout);

  ctx.restore();
}

function drawSections(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  layout: Layout,
  selection: Selection
) {
  for (const section of project.sections) {
    const x1 = secToPx(section.startSec, viewport);
    const x2 = secToPx(section.endSec, viewport);
    if (x2 < 0 || x1 > layout.width) continue;
    ctx.fillStyle = getSectionColor(section);
    ctx.fillRect(x1, layout.sectionY, x2 - x1, SECTION_BAR_HEIGHT);
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x1, layout.sectionY, x2 - x1, 4);
    ctx.fillStyle = textColor;
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillText(section.name, x1 + 6, layout.sectionY + SECTION_BAR_HEIGHT / 2 + 4);

    if (selection.type === "section" && selection.id === section.id) {
      ctx.strokeStyle = "#e5ece7";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1 + 1, layout.sectionY + 1, x2 - x1 - 2, SECTION_BAR_HEIGHT - 2);
    }
  }
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  layout: Layout,
  selection: Selection
) {
  const points = project.energyCurve.points;
  if (points.length < 2) return;

  const { yMin, yMax } = project.energyCurve;
  const range = yMax - yMin || 1;
  const yToPx = (yVal: number) => {
    const norm = (yVal - yMin) / range;
    return layout.curveBottom - norm * layout.curveHeight;
  };

  points.forEach((p, idx) => {
    const next = points[idx + 1];
    if (!next) return;
    const x1 = secToPx(p.sec, viewport);
    const x2 = secToPx(next.sec, viewport);
    const y1 = yToPx(p.y);
    const y2 = yToPx(next.y);
    const selected = selection.type === "curveSegment" && selection.index === idx;
    const stroke = selected ? textColor : curveColor;
    const width = selected ? 3 : 2;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.beginPath();

    if (p.rightTransition.type === "step") {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.moveTo(x2, y1);
      ctx.lineTo(x2, y2);
    } else if (p.rightTransition.type === "curve") {
      const bias = p.rightTransition.param;
      const tBias = 0.5 + 0.4 * bias;
      const ctrlX = x1 + (x2 - x1) * tBias;
      const ctrlY = y1 + (y2 - y1) * tBias;
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
    } else {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }

    ctx.stroke();
  });

  ctx.fillStyle = curveColor;
  points.forEach((p) => {
    const x = secToPx(p.sec, viewport);
    const y = yToPx(p.y);
    if (x < -6 || x > layout.width + 6) return;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    if (selection.type === "curvePoint" && selection.id === p.id) {
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function drawAxis(ctx: CanvasRenderingContext2D, project: Project, viewport: ViewportState, layout: Layout) {
  const { axisY, width, height } = layout;
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, axisY);
  ctx.lineTo(width, axisY);
  ctx.stroke();

  const stepSec = gridStepSec(project.timebaseView, project.tempoModel, viewport.zoomX);
  const scale = viewport.zoomX * 80;
  const startSec = Math.max(0, Math.floor(viewport.panSec / stepSec) * stepSec - stepSec);
  const endSec = viewport.panSec + width / scale + stepSec;
  for (let sec = startSec; sec <= endSec; sec += stepSec) {
    const x = secToPx(sec, viewport);
    if (x < -20 || x > width + 20) continue;
    ctx.beginPath();
    ctx.moveTo(x, axisY);
    ctx.lineTo(x, axisY + 6);
    ctx.stroke();
    ctx.fillStyle = axisColor;
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.fillText(formatSecLabel(sec, project.timebaseView, project.tempoModel), x + 4, axisY + 14);
  }

  ctx.fillStyle = textColor;
  ctx.font = "12px Inter, system-ui, sans-serif";
  ctx.fillText(project.title, 12, 18);
}
