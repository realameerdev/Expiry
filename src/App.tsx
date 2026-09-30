import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustCategoryStrip } from './components/TrustCategoryStrip';
import { AboutSection } from './components/AboutSection';
import { ProductPreviewSection } from './components/ProductPreviewSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { CategoriesSection } from './components/CategoriesSection';
import { CtaSection } from './components/CtaSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ExpiryAppView } from './components/ExpiryAppView';
import { CategoryType } from './types/expiry';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [selectedAppCategory, setSelectedAppCategory] = useState<CategoryType | undefined>(undefined);

  const handleOpenApp = (category?: CategoryType) => {
    setSelectedAppCategory(category);
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView === 'app') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (currentView === 'app') {
    return (
      <ExpiryAppView
        onBackToLanding={handleBackToLanding}
        defaultCategory={selectedAppCategory}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F8] text-[#111111] selection:bg-[#C8FF35] selection:text-black">
      {/* Floating Navbar */}
      <Navbar
        onGetStarted={() => handleOpenApp()}
        onNavigateSection={handleNavigateSection}
      />

      <main>
        {/* 1. Hero Section */}
        <HeroSection
          onAddFirstExpiry={() => handleOpenApp()}
          onSeeHowItWorks={() => handleNavigateSection('how-it-works')}
        />

        {/* 2. Trust / Category Strip */}
        <TrustCategoryStrip />

        {/* 3. About / Value Section ("Why Expiry") */}
        <AboutSection />

        {/* 4. Product Preview Section */}
        <ProductPreviewSection
          onOpenApp={() => handleOpenApp()}
        />

        {/* 5. Features Section */}
        <FeaturesSection
          onLearnMore={() => handleNavigateSection('how-it-works')}
        />

        {/* 6. How It Works */}
        <HowItWorksSection
          onStartTracking={() => handleOpenApp()}
        />

        {/* 7. Categories Grid */}
        <CategoriesSection
          onSelectCategory={(cat) => handleOpenApp(cat)}
        />

        {/* 8. Call To Action (Large Blue Section) */}
        <CtaSection
          onGetStarted={() => handleOpenApp()}
        />

        {/* 9. FAQ Section */}
        <FaqSection />
      </main>

      {/* 10. Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
      />
    </div>
  );
}
