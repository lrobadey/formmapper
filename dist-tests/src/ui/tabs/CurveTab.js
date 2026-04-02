"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveTab = CurveTab;
const jsx_runtime_1 = require("react/jsx-runtime");
const curve_1 = require("../../state/curve");
function CurveTab({ project, selection, onSelectionChange, onProjectChange }) {
    const points = project.energyCurve.points;
    const point = selection.type === "curvePoint" ? points.find((p) => p.id === selection.id) : points[0];
    const segmentIndex = selection.type === "curveSegment"
        ? selection.index
        : selection.type === "curvePoint"
            ? points.findIndex((p) => p.id === selection.id)
            : 0;
    const validSegment = segmentIndex >= 0 && segmentIndex < points.length - 1;
    const segmentStart = validSegment ? points[segmentIndex] : null;
    const segmentEnd = validSegment ? points[segmentIndex + 1] : null;
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Curve" }), point ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Point" }), (0, jsx_runtime_1.jsxs)("div", { className: "readonly", children: [point.sec.toFixed(1), "s, y=", point.y.toFixed(2), " (", point.rightTransition.type, ")"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Switch point" }), (0, jsx_runtime_1.jsx)("div", { className: "pill-row", children: project.energyCurve.points.map((p) => ((0, jsx_runtime_1.jsxs)("button", { className: `pill ${p.id === point.id ? "active" : ""}`, onClick: () => onSelectionChange({ type: "curvePoint", id: p.id }), children: [p.sec.toFixed(1), "s"] }, p.id))) })] }), validSegment && segmentStart && segmentEnd && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Selected segment" }), (0, jsx_runtime_1.jsxs)("div", { className: "readonly", children: [segmentStart.sec.toFixed(1), "s \u2192 ", segmentEnd.sec.toFixed(1), "s"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("label", { children: "Transition type" }), (0, jsx_runtime_1.jsx)("div", { className: "pill-row", children: ["linear", "step", "curve"].map((t) => ((0, jsx_runtime_1.jsx)("button", { className: `pill ${segmentStart.rightTransition.type === t ? "active" : ""}`, onClick: () => {
                                                onSelectionChange({ type: "curveSegment", index: segmentIndex });
                                                onProjectChange((prev) => {
                                                    const pointsNext = (0, curve_1.updateSegmentTransition)(prev.energyCurve.points, segmentIndex, t, prev.energyCurve.points[segmentIndex].rightTransition.param);
                                                    return { ...prev, energyCurve: { ...prev.energyCurve, points: pointsNext } };
                                                });
                                            }, children: t }, t))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Curve param (", segmentStart.rightTransition.param.toFixed(2), ")"] }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: -1, max: 1, step: 0.01, value: segmentStart.rightTransition.param, onChange: (ev) => {
                                            const param = Number(ev.target.value);
                                            onSelectionChange({ type: "curveSegment", index: segmentIndex });
                                            onProjectChange((prev) => {
                                                const pointsNext = (0, curve_1.updateSegmentTransition)(prev.energyCurve.points, segmentIndex, prev.energyCurve.points[segmentIndex].rightTransition.type, param);
                                                return { ...prev, energyCurve: { ...prev.energyCurve, points: pointsNext } };
                                            });
                                        }, disabled: segmentStart.rightTransition.type !== "curve" })] })] }))] })) : ((0, jsx_runtime_1.jsx)("div", { children: "No curve points." }))] }));
}
