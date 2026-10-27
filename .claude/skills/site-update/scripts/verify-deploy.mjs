// בודק שכתובת שנפרסה מגישה בדיוק את ה-build המקומי (dist), ושכל התמונות שהאתר משתמש בהן נטענות.
// הרצה משורש הפרויקט, אחרי build ופריסה:
//   node .claude/skills/site-update/scripts/verify-deploy.mjs https://gabayteam.co.il
import { readFileSync } from "node:fs";

const base = (process.argv[2] ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("שימוש: verify-deploy.mjs <url>");
  process.exit(2);
}

const assetsOf = (html) => [...html.matchAll(/\/assets\/[\w.-]+\.(?:js|css)/g)].map((m) => m[0]).sort();

const localHtml = readFileSync("dist/index.html", "utf8");
const localAssets = assetsOf(localHtml);
// פרמטר אקראי עוקף מטמון של ה-CDN, כדי לראות את מה שנפרס עכשיו
const res = await fetch(`${base}/?verify=${Date.now()}`);
const remoteAssets = assetsOf(await res.text());

let ok = res.ok;
if (!res.ok) {
  console.log(`✗ ${base} החזיר HTTP ${res.status}`);
} else if (localAssets.join() !== remoteAssets.join()) {
  ok = false;
  console.log(`✗ ${base} מגיש build אחר מ-dist המקומי`);
  console.log(`  dist:  ${localAssets.join(", ")}`);
  console.log(`  באתר: ${remoteAssets.join(", ") || "(לא נמצאו קבצי assets)"}`);
} else {
  console.log(`✓ ${base} מגיש את אותו build כמו dist (${localAssets.join(", ")})`);
}

// כל נתיב /images/... שמופיע ב-HTML, ב-JS או ב-CSS שנבנו
const builtText = [localHtml, ...localAssets.map((asset) => readFileSync(`dist${asset}`, "utf8"))].join("\n");
const images = [...new Set([...builtText.matchAll(/\/images\/[\w/.-]+\.(?:webp|png|jpe?g|svg|gif|avif)/g)].map((m) => m[0]))];
const missing = [];
for (const path of images) {
  const image = await fetch(base + path, { method: "HEAD" });
  if (!image.ok) missing.push(`${path} (${image.status})`);
}
if (missing.length) {
  ok = false;
  console.log(`✗ תמונות שלא נטענות: ${missing.join(", ")}`);
} else {
  console.log(`✓ כל ${images.length} התמונות נטענות`);
}

process.exit(ok ? 0 : 1);
