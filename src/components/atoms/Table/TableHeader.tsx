import { Icon } from "../../../icons/Icon";
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
              aria-sort={active ? (sort?.direction === "asc" ? "ascending" : "descending") : col.sortable ? "none" : undefined}
            >
              {col.sortable && onSort ? (
                <button type="button" className={styles.sortButton} onClick={() => onSort(key)}>
                  {col.title}
                  <Icon
                    name={active ? (sort?.direction === "asc" ? "chevronUp" : "chevronDown") : "chevronDown"}
                    size="0.9em"
                    style={{ opacity: active ? 1 : 0.35 }}
                  />
                </button>
              ) : (
                col.title
              )}
            </th>
          );
        })}
        {actions && <th scope="col">Actions</th>}
      </tr>
    </thead>
  );
}
