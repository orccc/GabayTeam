// הרצה:  node scripts/optimize-images.mjs
// יוצר מהתמונות המקוריות ב-assets/originals קבצי WebP מכווצים ב-public/images.
// המקורות לא עולים לאתר; שומרים אותם כדי שאפשר יהיה לייצר מחדש בכל גודל.
//
// תמונות פרויקטים: לשים את המקור (גם ישר מהטלפון) ב-assets/originals/projects/
// ולהריץ שוב. כל קובץ יוצא כ-public/images/projects/<שם>.webp
import { mkdir, readdir, stat } from "node:fs/promises";
import { dirname, extname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets", "originals");
const outDir = join(root, "public", "images");

// [מקור, יעד, הגדרות resize, איכות]
// הגדלים לפי גודל התצוגה באתר, בערך פי 2-3 בשביל מסכים חדים.
const siteImages = [
  ["logo.png", "logo.webp", { height: 160 }, 90],
  ["logo.png", "favicon.png", { width: 64, height: 64, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }],
  ["eli-gabay.png", "eli-gabay.webp", { width: 800 }, 80],
  ["hero-video-poster.png", "hero-video-poster.webp", { width: 1280 }, 80],
  ["hero-bg.jpg", "hero-bg.webp", { width: 1920 }, 72],
  // בהמלצות מוצג עיגול 80px מראש התמונה, אז חותכים מראש ריבוע
  ["testimonial-avi-levi.jpg", "testimonial-avi-levi.webp", { width: 240, height: 240, position: "top" }, 80],
  ["testimonial-cohen.jpg", "testimonial-cohen.webp", { width: 240, height: 240, position: "top" }, 80],
];

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function convert(src, out, resize, quality) {
  // rotate() בלי פרמטרים מיישר לפי ה-EXIF (תמונות טלפון)
  const img = sharp(src).rotate().resize({ withoutEnlargement: true, ...resize });
  if (out.endsWith(".png")) await img.png({ compressionLevel: 9 }).toFile(out);
  else await img.webp({ quality }).toFile(out);
  console.log(`OK    ${basename(out).padEnd(30)} ${kb((await stat(src)).size)} -> ${kb((await stat(out)).size)}`);
}

await mkdir(join(outDir, "projects"), { recursive: true });

let failed = 0;
const run = async (...args) => {
  try {
    await convert(...args);
  } catch (err) {
    failed++;
    console.error(`FAIL  ${basename(args[0])}  ${err.message}`);
  }
};

for (const [src, out, resize, quality] of siteImages) {
  await run(join(srcDir, src), join(outDir, out), resize, quality);
}

const projectFiles = (await readdir(join(srcDir, "projects")).catch(() => []))
  .filter((f) => /\.(jpe?g|png|webp|heic|heif|tiff?)$/i.test(f));
for (const f of projectFiles) {
  const name = basename(f, extname(f));
  await run(join(srcDir, "projects", f), join(outDir, "projects", `${name}.webp`), { width: 1600, height: 1600, fit: "inside" }, 78);
}

console.log(failed ? `\n${failed} קבצים נכשלו.` : `\nהסתיים. ${projectFiles.length} תמונות פרויקטים.`);
process.exit(failed ? 1 : 0);
