import { useEffect, useState } from "react";
import "./BottomDrawer.css";
import type { Project, Section } from "../state/types";
import { tabForSelection } from "../state/selection";
import type { Selection, DrawerTabKey } from "../state/selection";
import { ProjectTab } from "./tabs/ProjectTab";
import { SectionTab } from "./tabs/SectionTab";
import { CurveTab } from "./tabs/CurveTab";

interface Props {
  project: Project;
  selection: Selection;
  onSelectionChange: (next: Selection) => void;
}

export function BottomDrawer({ project, selection, onSelectionChange }: Props) {
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
        {activeTab === "project" && <ProjectTab project={project} />}
        {activeTab === "section" && <SectionTab project={project} selection={selection} onSelectSection={setSectionSelection} />}
        {activeTab === "curve" && <CurveTab project={project} selection={selection} onSelectionChange={onSelectionChange} />}
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

