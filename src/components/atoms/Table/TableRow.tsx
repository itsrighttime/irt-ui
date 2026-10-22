import { ActionColumn } from "./ActionColumn";
import { TableCell } from "./TableCell";
import type { TableAction, TableColumn } from "./table.type";

interface TableRowProps<T> {
  row: T;
  columns: TableColumn<T>[];
  rowActions?: TableAction<T>[];
  onCellClick?: (row: T, column: TableColumn<T>) => void;
}

/** @internal */
export function TableRow<T>({ row, columns, rowActions = [], onCellClick }: TableRowProps<T>) {
  return (
    <tr>
      {columns.map((col) => (
        <TableCell<T> key={String(col.key)} row={row} column={col} onClick={onCellClick} />
      ))}
      {rowActions.length > 0 && <ActionColumn<T> row={row} actions={rowActions} />}
    </tr>
  );
}
