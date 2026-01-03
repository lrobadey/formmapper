import type { Project } from "../state/types";
import { repairProject, supportedSchemaVersion, type RepairResult } from "../model/repair";

export interface ImportResult extends RepairResult {}

export const exportProject = (project: Project) => {
  const { project: canonical } = repairProject(project);
  const blob = new Blob([JSON.stringify(canonical, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${canonical.title || "Untitled"}.formmapper.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importProject = async (file: File): Promise<ImportResult> => {
  const text = await file.text();
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON: unable to parse file.");
  }

  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid project file: root is not an object.");
  }

  const candidate = raw as Project;
  if ((candidate as any).schemaVersion !== supportedSchemaVersion) {
    throw new Error(`Unsupported schemaVersion ${(candidate as any).schemaVersion}`);
  }

  return repairProject(candidate);
};
