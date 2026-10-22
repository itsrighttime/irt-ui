"use client";

import { Button } from "../Button/Button";
import styles from "./Table.module.css";
import type { TableAction } from "./table.type";

interface ActionColumnProps<T> {
  row: T;
  actions?: TableAction<T>[];
}

/** @internal */
export function ActionColumn<T>({ row, actions = [] }: ActionColumnProps<T>) {
  return (
    <td className={styles.actionButton}>
      {actions.map((action) => (
        <Button key={action.label} onClick={(event) => action.onClick(row, event)} variant="secondary" size="small">
          {action.label}
        </Button>
      ))}
    </td>
  );
}
