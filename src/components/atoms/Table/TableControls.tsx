"use client";

import type { ReactNode } from "react";
import { TextInput } from "../TextInput/TextInput";
import { ColumnSelector } from "./ColumnSelector";
import styles from "./Table.module.css";
import type { TableColumn } from "./table.type";

interface TableControlsProps<T> {
  columns: TableColumn<T>[];
  onColumnToggle: (key: string) => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  showColumnSelector?: boolean;
  searchPlaceholder?: string;
  title?: ReactNode;
  toolbar?: ReactNode;
}

/** Title / search / column picker / custom actions toolbar. Wraps in narrow containers. @internal */
export function TableControls<T>({
  columns,
  onColumnToggle,
  onSearch,
  showSearch,
  showColumnSelector,
  searchPlaceholder = "Search...",
  title,
  toolbar,
}: TableControlsProps<T>) {
  return (
    <div className={styles.controls}>
      {title != null && <div className={styles.tableTitle}>{title}</div>}
      {showSearch && (
        <div className={styles.searchSlot}>
          <TextInput
            placeholder={searchPlaceholder}
            ariaLabel="Search table"
            iconLeft="search"
            size="small"
            setResult={(value) => onSearch?.(value)}
            width="100%"
          />
        </div>
      )}
      <div className={styles.controlsEnd}>
        {showColumnSelector && <ColumnSelector<T> columns={columns} onToggle={onColumnToggle} width="170px" />}
        {toolbar}
      </div>
    </div>
  );
}
