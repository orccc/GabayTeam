import React from "react";
import HeroSection from "../components/hero/HeroSection";
import ServicesGrid from "../components/services/ServicesGrid";
import AboutSection from "../components/about/AboutSection";
import TestimonialsSection from "../components/testimonials/TestimonialsSection";
import ContactSection from "../components/contact/ContactSection";

export default function Home() {
  const videoUrl = "https://www.youtube.com/watch?v=G8ElTa3N_9U";

  return (
    <div className="min-h-screen">
      <HeroSection videoUrl={videoUrl} />
      <ServicesGrid />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}