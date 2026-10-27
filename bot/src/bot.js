import { Bot, InlineKeyboard, session } from "grammy";
import { show } from "./ui.js";
import { telegramFileDownloader } from "./images.js";
import { testimonialsSection } from "./testimonials.js";

// בונה את הבוט. index.js מחבר אותו לטלגרם, והבדיקות מזינות לו עדכונים ישירות.
// botInfo ו-apiRoot נחוצים רק בבדיקות.
export function createBot({ token, adminIds, repo, defaultTestimonials, siteUrl, botInfo, apiRoot }) {
  const bot = new Bot(token, { botInfo, client: apiRoot ? { apiRoot } : undefined });
  const testimonials = testimonialsSection({
    repo,
    defaults: defaultTestimonials,
    siteUrl,
    downloadFile: telegramFileDownloader(bot.api, token, apiRoot),
  });

  // רק מי שב-ADMIN_IDS יכול לערוך. כל השאר מקבלים את המזהה שלהם, כדי שאפשר יהיה להוסיף אותם לרשימה.
  bot.use(async (ctx, next) => {
    if (ctx.from && adminIds.includes(ctx.from.id)) return next();
    console.log(`[${new Date().toISOString()}] unauthorized: ${ctx.from?.id} @${ctx.from?.username ?? "-"}`);
    if (ctx.chat?.type === "private") {
      await ctx.reply(`אין לך הרשאה לבוט הזה.\nמזהה הטלגרם שלך: <code>${ctx.from?.id}</code>`, { parse_mode: "HTML" });
    }
  });

  // מה הבוט מחכה לקבל נשמר בזיכרון. אם השירות מופעל מחדש באמצע עריכה, פשוט מתחילים שוב.
  bot.use(session({ initial: () => ({ awaiting: null }) }));

  // מסיר את סימן הטעינה מהכפתור אחרי הטיפול
  bot.on("callback_query", async (ctx, next) => {
    try {
      await next();
    } finally {
      await ctx.answerCallbackQuery().catch(() => {});
    }
  });

  const mainMenu = (ctx, note) => {
    ctx.session.awaiting = null;
    const keyboard = new InlineKeyboard().text("⭐ המלצות", "t:list").row().url("🌐 לאתר", siteUrl);
    return show(ctx, `${note ? `${note}\n\n` : ""}👷 <b>עדכון האתר של גבאי</b>\nמה נעדכן?`, keyboard);
  };

  bot.command(["start", "menu"], (ctx) => mainMenu(ctx));
  bot.callbackQuery("menu", (ctx) => mainMenu(ctx));
  testimonials.register(bot);

  bot.on("message:text", async (ctx) => {
    if (!(await testimonials.onText(ctx))) await mainMenu(ctx);
  });
  bot.on(["message:photo", "message:document"], async (ctx) => {
    if (!(await testimonials.onPhoto(ctx))) await mainMenu(ctx, "קיבלתי קובץ, אבל לא ביקשתי תמונה כרגע. בחר קודם מה לעדכן.");
  });
  // כפתור מהודעה ישנה שכבר לא מוכר
  bot.on("callback_query", (ctx) => mainMenu(ctx));

  bot.catch(async ({ ctx, error }) => {
    console.error(`[${new Date().toISOString()}] update ${ctx.update.update_id} failed:`, error);
    await ctx.reply("😕 משהו השתבש. נסה שוב, או שלח /start.").catch(() => {});
  });

  return bot;
}
