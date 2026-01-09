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
    <div className="section-tab">
      <h4>Section</h4>
      <div className="section-detail-grid">
        <div className="section-detail-row">
          <label>Selected</label>
          <div className="readonly">{currentSection.name}</div>
        </div>
        <div className="section-detail-row">
          <label>Start / End (sec)</label>
          <div className="readonly">
            {currentSection.startSec.toFixed(1)} – {currentSection.endSec.toFixed(1)}
          </div>
        </div>
        <div className="section-detail-row">
          <label>Tags</label>
          <div className="readonly">{(currentSection.tags || []).join(", ") || "—"}</div>
        </div>
        <div className="section-detail-row section-detail-notes">
          <label>Notes</label>
          <div className="readonly multiline">{currentSection.notes || "—"}</div>
        </div>
      </div>
      <div className="section-actions">
        <label className="section-actions__label">Switch section</label>
        <div className="section-actions__content">
          <div className="pill-row section-pill-row">
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
          <button
            className="pill section-actions__insert"
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
    </div>
  );
}
