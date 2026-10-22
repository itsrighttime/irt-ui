export const TAB_TYPE = {
  TEXT: "text",
  ICON: "icon",
  DROPDOWN: "dropdown",
  CUSTOM: "custom",
  LABEL: "label",
  GROUP: "group",
} as const;

export type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];
