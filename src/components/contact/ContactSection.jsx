import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Music,
  MapPin,
  Clock
} from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "טלפון",
    subtitle: "התקשר עכשיו",
    action: "0525549546",
    href: "tel:0525549546",
    color: "from-green-500 to-green-600",
    description: "שירות זמין 24/7"
  },
  {
    icon: MessageCircle,
    title: "וואטסאפ",
    subtitle: "שלח הודעה",
    action: "פתח וואטסאפ",
    href: "https://wa.me/972525549546",
    color: "from-green-400 to-green-500",
    description: "תגובה מיידית"
  },
  {
    icon: Instagram,
    title: "אינסטגרם",
    subtitle: "עקוב אחרינו",
    action: "פתח אינסטגרם",
    href: "https://instagram.com/90_eligabay",
    color: "from-pink-500 to-purple-600",
    description: "עבודות חדשות יומיות"
  },
  {
    icon: Facebook,
    title: "פייסבוק",
    subtitle: "הצטרף לעמוד",
    action: "פתח פייסבוק",
    href: "https://www.facebook.com/share/1A5RCbfufa/",
    color: "from-blue-600 to-blue-700",
    description: "עדכונים וטיפים"
  },
  {
    icon: Music,
    title: "טיקטוק",
    subtitle: "צפה בסרטונים",
    action: "פתח טיקטוק",
    href: "https://tiktok.com/@eligabay2022",
    color: "from-black to-gray-800",
    description: "עבודות קצרות ומעניינות"
  }
];

export default function ContactSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f5f3ee] text-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            יצירת קשר
          </h2>
          <div className="w-16 sm:w-24 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto px-4">
            נשמח לעמוד לרשותכם בכל שאלה או בקשה. צרו קשר בכל דרך שנוחה לכם
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} className="group bg-[#faf7f3] border-gold/20 hover:border-gold/60 transition-all duration-300 hover:shadow-gold">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 sm:mb-3">{method.subtitle}</p>
                <p className="text-gray-700 text-xs mb-3 sm:mb-4">{method.description}</p>
                <Button 
                  asChild
                  className="w-full bg-gold hover:bg-gold-dark text-black font-semibold transition-all duration-300 text-sm sm:text-base"
                >
                  <a href={method.href} target="_blank" rel="noopener noreferrer">
                    {method.action}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="bg-[#faf7f3] border-gold/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black">כתובת</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                ירושלים, מודיעין, ישובי בנימין ומעלה אדומים
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#faf7f3] border-gold/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black">שעות פעילות</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                ראשון - חמישי: 7:00-19:00<br />
                שישי: 7:00-14:00
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}