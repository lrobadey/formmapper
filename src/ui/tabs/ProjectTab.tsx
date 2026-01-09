import type { Dispatch, SetStateAction } from "react";
import type { Project, TimebaseView } from "../../state/types";
import "./ProjectTab.css";

interface Props {
  project: Project;
  onProjectChange: Dispatch<SetStateAction<Project>>;
  warnings: string[];
}

const timebaseLabels: Record<TimebaseView, string> = {
  time: "Time (mm:ss)",
  measuresComputed: "Measures (BPM)",
  measuresAbstract: "Measures (abstract)",
};

export function ProjectTab({ project, onProjectChange, warnings }: Props) {
  return (
    <div className="project-tab">
      <h4>Project</h4>
      <div className="project-tab__grid">
        <section className="project-tab__panel">
          <div className="project-tab__panel-title">Meta</div>
          <div className="project-tab__field">
            <label className="project-tab__label">Title</label>
            <input
              value={project.title}
              onChange={(e) => onProjectChange((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="project-tab__field">
            <label className="project-tab__label">Composer / Artist</label>
            <input
              value={project.composerOrArtist}
              onChange={(e) => onProjectChange((prev) => ({ ...prev, composerOrArtist: e.target.value }))}
            />
          </div>
          <div className="project-tab__field">
            <label className="project-tab__label">Timebase view</label>
            <select
              value={project.timebaseView}
              onChange={(e) => onProjectChange((prev) => ({ ...prev, timebaseView: e.target.value as TimebaseView }))}
            >
              {Object.entries(timebaseLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </section>
        <section className="project-tab__panel">
          <div className="project-tab__panel-title">Tempo</div>
          <div className="project-tab__field">
            <label className="project-tab__label">Tempo</label>
            <div className="project-tab__tempo-row">
              <label className="pill project-tab__tempo-pill">
                <input
                  type="checkbox"
                  checked={project.tempoModel.enabled}
                  onChange={(e) =>
                    onProjectChange((prev) => ({ ...prev, tempoModel: { ...prev.tempoModel, enabled: e.target.checked } }))
                  }
                />
                &nbsp;Enabled
              </label>
              <input
                className="project-tab__tempo-input"
                type="number"
                min={30}
                max={300}
                value={project.tempoModel.bpm}
                onChange={(e) =>
                  onProjectChange((prev) => ({
                    ...prev,
                    tempoModel: { ...prev.tempoModel, bpm: Number(e.target.value) || prev.tempoModel.bpm },
                  }))
                }
              />
              <input
                className="project-tab__tempo-input"
                type="number"
                min={1}
                max={12}
                value={project.tempoModel.timeSig.numerator}
                onChange={(e) =>
                  onProjectChange((prev) => ({
                    ...prev,
                    tempoModel: {
                      ...prev.tempoModel,
                      timeSig: { ...prev.tempoModel.timeSig, numerator: Number(e.target.value) || prev.tempoModel.timeSig.numerator },
                    },
                  }))
                }
              />
              <span className="project-tab__tempo-divider">/</span>
              <input
                className="project-tab__tempo-input"
                type="number"
                min={1}
                max={16}
                value={project.tempoModel.timeSig.denominator}
                onChange={(e) =>
                  onProjectChange((prev) => ({
                    ...prev,
                    tempoModel: {
                      ...prev.tempoModel,
                      timeSig: { ...prev.tempoModel.timeSig, denominator: Number(e.target.value) || prev.tempoModel.timeSig.denominator },
                    },
                  }))
                }
              />
            </div>
          </div>
        </section>
        <section className="project-tab__panel project-tab__notes-panel">
          <div className="project-tab__panel-title">Notes & Warnings</div>
          <div className="project-tab__notes-grid">
            <div className="project-tab__notes-field">
              <label className="project-tab__label">Notes</label>
              <textarea
                className="project-tab__textarea"
                value={project.projectNotes}
                onChange={(e) => onProjectChange((prev) => ({ ...prev, projectNotes: e.target.value }))}
              />
            </div>
            {warnings.length > 0 && (
              <div className="project-tab__notes-field">
                <label className="project-tab__label">Import warnings</label>
                <div className="readonly multiline project-tab__warnings">
                  <ul className="project-tab__warnings-list">
                    {warnings.map((w, idx) => (
                      <li key={`${w}-${idx}`}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
