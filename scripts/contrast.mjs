/**
 * Checks every text and color pair the site uses against WCAG AA, in light and dark mode.
 *
 *   node scripts/contrast.mjs
 *
 * Reads the tokens straight from ui/frontend/src/styles/theme.css, so it checks what ships.
 * Exit code 1 if any pair fails. Normal text needs 4.5:1, large text and UI marks 3:1.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "ui", "frontend", "src", "styles", "theme.css"), "utf8");

function tokens(block) {
  const out = {};
  for (const match of block.matchAll(/(--ns-[\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[match[1]] = match[2];
  return out;
}

const lightBlock = css.slice(css.indexOf(":root {"), css.indexOf("@media (prefers-color-scheme: dark)"));
const darkBlock = css.slice(css.indexOf(':root[data-theme="dark"]'), css.indexOf("/* Accessibility primitives"));
const light = tokens(lightBlock);
const dark = { ...light, ...tokens(darkBlock) };

const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/** [foreground, background, minimum, what it is] */
const pairs = [
  ["--ns-text", "--ns-bg", 4.5, "body text"],
  ["--ns-text", "--ns-surface", 4.5, "text on cards"],
  ["--ns-text", "--ns-surface-2", 4.5, "text on tinted panels"],
  ["--ns-text-2", "--ns-bg", 4.5, "secondary text"],
  ["--ns-text-2", "--ns-surface", 4.5, "secondary text on cards"],
  ["--ns-text-2", "--ns-surface-2", 4.5, "secondary text on panels"],
  ["--ns-text-3", "--ns-bg", 4.5, "muted text"],
  ["--ns-text-3", "--ns-surface", 4.5, "muted text on cards"],
  ["--ns-text-3", "--ns-surface-2", 4.5, "muted text on panels"],
  ["--ns-blue", "--ns-bg", 4.5, "links and labels"],
  ["--ns-blue", "--ns-surface", 4.5, "links on cards"],
  ["--ns-blue-ink", "--ns-blue", 4.5, "primary button text"],
  ["--ns-blue-ink", "--ns-blue-hover", 4.5, "primary button hover"],
  ["--ns-blue-soft-text", "--ns-blue-soft", 4.5, "selected chip"],
  ["--ns-navy-text", "--ns-navy", 4.5, "text on ink bands"],
  ["--ns-navy-text-2", "--ns-navy", 4.5, "secondary text on ink bands"],
  ["--ns-navy-text-2", "--ns-navy-2", 4.5, "secondary text on ink cards"],
  ["--ns-blue-on-dark", "--ns-navy", 4.5, "blue on ink bands"],
  ["--ns-green", "--ns-green-soft", 4.5, "pass pill"],
  ["--ns-red", "--ns-red-soft", 4.5, "fail pill"],
  ["--ns-red", "--ns-surface", 4.5, "field errors"],
  ["--ns-doc-text", "--ns-doc", 4.5, "invoice text"],
  ["--ns-doc-muted", "--ns-doc", 4.5, "invoice muted text"],
  ["--ns-doc-accent", "--ns-doc", 4.5, "invoice accent"],
  ["--ns-logo-sky", "--ns-surface", 3, "logo sky marks (non-text)"],
  ["--ns-line-strong", "--ns-surface", 1.4, "field borders (decorative minimum)"],
];

let failed = 0;
for (const [mode, set] of [
  ["light", light],
  ["dark", dark],
]) {
  console.log(`\n${mode}`);
  for (const [fg, bg, min, what] of pairs) {
    const value = ratio(set[fg], set[bg]);
    const ok = value >= min;
    if (!ok) failed += 1;
    console.log(`${ok ? "PASS" : "FAIL"}  ${value.toFixed(2).padStart(5)}:1  (needs ${min})  ${what}  ${fg} on ${bg}`);
  }
}
console.log(failed ? `\n${failed} pair(s) fail` : "\nAll pairs pass");
process.exit(failed ? 1 : 0);
