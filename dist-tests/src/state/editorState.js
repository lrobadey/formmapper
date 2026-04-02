"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialEditorState = void 0;
const appState_1 = require("./appState");
const selection_1 = require("./selection");
const viewport_1 = require("./viewport");
const createInitialEditorState = () => ({
    project: (0, appState_1.createBlankProject)(),
    selection: selection_1.noSelection,
    viewport: (0, viewport_1.initialViewport)(),
    warnings: [],
});
exports.createInitialEditorState = createInitialEditorState;
