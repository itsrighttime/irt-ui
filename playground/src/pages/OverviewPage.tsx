import { useMemo, useState } from "react";
import { Badge, TextInput } from "@itsrighttime/irt-ui/atoms";
import { Icon } from "@itsrighttime/irt-ui/icons";
import { entries, groups } from "../docs/registry";
import { navigate } from "../router";
import { generatedPropCount } from "../ui/PropsTable";

const firstSentence = (text: string) => text.replace(/`/g, "").split(/(?<=\.)\s/)[0] ?? text;

/** Catalogue of every documented component, grouped and filterable. */
export function OverviewPage() {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const visible = useMemo(
    () => entries.filter((e) => !needle || `${e.title} ${e.description} ${e.group}`.toLowerCase().includes(needle)),
    [needle],
  );

  return (
    <article className="pg-page pg-page-wide">
      <header className="pg-page-header">
        <span className="pg-eyebrow">Catalogue</span>
        <h1>All components</h1>
        <p className="pg-lead">
          {entries.length} documented entries across {groups.length} groups. Every page has a live preview, grouped controls, generated prop
          tables and an events log.
        </p>
        <TextInput ariaLabel="Filter components" placeholder="Filter by name or purpose…" iconLeft="search" width="360px" value={query} setResult={setQuery} />
      </header>

      {groups.map((group) => {
        const list = visible.filter((e) => e.group === group);
        if (list.length === 0) return null;
        return (
          <section key={group} className="pg-catalog-group">
            <h2>
              {group} <Badge size="small">{list.length}</Badge>
            </h2>
            <div className="pg-catalog">
              {list.map((entry) => {
                const props = generatedPropCount(entry.components ?? [entry.title]);
                return (
                  <button key={entry.id} type="button" className="pg-catalog-card" onClick={() => navigate(`/components/${entry.id}`)}>
                    <span className="pg-catalog-title">
                      {entry.title}
                      <Icon name="chevronRight" size={16} />
                    </span>
                    <span className="pg-catalog-text">{firstSentence(entry.description)}</span>
                    <span className="pg-catalog-meta">
                      {props > 0 && <Badge size="small" variant="outline">{props} props</Badge>}
                      {entry.controls && entry.controls.length > 0 && (
                        <Badge size="small" variant="outline" tone="primary">
                          {entry.controls.length} controls
                        </Badge>
                      )}
                      {entry.examples && entry.examples.length > 0 && (
                        <Badge size="small" variant="outline" tone="info">
                          {entry.examples.length} examples
                        </Badge>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
      {visible.length === 0 && <p className="pg-muted">Nothing matches “{query}”.</p>}
    </article>
  );
}
