"use client";

import { useState } from "react";
import { Button, Dialog, DatePicker, Switch, TextInput, Tooltip } from "@itsrighttime/irt-ui/atoms";
import { useTheme } from "@itsrighttime/irt-ui/theme";

export function Interactive() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string | number>("");
  const { resolvedMode, setMode } = useTheme();

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <Tooltip content="Increments the counter" delay={0}>
        <Button id="counter" onClick={() => setCount((c) => c + 1)} iconLeft="plus">
          Clicked {count}
        </Button>
      </Tooltip>
      <TextInput label="Email" textType="email" />
      <Switch label={`Dark (${resolvedMode})`} value={resolvedMode === "dark"} setResult={(d) => setMode(d ? "dark" : "light")} />
      <DatePicker label="Due date" placeholder="Pick a date" value={date} setResult={setDate} monthBase={1} />
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Settings"
        items={[
          { key: "profile", icon: "user", component: <p>Profile</p> },
          { key: "security", icon: "lock", component: <p>Security</p> },
        ]}
      />
    </section>
  );
}
