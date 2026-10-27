// הרצה חד-פעמית:  node scripts/download-images.mjs
// מוריד את התמונות המקוריות שהיו מתארחות ב-Base44 / Unsplash אל assets/originals.
// אחר כך: node scripts/optimize-images.mjs יוצר מהן WebP מכווץ ב-public/images.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "originals");
const B44 = "https://media.base44.com/images/public/6877bb8d274d4fc432d2e2f6/";

const files = [
  ["logo.png", B44 + "23fa25ea4_Gemini_Generated_Image_rfrtvbrfrtvbrfrt.png"],
  ["eli-gabay.png", B44 + "cd59d5ee5_EliPro2.png"],
  ["hero-video-poster.png", B44 + "58ef18488_Gemini_Generated_Image_dgl58qdgl58qdgl5.png"],
  ["testimonial-avi-levi.jpg", B44 + "a68ddfb0a_Avilevi.jpg"],
  ["testimonial-cohen.jpg", B44 + "23c58fd6b_9118f877-9a43-415c-97a7-7d09f3048032.jpg"],
  ["hero-bg.jpg", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop&crop=center"],
];

await mkdir(outDir, { recursive: true });

let failed = 0;
for (const [name, url] of files) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(outDir, name), buf);
    console.log(`OK    ${name}  (${Math.round(buf.length / 1024)} KB)`);
  } catch (err) {
    failed++;
    console.error(`FAIL  ${name}  ${err.message}`);
  }
}

console.log(failed ? `\n${failed} קבצים נכשלו - הורד אותם ידנית מהקישורים בקובץ.` : "\nכל התמונות ירדו בהצלחה.");
process.exit(failed ? 1 : 0);
