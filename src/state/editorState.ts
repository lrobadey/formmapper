import { createBlankProject } from "./appState";
import { noSelection, type Selection } from "./selection";
import type { Project } from "./types";
import { initialViewport, type ViewportState } from "./viewport";

export interface EditorState {
  project: Project;
  selection: Selection;
  viewport: ViewportState;
  warnings: string[];
}

export const createInitialEditorState = (): EditorState => ({
  project: createBlankProject(),
  selection: noSelection,
  viewport: initialViewport(),
  warnings: [],
});
