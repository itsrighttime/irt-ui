/**
 * @itsrighttime/irt-ui — theme-configurable React UI library.
 *
 * Import the stylesheet once in your app: `import "@itsrighttime/irt-ui/styles.css";`
 */
import "./styles/index.css";

export * from "./components";
export * from "./theme";
export * from "./icons";
export * from "./hooks";
export { cssVars, cx, mergeRefs, fromKebabCase, canUseDOM, type CSSVariables, type KebabCaseFormat } from "./utils";
export type { BaseProps, OmitProp, ComponentSize, ComponentRadius } from "./types";
