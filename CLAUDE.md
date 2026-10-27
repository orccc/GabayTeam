# GabayProject – אתר "גבאי יזמות בנייה ושיפוצים"

אתר תדמית בעברית (RTL) לקבלן שיפוצים. נבנה במקור ב-Base44, היום מתארח ב-Firebase Hosting ונערך ב-VS Code.
הבעלים של הפרויקט (המפתח) בונה ומתחזק את האתר ללקוח. עובד על Windows, התיקייה בתוך OneDrive.

## עדכונים לאתר
כל בקשה לשנות משהו באתר עוברת דרך הסקיל `site-update` (`.claude/skills/site-update/SKILL.md`):
1. שינוי לפי הכללים.
2. בדיקה (`scripts/check.mjs`).
3. העלאה ל-preview channel ובדיקה (`scripts/verify-deploy.mjs`).
4. הצגת התוצאה למשתמש.
5. רק אחרי אישור מפורש: פריסה לאתר החי, אימות, commit ו-push.

## סטאק ופקודות
- React 18 + Vite + Tailwind + shadcn/ui, עמוד יחיד (`src/pages/Home.jsx`).
- Firebase project: `gabayteam-6d556` (מוגדר ב-`.firebaserc`), hosting מגיש את `dist`. האתר החי: https://gabayteam.co.il (וגם `gabayteam-6d556.web.app`).
- Repo: github.com/orccc/GabayTeam (ענף `main`).
- `npm run dev` – שרת פיתוח (localhost:5173)
- `npm run build` ואז `npm run preview` – בדיקת גרסת פרודקשן מקומית (localhost:4173)
- `node scripts/optimize-images.mjs` – מייצר WebP מכווץ ב-`public/images` מהמקורות ב-`assets/originals` (משתמש ב-`sharp`, תלות פיתוח)
- `firebase hosting:channel:deploy preview --expires 7d` – כתובת בדיקה זמנית, בלי לגעת באתר החי
- `firebase deploy --only hosting` – עלייה לאוויר. **לא לפרוס בלי אישור מפורש של המשתמש.** תמיד עם `--only`: `firebase.json` מכיל גם את `dataconnect` (Cloud SQL, עולה כסף).
- `npm run dev:emulator` – האתר מול אמולטור Firestore (`.env.emulator`, פרויקט `demo-gabay`, localhost:5174). את האמולטור מפעילים בנפרד: `firebase emulators:start --only firestore --project demo-gabay`.
- `cd bot && npm test` – בדיקת קצה-לקצה של הבוט מול אמולטור Firestore (צריך Java). לא נוגע בפרויקט האמיתי.

## מבנה
- `src/pages/Home.jsx` מרכיב: Hero, ServicesGrid, WorkGallery, AboutSection, TestimonialsSection, ContactSection.
- ההמלצות: `TestimonialsSection.jsx` קורא את האוסף `testimonials` מ-Firestore דרך REST (`src/lib/firestore.js`, בלי SDK) וממיין לפי `order`. אם האוסף ריק או שהטעינה נכשלה, מוצגות ההמלצות המקוריות מ-`src/data/testimonials.js`. שדות: name, rating, testimonial, image (נתיב או data URL), videoUrl (יוטיוב), order.
- `firestore.rules`: קריאה ציבורית ל-`testimonials` בלבד, אין כתיבה מהדפדפן. כל אוסף חדש שהאתר קורא צריך להיפתח שם.
- בוט טלגרם: `bot/` (חבילה נפרדת, Node + grammY, long polling). פירוט והוראות התקנה ב-`bot/README.md`. מבנה: `bot.js` (הרשאות, תפריט), `testimonials.js` (המסכים), `db.js` (Firestore), `images.js` (תמונות).
- גלריית פרויקטים: `src/components/gallery/WorkGallery.jsx`, הנתונים ב-`src/data/projects.js`. מוסתרת כל עוד המערך ריק. אין להשתמש בתמונות סטוק כ"עבודות שביצענו".
- תמונות: המקורות ב-`assets/originals/` (לא עולים לאתר), הגרסאות שמוגשות הן WebP ב-`public/images/` (נוצרות בסקריפט, לא עורכים ידנית). הגדלים מוגדרים ברשימה `siteImages` בתוך `scripts/optimize-images.mjs`.
- תמונות פרויקטים: מקור ב-`assets/originals/projects/`, מריצים את הסקריפט, ומפנים ב-`projects.js` ל-`/images/projects/<שם>.webp` (עד 1600px, מיושר לפי EXIF).
- ב-`index.html` נטען סקריפט של הצ'אט הדיגיטלי: `https://bot.gabayteam.co.il/widget.js`. הפאביקון: `/images/favicon.png`.
- `vite.config.js` מגדיר רק את `react()` ואת ה-alias `@` ל-`src`.

## החלטות שכבר התקבלו
- הצ'אט הדיגיטלי (Gemini API) שולח לידים לוואטסאפ, ולכן **אין טופס יצירת קשר באתר** (הוסר). נשארו טלפון, וואטסאפ, רשתות, כתובת ושעות.
- האתר ציבורי: אין התחברות ואין שום תלות ב-Base44 (קוד, חבילות `@base44/*` והפלאגין של Vite הוסרו).
- התוכנית ארוכת הטווח: הלקוח יעדכן תוכן (המלצות, תמונות פרויקטים, שעות) דרך בוט טלגרם, לא דרך קוד.
- הבוט רץ על שרת Hetzner של המשתמש (`berber@2.29.53.208`, Ubuntu, 1GB; זה גם השרת של הצ'אט), כשירות systemd של המשתמש `gabay-content-bot`. ל-berber אין sudo בלי סיסמה, אז הכול מותקן בתוך הבית שלו (Node ב-`~/.local/node`, הקוד ב-`~/GabayTeam`). **`gabay-bot.service` שם הוא הצ'אט של האתר – לא לגעת.** פרטים ב-`bot/README.md`. כי הבוט לא על Cloud Functions, **אין צורך בתוכנית Blaze**. Firestore בתוכנית החינמית. הבוט כותב עם service account בהרשאת Cloud Datastore User בלבד. הגישה מוגבלת למזהי טלגרם ב-`ADMIN_IDS`.
- אין Firebase Storage (בפרויקט חדש הוא דורש Blaze). תמונת לקוח בהמלצה נשמרת כ-data URL (עיגול 160px, כ-5KB) בתוך המסמך. לתמונות של גלריית הפרויקטים (גדולות) יידרש פתרון אחר, למשל הגשה מהשרת.

## מה נעשה (commit `78302db` על `main`, נדחף ל-GitHub ונפרס לאתר החי ב-27.10.2026)
- הוסר טופס "השאר פרטים" ו-`base44.integrations.SendEmail` מ-ContactSection.
- כל התמונות הורדו מ-Base44/Unsplash ל-`assets/originals/` והומרו ל-WebP: מ-3.4MB ל-170KB בסך הכול. נוסף `favicon.png` (64px) במקום הלוגו המלא.
- `App.jsx` פושט: בלי AuthProvider/NavigationTracker. `PageNotFound` ירד מ-Base44 ותורגם לעברית.
- נבנתה גלריה חדשה (סינון קטגוריות, תצוגה מוגדלת, חצים/מקשים/Esc/החלקה; "הבא" בצד שמאל בגלל RTL).
- נמחקו הקבצים המתים של Base44 (`AuthContext`, `base44Client`, `NavigationTracker`, `ProtectedRoute`, `UserNotRegisteredError`, `app-params`, `src/utils/index.ts`). הוסרו `@base44/sdk` ו-`@base44/vite-plugin` (בפרודקשן הפלאגין תרם רק את ה-alias).
- תוקנו: שגיאות ה-lint (`Upload`, `Badge`), פס כהה ריק מתחת לפוסטר הסרטון בפתיח, תמונת סטוק בענף הגיבוי של הפתיח.
- נבדק בדפדפן אמיתי (dev ו-preview, דסקטופ ונייד 375px): כל התמונות נטענות, אין שגיאות קונסול, אין גלילה אופקית, דף 404 עובד. `npm run build` ו-`eslint` עוברים.
- הוסר הפאביקון של Base44 והפניה ל-`manifest.json` שלא קיים.

## מה נשאר – לפי סדר
1. להחליף את רקע הפתיח (סטוק Unsplash, `assets/originals/hero-bg.jpg`) בתמונה אמיתית של פרויקט: לשים את המקור באותו שם ולהריץ את הסקריפט.
2. להוסיף פרויקטים אמיתיים ל-`src/data/projects.js` (בקשה מהמשתמש: תמונות + כותרת + קטגוריה).
3. אחרי 1-2: שוב preview channel (https://gabayteam-6d556--preview-7z2ku1yn.web.app, בתוקף עד 3.11.2026; פריסה חוזרת לאותו ערוץ שומרת על הכתובת), בדיקה בטלפון, commit, ופריסה לאתר החי באישור המשתמש.
4. בוט ההמלצות: הקוד ב-commit `a21d92b` (נדחף), ומותקן בשרת ב-27.10.2026 (Node 24, שירותי משתמש מופעלים, מחכה לטוקן). להפעלה:
   - ✅ הטוקן ו-`ADMIN_IDS` (המשתמש) מוגדרים ב-`~/GabayTeam/bot/.env`. הבוט: `@Gabayweb3085bot`, רץ בשרת.
   - תוקן (`5888f7f`): בלי קובץ service account, ספריית Firestore זרקה שגיאה כפולה שהפילה את Node, והלחיצה נשלחה שוב בכל הפעלה (לולאה של 52 קריסות). עכשיו הבוט עונה שחסרה גישה ולא נופל.
   - ✅ נעשה ב-27.10.2026: מסד Firestore `(default)` ב-`me-west1`, Native, עם הגנה מפני מחיקה. החוקים נפרסו (לקח כ-5 דקות עד שהקריאה הציבורית עבדה בעקביות). נבדק בפרודקשן: קריאה של `testimonials` מחזירה 200, כתיבה ואוספים אחרים מחזירים 403. `firebase.json` מכיל `location: me-west1`, כי `firebase deploy` יוצר מסד חסר ב-`nam5` כברירת מחדל.
   - (המשתמש) service account בהרשאת Cloud Datastore User, והמפתח לשרת ב-`~/.config/gabay-content-bot/service-account.json`. אז לייבא את ההמלצות המקוריות דרך הבוט.
   - (באישור המשתמש) לפרוס את האתר. עד שיש נתונים ב-Firestore האתר מציג את ההמלצות המקוריות, כך שהסדר לא קריטי.
5. אחר כך באותו בוט: פרויקטים לגלריה (צריך לפתור איפה התמונות נשמרות) ושעות פעילות.

## נקודות לבדיקה עם המשתמש
- הדירוג "4.8 דירוג ממוצע" בהמלצות כתוב קשיח – צריך להתאים לדירוג האמיתי בגוגל.
- שתי ההמלצות האחרונות ("דנה ואברהם רוזן", "חברת טכנולוגיות מתקדמות") נראות גנריות – לוודא שהן אמיתיות.
- פוסטר הסרטון בפתיח (`hero-video-poster`) הוא תמונה שנוצרה ב-Gemini ולא עבודה אמיתית. אפשר להחליף בפריים מהסרטון.
- `dataconnect/` מכיל סכמת דוגמה (סרטים) והגדרת Cloud SQL `gabayproject-fdc` שלא בשימוש. אם נפרס בפועל – עולה כסף, לבדוק בקונסולה. תיקיית `functions/` ריקה. החבילה `@dataconnect/generated` ב-`package.json` לא מיובאת בשום מקום.
- `src/gabaymainpic.jpg` (סלפי של אליהו ליד הרכב) לא בשימוש. תיקיית `Pics/` ריקה.
- `.env.local` מכיל רק מזהי Base44 שכבר לא בשימוש – אפשר למחוק.
- חסרים: תגיות OG לשיתוף, `robots.txt`, `sitemap`.

## כללי עבודה
- שמור על סוף שורה קיים: `Home.jsx`, `AboutSection.jsx`, `TestimonialsSection.jsx`, `index.html` הם CRLF; השאר LF. **`sed -i` של Git Bash מוחק את ה-CR** – לערוך קבצי CRLF עם כלי העריכה או עם node.
- `.env.local` לא נכנס ל-git. לא להדפיס או להעלות אותו.
- ממשק משתמש בעברית, כיוון RTL. שמור על ערכת הצבעים (זהב `#D4AF37`, רקע `#f5f3ee`).
