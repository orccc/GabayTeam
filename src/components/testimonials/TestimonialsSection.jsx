import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Eye, X } from "lucide-react";

const testimonials = [
  {
    name: "המוציא - מסעדת השף של אבי לוי",
    rating: 5,
    testimonial: "טוב התקשרתי ומישהו הכי נחמד שבעולם היה אצלי תוך שעה אני בעל מסעדה מאד מוכרת בירושלים הבעלים של המוציא , הגיע אדם מקצועי ונחמד מאין כמוהו וראה את המצוקה שפשוט חייב לפתוח את המסעדה וצריך ממש לסיים מהר לא האמנתי שזה קורה הוא הכניס צוות תוך שעה עם כל הכלים ופשוט עבדו עד לתוך הלילה ובכזו מקצועיות פשוט אין לי מילים להביע תודה שרות עזה בחיים שלי לא קיבלתי ופשוט אסירות תודה שיש כאלה בעלי מקצוע כן ירבו המלצתי היא הכי כנה שבעולם ואין לי ספק בכלל שכל מי שיקח אותם יהיה מאושר אז ברור שמומלץ בחום",
    image: "https://media.base44.com/images/public/6877bb8d274d4fc432d2e2f6/a68ddfb0a_Avilevi.jpg",
    videoUrl: "https://www.youtube.com/embed/d1A87dR1kqk"
  },
  {
    name: "עדן א.",
    rating: 5,
    testimonial: "ממליצה מאוד! בן אדם מאוד אמין לב מזהב עבודה יסודית באמת שכיום קשה לפגוש אנשי מקצוע כאלו ברמה הזאת של האמינות באדיבות וכמובן המקצעיות אין על אליהו איש מקצוע מיוחד במינו ממליצה באמת בחום"
  },
  {
    name: "יוסי לוי",
    rating: 5,
    testimonial: "עבודות האלומיניום שביצעו בבית היו ברמה הגבוהה ביותר. זמינות מלאה ואמינות מוחלטת."
  },
  {
    name: "מסעדת הבית הלבן",
    rating: 5,
    testimonial: "שיפצו לנו את כל המסעדה - ריצוף, צבע וגבס. התוצאה מעבר לציפיות, לקוחות מתרשמים מהמקום."
  },
  {
    name: "דנה ואברהם רוזן",
    rating: 5,
    testimonial: "צוות אמין ומקצועי. עבודות הצבע והשפכטל יצאו ברמה מושלמת. בהחלט נחזור אליהם שוב."
  },
  {
    name: "חברת טכנולוגיות מתקדמות",
    rating: 5,
    testimonial: "התקנת מערכת אינטרקום ומצלמות אבטחה במשרדי החברה. עבודה מהירה, מקצועית ויעילה."
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center gap-1 mb-4">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className="h-5 w-5 text-gold"
          style={{ fill: index < rating ? 'var(--gold)' : 'transparent', stroke: index < rating ? 'var(--gold)' : '#D1D5DB' }}
        />
      ))}
    </div>
  );
};

export default function TestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
            לקוחות ממליצים
          </h2>
          <div className="w-16 sm:w-24 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            מה הלקוחות שלנו אומרים על השירות והמקצועיות שלנו
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group hover:shadow-gold transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-white hover:transform hover:scale-105"
            >
              <CardContent className="p-6 text-center relative">
                <div className="absolute top-4 right-4 opacity-20">
                  <Quote className="h-8 w-8 text-gold" />
                </div>
                
                {testimonial.image && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover object-top border-2 border-gold shadow-md"
                    />
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 group-hover:text-gold transition-colors">
                    {testimonial.name}
                  </h3>
                  <StarRating rating={testimonial.rating} />
                </div>
                
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base italic">
                  "{testimonial.testimonial}"
                </p>
                
                {testimonial.videoUrl && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setActiveVideo(testimonial.videoUrl)}
                      className="flex items-center gap-2 bg-black text-gold border border-gold/40 rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-110 select-none"
                    >
                      <Eye className="h-4 w-4" />
                      להצצה
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-black-light/5 rounded-full px-6 py-3">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-5 w-5 text-gold fill-gold" />
              ))}
            </div>
            <span className="text-lg font-semibold text-black">
              5.0 דירוג ממוצע
            </span>
            <span className="text-gray-500">
              מעל 100 לקוחות מרוצים
            </span>
          </div>
        </div>
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 left-3 z-10 bg-black/60 text-white rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={`${activeVideo.replace('/shorts/', '/embed/')}?autoplay=1&rel=0&playsinline=1`}
              className="w-full h-full"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}