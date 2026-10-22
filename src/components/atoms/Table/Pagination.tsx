"use client";

import { IconButton } from "../Button/IconButton";
import styles from "./Table.module.css";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Previous / next pager. */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <IconButton
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        icon="chevronLeft"
        label="Previous page"
        size={1.5}
      />
      <span aria-live="polite">
        {currentPage} / {totalPages}
      </span>
      <IconButton
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        icon="chevronRight"
        label="Next page"
        size={1.5}
      />
    </nav>
  );
}
