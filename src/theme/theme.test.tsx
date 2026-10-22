import { render, screen, act } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./useTheme";
import { defaultTheme } from "./defaultTheme";
import { deepMerge, resolveTheme, themeToCssVars, themeVar, validateThemeConfig } from "./resolveTheme";
import type { ThemeConfig } from "./types";

function Probe() {
  const { theme, mode, resolvedMode, setMode } = useTheme();
  return (
    <div>
      <span data-testid="primary">{theme.colors.primary}</span>
      <span data-testid="font">{theme.typography.fontFamily.base}</span>
      <span data-testid="mode">{`${mode}/${resolvedMode}`}</span>
      <button onClick={() => setMode("dark")}>dark</button>
    </div>
  );
}

const styleText = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("style"))
    .map((s) => s.textContent ?? "")
    .join("\n");

describe("resolveTheme / deepMerge", () => {
  it("returns the default theme without config", () => {
    expect(resolveTheme(undefined)).toEqual(defaultTheme);
  });

  it("applies partial overrides without dropping siblings", () => {
    const t = resolveTheme({ colors: { primary: "#7c3aed" }, typography: { fontFamily: { base: "Poppins" } } });
    expect(t.colors.primary).toBe("#7c3aed");
    expect(t.colors.secondary).toBe(defaultTheme.colors.secondary);
    expect(t.typography.fontFamily.base).toBe("Poppins");
    expect(t.typography.fontFamily.mono).toBe(defaultTheme.typography.fontFamily.mono);
  });

  it("applies dark overrides only in dark mode", () => {
    const config: ThemeConfig = { colors: { primary: "#111" }, dark: { colors: { primary: "#eee" } } };
    expect(resolveTheme(config, "light").colors.primary).toBe("#111");
    expect(resolveTheme(config, "dark").colors.primary).toBe("#eee");
    expect(resolveTheme(undefined, "dark").colors.background).not.toBe(defaultTheme.colors.background);
  });

  it("does not mutate inputs", () => {
    const base = { a: { b: 1, c: 2 } };
    deepMerge(base, { a: { b: 3 } });
    expect(base.a.b).toBe(1);
  });

  it("accepts JSON configuration", () => {
    const json = JSON.parse('{"colors":{"primary":"#ff0000"},"radius":{"md":"4px"}}') as ThemeConfig;
    const t = resolveTheme(json);
    expect(t.colors.primary).toBe("#ff0000");
    expect(t.radius.md).toBe("4px");
  });
});

describe("themeToCssVars / themeVar", () => {
  it("emits prefixed, kebab-cased variables", () => {
    const vars = themeToCssVars(defaultTheme);
    expect(vars["--irt-color-primary"]).toBe(defaultTheme.colors.primary);
    expect(vars["--irt-color-on-primary"]).toBe(defaultTheme.colors.onPrimary);
    expect(vars["--irt-font-size-sm"]).toBe(defaultTheme.typography.fontSize.sm);
    expect(vars["--irt-font-size-base"]).toBe(defaultTheme.typography.baseFontSize);
    expect(vars["--irt-space-md"]).toBe(defaultTheme.spacing.md);
    expect(vars["--irt-z-modal"]).toBe(defaultTheme.layout.zIndex.modal);
    expect(Object.keys(vars).some((k) => k.includes("components"))).toBe(false);
  });

  it("builds var() references from theme paths", () => {
    expect(themeVar("colors.textMuted")).toBe("var(--irt-color-text-muted)");
    expect(themeVar("layout.zIndex.modal")).toBe("var(--irt-z-modal)");
    expect(themeVar("spacing.sm", "8px")).toBe("var(--irt-space-sm, 8px)");
  });
});

describe("validateThemeConfig", () => {
  it("reports unknown keys and wrong types", () => {
    const issues = validateThemeConfig({ colors: { primry: "#000", primary: 3 }, dark: { nope: 1 } });
    expect(issues.map((i) => i.path).sort()).toEqual(["colors.primary", "colors.primry", "dark.nope"]);
  });

  it("accepts a valid config", () => {
    expect(validateThemeConfig({ colors: { primary: "#000" }, components: { tooltip: { delay: 0 } } })).toEqual([]);
  });
});

describe("<ThemeProvider>", () => {
  it("works without a provider (defaults)", () => {
    render(<Probe />);
    expect(screen.getByTestId("primary")).toHaveTextContent(defaultTheme.colors.primary);
  });

  it("renders global CSS variables with overrides", () => {
    const { container } = render(
      <ThemeProvider theme={{ colors: { primary: "#7c3aed" } }}>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("primary")).toHaveTextContent("#7c3aed");
    const css = styleText(container);
    expect(css).toContain(":root{");
    expect(css).toContain("--irt-color-primary:#7c3aed;");
  });

  it("scopes nested providers locally", () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeProvider theme={{ colors: { primary: "#123456" } }}>
          <Probe />
        </ThemeProvider>
      </ThemeProvider>,
    );
    const css = styleText(container);
    expect(css).toMatch(/\[data-irt-theme="[^"]+"\]\{[^}]*--irt-color-primary:#123456;/);
    expect(screen.getByTestId("primary")).toHaveTextContent("#123456");
  });

  it("switches mode at runtime", () => {
    const { container } = render(
      <ThemeProvider theme={{ dark: { colors: { primary: "#abcdef" } } }}>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("light/light");
    act(() => screen.getByText("dark").click());
    expect(screen.getByTestId("mode")).toHaveTextContent("dark/dark");
    expect(screen.getByTestId("primary")).toHaveTextContent("#abcdef");
    expect(styleText(container)).toContain("color-scheme:dark");
  });

  it("emits a prefers-color-scheme block in system mode", () => {
    const { container } = render(
      <ThemeProvider defaultMode="system">
        <Probe />
      </ThemeProvider>,
    );
    expect(styleText(container)).toContain("@media (prefers-color-scheme: dark)");
  });

  it("updates CSS when the theme prop changes", () => {
    const { container, rerender } = render(<ThemeProvider theme={{ colors: { primary: "#000001" } }} />);
    expect(styleText(container)).toContain("--irt-color-primary:#000001;");
    rerender(<ThemeProvider theme={{ colors: { primary: "#000002" } }} />);
    expect(styleText(container)).toContain("--irt-color-primary:#000002;");
  });

  it("sanitises values that could escape the style tag", () => {
    const { container } = render(
      <ThemeProvider validate={false} theme={{ colors: { primary: "red;}</style><script>" } }} />,
    );
    const css = styleText(container);
    expect(css).not.toContain("</style>");
    expect(css).toContain("--irt-color-primary:red/stylescript;");
  });
});
