// Generate OG image (1200x630) + apple-touch-icon (180x180) from a hero source.
// Run with: node scripts/generate-og-and-touch.mjs
//
// Pattern from D:\mekra.pl\scripts\generate-og-and-touch.mjs — adapt the
// composite layout per project (background color, accent line, brand text).

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const PUBLIC_DIR = "public";
const SRC_HERO = "src/assets/og-source.jpg"; // 1920+ wide source

await mkdir(PUBLIC_DIR, { recursive: true });

// 1. OG image — 1200x630
await sharp(SRC_HERO)
  .resize(1200, 630, { fit: "cover", position: "center" })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(join(PUBLIC_DIR, "og-image.jpg"));

console.log("✓ public/og-image.jpg");

// 2. apple-touch-icon — 180x180 (square crop from same source or dedicated logo)
await sharp(SRC_HERO)
  .resize(180, 180, { fit: "cover" })
  .png({ quality: 90 })
  .toFile(join(PUBLIC_DIR, "apple-touch-icon.png"));

console.log("✓ public/apple-touch-icon.png");
