import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "./Table";
import { DataTableWithActions } from "./DataTableWithActions";
import type { TableColumn } from "./table.type";
import { DataSnapshotViewer, flattenObject } from "../DataSnapshotViewer/DataSnapshotViewer";

interface User {
  id: number;
  name: string;
  age: number;
  meta: { city: string };
}

const users: User[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `User ${String(i + 1).padStart(2, "0")}`,
  age: 20 + ((i * 7) % 15),
  meta: { city: i % 2 ? "Pune" : "Delhi" },
}));

const columns: TableColumn<User>[] = [
  { key: "name", title: "Name", sortable: true },
  { key: "age", title: "Age", sortable: true },
  { key: "city", title: "City", render: (u) => u.meta.city },
];

const bodyRows = () => within(screen.getAllByRole("rowgroup")[1] as HTMLElement).getAllByRole("row");

describe("Table", () => {
  it("paginates", async () => {
    render(<Table data={users} columns={columns} pageSize={5} rowKey={(u) => u.id} controls={{ columnSelector: false }} />);
    expect(bodyRows()).toHaveLength(5);
    expect(screen.getAllByText("1 / 3")[0]).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: "Next page" })[0] as HTMLElement);
    expect(screen.getAllByText("2 / 3")[0]).toBeInTheDocument();
  });

  it("searches visible columns and resets to page 1", () => {
    render(<Table data={users} columns={columns} pageSize={5} controls={{ columnSelector: false }} />);
    fireEvent.change(screen.getAllByRole("textbox", { name: "Search table" })[0] as HTMLElement, { target: { value: "User 1" } });
    expect(bodyRows()).toHaveLength(3);
  });

  it("sorts sortable columns with aria-sort", async () => {
    render(<Table data={users} columns={columns} pageSize={20} controls={{ search: false, columnSelector: false, pagination: false }} />);
    const ageHeader = screen.getByRole("columnheader", { name: /Age/ });
    await userEvent.click(within(ageHeader).getByRole("button"));
    expect(ageHeader).toHaveAttribute("aria-sort", "ascending");
    const firstAge = within(bodyRows()[0] as HTMLElement).getAllByRole("cell")[1];
    expect(firstAge).toHaveTextContent("20");
    await userEvent.click(within(ageHeader).getByRole("button"));
    expect(ageHeader).toHaveAttribute("aria-sort", "descending");
  });

  it("hides columns not in visibleColumns", () => {
    render(<Table data={users} columns={columns} visibleColumns={["name"]} controls={{ search: false, columnSelector: false, pagination: false }} />);
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Name"]);
  });

  it("opens the record drawer on cell click and runs row actions", async () => {
    const onAction = vi.fn();
    render(
      <Table
        data={users.slice(0, 1)}
        columns={columns}
        rowActions={[{ label: "Edit", onClick: onAction }]}
        controls={{ search: false, columnSelector: false, pagination: false }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onAction).toHaveBeenCalledWith(users[0], expect.anything());
    await userEvent.click(screen.getByText("User 01"));
    const dialog = screen.getByRole("dialog", { name: "Record Details" });
    expect(within(dialog).getByText("Meta > city")).toBeInTheDocument();
  });

  it("shows an empty state", () => {
    render(<Table data={[] as User[]} columns={columns} controls={{ search: false, columnSelector: false, pagination: false }} />);
    expect(screen.getByText("No records")).toBeInTheDocument();
  });
});

describe("DataTableWithActions", () => {
  it("opens the dialog from the row action without a router", async () => {
    render(
      <DataTableWithActions
        data={users.slice(0, 2)}
        columns={columns}
        visibleColumns={["name"]}
        dialogItems={[{ key: "profile", icon: "user", component: <p>Profile tab</p> }]}
      />,
    );
    await userEvent.click(screen.getAllByRole("button", { name: "Open Dialog" })[0] as HTMLElement);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Profile tab")).toBeInTheDocument();
  });
});

describe("DataSnapshotViewer", () => {
  it("flattens nested data and only treats ISO strings as dates", () => {
    expect(flattenObject({ a: { b: 1 }, list: [1, 2], objs: [{ x: 1 }] })).toEqual({ "a.b": 1, list: [1, 2], "objs[0].x": 1 });
    render(<DataSnapshotViewer data={{ code: "5", created: "2026-01-02" }} onClose={() => undefined} locale="en-US" />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("2026-01-02")).toBeNull();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<DataSnapshotViewer data={{ a: 1 }} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
