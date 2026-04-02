"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionTab = SectionTab;
const jsx_runtime_1 = require("react/jsx-runtime");
const sections_1 = require("../../state/sections");
const appState_1 = require("../../state/appState");
function SectionTab({ project, selection, onSelectSection, onProjectChange }) {
    const currentSection = selection.type === "section"
        ? project.sections.find((s) => s.id === selection.id)
        : project.sections[0];
    if (!currentSection) {
        return (0, jsx_runtime_1.jsx)("div", { children: "No sections available." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Section" }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Selected" }), (0, jsx_runtime_1.jsx)("div", { className: "readonly", children: currentSection.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Start / End (sec)" }), (0, jsx_runtime_1.jsxs)("div", { className: "readonly", children: [currentSection.startSec.toFixed(1), " \u2013 ", currentSection.endSec.toFixed(1)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Tags" }), (0, jsx_runtime_1.jsx)("div", { className: "readonly", children: (currentSection.tags || []).join(", ") || "—" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Notes" }), (0, jsx_runtime_1.jsx)("div", { className: "readonly multiline", children: currentSection.notes || "—" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Switch section" }), (0, jsx_runtime_1.jsx)("div", { className: "pill-row", children: project.sections.map((s) => ((0, jsx_runtime_1.jsx)("button", { className: `pill ${s.id === currentSection.id ? "active" : ""}`, onClick: () => onSelectSection(s.id), children: s.name }, s.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Insert new section after current" }), (0, jsx_runtime_1.jsx)("button", { className: "pill", onClick: () => {
                            const idx = project.sections.findIndex((s) => s.id === currentSection.id);
                            const palette = (0, appState_1.getPalette)();
                            const colorId = palette[(idx + 1) % palette.length].id;
                            onProjectChange((prev) => {
                                const nextSections = (0, sections_1.insertSectionAtBoundary)(prev.sections, idx, 4, `sec-${crypto.randomUUID()}`, `Section ${prev.sections.length + 1}`, colorId);
                                return { ...prev, sections: nextSections };
                            });
                        }, children: "Insert + ripple" })] })] }));
}
