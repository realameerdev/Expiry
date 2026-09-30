import React from 'react';
import { PlusCircle, CalendarDays, BellRing, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartTracking: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ onStartTracking }) => {
  const steps = [
    {
      step: '01',
      title: 'Add it',
      description: 'Enter what you need to remember.',
      detail: 'Passport, car insurance, domain name, or subscription. Simply type the name and pick a category.',
      icon: PlusCircle,
    },
    {
      step: '02',
      title: 'Set the date',
      description: 'Choose when it expires.',
      detail: 'Pick the expiry date. Set how many days in advance you want to be alerted (7, 14, 30 days).',
      icon: CalendarDays,
    },
    {
      step: '03',
      title: 'Get reminded',
      description: 'Expiry helps you act before it’s too late.',
      detail: 'Keep your documents renewed, avoid late fees, and maintain continuous coverage without worry.',
      icon: BellRing,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1688D4]" />
          <span>EFFORTLESS WORKFLOW</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight">
          How it works
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-neutral-600 font-medium px-2">
          Three simple steps to stay ahead of every deadline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
            >
              <div>
                {/* Large Number */}
                <div className="flex items-center justify-between mb-5 sm:mb-8">
                  <span className="text-4xl sm:text-6xl font-extrabold font-mono-tabular text-neutral-200 group-hover:text-[#1688D4] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-neutral-100 group-hover:bg-[#C8FF35] text-neutral-800 transition-colors flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold text-[#1688D4]">
                  {item.description}
                </p>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  {item.detail}
                </p>
              </div>

              <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] sm:text-xs font-bold text-neutral-400">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-12 text-center">
        <button
          onClick={onStartTracking}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-full bg-[#111111] hover:bg-neutral-900 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <span>Try it with your first expiry</span>
          <ArrowRight className="w-4 h-4 text-[#C8FF35]" />
        </button>
      </div>
    </section>
  );
};
