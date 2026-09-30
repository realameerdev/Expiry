import React from 'react';
import {
  FileText,
  CreditCard,
  ShieldCheck,
  Wrench,
  Award,
  Globe,
  IdCard,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { CategoryType } from '../types/expiry';

interface CategoriesSectionProps {
  onSelectCategory?: (category: CategoryType) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  const categoryCards = [
    {
      name: 'Documents' as CategoryType,
      icon: FileText,
      description: 'Passports, identity cards, lease contracts, and legal deeds.',
      examples: 'Passport · Lease · Visa',
      color: '#1688D4',
      count: '6 items',
    },
    {
      name: 'Subscriptions' as CategoryType,
      icon: CreditCard,
      description: 'Streaming services, cloud software, hosting, and media passes.',
      examples: 'Netflix · Spotify · GitHub',
      color: '#C8FF35',
      count: '12 items',
    },
    {
      name: 'Insurance' as CategoryType,
      icon: ShieldCheck,
      description: 'Auto, health, property, life, travel, and pet insurance policies.',
      examples: 'Car · Health · Home',
      color: '#1688D4',
      count: '4 items',
    },
    {
      name: 'Warranties' as CategoryType,
      icon: Wrench,
      description: 'Electronics, vehicles, consumer gadgets, and major home appliances.',
      examples: 'AppleCare · TV · Laptop',
      color: '#C8FF35',
      count: '5 items',
    },
    {
      name: 'Certificates' as CategoryType,
      icon: Award,
      description: 'Professional credentials, safety certifications, and compliance.',
      examples: 'AWS · CPR · First Aid',
      color: '#1688D4',
      count: '3 items',
    },
    {
      name: 'Domains' as CategoryType,
      icon: Globe,
      description: 'Domain names, SSL certificates, DNS registrations, and DNSSEC.',
      examples: '.com · .dev · SSL certs',
      color: '#C8FF35',
      count: '8 items',
    },
    {
      name: 'Licences' as CategoryType,
      icon: IdCard,
      description: "Driver's licences, trade permits, boating and recreational passes.",
      examples: "Driver's · Commercial",
      color: '#1688D4',
      count: '2 items',
    },
    {
      name: 'Memberships' as CategoryType,
      icon: Users,
      description: 'Gym clubs, co-working spaces, professional unions, and lounges.',
      examples: 'Gym · Co-work · Club',
      color: '#C8FF35',
      count: '4 items',
    },
  ];

  return (
    <section id="categories" className="py-14 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1688D4]" />
          <span>EXPIRY ECOSYSTEM</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight">
          Track across 8 core categories
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-neutral-600 font-medium px-2">
          Whether personal, technical or business related, Expiry keeps them sorted.
        </p>
      </div>

      <div className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {categoryCards.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#1688D4]/30 hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-neutral-100 group-hover:bg-[#1688D4] text-neutral-800 group-hover:text-white transition-colors flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                  </div>
                  <span className="text-neutral-300 group-hover:text-[#1688D4] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight group-hover:text-[#1688D4] transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-xs text-neutral-600 font-medium leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-500">{cat.examples}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
