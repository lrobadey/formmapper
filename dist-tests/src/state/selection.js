"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noSelection = exports.tabForSelection = void 0;
const tabForSelection = (selection) => {
    switch (selection.type) {
        case "section":
            return "section";
        case "curvePoint":
        case "curveSegment":
            return "curve";
        case "none":
        default:
            return "project";
    }
};
exports.tabForSelection = tabForSelection;
exports.noSelection = { type: "none" };
