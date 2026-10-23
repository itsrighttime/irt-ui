import { useState } from "react";
import { Badge, Button, DataSnapshotViewer, DataTableWithActions, Table, type TableColumn } from "@itsrighttime/irt-ui/atoms";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

interface Account {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  profile: { city: string; team: string };
}

const roles = ["Admin", "Editor", "Viewer"];
const cities = ["Pune", "Delhi", "Bengaluru", "Mumbai", "Chennai"];
const names = ["Asha Rao", "Ravi Kumar", "Meera Iyer", "Kabir Shah", "Ananya Das", "Vikram Singh", "Zara Khan", "Arjun Mehta", "Isha Patel", "Rohan Gupta", "Neha Joshi", "Dev Malhotra"];

export const accounts: Account[] = names.map((name, i) => ({
  id: i + 1,
  name,
  email: `${name.split(" ")[0]?.toLowerCase()}@example.com`,
  role: roles[i % 3] ?? "Viewer",
  status: i % 4 === 0 ? "Suspended" : "Active",
  createdAt: `2026-0${(i % 9) + 1}-1${i % 9}`,
  profile: { city: cities[i % 5] ?? "Pune", team: i % 2 ? "Platform" : "Growth" },
}));

const columns: TableColumn<Account>[] = [
  { key: "name", title: "Name", sortable: true },
  { key: "email", title: "Email" },
  { key: "role", title: "Role", sortable: true },
  {
    key: "status",
    title: "Status",
    sortable: true,
    render: (a) => (
      <Badge tone={a.status === "Active" ? "success" : "danger"} dot>
        {a.status}
      </Badge>
    ),
  },
  { key: "city", title: "City", render: (a) => a.profile.city },
  { key: "id", title: "ID", align: "right", width: "64px", sortable: true },
];

const tableControls: Control[] = [
  { type: "text", name: "title", default: "Accounts", group: "Content" },
  { type: "text", name: "emptyText", default: "No records", libDefault: "No records", group: "Content" },
  { type: "boolean", name: "toolbar", label: "toolbar (Add button)", default: true, group: "Content" },
  { type: "number", name: "pageSize", default: 5, libDefault: 10, min: 2, max: 12, group: "Data" },
  { type: "boolean", name: "empty", label: "no data", default: false, group: "Data" },
  { type: "boolean", name: "search", default: true, group: "controls" },
  { type: "boolean", name: "columnSelector", default: true, group: "controls" },
  { type: "boolean", name: "pagination", default: true, group: "controls" },
  { type: "select", name: "density", default: "comfortable", options: ["comfortable", "compact"], group: "Appearance" },
  { type: "boolean", name: "striped", default: false, group: "Appearance" },
  { type: "boolean", name: "stickyHeader", default: false, group: "Appearance", hint: "Combine with maxHeight" },
  { type: "text", name: "maxHeight", default: "", group: "Appearance", placeholder: "none" },
  { type: "boolean", name: "showRowDetails", default: true, group: "Behavior", hint: "Cell click opens the record drawer" },
  { type: "boolean", name: "rowActions", default: true, group: "Behavior" },
  { type: "boolean", name: "loading", default: false, group: "State" },
];

function TableDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <Table<Account>
      title={String(v.title) || undefined}
      data={v.empty ? [] : accounts}
      columns={columns}
      visibleColumns={["name", "email", "role", "status", "id"]}
      rowKey={(a) => a.id}
      pageSize={Number(v.pageSize)}
      density={v.density as "comfortable"}
      striped={Boolean(v.striped)}
      stickyHeader={Boolean(v.stickyHeader)}
      maxHeight={String(v.maxHeight) || undefined}
      loading={Boolean(v.loading)}
      emptyText={String(v.emptyText)}
      showRowDetails={Boolean(v.showRowDetails)}
      controls={{ search: Boolean(v.search), columnSelector: Boolean(v.columnSelector), pagination: Boolean(v.pagination) }}
      toolbar={
        v.toolbar ? (
          <Button size="small" iconLeft="plus" onClick={() => log("Add account")}>
            Add
          </Button>
        ) : undefined
      }
      onSearch={(q) => log("onSearch", q)}
      onCellClick={(row, column) => log("onCellClick", { row: row.name, column: column.title })}
      rowActions={
        v.rowActions
          ? [
              { label: "Edit", icon: "edit", iconOnly: true, variant: "ghost", onClick: (a) => log("Edit", a.name) },
              { label: "Delete", icon: "trash", iconOnly: true, variant: "danger", onClick: (a) => log("Delete", a.name), disabled: (a) => a.role === "Admin" },
            ]
          : []
      }
      caption="Accounts"
    />
  );
}

function ViewerDemo({ v }: { v: ControlValues }) {
  const [open, setOpen] = useState(false);
  const log = useLog();
  return (
    <>
      <Button onClick={() => setOpen(true)} iconLeft="fileText" variant="secondary">
        Inspect record
      </Button>
      <DataSnapshotViewer
        data={open ? (accounts[0] ?? null) : null}
        title={String(v.title)}
        locale={String(v.locale)}
        onClose={() => {
          log("onClose");
          setOpen(false);
        }}
      />
    </>
  );
}

function DataTableDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <DataTableWithActions<Account>
      data={accounts.slice(0, 6)}
      columns={columns}
      visibleColumns={["name", "role", "status"]}
      pageSize={6}
      actionLabel={String(v.actionLabel)}
      dialogTitle={String(v.dialogTitle)}
      dialogShowLabels={Boolean(v.dialogShowLabels)}
      onDialogOpenChange={(open, row) => log("onDialogOpenChange", { open, row: row?.name })}
      onActiveDialogKeyChange={(key) => log("onActiveDialogKeyChange", key)}
      tableProps={{ title: "Team", density: "compact", showRowDetails: false }}
      dialogItems={[
        { key: "activity", icon: "activity", component: <p>Recent sign-ins and changes.</p> },
        { key: "security", icon: "lock", component: <p>Reset password, two-factor authentication.</p> },
      ]}
    />
  );
}

const dataTableControls: Control[] = [
  { type: "text", name: "actionLabel", default: "Manage", group: "Content" },
  { type: "text", name: "dialogTitle", default: "Manage account", group: "Content" },
  { type: "boolean", name: "dialogShowLabels", default: true, group: "Appearance" },
];

const viewerControls: Control[] = [
  { type: "text", name: "title", default: "Account", group: "Content" },
  { type: "select", name: "locale", default: "en-IN", options: ["en-IN", "en-US", "en-GB", "de-DE"], group: "Locale", hint: "Date formatting" },
];

export const dataEntries: DocEntry[] = [
  {
    id: "table",
    title: "Table",
    group: "Data",
    description:
      "Data table with a toolbar (title, search, column picker, custom actions), sortable columns, alignment/width per column, custom cell renderers, per-row actions (icons, danger, `hidden`/`disabled` rules), a range + pagination footer, loading overlay, sticky header and a record drawer.",
    imports: 'import { Table, type TableColumn } from "@itsrighttime/irt-ui";',
    components: ["Table"],
    controls: tableControls,
    align: "stretch",
    props: [
      { name: "TableColumn", type: "", description: "`{ key, title, sortable?, render?, compare?, visible?, align?, width? }`" },
      { name: "TableAction", type: "", description: "`{ label, onClick(row, e), icon?, iconOnly?, variant?: \"secondary\" | \"ghost\" | \"danger\", hidden?(row), disabled?(row) }`" },
    ],
    render: (v) => <TableDemo v={v} />,
    code: (v) =>
      jsx("Table<Account>", [
        ["data", "{accounts}"],
        ["columns", "{columns}"],
        ["rowKey", "{(a) => a.id}"],
        ...changed(tableControls, v, ["title", "emptyText", "pageSize", "density", "striped", "stickyHeader", "maxHeight", "showRowDetails", "loading"]),
        [
          "controls",
          v.search && v.columnSelector && v.pagination
            ? undefined
            : `{{ search: ${v.search}, columnSelector: ${v.columnSelector}, pagination: ${v.pagination} }}`,
        ],
        ["toolbar", v.toolbar ? '{<Button size="small" iconLeft="plus">Add</Button>}' : undefined],
        ["rowActions", v.rowActions ? '{[{ label: "Edit", icon: "edit", iconOnly: true, onClick: edit }, { label: "Delete", icon: "trash", variant: "danger", onClick: remove }]}' : undefined],
      ]),
    notes: (
      <p>
        Cells render any node — e.g. <code>{'render: (a) => <Badge tone="success" dot>{a.status}</Badge>'}</code>. Clicking a cell opens the record
        drawer unless <code>showRowDetails={"{false}"}</code>.
      </p>
    ),
  },
  {
    id: "data-table-with-actions",
    title: "DataTableWithActions",
    group: "Data",
    description:
      "Table whose row action opens a tabbed Dialog. Open state and active tab can be controlled to sync with the URL; `tableProps` passes any other Table option.",
    imports: 'import { DataTableWithActions } from "@itsrighttime/irt-ui";',
    controls: dataTableControls,
    align: "stretch",
    render: (v) => <DataTableDemo v={v} />,
    code: (v) =>
      jsx("DataTableWithActions", [
        ["data", "{accounts}"],
        ["columns", "{columns}"],
        ["visibleColumns", '{["name", "role", "status"]}'],
        ...changed(dataTableControls, v),
        ["tableProps", '{{ title: "Team", density: "compact" }}'],
        ["dialogItems", '{[{ key: "security", icon: "lock", component: <Security /> }]}'],
      ]),
  },
  {
    id: "data-snapshot-viewer",
    title: "DataSnapshotViewer",
    group: "Data",
    description: "Side drawer that flattens and lists every field of a record (nested objects become “Profile > City”). ISO date strings are formatted with `locale`. Focus-trapped, Escape closes.",
    imports: 'import { DataSnapshotViewer } from "@itsrighttime/irt-ui";',
    controls: viewerControls,
    render: (v) => <ViewerDemo v={v} />,
    code: (v) => jsx("DataSnapshotViewer", [["data", "{selected}"], ...changed(viewerControls, v), ["onClose", "{() => setSelected(null)}"]]),
  },
];
