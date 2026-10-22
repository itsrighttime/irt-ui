"use client";

import { useCallback, useMemo, useState } from "react";
import { filterWorkspace } from "../config/filterWorkspace";
import type { WorkspaceConfig, WorkspaceVisibility } from "./layout.types";

export interface UseWorkspaceResult {
  /** Config after visibility filtering (unchanged without `visibility`). */
  config: WorkspaceConfig;
  activeTab: string | null;
  /** Call with any tab id; parent ids from `visibility.map` become active. */
  activateTab: (id: string) => void;
}

/** Tracks the active parent tab and filters the config by `visibility`. */
export function useWorkspace(config: WorkspaceConfig, visibility?: WorkspaceVisibility): UseWorkspaceResult {
  const [activeTab, setActiveTab] = useState<string | null>(visibility?.initialTab ?? null);

  const activateTab = useCallback(
    (id: string) => {
      if (visibility && Object.prototype.hasOwnProperty.call(visibility.map, id)) setActiveTab(id);
    },
    [visibility],
  );

  const filtered = useMemo(() => {
    if (!visibility) return config;
    const visible = new Set([...visibility.alwaysVisible, ...((activeTab && visibility.map[activeTab]) || [])]);
    return filterWorkspace(config, visible);
  }, [config, visibility, activeTab]);

  return { config: filtered, activeTab, activateTab };
}
