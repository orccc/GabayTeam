
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const workExamples = [
  {
    title: "שיפוץ מטבח מודרני",
    category: "שיפוצים",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    description: "שיפוץ מטבח מלא עם ריצוף, צבע ואינסטלציה"
  },
  {
    title: "חזית אלומיניום",
    category: "אלומיניום",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=400&fit=crop",
    description: "התקנת חזית אלומיניום מתקדמת"
  },
  {
    title: "עבודות גבס מעוצבות",
    category: "גבס",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    description: "תקרות גבס מעוצבות עם תאורה"
  },
  {
    title: "מערכת אבטחה",
    category: "אבטחה",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    description: "התקנת מערכת מצלמות ואינטרקום"
  },
  {
    title: "צביעה מקצועית",
    category: "צבע",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop",
    description: "עבודות צבע עם אפקטים מיוחדים"
  },
  {
    title: "דלתות הזזה",
    category: "דלתות",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop",
    description: "התקנת דלתות הזזה מודרניות"
  }
];

export default function WorkGallery() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
            גלריית עבודות
          </h2>
          <div className="w-16 sm:w-24 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            צפו בחלק מהעבודות שביצענו בהצלחה עבור לקוחותינו
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {workExamples.map((work, index) => (
            <Card 
              key={index}
              className="group overflow-hidden hover:shadow-gold transition-all duration-300 border-0"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={work.image}
                  alt={work.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">צפה בפרטים</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-black group-hover:text-gold transition-colors">
                    {work.title}
                  </h3>
                  <Badge className="bg-gold text-black text-xs sm:text-sm">
                    {work.category}
                  </Badge>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {work.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
