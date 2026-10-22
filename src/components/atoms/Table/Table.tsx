"use client";

import { useEffect, useMemo, useState } from "react";
import { DataSnapshotViewer } from "../DataSnapshotViewer/DataSnapshotViewer";
import styles from "./Table.module.css";
import { TableBody } from "./TableBody";
import { TableControls } from "./TableControls";
import { TableHeader } from "./TableHeader";
import type { SortDirection, TableColumn, TableProps } from "./table.type";

export type { TableProps, TableColumn, TableAction, TableControlsConfig, SortDirection } from "./table.type";

const cellValue = <T extends object>(row: T, key: TableColumn<T>["key"]): unknown =>
  (row as Record<PropertyKey, unknown>)[key as PropertyKey];

const defaultCompare = (a: unknown, b: unknown): number => {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

/** Data table with search, column picker, pagination, sorting, row actions and a record drawer. */
export function Table<T extends object>({
  columns,
  visibleColumns: initialVisible = null,
  data,
  rowActions = [],
  onCellClick,
  pageSize = 10,
  onSearch,
  controls,
  rowKey,
  showRowDetails = true,
  caption,
  emptyText = "No records",
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null);
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      columns.map((col) => [
        String(col.key),
        initialVisible ? initialVisible.includes(String(col.key)) : col.visible !== false,
      ]),
    ),
  );

  const allColumns = useMemo(
    () => columns.map((col) => ({ ...col, visible: visibility[String(col.key)] ?? col.visible !== false })),
    [columns, visibility],
  );
  const shownColumns = useMemo(() => allColumns.filter((col) => col.visible !== false), [allColumns]);

  const toggleColumn = (key: string) => setVisibility((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));

  const filtered = useMemo(() => {
    if (!searchTerm) return data;
    const needle = searchTerm.toLowerCase();
    return data.filter((row) =>
      shownColumns.some((col) => {
        const value = cellValue(row, col.key);
        return value !== null && value !== undefined && String(value).toLowerCase().includes(needle);
      }),
    );
  }, [data, searchTerm, shownColumns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((col) => String(col.key) === sort.key);
    if (!column) return filtered;
    const factor = sort.direction === "asc" ? 1 : -1;
    const compare = column.compare ?? ((a: T, b: T) => defaultCompare(cellValue(a, column.key), cellValue(b, column.key)));
    return [...filtered].sort((a, b) => compare(a, b) * factor);
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const cfg = {
    search: controls?.search ?? true,
    columnSelector: controls?.columnSelector ?? true,
    pagination: controls?.pagination ?? true,
  };

  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev?.key !== key ? { key, direction: "asc" } : prev.direction === "asc" ? { key, direction: "desc" } : null,
    );

  const clickable = showRowDetails || Boolean(onCellClick);

  return (
    <div className={styles.tableWrapper}>
      {(cfg.search || cfg.columnSelector || cfg.pagination) && (
        <TableControls<T>
          columns={allColumns}
          onColumnToggle={toggleColumn}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onSearch={(value: string) => {
            setSearchTerm(value);
            setCurrentPage(1);
            onSearch?.(value);
          }}
          showSearch={cfg.search}
          showColumnSelector={cfg.columnSelector}
          showPagination={cfg.pagination}
        />
      )}

      <table className={`${styles.table} ${clickable ? styles.clickable : ""}`}>
        {caption && <caption className="irt-visually-hidden">{caption}</caption>}
        <TableHeader<T> columns={shownColumns} actions={rowActions.length > 0} sort={sort} onSort={toggleSort} />
        <TableBody<T>
          columns={shownColumns}
          data={pageRows}
          rowKey={rowKey ? (row, i) => rowKey(row, (currentPage - 1) * pageSize + i) : undefined}
          rowActions={rowActions}
          emptyText={emptyText}
          onCellClick={
            clickable
              ? (row, column) => {
                  if (showRowDetails) setSelectedRow(row);
                  onCellClick?.(row, column);
                }
              : undefined
          }
        />
      </table>

      {showRowDetails && <DataSnapshotViewer data={selectedRow} onClose={() => setSelectedRow(null)} />}
    </div>
  );
}
