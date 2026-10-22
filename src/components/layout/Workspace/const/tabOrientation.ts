export const TAB_ORIENTATION = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;

export type TabOrientation =
  (typeof TAB_ORIENTATION)[keyof typeof TAB_ORIENTATION];
