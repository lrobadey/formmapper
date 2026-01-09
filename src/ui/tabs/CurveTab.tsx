import type { Dispatch, SetStateAction } from "react";
import type { Project, TransitionType } from "../../state/types";
import type { Selection } from "../../state/selection";
import { updateSegmentTransition } from "../../state/curve";

interface Props {
  project: Project;
  selection: Selection;
  onSelectionChange: (next: Selection) => void;
  onProjectChange: Dispatch<SetStateAction<Project>>;
}

export function CurveTab({ project, selection, onSelectionChange, onProjectChange }: Props) {
  const points = project.energyCurve.points;
  const point =
    selection.type === "curvePoint" ? points.find((p) => p.id === selection.id) : points[0];

  const segmentIndex =
    selection.type === "curveSegment"
      ? selection.index
      : selection.type === "curvePoint"
        ? points.findIndex((p) => p.id === selection.id)
        : 0;
  const validSegment = segmentIndex >= 0 && segmentIndex < points.length - 1;
  const segmentStart = validSegment ? points[segmentIndex] : null;
  const segmentEnd = validSegment ? points[segmentIndex + 1] : null;

  return (
    <div className="drawer-section">
      {point ? (
        <>
          <div className="field">
            <label>Point</label>
            <div className="readonly">
              {point.sec.toFixed(1)}s, y={point.y.toFixed(2)} ({point.rightTransition.type})
            </div>
          </div>
          <div className="field drawer-section__full">
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
          {validSegment && segmentStart && segmentEnd && (
            <>
              <div className="field">
                <label>Selected segment</label>
                <div className="readonly">
                  {segmentStart.sec.toFixed(1)}s → {segmentEnd.sec.toFixed(1)}s
                </div>
              </div>
              <div className="field drawer-section__full">
                <label>Transition type</label>
                <div className="pill-row">
                  {["linear", "step", "curve"].map((t) => (
                    <button
                      key={t}
                      className={`pill ${segmentStart.rightTransition.type === t ? "active" : ""}`}
                      onClick={() => {
                        onSelectionChange({ type: "curveSegment", index: segmentIndex });
                        onProjectChange((prev) => {
                          const pointsNext = updateSegmentTransition(prev.energyCurve.points, segmentIndex, t as TransitionType, prev.energyCurve.points[segmentIndex].rightTransition.param);
                          return { ...prev, energyCurve: { ...prev.energyCurve, points: pointsNext } };
                        });
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field drawer-section__full">
                <label>Curve param ({segmentStart.rightTransition.param.toFixed(2)})</label>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={segmentStart.rightTransition.param}
                  onChange={(ev) => {
                    const param = Number(ev.target.value);
                    onSelectionChange({ type: "curveSegment", index: segmentIndex });
                    onProjectChange((prev) => {
                      const pointsNext = updateSegmentTransition(
                        prev.energyCurve.points,
                        segmentIndex,
                        prev.energyCurve.points[segmentIndex].rightTransition.type,
                        param
                      );
                      return { ...prev, energyCurve: { ...prev.energyCurve, points: pointsNext } };
                    });
                  }}
                  disabled={segmentStart.rightTransition.type !== "curve"}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <div>No curve points.</div>
      )}
    </div>
  );
}
