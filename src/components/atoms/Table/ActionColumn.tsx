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
    <td className={styles.actionCell}>
      <div className={styles.actionButton}>
        {actions
          .filter((action) => !action.hidden?.(row))
          .map((action) => (
            <Button
              key={action.label}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick(row, event);
              }}
              variant={action.variant === "ghost" ? "ghost" : "secondary"}
              color={action.variant === "danger" ? "var(--irt-color-danger)" : undefined}
              size="small"
              iconLeft={action.icon}
              iconOnly={action.iconOnly && action.icon !== undefined}
              ariaLabel={action.iconOnly ? action.label : undefined}
              tooltip={action.iconOnly ? action.label : undefined}
              disabled={action.disabled?.(row)}
            >
              {action.label}
            </Button>
          ))}
      </div>
    </td>
  );
}
