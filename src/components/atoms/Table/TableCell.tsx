import type { KeyboardEvent, ReactNode } from "react";
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

  if (!onClick) return <td>{content}</td>;

  return (
    <td
      tabIndex={0}
      onClick={() => onClick(row, column)}
      onKeyDown={(event: KeyboardEvent<HTMLTableCellElement>) => {
        if (event.key === "Enter") onClick(row, column);
      }}
    >
      {content}
    </td>
  );
}
