import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  RefreshCw,
  Download,
  RotateCcw,
  Bell,
  Mail,
  Undo2,
  ShieldAlert,
  Send,
  Check,
  X,
  History,
} from 'lucide-react';
import { ExpiryLogo } from './ExpiryLogo';
import { ExpiryItem, DeletedItem, CategoryType, calculateDaysLeft, getExpiryStatus, formatDaysLeftLabel } from '../types/expiry';
import { INITIAL_EXPIRIES } from '../data/initialData';
import { CATEGORIES_LIST } from '../data/categories';
import { AddExpiryModal } from './AddExpiryModal';

interface ExpiryAppViewProps {
  onBackToLanding: () => void;
  defaultCategory?: CategoryType;
}

const STORAGE_KEY = 'expiry_tracker_items_v2';
const DELETED_STORAGE_KEY = 'expiry_tracker_deleted_v2';
const EMAIL_STORAGE_KEY = 'expiry_tracker_user_email_v2';

export const ExpiryAppView: React.FC<ExpiryAppViewProps> = ({
  onBackToLanding,
  defaultCategory,
}) => {
  const [items, setItems] = useState<ExpiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EXPIRIES;
  });

  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>(() => {
    try {
      const saved = localStorage.getItem(DELETED_STORAGE_KEY);
      if (saved) {
        const parsed: DeletedItem[] = JSON.parse(saved);
        const now = Date.now();
        // Filter out items older than 5 hours (5 * 3600 * 1000 ms)
        return parsed.filter((d) => now - d.deletedAt < 5 * 3600 * 1000);
      }
    } catch {}
    return [];
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem(EMAIL_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);
  const [emailSavedSuccess, setEmailSavedSuccess] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  // Trash Bin Drawer
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  // Recent deletion toast state for immediate undo
  const [lastDeleted, setLastDeleted] = useState<{ item: ExpiryItem; timerId: any } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || 'All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approaching' | 'safe' | 'expired'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpiryItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(deletedItems));
    } catch {}
  }, [deletedItems]);

  // Periodic cleanup of deleted items older than 5 hours
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setDeletedItems((prev) => prev.filter((d) => now - d.deletedAt < 5 * 3600 * 1000));
    }, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSaveItem = (itemData: Omit<ExpiryItem, 'id' | 'createdAt'> & { id?: string }) => {
    if (itemData.id) {
      setItems((prev) =>
        prev.map((item) => (item.id === itemData.id ? { ...item, ...itemData } : item))
      );
    } else {
      const newItem: ExpiryItem = {
        ...itemData,
        id: `exp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    // Remove from active items
    setItems((prev) => prev.filter((i) => i.id !== id));

    // Add to deleted bin with timestamp
    const newDeletedRecord: DeletedItem = {
      item: target,
      deletedAt: Date.now(),
    };
    setDeletedItems((prev) => [newDeletedRecord, ...prev]);

    // Show temporary toast with Undo button
    if (lastDeleted?.timerId) clearTimeout(lastDeleted.timerId);
    const toastTimer = setTimeout(() => {
      setLastDeleted(null);
    }, 8000);
    setLastDeleted({ item: target, timerId: toastTimer });
  };

  const handleReverseDelete = (itemToRestore: ExpiryItem) => {
    // Remove from deleted items
    setDeletedItems((prev) => prev.filter((d) => d.item.id !== itemToRestore.id));
    // Add back to active items
    setItems((prev) => [itemToRestore, ...prev]);
    if (lastDeleted?.item.id === itemToRestore.id) {
      if (lastDeleted.timerId) clearTimeout(lastDeleted.timerId);
      setLastDeleted(null);
    }
  };

  const handleRenew = (id: string, monthsToAdd: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const [y, m, d] = item.expiryDate.split('-').map(Number);
          const current = new Date(y, m - 1, d);
          current.setMonth(current.getMonth() + monthsToAdd);
          const newY = current.getFullYear();
          const newM = String(current.getMonth() + 1).padStart(2, '0');
          const newD = String(current.getDate()).padStart(2, '0');
          return {
            ...item,
            expiryDate: `${newY}-${newM}-${newD}`,
          };
        }
        return item;
      })
    );
  };

  const handleResetToSample = () => {
    setItems(INITIAL_EXPIRIES);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `expiry-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setUserEmail(emailInput.trim());
    try {
      localStorage.setItem(EMAIL_STORAGE_KEY, emailInput.trim());
    } catch {}
    setEmailSavedSuccess(true);
    setTimeout(() => {
      setEmailSavedSuccess(false);
      setIsEmailModalOpen(false);
    }, 1200);
  };

  const handleSendTestEmail = () => {
    setTestEmailSent(true);
    setTimeout(() => setTestEmailSent(false), 3000);
  };

  // Enriched items
  const enrichedItems = items.map((item) => ({
    ...item,
    daysLeft: calculateDaysLeft(item.expiryDate),
    status: getExpiryStatus(calculateDaysLeft(item.expiryDate)),
  }));

  // Automated notification items (within 30 days)
  const expiringWithin30Days = enrichedItems.filter((i) => i.daysLeft <= 30 && i.daysLeft >= 0);
  const expiredItemsList = enrichedItems.filter((i) => i.daysLeft < 0);

  const filteredItems = enrichedItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.identifier && item.identifier.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    if (statusFilter === 'approaching' && (item.daysLeft > 30 || item.daysLeft < 0)) return false;
    if (statusFilter === 'safe' && (item.daysLeft <= 30 || item.daysLeft < 0)) return false;
    if (statusFilter === 'expired' && item.daysLeft >= 0) return false;

    return true;
  });

  filteredItems.sort((a, b) => a.daysLeft - b.daysLeft);

  const totalCount = enrichedItems.length;
  const safeCount = enrichedItems.filter((i) => i.daysLeft > 30).length;
  const approachingCount = expiringWithin30Days.length;
  const expiredCount = expiredItemsList.length;

  return (
    <div className="min-h-screen bg-[#F7F8F8] text-[#111111] pb-24 relative">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-2 sm:px-8 py-2.5 sm:py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden min-[400px]:inline">Back</span>
              <span className="min-[400px]:hidden">Home</span>
            </button>

            <div className="h-4 sm:h-5 w-px bg-neutral-200" />

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#111111] flex items-center justify-center shrink-0">
                <ExpiryLogo size={16} variant="white" />
              </div>
              <span className="font-extrabold text-sm sm:text-lg tracking-tight whitespace-nowrap">Expiry App</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Email Notification Settings Button */}
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Configure Email Reminders (7d, 4d, 1d, 5h)"
            >
              <Mail className="w-3.5 h-3.5 text-[#1688D4] shrink-0" />
              <span className="hidden md:inline">
                {userEmail ? 'Alerts Enabled' : 'Setup Alerts'}
              </span>
            </button>

            {/* Trash Bin / Recently Deleted Toggle */}
            {deletedItems.length > 0 && (
              <button
                onClick={() => setIsTrashOpen(true)}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Trash ({deletedItems.length})</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#1688D4] hover:bg-[#1277bd] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98 shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>Add Expiry</span>
            </button>
          </div>
        </div>
      </header>

      {/* Automated Notification Banner: Warning when items are within 30 days */}
      {expiringWithin30Days.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse text-yellow-200" />
              <span>
                <strong>{expiringWithin30Days.length} item{expiringWithin30Days.length > 1 ? 's' : ''}</strong> {expiringWithin30Days.length === 1 ? 'is' : 'are'} within 30 days of expiry. Automated email reminders (7d, 4d, 1d, 5h) are active {userEmail ? `for ${userEmail}` : ''}.
              </span>
            </div>

            <button
              onClick={() => setStatusFilter('approaching')}
              className="px-3 py-1 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              View Approaching ({expiringWithin30Days.length})
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-8 pt-6 sm:pt-8">
        
        {/* Header & Stats */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Your Tracked Expiries
            </h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
              Automated notifications enabled · 5-hour undo protection active.
            </p>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Total Tracked</span>
            <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tabular text-neutral-900">{totalCount}</div>
            <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">Active items</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Approaching (&le;30d)</span>
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tabular text-amber-600">{approachingCount}</div>
            <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">Requires attention</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Safe Status</span>
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tabular text-emerald-600">{safeCount}</div>
            <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">&gt; 30 days left</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Expired</span>
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-500" />
            </div>
            <div className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold font-mono-tabular text-red-600">{expiredCount}</div>
            <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">Past deadline</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 shadow-xs mb-6 space-y-3.5 sm:space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expiries..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 outline-none transition-all"
              />
            </div>

            {/* Status Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('approaching')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'approaching'
                    ? 'bg-amber-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Approaching ({approachingCount})
              </button>
              <button
                onClick={() => setStatusFilter('safe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'safe'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Safe ({safeCount})
              </button>
              {expiredCount > 0 && (
                <button
                  onClick={() => setStatusFilter('expired')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'expired'
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Expired ({expiredCount})
                </button>
              )}
            </div>
          </div>

          {/* Categories Horizontal Scroll Strip */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-2 border-t border-neutral-100 pb-1 scrollbar-none">
            <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-[#1688D4] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-[#1688D4] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Expiry Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-12 sm:py-16 text-center bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-neutral-900">No expiries found</h3>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first document, subscription, or warranty.'}
            </p>
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#1688D4] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                + Add your first expiry
              </button>
              <button
                onClick={handleResetToSample}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-neutral-200 text-neutral-600 font-semibold text-xs hover:bg-neutral-50 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load sample data</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filteredItems.map((item) => {
              const isUrgent = item.status === 'critical' || item.status === 'expired';

              return (
                <div
                  key={item.id}
                  className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-4 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group relative"
                >
                  <div>
                    {/* Top Row: Category + Days left badge */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">
                        {item.category}
                      </span>

                      {/* Status indicator pill */}
                      <span
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
                        {isUrgent && <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        <span>{formatDaysLeftLabel(item.daysLeft)}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 tracking-tight leading-snug">
                      {item.title}
                    </h3>

                    {/* Identifier */}
                    {item.identifier && (
                      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs font-semibold text-neutral-500 font-mono-tabular">
                        {item.identifier}
                      </p>
                    )}

                    {/* Expiry Date */}
                    <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs text-neutral-600">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Expires: <strong className="text-neutral-900 font-mono-tabular">{item.expiryDate}</strong></span>
                    </div>

                    {/* Notes if available */}
                    {item.notes && (
                      <p className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-neutral-500 bg-neutral-50 p-2 sm:p-2.5 rounded-xl border border-neutral-100 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                    {/* Fast Renew button */}
                    <button
                      onClick={() => handleRenew(item.id, item.category === 'Subscriptions' ? 1 : 12)}
                      title={item.category === 'Subscriptions' ? 'Renew +1 month' : 'Renew +1 year'}
                      className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#C8FF35] hover:text-black text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{item.category === 'Subscriptions' ? '+1 Month' : '+1 Year'}</span>
                    </button>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        title="Edit expiry"
                        className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        title="Delete expiry (can be reversed within 5 hours)"
                        className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Immediate Toast Notification for Deletion with Reverse Button */}
      {lastDeleted && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#111111] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-neutral-800 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 text-amber-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Deleted "{lastDeleted.item.title}"</div>
              <div className="text-[11px] text-neutral-400">Reversible for 5 hours in Trash</div>
            </div>
          </div>

          <button
            onClick={() => handleReverseDelete(lastDeleted.item)}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#C8FF35] text-neutral-900 font-extrabold text-xs shrink-0 hover:bg-[#b8f020] transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Reverse</span>
          </button>
        </div>
      )}

      {/* Email Notification Settings Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1688D4] text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-neutral-900">Email Notification Hub</h3>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmail} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Your Notification Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. you@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-sm font-medium text-neutral-900 outline-none transition-all"
                />
              </div>

              {/* Explanation of schedules */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#1688D4]" />
                  <span>Automated Alert Schedule</span>
                </div>
                <p className="leading-relaxed text-blue-800">
                  When enabled, automated reminders will be dispatched to your email at <strong className="text-neutral-900">7 days, 4 days, 1 day, and 5 hours</strong> before each tracked subscription or document expires.
                </p>
              </div>

              {emailSavedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Email preferences saved successfully!
                </div>
              )}

              {/* Test Alert simulation */}
              <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2.5">
                {userEmail && (
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#1688D4]" />
                    <span>Send Test Reminder Alert Now</span>
                  </button>
                )}
                {testEmailSent && (
                  <div className="text-center text-xs font-bold text-emerald-600 animate-in fade-in">
                    ✓ Test alert successfully dispatched to {userEmail}!
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1688D4] hover:bg-[#1277bd] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Email Alerts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trash Bin / Recently Deleted Drawer */}
      {isTrashOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900">Recently Deleted Bin</h3>
                  <p className="text-[11px] text-neutral-500">Items automatically purge 5 hours after deletion.</p>
                </div>
              </div>
              <button
                onClick={() => setIsTrashOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
              {deletedItems.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 text-sm">
                  Trash bin is currently empty.
                </div>
              ) : (
                deletedItems.map((d) => {
                  const elapsedMs = Date.now() - d.deletedAt;
                  const remainingMs = Math.max(0, 5 * 3600 * 1000 - elapsedMs);
                  const remainingHrs = Math.floor(remainingMs / (3600 * 1000));
                  const remainingMins = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000));

                  return (
                    <div
                      key={d.item.id}
                      className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-neutral-900 text-sm truncate">{d.item.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5 font-mono-tabular">
                          <span>{d.item.category}</span>
                          <span>·</span>
                          <span className="text-amber-700 font-semibold">
                            {remainingHrs}h {remainingMins}m left to reverse
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReverseDelete(d.item)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8FF35] hover:bg-[#b8f020] text-neutral-900 font-extrabold text-xs shadow-xs shrink-0 cursor-pointer"
                      >
                        <Undo2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Reverse</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end shrink-0">
              <button
                onClick={() => setIsTrashOpen(false)}
                className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Bin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddExpiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialItem={editingItem}
        defaultCategory={selectedCategory !== 'All' ? (selectedCategory as CategoryType) : 'Documents'}
      />
    </div>
  );
};
