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

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const UploadIcon = () => (
  <svg {...iconProps}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const DownloadIcon = () => (
  <svg {...iconProps}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ImageIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const RotateCcwIcon = () => (
  <svg {...iconProps}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

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
          <UploadIcon />
        </button>
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Export JSON"
          onClick={onExport}
        >
          <DownloadIcon />
        </button>
        <button
          className="toolbar__btn toolbar__btn--icon"
          data-tooltip="Export PNG"
          onClick={onExportPng}
        >
          <ImageIcon />
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
          <RotateCcwIcon />
        </button>
      </div>
    </header>
  );
}
