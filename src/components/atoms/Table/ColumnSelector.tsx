"use client";

import { Dropdown } from "../Selection/Dropdown";
import type { TableColumn } from "./table.type";

interface ColumnSelectorProps<T> {
  /** All columns with their current `visible` flag. */
  columns: TableColumn<T>[];
  /** Called with the column key to toggle. */
  onToggle: (key: string) => void;
}

/** Multi-select of column titles. @internal */
export function ColumnSelector<T>({ columns, onToggle }: ColumnSelectorProps<T>) {
  const titles = columns.map((col) => col.title);
  const selected = columns.filter((col) => col.visible !== false).map((col) => col.title);

  return (
    <Dropdown
      options={titles}
      value={selected}
      multiple
      placeholder="Select columns"
      setResult={(next) => {
        for (const col of columns) {
          const isSelected = next.includes(col.title);
          if (isSelected !== (col.visible !== false)) onToggle(String(col.key));
        }
      }}
    />
  );
}
