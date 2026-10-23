import { useMemo, useState } from "react";
import { Button, RadioGroup, SingleDropdown, Slider, Tooltip, JsonField } from "@itsrighttime/irt-ui/atoms";
import { resolveTheme, validateThemeConfig, type ThemeColors, type ThemeConfig, type ThemeModePreference } from "@itsrighttime/irt-ui/theme";
import { presets } from "../state/presets";
import { pruneConfig, usePlaygroundTheme } from "../state/themeStore";
import { CodeBlock } from "../ui/CodeBlock";
import { ColorField } from "../ui/ColorField";
import { ThemePreview } from "./ThemePreview";

const COLOR_FIELDS: Array<[keyof ThemeColors, string, string]> = [
  ["primary", "Primary", "Main brand colour (buttons, focus, active states)"],
  ["onPrimary", "On primary", "Text/icons on primary fills"],
  ["secondary", "Secondary", ""],
  ["accent", "Accent", "Link-style buttons and highlights"],
  ["background", "Background", "Page background"],
  ["surface", "Surface", "Cards, inputs, menus"],
  ["surfaceMuted", "Surface muted", "Table, sidebar and subtle backgrounds"],
  ["text", "Text", ""],
  ["textMuted", "Text muted", ""],
  ["border", "Border", ""],
  ["borderStrong", "Border strong", "Hovered control borders, switch track"],
  ["success", "Success", ""],
  ["warning", "Warning", ""],
  ["danger", "Danger", "Errors and destructive actions"],
  ["info", "Info", ""],
  ["focus", "Focus ring", ""],
];

const FONTS: Record<string, string> = {
  System: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  Inter: "Inter, system-ui, sans-serif",
  Poppins: "Poppins, system-ui, sans-serif",
  Roboto: "Roboto, system-ui, sans-serif",
  "Lora (serif)": "Lora, Georgia, serif",
  "JetBrains Mono": '"JetBrains Mono", ui-monospace, monospace',
};

const px = (n: number) => `${Math.round(n * 100) / 100}px`;
const fontName = (family: string) => Object.entries(FONTS).find(([, v]) => v === family)?.[0] ?? "System";
const shade = (color: string, mix: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, ${mix})`;

export function ThemePage() {
  const { config, mode, setMode, patch, setConfig, reset } = usePlaygroundTheme();
  const [target, setTarget] = useState<"light" | "dark">("light");
  const [format, setFormat] = useState<"ts" | "json">("ts");
  const [importError, setImportError] = useState("");

  const light = useMemo(() => resolveTheme(config, "light"), [config]);
  const dark = useMemo(() => resolveTheme(config, "dark"), [config]);
  const editing = target === "dark" ? dark : light;

  const baseSize = Number.parseFloat(light.typography.fontSize.md) * (light.typography.fontSize.md.endsWith("rem") ? 16 : 1);
  const radiusScale = Number.parseFloat(light.radius.md) / (light.radius.md.endsWith("rem") ? 0.5 : 8);
  const spaceScale = Number.parseFloat(light.spacing.md) / (light.spacing.md.endsWith("rem") ? 1 : 16);

  const setColor = (key: keyof ThemeColors, value: string) => {
    const colors: Partial<ThemeColors> = { [key]: value };
    if (key === "primary") {
      colors.primaryHover = shade(value, "black", 85);
      colors.primaryActive = shade(value, "black", 70);
      colors.primarySubtle = shade(value, target === "dark" ? "black" : "white", 12);
      colors.hover = shade(value, "transparent", 10);
      colors.active = shade(value, "transparent", 18);
    }
    patch({ colors }, target);
  };

  const exported = useMemo(() => pruneConfig(config) as ThemeConfig, [config]);
  const json = JSON.stringify(exported, null, 2);
  const ts = `import type { ThemeConfig } from "@itsrighttime/irt-ui/theme";\n\nexport const theme = ${json.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, "$1:")} satisfies ThemeConfig;\n`;
  const issues = validateThemeConfig(config);

  return (
    <div className="pg-theme">
      <aside className="pg-theme-editor" aria-label="Theme editor">
        <div className="pg-panel-head">
          <h1>Theme builder</h1>
          <Button size="small" variant="ghost" iconLeft="refresh" onClick={reset}>
            Reset
          </Button>
        </div>
        <p className="pg-muted">Edits apply live to the whole site and are saved in this browser.</p>

        <h2>Preset</h2>
        <SingleDropdown
          options={presets.map((p) => p.name)}
          placeholder="Start from a preset"
          setResult={(name) => {
            const preset = presets.find((p) => p.name === name);
            if (preset) setConfig(preset.config);
          }}
          width="100%"
        />

        <h2>Mode</h2>
        <RadioGroup
          options={["light", "dark", "system"]}
          value={mode}
          setResult={(m) => m && setMode(m as ThemeModePreference)}
          layout="horizontal"
          width="100%"
        />

        <h2>Colours</h2>
        <RadioGroup
          options={[
            { value: "light", label: "Light theme" },
            { value: "dark", label: "Dark overrides" },
          ]}
          value={target}
          setResult={(t) => t && setTarget(t as "light" | "dark")}
          layout="horizontal"
          width="100%"
        />
        <div className="pg-color-grid">
          {COLOR_FIELDS.map(([key, label, hint]) => (
            <ColorField key={key} label={label} hint={hint} value={editing.colors[key]} onChange={(v) => setColor(key, v)} />
          ))}
        </div>

        <h2>Typography</h2>
        <SingleDropdown
          options={Object.keys(FONTS)}
          placeholder="Font family"
          label="Font family"
          value={fontName(light.typography.fontFamily.base)}
          setResult={(name) => {
            const family = FONTS[name];
            if (family) patch({ typography: { fontFamily: { base: family, heading: family } } });
          }}
          width="100%"
        />
        <Slider
          label="Base font size (px)"
          value={Math.round(baseSize)}
          min={12}
          max={20}
          step={1}
          showRange={false}
          showValueSide="right"
          width="100%"
          setResult={(n) =>
            patch({
              typography: {
                baseFontSize: px(n),
                fontSize: { xs: px(n * 0.75), sm: px(n * 0.875), md: px(n), lg: px(n * 1.25), xl: px(n * 1.5), "2xl": px(n * 2) },
              },
            })
          }
        />

        <h2>Shape & spacing</h2>
        <Slider
          label="Corner radius ×"
          value={Math.round(radiusScale * 4) / 4}
          min={0}
          max={3}
          step={0.25}
          precision={100}
          showRange={false}
          showValueSide="right"
          width="100%"
          setResult={(k) => patch({ radius: { sm: px(4 * k), md: px(8 * k), lg: px(12 * k) } })}
        />
        <Slider
          label="Spacing ×"
          value={Math.round(spaceScale * 4) / 4}
          min={0.5}
          max={2}
          step={0.25}
          precision={100}
          showRange={false}
          showValueSide="right"
          width="100%"
          setResult={(k) =>
            patch({ spacing: { xs: px(4 * k), sm: px(8 * k), md: px(16 * k), lg: px(24 * k), xl: px(32 * k), "2xl": px(48 * k) } })
          }
        />

        <h2>Component defaults</h2>
        <div className="pg-grid-2">
          <SingleDropdown
            label="Button variant"
            placeholder="Button variant"
            options={["primary", "secondary", "tertiary", "ghost", "destructive"]}
            value={light.components.button.variant}
            setResult={(v) => v && patch({ components: { button: { variant: v as "primary" } } })}
            width="100%"
          />
          <SingleDropdown
            label="Button size"
            placeholder="Button size"
            options={["small", "medium", "large"]}
            value={light.components.button.size}
            setResult={(v) => v && patch({ components: { button: { size: v as "medium" } } })}
            width="100%"
          />
          <SingleDropdown
            label="Input variant"
            placeholder="Input variant"
            options={["outline", "filled", "ghost", "underline"]}
            value={light.components.input.variant}
            setResult={(v) => v && patch({ components: { input: { variant: v as "outline" } } })}
            width="100%"
          />
          <SingleDropdown
            label="Tooltip delay"
            placeholder="Tooltip delay"
            options={["0", "300", "800", "1500"]}
            value={String(light.components.tooltip.delay)}
            setResult={(v) => v && patch({ components: { tooltip: { delay: Number(v) } } })}
            width="100%"
          />
        </div>

        <h2>Import JSON</h2>
        <p className="pg-muted">Paste a theme exported from here (or any JSON with the ThemeConfig shape).</p>
        <JsonField
          setResult={(text) => {
            try {
              const parsed = JSON.parse(text) as ThemeConfig;
              const problems = validateThemeConfig(parsed);
              setImportError(problems.map((p) => `${p.path}: ${p.message}`).join("; "));
              setConfig(parsed);
            } catch {
              setImportError("Invalid JSON");
            }
          }}
          setIsFieldValid={() => undefined}
          width="100%"
          isBorder
        />
        {importError && <p className="pg-warn">{importError}</p>}
      </aside>

      <div className="pg-theme-output">
        <section>
          <div className="pg-panel-head">
            <h2>Your theme</h2>
            <div className="pg-row">
              <Button size="small" variant={format === "ts" ? "primary" : "secondary"} onClick={() => setFormat("ts")}>
                theme.ts
              </Button>
              <Button size="small" variant={format === "json" ? "primary" : "secondary"} onClick={() => setFormat("json")}>
                theme.json
              </Button>
              <Tooltip content="Downloads the file shown below" delay={200}>
                <Button
                  size="small"
                  variant="ghost"
                  iconLeft="upload"
                  onClick={() => {
                    const blob = new Blob([format === "ts" ? ts : json], { type: "text/plain" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = format === "ts" ? "theme.ts" : "theme.json";
                    a.click();
                    URL.revokeObjectURL(a.href);
                  }}
                >
                  Download
                </Button>
              </Tooltip>
            </div>
          </div>
          <CodeBlock code={format === "ts" ? ts : json} title={format === "ts" ? "theme.ts" : "theme.json"} language={format} />
          {issues.length > 0 && <p className="pg-warn">{issues.length} validation issue(s) — see console.</p>}
          <CodeBlock
            title="usage"
            code={`import "@itsrighttime/irt-ui/styles.css";\nimport { ThemeProvider } from "@itsrighttime/irt-ui/theme";\nimport { theme } from "./theme";\n\n<ThemeProvider theme={theme} defaultMode="${mode}">\n  <App />\n</ThemeProvider>`}
          />
        </section>
        <section>
          <h2>Preview</h2>
          <ThemePreview />
        </section>
      </div>
    </div>
  );
}
