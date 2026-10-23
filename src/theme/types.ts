/** Recursively optional version of `T` (arrays and functions are replaced, not merged). */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends ReadonlyArray<unknown>
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export interface ThemeColors {
  primary: string;
  onPrimary: string;
  primaryHover: string;
  primaryActive: string;
  primarySubtle: string;
  secondary: string;
  onSecondary: string;
  accent: string;
  onAccent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;
  border: string;
  borderMuted: string;
  /** Hover/emphasis border for controls. */
  borderStrong: string;
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
  danger: string;
  onDanger: string;
  info: string;
  onInfo: string;
  disabled: string;
  onDisabled: string;
  hover: string;
  active: string;
  focus: string;
  overlay: string;
  tooltipBackground: string;
  tooltipText: string;
  white: string;
  black: string;
  gray1: string;
  gray2: string;
  gray3: string;
  gray4: string;
  gray5: string;
}

export interface ThemeHeadingStyle {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
}

export interface ThemeTypography {
  fontFamily: {
    base: string;
    heading: string;
    mono: string;
  };
  /** Root size used as the multiplier base by size-scaled components. */
  baseFontSize: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  fontWeight: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
  heading: {
    h1: ThemeHeadingStyle;
    h2: ThemeHeadingStyle;
    h3: ThemeHeadingStyle;
  };
}

export interface ThemeSpacing {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface ThemeRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ThemeBorders {
  width: { thin: string; thick: string };
  style: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  focus: string;
}

export interface ThemeMotion {
  duration: { fast: string; normal: string; slow: string };
  easing: { standard: string; emphasized: string; linear: string };
}

export interface ThemeOpacity {
  disabled: string;
  muted: string;
  overlay: string;
}

export interface ThemeEffects {
  backdropBlur: string;
}

export interface ThemeLayout {
  container: { sm: string; md: string; lg: string; xl: string };
  breakpoints: { sm: string; md: string; lg: string; xl: string };
  gridGap: { sm: string; md: string; lg: string };
  zIndex: {
    base: string;
    dropdown: string;
    sticky: string;
    drawer: string;
    modal: string;
    popover: string;
    toast: string;
    tooltip: string;
  };
  /** Default control dimensions. */
  control: {
    height: { small: string; medium: string; large: string };
    width: string;
  };
  workspace: {
    barSize: string;
    sidebarSize: string;
    tabPadding: string;
  };
}

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "destructive";
export type InputVariant = "outline" | "filled" | "ghost" | "underline";
export type SizeToken = "small" | "medium" | "large";
export type RadiusToken = "none" | "sm" | "md" | "lg";

/** Component-level defaults (JS-side; applied when a prop is not passed). */
export interface ThemeComponentDefaults {
  button: { variant: ButtonVariant; size: SizeToken; radius: RadiusToken };
  input: { variant: InputVariant; size: SizeToken; radius: RadiusToken; width: string };
  tooltip: { delay: number; maxWidth: string };
  alert: { duration: number };
  icon: { size: number; strokeWidth: number };
}

/** The complete, resolved theme. */
export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  motion: ThemeMotion;
  opacity: ThemeOpacity;
  effects: ThemeEffects;
  layout: ThemeLayout;
  components: ThemeComponentDefaults;
}

export type ThemeMode = "light" | "dark";
export type ThemeModePreference = ThemeMode | "system";

/**
 * Consumer theme configuration. Every key is optional and deep-merged over
 * the default theme. `dark` holds overrides applied only in dark mode.
 * Plain JSON with the same shape is valid.
 */
export type ThemeConfig = DeepPartial<Theme> & {
  dark?: DeepPartial<Theme>;
};
