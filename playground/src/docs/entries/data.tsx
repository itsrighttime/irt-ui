import { useState } from "react";
import { Button, DataSnapshotViewer, DataTableWithActions, Table, type TableColumn } from "@itsrighttime/irt-ui/atoms";
import { jsx } from "../jsx";
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
      <span className="pg-badge" data-tone={a.status === "Active" ? "success" : "danger"}>
        {a.status}
      </span>
    ),
  },
  { key: "city", title: "City", render: (a) => a.profile.city },
];

const tableControls: Control[] = [
  { type: "number", name: "pageSize", default: 5, min: 2, max: 12 },
  { type: "boolean", name: "search", default: true },
  { type: "boolean", name: "columnSelector", default: true },
  { type: "boolean", name: "pagination", default: true },
  { type: "boolean", name: "showRowDetails", default: true },
  { type: "boolean", name: "rowActions", default: true },
];

function TableDemo({ v }: { v: ControlValues }) {
  const [log, setLog] = useState("");
  return (
    <div className="pg-stack" style={{ width: "100%" }}>
      <Table<Account>
        data={accounts}
        columns={columns}
        visibleColumns={["name", "email", "role", "status"]}
        rowKey={(a) => a.id}
        pageSize={Number(v.pageSize)}
        showRowDetails={Boolean(v.showRowDetails)}
        controls={{ search: Boolean(v.search), columnSelector: Boolean(v.columnSelector), pagination: Boolean(v.pagination) }}
        rowActions={v.rowActions ? [{ label: "Edit", onClick: (a) => setLog(`Edit ${a.name}`) }] : []}
        caption="Accounts"
      />
      {log && <small className="pg-muted">{log}</small>}
    </div>
  );
}

function ViewerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} iconLeft="fileText">
        Inspect record
      </Button>
      <DataSnapshotViewer data={open ? accounts[0] ?? null : null} title="Account" onClose={() => setOpen(false)} />
    </>
  );
}

export const dataEntries: DocEntry[] = [
  {
    id: "table",
    title: "Table",
    group: "Data",
    description:
      "Data table with search, column picker, pagination, sortable columns, custom cell renderers, row actions and a record drawer. Collapses its toolbar into a menu in narrow containers.",
    imports: 'import { Table, type TableColumn } from "@itsrighttime/irt-ui";',
    controls: tableControls,
    props: [
      { name: "columns", type: "TableColumn<T>[]", description: "`{ key, title, sortable?, render?, compare?, visible? }`" },
      { name: "data", type: "T[]", description: "Rows" },
      { name: "visibleColumns", type: "string[] | null", description: "Keys shown initially" },
      { name: "rowKey", type: "(row, index) => key", description: "Stable React keys" },
      { name: "rowActions", type: "{ label, onClick(row, e) }[]", description: "Action buttons per row" },
      { name: "controls", type: "{ search?, columnSelector?, pagination? }", description: "Toolbar parts", default: "all true" },
      { name: "showRowDetails", type: "boolean", description: "Open the record drawer on cell click", default: "true" },
    ],
    render: (v) => <TableDemo v={v} />,
    code: (v) =>
      jsx("Table<Account>", [
        ["data", "{accounts}"],
        ["columns", "{columns}"],
        ["rowKey", "{(a) => a.id}"],
        ["pageSize", v.pageSize === 10 ? undefined : v.pageSize],
        [
          "controls",
          v.search && v.columnSelector && v.pagination
            ? undefined
            : `{{ search: ${v.search}, columnSelector: ${v.columnSelector}, pagination: ${v.pagination} }}`,
        ],
        ["showRowDetails", v.showRowDetails ? undefined : false],
        ["rowActions", v.rowActions ? '{[{ label: "Edit", onClick: editAccount }]}' : undefined],
      ]),
    notes: (
      <p>
        Columns: <code>{'{ key: "status", title: "Status", sortable: true, render: (a) => <Badge>{a.status}</Badge> }'}</code>
      </p>
    ),
  },
  {
    id: "data-table-with-actions",
    title: "DataTableWithActions",
    group: "Data",
    description: "Table whose row action opens a tabbed Dialog. Open state and active tab can be controlled to sync with the URL.",
    imports: 'import { DataTableWithActions } from "@itsrighttime/irt-ui";',
    render: () => (
      <div style={{ width: "100%" }}>
        <DataTableWithActions<Account>
          data={accounts.slice(0, 6)}
          columns={columns}
          visibleColumns={["name", "role", "status"]}
          pageSize={6}
          actionLabel="Manage"
          dialogTitle="Manage account"
          dialogItems={[
            { key: "activity", icon: "activity", component: <p>Recent activity…</p> },
            { key: "security", icon: "lock", component: <p>Reset password, 2FA…</p> },
          ]}
        />
      </div>
    ),
    code: () =>
      '<DataTableWithActions\n  data={accounts}\n  columns={columns}\n  visibleColumns={["name", "role", "status"]}\n  dialogItems={[{ key: "security", icon: "lock", component: <Security /> }]}\n/>',
  },
  {
    id: "data-snapshot-viewer",
    title: "DataSnapshotViewer",
    group: "Data",
    description: "Side drawer that flattens and lists every field of a record (nested objects become “Profile > city”). ISO date strings are formatted.",
    imports: 'import { DataSnapshotViewer } from "@itsrighttime/irt-ui";',
    render: () => <ViewerDemo />,
    code: () => '<DataSnapshotViewer data={selected} title="Account" onClose={() => setSelected(null)} />',
  },
];
