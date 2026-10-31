/**
 * Works around a Windows-only bug in Next.js 16's static exporter.
 *
 * The client fetches segment prefetch files with flat names, e.g. `about/__next.about.__PAGE__.txt`
 * (see convertSegmentPathToStaticExportFilename in next/dist/shared/lib/segment-cache). On Windows the
 * exporter builds that name from a path with backslashes, so it writes `about/__next.about/__PAGE__.txt`
 * instead, and every client-side prefetch 404s. Builds on Linux or macOS are unaffected (this script
 * then finds nothing to do).
 *
 * Usage (runs after `next build`): node scripts/fix-export-segments.mjs [outDir]
 */

import { readdir, rename, rm, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.argv[2] ?? fileURLToPath(new URL("../ui/frontend/out", import.meta.url));

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function fix(dir) {
  let moved = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await walk(full)) {
        const flat = `${entry.name}.${relative(full, file).split(sep).join(".")}`;
        await rename(file, join(dir, flat));
        moved += 1;
      }
      await rm(full, { recursive: true, force: true });
    } else {
      moved += await fix(full);
    }
  }
  return moved;
}

if (!(await stat(outDir).catch(() => null))?.isDirectory()) {
  console.error(`No export folder at ${outDir}`);
  process.exit(1);
}
const moved = await fix(outDir);
console.log(moved ? `fix-export-segments: flattened ${moved} segment files` : "fix-export-segments: nothing to fix");
