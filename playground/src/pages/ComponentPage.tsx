import { useMemo, useState } from "react";
import { Badge, Button, IconButton, Tabs } from "@itsrighttime/irt-ui";
import { entries } from "../docs/registry";
import type { ControlValues, DocEntry } from "../docs/types";
import { navigate } from "../router";
import { EventsProvider, useEvents } from "../state/events";
import { CodeBlock } from "../ui/CodeBlock";
import { Controls } from "../ui/Controls";
import { Inline } from "../ui/Inline";
import { generatedPropCount, PropsTable } from "../ui/PropsTable";

const defaults = (entry: DocEntry): ControlValues =>
  Object.fromEntries((entry.controls ?? []).map((c) => [c.name, c.default]));

type Canvas = "grid" | "plain" | "muted";
type Viewport = "full" | "tablet" | "mobile";

const VIEWPORT_WIDTH: Record<Viewport, string | undefined> = { full: undefined, tablet: "768px", mobile: "375px" };

function EventsPanel() {
  const { events, clear } = useEvents();
  if (events.length === 0) {
    return <p className="pg-muted pg-empty">Interact with the preview — callbacks such as <code>setResult</code> and <code>onChange</code> are logged here.</p>;
  }
  return (
    <div className="pg-events">
      <div className="pg-events-head">
        <span className="pg-muted">Newest first · last {events.length}</span>
        <Button size="small" variant="ghost" iconLeft="trash" onClick={clear}>
          Clear
        </Button>
      </div>
      <ol className="pg-event-list">
        {events.map((event) => (
          <li key={event.id}>
            <time>{event.time}</time>
            <code className="pg-event-name">{event.name}</code>
            <code className="pg-event-payload">{event.payload || "()"}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}

function EventsTabLabel() {
  const { events } = useEvents();
  return <>Events{events.length > 0 && <span className="pg-tab-count">{events.length}</span>}</>;
}

function ComponentPageInner({ entry }: { entry: DocEntry }) {
  const [values, setValues] = useState<ControlValues>(() => defaults(entry));
  const [canvas, setCanvas] = useState<Canvas>("grid");
  const [viewport, setViewport] = useState<Viewport>("full");
  const [previewKey, setPreviewKey] = useState(0);
  const code = useMemo(() => entry.code(values), [entry, values]);
  const index = entries.indexOf(entry);
  const prev = entries[index - 1];
  const next = entries[index + 1];
  const components = entry.components ?? [entry.title];
  const propCount = generatedPropCount(components);
  const changedCount = (entry.controls ?? []).filter((c) => values[c.name] !== c.default).length;
  const hasControls = Boolean(entry.controls && entry.controls.length > 0);

  const reset = () => {
    setValues(defaults(entry));
    setPreviewKey((k) => k + 1);
  };

  return (
    <article className="pg-page pg-page-wide">
      <header className="pg-page-header">
        <span className="pg-eyebrow">{entry.group}</span>
        <h1>{entry.title}</h1>
        <p className="pg-lead">
          <Inline text={entry.description} />
        </p>
        <CodeBlock code={entry.imports} bare />
      </header>

      <section className={`pg-workbench${hasControls ? "" : " pg-workbench-solo"}`} aria-label="Live example">
        <div className="pg-stage">
          <div className="pg-stage-toolbar" role="toolbar" aria-label="Preview options">
            <Tabs
              variant="enclosed"
              size="small"
              ariaLabel="Canvas"
              value={canvas}
              onChange={(v) => setCanvas(v as Canvas)}
              items={[
                { key: "grid", label: "Grid" },
                { key: "plain", label: "Plain" },
                { key: "muted", label: "Muted" },
              ]}
            />
            <Tabs
              variant="enclosed"
              size="small"
              ariaLabel="Viewport"
              value={viewport}
              onChange={(v) => setViewport(v as Viewport)}
              items={[
                { key: "full", label: "Full", icon: "columns" },
                { key: "tablet", label: "768" },
                { key: "mobile", label: "375" },
              ]}
            />
            <span className="pg-spacer" />
            <IconButton icon="refresh" label="Remount preview" color="var(--irt-color-text-muted)" onClick={() => setPreviewKey((k) => k + 1)} />
          </div>
          <div className={`pg-preview pg-canvas-${canvas}`} data-align={entry.align ?? "center"}>
            <div className="pg-viewport" style={{ maxWidth: VIEWPORT_WIDTH[viewport] }} data-constrained={viewport !== "full" || undefined}>
              <div key={previewKey} className="pg-viewport-inner">
                {entry.render(values)}
              </div>
            </div>
          </div>
        </div>

        {hasControls && entry.controls && (
          <aside className="pg-panel" aria-label="Controls">
            <div className="pg-panel-head">
              <h2>
                Controls
                {changedCount > 0 && (
                  <Badge size="small" tone="primary">
                    {changedCount} changed
                  </Badge>
                )}
              </h2>
              <Button size="small" variant="ghost" iconLeft="refresh" onClick={reset} disabled={changedCount === 0}>
                Reset
              </Button>
            </div>
            <Controls controls={entry.controls} values={values} onChange={(name, value) => setValues((s) => ({ ...s, [name]: value }))} />
          </aside>
        )}
      </section>

      {entry.notes && <section className="pg-notes">{entry.notes}</section>}

      <section className="pg-detail">
        <Tabs
          ariaLabel="Details"
          keepMounted
          items={[
            { key: "code", label: "Code", icon: "fileText", content: <CodeBlock code={code} title="Usage — reflects the controls" /> },
            {
              key: "props",
              label: "Props",
              icon: "columns",
              badge: propCount || undefined,
              content: <PropsTable components={components} notes={entry.props} />,
            },
            { key: "events", label: <EventsTabLabel />, icon: "activity", content: <EventsPanel /> },
          ]}
        />
      </section>

      {entry.examples && entry.examples.length > 0 && (
        <section className="pg-examples">
          <h2>Examples</h2>
          <div className="pg-example-grid">
            {entry.examples.map((example) => (
              <div key={example.title} className="pg-example">
                <div className="pg-example-head">
                  <h3>{example.title}</h3>
                  {example.description && (
                    <p className="pg-muted">
                      <Inline text={example.description} />
                    </p>
                  )}
                </div>
                <div className="pg-example-preview">{example.render()}</div>
                <details className="pg-example-code">
                  <summary>Show code</summary>
                  <CodeBlock code={example.code} bare />
                </details>
              </div>
            ))}
          </div>
        </section>
      )}

      <nav className="pg-pager" aria-label="Pager">
        {prev ? (
          <button type="button" className="pg-pager-link" onClick={() => navigate(`/components/${prev.id}`)}>
            <span className="pg-muted">Previous</span>
            <strong>← {prev.title}</strong>
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button type="button" className="pg-pager-link pg-pager-next" onClick={() => navigate(`/components/${next.id}`)}>
            <span className="pg-muted">Next</span>
            <strong>{next.title} →</strong>
          </button>
        )}
      </nav>
    </article>
  );
}

export function ComponentPage({ entry }: { entry: DocEntry }) {
  return (
    <EventsProvider>
      <ComponentPageInner entry={entry} />
    </EventsProvider>
  );
}
