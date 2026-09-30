import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, Bell, FileText, Hash, Check } from 'lucide-react';
import { ExpiryItem, CategoryType } from '../types/expiry';
import { CATEGORIES_LIST } from '../data/categories';

interface AddExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ExpiryItem, 'id' | 'createdAt'> & { id?: string }) => void;
  initialItem?: ExpiryItem | null;
  defaultCategory?: CategoryType;
}

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
  const [reminderDaysBefore, setReminderDaysBefore] = useState(30);
  const [identifier, setIdentifier] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title);
      setCategory(initialItem.category);
      setExpiryDate(initialItem.expiryDate);
      setReminderDaysBefore(initialItem.reminderDaysBefore);
      setIdentifier(initialItem.identifier || '');
      setNotes(initialItem.notes || '');
    } else {
      setTitle('');
      setCategory(defaultCategory);
      // Default to 6 months from now
      const defaultD = new Date();
      defaultD.setMonth(defaultD.getMonth() + 6);
      const y = defaultD.getFullYear();
      const m = String(defaultD.getMonth() + 1).padStart(2, '0');
      const d = String(defaultD.getDate()).padStart(2, '0');
      setExpiryDate(`${y}-${m}-${d}`);
      setReminderDaysBefore(30);
      setIdentifier('');
      setNotes('');
    }
    setError('');
  }, [initialItem, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title for this item.');
      return;
    }
    if (!expiryDate) {
      setError('Please select an expiry date.');
      return;
    }

    onSave({
      id: initialItem?.id,
      title: title.trim(),
      category,
      expiryDate,
      reminderDaysBefore,
      identifier: identifier.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1688D4] text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-neutral-900">
              {initialItem ? 'Edit Expiry' : 'Add New Expiry'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Passport, Netflix, Car Insurance"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-sm font-medium text-neutral-900 outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Category & Expiry Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-sm font-medium text-neutral-900 outline-none bg-white transition-all cursor-pointer"
              >
                {CATEGORIES_LIST.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Expiry Date *
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-sm font-medium text-neutral-900 outline-none bg-white transition-all"
              />
            </div>
          </div>

          {/* Reminder Window */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Reminder Lead Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 14, 30, 60].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setReminderDaysBefore(days)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    reminderDaysBefore === days
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          {/* Identifier / Ref Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Reference / Serial / Account (Optional)
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. Policy #9921, Doc ID, domain.com"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-sm font-medium text-neutral-900 outline-none transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Add renewal link, location of paper copy, or instructions..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:border-[#1688D4] focus:ring-2 focus:ring-[#1688D4]/20 text-sm font-medium text-neutral-900 outline-none transition-all resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-neutral-600 hover:bg-neutral-100 font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1688D4] hover:bg-[#1374b6] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
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
