import React from "react";
import FloatingHeader from './components/common/FloatingHeader';

export default function Layout({ children, currentPageName }) {
  const logoUrl = "https://media.base44.com/images/public/6877bb8d274d4fc432d2e2f6/23fa25ea4_Gemini_Generated_Image_rfrtvbrfrtvbrfrt.png?_gl=1*1pa0hzt*_gcl_au*MTUxNzk1NTA2Ni4xNzc2NzgwMjI5";

  return (
    <div style={{
      '--gold': '#D4AF37',
      '--gold-light': '#FFD700',
      '--gold-dark': '#B8860B',
      '--black': '#000000',
      '--black-soft': '#1A1A1A',
      '--black-light': '#2A2A2A',
      '--white': '#FFFFFF',
      '--gray-light': '#F5F5F5'
    }}>
      <style>{`
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          margin: 0;
          padding: 0;
          background: var(--white);
          color: var(--black);
          line-height: 1.6;
        }
        
        .gold-gradient {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
        }
        
        .text-gold {
          color: var(--gold);
        }
        
        .hover-gold:hover {
          color: var(--gold);
        }
        
        .border-gold {
          border-color: var(--gold);
        }
        
        .bg-gold {
          background-color: var(--gold);
        }
        
        .shadow-gold {
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }
        
        .rtl {
          direction: rtl;
          text-align: right;
        }
      `}</style>
      
      <div className="min-h-screen bg-white rtl">
        <FloatingHeader logoUrl={logoUrl} />
        <main className="pt-20 sm:pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}