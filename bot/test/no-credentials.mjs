// בדיקה: כשקובץ ה-service account חסר, הבוט עונה הודעה ברורה, סוגר את הכפתור ולא נופל.
// רץ בלי אמולטור, כחלק מ-npm test.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createBot } from "../src/bot.js";
import { connectFirestore, testimonialsRepo } from "../src/db.js";
import { defaultTestimonials } from "../../src/data/testimonials.js";

delete process.env.FIRESTORE_EMULATOR_HOST;
process.env.GOOGLE_APPLICATION_CREDENTIALS = join(tmpdir(), "no-such-service-account.json");

// כמו ב-index.js: השגיאה הכפולה של Firestore לא מפילה את התהליך
let strayRejections = 0;
process.on("unhandledRejection", () => strayRejections++);

const ADMIN = 111;
const bot = createBot({
  token: "TEST",
  adminIds: [ADMIN],
  repo: testimonialsRepo(connectFirestore("demo-gabay")),
  defaultTestimonials,
  siteUrl: "https://example.test",
  botInfo: { id: 1, is_bot: true, first_name: "Gabay", username: "gabay_test_bot" },
});
const calls = [];
bot.api.config.use(async (_prev, method, payload) => {
  calls.push({ method, payload });
  return { ok: true, result: method === "answerCallbackQuery" ? true : { message_id: 1, date: 0, chat: { id: ADMIN, type: "private" } } };
});

const realConsoleError = console.error;
console.error = () => {}; // השגיאה הצפויה לא צריכה להציף את פלט הבדיקה
// בהרצה אמיתית (bot.start) שגיאות עוברות ל-bot.catch; כאן מעבירים בעצמנו, באותה דרך
try {
  await bot.handleUpdate({
    update_id: 1,
    callback_query: {
      id: "1", from: { id: ADMIN, is_bot: false, first_name: "Test" }, chat_instance: "c", data: "t:list",
      message: { message_id: 1, date: 0, chat: { id: ADMIN, type: "private" }, text: "תפריט" },
    },
  });
} catch (error) {
  await bot.errorHandler(error);
}
await new Promise((resolve) => setTimeout(resolve, 500));
console.error = realConsoleError;

const reply = calls.find((c) => c.method === "sendMessage");
assert.match(reply?.payload.text ?? "", /service account/);
assert.ok(calls.some((c) => c.method === "answerCallbackQuery"), "הכפתור לא נסגר");
console.log(`✓ בלי קובץ service account: הודעה ברורה, הכפתור נסגר, והבוט לא נופל (${strayRejections} שגיאה תועה נתפסה)`);
process.exit(0);
