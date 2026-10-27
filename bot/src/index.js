// הפעלה: npm start (קורא את .env), או כשירות systemd (ראה README.md)
import { existsSync } from "node:fs";
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

// ספריית Firestore זורקת שגיאת הרשאות פעמיים, ואת אחת מהן אף אחד לא תופס.
// בלי זה Node מפיל את הבוט, וטלגרם שולח שוב את אותה לחיצה בכל הפעלה – לולאה של קריסות.
// השגיאה עצמה כבר מטופלת ב-bot.catch, אז כאן רק רושמים אותה.
process.on("unhandledRejection", (error) => {
  console.error(`[${new Date().toISOString()}] unhandled rejection: ${error?.message ?? error}`);
});

const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credentials && !existsSync(credentials)) {
  console.warn(`קובץ ה-service account לא נמצא (${credentials}). הבוט עולה, אבל לא יוכל לקרוא או לשמור המלצות.`);
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
