import { actionEntries } from "./entries/actions";
import { contentEntries } from "./entries/content";
import { dataEntries } from "./entries/data";
import { dateTimeEntries } from "./entries/datetime";
import { feedbackEntries } from "./entries/feedback";
import { inputEntries } from "./entries/inputs";
import { layoutEntries } from "./entries/layout";
import { mediaEntries } from "./entries/media";
import { overlayEntries } from "./entries/overlays";
import { selectionEntries } from "./entries/selection";
import type { DocEntry } from "./types";

export const entries: DocEntry[] = [
  ...actionEntries,
  ...inputEntries,
  ...selectionEntries,
  ...dateTimeEntries,
  ...feedbackEntries,
  ...overlayEntries,
  ...dataEntries,
  ...mediaEntries,
  ...contentEntries,
  ...layoutEntries,
];

export const groups: string[] = [...new Set(entries.map((e) => e.group))];

export const findEntry = (id: string): DocEntry | undefined => entries.find((e) => e.id === id);
