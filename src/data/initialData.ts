import { ExpiryItem } from '../types/expiry';

function getDateOffset(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_EXPIRIES: ExpiryItem[] = [
  {
    id: 'exp-1',
    title: 'Netflix Subscription',
    category: 'Subscriptions',
    expiryDate: getDateOffset(3),
    reminderDaysBefore: 5,
    identifier: 'Family Ultra HD 4K',
    notes: 'Auto-renews on payment card ending in 4192',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    title: 'Domain Renewal',
    category: 'Domains',
    expiryDate: getDateOffset(21),
    reminderDaysBefore: 30,
    identifier: 'mystartup.dev',
    notes: 'Cloudflare Registrar, annual lock',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-3',
    title: 'Car Insurance',
    category: 'Insurance',
    expiryDate: getDateOffset(77),
    reminderDaysBefore: 30,
    identifier: 'Policy #GEICO-88219',
    notes: 'Comprehensive & Collision coverage',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-4',
    title: 'Passport',
    category: 'Documents',
    expiryDate: getDateOffset(152),
    reminderDaysBefore: 180,
    identifier: 'Doc #P8942109',
    notes: 'Renew before international travel (requires 6-month validity)',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-5',
    title: "Driver's Licence",
    category: 'Licences',
    expiryDate: getDateOffset(320),
    reminderDaysBefore: 60,
    identifier: 'Class D / RealID',
    notes: 'DMV appointment required for renewal',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-6',
    title: 'AWS Certified Architect',
    category: 'Certificates',
    expiryDate: getDateOffset(64),
    reminderDaysBefore: 30,
    identifier: 'Cert ID #AWS-8921-99',
    notes: 'Recertification exam discount voucher available',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-7',
    title: 'AppleCare+ Warranty',
    category: 'Warranties',
    expiryDate: getDateOffset(194),
    reminderDaysBefore: 14,
    identifier: 'MacBook Pro M3 Max',
    notes: 'Hardware protection and battery replacement coverage',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-8',
    title: 'Bouldering Gym Membership',
    category: 'Memberships',
    expiryDate: getDateOffset(12),
    reminderDaysBefore: 7,
    identifier: 'Member #BK-0492',
    notes: 'Pause or renew before month cycle',
    createdAt: new Date().toISOString(),
  },
];
