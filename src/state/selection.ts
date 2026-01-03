import type { Section, CurvePoint } from "./types";

export type Selection =
  | { type: "none" }
  | { type: "section"; id: Section["id"] }
  | { type: "curvePoint"; id: CurvePoint["id"] }
  | { type: "curveSegment"; index: number };

export type DrawerTabKey = "project" | "section" | "curve";

export const tabForSelection = (selection: Selection): DrawerTabKey => {
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

export const noSelection: Selection = { type: "none" };

