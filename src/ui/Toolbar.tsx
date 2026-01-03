import "./Toolbar.css";
import type { Project } from "../state/types";

interface Props {
  project: Project;
}

export function Toolbar({ project }: Props) {
  return (
    <header className="toolbar">
      <div className="toolbar__left">
        <span className="toolbar__title">{project.title || "Untitled"}</span>
      </div>
      <div className="toolbar__actions">
        <button className="ghost">Import</button>
        <button className="ghost">Export JSON</button>
        <button className="ghost">Export PNG</button>
        <div className="divider" />
        <button className="ghost">Timebase</button>
        <button className="ghost">Snap</button>
        <button className="ghost">Zoom reset</button>
      </div>
    </header>
  );
}

