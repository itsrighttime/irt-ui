import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import pkg from "./package.json" with { type: "json" };

const external = [
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.dependencies),
];

const isExternal = (id: string) =>
  external.some((dep) => id === dep || id.startsWith(`${dep}/`));

/**
 * Bundlers drop module-level directives. Because the build preserves one
 * output file per source module, we re-add `"use client"` to every output
 * chunk whose source module declared it (needed for Next.js App Router).
 */
function preserveUseClient(): Plugin {
  const directive = /^\s*(?:\/\/[^\n]*\n\s*|\/\*[\s\S]*?\*\/\s*)*["']use client["'];?/;
  return {
    name: "irt:preserve-use-client",
    apply: "build",
    renderChunk(code, chunk) {
      const id = chunk.facadeModuleId;
      if (!id || !/\.(t|j)sx?$/.test(id)) return null;
      let source: string;
      try {
        source = readFileSync(id, "utf8");
      } catch {
        return null;
      }
      if (!directive.test(source) || directive.test(code)) return null;
      return { code: `"use client";\n${code}`, map: null };
    },
  };
}

const srcDir = resolve(__dirname, "src");
const distDir = resolve(__dirname, "dist");

/**
 * Declarations are emitted with extensionless relative specifiers
 * (`"./Button"`), which `moduleResolution: node16/nodenext` consumers cannot
 * resolve. Rewrite them to the emitted file (`"./Button.js"` or
 * `"./Button/index.js"`) based on the source tree.
 */
function addDtsExtensions(filePath: string, content: string): string {
  const sourceDir = resolve(srcDir, relative(distDir, dirname(filePath)));
  return content.replace(/(from\s+|import\(\s*)(["'])(\.{1,2}\/[^"']+)\2/g, (match, lead: string, quote: string, spec: string) => {
    if (/\.(js|mjs|cjs|json|css)$/.test(spec)) return match;
    const base = resolve(sourceDir, spec);
    const isFile = [".ts", ".tsx"].some((ext) => existsSync(base + ext));
    if (isFile) return `${lead}${quote}${spec}.js${quote}`;
    if (existsSync(base) && statSync(base).isDirectory()) return `${lead}${quote}${spec}/index.js${quote}`;
    return match;
  });
}

/** Ships `styles.css.d.ts` so `import "@itsrighttime/irt-ui/styles.css"` type-checks everywhere. */
function stylesheetTypes(): Plugin {
  return {
    name: "irt:stylesheet-types",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "styles.css.d.ts",
        source: "// Side-effect stylesheet import: import \"@itsrighttime/irt-ui/styles.css\";\nexport {};\n",
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    preserveUseClient(),
    stylesheetTypes(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      entryRoot: "src",
      outDirs: "dist",
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/theme/generateTokensCss.ts"],
      beforeWriteFile: (filePath, content) => ({ filePath, content: addDtsExtensions(filePath, content) }),
    }),
  ],
  css: {
    modules: {
      // Stable, prefixed, collision-free class names in the shipped CSS.
      generateScopedName: "irt-[name]__[local]__[hash:base64:5]",
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "components/atoms/index": resolve(__dirname, "src/components/atoms/index.ts"),
        "components/layout/index": resolve(__dirname, "src/components/layout/index.ts"),
        "theme/index": resolve(__dirname, "src/theme/index.ts"),
        "icons/index": resolve(__dirname, "src/icons/index.ts"),
        "markdown/index": resolve(__dirname, "src/markdown/index.ts"),
      },
      formats: ["es"],
      cssFileName: "styles",
    },
    rollupOptions: {
      external: (id) => isExternal(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
  test: {
    pool: "forks",
    maxWorkers: 1,
  },
});
