export const WORKSPACE_SLOTS = {
  TOP_PRIMARY: "topPrimary",
  TOP_SECONDARY: "topSecondary",
  BOTTOM_PRIMARY: "bottomPrimary",
  BOTTOM_SECONDARY: "bottomSecondary",
  LEFT_PRIMARY: "leftPrimary",
  LEFT_SECONDARY: "leftSecondary",
  RIGHT_PRIMARY: "rightPrimary",
  RIGHT_SECONDARY: "rightSecondary",
  LEFT_SIDEBAR: "leftSidebar",
  RIGHT_SIDEBAR: "rightSidebar"
} as const;

export type WorkspaceSlot =
  (typeof WORKSPACE_SLOTS)[keyof typeof WORKSPACE_SLOTS];
