import { useRef } from "react";
import { Upload, Download, Image, RotateCcw } from "lucide-react";
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
      return "Measures";
    case "measuresAbstract":
      return "Abstract";
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
        <div className="toolbar__titleblock">
          <span className="toolbar__title">{project.title || "Untitled"}</span>
          {project.composerOrArtist ? (
            <span className="toolbar__subtitle">{project.composerOrArtist}</span>
          ) : null}
        </div>
      </div>

      <div className="toolbar__actions">
        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.formmapper.json,application/json"
          className="toolbar__file-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />

        {/* Icon buttons */}
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Import"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload />
        </button>
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Export JSON"
          onClick={onExport}
        >
          <Download />
        </button>
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Export PNG"
          onClick={onExportPng}
        >
          <Image />
        </button>

        <div className="toolbar__divider" />

        {/* Text buttons for contextual info */}
        <button
          className="toolbar__btn toolbar__btn--text"
          onClick={() => onTimebaseChange(nextTimebase(timebaseView))}
        >
          {labelForTimebase(timebaseView)}
        </button>
        <button
          className="toolbar__btn toolbar__btn--text"
          disabled
          title="Snap is always on"
        >
          Snap
        </button>
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Reset zoom"
          onClick={onZoomReset}
        >
          <RotateCcw />
        </button>
      </div>
    </header>
  );
}
