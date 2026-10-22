import { useState } from "react";
import { Calendar, DatePicker, DayPicker, MonthPicker, MonthYearPicker, TimePicker, YearPicker } from "@itsrighttime/irt-ui/atoms";
import { jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const calendarControls: Control[] = [
  { type: "select", name: "mode", default: "date", options: ["date", "day", "month", "month-year", "year"] },
  { type: "select", name: "monthBase", default: "1", options: ["0", "1"] },
  { type: "boolean", name: "isSmall", default: false },
  { type: "text", name: "restrictionStartDate", label: "start (dd-mm-yyyy)", default: "" },
  { type: "text", name: "restrictionEndDate", label: "end (dd-mm-yyyy)", default: "" },
  { type: "select", name: "locale", default: "en-US", options: ["en-US", "en-GB", "hi-IN", "fr-FR", "de-DE"] },
];

const DATE = /^\d{2}-\d{2}-\d{4}$/;

function CalendarDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState<string | number>("");
  const start = DATE.test(String(v.restrictionStartDate)) ? String(v.restrictionStartDate) : null;
  const end = DATE.test(String(v.restrictionEndDate)) ? String(v.restrictionEndDate) : null;
  return (
    <div className="pg-stack">
      <div style={{ width: v.isSmall ? 260 : 380 }}>
        <Calendar
          key={`${v.mode}-${start}-${end}`}
          mode={v.mode as "date"}
          monthBase={Number(v.monthBase) as 0 | 1}
          isSmall={Boolean(v.isSmall)}
          restrictionStartDate={start}
          restrictionEndDate={end}
          locale={String(v.locale)}
          setResult={setValue}
        />
      </div>
      <small className="pg-muted">setResult → {JSON.stringify(value)}</small>
    </div>
  );
}

function PickersDemo() {
  const [values, setValues] = useState<Record<string, string | number>>({});
  const set = (k: string) => (v: string | number) => setValues((s) => ({ ...s, [k]: v }));
  return (
    <div className="pg-grid-2">
      <DatePicker label="Date" placeholder="dd-mm-yyyy" monthBase={1} value={values.date} setResult={set("date")} />
      <DayPicker label="Day" placeholder="dd" value={values.day} setResult={set("day")} />
      <MonthPicker label="Month" placeholder="month" monthBase={1} value={values.month} setResult={set("month")} />
      <MonthYearPicker label="Month & year" placeholder="m-yyyy" monthBase={1} value={values.my} setResult={set("my")} />
      <YearPicker label="Year" placeholder="yyyy" value={values.year} setResult={set("year")} />
    </div>
  );
}

function TimeDemo({ v }: { v: ControlValues }) {
  const [time, setTime] = useState("09:30 AM");
  return (
    <div className="pg-stack">
      <TimePicker
        label="Start time"
        value={time}
        setResult={setTime}
        minTime={String(v.minTime) || undefined}
        maxTime={String(v.maxTime) || undefined}
        minuteStep={Number(v.minuteStep)}
        disabled={Boolean(v.disabled)}
      />
      <small className="pg-muted">{time}</small>
    </div>
  );
}

export const dateTimeEntries: DocEntry[] = [
  {
    id: "calendar",
    title: "Calendar",
    group: "Date & time",
    description:
      "Inline date / day / month / month-year / year picker with optional restriction range and keyboard-operable cells. Use `monthBase={1}` for calendar months (the legacy default `0` emits January as 0).",
    imports: 'import { Calendar } from "@itsrighttime/irt-ui";',
    controls: calendarControls,
    props: [
      { name: "mode", type: '"date" | "day" | "month" | "month-year" | "year"', description: "What is picked", default: '"date"' },
      { name: "setResult", type: "(value: string | number) => void", description: '"dd-mm-yyyy", "dd", month number, "m-yyyy" or year' },
      { name: "monthBase", type: "0 | 1", description: "Month numbering of emitted values", default: "0" },
      { name: "restrictionStartDate / EndDate", type: "string | null", description: '"dd-mm-yyyy" bounds' },
      { name: "locale / weekdayLabels", type: "string / string[]", description: "Localisation (fixed default avoids SSR mismatches)" },
    ],
    render: (v) => <CalendarDemo v={v} />,
    code: (v) =>
      jsx("Calendar", [
        ["mode", v.mode === "date" ? undefined : v.mode],
        ["monthBase", Number(v.monthBase)],
        ["isSmall", v.isSmall || undefined],
        ["restrictionStartDate", v.restrictionStartDate || undefined],
        ["restrictionEndDate", v.restrictionEndDate || undefined],
        ["locale", v.locale === "en-US" ? undefined : v.locale],
        ["setResult", "{setDate}"],
      ]),
  },
  {
    id: "date-pickers",
    title: "Date pickers",
    group: "Date & time",
    description: "Input fields that open a Calendar popup: DatePicker, DayPicker, MonthPicker, MonthYearPicker and YearPicker.",
    imports: 'import { DatePicker, DayPicker, MonthPicker, MonthYearPicker, YearPicker } from "@itsrighttime/irt-ui";',
    render: () => <PickersDemo />,
    code: () => '<DatePicker label="Due date" placeholder="dd-mm-yyyy" monthBase={1} value={due} setResult={setDue} />',
  },
  {
    id: "time-picker",
    title: "TimePicker",
    group: "Date & time",
    description: "12-hour picker with optional min/max and minute steps. Emits `\"hh:mm AM|PM\"` once per change when complete and valid.",
    imports: 'import { TimePicker } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "text", name: "minTime", default: "08:00 AM" },
      { type: "text", name: "maxTime", default: "06:00 PM" },
      { type: "select", name: "minuteStep", default: "15", options: ["1", "5", "10", "15", "30"] },
      { type: "boolean", name: "disabled", default: false },
    ],
    render: (v) => <TimeDemo v={v} />,
    code: (v) =>
      jsx("TimePicker", [
        ["label", "Start time"],
        ["minTime", v.minTime || undefined],
        ["maxTime", v.maxTime || undefined],
        ["minuteStep", Number(v.minuteStep)],
        ["value", "{time}"],
        ["setResult", "{setTime}"],
      ]),
  },
];
