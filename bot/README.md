# בוט הטלגרם של האתר

הבוט מעדכן את ההמלצות באתר מתוך טלגרם: הוספה, עריכה (שם, טקסט, דירוג, תמונה, סרטון), שינוי סדר ומחיקה.
הנתונים נשמרים ב-Firestore (אוסף `testimonials`), והאתר קורא משם בכל טעינה. שינוי מופיע באתר מיד, בלי פריסה.

## איך זה בנוי
- Node + [grammY](https://grammy.dev) ב-long polling: הבוט פונה לטלגרם בעצמו, ולכן לא צריך כתובת ציבורית, webhook או Cloud Functions.
- הבוט כותב ל-Firestore עם service account. גולשים יכולים רק לקרוא (`../firestore.rules`).
- תמונת לקוח נחתכת לעיגול של 160px ונשמרת כ-data URL בתוך מסמך ההמלצה (כ-5KB). לא צריך Firebase Storage.
- רק מזהי טלגרם שב-`ADMIN_IDS` יכולים לערוך. מי שלא ברשימה מקבל מהבוט את המזהה שלו, וזהו (והניסיון נרשם בלוג).
- אם Firestore ריק או לא זמין, האתר מציג את ההמלצות המקוריות מ-`src/data/testimonials.js`. משם גם הבוט מייבא אותן בפעם הראשונה (כפתור "ייבוא"), ולכן הבוט רץ מתוך עותק מלא של הריפו.

## איפה הוא רץ
שרת Hetzner `berber@2.29.53.208` (הלסינקי), כשירות systemd של המשתמש berber, בלי sudo (linger כבר מופעל, כמו בשאר הבוטים שם).

| מה | איפה |
|---|---|
| הקוד | `~/GabayTeam` (שכפול של הריפו), הבוט ב-`~/GabayTeam/bot` |
| הגדרות וטוקן | `~/GabayTeam/bot/.env` (הרשאות 600, לא בגיט) |
| מפתח service account | `~/.config/gabay-content-bot/service-account.json` |
| Node 24 | `~/.local/node` (קישור לגרסה שהורדה מ-nodejs.org) |
| שירותים | `~/.config/systemd/user/gabay-content-bot*` (העתקים של `systemd/` כאן) |

**לא לבלבל:** `gabay-bot.service` בשרת (`~/gabay-bot/app.py`) הוא הצ'אט של האתר. הבוט הזה הוא `gabay-content-bot`.

שמירה של `.env` מפעילה את הבוט מחדש אוטומטית (`gabay-content-bot-env.path`), כך שאחרי עריכת הטוקן או `ADMIN_IDS` לא צריך לעשות כלום.

```bash
systemctl --user status gabay-content-bot     # מצב
journalctl --user -u gabay-content-bot -f     # לוגים
systemctl --user restart gabay-content-bot    # הפעלה מחדש ידנית
```

## הקמה (פעם אחת)
1. **בוט בטלגרם:** ב-[@BotFather](https://t.me/BotFather) `/newbot`. את הטוקן מדביקים רק ב-`~/GabayTeam/bot/.env` בשרת, אחרי `TELEGRAM_BOT_TOKEN=`.
2. **המזהה שלך:** שולחים לבוט `/start`. הוא עונה "אין לך הרשאה" עם המזהה. מוסיפים אותו (ואת של אליהו) ל-`ADMIN_IDS` באותו קובץ, מופרדים בפסיק.
3. **Firestore:** מסד בפרויקט `gabayteam-6d556` (עובד בתוכנית החינמית), והחוקים מהריפו – משורש הריפו במחשב הפיתוח: `firebase deploy --only firestore:rules`.
4. **Service account** ב-[Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts?project=gabayteam-6d556): Create service account בשם `gabay-bot`, תפקיד **Cloud Datastore User** בלבד, ואז Keys → Add key → JSON. מעלים לשרת:
   ```bash
   scp service-account.json berber@2.29.53.208:.config/gabay-content-bot/service-account.json
   ssh berber@2.29.53.208 'chmod 600 ~/.config/gabay-content-bot/service-account.json && systemctl --user restart gabay-content-bot'
   ```
5. **ייבוא:** בבוט: `/start` → המלצות → "ייבוא 6 ההמלצות המקוריות". מעכשיו עורכים מהבוט.

## עדכון גרסה
```bash
cd ~/GabayTeam && git pull && cd bot && PATH=~/.local/node/bin:$PATH npm ci --omit=dev
cp systemd/* ~/.config/systemd/user/ && systemctl --user daemon-reload
systemctl --user restart gabay-content-bot
```

## בדיקות (במחשב הפיתוח)
```bash
npm test
```
מפעיל את אמולטור Firestore (צריך Firebase CLI ו-Java), מזין לבוט עדכונים מזויפים ובודק את התוצאה ב-Firestore, כולל חוקי האבטחה. לא נוגע בפרויקט האמיתי.

כדי לראות את האתר מול האמולטור: מריצים `firebase emulators:start --only firestore --project demo-gabay` בשורש הריפו, ובמקביל `npm run dev:emulator`.
