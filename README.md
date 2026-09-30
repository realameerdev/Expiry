Expiry

«Never miss an expiry.»

Expiry is a simple, modern expiry and reminder management platform designed to help people keep track of documents, subscriptions, warranties, certificates, insurance policies, licences, domains and other important dates.

Instead of relying on memory, scattered notes or calendar entries, Expiry gives users one clear place to see what is expiring, when it will expire and what needs attention.

---

Overview

Important things expire.

Passports expire.
Driver's licences expire.
Insurance policies expire.
Subscriptions renew.
Warranties end.
Certificates need renewal.
Domains expire.

Expiry was built around one simple idea:

Never miss an expiry.

The platform makes it easy to add an item, set its expiry date and keep track of it through clear status indicators and reminders.

Expiry is intentionally simple. Users should be able to open the application and immediately understand what needs their attention.

---

The Problem

People manage dozens of dates and deadlines every year.

The problem is not always knowing the date. The problem is remembering it at the right time.

Important expiry dates are often stored across:

- Notes applications
- Calendar apps
- Emails
- Documents
- Spreadsheets
- Physical paperwork
- Memory

This creates unnecessary risk.

Missing an expiry can result in:

- Expired identification
- Lost subscriptions
- Missed renewals
- Expired insurance
- Lost warranties
- Expired certificates
- Domain interruptions
- Unnecessary fees
- Last-minute stress

Expiry provides a dedicated place for these dates.

---

Core Solution

Expiry follows a simple workflow:

Add → Set expiry date → Track → Get reminded → Act

Users can create an expiry item with information such as:

- Name
- Category
- Expiry date
- Description
- Reminder period
- Notes
- Optional supporting information

The application then presents the information in a clear dashboard.

---

Core Features

1. Expiry Tracking

Create and manage expiry dates for virtually anything.

Examples:

- Passport
- National ID
- Driver's licence
- Visa
- Insurance
- Subscription
- Warranty
- Certificate
- Domain
- Membership
- Contract
- Vehicle documents
- Professional licence

---

2. Expiry Dashboard

The dashboard provides a quick overview of everything being tracked.

Users can immediately see:

- Upcoming expiries
- Approaching expiries
- Expired items
- Recently added items
- Categories
- Remaining time

The goal is to make the most important information visible without unnecessary navigation.

---

3. Status System

Expiry uses clear visual states to communicate urgency.

Upcoming

The item is still safely within its validity period.

Approaching

The expiry date is getting close and requires attention.

Expired

The expiry date has passed.

The interface uses:

- Green for safe/upcoming
- Amber for approaching
- Red for expired or critical

This allows users to understand their situation at a glance.

---

4. Smart Reminders

Users can configure reminders for important expiry dates.

For example:

- 30 days before
- 14 days before
- 7 days before
- 3 days before
- 1 day before

The reminder system is designed around prevention rather than reaction.

The objective is not simply to tell users something expired.

It is to give them enough time to act.

---

5. Categories

Expiry supports different categories for better organization.

Documents

- Passport
- ID cards
- Driver's licences
- Visas
- Travel documents

Subscriptions

- Streaming services
- Software
- Memberships
- Cloud services

Insurance

- Vehicle insurance
- Health insurance
- Property insurance
- Business insurance

Warranties

- Electronics
- Appliances
- Vehicles
- Equipment

Certificates

- Professional certificates
- Training certificates
- Compliance certificates

Digital

- Domains
- Hosting
- SSL certificates
- Software licences

Other

Anything else that has an important date.

---

6. Search and Filtering

Users should be able to quickly find what they are looking for.

Search by:

- Item name
- Category
- Status

Filter by:

- All
- Upcoming
- Approaching
- Expired

This becomes increasingly useful as the number of tracked items grows.

---

7. Item Details

Every expiry item has a dedicated detail view.

The detail page can display:

- Item name
- Category
- Expiry date
- Days remaining
- Current status
- Reminder settings
- Notes
- Creation date
- Last updated date

Users can edit or delete an item from its detail view.

---

8. Responsive Design

Expiry is designed for everyday use across devices.

The interface should work seamlessly on:

- Mobile phones
- Tablets
- Laptops
- Desktop computers

Mobile usability is especially important because users may add an expiry immediately after receiving a document, subscription or warranty.

---

Product Experience

Expiry follows a simple design philosophy:

Less complexity. More clarity.

The application should never feel like an enterprise management system.

The interface should feel:

- Clean
- Calm
- Reliable
- Practical
- Modern
- Lightweight

Every screen should answer one question:

What do I need to know or do next?

---

Landing Page

The public landing page introduces Expiry using a premium SaaS-style experience.

The landing page includes:

1. Navigation
2. Hero section
3. Category strip
4. Product value proposition
5. Dashboard preview
6. Features
7. How it works
8. Categories
9. Call to action
10. FAQ
11. Footer

Hero

Never miss an expiry.

Track your documents, subscriptions, warranties and important dates in one simple place.

Primary CTA:

Add your first expiry

Secondary CTA:

See how it works

---

Authentication Philosophy

Expiry does not require authentication in the initial version.

There is:

- No sign up
- No sign in
- No login screen
- No account creation

The first version prioritizes speed and simplicity.

Users should be able to open Expiry and start tracking their dates immediately.

For the initial implementation, expiry information can be persisted locally in the user's browser/device.

---

Future Authentication

Authentication can be introduced later when the product requires cloud-based functionality.

Potential reasons include:

- Cross-device synchronization
- Cloud backups
- Email reminders
- Push notifications
- Account recovery
- Shared expiry lists
- Family accounts
- Business accounts

Authentication should only be introduced when it provides meaningful value to the user.

---

Data Model

A typical expiry record can contain:

ExpiryItem
├── id
├── name
├── category
├── description
├── expiryDate
├── reminderSettings
├── status
├── notes
├── createdAt
└── updatedAt

Example:

{
  "name": "Passport",
  "category": "Documents",
  "expiryDate": "2027-06-15",
  "reminderSettings": [30, 14, 7],
  "notes": "International passport"
}

---

Reminder Logic

The application calculates the difference between the current date and the expiry date.

Conceptually:

Days Remaining = Expiry Date - Current Date

The result determines the item's state.

Example:

90+ days       → Upcoming
30–89 days     → Upcoming
8–29 days      → Approaching
1–7 days       → Critical
0 days         → Expires today
< 0 days       → Expired

The exact thresholds can be adjusted as the product evolves.

---

Design System

Expiry uses a bright, modern SaaS visual language.

Primary Colors

Purpose| Color
Primary Blue| "#1688D4"
Bright Blue| "#2499E8"
Accent Lime| "#C8FF35"
Black| "#111111"
White| "#FFFFFF"
Soft Background| "#F7F8F8"
Muted Text| "#6B7280"
Border| "#E5E7EB"
Warning| "#F59E0B"
Expired| "#EF4444"

Color Philosophy

Blue represents:

- Trust
- Technology
- Reliability
- Structure

Lime represents:

- Action
- Freshness
- Positive status
- Attention

Black provides:

- Contrast
- Strong typography
- Visual hierarchy

White provides:

- Space
- Simplicity
- Clarity

---

Typography

Manrope

Expiry uses Manrope as its primary typeface.

Recommended hierarchy:

Hero        → 800
Headings    → 700
Navigation  → 600
Buttons     → 600–700
Body        → 400–500
Labels      → 500–600

Typography should feel:

- Modern
- Clean
- Geometric
- Friendly
- Highly readable

Avoid overly futuristic or decorative fonts.

---

UI Principles

1. Clarity over decoration

Visual elements should help users understand their expiry information.

2. Strong hierarchy

Important dates and statuses should always be visually prominent.

3. Minimal friction

Adding an expiry should take as few steps as possible.

4. Consistent status colors

Green, amber and red should always communicate predictable states.

5. Responsive by default

Mobile should not feel like a reduced desktop version.

6. Accessible

Maintain readable contrast, clear labels, keyboard accessibility and meaningful status indicators.

---

Technology Architecture

The exact technology stack can evolve, but the application should be structured around:

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Modern component architecture

Storage

Initial:

- Browser local storage / IndexedDB

Future:

- Cloud database
- Authenticated user storage
- Cross-device synchronization

Notifications

Future notification infrastructure can support:

- Browser notifications
- Push notifications
- Email
- SMS
- Mobile notifications

---

Privacy

Expiry should follow a privacy-first approach.

The initial version does not require an account or personal profile.

Sensitive information should not be unnecessarily collected.

If users store sensitive document information, the application should clearly communicate how that information is stored.

Future cloud infrastructure should implement:

- Secure storage
- Encryption where appropriate
- Access controls
- Secure authentication
- Data deletion
- Privacy controls

---

Security

Security becomes increasingly important if cloud synchronization and accounts are introduced.

Future security considerations include:

- Secure authentication
- HTTPS
- Input validation
- Secure database rules
- Rate limiting
- Protected API routes
- Session management
- Encryption
- Secure notification infrastructure

---

Future Features

Expiry can evolve beyond simple date tracking.

Potential features include:

Calendar Integration

Sync expiry dates with:

- Google Calendar
- Apple Calendar
- Outlook Calendar

Email Reminders

Automatically send reminders before an expiry.

Push Notifications

Notify users directly on their devices.

Recurring Expiries

Useful for:

- Monthly subscriptions
- Annual insurance
- Recurring licences
- Membership renewals

Document Attachments

Attach a relevant document or image to an expiry.

OCR

Upload a document and automatically detect:

- Document type
- Expiry date
- Name
- Relevant information

Smart Reminders

Automatically recommend an appropriate reminder schedule based on the type of expiry.

Shared Lists

Allow families or teams to share important expiry dates.

Business Workspace

Businesses could track:

- Employee certificates
- Licences
- Insurance
- Contracts
- Domains
- Compliance documents
- Equipment warranties

---

Product Roadmap

Phase 1 — MVP

- Landing page
- Expiry dashboard
- Add expiry
- Edit expiry
- Delete expiry
- Categories
- Status indicators
- Local persistence
- Responsive interface

Phase 2 — Reminder System

- Reminder preferences
- Browser notifications
- Push notifications
- Email reminders
- Recurring expiry dates

Phase 3 — Cloud

- Optional authentication
- Cloud synchronization
- Backup
- Multi-device access

Phase 4 — Intelligence

- OCR
- Automatic date extraction
- Smart categorization
- Intelligent reminder recommendations

Phase 5 — Collaboration

- Shared expiry lists
- Family workspace
- Business workspace
- Team permissions

---

Monetization

The initial product can remain free while validating the core experience.

Potential future monetization models include:

Free

Basic expiry tracking and reminders.

Pro

Advanced reminders, cloud synchronization, attachments and integrations.

Family

Shared expiry management for households.

Business

Team management, compliance tracking and shared workspaces.

The monetization model should remain secondary to product usefulness.

---

Support the Builder

Expiry includes a subtle footer link:

Support the Builder

The link redirects to:

https://devameer.xyz/buy-me-a-coffee

No internal payment system is required.

The support link should remain unobtrusive and naturally integrated into the footer.

---

Product Philosophy

Expiry is built around a simple principle:

«You should not have to remember everything yourself.»

The product should remove mental overhead rather than create another complicated system to manage.

A successful Expiry experience should feel almost invisible:

Add something once.

Set the date.

Forget about it.

Get reminded when it matters.

---

Long-Term Vision

Expiry can become a personal deadline and renewal operating system.

Not just a place for dates, but a reliable layer between people and the things they need to remember.

From a passport renewal to a domain name, from a subscription to a professional certificate, Expiry aims to make important deadlines easier to manage.

Never miss an expiry.

---

Project Status

Status: Active Development

Expiry is currently being developed as a lightweight, accessible and practical expiry management platform.

The initial focus is on validating the core experience:

Add → Track → Remind

Future capabilities will be introduced based on actual user needs.

---

Contributing

Contributions, suggestions and ideas are welcome.

If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Open a pull request

Please keep contributions aligned with the project's simplicity and usability principles.

---

License

The project license should be defined according to the intended distribution model.

For an open-source release, an appropriate permissive license such as MIT may be used.

---

Built With Purpose

Expiry is designed to solve a small but common everyday problem:

Remembering what matters before it expires.

Simple tools can solve meaningful problems.

Expiry is one of them.

---

Expiry

Never miss an expiry.
