import type { Dispatch, SetStateAction } from "react";
import type { Project, TimebaseView } from "../../state/types";

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
    <div>
      <h4>Project</h4>
      <div className="form-grid">
        <div className="field">
          <label>Title</label>
          <input
            value={project.title}
            onChange={(e) => onProjectChange((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Composer / Artist</label>
          <input
            value={project.composerOrArtist}
            onChange={(e) => onProjectChange((prev) => ({ ...prev, composerOrArtist: e.target.value }))}
          />
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Timebase / Tempo</label>
          <div className="row">
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
            <label className="pill" style={{ cursor: "default" }}>
              <input
                type="checkbox"
                checked={project.tempoModel.enabled}
                onChange={(e) =>
                  onProjectChange((prev) => ({ ...prev, tempoModel: { ...prev.tempoModel, enabled: e.target.checked } }))
                }
              />
              &nbsp;Enabled
            </label>
            <div className="field">
              <input
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
            </div>
            <div className="field">
              <input
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
            </div>
            <span style={{ alignSelf: "center" }}>/</span>
            <div className="field">
              <input
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
        </div>
      </div>
      <div className="row">
        <div className="field" style={{ flex: 1, minWidth: 240 }}>
          <label>Notes</label>
          <textarea
            className="readonly multiline"
            value={project.projectNotes}
            onChange={(e) => onProjectChange((prev) => ({ ...prev, projectNotes: e.target.value }))}
          />
        </div>
        {warnings.length > 0 && (
          <div className="field" style={{ flex: 1, minWidth: 240 }}>
            <label>Import warnings</label>
            <div className="readonly multiline">
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {warnings.map((w, idx) => (
                  <li key={`${w}-${idx}`}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
