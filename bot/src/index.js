// הפעלה: npm start (קורא את .env), או כשירות systemd (ראה README.md)
import { createBot } from "./bot.js";
import { connectFirestore, testimonialsRepo } from "./db.js";
// ההמלצות המקוריות של האתר, בשביל כפתור הייבוא. לכן הבוט רץ מתוך עותק מלא של הריפו.
import { defaultTestimonials } from "../../src/data/testimonials.js";

function env(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) {
    console.error(`חסר משתנה סביבה ${name} (ראה .env.example)`);
    process.exit(1);
  }
  return value;
}

const adminIds = (process.env.ADMIN_IDS ?? "")
  .split(",")
  .map((id) => Number(id.trim()))
  .filter(Boolean);

const bot = createBot({
  token: env("TELEGRAM_BOT_TOKEN"),
  adminIds,
  repo: testimonialsRepo(connectFirestore(env("FIREBASE_PROJECT_ID", "gabayteam-6d556"))),
  defaultTestimonials,
  siteUrl: env("SITE_URL", "https://gabayteam.co.il"),
});

if (!adminIds.length) {
  console.warn("ADMIN_IDS ריק, כך שאף אחד לא יכול לערוך. שלח /start לבוט כדי לקבל את המזהה שלך.");
}

await bot.api.setMyCommands([{ command: "start", description: "תפריט ראשי" }]);
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
await bot.start({
  onStart: (me) => console.log(`@${me.username} פועל. מורשים: ${adminIds.join(", ") || "אף אחד"}`),
});
