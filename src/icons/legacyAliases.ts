import { isIconName, type IconName } from "./registry";

/**
 * Names used by the original host-app `Icons` object → semantic names.
 * Kept for one major version so existing configs (e.g. workspace
 * `TabConfig.icon: "logoutIcon"`) keep working.
 * @deprecated Use the semantic `IconName` instead.
 */
export const legacyIconAliases = {
  ActivityIcon: "activity",
  BellIcon: "bell",
  DocumentIcon: "fileText",
  LeadIcon: "target",
  LinkIcon: "link",
  MailIcon: "mail",
  arrowDownIcon: "chevronDown",
  arrowLeftIcon: "chevronLeft",
  arrowRightIcon: "chevronRight",
  arrowUpIcon: "chevronUp",
  bellIcon: "bell",
  callIcon: "phone",
  circleThikIcon: "radioOff",
  cirlceFilledIcon: "radioOn",
  crossIcon: "close",
  eyeCrossIcon: "eyeOff",
  eyeIcon: "eye",
  homeIcon: "home",
  imageNotIcon: "imageOff",
  keyIcon: "key",
  linesIcon: "menu",
  lockIcon: "lock",
  logoutIcon: "logout",
  minusIcon: "minus",
  pauseIcon: "pause",
  playIcon: "play",
  plusIcon: "plus",
  profileIcon: "userCircle",
  resetFieldIcon: "refresh",
  searchIcon: "search",
  speakerOffIcon: "volumeOff",
  speakerOnIcon: "volume",
  squareFilledIcon: "checkboxOn",
  squareIcon: "checkboxOff",
  userIcon: "user",
  videoNotIcon: "videoOff",
  warningIcon: "alertTriangle",
  warningTimeIcon: "clockAlert",
  warningWifiIcon: "wifiOff",
} as const satisfies Record<string, IconName>;

/** @deprecated Use `IconName`. */
export type LegacyIconName = keyof typeof legacyIconAliases;

/** Any accepted icon name (semantic or legacy). */
export type IconNameInput = IconName | LegacyIconName;

const isLegacyIconName = (value: string): value is LegacyIconName =>
  Object.prototype.hasOwnProperty.call(legacyIconAliases, value);

/** Maps a semantic or legacy name to the semantic name (`undefined` if unknown). */
export function resolveIconName(name: string): IconName | undefined {
  if (isIconName(name)) return name;
  if (isLegacyIconName(name)) return legacyIconAliases[name];
  return undefined;
}
