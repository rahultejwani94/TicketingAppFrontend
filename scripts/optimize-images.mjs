#!/usr/bin/env node
/**
 * optimize-images.mjs
 * ─────────────────────────────────────────────────────────────
 * Batch-resizes and compresses images in your `public/` folder.
 * By default it writes results to a separate output folder —
 * your originals are never touched until you've checked the
 * results and copy them over yourself.
 *
 * USAGE
 *   node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --src public --out public-optimized
 *   node scripts/optimize-images.mjs --max-width 1600 --quality 75
 *   node scripts/optimize-images.mjs --keep-format     (no .webp conversion — see below)
 *   node scripts/optimize-images.mjs --in-place         (⚠ overwrites originals, see below)
 *
 * MODES
 *   Default        → converts everything to compressed .webp in a
 *                     separate folder (best compression, but you'll
 *                     need to update any "*.jpg"/"*.png" paths in
 *                     your code to "*.webp" afterwards).
 *   --keep-format   → resizes + compresses but keeps the original
 *                     format/extension, so zero code changes needed.
 *                     Compression gains are smaller than WebP, but
 *                     still meaningful (especially the resizing).
 *   --in-place      → writes directly back into --src, replacing
 *                     originals. Only use this after you've reviewed
 *                     a normal run and you're confident in the result.
 *                     Make a git commit (or backup) first either way.
 *
 * REQUIRES
 *   npm install -D sharp
 * ─────────────────────────────────────────────────────────────
 */

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

// ── Parse CLI args ──────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const hasFlag = (name) => args.includes(`--${name}`);

const SRC_DIR = path.resolve(process.cwd(), getArg("src", "public"));
const IN_PLACE = hasFlag("in-place");
const KEEP_FORMAT = hasFlag("keep-format") || IN_PLACE;
const OUT_DIR = IN_PLACE
  ? SRC_DIR
  : path.resolve(process.cwd(), getArg("out", "public-optimized"));
const MAX_WIDTH = parseInt(getArg("max-width", "1920"), 10);
const QUALITY = parseInt(getArg("quality", "80"), 10);

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Small/already-optimized files you almost never want touched —
// icons, manifest images, favicons. Add filenames here as needed.
const SKIP_FILENAMES = new Set([
  "favicon.ico",
  "favicon.svg",
  "favicon-96x96.png",
  "apple-touch-icon.png",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
]);

let totalBefore = 0;
let totalAfter = 0;
let processedCount = 0;
let skippedCount = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else {
      await processFile(fullPath);
    }
  }
}

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const filename = path.basename(filePath);

  if (!IMAGE_EXTENSIONS.has(ext) || SKIP_FILENAMES.has(filename)) return;

  const relativePath = path.relative(SRC_DIR, filePath);
  const outExt = KEEP_FORMAT ? ext : ".webp";
  const outRelative = relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, outExt);
  const outPath = path.join(OUT_DIR, outRelative);

  try {
    const beforeSize = (await fs.stat(filePath)).size;
    await fs.mkdir(path.dirname(outPath), { recursive: true });

    // Write to a temp file first — writing directly to outPath fails when
    // outPath is the same file currently being read (e.g. --in-place
    // with --keep-format, where input and output paths are identical).
    const tempOutPath = `${outPath}.tmp-${process.pid}`;

    const image = sharp(filePath);
    const metadata = await image.metadata();

    const pipeline =
      metadata.width && metadata.width > MAX_WIDTH
        ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
        : image;

    const targetFormat = KEEP_FORMAT
      ? ext.replace(".", "").replace("jpg", "jpeg")
      : "webp";

    if (targetFormat === "jpeg") {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tempOutPath);
    } else if (targetFormat === "png") {
      await pipeline.png({ compressionLevel: 9 }).toFile(tempOutPath);
    } else {
      await pipeline.webp({ quality: QUALITY }).toFile(tempOutPath);
    }

    const afterSize = (await fs.stat(tempOutPath)).size;
    await fs.rename(tempOutPath, outPath);

    // If the original lives at a different path than the output (format
    // conversion, or a case-only rename like .JPG → .jpg), clean it up.
    if (IN_PLACE && path.resolve(outPath) !== path.resolve(filePath)) {
      await fs.unlink(filePath).catch(() => {});
    }

    totalBefore += beforeSize;
    totalAfter += afterSize;
    processedCount++;

    const savedPct = Math.round((1 - afterSize / beforeSize) * 100);
    const flag = savedPct < 0 ? " (grew — already optimized?)" : "";
    console.log(
      `✓ ${relativePath}  ${formatBytes(beforeSize)} → ${formatBytes(afterSize)}  (${savedPct >= 0 ? "-" : "+"}${Math.abs(savedPct)}%)${flag}`
    );
  } catch (err) {
    console.error(`✗ Failed: ${relativePath} — ${err.message}`);
    skippedCount++;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  try {
    await fs.access(SRC_DIR);
  } catch {
    console.error(`\n✗ Source folder not found: ${SRC_DIR}`);
    console.error(`  Run this from your project root, or pass --src <folder>.\n`);
    process.exit(1);
  }

  console.log(`\nScanning ${SRC_DIR} ...`);
  console.log(`Max width: ${MAX_WIDTH}px · Quality: ${QUALITY}`);
  console.log(
    IN_PLACE
      ? `⚠  --in-place: originals will be replaced\n`
      : KEEP_FORMAT
        ? `Output → ${OUT_DIR} (same formats, originals untouched)\n`
        : `Output → ${OUT_DIR} (converting to .webp, originals untouched)\n`
  );

  await walk(SRC_DIR);

  console.log(`\n${"─".repeat(50)}`);
  console.log(
    `Processed: ${processedCount} image${processedCount === 1 ? "" : "s"}${skippedCount ? `, skipped: ${skippedCount}` : ""}`
  );
  console.log(`Total size: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}`);
  if (totalBefore > 0) {
    console.log(`Savings: ${Math.round((1 - totalAfter / totalBefore) * 100)}%`);
  }
  if (!IN_PLACE) {
    console.log(`\nReview the output in ${path.relative(process.cwd(), OUT_DIR)}/`);
    if (!KEEP_FORMAT) {
      console.log(
        `Since this converted files to .webp, update any "*.jpg"/"*.png" paths`
      );
      console.log(`in your config files (pastEvents.js, event.js, etc.) to "*.webp".`);
    }
    console.log(`If it looks good, copy the contents over your public/ folder.`);
  }
  console.log(`${"─".repeat(50)}\n`);
}

main();
