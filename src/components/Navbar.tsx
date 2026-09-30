import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { ExpiryLogo } from './ExpiryLogo';

interface NavbarProps {
  onGetStarted: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStarted, onNavigateSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', target: 'hero' },
    { label: 'How it works', target: 'how-it-works' },
    { label: 'Features', target: 'features' },
    { label: 'Categories', target: 'categories' },
    { label: 'FAQ', target: 'faq' },
  ];

  const handleLinkClick = (target: string) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-2.5 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3.5 sm:px-5 py-2 sm:py-3 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] pointer-events-auto transition-all">
        {/* Left: Brand with Expiry logo & name */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1688D4] rounded-lg cursor-pointer"
          aria-label="Expiry Home"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#111111] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <ExpiryLogo size={18} variant="white" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#111111]">Expiry</span>
        </button>

        {/* Center: Desktop Navigation links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-7">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleLinkClick(link.target)}
              className="text-sm font-medium text-[#4B5563] hover:text-[#111111] transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right: Get Started button with Lime Accent */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#C8FF35] hover:bg-[#b8f020] active:scale-95 text-[#111111] font-bold text-xs sm:text-sm transition-all shadow-[0_2px_12px_rgba(200,255,53,0.35)] cursor-pointer whitespace-nowrap min-h-[38px]"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-3xl bg-white/98 backdrop-blur-xl border border-neutral-200/80 p-4 shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleLinkClick(link.target)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-neutral-400 text-xs">→</span>
              </button>
            ))}
            <div className="pt-2 mt-1 border-t border-neutral-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#C8FF35] text-[#111111] font-extrabold text-sm shadow-md active:scale-98 cursor-pointer"
              >
                <span>Launch Expiry App</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
