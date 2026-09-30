import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const faqs = [
    {
      question: 'What can I track with Expiry?',
      answer:
        'You can track anything with a deadline or renewal date: passports, visas, driver’s licences, car insurance, health certificates, streaming subscriptions, domain registrations, SSL certificates, warranties, memberships, and personal milestones.',
    },
    {
      question: 'Do I need an account?',
      answer:
        'No. Expiry is designed to be fast, private, and frictionless. In this version, all your tracked items and preferences are saved securely and locally right in your browser storage. No passwords or email sign-ups required.',
    },
    {
      question: 'How do reminders work?',
      answer:
        'Expiry calculates the exact days remaining until each deadline and flags upcoming items in color-coded status badges: Green for safe (>30 days), Amber for approaching (≤30 days), and Red for critical or expired (≤7 days). You can also set custom advance notification windows.',
    },
    {
      question: 'Can I track multiple expiries?',
      answer:
        'Yes, you can track an unlimited number of items across any category. You can sort, search, and filter them seamlessly.',
    },
    {
      question: 'Is Expiry free?',
      answer:
        'Yes, Expiry is completely free to use. You can start tracking your documents, subscriptions, and warranties immediately.',
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-24 px-3.5 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1688D4]" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight">
          Common questions
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-neutral-600 font-medium px-2">
          Everything you need to know about tracking your expiries.
        </p>
      </div>

      <div className="divide-y divide-neutral-200/80 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={faq.question} className="p-4 sm:p-6 transition-colors">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 text-left font-bold text-base sm:text-lg text-neutral-900 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#1688D4] text-white rotate-180' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="mt-2.5 sm:mt-3.5 pr-2 sm:pr-8 text-neutral-600 text-xs sm:text-base leading-relaxed font-medium">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
