import type {
  CurvePoint,
  EnergyCurve,
  Project,
  Section,
  TempoModel,
  TimebaseView,
  TransitionType,
} from "../state/types";

export interface RepairResult {
  project: Project;
  warnings: string[];
}

export const supportedSchemaVersion = 1;

const DEFAULT_TITLE = "Untitled";
const DEFAULT_Y_BANDS = ["Low", "Medium", "High"];
const DEFAULT_TEMPO: TempoModel = { enabled: true, bpm: 120, timeSig: { numerator: 4, denominator: 4 } };
export const MIN_SECTION_SEC = 0.1; // seconds; prevents zero/negative spans on repair
const CURVE_TIE_EPS = 1e-4;

const isTimebaseView = (value: unknown): value is TimebaseView =>
  value === "time" || value === "measuresComputed" || value === "measuresAbstract";

const isTransitionType = (value: unknown): value is TransitionType =>
  value === "linear" || value === "step" || value === "curve";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const repairProject = (incoming: Project): RepairResult => {
  if (incoming.schemaVersion !== supportedSchemaVersion) {
    throw new Error(`Unsupported schemaVersion ${incoming.schemaVersion}`);
  }

  const warnings: string[] = [];
  const timebaseView = isTimebaseView(incoming.timebaseView) ? incoming.timebaseView : "time";
  if (timebaseView !== incoming.timebaseView) {
    warnings.push("timebaseView was invalid and reset to time.");
  }

  const tempoModel = normalizeTempoModel(incoming.tempoModel, warnings);
  const sectionResult = repairSections(incoming.sections || []);
  warnings.push(...sectionResult.warnings);
  const curveResult = repairEnergyCurve(incoming.energyCurve);
  warnings.push(...curveResult.warnings);

  const project: Project = {
    ...incoming,
    schemaVersion: supportedSchemaVersion,
    title: incoming.title || DEFAULT_TITLE,
    composerOrArtist: incoming.composerOrArtist || "",
    projectNotes: incoming.projectNotes || "",
    timebaseView,
    tempoModel,
    sections: sectionResult.sections,
    energyCurve: curveResult.curve,
  };

  return { project, warnings };
};

const normalizeTempoModel = (tempo: TempoModel | undefined, warnings: string[]): TempoModel => {
  if (!tempo) {
    warnings.push("tempoModel missing; defaulting to 120 bpm 4/4.");
    return DEFAULT_TEMPO;
  }
  const enabled = typeof tempo.enabled === "boolean" ? tempo.enabled : true;
  if (enabled !== tempo.enabled) {
    warnings.push("tempoModel.enabled was invalid; defaulting to true.");
  }
  const bpm = Number.isFinite(tempo.bpm) ? tempo.bpm : DEFAULT_TEMPO.bpm;
  if (bpm !== tempo.bpm) {
    warnings.push("tempoModel.bpm was invalid; defaulting to 120.");
  }
  const numerator = Number.isFinite(tempo.timeSig?.numerator) ? tempo.timeSig.numerator : DEFAULT_TEMPO.timeSig.numerator;
  const denominator = Number.isFinite(tempo.timeSig?.denominator) ? tempo.timeSig.denominator : DEFAULT_TEMPO.timeSig.denominator;
  if (numerator !== tempo.timeSig?.numerator || denominator !== tempo.timeSig?.denominator) {
    warnings.push("tempoModel.timeSig was invalid; defaulting to 4/4.");
  }
  return { enabled, bpm, timeSig: { numerator, denominator } };
};

export const repairSections = (input: Section[]): { sections: Section[]; warnings: string[] } => {
  const warnings: string[] = [];

  const sanitized = input
    .filter((section) => section && Number.isFinite(section.startSec) && Number.isFinite(section.endSec))
    .map((section, idx) => ({
      id: section.id || `sec-${idx + 1}`,
      name: section.name || `Section ${idx + 1}`,
      colorId: section.colorId || "slate_01",
      startSec: Number(section.startSec),
      endSec: Number(section.endSec),
      notes: section.notes || "",
      tags: Array.isArray(section.tags) ? section.tags.map(String) : [],
    }));

  if (sanitized.length !== input.length) {
    warnings.push("Dropped sections with missing or invalid time bounds.");
  }

  const sorted = sanitized.sort(
    (a, b) => a.startSec - b.startSec || a.endSec - b.endSec || a.id.localeCompare(b.id)
  );

  const repaired: Section[] = [];
  let cursor = 0;
  sorted.forEach((section, idx) => {
    const rawDuration = section.endSec - section.startSec;
    const duration = rawDuration > MIN_SECTION_SEC ? rawDuration : MIN_SECTION_SEC;
    if (duration !== rawDuration) {
      warnings.push(`Adjusted section "${section.name}" to minimum duration.`);
    }
    const startSec = idx === 0 ? 0 : cursor;
    const endSec = startSec + duration;
    if (section.startSec !== startSec || section.endSec !== endSec || (idx === 0 && section.startSec !== 0)) {
      warnings.push(`Repaired section "${section.name}" to enforce gapless ordering.`);
    }
    cursor = endSec;
    repaired.push({ ...section, startSec, endSec });
  });

  if (repaired.length === 0) {
    warnings.push("No valid sections found; inserted placeholder section.");
    repaired.push({
      id: "sec-1",
      name: "Section 1",
      colorId: "slate_01",
      startSec: 0,
      endSec: 4,
      notes: "",
      tags: [],
    });
  }

  return { sections: repaired, warnings };
};

export const repairEnergyCurve = (curve: EnergyCurve | undefined): { curve: EnergyCurve; warnings: string[] } => {
  const localWarnings: string[] = [];
  const yMin = Number.isFinite(curve?.yMin) ? Number(curve?.yMin) : 0;
  const yMaxRaw = Number.isFinite(curve?.yMax) ? Number(curve?.yMax) : 1;
  const yMax = yMaxRaw > yMin ? yMaxRaw : yMin + 1;
  if (yMaxRaw <= yMin) {
    localWarnings.push("energyCurve yMin/yMax invalid; reset to 0..1.");
  }
  const hasBands = Array.isArray(curve?.yBands) && curve!.yBands.length > 0;
  const yBands = hasBands ? curve!.yBands.map(String) : DEFAULT_Y_BANDS;
  if (!hasBands) {
    localWarnings.push("energyCurve.yBands missing; defaulted to Low/Medium/High.");
  }

  const pointResult = repairCurvePoints(curve?.points || [], yMin, yMax);
  localWarnings.push(...pointResult.warnings);

  const repairedCurve: EnergyCurve = {
    yBands,
    yMin,
    yMax,
    points: pointResult.points,
  };

  return { curve: repairedCurve, warnings: localWarnings };
};

export const repairCurvePoints = (
  input: CurvePoint[],
  yMin: number,
  yMax: number
): { points: CurvePoint[]; warnings: string[] } => {
  const warnings: string[] = [];

  const sanitized = input
    .filter((p) => p && Number.isFinite(p.sec))
    .map((p, idx) => ({
      id: p.id || `pt-${idx + 1}`,
      sec: Number(p.sec),
      y: Number.isFinite(p.y) ? Number(p.y) : 0,
      rightTransition: {
        type: isTransitionType(p.rightTransition?.type) ? p.rightTransition.type : "linear",
        param: Number.isFinite(p.rightTransition?.param) ? p.rightTransition.param : 0,
      },
    }));

  if (sanitized.length !== input.length) {
    warnings.push("Dropped curve points with invalid positions.");
  }

  const sorted = sanitized.sort((a, b) => a.sec - b.sec || a.id.localeCompare(b.id));

  const points: CurvePoint[] = [];
  let lastSec = -Infinity;
  sorted.forEach((p) => {
    let sec = p.sec;
    if (sec < 0) {
      sec = 0;
      warnings.push(`Curve point "${p.id}" clamped to sec >= 0.`);
    }
    if (sec <= lastSec) {
      sec = lastSec + CURVE_TIE_EPS;
      warnings.push(`Curve point "${p.id}" shifted to resolve time tie/overlap.`);
    }
    lastSec = sec;

    const param = clamp(p.rightTransition.param, -1, 1);
    if (param !== p.rightTransition.param) {
      warnings.push(`Curve point "${p.id}" transition param clamped to [-1,1].`);
    }

    const y = clamp(p.y, yMin, yMax);
    if (y !== p.y) {
      warnings.push(`Curve point "${p.id}" y clamped to within yMin/yMax.`);
    }

    points.push({
      ...p,
      sec,
      y,
      rightTransition: { type: p.rightTransition.type, param },
    });
  });

  return { points, warnings };
};
