export default function PageNotFound() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-6 bg-[#f5f3ee]">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-[#D4AF37]">404</h1>
        <div className="h-1 w-16 bg-[#D4AF37] rounded-full mx-auto"></div>
        <h2 className="text-2xl font-semibold text-black">העמוד לא נמצא</h2>
        <p className="text-gray-600">הכתובת שחיפשת לא קיימת באתר.</p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] hover:bg-[#B8860B] px-6 py-2 text-sm font-semibold text-black transition-colors"
        >
          חזרה לדף הבית
        </a>
      </div>
    </div>
  );
}
