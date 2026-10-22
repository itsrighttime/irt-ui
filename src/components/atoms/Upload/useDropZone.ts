"use client";

import { useState, type DragEvent } from "react";

/** Drag-and-drop handlers + `isDragging` flag for a drop zone. @internal */
export function useDropZone<E extends HTMLElement>(onFiles: (files: File[]) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const stop = (event: DragEvent<E>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return {
    isDragging,
    handlers: {
      onDragEnter: (event: DragEvent<E>) => {
        stop(event);
        setIsDragging(true);
      },
      onDragLeave: (event: DragEvent<E>) => {
        stop(event);
        setIsDragging(false);
      },
      onDragOver: stop,
      onDrop: (event: DragEvent<E>) => {
        stop(event);
        setIsDragging(false);
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length) onFiles(files);
      },
    },
  };
}
