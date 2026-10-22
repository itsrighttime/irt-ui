import { useRef, useState } from "react";
import { Button, Dialog, DropdownSimple, DynamicPopover, Modal, Popover, TextInput } from "@itsrighttime/irt-ui/atoms";
import type { ControlValues, DocEntry } from "../types";

function ModalDemo({ v }: { v: ControlValues }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        ariaLabel="Invite member"
        closeOnOverlayClick={Boolean(v.closeOnOverlayClick)}
        showCloseButton={Boolean(v.showCloseButton)}
      >
        <div className="pg-stack" style={{ minWidth: 320 }}>
          <h3 style={{ margin: 0 }}>Invite member</h3>
          <TextInput label="Email" textType="email" width="100%" />
          <div className="pg-row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send invite</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<string | null>("profile");
  return (
    <>
      <Button onClick={() => setOpen(true)} iconLeft="settings">
        Open settings
      </Button>
      <span className="pg-muted">active tab: {tab}</span>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Settings"
        activeKey={tab}
        onActiveKeyChange={setTab}
        items={[
          { key: "profile", icon: "user", component: <p>Profile settings…</p> },
          { key: "security", icon: "lock", component: <p>Security settings…</p> },
          { key: "notifications", icon: "bell", component: <p>Notification preferences…</p> },
        ]}
      />
    </>
  );
}

function PopoverDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  return (
    <div className="pg-row">
      <div ref={ref} style={{ display: "inline-block" }}>
        <Button variant="secondary" onClick={() => setOpen((o) => !o)}>
          Popover
        </Button>
      </div>
      <Popover anchorRef={ref} isOpen={open} onClose={() => setOpen(false)} style={{ width: "auto" }}>
        <div className="pg-popover">Anchored panel. Closes on outside click or Escape.</div>
      </Popover>
      <div ref={ref2} style={{ display: "inline-block" }}>
        <Button variant="secondary" onClick={() => setOpen2((o) => !o)}>
          DynamicPopover
        </Button>
      </div>
      <DynamicPopover anchorRef={ref2} isOpen={open2} onClose={() => setOpen2(false)}>
        {({ placement }) => <div className="pg-popover">Opened {placement === "top" ? "above" : "below"} the anchor.</div>}
      </DynamicPopover>
    </div>
  );
}

function MenuDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | number>("");
  return (
    <div className="pg-row">
      <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
        <Button variant="secondary" iconRight="chevronDown" onClick={() => setOpen((o) => !o)}>
          Actions
        </Button>
        <DropdownSimple
          isOpen={open}
          ariaLabel="Actions"
          onSelect={(key) => {
            setPicked(key);
            setOpen(false);
          }}
          items={[
            { key: "edit", value: "Edit", description: "⌘E" },
            { key: "duplicate", value: "Duplicate" },
            { key: "share", value: "Share", box: ["new"] },
            { key: "archive", value: "Archive", disabled: true },
          ]}
        />
      </div>
      <span className="pg-muted">selected: {String(picked)}</span>
    </div>
  );
}

export const overlayEntries: DocEntry[] = [
  {
    id: "modal",
    title: "Modal",
    group: "Overlays",
    description: "Centered dialog in a portal with focus trap, Escape and overlay-click close. Inherits the nearest ThemeProvider scope.",
    imports: 'import { Modal } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "boolean", name: "closeOnOverlayClick", default: true },
      { type: "boolean", name: "showCloseButton", default: true },
    ],
    render: (v) => <ModalDemo v={v} />,
    code: () => '<Modal isOpen={open} onClose={() => setOpen(false)} ariaLabel="Invite member">\n  <InviteForm />\n</Modal>',
  },
  {
    id: "dialog",
    title: "Dialog",
    group: "Overlays",
    description: "Modal with an icon tab bar. Tab state is internal or controlled (`activeKey` / `onActiveKeyChange`) — sync it with your router if you want URL state.",
    imports: 'import { Dialog, type DialogItem } from "@itsrighttime/irt-ui";',
    render: () => <DialogDemo />,
    code: () =>
      [
        "<Dialog",
        "  isOpen={open}",
        "  onClose={() => setOpen(false)}",
        '  title="Settings"',
        "  activeKey={tab}",
        "  onActiveKeyChange={setTab}",
        "  items={[",
        '    { key: "profile", icon: "user", component: <Profile /> },',
        '    { key: "security", icon: "lock", component: <Security /> },',
        "  ]}",
        "/>",
      ].join("\n"),
  },
  {
    id: "popover",
    title: "Popover",
    group: "Overlays",
    description: "Low-level anchored panel rendered in a portal. `DynamicPopover` flips above the anchor when needed and tells children the placement.",
    imports: 'import { Popover, DynamicPopover } from "@itsrighttime/irt-ui";',
    render: () => <PopoverDemo />,
    code: () =>
      "const anchorRef = useRef<HTMLDivElement>(null);\n\n<div ref={anchorRef}><Button onClick={toggle}>Open</Button></div>\n<Popover anchorRef={anchorRef} isOpen={open} onClose={close}>\n  <Panel />\n</Popover>",
  },
  {
    id: "dropdown-menu",
    title: "DropdownSimple (menu)",
    group: "Overlays",
    description: "Action menu (`role=\"menu\"`, arrow-key navigation) with descriptions and badges. Used by TabBar dropdown tabs.",
    imports: 'import { DropdownSimple, type DropdownItem } from "@itsrighttime/irt-ui";',
    render: () => <MenuDemo />,
    code: () => '<DropdownSimple isOpen={open} items={[{ key: "edit", value: "Edit" }, "Delete"]} onSelect={handleAction} />',
  },
];
