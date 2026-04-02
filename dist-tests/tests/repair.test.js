"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repair_1 = require("../src/model/repair");
const testUtils_1 = require("./testUtils");
const minimalProject = {
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
(0, testUtils_1.test)("repairProject enforces gapless sections and clamps curve values with warnings", () => {
    const { project, warnings } = (0, repair_1.repairProject)(minimalProject);
    (0, testUtils_1.assertCondition)(project.sections[1].startSec === project.sections[0].endSec, "Sections should be gapless");
    (0, testUtils_1.assertCondition)(project.energyCurve.points[0].y >= project.energyCurve.yMin, "Curve y should be clamped");
    (0, testUtils_1.assertCondition)(project.energyCurve.points[1].sec > project.energyCurve.points[0].sec, "Ties resolved");
    (0, testUtils_1.assertCondition)(warnings.length > 0, "Warnings should be emitted for repairs");
    (0, testUtils_1.assertEqual)(project.title, "Untitled");
});
(0, testUtils_1.test)("repairProject preserves an empty diagram without placeholder content", () => {
    const blankProject = {
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
    const { project, warnings } = (0, repair_1.repairProject)(blankProject);
    (0, testUtils_1.assertEqual)(project.sections.length, 0, "Blank project should remain sectionless");
    (0, testUtils_1.assertEqual)(project.energyCurve.points.length, 0, "Blank project should remain point-free");
    (0, testUtils_1.assertCondition)(!warnings.some((warning) => warning.includes("placeholder section")), "Placeholder repair should not run");
});
