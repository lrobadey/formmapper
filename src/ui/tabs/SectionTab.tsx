import type { Project, Section } from "../../state/types";
import type { Selection } from "../../state/selection";

interface Props {
  project: Project;
  selection: Selection;
  onSelectSection: (id: Section["id"]) => void;
}

export function SectionTab({ project, selection, onSelectSection }: Props) {
  const currentSection = selection.type === "section"
    ? project.sections.find((s) => s.id === selection.id)
    : project.sections[0];

  if (!currentSection) {
    return <div>No sections available.</div>;
  }

  return (
    <div>
      <h4>Section</h4>
      <div className="field">
        <label>Selected</label>
        <div className="readonly">{currentSection.name}</div>
      </div>
      <div className="field">
        <label>Start / End (sec)</label>
        <div className="readonly">
          {currentSection.startSec.toFixed(1)} – {currentSection.endSec.toFixed(1)}
        </div>
      </div>
      <div className="field">
        <label>Tags</label>
        <div className="readonly">{(currentSection.tags || []).join(", ") || "—"}</div>
      </div>
      <div className="field">
        <label>Notes</label>
        <div className="readonly multiline">{currentSection.notes || "—"}</div>
      </div>
      <div className="field">
        <label>Switch section</label>
        <div className="pill-row">
          {project.sections.map((s) => (
            <button
              key={s.id}
              className={`pill ${s.id === currentSection.id ? "active" : ""}`}
              onClick={() => onSelectSection(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

