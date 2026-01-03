import type { Project } from "../state/types";

// Placeholder import/export for foundation. Real validation/repair will follow the north star.
export const exportProject = (project: Project) => {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.title || "Untitled"}.formmapper.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importProject = async (_file: File): Promise<Project | null> => {
  // Future: parse, validate, repair. For now, we no-op.
  return null;
};

