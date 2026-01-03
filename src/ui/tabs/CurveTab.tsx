import type { Project } from "../../state/types";
import type { Selection } from "../../state/selection";

interface Props {
  project: Project;
  selection: Selection;
  onSelectionChange: (next: Selection) => void;
}

export function CurveTab({ project, selection, onSelectionChange }: Props) {
  const point =
    selection.type === "curvePoint"
      ? project.energyCurve.points.find((p) => p.id === selection.id)
      : project.energyCurve.points[0];

  return (
    <div>
      <h4>Curve</h4>
      {point ? (
        <>
          <div className="field">
            <label>Point</label>
            <div className="readonly">
              {point.sec.toFixed(1)}s, y={point.y.toFixed(2)} ({point.rightTransition.type})
            </div>
          </div>
          <div className="field">
            <label>Switch point</label>
            <div className="pill-row">
              {project.energyCurve.points.map((p) => (
                <button
                  key={p.id}
                  className={`pill ${p.id === point.id ? "active" : ""}`}
                  onClick={() => onSelectionChange({ type: "curvePoint", id: p.id })}
                >
                  {p.sec.toFixed(1)}s
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>No curve points.</div>
      )}
    </div>
  );
}

