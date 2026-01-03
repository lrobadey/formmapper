import type { Project } from "../../state/types";

interface Props {
  project: Project;
}

export function ProjectTab({ project }: Props) {
  return (
    <div>
      <h4>Project</h4>
      <div className="field">
        <label>Title</label>
        <div className="readonly">{project.title || "Untitled"}</div>
      </div>
      <div className="field">
        <label>Composer / Artist</label>
        <div className="readonly">{project.composerOrArtist || "—"}</div>
      </div>
      <div className="field">
        <label>Timebase view</label>
        <div className="readonly">{project.timebaseView}</div>
      </div>
      <div className="field">
        <label>Tempo</label>
        <div className="readonly">
          {project.tempoModel.enabled
            ? `${project.tempoModel.bpm} bpm, ${project.tempoModel.timeSig.numerator}/${project.tempoModel.timeSig.denominator}`
            : "Disabled"}
        </div>
      </div>
      <div className="field">
        <label>Notes</label>
        <div className="readonly multiline">{project.projectNotes || "—"}</div>
      </div>
    </div>
  );
}

