
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Hammer, 
  Paintbrush, 
  Shield, 
  Camera, 
  DoorOpen,
  Zap,
  Palette,
  Settings
} from "lucide-react";

const services = [
  {
    icon: Hammer,
    title: "ריצוף ואינסטלציה",
    description: "עבודות ריצוף מקצועיות עם חומרים איכותיים ושירות אינסטלציה מלא",
    color: "from-gold to-gold-light"
  },
  {
    icon: Paintbrush,
    title: "גבס ושפכטל",
    description: "עבודות גבס מתקדמות ושפכטל מקצועי לקירות חלקים ואיכותיים",
    color: "from-gold-dark to-gold"
  },
  {
    icon: Palette,
    title: "צבע ואפקטים",
    description: "עבודות צבע מתקדמות ומעוצבות עם אפקטים מיוחדים וגימורים מקצועיים",
    color: "from-gold to-gold-light"
  },
  {
    icon: Settings,
    title: "עבודות אלומיניום",
    description: "כל סוגי עבודות האלומיניום - חלונות, דלתות, מעקות ועוד",
    color: "from-gold-dark to-gold"
  },
  {
    icon: Camera,
    title: "מצלמות אבטחה",
    description: "התקנת מצלמות במעגל סגור ומערכות אבטחה מתקדמות",
    color: "from-gold to-gold-light"
  },
  {
    icon: Zap,
    title: "אינטרקום",
    description: "התקנת מערכות אינטרקום חכמות ומתקדמות",
    color: "from-gold-dark to-gold"
  },
  {
    icon: DoorOpen,
    title: "דלתות מיוחדות",
    description: "התקנת דלתות פנים הזזה, דלתות נסתרות ופתרונות מיוחדים",
    color: "from-gold to-gold-light"
  },
  {
    icon: Shield,
    title: "אחריות מלאה",
    description: "אחריות מלאה על כל העבודות עם שירות לאחר המכירה",
    color: "from-gold-dark to-gold"
  }
];

export default function ServicesGrid() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
            השירותים שלנו
          </h2>
          <div className="w-16 sm:w-24 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            מספקים פתרונות מקצועיים ומתקדמים לכל צרכי הבנייה והשיפוצים
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group hover:shadow-gold transition-all duration-300 border-0 bg-white hover:transform hover:scale-105"
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`}>
                  <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3 group-hover:text-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
