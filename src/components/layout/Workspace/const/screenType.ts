export const ScreenType = {
  MAGIC_SCREEN: "magicScreen",
  FULL_SCREEN: "fullScreen",
  LOGOUT_SCREEN: "logoutScreen",
} as const;

export type ScreenTypeValue = (typeof ScreenType)[keyof typeof ScreenType];
