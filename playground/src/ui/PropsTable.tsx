import { useMemo, useState } from "react";
import { Badge, Tabs, TextInput } from "@itsrighttime/irt-ui/atoms";
import generated from "../docs/props.generated.json";
import type { PropDoc } from "../docs/types";
import { Inline } from "./Inline";

interface GeneratedProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
  deprecated?: boolean;
}

const table = generated as Record<string, GeneratedProp[]>;

export const hasGeneratedProps = (name: string): boolean => Boolean(table[name]?.length);
export const generatedPropCount = (names: string[]): number => names.reduce((sum, n) => sum + (table[n]?.length ?? 0), 0);

function Rows({ props, filter }: { props: GeneratedProp[]; filter: string }) {
  const needle = filter.trim().toLowerCase();
  const shown = needle
    ? props.filter((p) => p.name.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle))
    : props;
  if (shown.length === 0) return <p className="pg-muted">No props match “{filter}”.</p>;
  return (
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
          {shown.map((p) => (
            <tr key={p.name}>
              <td className="pg-prop-name">
                <code>{p.name}</code>
                {p.required && (
                  <Badge size="small" tone="danger" variant="outline">
                    required
                  </Badge>
                )}
                {p.deprecated && (
                  <Badge size="small" tone="warning">
                    deprecated
                  </Badge>
                )}
              </td>
              <td className="pg-prop-type">
                <code>{p.type}</code>
              </td>
              <td>{p.default ? <code>{p.default}</code> : <span className="pg-muted">—</span>}</td>
              <td>{p.description ? <Inline text={p.description} /> : <span className="pg-muted">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Prop tables generated from the library's TypeScript types (one tab per component). */
export function PropsTable({ components, notes }: { components: string[]; notes?: PropDoc[] }) {
  const available = useMemo(() => components.filter(hasGeneratedProps), [components]);
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState(available[0] ?? "");

  return (
    <div className="pg-props-panel">
      {notes && notes.length > 0 && (
        <ul className="pg-prop-notes">
          {notes.map((note) => (
            <li key={note.name}>
              <code>{note.name}</code> <Inline text={note.description} />
            </li>
          ))}
        </ul>
      )}
      <div className="pg-props-toolbar">
        {available.length > 1 && (
          <Tabs
            variant="enclosed"
            size="small"
            ariaLabel="Component"
            value={active}
            onChange={setActive}
            items={available.map((name) => ({ key: name, label: name }))}
          />
        )}
        <TextInput ariaLabel="Filter props" placeholder="Filter props…" iconLeft="search" size="small" width="220px" value={filter} setResult={setFilter} />
      </div>
      {available.length === 0 ? (
        <p className="pg-muted">No generated prop table for this entry.</p>
      ) : (
        <Rows props={table[active] ?? []} filter={filter} />
      )}
    </div>
  );
}
