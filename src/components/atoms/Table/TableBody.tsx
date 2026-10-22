import { TableRow } from "./TableRow";
import styles from "./Table.module.css";
import type { TableAction, TableColumn } from "./table.type";

interface TableBodyProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowActions?: TableAction<T>[];
  onCellClick?: (row: T, column: TableColumn<T>) => void;
  rowKey?: (row: T, index: number) => string | number;
  emptyText?: string;
}

/** @internal */
export function TableBody<T>({ columns, data, rowActions = [], onCellClick, rowKey, emptyText }: TableBodyProps<T>) {
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td className={styles.empty} colSpan={columns.length + (rowActions.length ? 1 : 0) || 1}>
            {emptyText}
          </td>
        </tr>
      </tbody>
    );
  }
  return (
    <tbody>
      {data.map((row, index) => (
        <TableRow<T>
          key={rowKey ? rowKey(row, index) : index}
          row={row}
          columns={columns}
          rowActions={rowActions}
          onCellClick={onCellClick}
        />
      ))}
    </tbody>
  );
}
