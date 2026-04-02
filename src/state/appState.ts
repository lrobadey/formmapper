import type { Project } from "./types";

const palette = [
  { id: "slate_01", hex: "#5c6773" },
  { id: "navy_01", hex: "#2b3a55" },
  { id: "maroon_01", hex: "#6b2737" },
  { id: "forest_01", hex: "#2e473b" },
  { id: "beige_01", hex: "#c4b299" },
];

export const getPalette = () => palette;

export const createBlankProject = (): Project => ({
  schemaVersion: 1,
  title: "",
  composerOrArtist: "",
  projectNotes: "",
  timebaseView: "time",
  tempoModel: {
    enabled: true,
    bpm: 120,
    timeSig: { numerator: 4, denominator: 4 },
  },
  sections: [],
  energyCurve: {
    yBands: ["Low", "Medium", "High"],
    yMin: 0,
    yMax: 1,
    points: [],
  },
});
