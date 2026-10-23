import type { MouseEvent, ReactNode } from "react";
import type { IconLike } from "../../../icons/renderIcon";

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
  /** Cell text alignment. @default "left" */
  align?: "left" | "center" | "right";
  /** Column width (any CSS length), e.g. `"120px"` or `"20%"`. */
  width?: string;
}

export interface TableAction<T> {
  label: string;
  onClick: (row: T, e: MouseEvent<HTMLElement>) => void;
  /** Leading icon (registry name or node). */
  icon?: IconLike;
  /** Button style. `danger` renders a destructive action. @default "secondary" */
  variant?: "secondary" | "ghost" | "danger";
  /** Show the icon only (label becomes the tooltip / accessible name). */
  iconOnly?: boolean;
  /** Hide the action for some rows. */
  hidden?: (row: T) => boolean;
  /** Disable the action for some rows. */
  disabled?: (row: T) => boolean;
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
  /** Row height. @default "comfortable" */
  density?: "compact" | "comfortable";
  /** Alternate row backgrounds. @default false */
  striped?: boolean;
  /** Keep the header visible while the body scrolls (set `maxHeight`). @default false */
  stickyHeader?: boolean;
  /** Max height of the scrollable body area (any CSS length). */
  maxHeight?: string;
  /** Show a loading overlay over the rows. */
  loading?: boolean;
  /** Optional title rendered at the start of the toolbar. */
  title?: ReactNode;
  /** Extra toolbar content (e.g. an "Add" button), rendered at the end. */
  toolbar?: ReactNode;
  /** Placeholder of the search box. @default "Search..." */
  searchPlaceholder?: string;
  className?: string;
}
