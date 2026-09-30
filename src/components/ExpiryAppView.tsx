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
  ExternalLink,
  Mail,
  Undo2,
  ShieldAlert,
  Send,
  Check,
  X,
  History,
  Globe,
  Bell,
  Image as ImageIcon
} from 'lucide-react';
import { ExpiryLogo } from './ExpiryLogo';
import {
  ExpiryItem,
  DeletedItem,
  CategoryType,
  DynamicExpiryStatus,
  calculateDaysLeft,
  getDynamicExpiryStatus,
  getStatusBadgeColor,
  formatDaysLeftLabel,
} from '../types/expiry';
import { CATEGORIES_LIST } from '../data/categories';
import { AddExpiryModal } from './AddExpiryModal';

interface ExpiryAppViewProps {
  onBackToLanding: () => void;
  defaultCategory?: CategoryType;
}

export const ExpiryAppView: React.FC<ExpiryAppViewProps> = ({
  onBackToLanding,
  defaultCategory,
}) => {
  const [items, setItems] = useState<ExpiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>(() => {
    try {
      const saved = localStorage.getItem('expiry_deleted_bin_v3');
      if (saved) {
        const parsed: DeletedItem[] = JSON.parse(saved);
        const now = Date.now();
        return parsed.filter((d) => now - d.deletedAt < 5 * 3600 * 1000);
      }
    } catch {}
    return [];
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('expiry_user_email_v3') || '';
    } catch {
      return '';
    }
  });

  // Trash Bin Drawer
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  // Recent deletion toast state for immediate 5-hour reverse undo
  const [lastDeleted, setLastDeleted] = useState<{ item: ExpiryItem; timerId: any } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory || 'All');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpiryItem | null>(null);

  // Fetch items from backend database on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        console.error('Failed to load items from API');
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('expiry_deleted_bin_v3', JSON.stringify(deletedItems));
    } catch {}
  }, [deletedItems]);

  // Periodic cleanup of deleted items older than 5 hours
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setDeletedItems((prev) => prev.filter((d) => now - d.deletedAt < 5 * 3600 * 1000));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveItem = async (formData: FormData) => {
    try {
      const itemId = formData.get('id');
      const url = itemId ? `/api/items/${itemId}` : '/api/items';
      const method = itemId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        await fetchItems();
        setEditingItem(null);
      } else {
        const text = await res.text();
        let errData;
        try {
          errData = JSON.parse(text);
        } catch {
          errData = { error: text || 'Failed to save expiry item' };
        }
        alert(errData.error || 'Failed to save expiry item');
      }
    } catch (err) {
      console.error('Save item error:', err);
      alert('Network error: Unable to connect to backend server. Please ensure the dev server is running.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        const newDeletedRecord: DeletedItem = {
          item: target,
          deletedAt: Date.now(),
        };
        setDeletedItems((prev) => [newDeletedRecord, ...prev]);

        if (lastDeleted?.timerId) clearTimeout(lastDeleted.timerId);
        const toastTimer = setTimeout(() => {
          setLastDeleted(null);
        }, 8000);
        setLastDeleted({ item: target, timerId: toastTimer });
      }
    } catch (err) {
      console.error('Delete item error:', err);
      alert('Network error while deleting item.');
    }
  };

  const handleReverseDelete = async (itemToRestore: ExpiryItem) => {
    const formData = new FormData();
    formData.append('title', itemToRestore.title);
    formData.append('category', itemToRestore.category);
    formData.append('expiryDate', itemToRestore.expiryDate);
    formData.append('expiryTime', itemToRestore.expiryTime || '23:59');
    formData.append('timezone', itemToRestore.timezone || 'UTC');
    if (itemToRestore.url) formData.append('url', itemToRestore.url);
    if (itemToRestore.email) formData.append('email', itemToRestore.email);
    if (itemToRestore.imageUrl) formData.append('imageUrl', itemToRestore.imageUrl);
    formData.append('reminderSettings', JSON.stringify(itemToRestore.reminderSettings));
    if (itemToRestore.notes) formData.append('notes', itemToRestore.notes);

    try {
      const res = await fetch('/api/items', { method: 'POST', body: formData });
      if (res.ok) {
        await fetchItems();
        setDeletedItems((prev) => prev.filter((d) => d.item.id !== itemToRestore.id));
        if (lastDeleted?.item.id === itemToRestore.id) {
          if (lastDeleted.timerId) clearTimeout(lastDeleted.timerId);
          setLastDeleted(null);
        }
      }
    } catch (err) {
      console.error('Reverse delete error:', err);
    }
  };

  const handleRequestVerification = async (id: string) => {
    try {
      const res = await fetch(`/api/request-verification/${id}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Verification email sent successfully! Check your inbox.');
      } else {
        alert(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      alert('Error requesting verification email');
    }
  };

  // Enriched items with dynamic calculation
  const enrichedItems = items.map((item) => {
    const daysLeft = calculateDaysLeft(item.expiryDate, item.expiryTime, item.timezone);
    const status = getDynamicExpiryStatus(daysLeft);
    return {
      ...item,
      daysLeft,
      status,
    };
  });

  const expiringWithin30Days = enrichedItems.filter((i) => i.daysLeft <= 30 && i.daysLeft >= 0);
  const expiredItemsList = enrichedItems.filter((i) => i.daysLeft < 0);

  const filteredItems = enrichedItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    return true;
  });

  filteredItems.sort((a, b) => a.daysLeft - b.daysLeft);

  const totalCount = enrichedItems.length;
  const safeCount = enrichedItems.filter((i) => i.status === 'Upcoming').length;
  const approachingCount = enrichedItems.filter((i) => i.status === 'Approaching' || i.status === 'Critical' || i.status === 'Expires Today').length;
  const expiredCount = expiredItemsList.length;

  return (
    <div className="min-h-screen bg-[#F7F8F8] text-[#111111] pb-24 relative overflow-x-hidden">
      
      {/* Top Bar - Fully Responsive for Mobile */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-2 sm:px-8 py-2 sm:py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden min-[360px]:inline">Back</span>
            </button>

            <div className="h-4 w-px bg-neutral-200 hidden min-[360px]:block" />

            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#111111] flex items-center justify-center shrink-0">
                <ExpiryLogo size={14} variant="white" />
              </div>
              <span className="font-extrabold text-xs sm:text-lg tracking-tight truncate">
                <span className="hidden sm:inline">Expiry App</span>
                <span className="sm:hidden">Expiry</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Trash Bin / Recently Deleted Toggle */}
            {deletedItems.length > 0 && (
              <button
                onClick={() => setIsTrashOpen(true)}
                className="flex items-center gap-1 px-2 py-1.5 sm:py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                <History className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="hidden min-[420px]:inline">Trash</span>
                <span>({deletedItems.length})</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#1688D4] hover:bg-[#1277bd] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98 shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden min-[380px]:inline">Add Expiry</span>
              <span className="min-[380px]:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Automated Warning Banner */}
      {expiringWithin30Days.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 sm:px-4 py-2.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-medium min-w-0">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-100 animate-pulse" />
              <span className="truncate">
                <strong>{expiringWithin30Days.length}</strong> item{expiringWithin30Days.length === 1 ? '' : 's'} expiring within 30 days.
              </span>
            </div>
            <button
              onClick={() => setStatusFilter('Approaching')}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-8">
          <div
            onClick={() => setStatusFilter('all')}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === 'all' ? 'border-[#1688D4] ring-2 ring-[#1688D4]/20' : 'border-neutral-200'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Total Tracked</div>
            <div className="text-xl sm:text-3xl font-extrabold text-neutral-900 font-mono-tabular">{totalCount}</div>
          </div>

          <div
            onClick={() => setStatusFilter('Upcoming')}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === 'Upcoming' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-neutral-200'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Safe / Upcoming</div>
            <div className="text-xl sm:text-3xl font-extrabold text-emerald-700 font-mono-tabular">{safeCount}</div>
          </div>

          <div
            onClick={() => setStatusFilter('Approaching')}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === 'Approaching' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Approaching</div>
            <div className="text-xl sm:text-3xl font-extrabold text-amber-700 font-mono-tabular">{approachingCount}</div>
          </div>

          <div
            onClick={() => setStatusFilter('Expired')}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
              statusFilter === 'Expired' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-neutral-200'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Expired</div>
            <div className="text-xl sm:text-3xl font-extrabold text-red-700 font-mono-tabular">{expiredCount}</div>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, notes, or URL..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-sm font-medium text-neutral-900 outline-none transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-[#1688D4] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Expiry Items Grid */}
        {loading ? (
          <div className="text-center py-20 text-neutral-400 font-medium">Loading your items from database...</div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#1688D4]/10 text-[#1688D4] flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">No expiry items found</h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 mb-6">
              {searchQuery || selectedCategory !== 'All' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Start tracking your important documents, subscriptions, and dates.'}
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 rounded-full bg-[#1688D4] hover:bg-[#1277bd] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Add First Expiry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item) => {
              const badgeColors = getStatusBadgeColor(item.status);
              const daysLabel = formatDaysLeftLabel(item.daysLeft);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Image / Thumbnail (if provided) */}
                    {item.imageUrl && (
                      <div className="w-full h-36 bg-neutral-100 overflow-hidden relative border-b border-neutral-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border shadow-xs backdrop-blur-md"
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: badgeColors.accent, borderColor: badgeColors.border }}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 sm:p-6">
                      {/* Header Row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
                          {item.category}
                        </span>
                        {!item.imageUrl && (
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border"
                            style={{ backgroundColor: badgeColors.bg, color: badgeColors.accent, borderColor: badgeColors.border }}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 group-hover:text-[#1688D4] transition-colors line-clamp-1">
                        {item.title}
                      </h3>

                      {/* Expiry Date & Time */}
                      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-neutral-600">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">Expires: {item.expiryDate} at {item.expiryTime || '23:59'}</span>
                      </div>

                      {/* Notes / Description */}
                      {item.notes && (
                        <p className="mt-2.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {item.notes}
                        </p>
                      )}

                      {/* Email Status & Verification badge */}
                      {item.email && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-1.5 text-neutral-600 truncate min-w-0">
                            <Mail className="w-3.5 h-3.5 text-[#1688D4] shrink-0" />
                            <span className="truncate">{item.email}</span>
                          </div>
                          {item.emailVerified ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">Verified</span>
                          ) : (
                            <button
                              onClick={() => handleRequestVerification(item.id)}
                              className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 cursor-pointer shrink-0"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 sm:px-6 py-3.5 bg-neutral-50/75 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold font-mono-tabular" style={{ color: badgeColors.accent }}>
                        {daysLabel}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-medium">
                        {item.reminderSettings.length} reminder{item.reminderSettings.length === 1 ? '' : 's'} set
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Open Link action button */}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#1688D4]/10 hover:bg-[#1688D4]/20 text-[#1688D4] transition-colors"
                          title="Open associated link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl hover:bg-neutral-200/60 text-neutral-600 transition-colors cursor-pointer"
                        title="Edit expiry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete expiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Expiry Modal */}
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

      {/* Trash Bin Drawer for 5-Hour Reverse Delete */}
      {isTrashOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-lg text-neutral-900">Recently Deleted (Trash)</h3>
              </div>
              <button
                onClick={() => setIsTrashOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50/60 border-b border-amber-100 text-xs text-amber-800 font-medium">
              Items can be reversed (restored) within 5 hours of deletion. After 5 hours, they are automatically purged.
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {deletedItems.length === 0 ? (
                <div className="text-center py-16 text-neutral-400 text-sm">Trash is empty</div>
              ) : (
                deletedItems.map((rec) => {
                  const hoursLeft = Math.max(0, 5 - (Date.now() - rec.deletedAt) / (1000 * 3600)).toFixed(1);
                  return (
                    <div key={rec.item.id} className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between gap-3 shadow-xs">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">{rec.item.title}</h4>
                        <div className="text-xs text-neutral-500 mt-0.5">{rec.item.category} • Expires {rec.item.expiryDate}</div>
                        <div className="text-[11px] font-mono font-bold text-amber-600 mt-1">~{hoursLeft} hours left to reverse</div>
                      </div>
                      <button
                        onClick={() => handleReverseDelete(rec.item)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Reverse</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Immediate Deletion Toast Notification with Reverse Button */}
      {lastDeleted && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300 border border-neutral-800">
          <div>
            <div className="text-sm font-bold">Deleted "{lastDeleted.item.title}"</div>
            <div className="text-[11px] text-neutral-400">Can be reversed within 5 hours</div>
          </div>
          <button
            onClick={() => handleReverseDelete(lastDeleted.item)}
            className="px-4 py-2 rounded-xl bg-[#C8FF35] hover:bg-[#b8f020] text-[#111111] font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Reverse</span>
          </button>
        </div>
      )}

    </div>
  );
};
