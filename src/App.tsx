import { useState } from "react";
import "./App.css";
import { Toolbar } from "./ui/Toolbar";
import { CanvasStage } from "./ui/CanvasStage";
import { BottomDrawer } from "./ui/BottomDrawer";
import { createDemoProject } from "./state/appState";
import { noSelection } from "./state/selection";
import type { Selection } from "./state/selection";
import type { Project } from "./state/types";
import { initialViewport } from "./state/viewport";
import type { ViewportState } from "./state/viewport";

function App() {
  const [project] = useState<Project>(createDemoProject());
  const [selection, setSelection] = useState<Selection>(noSelection);
  const [viewport, setViewport] = useState<ViewportState>(initialViewport());

  return (
    <div className="app-shell">
      <Toolbar project={project} />
      <div className="main-area">
        <CanvasStage
          project={project}
          viewport={viewport}
          onViewportChange={setViewport}
          selection={selection}
          onSelectionChange={setSelection}
        />
      </div>
      <BottomDrawer project={project} selection={selection} onSelectionChange={setSelection} />
    </div>
  );
}

export default App;
