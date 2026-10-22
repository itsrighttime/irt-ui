export { Icon, type IconProps } from "./Icon";
export { IconProvider, type IconProviderProps } from "./IconProvider";
export { IconContext, type IconContextValue } from "./IconContext";
export {
  iconRegistry,
  iconNames,
  isIconName,
  type IconName,
  type IconOverrides,
} from "./registry";
export {
  legacyIconAliases,
  resolveIconName,
  type LegacyIconName,
  type IconNameInput,
} from "./legacyAliases";
export type { IconComponent, IconSvgProps } from "./types";
export { renderIcon, isIconNameInput, type IconLike } from "./renderIcon";
