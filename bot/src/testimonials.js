import { InlineKeyboard, InputFile } from "grammy";
import { escapeHtml, show, stars, truncate } from "./ui.js";
import { toAvatar } from "./images.js";

// כל הכפתורים של המסך הזה מתחילים ב-"t:".
// ctx.session.awaiting שומר מה הבוט מחכה לקבל מהמשתמש:
//   עריכה: { section: "testimonials", mode: "edit", field, id }
//   הוספה: { section: "testimonials", mode: "add", step, draft }

// שדות טקסט, והשם שלהם במסמך ב-Firestore
const TEXT_FIELDS = {
  name: { key: "name", label: "השם", prompt: "שלח את השם שיופיע על ההמלצה (למשל: משפחת כהן, ירושלים).", min: 2, max: 80 },
  text: { key: "testimonial", label: "טקסט ההמלצה", prompt: "שלח את טקסט ההמלצה.", min: 5, max: 2000 },
};
const PHOTO_PROMPT = "שלח תמונה של הלקוח (או הלוגו שלו). היא תיחתך לעיגול קטן, כמו באתר.";
const VIDEO_PROMPT = "שלח קישור לסרטון ביוטיוב (רגיל או Shorts).";
const ADD_STEPS = ["name", "text", "rating", "photo", "video"];
const NOT_FOUND = "⚠️ ההמלצה לא נמצאה, אולי כבר נמחקה.";

function parseText(field, text) {
  const value = text.trim();
  const { min, max, label } = TEXT_FIELDS[field];
  if (value.length < min) return { error: `${label} קצר מדי. נסה שוב:` };
  if (value.length > max) return { error: `${label} ארוך מדי (עד ${max} תווים). נסה שוב:` };
  return { value };
}

// האתר יודע להטמיע רק סרטוני יוטיוב
function parseYouTube(text) {
  try {
    const url = new URL(text.trim());
    const host = url.hostname.replace(/^(www|m)\./, "");
    if (host === "youtube.com" || host === "youtu.be") return url.toString();
  } catch {
    // לא כתובת בכלל
  }
  return null;
}

// תמונה רגילה (לוקחים את הגודל הכי גדול) או תמונה שנשלחה כקובץ
function imageFileId(message) {
  if (message.photo) return message.photo.at(-1).file_id;
  if (message.document?.mime_type?.startsWith("image/")) return message.document.file_id;
  return null;
}

function addRatingRow(keyboard, callbackData) {
  for (let rating = 5; rating >= 1; rating--) keyboard.text(`${rating} ⭐`, callbackData(rating));
  return keyboard.row();
}

function log(ctx, action) {
  console.log(`[${new Date().toISOString()}] ${ctx.from.id} testimonials: ${action}`);
}

export function testimonialsSection({ repo, defaults, siteUrl, downloadFile }) {
  const cardText = (item, position, total) =>
    [
      `<b>${escapeHtml(item.name)}</b>`,
      stars(item.rating),
      "",
      `«${escapeHtml(item.testimonial)}»`,
      "",
      `🖼 תמונה: ${item.image ? "יש" : "אין"}`,
      `🎬 סרטון: ${item.videoUrl ? escapeHtml(item.videoUrl) : "אין"}`,
      `📍 מקום ${position} מתוך ${total} באתר`,
    ].join("\n");

  const cardKeyboard = (id) =>
    new InlineKeyboard()
      .text("✏️ שם", `t:edit:name:${id}`).text("✏️ טקסט", `t:edit:text:${id}`).text("⭐ דירוג", `t:rate:${id}`).row()
      .text("🖼 תמונה", `t:edit:photo:${id}`).text("🎬 סרטון", `t:edit:video:${id}`).row()
      .text("⬆️ למעלה", `t:move:up:${id}`).text("⬇️ למטה", `t:move:down:${id}`).row()
      .text("🗑 מחיקה", `t:del:${id}`).url("🌐 באתר", `${siteUrl}/#testimonials`).row()
      .text("⬅️ לכל ההמלצות", "t:list");

  async function showList(ctx, note) {
    ctx.session.awaiting = null;
    const items = await repo.list();
    const keyboard = new InlineKeyboard();
    let text;
    if (items.length === 0) {
      text =
        `⭐ <b>המלצות</b>\n\nאין עדיין המלצות במסד הנתונים, ולכן האתר מציג את ${defaults.length} ההמלצות המקוריות מהקוד.\n` +
        "כדי לערוך אותן, ייבא אותן קודם.\n\nשים לב: הוספת המלצה חדשה בלי ייבוא תחליף באתר את כל ההמלצות המקוריות.";
      keyboard.text(`📥 ייבוא ${defaults.length} ההמלצות המקוריות`, "t:import").row();
    } else {
      text = `⭐ <b>המלצות באתר</b> (${items.length})\n\nבחר המלצה כדי לערוך אותה. הסדר כאן הוא הסדר באתר.`;
      items.forEach((item, i) => keyboard.text(`${i + 1}. ${truncate(item.name, 40)}`, `t:show:${item.id}`).row());
    }
    keyboard.text("➕ הוספת המלצה", "t:add").row().text("🏠 תפריט ראשי", "menu");
    await show(ctx, note ? `${note}\n\n${text}` : text, keyboard);
  }

  async function showCard(ctx, id, note) {
    ctx.session.awaiting = null;
    const items = await repo.list();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return showList(ctx, NOT_FOUND);
    const text = cardText(items[index], index + 1, items.length);
    await show(ctx, note ? `${note}\n\n${text}` : text, cardKeyboard(id));
  }

  async function save(ctx, id, data, note) {
    if (!(await repo.get(id))) return showList(ctx, NOT_FOUND);
    await repo.update(id, data);
    log(ctx, `update ${id} [${Object.keys(data).join(", ")}]`);
    await showCard(ctx, id, note);
  }

  // ---- הוספה: שם → טקסט → דירוג → תמונה → סרטון ----

  async function askAdd(ctx, state) {
    ctx.session.awaiting = { section: "testimonials", mode: "add", ...state };
    const keyboard = new InlineKeyboard();
    let prompt;
    if (state.step === "name" || state.step === "text") {
      prompt = TEXT_FIELDS[state.step].prompt;
    } else if (state.step === "rating") {
      prompt = "כמה כוכבים?";
      addRatingRow(keyboard, (rating) => `t:addrate:${rating}`);
    } else {
      prompt = `${state.step === "photo" ? PHOTO_PROMPT : VIDEO_PROMPT}\nלא חובה.`;
      keyboard.text("⏭ דלג", "t:skip").row();
    }
    keyboard.text("✖️ ביטול", "t:cancel");
    const stepNumber = ADD_STEPS.indexOf(state.step) + 1;
    await show(ctx, `➕ <b>המלצה חדשה</b> – שלב ${stepNumber} מתוך ${ADD_STEPS.length}\n\n${prompt}`, keyboard);
  }

  async function finishAdd(ctx, draft) {
    const id = await repo.create(draft);
    log(ctx, `create ${id}`);
    await showCard(ctx, id, "✅ ההמלצה נוספה, והיא מופיעה ראשונה באתר.");
  }

  const adding = (ctx) => (ctx.session.awaiting?.mode === "add" ? ctx.session.awaiting : null);

  // ---- עריכה של שדה אחד ----

  async function askEdit(ctx, field, id) {
    const item = await repo.get(id);
    if (!item) return showList(ctx, NOT_FOUND);
    ctx.session.awaiting = { section: "testimonials", mode: "edit", field, id };
    const keyboard = new InlineKeyboard();
    let text;
    if (field === "photo") {
      text = PHOTO_PROMPT;
      if (item.image) keyboard.text("🗑 הסר את התמונה", `t:rmphoto:${id}`).row();
    } else if (field === "video") {
      text = VIDEO_PROMPT + (item.videoUrl ? `\n\nהקישור הנוכחי: ${escapeHtml(item.videoUrl)}` : "");
      if (item.videoUrl) keyboard.text("🗑 הסר את הסרטון", `t:rmvideo:${id}`).row();
    } else {
      const { key, prompt } = TEXT_FIELDS[field];
      text = `${prompt}\n\nהנוכחי (לחיצה עליו מעתיקה אותו):\n<code>${escapeHtml(item[key])}</code>`;
    }
    keyboard.text("✖️ ביטול", "t:cancel");
    await show(ctx, `✏️ <b>${escapeHtml(item.name)}</b>\n\n${text}`, keyboard);
  }

  function register(bot) {
    bot.callbackQuery("t:list", (ctx) => showList(ctx));
    bot.callbackQuery(/^t:show:(.+)$/, (ctx) => showCard(ctx, ctx.match[1]));

    bot.callbackQuery("t:import", async (ctx) => {
      if ((await repo.list()).length) return showList(ctx, "כבר יש המלצות במסד הנתונים, אין מה לייבא.");
      await repo.importDefaults(defaults);
      log(ctx, `import ${defaults.length}`);
      await showList(ctx, `✅ יובאו ${defaults.length} המלצות. עכשיו אפשר לערוך אותן.`);
    });

    bot.callbackQuery("t:add", (ctx) => askAdd(ctx, { step: "name", draft: {} }));
    bot.callbackQuery(/^t:addrate:([1-5])$/, (ctx) => {
      const state = adding(ctx);
      if (state?.step !== "rating") return showList(ctx);
      state.draft.rating = Number(ctx.match[1]);
      return askAdd(ctx, { ...state, step: "photo" });
    });
    bot.callbackQuery("t:skip", (ctx) => {
      const state = adding(ctx);
      if (state?.step === "photo") return askAdd(ctx, { ...state, step: "video" });
      if (state?.step === "video") return finishAdd(ctx, state.draft);
      return showList(ctx);
    });
    bot.callbackQuery("t:cancel", (ctx) => {
      const state = ctx.session.awaiting;
      if (state?.mode === "edit") return showCard(ctx, state.id, "בוטל.");
      return showList(ctx, "בוטל.");
    });

    bot.callbackQuery(/^t:edit:(name|text|photo|video):(.+)$/, (ctx) => askEdit(ctx, ctx.match[1], ctx.match[2]));
    bot.callbackQuery(/^t:rate:(.+)$/, async (ctx) => {
      const item = await repo.get(ctx.match[1]);
      if (!item) return showList(ctx, NOT_FOUND);
      const keyboard = addRatingRow(new InlineKeyboard(), (rating) => `t:setrate:${rating}:${item.id}`).text("✖️ ביטול", `t:show:${item.id}`);
      await show(ctx, `⭐ <b>${escapeHtml(item.name)}</b>\n\nכמה כוכבים? (עכשיו: ${item.rating})`, keyboard);
    });
    bot.callbackQuery(/^t:setrate:([1-5]):(.+)$/, (ctx) => save(ctx, ctx.match[2], { rating: Number(ctx.match[1]) }, "✅ הדירוג עודכן."));
    bot.callbackQuery(/^t:rmphoto:(.+)$/, (ctx) => save(ctx, ctx.match[1], { image: null }, "✅ התמונה הוסרה."));
    bot.callbackQuery(/^t:rmvideo:(.+)$/, (ctx) => save(ctx, ctx.match[1], { videoUrl: null }, "✅ הסרטון הוסר."));

    bot.callbackQuery(/^t:move:(up|down):(.+)$/, async (ctx) => {
      const [, direction, id] = ctx.match;
      const moved = await repo.move(id, direction === "up" ? -1 : 1);
      if (moved) log(ctx, `move ${id} ${direction}`);
      await showCard(ctx, id, moved ? "" : direction === "up" ? "היא כבר ראשונה." : "היא כבר אחרונה.");
    });

    bot.callbackQuery(/^t:del:(.+)$/, async (ctx) => {
      const item = await repo.get(ctx.match[1]);
      if (!item) return showList(ctx, NOT_FOUND);
      const keyboard = new InlineKeyboard().text("🗑 כן, למחוק", `t:delok:${item.id}`).text("✖️ לא", `t:show:${item.id}`);
      await show(ctx, `למחוק את ההמלצה של <b>${escapeHtml(item.name)}</b>?\nאי אפשר לבטל את זה.`, keyboard);
    });
    bot.callbackQuery(/^t:delok:(.+)$/, async (ctx) => {
      await repo.remove(ctx.match[1]);
      log(ctx, `delete ${ctx.match[1]}`);
      const left = (await repo.list()).length;
      await showList(ctx, left ? "🗑 ההמלצה נמחקה." : "🗑 ההמלצה נמחקה. לא נשארו המלצות, ולכן האתר יחזור להציג את ההמלצות המקוריות מהקוד.");
    });
  }

  // הודעת טקסט כשהבוט מחכה לתשובה במסך הזה. מחזיר false אם היא לא שייכת לכאן.
  async function onText(ctx) {
    const state = ctx.session.awaiting;
    if (state?.section !== "testimonials") return false;
    const { text } = ctx.message;

    if (state.mode === "edit") {
      if (state.field === "photo") {
        await ctx.reply("מחכה לתמונה. שלח תמונה, או לחץ ביטול.");
      } else if (state.field === "video") {
        const url = parseYouTube(text);
        if (url) await save(ctx, state.id, { videoUrl: url }, "✅ הסרטון עודכן.");
        else await ctx.reply("זה לא נראה כמו קישור ליוטיוב. נסה שוב, או לחץ ביטול.");
      } else {
        const { value, error } = parseText(state.field, text);
        const { key, label } = TEXT_FIELDS[state.field];
        if (error) await ctx.reply(error);
        else await save(ctx, state.id, { [key]: value }, `✅ ${label} עודכן.`);
      }
      return true;
    }

    const { step, draft } = state;
    if (step === "name" || step === "text") {
      const { value, error } = parseText(step, text);
      if (error) return ctx.reply(error).then(() => true);
      draft[TEXT_FIELDS[step].key] = value;
      await askAdd(ctx, { ...state, step: step === "name" ? "text" : "rating" });
    } else if (step === "rating") {
      const rating = Number(text.trim());
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return ctx.reply("בחר דירוג בכפתורים, או שלח מספר בין 1 ל-5.").then(() => true);
      draft.rating = rating;
      await askAdd(ctx, { ...state, step: "photo" });
    } else if (step === "photo") {
      await ctx.reply("מחכה לתמונה. שלח תמונה, או לחץ דלג.");
    } else if (step === "video") {
      const url = parseYouTube(text);
      if (!url) return ctx.reply("זה לא נראה כמו קישור ליוטיוב. נסה שוב, או לחץ דלג.").then(() => true);
      draft.videoUrl = url;
      await finishAdd(ctx, draft);
    }
    return true;
  }

  // תמונה כשהבוט מחכה לתמונה במסך הזה. מחזיר false אם היא לא שייכת לכאן.
  async function onPhoto(ctx) {
    const state = ctx.session.awaiting;
    if (state?.section !== "testimonials") return false;
    if ((state.mode === "edit" ? state.field : state.step) !== "photo") return false;

    const fileId = imageFileId(ctx.message);
    if (!fileId) {
      await ctx.reply("הקובץ הזה לא תמונה. שלח תמונה, או לחץ ביטול.");
      return true;
    }
    await ctx.replyWithChatAction("upload_photo");
    const { dataUrl, preview } = await toAvatar(await downloadFile(fileId));
    await ctx.replyWithPhoto(new InputFile(preview, "preview.jpg"), { caption: "כך התמונה תיראה באתר (בתוך עיגול)." });

    if (state.mode === "edit") {
      await save(ctx, state.id, { image: dataUrl }, "✅ התמונה עודכנה.");
    } else {
      state.draft.image = dataUrl;
      await askAdd(ctx, { ...state, step: "video" });
    }
    return true;
  }

  return { register, onText, onPhoto };
}
