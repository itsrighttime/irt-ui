import type { CSSVariables } from "../../../utils/cssVars";

/** Border/colour variables shared by bordered text fields. @internal */
export function getCommonCssVariables(isBorder: boolean, color: string | undefined, width: string | undefined): CSSVariables {
  const accent = color ?? "var(--irt-color-primary)";
  const border = `var(--irt-border-width-thin) solid ${accent}`;
  return {
    "--irt-c-color": accent,
    "--irt-c-border-top": isBorder ? border : "none",
    "--irt-c-border-left": isBorder ? border : "none",
    "--irt-c-border-right": isBorder ? border : "none",
    "--irt-c-border-bottom": isBorder ? border : `var(--irt-border-width-thick) solid ${accent}`,
    "--irt-c-width": width,
    "--irt-c-border-radius": isBorder ? "var(--irt-radius-sm)" : "0px",
  };
}
