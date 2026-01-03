import { useRef, useState } from "react";
import "./App.css";
import { Toolbar } from "./ui/Toolbar";
import { CanvasStage } from "./ui/CanvasStage";
import { BottomDrawer } from "./ui/BottomDrawer";
import { createDemoProject } from "./state/appState";
import { noSelection } from "./state/selection";
import type { Selection } from "./state/selection";
import type { Project, TimebaseView } from "./state/types";
import { initialViewport } from "./state/viewport";
import type { ViewportState } from "./state/viewport";
import { exportProject, importProject } from "./io/importExport";
import { exportCanvasPng } from "./io/exportPng";

function App() {
  const [project, setProject] = useState<Project>(createDemoProject());
  const [selection, setSelection] = useState<Selection>(noSelection);
  const [viewport, setViewport] = useState<ViewportState>(initialViewport());
  const [warnings, setWarnings] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleTimebaseChange = (view: TimebaseView) => {
    setProject((prev) => ({ ...prev, timebaseView: view }));
  };

  const handleImport = async (file: File) => {
    try {
      const { project: imported, warnings } = await importProject(file);
      setProject(imported);
      setSelection(noSelection);
      setWarnings(warnings);
      if (warnings.length) alert(`Imported with repairs:\n${warnings.join("\n")}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Import failed.";
      alert(message);
    }
  };

  const handleExport = () => exportProject(project);

  const handleExportPng = () => {
    if (!canvasRef.current) {
      alert("Canvas not ready to export.");
      return;
    }
    exportCanvasPng(canvasRef.current, project.title);
  };

  const handleZoomReset = () => setViewport(initialViewport());

  return (
    <div className="app-shell">
      <Toolbar
        project={project}
        timebaseView={project.timebaseView}
        onTimebaseChange={handleTimebaseChange}
        onImport={handleImport}
        onExport={handleExport}
        onExportPng={handleExportPng}
        onZoomReset={handleZoomReset}
      />
      <div className="main-area">
        <CanvasStage
          project={project}
          onProjectChange={setProject}
          viewport={viewport}
          onViewportChange={setViewport}
          selection={selection}
          onSelectionChange={setSelection}
          canvasRef={canvasRef}
        />
      </div>
      <BottomDrawer
        project={project}
        onProjectChange={setProject}
        selection={selection}
        onSelectionChange={setSelection}
        warnings={warnings}
      />
    </div>
  );
}

export default App;
