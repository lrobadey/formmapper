import { useEffect, useState } from "react";
import "./BottomDrawer.css";
import type { Project, Section } from "../state/types";
import { tabForSelection } from "../state/selection";
import type { Selection, DrawerTabKey } from "../state/selection";
import { ProjectTab } from "./tabs/ProjectTab";
import { SectionTab } from "./tabs/SectionTab";
import { CurveTab } from "./tabs/CurveTab";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  project: Project;
  onProjectChange: Dispatch<SetStateAction<Project>>;
  selection: Selection;
  onSelectionChange: (next: Selection) => void;
  warnings: string[];
}

export function BottomDrawer({ project, onProjectChange, selection, onSelectionChange, warnings }: Props) {
  const [activeTab, setActiveTab] = useState<DrawerTabKey>("project");

  useEffect(() => {
    setActiveTab(tabForSelection(selection));
  }, [selection]);

  const setSectionSelection = (id: Section["id"]) => onSelectionChange({ type: "section", id });

  return (
    <div className="bottom-drawer">
      <div className="tabs">
        <TabButton label="Project" tab="project" active={activeTab === "project"} onClick={() => setActiveTab("project")} />
        <TabButton label="Section" tab="section" active={activeTab === "section"} onClick={() => setActiveTab("section")} />
        <TabButton label="Curve" tab="curve" active={activeTab === "curve"} onClick={() => setActiveTab("curve")} />
      </div>
      <div className="drawer-body">
        {activeTab === "project" && <ProjectTab project={project} onProjectChange={onProjectChange} warnings={warnings} />}
        {activeTab === "section" && (
          <SectionTab
            project={project}
            selection={selection}
            onSelectSection={setSectionSelection}
            onProjectChange={onProjectChange}
          />
        )}
        {activeTab === "curve" && (
          <CurveTab project={project} selection={selection} onSelectionChange={onSelectionChange} onProjectChange={onProjectChange} />
        )}
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  tab: DrawerTabKey;
  active: boolean;
  onClick: () => void;
}

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button className={`tab ${active ? "active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}
