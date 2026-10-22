import { defaultDarkOverrides, defaultTheme } from "./defaultTheme";
import type { Theme } from "./types";
import { cssVarsToDeclarations, deepMerge, themeToCssVars } from "./resolveTheme";

const indent = (vars: Record<string, string>) =>
  cssVarsToDeclarations(vars).replace(/;/g, ";\n  ").trimEnd();

/**
 * Builds the static `styles/tokens.css` content: default light tokens on
 * `:root` plus dark tokens for `[data-irt-mode="dark"]` so components are
 * fully styled even without a ThemeProvider.
 */
export function generateTokensCss(): string {
  const light = themeToCssVars(defaultTheme);
  const darkAll = themeToCssVars(deepMerge<Theme>(defaultTheme, defaultDarkOverrides));
  const dark: Record<string, string> = {};
  for (const [k, v] of Object.entries(darkAll)) if (light[k] !== v) dark[k] = v;

  return [
    "/* AUTO-GENERATED from src/theme — do not edit. Run: npm run tokens */",
    `:root {\n  ${indent(light)}\n}`,
    `[data-irt-mode="dark"] {\n  ${indent(dark)}\n  color-scheme: dark;\n}`,
    "",
  ].join("\n");
}
