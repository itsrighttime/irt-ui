"use client";

import { useRef, useState } from "react";
import { IconButton } from "../Button/IconButton";
import { Popover } from "../Overlay/Popover";
import { TextInput } from "../TextInput/TextInput";
import { ColumnSelector } from "./ColumnSelector";
import { Pagination } from "./Pagination";
import styles from "./Table.module.css";
import type { TableColumn } from "./table.type";

interface TableControlsProps<T> {
  columns: TableColumn<T>[];
  onColumnToggle: (key: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  showColumnSelector?: boolean;
  showPagination?: boolean;
}

/** Search / columns / pagination toolbar (collapses into a menu in narrow containers). @internal */
export function TableControls<T>({
  columns,
  onColumnToggle,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  showSearch,
  showColumnSelector,
  showPagination,
}: TableControlsProps<T>) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const search = (width: string) => (
    <TextInput placeholder="Search..." ariaLabel="Search table" setResult={(value) => onSearch?.(value)} width={width} />
  );

  return (
    <div className={styles.controls}>
      <div className={styles.desktopControls}>
        {showPagination && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
        {showColumnSelector && <ColumnSelector<T> columns={columns} onToggle={onColumnToggle} />}
        {showSearch && search("200px")}
      </div>

      <div className={styles.mobileControls} ref={anchorRef}>
        <IconButton
          icon={open ? "close" : "menu"}
          label={open ? "Close table controls" : "Table controls"}
          onClick={() => setOpen((prev) => !prev)}
          size={2}
        />
        <Popover anchorRef={anchorRef} isOpen={open} onClose={() => setOpen(false)}>
          <div className={styles.mobileMenu}>
            {showSearch && search("100%")}
            {showColumnSelector && <ColumnSelector<T> columns={columns} onToggle={onColumnToggle} />}
            {showPagination && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
          </div>
        </Popover>
      </div>
    </div>
  );
}
