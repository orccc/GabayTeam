import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Upload, Shield } from "lucide-react";

export default function HeroSection({ videoUrl }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop&crop=center')`,
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        {/* Main Content */}
        <div className="flex flex-col gap-8 sm:gap-12">
          {/* Top - Title */}
          <div className="text-center animate-fade-in">
             <div className="flex justify-center items-center mb-6">
                <Badge variant="outline" className="border-gold text-gold bg-black/30 backdrop-blur-sm px-4 py-2 text-sm sm:text-base">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  אחריות מלאה
                </Badge>
              </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight text-shadow-lg">
              גבאי יזמות • בנייה • שיפוצים
            </h1>
            <div className="w-20 sm:w-32 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
            <p className="text-xl sm:text-2xl text-gold font-medium mb-8">
              איכות ללא פשרות • מקצועיות ללא גבול
            </p>
          </div>

          {/* Video Section */}
          <div className="animate-slide-up mb-8">
            <Card className="bg-black-light/40 backdrop-blur-md border-gold/30 overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                {videoUrl ? (
                  <div className="relative aspect-video">
                    {!isVideoPlaying ? (
                      <div className="relative">
                       <img 
                         src="https://media.base44.com/images/public/6877bb8d274d4fc432d2e2f6/58ef18488_Gemini_Generated_Image_dgl58qdgl58qdgl5.png"
                         alt="תמונה מקדימה של הסרטון"
                         className="w-full h-full object-cover"
                       />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Button
                            onClick={() => setIsVideoPlaying(true)}
                            className="bg-gold hover:bg-gold-dark text-black font-bold px-6 sm:px-10 py-4 sm:py-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 text-base sm:text-lg"
                          >
                            <PlayCircle className="h-6 w-6 sm:h-7 sm:w-7 ml-2" />
                            צפה בעבודות שלנו
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <iframe 
                        className="w-full h-full"
                        src={getYouTubeEmbedUrl(videoUrl)}
                        title="סרטון עבודות"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&h=720&fit=crop&crop=center"
                      alt="סלון מעוצב לאחר שיפוץ"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-shadow-lg">
                          תוצאות שמדברות בעד עצמן
                        </h3>
                        <p className="text-gold font-semibold text-base sm:text-lg">
                          עיצוב ושיפוץ ברמה הגבוהה ביותר
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Services Content */}
          <div className="animate-fade-in">
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-5 sm:p-7 border border-gold/30 hover:border-gold/60 transition-all duration-300 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gold mb-3 sm:mb-4">
                גבאי מאז שנות ה-90 ועד היום מעטפת מקצועית תחת קורת גג אחת
              </h3>
              <p className="text-gray-200 leading-relaxed text-base sm:text-lg mb-4">
                קבלן רשום המלווה את הפרויקט משלב התכנון ועד הגמר, עם בעלי מקצוע קבועים ופיקוח אישי.
              </p>
              <div className="space-y-2 text-gray-200 leading-relaxed text-base sm:text-lg">
                <p><span className="font-semibold text-gold">בנייה, שיפוצים והרחבות</span><br />שיפוץ דירות, בתים פרטיים, יחידות דיור, הרחבות ותוספות בנייה ברמת גימור גבוהה.</p>
                <p><span className="font-semibold text-gold">גמר, עיצוב ותשתיות</span><br />ריצוף, איטום, גבס, צבע, אינסטלציה, אלומיניום, דלתות, מטבחים ומערכות מתקדמות.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}