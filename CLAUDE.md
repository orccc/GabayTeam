# GabayProject – אתר "גבאי יזמות בנייה ושיפוצים"

אתר תדמית בעברית (RTL) לקבלן שיפוצים. נבנה במקור ב-Base44, היום מתארח ב-Firebase Hosting ונערך ב-VS Code.
הבעלים של הפרויקט (המפתח) בונה ומתחזק את האתר ללקוח. עובד על Windows, התיקייה בתוך OneDrive.

## סטאק ופקודות
- React 18 + Vite + Tailwind + shadcn/ui, עמוד יחיד (`src/pages/Home.jsx`).
- Firebase project: `gabayteam-6d556` (מוגדר ב-`.firebaserc`), hosting מגיש את `dist`.
- Repo: github.com/orccc/GabayTeam (ענף `main`).
- `npm run dev` – שרת פיתוח (localhost:5173)
- `npm run build` ואז `npm run preview` – בדיקת גרסת פרודקשן מקומית (localhost:4173)
- `node scripts/optimize-images.mjs` – מייצר WebP מכווץ ב-`public/images` מהמקורות ב-`assets/originals` (משתמש ב-`sharp`, תלות פיתוח)
- `firebase hosting:channel:deploy preview --expires 7d` – כתובת בדיקה זמנית, בלי לגעת באתר החי
- `firebase deploy --only hosting` – עלייה לאוויר. **לא לפרוס בלי אישור מפורש של המשתמש.**

## מבנה
- `src/pages/Home.jsx` מרכיב: Hero, ServicesGrid, WorkGallery, AboutSection, TestimonialsSection, ContactSection.
- ההמלצות הן מערך קשיח בתוך `TestimonialsSection.jsx` (name, rating, testimonial, image, videoUrl).
- גלריית פרויקטים: `src/components/gallery/WorkGallery.jsx`, הנתונים ב-`src/data/projects.js`. מוסתרת כל עוד המערך ריק. אין להשתמש בתמונות סטוק כ"עבודות שביצענו".
- תמונות: המקורות ב-`assets/originals/` (לא עולים לאתר), הגרסאות שמוגשות הן WebP ב-`public/images/` (נוצרות בסקריפט, לא עורכים ידנית). הגדלים מוגדרים ברשימה `siteImages` בתוך `scripts/optimize-images.mjs`.
- תמונות פרויקטים: מקור ב-`assets/originals/projects/`, מריצים את הסקריפט, ומפנים ב-`projects.js` ל-`/images/projects/<שם>.webp` (עד 1600px, מיושר לפי EXIF).
- ב-`index.html` נטען סקריפט של הצ'אט הדיגיטלי: `https://bot.gabayteam.co.il/widget.js`. הפאביקון: `/images/favicon.png`.
- `vite.config.js` מגדיר רק את `react()` ואת ה-alias `@` ל-`src`.

## החלטות שכבר התקבלו
- הצ'אט הדיגיטלי (Gemini API) שולח לידים לוואטסאפ, ולכן **אין טופס יצירת קשר באתר** (הוסר). נשארו טלפון, וואטסאפ, רשתות, כתובת ושעות.
- האתר ציבורי: אין התחברות ואין שום תלות ב-Base44 (קוד, חבילות `@base44/*` והפלאגין של Vite הוסרו).
- התוכנית ארוכת הטווח: הלקוח יעדכן תוכן (המלצות, תמונות פרויקטים, שעות) דרך בוט טלגרם, לא דרך קוד.

## מה נעשה (ב-commit על `main` ב-27.10.2026; עדיין לא נפרס לאתר החי ולא נדחף ל-GitHub)
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
3. פריסה לאתר החי, באישור המשתמש בלבד. ב-27.10.2026 הגרסה הנוכחית הועלתה ל-https://gabayteam-6d556--preview-7z2ku1yn.web.app (בתוקף עד 3.11.2026, בלי רקע ופרויקטים אמיתיים), המשתמש בדק בטלפון ואישר, ונעשה commit. פריסה חוזרת לאותו ערוץ שומרת על הכתובת.
4. שלב הבא: להעביר המלצות/פרויקטים/הגדרות ל-Firestore + תמונות ל-Storage, והרכיבים יקראו משם עם גיבוי לנתונים הקיימים. אחר כך בוט טלגרם (Cloud Function עם webhook, `secret_token`, רשימת chat ID מורשים; כתיבה דרך Admin SDK; חוקי Firestore: קריאה ציבורית). פריסת Functions דורשת תוכנית Blaze.

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
