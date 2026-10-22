"use client";

import { useState } from "react";
import { Dialog, type DialogItem } from "../Overlay/Dialog";
import { Table } from "./Table";
import type { TableColumn } from "./table.type";

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
        rowActions={dialogItems.length > 0 ? [{ label: actionLabel, onClick: (row) => setOpen(true, row) }] : []}
      />
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title={dialogTitle}
        items={dialogItems}
        activeKey={activeDialogKey}
        onActiveKeyChange={onActiveDialogKeyChange}
      />
    </div>
  );
}
