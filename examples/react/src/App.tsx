import { useState } from "react";
import { Button, Icon, IconProvider, ThemeProvider, useTheme, type IconSvgProps } from "@itsrighttime/irt-ui";
import { Dropdown, Modal, Switch, Table, TextInput, type TableColumn } from "@itsrighttime/irt-ui/atoms";
import { Workspace } from "@itsrighttime/irt-ui/layout";
import { workspaceLayoutConfig } from "./workspace.config";
import { theme } from "./theme";

/** Custom icon replacing the registry's `close` icon app-wide. */
function BrandClose(props: IconSvgProps) {
  const { size = 20, color = "currentColor", strokeWidth = 2, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} {...rest} data-testid="brand-close">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

interface Row {
  id: number;
  name: string;
  city: string;
}

const rows: Row[] = [
  { id: 1, name: "Asha", city: "Pune" },
  { id: 2, name: "Ravi", city: "Delhi" },
];
const columns: TableColumn<Row>[] = [
  { key: "name", title: "Name", sortable: true },
  { key: "city", title: "City" },
];

function ModeToggle() {
  const { resolvedMode, setMode } = useTheme();
  return (
    <Switch
      label={`Dark mode (${resolvedMode})`}
      value={resolvedMode === "dark"}
      setResult={(dark) => setMode(dark ? "dark" : "light")}
    />
  );
}

export function App() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [fruit, setFruit] = useState<string[]>([]);

  return (
    <ThemeProvider theme={theme}>
      <IconProvider icons={{ close: BrandClose }}>
        <Workspace config={workspaceLayoutConfig} currentPath="/workspace/user/list" height="100vh" width="100%">
          <div style={{ padding: 24, display: "grid", gap: 16, maxWidth: 640 }}>
            <h1>
              <Icon name="home" label="Home" /> irt-ui React example
            </h1>
            <ModeToggle />
            <TextInput label="Name" value={name} setResult={setName} />
            <Dropdown options={["Apple", "Banana"]} placeholder="Fruit" value={fruit} setResult={setFruit} />
            <div style={{ display: "flex", gap: 8 }}>
              <Button onClick={() => setOpen(true)} iconLeft="plus">
                Open modal
              </Button>
              <Button variant="secondary" as="a" href="#table">
                Link button
              </Button>
            </div>
            <div id="table">
              <Table data={rows} columns={columns} rowKey={(r) => r.id} />
            </div>
          </div>
        </Workspace>
        <Modal isOpen={open} onClose={() => setOpen(false)} ariaLabel="Example modal">
          <p>Hello {name || "there"}!</p>
        </Modal>
      </IconProvider>
    </ThemeProvider>
  );
}
