import type { Project, Section } from "../state/types";
import type { ViewportState } from "../state/viewport";
import { secToPx } from "../engine/transforms";
import { formatSecLabel } from "../engine/timebase";
import { gridStepSec } from "../engine/snapping";
import { getPalette } from "../state/appState";
import type { Selection } from "../state/selection";

/* ═══════════════════════════════════════════════════════════════
   NORDIC ICE COLOR SYSTEM
   ═══════════════════════════════════════════════════════════════ */

const COLORS = {
  bg: {
    top: "#0c1210",
    mid: "#080c0a",
    bottom: "#050808",
  },
  grid: "rgba(122, 184, 206, 0.04)",
  axis: "#5a6662",
  axisLabel: "#8a9692",
  curve: "#7ab8ce",
  curveGlow: "rgba(122, 184, 206, 0.5)",
  curvePoint: "#a8d0e0",
  curvePointGlow: "rgba(122, 184, 206, 0.25)",
  text: "#e8edeb",
  textMuted: "#8a9692",
  selection: "#7ab8ce",
  selectionGlow: "rgba(122, 184, 206, 0.3)",
};

/* Codex: Responsive section bar height */
export const SECTION_BAR_HEIGHT = 24;

const paletteMap = new Map(getPalette().map((p) => [p.id, p.hex]));

const getSectionColor = (section: Section) =>
  paletteMap.get(section.colorId) ?? "#3a4a55";

/* Lighten a hex color */
function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));
  return `rgb(${r}, ${g}, ${b})`;
}

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

/* Codex: Dynamic layout calculations based on canvas size */
export const computeLayout = (width: number, height: number): Layout => {
  const bottomPadding = Math.max(32, Math.min(40, height * 0.08));
  const curveTop = Math.max(8, Math.min(12, height * 0.03));
  const axisY = height - bottomPadding;
  const curveBottom = axisY - Math.max(8, Math.min(12, height * 0.03));
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

  drawBackground(ctx, layout);
  drawGrid(ctx, project, viewport, layout);
  drawSections(ctx, project, viewport, layout, selection);
  drawCurve(ctx, project, viewport, layout, selection);
  drawAxis(ctx, project, viewport, layout);
  drawTitle(ctx, project, layout);

  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND — Gradient with subtle radial glow
   ═══════════════════════════════════════════════════════════════ */

function drawBackground(ctx: CanvasRenderingContext2D, layout: Layout) {
  const gradient = ctx.createLinearGradient(0, 0, 0, layout.height);
  gradient.addColorStop(0, COLORS.bg.top);
  gradient.addColorStop(0.5, COLORS.bg.mid);
  gradient.addColorStop(1, COLORS.bg.bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, layout.width, layout.height);

  // Subtle radial glow at top center
  const radial = ctx.createRadialGradient(
    layout.width / 2, 0, 0,
    layout.width / 2, 0, layout.width * 0.6
  );
  radial.addColorStop(0, "rgba(122, 184, 206, 0.025)");
  radial.addColorStop(1, "transparent");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, layout.width, layout.height);
}

/* ═══════════════════════════════════════════════════════════════
   GRID — Faint vertical lines
   ═══════════════════════════════════════════════════════════════ */

function drawGrid(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  layout: Layout
) {
  const stepSec = gridStepSec(project.timebaseView, project.tempoModel, viewport.zoomX);
  const scale = viewport.zoomX * 80;
  const startSec = Math.max(0, Math.floor(viewport.panSec / stepSec) * stepSec - stepSec);
  const endSec = viewport.panSec + layout.width / scale + stepSec;

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;

  for (let sec = startSec; sec <= endSec; sec += stepSec) {
    const x = secToPx(sec, viewport);
    if (x < -1 || x > layout.width + 1) continue;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, layout.axisY);
    ctx.stroke();
  }
}

/* ═══════════════════════════════════════════════════════════════
   SECTIONS — Gradient fills with rounded corners
   ═══════════════════════════════════════════════════════════════ */

function drawSections(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  layout: Layout,
  selection: Selection
) {
  const radius = 3;

  for (const section of project.sections) {
    const x1 = secToPx(section.startSec, viewport);
    const x2 = secToPx(section.endSec, viewport);
    const width = x2 - x1;

    if (x2 < 0 || x1 > layout.width) continue;

    const baseColor = getSectionColor(section);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, layout.sectionY, 0, layout.sectionY + SECTION_BAR_HEIGHT);
    grad.addColorStop(0, lightenColor(baseColor, 0.1));
    grad.addColorStop(1, baseColor);

    // Rounded rectangle
    ctx.beginPath();
    roundRect(ctx, x1 + 1, layout.sectionY, width - 2, SECTION_BAR_HEIGHT, radius);
    ctx.fillStyle = grad;
    ctx.fill();

    // Top highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1 + radius + 2, layout.sectionY + 1);
    ctx.lineTo(x2 - radius - 2, layout.sectionY + 1);
    ctx.stroke();

    // Label
    ctx.fillStyle = COLORS.text;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(section.name, x1 + 6, layout.sectionY + SECTION_BAR_HEIGHT / 2 + 4);

    // Selection
    if (selection.type === "section" && selection.id === section.id) {
      ctx.strokeStyle = COLORS.selection;
      ctx.lineWidth = 2;
      ctx.beginPath();
      roundRect(ctx, x1 + 2, layout.sectionY + 1, width - 4, SECTION_BAR_HEIGHT - 2, radius - 1);
      ctx.stroke();
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   CURVE — With glow effect
   ═══════════════════════════════════════════════════════════════ */

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

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  points.forEach((p, idx) => {
    const next = points[idx + 1];
    if (!next) return;

    const x1 = secToPx(p.sec, viewport);
    const x2 = secToPx(next.sec, viewport);
    const y1 = yToPx(p.y);
    const y2 = yToPx(next.y);
    const selected = selection.type === "curveSegment" && selection.index === idx;

    const buildPath = () => {
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
    };

    // Glow layer
    ctx.save();
    ctx.shadowColor = selected ? COLORS.selectionGlow : COLORS.curveGlow;
    ctx.shadowBlur = selected ? 14 : 10;
    ctx.strokeStyle = selected ? COLORS.selection : COLORS.curve;
    ctx.lineWidth = selected ? 3 : 2;
    buildPath();
    ctx.stroke();
    ctx.restore();

    // Crisp line
    ctx.strokeStyle = selected ? COLORS.selection : COLORS.curve;
    ctx.lineWidth = selected ? 3 : 2;
    buildPath();
    ctx.stroke();
  });

  // Points
  points.forEach((p) => {
    const x = secToPx(p.sec, viewport);
    const y = yToPx(p.y);
    if (x < -8 || x > layout.width + 8) return;

    const isSelected = selection.type === "curvePoint" && selection.id === p.id;

    // Glow ring
    ctx.beginPath();
    ctx.arc(x, y, isSelected ? 8 : 6, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? COLORS.selectionGlow : COLORS.curvePointGlow;
    ctx.fill();

    // Core point
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? COLORS.selection : COLORS.curvePoint;
    ctx.fill();

    if (isSelected) {
      ctx.strokeStyle = COLORS.selection;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   AXIS
   ═══════════════════════════════════════════════════════════════ */

function drawAxis(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  layout: Layout
) {
  const { axisY, width } = layout;

  ctx.strokeStyle = COLORS.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, axisY + 0.5);
  ctx.lineTo(width, axisY + 0.5);
  ctx.stroke();

  const stepSec = gridStepSec(project.timebaseView, project.tempoModel, viewport.zoomX);
  const scale = viewport.zoomX * 80;
  const startSec = Math.max(0, Math.floor(viewport.panSec / stepSec) * stepSec - stepSec);
  const endSec = viewport.panSec + width / scale + stepSec;

  ctx.font = '10px "JetBrains Mono", monospace';

  for (let sec = startSec; sec <= endSec; sec += stepSec) {
    const x = secToPx(sec, viewport);
    if (x < -20 || x > width + 20) continue;

    ctx.strokeStyle = COLORS.axis;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, axisY);
    ctx.lineTo(Math.round(x) + 0.5, axisY + 5);
    ctx.stroke();

    ctx.fillStyle = COLORS.axisLabel;
    ctx.fillText(formatSecLabel(sec, project.timebaseView, project.tempoModel), x + 3, axisY + 13);
  }
}

/* ═══════════════════════════════════════════════════════════════
   TITLE
   ═══════════════════════════════════════════════════════════════ */

function drawTitle(ctx: CanvasRenderingContext2D, project: Project, layout: Layout) {
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '12px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(project.title, 12, 18);
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
