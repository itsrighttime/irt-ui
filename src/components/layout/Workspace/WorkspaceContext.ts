import { createContext, useContext } from "react";

export interface WorkspaceContextValue {
  /** Current location path (e.g. `usePathname()` / `location.pathname`). */
  currentPath?: string;
  /** Decides whether a tab route is active. */
  isRouteActive: (route?: string) => boolean;
}

export const WorkspaceContext = createContext<WorkspaceContextValue>({ isRouteActive: () => false });
WorkspaceContext.displayName = "IrtWorkspaceContext";

/** Route helpers for custom tabs rendered inside a `Workspace`. */
export const useWorkspaceRoute = () => useContext(WorkspaceContext);
