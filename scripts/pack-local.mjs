// Builds a tarball of the package exactly as it would be published and
// places it at examples/irt-ui-local.tgz for the example apps.
import { execSync } from "node:child_process";
import { renameSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = execSync("npm pack --silent", { cwd: root, encoding: "utf8" }).trim().split("\n").pop();
const target = resolve(root, "examples", "irt-ui-local.tgz");
rmSync(target, { force: true });
renameSync(resolve(root, out), target);
console.log(`Packed ${out} -> examples/irt-ui-local.tgz`);
