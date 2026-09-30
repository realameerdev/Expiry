import React, { useState } from 'react';
import {
  Search,
  Plus,
  ArrowUpRight,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  CreditCard,
  Globe,
  MoreVertical,
} from 'lucide-react';
import { ExpiryLogo } from './ExpiryLogo';

interface ProductPreviewProps {
  onOpenApp: () => void;
}

export const ProductPreviewSection: React.FC<ProductPreviewProps> = ({ onOpenApp }) => {
  const [filter, setFilter] = useState<'all' | 'safe' | 'approaching'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>('netflix');

  const previewItems = [
    {
      id: 'netflix',
      title: 'Netflix Subscription',
      category: 'Subscriptions',
      daysLeft: 3,
      status: 'critical',
      expiryDate: 'Oct 3, 2026',
      icon: CreditCard,
      identifier: 'Premium UHD plan',
      notes: 'Billed to business credit card. Review active viewers.',
    },
    {
      id: 'domain',
      title: 'Domain Renewal',
      category: 'Domains',
      daysLeft: 21,
      status: 'approaching',
      expiryDate: 'Oct 21, 2026',
      icon: Globe,
      identifier: 'mystartup.dev',
      notes: 'Registered with Cloudflare Registrar. Auto-renew active.',
    },
    {
      id: 'insurance',
      title: 'Car Insurance',
      category: 'Insurance',
      daysLeft: 77,
      status: 'safe',
      expiryDate: 'Dec 16, 2026',
      icon: ShieldCheck,
      identifier: 'Geico Policy #8921-X',
      notes: 'Annual policy renewal. Check for safe driver discount.',
    },
    {
      id: 'passport',
      title: 'Passport',
      category: 'Documents',
      daysLeft: 152,
      status: 'safe',
      expiryDate: 'Feb 28, 2027',
      icon: FileText,
      identifier: 'Doc #P8942109',
      notes: 'Requires 6 months validity for European and Asian travel.',
    },
  ];

  const filteredItems = previewItems.filter((item) => {
    if (filter === 'safe' && item.status !== 'safe') return false;
    if (filter === 'approaching' && item.status === 'safe') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.identifier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="py-12 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1688D4]" />
            <span>INTERACTIVE DASHBOARD PREVIEW</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Designed for clarity, built for peace of mind.
          </h2>
          <p className="mt-2 text-neutral-600 font-medium text-xs sm:text-base max-w-xl">
            Live preview of your Expiry workspace. See statuses at a glance with zero visual clutter.
          </p>
        </div>

        <button
          onClick={onOpenApp}
          className="self-start md:self-auto flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#111111] hover:bg-black text-[#C8FF35] font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-98"
        >
          <span>Launch interactive app</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* The Dashboard Preview Shell */}
      <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white shadow-xl overflow-hidden">
        {/* Mock Top Application Bar */}
        <div className="p-3.5 sm:px-6 sm:py-4 bg-neutral-50/90 border-b border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#111111] flex items-center justify-center">
                <ExpiryLogo size={14} variant="white" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-neutral-900">Expiry Workspace</span>
            </div>
            <span className="text-[10px] sm:text-xs text-neutral-400 font-mono-tabular">v1.0 · Local</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search preview..."
                className="w-full sm:w-48 md:w-56 pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#1688D4]"
              />
            </div>

            <button
              onClick={onOpenApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8FF35] hover:bg-[#bbf32d] text-neutral-900 font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Dashboard Sub-header / Filter Tabs */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2.5 bg-white">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              All (4)
            </button>
            <button
              onClick={() => setFilter('approaching')}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'approaching'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Approaching (2)
            </button>
            <button
              onClick={() => setFilter('safe')}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'safe'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Safe (2)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe (&gt; 30d)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Approaching (&le; 30d)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Critical (&le; 7d)
            </span>
          </div>
        </div>

        {/* Items Table / List */}
        <div className="divide-y divide-neutral-100">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItem === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`p-3.5 sm:p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50/40' : 'hover:bg-neutral-50/80'
                }`}
              >
                {/* Left: Icon + Title + Category */}
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.status === 'safe'
                        ? 'bg-emerald-50 text-emerald-600'
                        : item.status === 'approaching'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-neutral-900 text-sm sm:text-base truncate">{item.title}</h4>
                      <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400">· {item.category}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-neutral-500 truncate mt-0.5">{item.identifier}</p>
                  </div>
                </div>

                {/* Right: Days countdown & status pill */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-8 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] sm:text-xs text-neutral-400">Expires</div>
                    <div className="text-[11px] sm:text-xs font-semibold text-neutral-700 font-mono-tabular">
                      {item.expiryDate}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-mono-tabular border ${
                        item.status === 'safe'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'approaching'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {item.status === 'safe' && <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                      {item.status === 'approaching' && <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                      {item.status === 'critical' && <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                      <span>{item.daysLeft} days left</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Item Detail Drawer in preview */}
        {selectedItem && (
          <div className="p-3.5 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-neutral-700">
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Item Details:
              </span>
              <span className="font-semibold text-neutral-900">
                {previewItems.find((i) => i.id === selectedItem)?.title}
              </span>
              <span className="text-neutral-500 text-[11px] sm:text-xs">
                — {previewItems.find((i) => i.id === selectedItem)?.notes}
              </span>
            </div>

            <button
              onClick={onOpenApp}
              className="text-[#1688D4] hover:text-[#0f6bb1] font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Manage in app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
