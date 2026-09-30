import React from 'react';
import { CheckCircle2, Shield, Bell, Clock } from 'lucide-react';
import { ExpiryLogo } from './ExpiryLogo';

export const AboutSection: React.FC = () => {
  return (
    <section id="why-expiry" className="py-14 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1688D4]" />
          <span>WHY EXPIRY</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-tight flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span>Everything important.</span>
          <span className="inline-flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#1688D4] text-white shadow-xs">
            <ExpiryLogo size={16} variant="white" />
          </span>
          <span className="text-[#1688D4]">One place.</span>
        </h2>

        <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-neutral-600 font-medium max-w-xl mx-auto leading-relaxed px-2">
          Expiry helps you keep track of the things that matter before they become a problem.
        </p>
      </div>

      {/* Asymmetric Cards Grid (inspired by the reference UIUX layout) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Card 1: Never Forget (Spans 5 cols) - Visual / Photo Card */}
        <div className="md:col-span-5 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#1688D4]/10 text-[#1688D4] flex items-center justify-center mb-4 sm:mb-5">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Never forget</h3>
            <p className="mt-1.5 sm:mt-2 text-neutral-600 font-medium text-xs sm:text-sm leading-relaxed">
              Know what's expiring soon. Automatic tracking monitors your timelines in the background so no deadline catches you off guard.
            </p>
          </div>

          {/* Visual element with generated portrait / calm visual */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-neutral-100 flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
              <img
                src="/src/assets/images/calm_organized_person_1790746019215.jpg"
                alt="Organized person"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-neutral-900 font-mono-tabular">120+</div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium">Important items safely tracked</div>
            </div>
          </div>
        </div>

        {/* Card 2: Stay Organized (Spans 4 cols) - Metric & Social Proof Card */}
        <div className="md:col-span-4 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4 sm:mb-5">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Stay organized</h3>
            <p className="mt-1.5 sm:mt-2 text-neutral-600 font-medium text-xs sm:text-sm leading-relaxed">
              Keep important dates in one place. No more lost warranties, expired passports, or surprise subscription renewals.
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-4 border-t border-neutral-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1688D4] font-mono-tabular">100%</div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-0.5">
              On-time renewal rate
            </div>
            <p className="mt-2 text-[11px] sm:text-xs text-neutral-500 italic leading-snug">
              "Expiry completely reshaped how we manage renewals. Simple, peaceful, and zero late fees."
            </p>
          </div>
        </div>

        {/* Card 3: Act on time (Spans 3 cols) - Lime Accent Card (matching reference's bright lime 520k+ card!) */}
        <div className="md:col-span-3 rounded-2xl sm:rounded-3xl bg-[#C8FF35] text-[#111111] p-5 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-black text-[#C8FF35] flex items-center justify-center mb-4 sm:mb-5">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111]">Act on time</h3>
            <p className="mt-1.5 sm:mt-2 text-[#111111]/85 font-medium text-xs sm:text-sm leading-relaxed">
              Get reminders before deadlines arrive. Take action on your schedule without penalty fees or disruptions.
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-4 border-t border-black/10">
            <div className="text-2xl sm:text-3xl font-black text-black font-mono-tabular">520k+</div>
            <div className="text-[11px] sm:text-xs font-bold text-black/75 tracking-tight mt-0.5">
              Expiries scheduled & protected
            </div>
          </div>
        </div>

      </div>

      {/* Secondary mini pill strip */}
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl sm:rounded-2xl bg-[#111111] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">Supported Categories</span>
            <div className="text-sm sm:text-lg font-bold">Documents, Subscriptions, Insurance & 5 More</div>
          </div>
          <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-[#C8FF35]">8/8</div>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-white border border-neutral-200/80 p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500">Privacy First</span>
            <div className="text-sm sm:text-lg font-bold text-neutral-900">Local-first data. No mandatory account.</div>
          </div>
          <div className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Private</span>
          </div>
        </div>
      </div>
    </section>
  );
};
