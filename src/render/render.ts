import type { Project, Section } from "../state/types";
import type { ViewportState } from "../state/viewport";
import { secToPx } from "../engine/transforms";
import { getPalette } from "../state/appState";

const background = "#0f1518";
const axisColor = "#cdd5df";
const curveColor = "#f0f4ff";
const textColor = "#e3e7ec";

const paletteMap = new Map(getPalette().map((p) => [p.id, p.hex]));

const getSectionColor = (section: Section) =>
  paletteMap.get(section.colorId) ?? "#3a4a55";

export function renderScene(
  canvas: HTMLCanvasElement,
  project: Project,
  viewport: ViewportState
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const bottomPadding = 40;
  const curveHeight = height - bottomPadding - 20;

  ctx.save();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  drawSections(ctx, project, viewport, width, curveHeight);
  drawCurve(ctx, project, viewport, width, curveHeight);
  drawAxis(ctx, project, viewport, width, height, bottomPadding);

  ctx.restore();
}

function drawSections(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  width: number,
  height: number
) {
  const barHeight = 28;
  const y = height - barHeight;
  for (const section of project.sections) {
    const x1 = secToPx(section.startSec, viewport);
    const x2 = secToPx(section.endSec, viewport);
    if (x2 < 0 || x1 > width) continue;
    ctx.fillStyle = getSectionColor(section);
    ctx.fillRect(x1, y, x2 - x1, barHeight);
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x1, y, x2 - x1, 4);
    ctx.fillStyle = textColor;
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillText(section.name, x1 + 6, y + barHeight / 2 + 4);
  }
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  width: number,
  height: number
) {
  const points = project.energyCurve.points;
  if (points.length < 2) return;
  ctx.strokeStyle = curveColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, idx) => {
    const x = secToPx(p.sec, viewport);
    const y = height - p.y * (height - 20);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = curveColor;
  points.forEach((p) => {
    const x = secToPx(p.sec, viewport);
    const y = height - p.y * (height - 20);
    if (x < -6 || x > width + 6) return;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  project: Project,
  viewport: ViewportState,
  width: number,
  height: number,
  bottomPadding: number
) {
  const axisY = height - bottomPadding;
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, axisY);
  ctx.lineTo(width, axisY);
  ctx.stroke();

  const approxStepPx = 80;
  const scale = viewport.zoomX * 80;
  const stepSec = approxStepPx / scale;
  const startSec = Math.max(0, viewport.panSec - 1);
  const endSec = viewport.panSec + width / scale + 1;
  for (let sec = startSec; sec <= endSec; sec += stepSec) {
    const x = secToPx(sec, viewport);
    ctx.beginPath();
    ctx.moveTo(x, axisY);
    ctx.lineTo(x, axisY + 6);
    ctx.stroke();
    ctx.fillStyle = axisColor;
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.fillText(sec.toFixed(1) + "s", x + 4, axisY + 14);
  }

  ctx.fillStyle = textColor;
  ctx.font = "12px Inter, system-ui, sans-serif";
  ctx.fillText(project.title, 12, 18);
}

