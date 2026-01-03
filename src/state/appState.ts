import type { Project } from "./types";

const palette = [
  { id: "slate_01", hex: "#5c6773" },
  { id: "navy_01", hex: "#2b3a55" },
  { id: "maroon_01", hex: "#6b2737" },
  { id: "forest_01", hex: "#2e473b" },
  { id: "beige_01", hex: "#c4b299" },
];

export const getPalette = () => palette;

export const createDemoProject = (): Project => ({
  schemaVersion: 1,
  title: "Demo Form",
  composerOrArtist: "Unknown",
  projectNotes: "Adjust sections and curve in the foundation build.",
  timebaseView: "time",
  tempoModel: {
    enabled: true,
    bpm: 120,
    timeSig: { numerator: 4, denominator: 4 },
  },
  sections: [
    { id: "sec-intro", name: "Intro", colorId: "navy_01", startSec: 0, endSec: 8, notes: "", tags: ["intro"] },
    { id: "sec-verse", name: "Verse", colorId: "forest_01", startSec: 8, endSec: 24, notes: "", tags: ["verse"] },
    { id: "sec-chorus", name: "Chorus", colorId: "maroon_01", startSec: 24, endSec: 40, notes: "", tags: ["chorus"] },
  ],
  energyCurve: {
    yBands: ["Low", "Medium", "High"],
    yMin: 0,
    yMax: 1,
    points: [
      { id: "p1", sec: 0, y: 0.2, rightTransition: { type: "linear", param: 0 } },
      { id: "p2", sec: 8, y: 0.35, rightTransition: { type: "curve", param: 0.4 } },
      { id: "p3", sec: 24, y: 0.75, rightTransition: { type: "step", param: 0 } },
      { id: "p4", sec: 40, y: 0.6, rightTransition: { type: "linear", param: 0 } },
    ],
  },
});

