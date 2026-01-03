import { useRef } from "react";
import "./Toolbar.css";
import type { Project, TimebaseView } from "../state/types";

interface Props {
  project: Project;
  timebaseView: TimebaseView;
  onImport: (file: File) => void;
  onExport: () => void;
  onExportPng: () => void;
  onTimebaseChange: (view: TimebaseView) => void;
  onZoomReset: () => void;
}

const timebaseOrder: TimebaseView[] = ["time", "measuresComputed", "measuresAbstract"];

const nextTimebase = (current: TimebaseView): TimebaseView => {
  const idx = timebaseOrder.indexOf(current);
  const nextIdx = idx === -1 ? 0 : (idx + 1) % timebaseOrder.length;
  return timebaseOrder[nextIdx];
};

const labelForTimebase = (view: TimebaseView) => {
  switch (view) {
    case "measuresComputed":
      return "Measures (BPM)";
    case "measuresAbstract":
      return "Measures (abstract)";
    default:
      return "Time";
  }
};

export function Toolbar({
  project,
  timebaseView,
  onImport,
  onExport,
  onExportPng,
  onTimebaseChange,
  onZoomReset,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <header className="toolbar">
      <div className="toolbar__left">
        <span className="toolbar__title">{project.title || "Untitled"}</span>
      </div>
      <div className="toolbar__actions">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.formmapper.json,application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />
        <button className="ghost" onClick={() => fileInputRef.current?.click()}>
          Import
        </button>
        <button className="ghost" onClick={onExport}>
          Export JSON
        </button>
        <button className="ghost" onClick={onExportPng}>
          Export PNG
        </button>
        <div className="divider" />
        <button className="ghost" onClick={() => onTimebaseChange(nextTimebase(timebaseView))}>
          Timebase: {labelForTimebase(timebaseView)}
        </button>
        <button className="ghost" disabled title="Snap is always on per north star">
          Snap: On
        </button>
        <button className="ghost" onClick={onZoomReset}>
          Zoom reset
        </button>
      </div>
    </header>
  );
}
