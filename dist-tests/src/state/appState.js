"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlankProject = exports.getPalette = void 0;
const palette = [
    { id: "slate_01", hex: "#5c6773" },
    { id: "navy_01", hex: "#2b3a55" },
    { id: "maroon_01", hex: "#6b2737" },
    { id: "forest_01", hex: "#2e473b" },
    { id: "beige_01", hex: "#c4b299" },
];
const getPalette = () => palette;
exports.getPalette = getPalette;
const createBlankProject = () => ({
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
exports.createBlankProject = createBlankProject;
