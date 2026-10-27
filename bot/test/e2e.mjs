// בדיקת קצה-לקצה של הבוט מול אמולטור Firestore, בלי טלגרם אמיתי.
// הרצה מתיקיית bot:  npm test   (מפעיל את האמולטור, מריץ, וסוגר)
// הבוט מקבל עדכונים מזויפים, והקריאות שלו ל-Telegram API נתפסות ונבדקות.
import assert from "node:assert/strict";
import http from "node:http";
import sharp from "sharp";
import { createBot } from "../src/bot.js";
import { connectFirestore, testimonialsRepo } from "../src/db.js";
import { defaultTestimonials } from "../../src/data/testimonials.js";

const PROJECT = "demo-gabay";
const ADMIN = 111;
const STRANGER = 222;
const emulator = process.env.FIRESTORE_EMULATOR_HOST;
assert.ok(emulator, "צריך להריץ דרך npm test (האמולטור של Firestore)");

const firestoreRest = `http://${emulator}/v1/projects/${PROJECT}/databases/(default)/documents`;
await fetch(`http://${emulator}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });

// "שרת הקבצים" של טלגרם, בשביל הורדת תמונה ששלחו לבוט
const photo = await sharp({ create: { width: 600, height: 900, channels: 3, background: "#c08040" } }).jpeg().toBuffer();
const fileServer = http.createServer((req, res) => {
  if (req.url === "/file/botTEST/photos/p.jpg") return res.end(photo);
  res.statusCode = 404;
  res.end();
});
await new Promise((resolve) => fileServer.listen(0, "127.0.0.1", resolve));

const repo = testimonialsRepo(connectFirestore(PROJECT));
const bot = createBot({
  token: "TEST",
  adminIds: [ADMIN],
  repo,
  defaultTestimonials,
  siteUrl: "https://example.test",
  apiRoot: `http://127.0.0.1:${fileServer.address().port}`,
  botInfo: { id: 1, is_bot: true, first_name: "Gabay", username: "gabay_test_bot" },
});

// כל קריאה של הבוט לטלגרם נרשמת ומקבלת תשובה מזויפת
let calls = [];
let counter = 1000;
bot.api.config.use(async (_prev, method, payload) => {
  calls.push({ method, payload });
  const fixed = {
    getFile: { file_id: payload.file_id, file_unique_id: "u", file_path: "photos/p.jpg" },
    answerCallbackQuery: true,
    sendChatAction: true,
  };
  const message = { message_id: ++counter, date: 0, chat: { id: payload.chat_id, type: "private" }, text: payload.text ?? "" };
  return { ok: true, result: method in fixed ? fixed[method] : message };
});

const from = (id) => ({ id, is_bot: false, first_name: "Test" });
const chat = (id) => ({ id, type: "private" });
async function send(update) {
  calls = [];
  await bot.handleUpdate({ update_id: ++counter, ...update });
  return calls;
}
const text = (value, user = ADMIN) =>
  send({
    message: {
      message_id: ++counter, date: 0, chat: chat(user), from: from(user), text: value,
      entities: value.startsWith("/") ? [{ type: "bot_command", offset: 0, length: value.length }] : undefined,
    },
  });
const tap = (data, user = ADMIN) =>
  send({
    callback_query: {
      id: String(++counter), from: from(user), chat_instance: "c", data,
      message: { message_id: 1, date: 0, chat: chat(user), text: "המסך הקודם" },
    },
  });
const sendPhoto = () =>
  send({
    message: {
      message_id: ++counter, date: 0, chat: chat(ADMIN), from: from(ADMIN),
      photo: [
        { file_id: "small", file_unique_id: "s", width: 60, height: 90 },
        { file_id: "big", file_unique_id: "b", width: 600, height: 900 },
      ],
    },
  });

// המסך האחרון שהבוט הציג (הודעה חדשה או עריכה) והכפתורים שלו
function screen(made) {
  const last = made.filter((c) => c.method === "sendMessage" || c.method === "editMessageText").at(-1);
  assert.ok(last, `הבוט לא הציג כלום. קריאות: ${made.map((c) => c.method).join(", ")}`);
  return { text: last.payload.text, buttons: (last.payload.reply_markup?.inline_keyboard ?? []).flat() };
}
const hasButton = (s, label) => s.buttons.some((b) => b.text.includes(label));
const passed = (name) => console.log(`✓ ${name}`);
let s;

s = screen(await text("/start", STRANGER));
assert.match(s.text, /222/);
assert.equal(s.buttons.length, 0);
assert.equal((await tap("t:import", STRANGER)).some((c) => c.method === "editMessageText"), false);
assert.equal((await repo.list()).length, 0);
passed("משתמש לא מורשה מקבל רק את המזהה שלו ולא יכול לשנות כלום");

s = screen(await text("/start"));
assert.ok(hasButton(s, "המלצות"));
passed("תפריט ראשי");

s = screen(await tap("t:list"));
assert.ok(hasButton(s, "ייבוא"));
s = screen(await tap("t:import"));
let items = await repo.list();
assert.deepEqual(items.map((t) => t.name), defaultTestimonials.map((t) => t.name));
assert.equal(items[0].image, "/images/testimonial-avi-levi.webp");
assert.equal(items[2].videoUrl, null);
assert.equal(s.buttons.filter((b) => b.callback_data?.startsWith("t:show:")).length, 6);
await tap("t:import");
assert.equal((await repo.list()).length, 6);
passed("ייבוא 6 ההמלצות המקוריות באותו סדר, וייבוא שני נחסם");

await tap("t:add");
assert.match(screen(await text("x")).text, /קצר מדי/);
assert.match(screen(await text("משפחת לוי, מודיעין")).text, /שלב 2/);
assert.match(screen(await text("עבודה מצוינת, ממליצים בחום!")).text, /שלב 3/);
assert.match(screen(await tap("t:addrate:4")).text, /שלב 4/);
let made = await sendPhoto();
assert.ok(made.some((c) => c.method === "sendPhoto"), "הבוט לא שלח תצוגה מקדימה של התמונה");
assert.match(screen(made).text, /שלב 5/);
assert.match(screen(await text("סתם טקסט")).text, /יוטיוב/);
assert.match(screen(await text("https://youtu.be/abc123")).text, /נוספה/);
items = await repo.list();
const added = items[0];
assert.equal(items.length, 7);
assert.equal(added.name, "משפחת לוי, מודיעין");
assert.equal(added.testimonial, "עבודה מצוינת, ממליצים בחום!");
assert.equal(added.rating, 4);
assert.equal(added.videoUrl, "https://youtu.be/abc123");
assert.match(added.image, /^data:image\/webp;base64,/);
const avatar = await sharp(Buffer.from(added.image.split(",")[1], "base64")).metadata();
assert.deepEqual([avatar.format, avatar.width, avatar.height], ["webp", 160, 160]);
passed(`הוספת המלצה ב-5 שלבים: נכנסת ראשונה, תמונה WebP 160x160 (${Math.round(added.image.length / 1024)}KB)`);

await tap(`t:edit:name:${added.id}`);
assert.match(screen(await text("משפחת לוי")).text, /השם עודכן/);
await tap(`t:edit:text:${added.id}`);
await text("טקסט חדש להמלצה");
await tap(`t:rate:${added.id}`);
await tap(`t:setrate:5:${added.id}`);
let item = await repo.get(added.id);
assert.deepEqual([item.name, item.testimonial, item.rating], ["משפחת לוי", "טקסט חדש להמלצה", 5]);
passed("עריכת שם, טקסט ודירוג");

await tap(`t:edit:video:${added.id}`);
await text("https://www.youtube.com/shorts/xyz");
assert.equal((await repo.get(added.id)).videoUrl, "https://www.youtube.com/shorts/xyz");
s = screen(await tap(`t:edit:video:${added.id}`));
assert.ok(hasButton(s, "הסר את הסרטון"));
await tap(`t:rmvideo:${added.id}`);
await tap(`t:edit:photo:${added.id}`);
await tap(`t:rmphoto:${added.id}`);
item = await repo.get(added.id);
assert.deepEqual([item.videoUrl, item.image], [null, null]);
await tap(`t:edit:photo:${added.id}`);
await sendPhoto();
assert.match((await repo.get(added.id)).image, /^data:image\/webp/);
passed("החלפת סרטון, הסרת סרטון ותמונה, והעלאת תמונה חדשה");

await tap(`t:edit:name:${added.id}`);
assert.match(screen(await tap("t:cancel")).text, /בוטל/);
s = screen(await text("שם שלא אמור להישמר"));
assert.equal((await repo.get(added.id)).name, "משפחת לוי");
assert.ok(hasButton(s, "המלצות"));
passed("ביטול עריכה, והודעה אחרי ביטול מחזירה לתפריט");

assert.match(screen(await tap(`t:move:up:${added.id}`)).text, /כבר ראשונה/);
await tap(`t:move:down:${added.id}`);
assert.equal((await repo.list())[1].id, added.id);
assert.match(screen(await tap(`t:show:${added.id}`)).text, /מקום 2 מתוך 7/);
await tap(`t:move:up:${added.id}`);
assert.equal((await repo.list())[0].id, added.id);
passed("שינוי סדר למעלה ולמטה");

await tap("t:add");
await text("<b>חברת</b> A&B");
await text("טקסט עם <script> בפנים");
await tap("t:addrate:5");
await tap("t:skip");
s = screen(await tap("t:skip"));
assert.match(s.text, /&lt;b&gt;חברת&lt;\/b&gt; A&amp;B/);
assert.match(s.text, /&lt;script&gt;/);
const htmlItem = (await repo.list())[0];
assert.deepEqual([htmlItem.image, htmlItem.videoUrl], [null, null]);
passed("הוספה עם דילוג על תמונה וסרטון, ותווי HTML מוצגים בבטחה");

s = screen(await tap(`t:del:${htmlItem.id}`));
assert.ok(hasButton(s, "כן, למחוק"));
assert.equal((await repo.list()).length, 8);
await tap(`t:delok:${htmlItem.id}`);
assert.equal(await repo.get(htmlItem.id), null);
assert.match(screen(await tap(`t:show:${htmlItem.id}`)).text, /לא נמצאה/);
assert.match(screen(await tap(`t:setrate:3:${htmlItem.id}`)).text, /לא נמצאה/);
passed("מחיקה עם אישור, וכפתורים ישנים של המלצה שנמחקה לא שוברים כלום");

let res = await fetch(`${firestoreRest}/testimonials?pageSize=300`);
assert.equal(res.status, 200);
assert.equal((await res.json()).documents.length, 7);
res = await fetch(`${firestoreRest}/testimonials`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ fields: { name: { stringValue: "פריצה" } } }),
});
assert.equal(res.status, 403);
res = await fetch(`${firestoreRest}/testimonials/${added.id}`, { method: "DELETE" });
assert.equal(res.status, 403);
passed("חוקי Firestore: גולש יכול לקרוא, לא לכתוב ולא למחוק");

console.log("\nכל הבדיקות עברו.");
fileServer.close();
process.exit(0);
