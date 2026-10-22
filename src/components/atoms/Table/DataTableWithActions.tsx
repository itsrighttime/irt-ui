"use client";

import { useState } from "react";
import { Dialog, type DialogItem } from "../Overlay/Dialog";
import { Table } from "./Table";
import type { TableColumn, TableProps } from "./table.type";

export interface DataTableWithActionsProps<T extends object> {
  data: T[];
  columns: TableColumn<T>[];
  visibleColumns: string[];
  dialogItems: DialogItem[];
  /** @default 10 */
  pageSize?: number;
  /** @default "Settings" */
  dialogTitle?: string;
  /** Row action label. @default "Open Dialog" */
  actionLabel?: string;
  /** Controlled open state (e.g. synced to `?dialog=open` by your router). */
  isDialogOpen?: boolean;
  /** Called with the next open state and, when opening, the row. */
  onDialogOpenChange?: (open: boolean, row?: T) => void;
  /** Controlled active dialog tab. */
  activeDialogKey?: string | null;
  onActiveDialogKeyChange?: (key: string) => void;
  /** Show text labels next to the dialog's tab icons. @default false */
  dialogShowLabels?: boolean;
  /** Any other `Table` props (title, toolbar, density, striped, extra row actions, …). */
  tableProps?: Omit<Partial<TableProps<T>>, "data" | "columns" | "visibleColumns" | "pageSize">;
}

/**
 * `Table` whose row action opens a tabbed `Dialog`. Router-agnostic: pass
 * `isDialogOpen` / `activeDialogKey` (+ callbacks) to sync with the URL.
 */
export function DataTableWithActions<T extends object>({
  data,
  columns,
  visibleColumns,
  dialogItems,
  pageSize = 10,
  dialogTitle = "Settings",
  actionLabel = "Open Dialog",
  isDialogOpen,
  onDialogOpenChange,
  activeDialogKey,
  onActiveDialogKeyChange,
  dialogShowLabels = false,
  tableProps,
}: DataTableWithActionsProps<T>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isDialogOpen ?? internalOpen;

  const setOpen = (next: boolean, row?: T) => {
    if (isDialogOpen === undefined) setInternalOpen(next);
    onDialogOpenChange?.(next, row);
  };

  return (
    <div>
      <Table<T>
        columns={columns}
        visibleColumns={visibleColumns}
        data={data}
        pageSize={pageSize}
        controls={{ search: true, columnSelector: true, pagination: true }}
        {...tableProps}
        rowActions={[
          ...(dialogItems.length > 0 ? [{ label: actionLabel, onClick: (row: T) => setOpen(true, row) }] : []),
          ...(tableProps?.rowActions ?? []),
        ]}
      />
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title={dialogTitle}
        items={dialogItems}
        activeKey={activeDialogKey}
        onActiveKeyChange={onActiveDialogKeyChange}
        showLabels={dialogShowLabels}
      />
    </div>
  );
}
