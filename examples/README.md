# Examples

Both apps install the library from a locally packed tarball, exactly as it
would be installed from GitHub Packages:

```bash
# from the repository root
npm run pack:local          # builds and writes examples/irt-ui-local.tgz

cd examples/react  && npm install && npm run build   # Vite + React 18
cd examples/nextjs && npm install && npm run build   # Next.js App Router + React 19
```

`react/src/workspace.config.ts` contains the navigation config that used to
be hardcoded inside the library (`layouts/workspace/config`), as an example of
the `WorkspaceConfig` / `WorkspaceVisibility` shapes.
