import { useMemo, useState } from "react";
import { Icon, iconNames, legacyIconAliases, type IconName } from "@itsrighttime/irt-ui/icons";
import { Slider, TextInput } from "@itsrighttime/irt-ui/atoms";
import { CodeBlock } from "../ui/CodeBlock";

const legacyFor = (name: IconName) =>
  Object.entries(legacyIconAliases)
    .filter(([, target]) => target === name)
    .map(([legacy]) => legacy);

export function IconsPage() {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(24);
  const [stroke, setStroke] = useState(2);
  const [copied, setCopied] = useState<string | null>(null);
  const shown = useMemo(() => iconNames.filter((n) => n.toLowerCase().includes(query.toLowerCase())), [query]);

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(`<Icon name="${name}" />`);
      setCopied(name);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <article className="pg-page">
      <header className="pg-page-header">
        <span className="pg-eyebrow">Foundations</span>
        <h1>Icons</h1>
        <p className="pg-lead">
          Every icon resolves through one registry (lucide-react by default). Use semantic names anywhere an icon is accepted; replace any
          icon app-wide with <code>IconProvider</code>. Click an icon to copy its usage.
        </p>
      </header>

      <div className="pg-row pg-toolbar">
        <TextInput placeholder={`Search ${iconNames.length} icons…`} ariaLabel="Search icons" iconLeft="search" value={query} setResult={setQuery} width="280px" />
        <div style={{ width: 220 }}>
          <Slider label="Size" value={size} min={12} max={48} step={2} showRange={false} showValueSide="right" setResult={setSize} width="100%" />
        </div>
        <div style={{ width: 220 }}>
          <Slider label="Stroke" value={stroke} min={1} max={3} step={0.25} precision={100} showRange={false} showValueSide="right" setResult={setStroke} width="100%" />
        </div>
      </div>

      <ul className="pg-icon-grid">
        {shown.map((name) => (
          <li key={name}>
            <button type="button" onClick={() => void copy(name)} title={`Legacy: ${legacyFor(name).join(", ") || "—"}`}>
              <Icon name={name} size={size} strokeWidth={stroke} />
              <span>{copied === name ? "Copied!" : name}</span>
            </button>
          </li>
        ))}
      </ul>

      <section>
        <h2>Usage</h2>
        <CodeBlock
          code={[
            'import { Icon, IconProvider } from "@itsrighttime/irt-ui";',
            "",
            '<Icon name="search" size={20} />',
            '<Icon name="close" label="Close" />          // labelled (role="img")',
            '<Button iconLeft="plus">Add</Button>        // components accept names',
            "",
            "// Replace icons for the whole app (e.g. your own SVG set):",
            "<IconProvider icons={{ close: MyCloseIcon, search: MySearchIcon }} strokeWidth={1.5}>",
            "  <App />",
            "</IconProvider>",
          ].join("\n")}
        />
        <p className="pg-muted">
          Custom icons receive <code>size</code>, <code>color</code>, <code>strokeWidth</code> and SVG props. Old host-app names such as{" "}
          <code>crossIcon</code> still resolve (deprecated).
        </p>
      </section>
    </article>
  );
}
