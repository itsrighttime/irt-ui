import type { KeyboardEvent, ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Table.module.css";
import type { TableColumn } from "./table.type";

interface TableCellProps<T> {
  row: T;
  column: TableColumn<T>;
  onClick?: (row: T, column: TableColumn<T>) => void;
}

/** @internal */
export function TableCell<T>({ row, column, onClick }: TableCellProps<T>) {
  const content: ReactNode = column.render
    ? column.render(row)
    : ((row as Record<PropertyKey, unknown>)[column.key as PropertyKey] as ReactNode);
  const className = cx(column.align === "center" && styles.alignCenter, column.align === "right" && styles.alignRight) || undefined;

  if (!onClick) return <td className={className}>{content}</td>;

  return (
    <td
      className={className}
      tabIndex={0}
      onClick={() => onClick(row, column)}
      onKeyDown={(event: KeyboardEvent<HTMLTableCellElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(row, column);
        }
      }}
    >
      {content}
    </td>
  );
}
