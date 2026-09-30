import React from 'react';
import { ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { ExpiryLogo } from './ExpiryLogo';

interface CtaSectionProps {
  onGetStarted: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-10 sm:py-20 px-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-[24px] sm:rounded-[36px] md:rounded-[44px] bg-gradient-to-b from-[#1688D4] via-[#2499E8] to-[#1E90E0] relative overflow-hidden text-white shadow-[0_20px_50px_-15px_rgba(22,136,212,0.4)] border border-[#39A4EC]/40 p-6 sm:p-14 md:p-20 text-center">
        
        {/* Soft atmospheric cloud overlay in bottom horizon */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-bottom opacity-30 mix-blend-screen"
            style={{ backgroundImage: `url('/src/assets/images/hero_sky_clouds_1790746007825.jpg')` }}
          />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase mb-4 sm:mb-6 shadow-xs text-white">
            <ExpiryLogo size={13} variant="lime" />
            <span>START ORGANIZING TODAY</span>
          </div>

          <h2 className="text-2xl min-[420px]:text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
            Your important dates deserve a reminder.
          </h2>

          <p className="mt-3.5 sm:mt-5 text-sm sm:text-xl text-blue-50/90 font-medium max-w-xl mx-auto leading-relaxed px-2">
            Start tracking your expiries today. No account needed.
          </p>

          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#C8FF35] hover:bg-[#b8f020] text-[#111111] font-extrabold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 active:scale-98 shadow-[0_10px_25px_rgba(200,255,53,0.4)] cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-blue-100 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8FF35]" /> 100% Private local storage
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8FF35]" /> Instant start, no registration
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
