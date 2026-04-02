import { createBlankProject } from "../src/state/appState";
import { createInitialEditorState } from "../src/state/editorState";
import { noSelection } from "../src/state/selection";
import { initialViewport } from "../src/state/viewport";
import { assertDeepEqual, assertEqual, test } from "./testUtils";

test("createBlankProject returns an empty project shell", () => {
  const project = createBlankProject();
  assertEqual(project.title, "");
  assertEqual(project.composerOrArtist, "");
  assertEqual(project.projectNotes, "");
  assertEqual(project.timebaseView, "time");
  assertEqual(project.sections.length, 0);
  assertEqual(project.energyCurve.points.length, 0);
  assertEqual(project.tempoModel.bpm, 120);
  assertEqual(project.tempoModel.timeSig.numerator, 4);
  assertEqual(project.tempoModel.timeSig.denominator, 4);
});

test("createInitialEditorState provides blank startup and reset defaults", () => {
  const initial = createInitialEditorState();
  assertDeepEqual(initial.project, createBlankProject());
  assertDeepEqual(initial.selection, noSelection);
  assertDeepEqual(initial.viewport, initialViewport());
  assertDeepEqual(initial.warnings, []);
});
