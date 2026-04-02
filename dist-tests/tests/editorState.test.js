"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appState_1 = require("../src/state/appState");
const editorState_1 = require("../src/state/editorState");
const selection_1 = require("../src/state/selection");
const viewport_1 = require("../src/state/viewport");
const testUtils_1 = require("./testUtils");
(0, testUtils_1.test)("createBlankProject returns an empty project shell", () => {
    const project = (0, appState_1.createBlankProject)();
    (0, testUtils_1.assertEqual)(project.title, "");
    (0, testUtils_1.assertEqual)(project.composerOrArtist, "");
    (0, testUtils_1.assertEqual)(project.projectNotes, "");
    (0, testUtils_1.assertEqual)(project.timebaseView, "time");
    (0, testUtils_1.assertEqual)(project.sections.length, 0);
    (0, testUtils_1.assertEqual)(project.energyCurve.points.length, 0);
    (0, testUtils_1.assertEqual)(project.tempoModel.bpm, 120);
    (0, testUtils_1.assertEqual)(project.tempoModel.timeSig.numerator, 4);
    (0, testUtils_1.assertEqual)(project.tempoModel.timeSig.denominator, 4);
});
(0, testUtils_1.test)("createInitialEditorState provides blank startup and reset defaults", () => {
    const initial = (0, editorState_1.createInitialEditorState)();
    (0, testUtils_1.assertDeepEqual)(initial.project, (0, appState_1.createBlankProject)());
    (0, testUtils_1.assertDeepEqual)(initial.selection, selection_1.noSelection);
    (0, testUtils_1.assertDeepEqual)(initial.viewport, (0, viewport_1.initialViewport)());
    (0, testUtils_1.assertDeepEqual)(initial.warnings, []);
});
