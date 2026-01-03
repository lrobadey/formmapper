export type TimebaseView = "time" | "measuresComputed" | "measuresAbstract";

export interface TempoModel {
  enabled: boolean;
  bpm: number;
  timeSig: {
    numerator: number;
    denominator: number;
  };
}

export interface Section {
  id: string;
  name: string;
  colorId: string;
  startSec: number;
  endSec: number;
  notes?: string;
  tags?: string[];
}

export type TransitionType = "linear" | "step" | "curve";

export interface CurvePoint {
  id: string;
  sec: number;
  y: number; // normalized 0..1
  rightTransition: {
    type: TransitionType;
    param: number; // range [-1, 1] as per north star
  };
}

export interface EnergyCurve {
  yBands: string[];
  yMin: number;
  yMax: number;
  points: CurvePoint[];
}

export interface Project {
  schemaVersion: number;
  title: string;
  composerOrArtist: string;
  projectNotes: string;
  timebaseView: TimebaseView;
  tempoModel: TempoModel;
  sections: Section[];
  energyCurve: EnergyCurve;
}

