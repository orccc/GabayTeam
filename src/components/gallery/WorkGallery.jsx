import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

const ALL = "הכל";

export default function WorkGallery({ projects = [] }) {
  const [category, setCategory] = useState(ALL);
  const [open, setOpen] = useState(null); // { project, index }
  const [touchStartX, setTouchStartX] = useState(null);

  const valid = useMemo(
    () => projects.filter((p) => Array.isArray(p.images) && p.images.length > 0),
    [projects]
  );
  const categories = useMemo(
    () => [ALL, ...new Set(valid.map((p) => p.category).filter(Boolean))],
    [valid]
  );
  const visible = category === ALL ? valid : valid.filter((p) => p.category === category);

  const isOpen = open !== null;
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir) => {
    setOpen((cur) => {
      if (!cur) return cur;
      const total = cur.project.images.length;
      return { ...cur, index: (cur.index + dir + total) % total };
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      // האתר ב-RTL: כפתור "הבא" נמצא בצד שמאל
      if (e.key === "ArrowLeft") step(1);
      if (e.key === "ArrowRight") step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, step]);

  if (valid.length === 0) return null;

  const current = open ? open.project : null;
  const multi = current ? current.images.length > 1 : false;

  const onTouchEnd = (e) => {
    if (touchStartX === null || !multi) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    setTouchStartX(null);
    // RTL: החלקה ימינה מביאה את התמונה הבאה מצד שמאל
    if (Math.abs(dx) > 50) step(dx > 0 ? 1 : -1);
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-[#f5f3ee]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6">
            גלריית עבודות
          </h2>
          <div className="w-16 sm:w-24 h-1 gold-gradient rounded-full mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            צפו בחלק מהעבודות שביצענו עבור לקוחותינו
          </p>
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
                className={
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 border " +
                  (category === cat
                    ? "bg-gold text-black border-gold shadow-gold"
                    : "bg-[#faf7f3] text-gray-700 border-gold/30 hover:border-gold")
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {visible.map((project) => (
            <button
              key={project.id || project.title}
              type="button"
              onClick={() => setOpen({ project, index: 0 })}
              aria-label={`פתח את הפרויקט ${project.title}`}
              className="group text-right rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Card className="overflow-hidden h-full hover:shadow-gold transition-all duration-300 border-0 bg-[#faf7f3]">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {project.images.length > 1 && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                      <Images className="h-3.5 w-3.5" />
                      {project.images.length}
                    </span>
                  )}
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-black group-hover:text-gold transition-colors">
                      {project.title}
                    </h3>
                    {project.category && (
                      <Badge className="bg-gold text-black text-xs sm:text-sm shrink-0">
                        {project.category}
                      </Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {project.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={close}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              key={current.images[open.index]}
              src={current.images[open.index]}
              alt={`${current.title} - תמונה ${open.index + 1}`}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />

            <button
              type="button"
              onClick={close}
              autoFocus
              aria-label="סגור"
              className="absolute top-3 left-3 bg-black/60 text-white rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            {multi && (
              <>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="התמונה הבאה"
                  className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/60 text-white rounded-full p-2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="התמונה הקודמת"
                  className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/60 text-white rounded-full p-2"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="mt-4 text-center text-white">
              <h3 className="text-lg sm:text-xl font-semibold">{current.title}</h3>
              {current.description && (
                <p className="text-gray-300 text-sm sm:text-base mt-1">{current.description}</p>
              )}
              {multi && (
                <p className="text-gold text-sm mt-2">
                  {open.index + 1} / {current.images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
