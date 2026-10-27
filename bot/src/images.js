import sharp from "sharp";

// מחזיר פונקציה שמורידה קובץ שנשלח לבוט (לפי file_id) ומחזירה Buffer
export function telegramFileDownloader(api, token, apiRoot = "https://api.telegram.org") {
  return async (fileId) => {
    const file = await api.getFile(fileId);
    const res = await fetch(`${apiRoot}/file/bot${token}/${file.file_path}`);
    if (!res.ok) throw new Error(`Telegram file download failed: HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  };
}

// תמונת לקוח להמלצה: באתר היא מוצגת בעיגול של 80px, אז ריבוע של 160px מספיק גם למסכים חדים.
// נשמרת כ-data URL ישר במסמך ההמלצה (כ-5KB), כך שלא צריך Firebase Storage.
// preview הוא JPEG של אותו חיתוך, כדי להראות בטלגרם איך זה ייראה.
export async function toAvatar(buffer) {
  const webp = await sharp(buffer)
    .rotate()
    .resize(160, 160, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 80 })
    .toBuffer();
  const preview = await sharp(webp).jpeg({ quality: 90 }).toBuffer();
  return { dataUrl: `data:image/webp;base64,${webp.toString("base64")}`, preview };
}
