import type { Project } from "../state/types";

export const projectEndSec = (project: Project): number => {
  const sectionEnd = project.sections.length ? project.sections[project.sections.length - 1].endSec : 0;
  const curveEnd = project.energyCurve.points.length
    ? Math.max(...project.energyCurve.points.map((p) => p.sec))
    : 0;
  return Math.max(sectionEnd, curveEnd);
};
