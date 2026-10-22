/**
 * Generates playground/src/docs/props.generated.json — the full prop table of
 * every exported component, read from the TypeScript sources (types, optional
 * flags, JSDoc descriptions and @default tags). Run: `npm run docs:props`.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const entryFiles = ["src/index.ts", "src/markdown/index.ts"].map((file) => path.join(root, file));
const srcDir = path.join(root, "src") + path.sep;
const outFile = path.join(root, "playground/src/docs/props.generated.json");

const parsed = ts.getParsedCommandLineOfConfigFile(path.join(root, "tsconfig.json"), {}, {
  ...ts.sys,
  onUnRecoverableConfigFileDiagnostic: () => {},
});
const program = ts.createProgram(entryFiles, parsed.options);
const checker = program.getTypeChecker();
const FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

const fromSrc = (symbol) =>
  (symbol.declarations ?? []).some((d) => path.normalize(d.getSourceFile().fileName).startsWith(srcDir));

const result = {};
for (const file of entryFiles) {
  const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(file));
  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    if (!/^[A-Z]/.test(exported.name) || result[exported.name]) continue;
    const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if (!(symbol.flags & ts.SymbolFlags.Value)) continue;
    const decl = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (!decl) continue;
    const signatures = checker.getTypeOfSymbolAtLocation(symbol, decl).getCallSignatures();
    const param = signatures[0]?.getParameters()[0];
    if (!param) continue;
    const propsType = checker.getTypeOfSymbolAtLocation(param, decl);
    const props = [];
    for (const prop of checker.getPropertiesOfType(propsType)) {
      if (!fromSrc(prop) || prop.name === "ref" || prop.name === "key") continue;
      const propDecl = prop.valueDeclaration ?? prop.declarations?.[0];
      const propType = checker.getTypeOfSymbolAtLocation(prop, propDecl ?? decl);
      // Expand aliases of literal unions (e.g. ButtonVariant → "primary" | "secondary" | …) so the table is self-explanatory.
      const members = propType.isUnion() ? propType.types : [propType];
      const literalUnion =
        members.some((m) => m.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral)) &&
        members.every((m) => m.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.Undefined));
      const type = (literalUnion
        ? members.filter((m) => !(m.flags & ts.TypeFlags.Undefined)).map((m) => checker.typeToString(m)).join(" | ")
        : checker.typeToString(propType, propDecl, FLAGS)
      )
        .replace(/\s+/g, " ")
        .replace(/ \| undefined$/, "")
        .replace(/^C$/, "ElementType");
      const description = ts
        .displayPartsToString(prop.getDocumentationComment(checker))
        .replace(/\{@link\s+([^}]+)\}/g, "`$1`")
        .replace(/\s+/g, " ")
        .trim();
      const tags = prop.getJsDocTags(checker);
      const def = tags.find((t) => t.name === "default");
      const deprecated = tags.some((t) => t.name === "deprecated");
      props.push({
        name: prop.name,
        type,
        required: !(prop.flags & ts.SymbolFlags.Optional),
        description,
        ...(def ? { default: ts.displayPartsToString(def.text).trim() } : {}),
        ...(deprecated ? { deprecated: true } : {}),
      });
    }
    if (props.length === 0) continue;
    props.sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
    result[exported.name] = props;
  }
}

const sorted = Object.fromEntries(Object.keys(result).sort().map((key) => [key, result[key]]));
writeFileSync(outFile, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`props: ${Object.keys(sorted).length} components → ${path.relative(root, outFile)}`);
