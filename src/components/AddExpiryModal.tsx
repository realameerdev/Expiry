import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, Bell, FileText, Link as LinkIcon, Image as ImageIcon, Mail, Check, Globe } from 'lucide-react';
import { ExpiryItem, CategoryType } from '../types/expiry';
import { CATEGORIES_LIST } from '../data/categories';

interface AddExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  initialItem?: ExpiryItem | null;
  defaultCategory?: CategoryType;
}

const REMINDER_OPTIONS = [
  { days: 30, label: '30 days before' },
  { days: 14, label: '14 days before' },
  { days: 7, label: '7 days before' },
  { days: 3, label: '3 days before' },
  { days: 1, label: '1 day before' },
  { days: 0, label: 'On expiry day' },
];

export const AddExpiryModal: React.FC<AddExpiryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultCategory = 'Documents',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('23:59');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string>('');
  const [reminderSettings, setReminderSettings] = useState<number[]>([30, 7, 1, 0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title);
      setCategory(initialItem.category);
      setExpiryDate(initialItem.expiryDate);
      setExpiryTime(initialItem.expiryTime || '23:59');
      setTimezone(initialItem.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
      setUrl(initialItem.url || '');
      setEmail(initialItem.email || '');
      setImageUrlPreview(initialItem.imageUrl || '');
      setImageFile(null);
      setReminderSettings(initialItem.reminderSettings || [30, 7, 1, 0]);
      setNotes(initialItem.notes || '');
    } else {
      setTitle('');
      setCategory(defaultCategory);
      const defaultD = new Date();
      defaultD.setMonth(defaultD.getMonth() + 3);
      const y = defaultD.getFullYear();
      const m = String(defaultD.getMonth() + 1).padStart(2, '0');
      const d = String(defaultD.getDate()).padStart(2, '0');
      setExpiryDate(`${y}-${m}-${d}`);
      setExpiryTime('23:59');
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
      setUrl('');
      setEmail('');
      setImageUrlPreview('');
      setImageFile(null);
      setReminderSettings([30, 7, 1, 0]);
      setNotes('');
    }
    setError('');
  }, [initialItem, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (days: number) => {
    if (reminderSettings.includes(days)) {
      setReminderSettings(reminderSettings.filter((d) => d !== days));
    } else {
      setReminderSettings([...reminderSettings, days].sort((a, b) => b - a));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrlPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title for this expiry item.');
      return;
    }
    if (!expiryDate) {
      setError('Please select an expiry date.');
      return;
    }
    if (!email.trim()) {
      setError('Notification email is compulsory for reminders.');
      return;
    }
    if (reminderSettings.length === 0) {
      setError('Please select at least one reminder time.');
      return;
    }

    const formData = new FormData();
    if (initialItem?.id) formData.append('id', initialItem.id);
    formData.append('title', title.trim());
    formData.append('category', category);
    formData.append('expiryDate', expiryDate);
    formData.append('expiryTime', expiryTime);
    formData.append('timezone', timezone);
    if (url.trim()) formData.append('url', url.trim());
    formData.append('email', email.trim());
    formData.append('reminderSettings', JSON.stringify(reminderSettings));
    if (notes.trim()) formData.append('notes', notes.trim());
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageUrlPreview && !imageUrlPreview.startsWith('blob:')) {
      formData.append('imageUrl', imageUrlPreview);
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1688D4] text-white flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-lg text-neutral-900 truncate">
              {initialItem ? 'Edit Expiry Item' : 'Add New Expiry Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Item Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Passport, Domain SSL, Netflix"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none transition-all"
              required
              autoFocus
            />
          </div>

          {/* Category & Expiry Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none bg-white transition-all cursor-pointer"
              >
                {CATEGORIES_LIST.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Expiry Time & Timezone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Expiry Time
              </label>
              <input
                type="time"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. UTC, America/New_York"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none bg-white transition-all"
              />
            </div>
          </div>

          {/* Compulsory Email for Notifications */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#1688D4]" />
              <span>Notification Email Address *</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="you@domain.com (required for reminders)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none transition-all"
              required
            />
          </div>

          {/* Optional URL */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#1688D4]" />
              <span>Associated Link / URL (Optional)</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://renew.service.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none transition-all"
            />
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#1688D4]" />
              <span>Cover Image / Thumbnail (Optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {imageUrlPreview && (
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                  <img src={imageUrlPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1688D4]/10 file:text-[#1688D4] hover:file:bg-[#1688D4]/20 file:cursor-pointer cursor-pointer truncate"
              />
            </div>
          </div>

          {/* Multiple Reminder Times Selection */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#1688D4]" />
              <span>Email Reminder Schedule</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REMINDER_OPTIONS.map((opt) => {
                const isSelected = reminderSettings.includes(opt.days);
                return (
                  <button
                    type="button"
                    key={opt.days}
                    onClick={() => handleCheckboxChange(opt.days)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#1688D4]/10 border-[#1688D4] text-[#1688D4]'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border shrink-0 ${isSelected ? 'bg-[#1688D4] border-[#1688D4] text-white' : 'border-neutral-300'}`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Notes / Description (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Account details, renewal instructions..."
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-xs sm:text-sm font-medium text-neutral-900 outline-none transition-all resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 rounded-full bg-[#1688D4] hover:bg-[#1277bd] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialItem ? 'Update Expiry' : 'Save Expiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
