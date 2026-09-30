import React from 'react';
import { ArrowUpRight, Play, ShieldCheck, FileText, CreditCard, Globe, IdCard, Star } from 'lucide-react';
import { ExpiryLogo } from './ExpiryLogo';

interface HeroSectionProps {
  onAddFirstExpiry: () => void;
  onSeeHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAddFirstExpiry,
  onSeeHowItWorks,
}) => {
  const sampleCards = [
    {
      id: 'netflix',
      title: 'Netflix Subscription',
      category: 'Subscriptions',
      daysLeft: 3,
      status: 'urgent',
      expiryDate: 'Oct 3, 2026',
      icon: CreditCard,
      accentColor: '#EF4444',
      progress: 92,
      subtext: 'Auto-renews $19.99/mo',
    },
    {
      id: 'domain',
      title: 'Domain Renewal',
      category: 'Domains',
      daysLeft: 21,
      status: 'warning',
      expiryDate: 'Oct 21, 2026',
      icon: Globe,
      accentColor: '#F59E0B',
      progress: 78,
      subtext: 'mystartup.dev',
    },
    {
      id: 'car-insurance',
      title: 'Car Insurance',
      category: 'Insurance',
      daysLeft: 77,
      status: 'safe',
      expiryDate: 'Dec 16, 2026',
      icon: ShieldCheck,
      accentColor: '#10B981',
      progress: 45,
      subtext: 'Geico Policy #8921',
    },
    {
      id: 'passport',
      title: 'Passport',
      category: 'Documents',
      daysLeft: 152,
      status: 'safe',
      expiryDate: 'Feb 28, 2027',
      icon: FileText,
      accentColor: '#10B981',
      progress: 25,
      subtext: 'International Travel',
    },
    {
      id: 'license',
      title: "Driver's Licence",
      category: 'Licences',
      daysLeft: 320,
      status: 'safe',
      expiryDate: 'Aug 15, 2027',
      icon: IdCard,
      accentColor: '#10B981',
      progress: 12,
      subtext: 'Class D Real ID',
    },
  ];

  // Duplicate for seamless infinite marquee loop
  const duplicatedCards = [...sampleCards, ...sampleCards];

  return (
    <section id="hero" className="pt-20 sm:pt-28 pb-8 sm:pb-12 px-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-[24px] sm:rounded-[36px] md:rounded-[44px] bg-gradient-to-b from-[#1688D4] via-[#2499E8] to-[#39A4EC] relative overflow-hidden text-white shadow-[0_20px_60px_-15px_rgba(22,136,212,0.45)] border border-[#39A4EC]/40">
        
        {/* Soft atmospheric cloud overlay in bottom horizon */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-bottom opacity-35 mix-blend-screen"
            style={{ backgroundImage: `url('/src/assets/images/hero_sky_clouds_1790746007825.jpg')` }}
          />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white/35 via-white/10 to-transparent backdrop-blur-[2px]" />
        </div>

        {/* Content container */}
        <div className="relative z-10 pt-12 sm:pt-20 md:pt-24 pb-8 sm:pb-16 px-4 sm:px-8 text-center max-w-4xl mx-auto">
          
          {/* Small top brand pill */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase mb-4 sm:mb-6 shadow-xs text-white">
            <ExpiryLogo size={13} variant="lime" />
            <span>SIMPLE & PROACTIVE EXPIRY TRACKING</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl min-[420px]:text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-xs" style={{ textWrap: 'balance' }}>
            Never miss an expiry.
          </h1>

          {/* Supporting Text */}
          <p className="mt-3.5 sm:mt-6 text-sm min-[420px]:text-base sm:text-xl md:text-2xl text-blue-50/95 font-medium max-w-2xl mx-auto leading-relaxed px-2" style={{ textWrap: 'balance' }}>
            Track your documents, subscriptions, warranties and important dates in one simple place.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={onAddFirstExpiry}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#C8FF35] hover:bg-[#b8f020] text-[#111111] font-extrabold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-[0_10px_25px_rgba(200,255,53,0.4)] cursor-pointer"
            >
              <span>Add your first expiry</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            <button
              onClick={onSeeHowItWorks}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md text-white border border-white/20 font-semibold text-sm sm:text-base transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span>See how it works</span>
            </button>
          </div>

          {/* Rating / Social Proof */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-medium text-blue-100">
            <span>Rated 4.9/5 by 4,900+ organized individuals</span>
            <div className="flex text-[#C8FF35]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-[#C8FF35] stroke-none" />
              ))}
            </div>
          </div>
        </div>

        {/* Continuous Motion Marquee Demo */}
        <div className="relative z-10 pb-12 sm:pb-20 overflow-hidden">
          <div className="w-full overflow-hidden py-3">
            <div className="animate-marquee flex gap-4 px-2">
              {duplicatedCards.map((card, idx) => {
                const Icon = card.icon;
                
                return (
                  <div
                    key={`${card.id}-${idx}`}
                    onClick={onAddFirstExpiry}
                    className="w-[260px] sm:w-[280px] shrink-0 relative rounded-2xl p-4 sm:p-4.5 bg-white/95 backdrop-blur-xl border border-white/70 text-[#111111] text-left shadow-lg hover:shadow-2xl hover:scale-102 transition-all cursor-pointer"
                  >
                    {/* Header: Icon + Category */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                        {card.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-snug truncate">
                      {card.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-500 truncate mt-0.5">{card.subtext}</p>

                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${card.progress}%`,
                          backgroundColor: card.accentColor,
                        }}
                      />
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                      <div className="font-bold text-xs sm:text-sm font-mono-tabular" style={{ color: card.accentColor }}>
                        {card.daysLeft === 1 ? '1 day left' : `${card.daysLeft} days left`}
                      </div>
                      <span className="text-[10px] font-medium text-neutral-500">
                        {card.expiryDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 text-center px-4">
            <span className="inline-block text-[11px] sm:text-xs text-blue-100/90 font-medium">
              Continuous motion demo (hover to pause) · Tap any card to manage your own expiries
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
