export type CategoryType =
  | 'Documents'
  | 'Subscriptions'
  | 'Insurance'
  | 'Warranties'
  | 'Certificates'
  | 'Domains'
  | 'Licences'
  | 'Memberships';

export interface ExpiryItem {
  id: string;
  title: string;
  category: CategoryType;
  expiryDate: string; // YYYY-MM-DD
  reminderDaysBefore: number;
  identifier?: string;
  notes?: string;
  createdAt: string;
}

export interface DeletedItem {
  item: ExpiryItem;
  deletedAt: number; // timestamp in ms
}

export type ExpiryStatus = 'safe' | 'approaching' | 'critical' | 'expired';

export function calculateDaysLeft(expiryDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = expiryDateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(daysLeft: number): ExpiryStatus {
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 7) return 'critical';
  if (daysLeft <= 30) return 'approaching';
  return 'safe';
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
