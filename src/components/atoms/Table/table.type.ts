import type { MouseEvent, ReactNode } from "react";

export interface TableColumn<T> {
  /** Property of the row (or any unique id when `render` is used). */
  key: keyof T | string;
  /** Header text. */
  title: string;
  /** Initial visibility. @default true */
  visible?: boolean;
  /** Allow sorting by clicking the header. */
  sortable?: boolean;
  /** Custom cell renderer. */
  render?: (row: T) => ReactNode;
  /** Custom comparator for sorting. */
  compare?: (a: T, b: T) => number;
}

export interface TableAction<T> {
  label: string;
  onClick: (row: T, e: MouseEvent<HTMLElement>) => void;
}

export interface TableControlsConfig {
  /** @default true */
  search?: boolean;
  /** @default true */
  columnSelector?: boolean;
  /** @default true */
  pagination?: boolean;
}

export type SortDirection = "asc" | "desc";

export interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  /** Keys of the initially visible columns (others hidden). `null` = all. */
  visibleColumns?: string[] | null;
  data: T[];
  rowActions?: TableAction<T>[];
  onCellClick?: (row: T, column: TableColumn<T>) => void;
  /** @default 10 */
  pageSize?: number;
  onSearch?: (query: string) => void;
  controls?: TableControlsConfig;
  /** Stable row key. @default row index */
  rowKey?: (row: T, index: number) => string | number;
  /** Open the record drawer when a cell is clicked. @default true */
  showRowDetails?: boolean;
  /** Accessible table caption (visually hidden). */
  caption?: string;
  /** Text when there are no rows. @default "No records" */
  emptyText?: string;
}
