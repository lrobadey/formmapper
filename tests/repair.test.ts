import { repairProject } from "../src/model/repair";
import type { Project } from "../src/state/types";
import { assertCondition, assertEqual, test } from "./testUtils";

const minimalProject: Project = {
  schemaVersion: 1,
  title: "",
  composerOrArtist: "",
  projectNotes: "",
  timebaseView: "time",
  tempoModel: { enabled: true, bpm: 120, timeSig: { numerator: 4, denominator: 4 } },
  sections: [
    { id: "s1", name: "A", colorId: "slate_01", startSec: 0, endSec: 4, notes: "", tags: [] },
    { id: "s2", name: "B", colorId: "navy_01", startSec: 5, endSec: 8, notes: "", tags: [] }, // gap to repair
  ],
  energyCurve: {
    yBands: ["Low", "High"],
    yMin: 0,
    yMax: 1,
    points: [
      { id: "p1", sec: 0, y: -1, rightTransition: { type: "curve", param: 2 } }, // y and param out of range
      { id: "p2", sec: 0, y: 0.5, rightTransition: { type: "linear", param: 0 } }, // tie
    ],
  },
};

test("repairProject enforces gapless sections and clamps curve values with warnings", () => {
  const { project, warnings } = repairProject(minimalProject);
  assertCondition(project.sections[1].startSec === project.sections[0].endSec, "Sections should be gapless");
  assertCondition(project.energyCurve.points[0].y >= project.energyCurve.yMin, "Curve y should be clamped");
  assertCondition(project.energyCurve.points[1].sec > project.energyCurve.points[0].sec, "Ties resolved");
  assertCondition(warnings.length > 0, "Warnings should be emitted for repairs");
  assertEqual(project.title, "Untitled");
});

test("repairProject preserves an empty diagram without placeholder content", () => {
  const blankProject: Project = {
    schemaVersion: 1,
    title: "",
    composerOrArtist: "",
    projectNotes: "",
    timebaseView: "time",
    tempoModel: { enabled: true, bpm: 120, timeSig: { numerator: 4, denominator: 4 } },
    sections: [],
    energyCurve: {
      yBands: ["Low", "Medium", "High"],
      yMin: 0,
      yMax: 1,
      points: [],
    },
  };

  const { project, warnings } = repairProject(blankProject);
  assertEqual(project.sections.length, 0, "Blank project should remain sectionless");
  assertEqual(project.energyCurve.points.length, 0, "Blank project should remain point-free");
  assertCondition(!warnings.some((warning) => warning.includes("placeholder section")), "Placeholder repair should not run");
});
