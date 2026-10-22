import { Button, IconButton, PlainButton } from "@itsrighttime/irt-ui/atoms";
import type { IconName } from "@itsrighttime/irt-ui/icons";
import { changed, jsx } from "../jsx";
import type { Control, DocEntry } from "../types";

const ICONS = ["none", "plus", "check", "search", "trash", "upload", "chevronRight", "settings", "externalLink"] as const;
const COLORS = ["theme", "var(--irt-color-secondary)", "var(--irt-color-danger)", "var(--irt-color-success)", "#7c3aed"] as const;
const icon = (v: unknown) => (v === "none" ? undefined : (v as IconName));
const color = (v: unknown) => (v === "theme" ? undefined : String(v));

const buttonControls: Control[] = [
  { type: "text", name: "children", label: "label", default: "Save changes" },
  { type: "select", name: "variant", default: "primary", options: ["primary", "secondary", "tertiary", "ghost", "destructive"] },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"] },
  { type: "select", name: "radius", default: "md", options: ["none", "sm", "md", "lg"] },
  { type: "select", name: "iconLeft", default: "none", options: ICONS },
  { type: "select", name: "iconRight", default: "none", options: ICONS },
  { type: "select", name: "color", default: "theme", options: COLORS },
  { type: "boolean", name: "iconOnly", default: false },
  { type: "boolean", name: "block", default: false },
  { type: "boolean", name: "loading", default: false },
  { type: "boolean", name: "disabled", default: false },
  { type: "text", name: "tooltip", default: "" },
];

const iconButtonControls: Control[] = [
  { type: "select", name: "icon", default: "settings", options: ICONS.filter((i) => i !== "none") },
  { type: "text", name: "label", default: "Settings" },
  { type: "number", name: "size", default: 1.5, min: 0.75, max: 3, step: 0.25 },
  { type: "select", name: "color", default: "theme", options: COLORS },
  { type: "boolean", name: "isBorder", default: false },
  { type: "boolean", name: "hoverBackground", default: false },
  { type: "boolean", name: "disabled", default: false },
];

const plainControls: Control[] = [
  { type: "text", name: "children", label: "label", default: "Forgot password?" },
  { type: "number", name: "fontSize", default: 1, min: 0.75, max: 2, step: 0.125 },
  { type: "select", name: "fontWeight", default: "400", options: ["400", "500", "600", "700"] },
  { type: "boolean", name: "isUnderline", default: false },
  { type: "boolean", name: "disabled", default: false },
];

export const actionEntries: DocEntry[] = [
  {
    id: "button",
    title: "Button",
    group: "Actions",
    description:
      "Polymorphic button with five variants, three sizes, icons, loading and tooltip. Render it as a link or router component with `as`. Defaults come from `theme.components.button`.",
    imports: 'import { Button } from "@itsrighttime/irt-ui";',
    controls: buttonControls,
    props: [
      { name: "variant", type: '"primary" | "secondary" | "tertiary" | "ghost" | "destructive"', description: "Visual style", default: "theme" },
      { name: "size", type: '"small" | "medium" | "large"', description: "Padding and font size", default: "theme" },
      { name: "iconLeft / iconRight", type: "IconName | ReactNode", description: "Icon by registry name or any node" },
      { name: "iconOnly", type: "boolean", description: "Square icon button — give it `ariaLabel` or `tooltip`" },
      { name: "loading", type: "boolean", description: "Spinner, `aria-busy`, blocks clicks" },
      { name: "as", type: "ElementType", description: 'Render as `"a"`, `Link`, …; its props are typed' },
      { name: "color / width / height", type: "string", description: "Accent colour and dimensions" },
    ],
    render: (v) => (
      <Button
        variant={v.variant as "primary"}
        size={v.size as "medium"}
        radius={v.radius as "md"}
        iconLeft={icon(v.iconLeft)}
        iconRight={icon(v.iconRight)}
        color={color(v.color)}
        iconOnly={Boolean(v.iconOnly)}
        block={Boolean(v.block)}
        loading={Boolean(v.loading)}
        disabled={Boolean(v.disabled)}
        tooltip={String(v.tooltip) || undefined}
        ariaLabel={v.iconOnly ? String(v.children) : undefined}
      >
        {String(v.children)}
      </Button>
    ),
    code: (v) =>
      jsx(
        "Button",
        [
          ...changed(buttonControls, v, ["variant", "size", "radius", "iconLeft", "iconRight", "color", "iconOnly", "block", "loading", "disabled", "tooltip"]),
          ["onClick", "{save}"],
        ],
        String(v.children),
      ),
    notes: (
      <>
        <p>Links and router components keep full typing:</p>
        <div className="pg-row">
          <Button as="a" href="#/components/icon-button" variant="secondary" iconRight="chevronRight">
            Next: IconButton
          </Button>
          <Button variant="destructive" iconLeft="trash">
            Delete
          </Button>
          <Button variant="ghost" iconLeft="settings" iconOnly ariaLabel="Settings" tooltip="Settings" />
        </div>
      </>
    ),
  },
  {
    id: "icon-button",
    title: "IconButton",
    group: "Actions",
    description: "Compact icon-only button. `label` is the accessible name and is shown as a tooltip. Also accepts an image URL as `icon`.",
    imports: 'import { IconButton } from "@itsrighttime/irt-ui";',
    controls: iconButtonControls,
    props: [
      { name: "icon", type: "IconName | ReactNode | image URL", description: "What to show" },
      { name: "label", type: "string", description: "Accessible name + tooltip" },
      { name: "size", type: "number", description: "Multiple of the base font size", default: "1" },
      { name: "isBorder / hoverBackground", type: "boolean", description: "Border in the icon colour / filled hover" },
    ],
    render: (v) => (
      <IconButton
        icon={v.icon as IconName}
        label={String(v.label) || null}
        size={Number(v.size)}
        color={color(v.color)}
        isBorder={Boolean(v.isBorder)}
        hoverBackground={Boolean(v.hoverBackground)}
        disabled={Boolean(v.disabled)}
      />
    ),
    code: (v) =>
      jsx("IconButton", [
        ["icon", v.icon],
        ...changed(iconButtonControls, v, ["label", "size", "color", "isBorder", "hoverBackground", "disabled"]),
        ["onClick", "{openSettings}"],
      ]),
  },
  {
    id: "plain-button",
    title: "PlainButton",
    group: "Actions",
    description: "Text-only, link-style button for low-emphasis actions. Server-component safe.",
    imports: 'import { PlainButton } from "@itsrighttime/irt-ui";',
    controls: plainControls,
    render: (v) => (
      <PlainButton fontSize={Number(v.fontSize)} fontWeight={Number(v.fontWeight)} isUnderline={Boolean(v.isUnderline)} disabled={Boolean(v.disabled)}>
        {String(v.children)}
      </PlainButton>
    ),
    code: (v) => jsx("PlainButton", [...changed(plainControls, v, ["fontSize", "isUnderline", "disabled"]), ["fontWeight", v.fontWeight === "400" ? undefined : Number(v.fontWeight)], ["onClick", "{reset}"]], String(v.children)),
  },
];
