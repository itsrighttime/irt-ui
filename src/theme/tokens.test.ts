import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateTokensCss } from "./generateTokensCss";

const file = resolve(__dirname, "../styles/tokens.css");

describe("styles/tokens.css", () => {
  it("is in sync with the default theme (npm run tokens to regenerate)", () => {
    const expected = generateTokensCss();
    // `npm run tokens` (or UPDATE_TOKENS=1) regenerates the file.
    if (process.env.UPDATE_TOKENS || process.env.npm_lifecycle_event === "tokens") {
      writeFileSync(file, expected);
    }
    expect(readFileSync(file, "utf8")).toBe(expected);
  });
});
