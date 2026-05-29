import React from "react";

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
            מי אנחנו
          </h2>
          <div className="w-16 sm:w-24 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            היכרות עם אליהו גבאי וקבוצת גבאי בשטח הבנייה והשיפוצים.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://media.base44.com/images/public/6877bb8d274d4fc432d2e2f6/5eefac8f4_IMG_1627.jpg?_gl=1*1581w6k*_gcl_au*MTUxNzk1NTA2Ni4xNzc2NzgwMjI5"
              alt="אליהו גבאי" 
              className="w-full h-full object-cover min-h-[320px]"
            />
          </div>

          <div className="text-gray-700 leading-relaxed space-y-6 text-base sm:text-lg">
            <p>נעים להכיר, אליהו גבאי – קבוצת גבאי</p>
            <p>
              שמי אליהו גבאי, ובענף הבנייה והשיפוצים אני מביא איתי ניסיון מעשי עשיר של למעלה מ-15 שנה בשטח. לאורך השנים, ליוויתי אינספור לקוחות בדרך להגשמת החזון שלהם – משיפוץ דירות קומפלט ברמת גימור פרימיום ועד לשדרוג חללים מסחריים מורכבים.
            </p>
            <p>
              הניסיון הרב שלי לימד אותי שהפרטים הקטנים הם אלו שעושים את ההבדל הגדול. לכן, אנו בקבוצת גבאי עובדים אך ורק עם אנשי המקצוע המובילים בתחומם, בוחרים בקפידה את חומרי הגלם הטובים ביותר, ומבצעים בקרת איכות מחמירה בכל שלב ושלב בפרויקט.
            </p>
            <p>
              אני מאמין שפרויקט מוצלח באמת מתחיל קודם כל באמון, שקיפות ויחסי אנוש. המטרה שלי היא להפוך את תהליך השיפוץ – שרבים חוששים ממנו – לחוויה שקטה, בטוחה ומסודרת. החל משלב התכנון, דרך עבודות השטח ועד למסירת המפתח – אנו מתחייבים לספק לכם שקט נפשי מלא, שקיפות תקציבית ועמידה מדויקת בלוחות הזמנים ללא תירוצים.
            </p>
            <p>
              אני מזמין אתכם להפקיד את הנכס שלכם בידיים המקצועיות והבטוחות ביותר, וליהנות מסטנדרט חדש של איכות ותוצאה שלא פחות ממושלמת.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
