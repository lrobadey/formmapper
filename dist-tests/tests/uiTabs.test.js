"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const server_1 = require("react-dom/server");
const appState_1 = require("../src/state/appState");
const selection_1 = require("../src/state/selection");
const CurveTab_1 = require("../src/ui/tabs/CurveTab");
const SectionTab_1 = require("../src/ui/tabs/SectionTab");
const testUtils_1 = require("./testUtils");
const noopProjectChange = () => { };
const noopSelectionChange = () => { };
(0, testUtils_1.test)("SectionTab renders a stable empty state for blank projects", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, react_1.createElement)(SectionTab_1.SectionTab, {
        project: (0, appState_1.createBlankProject)(),
        selection: selection_1.noSelection,
        onSelectSection: noopSelectionChange,
        onProjectChange: noopProjectChange,
    }));
    (0, testUtils_1.assertCondition)(markup.includes("No sections available."), "SectionTab should render an empty-state message");
});
(0, testUtils_1.test)("CurveTab renders a stable empty state for blank projects", () => {
    const markup = (0, server_1.renderToStaticMarkup)((0, react_1.createElement)(CurveTab_1.CurveTab, {
        project: (0, appState_1.createBlankProject)(),
        selection: selection_1.noSelection,
        onSelectionChange: noopSelectionChange,
        onProjectChange: noopProjectChange,
    }));
    (0, testUtils_1.assertCondition)(markup.includes("No curve points."), "CurveTab should render an empty-state message");
});
