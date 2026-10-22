import { useRef, useState } from "react";
import { Button, Dialog, DropdownSimple, DynamicPopover, Modal, Popover, Switch, TextInput } from "@itsrighttime/irt-ui/atoms";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const modalControls: Control[] = [
  { type: "text", name: "title", default: "Invite member", group: "Content" },
  { type: "text", name: "description", default: "They will get an email with a sign-up link.", group: "Content" },
  { type: "boolean", name: "footer", default: true, group: "Content" },
  { type: "select", name: "size", default: "sm", options: ["auto", "sm", "md", "lg", "xl", "full"], group: "Appearance", libDefault: "auto" },
  { type: "boolean", name: "showCloseButton", default: true, group: "Behavior" },
  { type: "boolean", name: "closeOnOverlayClick", default: true, group: "Behavior" },
  { type: "boolean", name: "closeOnEscape", default: true, group: "Behavior" },
  { type: "boolean", name: "lockScroll", default: true, group: "Behavior" },
];

function ModalDemo({ v }: { v: ControlValues }) {
  const [open, setOpen] = useState(false);
  const log = useLog();
  const close = (reason: string) => {
    log("onClose", reason);
    setOpen(false);
  };
  return (
    <>
      <Button iconLeft="plus" onClick={() => setOpen(true)}>
        Invite member
      </Button>
      <Modal
        isOpen={open}
        onClose={() => close("close button / Escape / overlay")}
        title={String(v.title) || undefined}
        description={String(v.description) || undefined}
        ariaLabel="Invite member"
        size={v.size as "sm"}
        closeOnOverlayClick={Boolean(v.closeOnOverlayClick)}
        closeOnEscape={Boolean(v.closeOnEscape)}
        showCloseButton={Boolean(v.showCloseButton)}
        lockScroll={Boolean(v.lockScroll)}
        footer={
          v.footer ? (
            <>
              <Button variant="ghost" onClick={() => close("Cancel")}>
                Cancel
              </Button>
              <Button iconLeft="mail" onClick={() => close("Send invite")}>
                Send invite
              </Button>
            </>
          ) : undefined
        }
      >
        <div className="pg-form" style={{ width: "100%" }}>
          <TextInput label="Email" textType="email" iconLeft="mail" width="100%" />
          <Switch label="Grant admin rights" value={false} setResult={() => undefined} width="100%" size="small" spread />
        </div>
      </Modal>
    </>
  );
}

const dialogControls: Control[] = [
  { type: "text", name: "title", default: "Settings", group: "Content" },
  { type: "boolean", name: "showLabels", default: true, libDefault: false, group: "Appearance", hint: "Text next to tab icons" },
  { type: "text", name: "width", default: "", group: "Appearance", placeholder: "min(720px, 100%)" },
  { type: "boolean", name: "footer", default: false, group: "Content" },
  { type: "boolean", name: "closeOnOverlayClick", default: true, group: "Behavior" },
];

function DialogDemo({ v }: { v: ControlValues }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<string | null>("profile");
  const log = useLog();
  return (
    <>
      <Button onClick={() => setOpen(true)} iconLeft="settings">
        Open settings
      </Button>
      <Dialog
        isOpen={open}
        onClose={() => {
          log("onClose");
          setOpen(false);
        }}
        title={String(v.title)}
        showLabels={Boolean(v.showLabels)}
        width={String(v.width) || undefined}
        closeOnOverlayClick={Boolean(v.closeOnOverlayClick)}
        activeKey={tab}
        onActiveKeyChange={(key) => {
          setTab(key);
          log("onActiveKeyChange", key);
        }}
        footer={
          v.footer ? (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          ) : undefined
        }
        items={[
          {
            key: "profile",
            icon: "user",
            component: (
              <div className="pg-form">
                <TextInput label="Display name" value="Ada Lovelace" width="100%" />
                <TextInput label="Email" value="ada@example.com" width="100%" iconLeft="mail" />
              </div>
            ),
          },
          { key: "security", icon: "lock", component: <p>Two-factor authentication and active sessions.</p> },
          { key: "notifications", icon: "bell", component: <p>Choose which emails you receive.</p> },
          { key: "billing", icon: "fileText", label: "Billing", component: <p>Invoices and payment methods.</p>, disabled: true },
        ]}
      />
    </>
  );
}

const popoverControls: Control[] = [
  { type: "number", name: "offset", default: 4, min: 0, max: 24, group: "Layout" },
  { type: "boolean", name: "closeOnOutsideClick", default: true, group: "Behavior" },
  { type: "boolean", name: "closeOnEscape", default: true, group: "Behavior" },
];

function PopoverDemo({ v }: { v: ControlValues }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const log = useLog();
  return (
    <div className="pg-row">
      <div ref={ref} style={{ display: "inline-block" }}>
        <Button variant="secondary" iconRight="chevronDown" onClick={() => setOpen((o) => !o)}>
          Popover
        </Button>
      </div>
      <Popover
        anchorRef={ref}
        isOpen={open}
        offset={Number(v.offset)}
        closeOnOutsideClick={Boolean(v.closeOnOutsideClick)}
        closeOnEscape={Boolean(v.closeOnEscape)}
        onClose={() => {
          log("Popover.onClose");
          setOpen(false);
        }}
        style={{ width: "auto" }}
      >
        <div className="pg-popover">Anchored panel. Closes on outside click or Escape.</div>
      </Popover>
      <div ref={ref2} style={{ display: "inline-block" }}>
        <Button variant="secondary" iconRight="chevronDown" onClick={() => setOpen2((o) => !o)}>
          DynamicPopover
        </Button>
      </div>
      <DynamicPopover
        anchorRef={ref2}
        isOpen={open2}
        offset={Number(v.offset)}
        closeOnOutsideClick={Boolean(v.closeOnOutsideClick)}
        closeOnEscape={Boolean(v.closeOnEscape)}
        onClose={() => {
          log("DynamicPopover.onClose");
          setOpen2(false);
        }}
      >
        {({ placement }) => <div className="pg-popover">Opened {placement === "top" ? "above" : "below"} the anchor.</div>}
      </DynamicPopover>
    </div>
  );
}

function MenuDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const log = useLog();
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <Button variant="secondary" iconRight="chevronDown" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        Actions
      </Button>
      <DropdownSimple
        isOpen={open}
        ariaLabel="Actions"
        onClose={() => setOpen(false)}
        onSelect={(key) => {
          log("onSelect", key);
          setOpen(false);
        }}
        items={[
          { key: "edit", value: "Edit", icon: "edit", description: "⌘E" },
          { key: "duplicate", value: "Duplicate", icon: "copy" },
          { key: "share", value: "Share", icon: "share", box: ["new"] },
          { key: "archive", value: "Archive", icon: "folder", disabled: true },
          { key: "delete", value: "Delete", icon: "trash", danger: true },
        ]}
      />
    </div>
  );
}

export const overlayEntries: DocEntry[] = [
  {
    id: "modal",
    title: "Modal",
    group: "Overlays",
    description:
      "Centered dialog in a portal with a title/description header, footer actions, size presets, focus trap, scroll lock, Escape and overlay-click close (drags that start inside never close it). Inherits the nearest ThemeProvider scope.",
    imports: 'import { Modal } from "@itsrighttime/irt-ui";',
    controls: modalControls,
    render: (v) => <ModalDemo v={v} />,
    code: (v) =>
      jsx(
        "Modal",
        [
          ["isOpen", "{open}"],
          ["onClose", "{() => setOpen(false)}"],
          ...changed(modalControls, v, ["title", "description", "size", "showCloseButton", "closeOnOverlayClick", "closeOnEscape", "lockScroll"]),
          ["footer", v.footer ? '{<><Button variant="ghost">Cancel</Button><Button>Send invite</Button></>}' : undefined],
        ],
        "<InviteForm />",
      ),
  },
  {
    id: "dialog",
    title: "Dialog",
    group: "Overlays",
    description:
      "Modal with a tab strip (icons, optional labels; ←/→/Home/End switch tabs). Tab state is internal or controlled (`activeKey` / `onActiveKeyChange`) — sync it with your router for URL state.",
    imports: 'import { Dialog, type DialogItem } from "@itsrighttime/irt-ui";',
    controls: dialogControls,
    render: (v) => <DialogDemo v={v} />,
    code: (v) =>
      [
        jsx("Dialog", [
          ["isOpen", "{open}"],
          ["onClose", "{() => setOpen(false)}"],
          ["title", v.title],
          ...changed(dialogControls, v, ["showLabels", "width", "closeOnOverlayClick"]),
          ["activeKey", "{tab}"],
          ["onActiveKeyChange", "{setTab}"],
          ["items", "{items}"],
        ]),
        "",
        "const items: DialogItem[] = [",
        '  { key: "profile", icon: "user", component: <Profile /> },',
        '  { key: "security", icon: "lock", component: <Security /> },',
        "];",
      ].join("\n"),
  },
  {
    id: "popover",
    title: "Popover",
    group: "Overlays",
    description:
      "Low-level anchored panel rendered in a portal (`position: fixed`, follows scroll/resize). `DynamicPopover` flips above the anchor when needed and passes the placement to its children.",
    imports: 'import { Popover, DynamicPopover } from "@itsrighttime/irt-ui";',
    components: ["Popover", "DynamicPopover"],
    controls: popoverControls,
    render: (v) => <PopoverDemo v={v} />,
    code: (v) =>
      [
        "const anchorRef = useRef<HTMLDivElement>(null);",
        "",
        "<div ref={anchorRef}><Button onClick={toggle}>Open</Button></div>",
        jsx("Popover", [["anchorRef", "{anchorRef}"], ["isOpen", "{open}"], ["onClose", "{close}"], ...changed(popoverControls, v)], "<Panel />"),
      ].join("\n"),
  },
  {
    id: "dropdown-simple",
    title: "DropdownSimple (menu)",
    group: "Overlays",
    description:
      "Action menu (`role=\"menu\"`) with icons, descriptions, badges, disabled and danger items. ↑/↓/Home/End move, Escape calls `onClose`. Used by TabBar dropdown tabs.",
    imports: 'import { DropdownSimple, type DropdownItem } from "@itsrighttime/irt-ui";',
    components: ["DropdownSimple"],
    render: () => <MenuDemo />,
    code: () =>
      [
        "<DropdownSimple",
        "  isOpen={open}",
        "  onClose={() => setOpen(false)}",
        "  onSelect={handleAction}",
        "  items={[",
        '    { key: "edit", value: "Edit", icon: "edit", description: "⌘E" },',
        '    { key: "share", value: "Share", icon: "share", box: ["new"] },',
        '    { key: "delete", value: "Delete", icon: "trash", danger: true },',
        "  ]}",
        "/>",
      ].join("\n"),
  },
];
