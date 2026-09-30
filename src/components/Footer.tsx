import React from 'react';
import { ExpiryLogo } from './ExpiryLogo';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-neutral-200/80 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
        
        {/* Left: Brand + Tagline */}
        <div className="flex flex-col items-center md:items-start gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center shadow-xs">
              <ExpiryLogo size={18} variant="white" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900">Expiry</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-neutral-500">
            Never miss an expiry.
          </p>
        </div>

        {/* Center / Right: Clean Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-neutral-600">
          <button
            onClick={() => onNavigateSection('hero')}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1"
          >
            Home
          </button>
          <button
            onClick={() => onNavigateSection('features')}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1"
          >
            Features
          </button>
          <button
            onClick={() => onNavigateSection('how-it-works')}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1"
          >
            How it works
          </button>
          <button
            onClick={() => onNavigateSection('categories')}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1"
          >
            Categories
          </button>
          <button
            onClick={() => onNavigateSection('faq')}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1"
          >
            FAQ
          </button>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('faq');
            }}
            className="hover:text-neutral-900 transition-colors py-1"
          >
            Privacy
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('faq');
            }}
            className="hover:text-neutral-900 transition-colors py-1"
          >
            Terms
          </a>
          <a
            href="https://devameer.xyz/buy-me-a-coffee"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 transition-colors py-1 text-[#1688D4] font-medium"
          >
            Support the Builder
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-[11px] sm:text-xs text-neutral-400 font-medium font-mono-tabular">
          © {currentYear} Expiry. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
