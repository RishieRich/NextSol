/**
 * Downloads only the Fluent Emoji (3D style) listed in ui/frontend/src/content/emoji.ts
 * from the official repository, converts each to a 160 px WebP of at most 12 kB,
 * and writes them to ui/frontend/public/emoji/<key>.webp. Also writes Microsoft's MIT LICENSE.
 *
 *   node scripts/fetch-emoji.mjs           # fetch only what is missing (idempotent)
 *   node scripts/fetch-emoji.mjs --force   # refetch everything
 *
 * Asset paths are looked up in the repository's file tree, never guessed.
 * Runs at build-preparation time only; the site never loads emoji from a CDN.
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "microsoft/fluentui-emoji";
const BRANCH = "main";
const SIZE = 160;
const MAX_BYTES = 12 * 1024;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = join(root, "ui", "frontend");
const require = createRequire(join(frontend, "package.json"));
const sharp = require("sharp");
const outDir = join(frontend, "public", "emoji");
const force = process.argv.includes("--force");
mkdirSync(outDir, { recursive: true });

// Read the key -> folder map from the content file (the single list of emoji).
const source = readFileSync(join(frontend, "src", "content", "emoji.ts"), "utf8");
const entries = [...source.matchAll(/^\s+(\w+):\s*\{\s*folder:\s*"([^"]+)"/gm)].map((m) => ({ key: m[1], folder: m[2] }));
if (entries.length === 0) throw new Error("No emoji found in content/emoji.ts");

const todo = entries.filter(({ key }) => force || !existsSync(join(outDir, `${key}.webp`)));
console.log(`${entries.length} emoji listed, ${todo.length} to fetch`);

if (todo.length > 0) {
  const treeResponse = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`, {
    headers: { "User-Agent": "next-solutions-web fetch-emoji" },
  });
  if (!treeResponse.ok) throw new Error(`GitHub tree request failed: ${treeResponse.status}`);
  const tree = await treeResponse.json();
  const paths = tree.tree.map((entry) => entry.path);

  for (const { key, folder } of todo) {
    // Plain emoji: assets/<Folder>/3D/x.png. Skin-tone emoji: assets/<Folder>/Default/3D/x.png.
    const asset =
      paths.find((p) => p.startsWith(`assets/${folder}/3D/`) && p.endsWith(".png")) ??
      paths.find((p) => p.startsWith(`assets/${folder}/Default/3D/`) && p.endsWith(".png"));
    if (!asset) throw new Error(`No 3D asset for "${folder}" (key ${key}) in ${REPO}`);

    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${asset.split("/").map(encodeURIComponent).join("/")}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed for ${asset}: ${response.status}`);
    const png = Buffer.from(await response.arrayBuffer());

    let quality = 82;
    let webp;
    do {
      webp = await sharp(png)
        .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality, alphaQuality: 80, effort: 6 })
        .toBuffer();
      quality -= 6;
    } while (webp.length > MAX_BYTES && quality > 30);

    writeFileSync(join(outDir, `${key}.webp`), webp);
    console.log(`${key.padEnd(14)} ${asset}  ->  ${(webp.length / 1024).toFixed(1)} kB`);
  }
}

const licensePath = join(outDir, "LICENSE.txt");
if (force || !existsSync(licensePath)) {
  const license = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/LICENSE`);
  if (!license.ok) throw new Error(`LICENSE download failed: ${license.status}`);
  writeFileSync(
    licensePath,
    `3D emoji in this folder: Microsoft Fluent Emoji (https://github.com/${REPO}), converted to WebP.\n\n${await license.text()}`,
  );
  console.log("LICENSE.txt written");
}

const over = entries.filter(({ key }) => statSync(join(outDir, `${key}.webp`)).size > MAX_BYTES);
if (over.length) throw new Error(`Over ${MAX_BYTES} bytes: ${over.map((e) => e.key).join(", ")}`);
console.log("All emoji present and within budget");
