import { Button, IconButton, PlainButton } from "@itsrighttime/irt-ui/atoms";
import type { IconName } from "@itsrighttime/irt-ui/icons";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const ICONS = ["none", "plus", "check", "search", "trash", "upload", "download", "edit", "chevronRight", "settings", "externalLink"] as const;
const COLORS = ["theme", "var(--irt-color-secondary)", "var(--irt-color-danger)", "var(--irt-color-success)", "#7c3aed"] as const;
const icon = (v: unknown) => (v === "none" ? undefined : (v as IconName));
const color = (v: unknown) => (v === "theme" ? undefined : String(v));

const buttonControls: Control[] = [
  { type: "text", name: "children", label: "children", default: "Save changes", group: "Content" },
  { type: "select", name: "iconLeft", default: "none", options: ICONS, group: "Content" },
  { type: "select", name: "iconRight", default: "none", options: ICONS, group: "Content" },
  { type: "text", name: "tooltip", default: "", group: "Content", hint: "Shown on hover and focus" },
  { type: "select", name: "variant", default: "primary", options: ["primary", "secondary", "tertiary", "ghost", "destructive"], group: "Appearance" },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"], group: "Appearance" },
  { type: "select", name: "radius", default: "md", options: ["none", "sm", "md", "lg"], group: "Appearance" },
  { type: "select", name: "color", default: "theme", options: COLORS, group: "Appearance" },
  { type: "boolean", name: "iconOnly", default: false, group: "Layout" },
  { type: "boolean", name: "block", default: false, group: "Layout", hint: "Stretch to the container width" },
  { type: "text", name: "width", default: "", group: "Layout", placeholder: "auto" },
  { type: "boolean", name: "loading", default: false, group: "State" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function ButtonDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <Button
      variant={v.variant as "primary"}
      size={v.size as "medium"}
      radius={v.radius as "md"}
      iconLeft={icon(v.iconLeft)}
      iconRight={icon(v.iconRight)}
      color={color(v.color)}
      iconOnly={Boolean(v.iconOnly)}
      block={Boolean(v.block)}
      width={String(v.width) || undefined}
      loading={Boolean(v.loading)}
      disabled={Boolean(v.disabled)}
      tooltip={String(v.tooltip) || undefined}
      ariaLabel={v.iconOnly ? String(v.children) : undefined}
      onClick={() => log("onClick", "MouseEvent")}
    >
      {String(v.children)}
    </Button>
  );
}

const iconButtonControls: Control[] = [
  { type: "select", name: "icon", default: "settings", options: ICONS.filter((i) => i !== "none"), group: "Content" },
  { type: "text", name: "label", default: "Settings", group: "Content", hint: "Accessible name and tooltip" },
  { type: "select", name: "variant", default: "ghost", options: ["ghost", "soft", "solid", "outline", "plain"], group: "Appearance" },
  { type: "select", name: "shape", default: "rounded", options: ["rounded", "circle", "square"], group: "Appearance" },
  { type: "number", name: "size", default: 1.25, libDefault: 1, min: 0.75, max: 3, step: 0.25, group: "Appearance" },
  { type: "select", name: "color", default: "theme", options: COLORS, group: "Appearance" },
  { type: "boolean", name: "active", default: false, group: "State", hint: "Sets aria-pressed" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
  { type: "boolean", name: "hoverBackground", default: false, group: "Legacy", hint: "Fill with the colour on hover" },
];

function IconButtonDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <IconButton
      icon={v.icon as IconName}
      label={String(v.label) || null}
      variant={v.variant as "ghost"}
      shape={v.shape as "rounded"}
      size={Number(v.size)}
      color={color(v.color)}
      active={v.active ? true : undefined}
      hoverBackground={Boolean(v.hoverBackground)}
      disabled={Boolean(v.disabled)}
      onClick={() => log("onClick", "MouseEvent")}
    />
  );
}

const plainControls: Control[] = [
  { type: "text", name: "children", label: "children", default: "Forgot password?", group: "Content" },
  { type: "select", name: "iconLeft", default: "none", options: ICONS, group: "Content" },
  { type: "select", name: "iconRight", default: "none", options: ICONS, group: "Content" },
  { type: "number", name: "fontSize", default: 1, min: 0.75, max: 2, step: 0.125, group: "Appearance" },
  { type: "select", name: "fontWeight", default: "400", options: ["400", "500", "600", "700"], group: "Appearance" },
  { type: "select", name: "color", default: "theme", options: COLORS, group: "Appearance" },
  { type: "boolean", name: "isUnderline", default: false, group: "Appearance" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function PlainButtonDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <PlainButton
      fontSize={Number(v.fontSize)}
      fontWeight={Number(v.fontWeight)}
      isUnderline={Boolean(v.isUnderline)}
      disabled={Boolean(v.disabled)}
      color={color(v.color)}
      iconLeft={icon(v.iconLeft)}
      iconRight={icon(v.iconRight)}
      onClick={() => log("onClick", "MouseEvent")}
    >
      {String(v.children)}
    </PlainButton>
  );
}

export const actionEntries: DocEntry[] = [
  {
    id: "button",
    title: "Button",
    group: "Actions",
    description:
      "Polymorphic button with five variants, three sizes, icons, loading and tooltip. Render it as a link or router component with `as`. Defaults come from `theme.components.button`; heights follow `theme.layout.control.height`.",
    imports: 'import { Button } from "@itsrighttime/irt-ui";',
    controls: buttonControls,
    render: (v) => <ButtonDemo v={v} />,
    code: (v) =>
      jsx(
        "Button",
        [
          ...changed(buttonControls, v, ["variant", "size", "radius", "iconLeft", "iconRight", "color", "iconOnly", "block", "width", "loading", "disabled", "tooltip"]),
          ["onClick", "{save}"],
        ],
        String(v.children),
      ),
    examples: [
      {
        title: "Variants",
        description: "One primary action per view; `secondary` and `ghost` for the rest.",
        render: () => (
          <>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="destructive">Delete</Button>
          </>
        ),
        code: '<Button>Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="tertiary">Tertiary</Button>\n<Button variant="destructive">Delete</Button>',
      },
      {
        title: "Sizes",
        description: "Heights match inputs of the same size (32 / 40 / 48 px by default).",
        render: () => (
          <>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </>
        ),
        code: '<Button size="small">Small</Button>\n<Button size="medium">Medium</Button>\n<Button size="large">Large</Button>',
      },
      {
        title: "With icons",
        render: () => (
          <>
            <Button iconLeft="plus">New project</Button>
            <Button variant="secondary" iconRight="chevronRight">
              Continue
            </Button>
            <Button variant="ghost" iconLeft="download">
              Export
            </Button>
          </>
        ),
        code: '<Button iconLeft="plus">New project</Button>\n<Button variant="secondary" iconRight="chevronRight">Continue</Button>\n<Button variant="ghost" iconLeft="download">Export</Button>',
      },
      {
        title: "Icon only",
        description: "Always give icon-only buttons an `ariaLabel` or `tooltip`.",
        render: () => (
          <>
            <Button iconOnly iconLeft="plus" ariaLabel="Add" tooltip="Add" size="small" />
            <Button iconOnly iconLeft="edit" ariaLabel="Edit" tooltip="Edit" variant="secondary" />
            <Button iconOnly iconLeft="trash" ariaLabel="Delete" tooltip="Delete" variant="ghost" size="large" />
          </>
        ),
        code: '<Button iconOnly iconLeft="plus" ariaLabel="Add" tooltip="Add" size="small" />\n<Button iconOnly iconLeft="edit" ariaLabel="Edit" tooltip="Edit" variant="secondary" />',
      },
      {
        title: "States",
        render: () => (
          <>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" loading>
              Loading
            </Button>
          </>
        ),
        code: "<Button loading>Saving</Button>\n<Button disabled>Disabled</Button>",
      },
      {
        title: "As a link",
        description: "`as` renders any element or router `Link`, with its props typed.",
        render: () => (
          <Button as="a" href="#/components/icon-button" variant="secondary" iconRight="externalLink">
            Open IconButton docs
          </Button>
        ),
        code: '<Button as="a" href="/docs" variant="secondary" iconRight="externalLink">Docs</Button>\n// Next.js: <Button as={Link} href="/settings">Settings</Button>',
      },
    ],
  },
  {
    id: "icon-button",
    title: "IconButton",
    group: "Actions",
    description:
      "Compact icon-only button for toolbars and rows. `label` is the accessible name and the tooltip. Five variants (`ghost` default), three shapes and an `active` (pressed) state. Also accepts an image URL as `icon`.",
    imports: 'import { IconButton } from "@itsrighttime/irt-ui";',
    controls: iconButtonControls,
    render: (v) => <IconButtonDemo v={v} />,
    code: (v) =>
      jsx("IconButton", [
        ["icon", v.icon],
        ...changed(iconButtonControls, v, ["label", "variant", "shape", "size", "color", "active", "disabled", "hoverBackground"]),
        ["onClick", "{openSettings}"],
      ]),
    examples: [
      {
        title: "Variants",
        render: () => (
          <>
            {(["ghost", "soft", "solid", "outline", "plain"] as const).map((variant) => (
              <IconButton key={variant} icon="bell" label={variant} variant={variant} />
            ))}
          </>
        ),
        code: '<IconButton icon="bell" label="Notifications" />            // ghost\n<IconButton icon="bell" label="Notifications" variant="soft" />\n<IconButton icon="bell" label="Notifications" variant="solid" />\n<IconButton icon="bell" label="Notifications" variant="outline" />',
      },
      {
        title: "Shapes and colours",
        render: () => (
          <>
            <IconButton icon="heart" label="Like" variant="soft" shape="circle" color="var(--irt-color-danger)" />
            <IconButton icon="star" label="Favourite" variant="soft" shape="circle" color="var(--irt-color-warning)" />
            <IconButton icon="check" label="Approve" variant="solid" shape="circle" color="var(--irt-color-success)" />
            <IconButton icon="settings" label="Settings" variant="outline" shape="square" />
          </>
        ),
        code: '<IconButton icon="heart" label="Like" variant="soft" shape="circle" color="var(--irt-color-danger)" />',
      },
      {
        title: "Toolbar with an active tool",
        description: "`active` sets `aria-pressed` and a persistent tint.",
        render: () => (
          <div className="pg-toolbar-demo" role="toolbar" aria-label="Formatting">
            <IconButton icon="edit" label="Draw" active color="var(--irt-color-primary)" />
            <IconButton icon="image" label="Image" color="var(--irt-color-text-muted)" />
            <IconButton icon="link" label="Link" color="var(--irt-color-text-muted)" />
            <IconButton icon="trash" label="Clear" color="var(--irt-color-text-muted)" disabled />
          </div>
        ),
        code: '<IconButton icon="edit" label="Draw" active />\n<IconButton icon="image" label="Image" color="var(--irt-color-text-muted)" />',
      },
    ],
  },
  {
    id: "plain-button",
    title: "PlainButton",
    group: "Actions",
    description: "Text-only, link-style button for low-emphasis actions (\"Forgot password?\", \"Show more\"). Optional icons. Server-component safe.",
    imports: 'import { PlainButton } from "@itsrighttime/irt-ui";',
    controls: plainControls,
    render: (v) => <PlainButtonDemo v={v} />,
    code: (v) =>
      jsx(
        "PlainButton",
        [
          ...changed(plainControls, v, ["iconLeft", "iconRight", "fontSize", "color", "isUnderline", "disabled"]),
          ["fontWeight", v.fontWeight === "400" ? undefined : Number(v.fontWeight)],
          ["onClick", "{reset}"],
        ],
        String(v.children),
      ),
  },
];
