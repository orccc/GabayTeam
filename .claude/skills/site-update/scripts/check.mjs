// בדיקת תקינות לפני תצוגה מקדימה ולפני פריסה: סופי שורות בקבצי ה-CRLF, lint ו-build.
// הרצה משורש הפרויקט:  node .claude/skills/site-update/scripts/check.mjs
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

// הקבצים האלה שמורים ב-CRLF (ראה CLAUDE.md). sed של Git Bash הופך אותם בשקט ל-LF.
const CRLF_FILES = [
  "index.html",
  "src/pages/Home.jsx",
  "src/components/about/AboutSection.jsx",
  "src/components/testimonials/TestimonialsSection.jsx",
];

let failed = false;

function step(name, run) {
  try {
    const note = run();
    console.log(`✓ ${name}${note ? ` (${note})` : ""}`);
  } catch (err) {
    failed = true;
    const output = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim() || err.message;
    console.log(`✗ ${name}\n${output.split("\n").slice(-20).join("\n")}`);
  }
}

step("סופי שורות CRLF", () => {
  const broken = CRLF_FILES.filter((file) => /(^|[^\r])\n/.test(readFileSync(file, "utf8")));
  if (broken.length) throw new Error(`יש שורות LF בקבצים שצריכים להיות CRLF: ${broken.join(", ")}`);
});

step("lint", () => {
  execSync("npx eslint . --quiet", { stdio: "pipe" });
});

step("build", () => {
  execSync("npm run build", { stdio: "pipe" });
  return readFileSync("dist/index.html", "utf8").match(/assets\/index-[\w-]+\.js/)?.[0];
});

process.exit(failed ? 1 : 0);
