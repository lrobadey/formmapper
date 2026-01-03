import type { Project, Section } from "../../state/types";
import type { Selection } from "../../state/selection";
import type { Dispatch, SetStateAction } from "react";
import { insertSectionAtBoundary } from "../../state/sections";
import { getPalette } from "../../state/appState";

interface Props {
  project: Project;
  selection: Selection;
  onSelectSection: (id: Section["id"]) => void;
  onProjectChange: Dispatch<SetStateAction<Project>>;
}

export function SectionTab({ project, selection, onSelectSection, onProjectChange }: Props) {
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
      <div className="field">
        <label>Insert new section after current</label>
        <button
          className="pill"
          onClick={() => {
            const idx = project.sections.findIndex((s) => s.id === currentSection.id);
            const palette = getPalette();
            const colorId = palette[(idx + 1) % palette.length].id;
            onProjectChange((prev) => {
              const nextSections = insertSectionAtBoundary(
                prev.sections,
                idx,
                4,
                `sec-${crypto.randomUUID()}`,
                `Section ${prev.sections.length + 1}`,
                colorId
              );
              return { ...prev, sections: nextSections };
            });
          }}
        >
          Insert + ripple
        </button>
      </div>
    </div>
  );
}
