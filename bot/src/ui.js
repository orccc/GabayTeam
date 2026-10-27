export const escapeHtml = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export const stars = (rating) => "⭐".repeat(rating);

// מציג מסך. אחרי לחיצה על כפתור עורך את אותה הודעה (כדי לא להציף את הצ'אט),
// ואחרי הודעה מהמשתמש שולח הודעה חדשה.
export async function show(ctx, text, keyboard) {
  const options = { parse_mode: "HTML", reply_markup: keyboard, link_preview_options: { is_disabled: true } };
  if (ctx.callbackQuery?.message?.text) {
    try {
      await ctx.editMessageText(text, options);
      return;
    } catch (err) {
      if (String(err.description ?? err.message).includes("message is not modified")) return;
      // הודעה ישנה מדי לעריכה וכו' – נופלים לשליחת הודעה חדשה
    }
  }
  await ctx.reply(text, options);
}
