import React from 'react';
import {
  FileText,
  CreditCard,
  ShieldCheck,
  Wrench,
  Award,
  Globe,
  Users,
  Calendar,
} from 'lucide-react';

export const TrustCategoryStrip: React.FC = () => {
  const categories = [
    { name: 'Documents', icon: FileText },
    { name: 'Subscriptions', icon: CreditCard },
    { name: 'Warranties', icon: Wrench },
    { name: 'Certificates', icon: Award },
    { name: 'Insurance', icon: ShieldCheck },
    { name: 'Domains', icon: Globe },
    { name: 'Memberships', icon: Users },
    { name: 'Important Dates', icon: Calendar },
  ];

  return (
    <div className="w-full py-5 sm:py-8 border-y border-neutral-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 shrink-0 text-center md:text-left">
            COMMON THINGS TO TRACK
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-3">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#1688D4] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
