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
      return "Measures";
    case "measuresAbstract":
      return "Abstract";
    default:
      return "Time";
  }
};

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V9" />
      <path d="M7 16l5 5 5-5" />
      <path d="M5 3h14" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 11a2 2 0 1 0 0-0.01" />
      <path d="M21 16l-5-5-5 5-3-3-5 5" />
    </svg>
  );
}

function IconRotateCcw() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4h4" />
    </svg>
  );
}

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
          <IconUpload />
        </button>
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Export JSON"
          onClick={onExport}
        >
          <IconDownload />
        </button>
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Export PNG"
          onClick={onExportPng}
        >
          <IconImage />
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
          <IconRotateCcw />
        </button>
      </div>
    </header>
  );
}
