import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8 text-stone-700">
      <div className="border-b border-[#EFEBE4] pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
          Terms of Service
        </span>
        <h1 className="font-serif text-4xl text-[#1A1918] font-light mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-stone-500 font-light mt-1">
          Effective Date: September 28, 2026 · LUMIÈRE Beauty Studio
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm font-light leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">1. Atelier Appointments & Scheduling</h2>
          <p>
            LUMIÈRE operates strictly by scheduled appointment to guarantee dedicated, unhurried time with each master artisan. We kindly request that patrons arrive 10 minutes prior to their reserved session time to partake in our welcoming beverage ceremony and preliminary consultation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">2. Cancellation & Rescheduling Policy</h2>
          <p>
            We understand scheduling priorities shift. You may reschedule or cancel your reservation without penalty up to <strong>4 hours prior</strong> to the scheduled start time via your Client Portal or by contacting our concierge desk. Late cancellations or unattended appointments ("No Show") prevent other patrons from reserving the atelier suite.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">3. Health, Sensitivities & Disclosures</h2>
          <p>
            Patrons must disclose any relevant scalp sensitivities, medical skin conditions, pregnancy advisories, or recent chemical treatments during booking or in the consultation phase. Our specialists reserve the right to recommend alternative gentle treatments or postpone service if an adverse physiological reaction is anticipated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">4. Payment Terms & Rates</h2>
          <p>
            All prices listed on our digital portals and printed menus are quoted in Indian Rupees (₹) inclusive of applicable taxes. Payment is rendered at the concierge counter following the completion of your session via major debit/credit cards, UPI, or cash.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">5. Atelier Etiquette</h2>
          <p>
            To preserve the architectural quiet and serenity of our guests, we politely ask that electronic devices be placed on silent mode within the styling pavilions.
          </p>
        </section>
      </div>
    </div>
  );
};
