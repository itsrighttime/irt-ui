import { Icon } from "../../../icons/Icon";
import { cx } from "../../../utils/cx";
import styles from "./Table.module.css";
import type { SortDirection, TableColumn } from "./table.type";

interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
  actions: boolean;
  sort?: { key: string; direction: SortDirection } | null;
  onSort?: (key: string) => void;
}

/** @internal */
export function TableHeader<T>({ columns, actions, sort, onSort }: TableHeaderProps<T>) {
  return (
    <thead>
      <tr>
        {columns.map((col) => {
          const key = String(col.key);
          const active = sort?.key === key;
          return (
            <th
              key={key}
              scope="col"
              className={cx(col.align === "center" && styles.alignCenter, col.align === "right" && styles.alignRight)}
              style={col.width ? { width: col.width } : undefined}
              aria-sort={active ? (sort?.direction === "asc" ? "ascending" : "descending") : col.sortable ? "none" : undefined}
            >
              {col.sortable && onSort ? (
                <button type="button" className={cx(styles.sortButton, active && styles.sortActive)} onClick={() => onSort(key)}>
                  {col.title}
                  <Icon
                    name={active ? (sort?.direction === "asc" ? "chevronUp" : "chevronDown") : "chevronDown"}
                    size="0.9em"
                    className={styles.sortIcon}
                  />
                </button>
              ) : (
                col.title
              )}
            </th>
          );
        })}
        {actions && (
          <th scope="col" className={styles.alignRight}>
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}
