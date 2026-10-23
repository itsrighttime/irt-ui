import { copyFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../src");
const pkg = JSON.parse(readFileSync(resolve(here, "../package.json"), "utf8")) as { name: string; version: string };

/** Publishes the agent guide next to the site: <base>/AI_USAGE_GUIDE.md */
function agentGuide(): Plugin {
  const source = resolve(here, "../docs/AI_USAGE_GUIDE.md");
  return {
    name: "irt:agent-guide",
    apply: "build",
    closeBundle() {
      copyFileSync(source, resolve(here, "../site-dist/AI_USAGE_GUIDE.md"));
    },
  };
}

/**
 * The playground consumes the library *source* through the same import paths
 * apps use (`@itsrighttime/irt-ui/...`), so it always documents the code in
 * this commit. GitHub Pages serves it from /irt-ui/ (override with PLAYGROUND_BASE).
 */
export default defineConfig({
  root: here,
  base: process.env.PLAYGROUND_BASE ?? "/irt-ui/",
  plugins: [react(), agentGuide()],
  define: {
    __LIB_NAME__: JSON.stringify(pkg.name),
    __LIB_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: [
      { find: /^@itsrighttime\/irt-ui\/(atoms|layout)$/, replacement: `${src}/components/$1/index.ts` },
      { find: /^@itsrighttime\/irt-ui\/(theme|icons|markdown)$/, replacement: `${src}/$1/index.ts` },
      { find: /^@itsrighttime\/irt-ui\/styles\.css$/, replacement: `${src}/styles/index.css` },
      { find: /^@itsrighttime\/irt-ui$/, replacement: `${src}/index.ts` },
    ],
  },
  build: {
    outDir: resolve(here, "../site-dist"),
    emptyOutDir: true,
    // The lazily loaded syntax highlighter (markdown demo) is large by nature.
    chunkSizeWarningLimit: 1100,
  },
});
