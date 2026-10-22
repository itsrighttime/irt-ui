import type { ReactNode } from "react";
import { Icon, type IconProps } from "./Icon";
import { resolveIconName, type IconNameInput } from "./legacyAliases";

/** Something that can be shown as an icon: a registry name or any React node. */
export type IconLike = IconNameInput | ReactNode;

export const isIconNameInput = (value: unknown): value is IconNameInput =>
  typeof value === "string" && resolveIconName(value) !== undefined;

/**
 * Normalises an `IconLike` prop: names render `<Icon>`, nodes pass through.
 * Lets components accept both `icon="close"` and `icon={<MySvg />}`.
 */
export function renderIcon(icon: IconLike, props?: Omit<IconProps, "name">): ReactNode {
  if (isIconNameInput(icon)) return <Icon name={icon} {...props} />;
  return icon;
}
