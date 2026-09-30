import React from 'react';
import { Layers, BellRing, Activity, FolderKanban } from 'lucide-react';

interface FeaturesSectionProps {
  onLearnMore?: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onLearnMore }) => {
  const features = [
    {
      title: 'Track anything',
      description: 'Add documents, subscriptions, warranties and important dates in seconds.',
      icon: Layers,
      highlight: 'Unlimited tracking items',
    },
    {
      title: 'Smart reminders',
      description: 'Know when something is getting close to expiry before penalties or lapses occur.',
      icon: BellRing,
      highlight: 'Configurable lead times (7, 14, 30 days)',
    },
    {
      title: 'Clear status',
      description: 'Immediately understand what is safe, approaching or expired at a single glance.',
      icon: Activity,
      highlight: 'Color-coded semantic signals',
    },
    {
      title: 'Organized categories',
      description: 'Keep everything cleanly filed across 8 intuitive categories that make sense.',
      icon: FolderKanban,
      highlight: 'Instant multi-category filtering',
    },
  ];

  return (
    <section id="features" className="py-14 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1688D4]" />
          <span>EXPIRY FEATURES</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight">
          Simple tracking. Timely reminders.
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-neutral-600 font-medium px-2">
          Everything built around clarity, speed, and keeping your commitments intact.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div>
                {/* Lime Icon Box */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#C8FF35] text-[#111111] flex items-center justify-center mb-4 sm:mb-6 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 font-medium">
                <span>{feature.highlight}</span>
                <span className="font-mono-tabular text-neutral-300">0{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
