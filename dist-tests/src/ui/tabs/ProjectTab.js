"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTab = ProjectTab;
const jsx_runtime_1 = require("react/jsx-runtime");
const timebaseLabels = {
    time: "Time (mm:ss)",
    measuresComputed: "Measures (BPM)",
    measuresAbstract: "Measures (abstract)",
};
function ProjectTab({ project, onProjectChange, warnings }) {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Project" }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Title" }), (0, jsx_runtime_1.jsx)("input", { value: project.title, onChange: (e) => onProjectChange((prev) => ({ ...prev, title: e.target.value })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Composer / Artist" }), (0, jsx_runtime_1.jsx)("input", { value: project.composerOrArtist, onChange: (e) => onProjectChange((prev) => ({ ...prev, composerOrArtist: e.target.value })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Timebase view" }), (0, jsx_runtime_1.jsx)("select", { value: project.timebaseView, onChange: (e) => onProjectChange((prev) => ({ ...prev, timebaseView: e.target.value })), children: Object.entries(timebaseLabels).map(([key, label]) => ((0, jsx_runtime_1.jsx)("option", { value: key, children: label }, key))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Tempo" }), (0, jsx_runtime_1.jsxs)("div", { className: "pill-row", children: [(0, jsx_runtime_1.jsxs)("label", { className: "pill", style: { cursor: "default" }, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: project.tempoModel.enabled, onChange: (e) => onProjectChange((prev) => ({ ...prev, tempoModel: { ...prev.tempoModel, enabled: e.target.checked } })) }), "\u00A0Enabled"] }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: 30, max: 300, value: project.tempoModel.bpm, onChange: (e) => onProjectChange((prev) => ({
                                    ...prev,
                                    tempoModel: { ...prev.tempoModel, bpm: Number(e.target.value) || prev.tempoModel.bpm },
                                })) }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: 1, max: 12, value: project.tempoModel.timeSig.numerator, onChange: (e) => onProjectChange((prev) => ({
                                    ...prev,
                                    tempoModel: {
                                        ...prev.tempoModel,
                                        timeSig: { ...prev.tempoModel.timeSig, numerator: Number(e.target.value) || prev.tempoModel.timeSig.numerator },
                                    },
                                })) }), (0, jsx_runtime_1.jsx)("span", { style: { alignSelf: "center" }, children: "/" }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: 1, max: 16, value: project.tempoModel.timeSig.denominator, onChange: (e) => onProjectChange((prev) => ({
                                    ...prev,
                                    tempoModel: {
                                        ...prev.tempoModel,
                                        timeSig: { ...prev.tempoModel.timeSig, denominator: Number(e.target.value) || prev.tempoModel.timeSig.denominator },
                                    },
                                })) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Notes" }), (0, jsx_runtime_1.jsx)("textarea", { className: "readonly multiline", value: project.projectNotes, onChange: (e) => onProjectChange((prev) => ({ ...prev, projectNotes: e.target.value })) })] }), warnings.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Import warnings" }), (0, jsx_runtime_1.jsx)("div", { className: "readonly multiline", children: (0, jsx_runtime_1.jsx)("ul", { style: { paddingLeft: 16, margin: 0 }, children: warnings.map((w, idx) => ((0, jsx_runtime_1.jsx)("li", { children: w }, `${w}-${idx}`))) }) })] }))] }));
}
