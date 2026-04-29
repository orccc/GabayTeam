import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Music,
  MapPin,
  Clock,
  Mail,
  Send,
  X
} from "lucide-react";
import { base44 } from "@/api/base44Client";

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
    href: "https://facebook.com/eligabay22",
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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendEmail = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: "tovor777@gmail.com",
      subject: `פנייה חדשה מהאתר מ-${name}`,
      body: `שם: ${name}\nטלפון: ${phone}\nכתובת: ${address || "לא צוינה"}\n\nהודעה:\n${message || "לא צוינה"}`
    });
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setShowEmailModal(false);
      setSent(false);
      setName("");
      setPhone("");
      setAddress("");
      setMessage("");
    }, 2000);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-black-soft to-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            יצירת קשר
          </h2>
          <div className="w-16 sm:w-24 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            נשמח לעמוד לרשותכם בכל שאלה או בקשה. צרו קשר בכל דרך שנוחה לכם
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Card 
            className="group bg-black-light/50 border-gold/40 hover:border-gold cursor-pointer transition-all duration-300 hover:shadow-gold"
            onClick={() => setShowEmailModal(true)}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gold">
                השאר פרטים
              </h3>
              <p className="text-gray-400 text-sm mb-2 sm:mb-3">קבל הצעת מחיר</p>
              <p className="text-gold text-xs mb-3 sm:mb-4 font-bold">📩 לחץ כאן</p>
              <Button className="w-full bg-gold hover:bg-gold-dark text-black font-semibold transition-all duration-300 text-sm sm:text-base">
                שלח פרטים
              </Button>
            </CardContent>
          </Card>
          {contactMethods.map((method, index) => (
            <Card key={index} className="group bg-black-light/50 border-gold/20 hover:border-gold/60 transition-all duration-300 hover:shadow-gold">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
                  {method.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2 sm:mb-3">{method.subtitle}</p>
                <p className="text-gray-300 text-xs mb-3 sm:mb-4">{method.description}</p>
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
          <Card className="bg-black-light/50 border-gold/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">כתובת</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                תל אביב, ישראל<br />
                שירות בכל הארץ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black-light/50 border-gold/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gold mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">שעות פעילות</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                ראשון - חמישי: 7:00-19:00<br />
                שישי: 7:00-14:00
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gold/40 rounded-2xl w-full max-w-md p-6 sm:p-8 relative">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
            <Mail className="h-10 w-10 text-gold mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white">צור קשר</h3>
            <p className="text-gray-400 text-sm mt-1">נחזור אליך בהקדם</p>
            </div>

            {sent ? (
            <div className="text-center py-6">
              <div className="text-green-400 text-5xl mb-3">✓</div>
              <p className="text-white text-lg font-semibold">ההודעה נשלחה בהצלחה!</p>
            </div>
            ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">שם *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="הכנס שם מלא..."
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold text-right"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">טלפון *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="הכנס מספר טלפון..."
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold text-right"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">כתובת</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="הכנס כתובת..."
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold text-right"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">הודעה</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="כתוב כאן את ההודעה..."
                  rows={4}
                  className="w-full bg-black/50 border border-gold/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gold resize-none text-right"
                />
              </div>
              <Button
                onClick={handleSendEmail}
                disabled={sending || !name.trim() || !phone.trim()}
                className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-3 text-base"
              >
                {sending ? (
                  "שולח..."
                ) : (
                  <>
                    <Send className="h-4 w-4 ml-2" />
                    שלח
                  </>
                )}
              </Button>
            </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}