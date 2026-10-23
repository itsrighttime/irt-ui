import { useState } from "react";
import { Calendar, DatePicker, DayPicker, MonthPicker, MonthYearPicker, TimePicker, YearPicker } from "@itsrighttime/irt-ui/atoms";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const calendarControls: Control[] = [
  { type: "select", name: "mode", default: "date", options: ["date", "day", "month", "month-year", "year"], group: "Behavior" },
  { type: "select", name: "monthBase", default: "1", options: ["0", "1"], group: "Behavior", hint: "1 = calendar months (recommended)" },
  { type: "select", name: "firstDayOfWeek", default: "0", options: ["0", "1"], group: "Behavior", hint: "0 Sunday · 1 Monday" },
  { type: "text", name: "restrictionStartDate", label: "restrictionStartDate", default: "", group: "Range", placeholder: "dd-mm-yyyy" },
  { type: "text", name: "restrictionEndDate", label: "restrictionEndDate", default: "", group: "Range", placeholder: "dd-mm-yyyy" },
  { type: "boolean", name: "isSmall", default: false, group: "Appearance" },
  { type: "boolean", name: "highlightToday", default: true, group: "Appearance" },
  { type: "color", name: "color", default: "", group: "Appearance" },
  { type: "select", name: "locale", default: "en-US", options: ["en-US", "en-GB", "hi-IN", "fr-FR", "de-DE"], group: "Locale" },
];

const DATE = /^\d{2}-\d{2}-\d{4}$/;

function CalendarDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState<string | number | null>(null);
  const log = useLog();
  const start = DATE.test(String(v.restrictionStartDate)) ? String(v.restrictionStartDate) : null;
  const end = DATE.test(String(v.restrictionEndDate)) ? String(v.restrictionEndDate) : null;
  return (
    <div style={{ width: v.isSmall ? 260 : 360, maxWidth: "100%" }}>
      <Calendar
        key={`${v.mode}-${start}-${end}-${v.monthBase}`}
        mode={v.mode as "date"}
        monthBase={Number(v.monthBase) as 0 | 1}
        firstDayOfWeek={Number(v.firstDayOfWeek) as 0 | 1}
        isSmall={Boolean(v.isSmall)}
        highlightToday={Boolean(v.highlightToday)}
        color={String(v.color) || undefined}
        restrictionStartDate={start}
        restrictionEndDate={end}
        locale={String(v.locale)}
        value={value}
        setResult={(next) => {
          setValue(next);
          log("setResult", next);
        }}
      />
    </div>
  );
}

const pickerControls: Control[] = [
  { type: "select", name: "variant", default: "full", options: ["full", "underline"], group: "Appearance" },
  { type: "boolean", name: "compact", default: false, group: "Appearance", hint: "Smaller popup calendar" },
  { type: "boolean", name: "clearable", default: true, group: "Behavior", libDefault: false },
  { type: "select", name: "firstDayOfWeek", default: "1", options: ["0", "1"], group: "Behavior" },
  { type: "boolean", name: "formatted", label: "formatValue (pretty)", default: true, group: "Behavior", hint: "Show 5 Oct 2026 instead of 05-10-2026" },
  { type: "text", name: "error", default: "", group: "Validation", placeholder: "no error" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

const prettyDate = (value: string | number) => {
  const [d, m, y] = String(value).split("-").map(Number);
  if (!d || !m || !y) return String(value);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function PickersDemo({ v }: { v: ControlValues }) {
  const [values, setValues] = useState<Record<string, string | number>>({});
  const log = useLog();
  const set = (k: string) => (next: string | number) => {
    setValues((s) => ({ ...s, [k]: next }));
    log(`${k}.setResult`, next);
  };
  const shared = {
    variant: v.variant as "full",
    compact: Boolean(v.compact),
    clearable: Boolean(v.clearable),
    firstDayOfWeek: Number(v.firstDayOfWeek) as 0 | 1,
    required: Boolean(v.required),
    disabled: Boolean(v.disabled),
    width: "100%",
  };
  return (
    <div className="pg-grid-2 pg-pickers">
      <DatePicker
        {...shared}
        label="Date"
        placeholder="Pick a date"
        monthBase={1}
        error={String(v.error) || undefined}
        formatValue={v.formatted ? prettyDate : undefined}
        value={values.date}
        setResult={set("date")}
      />
      <DayPicker {...shared} label="Day of month" placeholder="dd" value={values.day} setResult={set("day")} />
      <MonthPicker {...shared} label="Month" placeholder="Pick a month" monthBase={1} value={values.month} setResult={set("month")} />
      <MonthYearPicker {...shared} label="Month & year" placeholder="m-yyyy" monthBase={1} value={values.my} setResult={set("my")} />
      <YearPicker {...shared} label="Year" placeholder="yyyy" value={values.year} setResult={set("year")} helperText="Opens on the year grid" />
    </div>
  );
}

const timeControls: Control[] = [
  { type: "text", name: "label", default: "Start time", group: "Content" },
  { type: "text", name: "helperText", default: "Office hours only", group: "Content" },
  { type: "text", name: "minTime", default: "08:00 AM", group: "Range" },
  { type: "text", name: "maxTime", default: "06:00 PM", group: "Range" },
  { type: "select", name: "minuteStep", default: "15", options: ["1", "5", "10", "15", "30"], group: "Range" },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"], group: "Appearance" },
  { type: "select", name: "radius", default: "md", options: ["none", "sm", "md", "lg"], group: "Appearance" },
  { type: "text", name: "width", default: "260px", group: "Appearance" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function TimeDemo({ v }: { v: ControlValues }) {
  const [time, setTime] = useState("09:30 AM");
  const log = useLog();
  return (
    <TimePicker
      label={String(v.label)}
      helperText={String(v.helperText) || undefined}
      value={time}
      setResult={(next) => {
        setTime(next);
        log("setResult", next);
      }}
      minTime={String(v.minTime) || undefined}
      maxTime={String(v.maxTime) || undefined}
      minuteStep={Number(v.minuteStep)}
      size={v.size as "medium"}
      radius={v.radius as "md"}
      width={String(v.width)}
      required={Boolean(v.required)}
      disabled={Boolean(v.disabled)}
    />
  );
}

export const dateTimeEntries: DocEntry[] = [
  {
    id: "calendar",
    title: "Calendar",
    group: "Date & time",
    description:
      "Inline date / day / month / month-year / year picker with a restriction range, a separate “today” marker and arrow-key grid navigation. Pass `value` to highlight the selection. Use `monthBase={1}` for calendar months (the legacy default `0` emits January as 0).",
    imports: 'import { Calendar } from "@itsrighttime/irt-ui";',
    controls: calendarControls,
    render: (v) => <CalendarDemo v={v} />,
    code: (v) =>
      jsx("Calendar", [
        ["mode", v.mode === "date" ? undefined : v.mode],
        ["monthBase", Number(v.monthBase)],
        ["firstDayOfWeek", v.firstDayOfWeek === "0" ? undefined : 1],
        ...changed(calendarControls, v, ["isSmall", "highlightToday", "color", "restrictionStartDate", "restrictionEndDate"]),
        ["locale", v.locale === "en-US" ? undefined : v.locale],
        ["value", "{date}"],
        ["setResult", "{setDate}"],
      ]),
  },
  {
    id: "date-pickers",
    title: "Date pickers",
    group: "Date & time",
    description:
      "Fields that open a Calendar popover (portal, flips above when needed): `DatePicker`, `DayPicker`, `MonthPicker`, `MonthYearPicker`, `YearPicker`. Support `formatValue`, `clearable` (Backspace clears), helper/error text and both variants.",
    imports: 'import { DatePicker, DayPicker, MonthPicker, MonthYearPicker, YearPicker } from "@itsrighttime/irt-ui";',
    components: ["DatePicker"],
    controls: pickerControls,
    align: "stretch",
    render: (v) => <PickersDemo v={v} />,
    code: (v) =>
      jsx("DatePicker", [
        ["label", "Due date"],
        ["monthBase", 1],
        ...changed(pickerControls, v, ["variant", "compact", "clearable", "error", "required", "disabled"]),
        ["firstDayOfWeek", v.firstDayOfWeek === "0" ? undefined : 1],
        ["formatValue", v.formatted ? "{prettyDate}" : undefined],
        ["value", "{due}"],
        ["setResult", "{setDue}"],
      ]),
  },
  {
    id: "time-picker",
    title: "TimePicker",
    group: "Date & time",
    description:
      "12-hour picker in a single field: hour, minute and AM/PM segments. ↑/↓ on a focused segment steps it without opening the list. Optional min/max and minute steps; emits `\"hh:mm AM|PM\"` once per change when complete and valid.",
    imports: 'import { TimePicker } from "@itsrighttime/irt-ui";',
    controls: timeControls,
    render: (v) => <TimeDemo v={v} />,
    code: (v) =>
      jsx("TimePicker", [
        ...changed(timeControls, v),
        ["minuteStep", Number(v.minuteStep)],
        ["value", "{time}"],
        ["setResult", "{setTime}"],
      ]),
  },
];
