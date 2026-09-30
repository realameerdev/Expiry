import { CategoryType } from '../types/expiry';

export interface CategoryInfo {
  name: CategoryType;
  description: string;
  example: string;
  iconName: string;
}

export const CATEGORIES_LIST: CategoryInfo[] = [
  {
    name: 'Documents',
    description: 'Passports, visas, lease contracts, and legal papers.',
    example: 'Passports, Visas, Leases',
    iconName: 'FileText',
  },
  {
    name: 'Subscriptions',
    description: 'Streaming services, cloud software, apps, and magazines.',
    example: 'Netflix, Spotify, SaaS',
    iconName: 'CreditCard',
  },
  {
    name: 'Insurance',
    description: 'Car, home, health, life, and travel insurance policies.',
    example: 'Auto, Health, Property',
    iconName: 'ShieldCheck',
  },
  {
    name: 'Warranties',
    description: 'Electronics, appliances, vehicles, and consumer gadgets.',
    example: 'AppleCare, Appliances, Tech',
    iconName: 'Wrench',
  },
  {
    name: 'Certificates',
    description: 'Professional credentials, safety clearances, and CPR.',
    example: 'AWS, CPR, Real Estate Licences',
    iconName: 'Award',
  },
  {
    name: 'Domains',
    description: 'Web domains, DNS registrations, and SSL certificates.',
    example: 'Web Domains, SSL / TLS',
    iconName: 'Globe',
  },
  {
    name: 'Licences',
    description: "Driver's licences, business permits, and trade certificates.",
    example: "Driver's Licence, Pilot, Trade",
    iconName: 'IdCard',
  },
  {
    name: 'Memberships',
    description: 'Gym clubs, professional associations, and rewards cards.',
    example: 'Fitness Clubs, Co-working, VIP',
    iconName: 'Users',
  },
];
