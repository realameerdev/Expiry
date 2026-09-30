export type CategoryType =
  | 'Documents'
  | 'Subscriptions'
  | 'Insurance'
  | 'Warranties'
  | 'Certificates'
  | 'Domains'
  | 'Licences'
  | 'Memberships';

export type DynamicExpiryStatus = 'Upcoming' | 'Approaching' | 'Critical' | 'Expires Today' | 'Expired';

export interface ExpiryItem {
  id: string;
  title: string;
  category: CategoryType;
  expiryDate: string; // YYYY-MM-DD
  expiryTime: string; // HH:MM
  timezone: string;
  url?: string;
  imageUrl?: string;
  email?: string;
  emailVerified?: boolean;
  verificationToken?: string;
  reminderSettings: number[]; // e.g. [30, 14, 7, 3, 1, 0]
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeletedItem {
  item: ExpiryItem;
  deletedAt: number; // timestamp in ms
}

export function calculateDaysLeft(expiryDateStr: string, expiryTimeStr?: string, timezone?: string): number {
  try {
    const [year, month, day] = expiryDateStr.split('-').map(Number);
    const [hour, minute] = (expiryTimeStr || '23:59').split(':').map(Number);
    
    const targetDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const now = new Date();

    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 30;
  }
}

export function getDynamicExpiryStatus(daysLeft: number): DynamicExpiryStatus {
  if (daysLeft < 0) return 'Expired';
  if (daysLeft === 0) return 'Expires Today';
  if (daysLeft <= 7) return 'Critical';
  if (daysLeft <= 30) return 'Approaching';
  return 'Upcoming';
}

export function getStatusBadgeColor(status: DynamicExpiryStatus): { bg: string; text: string; border: string; accent: string } {
  switch (status) {
    case 'Expired':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: '#EF4444' };
    case 'Expires Today':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', accent: '#F43F5E' };
    case 'Critical':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', accent: '#F59E0B' };
    case 'Approaching':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: '#2499E8' };
    case 'Upcoming':
    default:
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: '#10B981' };
  }
}

export function formatDaysLeftLabel(daysLeft: number): string {
  if (daysLeft < 0) {
    const overdue = Math.abs(daysLeft);
    return `Expired ${overdue} ${overdue === 1 ? 'day' : 'days'} ago`;
  }
  if (daysLeft === 0) {
    return 'Expires today';
  }
  if (daysLeft === 1) {
    return '1 day left';
  }
  return `${daysLeft} days left`;
}
