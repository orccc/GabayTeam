import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Eye, X } from "lucide-react";
import { defaultTestimonials } from "@/data/testimonials";
import { fetchCollection } from "@/lib/firestore";

// ההמלצות נטענות מ-Firestore (מתעדכנות דרך בוט הטלגרם), ממוינות לפי השדה order.
// אם אין שם המלצות או שהטעינה נכשלה, מוצגות ההמלצות המקוריות מהקוד.
function useTestimonials() {
  const [testimonials, setTestimonials] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetchCollection("testimonials", { signal: controller.signal })
      .then((docs) => docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
      .catch(() => [])
      .then((docs) => {
        if (!cancelled) setTestimonials(docs.length ? docs : defaultTestimonials);
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return testimonials;
}

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

function getYouTubeEmbedUrl(videoUrl) {
  if (!videoUrl) return null;
  try {
    const u = new URL(videoUrl);
    const host = u.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return `https://www.youtube.com/embed/${id}`;
    }

    if (host.includes('youtube.com')) {
      // shorts -> embed
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/shorts/')[1];
        return `https://www.youtube.com/embed/${id}`;
      }

      // watch?v=ID
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
      }

      // already embed
      if (u.pathname.startsWith('/embed/')) {
        return `https://${u.hostname}${u.pathname}`;
      }
    }

    return videoUrl;
  } catch (e) {
    return videoUrl;
  }
}

export default function TestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState(null);
  const testimonials = useTestimonials();

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-[#f5f3ee]">
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

        {/* עד שההמלצות נטענות שומרים מקום, כדי שהעמוד לא יקפוץ */}
        {!testimonials && <div className="min-h-[320px]" />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials?.map((testimonial, index) => (
            <Card
              key={testimonial.id ?? index}
              className="group hover:shadow-gold transition-all duration-300 border-0 bg-[#faf7f3] hover:transform hover:scale-105"
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
                      onClick={() => setActiveVideo({ original: testimonial.videoUrl, embed: getYouTubeEmbedUrl(testimonial.videoUrl) })}
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
          <div className="inline-flex flex-col items-center gap-3 bg-[#faf7f3] rounded-full px-6 py-4 border border-gold/20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-5 w-5 text-gold fill-gold" />
                ))}
              </div>
              <span className="text-lg font-semibold text-black">
                4.8 דירוג ממוצע
              </span>
            </div>
            <span className="text-gray-500">
              מזמינים אתכם להצטרף למאגר הלקוחות שלנו
            </span>
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJNyE74RQrAxUR0h4p5gH2KOw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-gold-dark"
            >
              כתבו לנו ביקורת ב-Google
            </a>
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
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <a
                href={activeVideo.original || activeVideo}
                target="_blank"
                rel="noreferrer"
                className="bg-black/60 text-white rounded-full px-3 py-1 text-sm font-medium"
              >
                פתח ביוטיוב
              </a>
            </div>
            <iframe
              src={`${getYouTubeEmbedUrl(activeVideo && (activeVideo.embed || activeVideo))}?autoplay=1&rel=0&playsinline=1`}
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