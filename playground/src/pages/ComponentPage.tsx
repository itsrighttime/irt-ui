import { useMemo, useState } from "react";
import { Button } from "@itsrighttime/irt-ui";
import { entries } from "../docs/registry";
import type { ControlValues, DocEntry } from "../docs/types";
import { navigate } from "../router";
import { CodeBlock } from "../ui/CodeBlock";
import { Controls } from "../ui/Controls";
import { Inline } from "../ui/Inline";

const defaults = (entry: DocEntry): ControlValues =>
  Object.fromEntries((entry.controls ?? []).map((c) => [c.name, c.default]));

export function ComponentPage({ entry }: { entry: DocEntry }) {
  const [values, setValues] = useState<ControlValues>(() => defaults(entry));
  const code = useMemo(() => entry.code(values), [entry, values]);
  const index = entries.indexOf(entry);
  const prev = entries[index - 1];
  const next = entries[index + 1];

  return (
    <article className="pg-page">
      <header className="pg-page-header">
        <span className="pg-eyebrow">{entry.group}</span>
        <h1>{entry.title}</h1>
        <p className="pg-lead">
          <Inline text={entry.description} />
        </p>
        <CodeBlock code={entry.imports} title="import" />
      </header>

      <section className="pg-playground" aria-label="Live example">
        <div className="pg-preview">{entry.render(values)}</div>
        {entry.controls && entry.controls.length > 0 && (
          <aside className="pg-panel" aria-label="Controls">
            <div className="pg-panel-head">
              <h2>Controls</h2>
              <Button size="small" variant="ghost" iconLeft="refresh" onClick={() => setValues(defaults(entry))}>
                Reset
              </Button>
            </div>
            <Controls controls={entry.controls} values={values} onChange={(name, value) => setValues((s) => ({ ...s, [name]: value }))} />
          </aside>
        )}
      </section>

      {entry.notes && <section className="pg-notes">{entry.notes}</section>}

      <section>
        <h2>Usage</h2>
        <CodeBlock code={code} />
      </section>

      {entry.props && (
        <section>
          <h2>Key props</h2>
          <div className="pg-table-wrap">
            <table className="pg-props">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {entry.props.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <code>{p.name}</code>
                    </td>
                    <td>
                      <code>{p.type}</code>
                    </td>
                    <td>{p.default ? <code>{p.default}</code> : "—"}</td>
                    <td>
                      <Inline text={p.description} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pg-muted">Full prop types ship with the package — hover a component in your editor.</p>
        </section>
      )}

      <nav className="pg-pager" aria-label="Pager">
        {prev ? (
          <Button variant="ghost" iconLeft="chevronLeft" onClick={() => navigate(`/components/${prev.id}`)}>
            {prev.title}
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button variant="ghost" iconRight="chevronRight" onClick={() => navigate(`/components/${next.id}`)}>
            {next.title}
          </Button>
        )}
      </nav>
    </article>
  );
}
