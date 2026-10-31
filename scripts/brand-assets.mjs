/**
 * Builds every brand asset from Niket's original logo (images/cropped-nextn-new-logo (1).jpg).
 *
 *   node scripts/brand-assets.mjs
 *
 * Writes, never upscaling the logo itself:
 *   ui/frontend/public/brand/logo-original.jpg  untouched copy (Next.js only serves public/)
 *   ui/frontend/public/brand/logo.webp          the logo as-is
 *   ui/frontend/public/brand/logo-transparent.webp  the logo with its white background made transparent (header)
 *   ui/frontend/public/brand/logo-on-dark.webp  white made transparent, black "SOLUTIONS" recoloured white
 *   ui/frontend/public/brand/logo-mark.webp     the "N" with its circuit tree, transparent, for the hero chip
 *   ui/frontend/src/app/icon.png (512) and apple-icon.png (180), from a square crop around the "N"
 * and prints the sampled logo navy ("N") and sky blue ("EXT").
 *
 * Idempotent: run it again whenever a better logo file arrives.
 */

import { copyFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = join(root, "ui", "frontend");
const require = createRequire(join(frontend, "package.json"));
const sharp = require("sharp");

const source = join(root, "images", "cropped-nextn-new-logo (1).jpg");
const brandDir = join(frontend, "public", "brand");
const appDir = join(frontend, "src", "app");
mkdirSync(brandDir, { recursive: true });

// Regions measured from the 250 x 186 original (rows and columns that hold ink).
const MARK = { left: 4, top: 0, width: 126, height: 153 }; // "N" plus its circuit tree
const EXT = { left: 134, top: 40, width: 114, height: 112 }; // "EXT"

const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
console.log(`source ${width} x ${height}`);

copyFileSync(source, join(brandDir, "logo-original.jpg"));

/* 1. The logo as-is. */
await sharp(source).webp({ quality: 92 }).toFile(join(brandDir, "logo.webp"));

/* 2. On-dark variant: near-white to alpha with soft edges, then black and grey text to white. */
const smooth = (edge0, edge1, x) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

function toTransparent(recolourDarkText) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    // Distance from white, by the lightest channel: JPEG noise on the white background stays under ~14.
    const alpha = smooth(14, 96, 255 - Math.min(r, g, b));
    // Un-mix from white so anti-aliased edges keep their real colour at partial alpha.
    const unmix = (c) => (alpha > 0 ? Math.min(255, Math.max(0, Math.round((c - (1 - alpha) * 255) / alpha))) : 0);
    let [nr, ng, nb] = [unmix(r), unmix(g), unmix(b)];
    if (recolourDarkText && Math.max(nr, ng, nb) - Math.min(nr, ng, nb) < 48 && nr + ng + nb < 420) {
      [nr, ng, nb] = [255, 255, 255];
    }
    out[i * 4] = nr;
    out[i * 4 + 1] = ng;
    out[i * 4 + 2] = nb;
    out[i * 4 + 3] = Math.round(alpha * 255);
  }
  return sharp(out, { raw: { width, height, channels: 4 } });
}

await (await toTransparent(true)).webp({ quality: 92, alphaQuality: 100 }).toFile(join(brandDir, "logo-on-dark.webp"));
await (await toTransparent(false))
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(join(brandDir, "logo-transparent.webp"));
await (await toTransparent(false))
  .extract(MARK)
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(join(brandDir, "logo-mark.webp"));

/* 3. Sample the navy of the "N" and the sky blue of "EXT": median of the saturated pixels in each region. */
function sample(region) {
  const picked = [];
  for (let y = region.top; y < region.top + region.height; y += 1) {
    for (let x = region.left; x < region.left + region.width; x += 1) {
      const i = (y * width + x) * 3;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (Math.max(r, g, b) - Math.min(r, g, b) > 90 && b > r) picked.push([r, g, b]);
    }
  }
  const median = (k) => picked.map((p) => p[k]).sort((a, b) => a - b)[Math.floor(picked.length / 2)];
  return `#${[0, 1, 2].map((k) => median(k).toString(16).padStart(2, "0")).join("")}`;
}
console.log(`logo navy (N):   ${sample({ left: 4, top: 60, width: 60, height: 92 })}`);
console.log(`logo sky (EXT):  ${sample(EXT)}`);

/* 4. Favicons: the "N" mark centred on a white square with breathing room. */
async function favicon(size, file) {
  const inner = Math.round(size * 0.8);
  const mark = await sharp(source)
    .extract(MARK)
    .resize({ width: inner, height: inner, fit: "contain", background: "#ffffff", kernel: "lanczos3" })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(join(appDir, file));
}
await favicon(512, "icon.png");
await favicon(180, "apple-icon.png");
rmSync(join(appDir, "icon.svg"), { force: true });

for (const file of ["logo.webp", "logo-transparent.webp", "logo-on-dark.webp", "logo-mark.webp"]) {
  const meta = await sharp(join(brandDir, file)).metadata();
  console.log(`${file}: ${meta.width} x ${meta.height}, ${(statSync(join(brandDir, file)).size / 1024).toFixed(1)} kB`);
}
console.log("icon.png 512, apple-icon.png 180 written; icon.svg removed");
