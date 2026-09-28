import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8 text-stone-700">
      <div className="border-b border-[#EFEBE4] pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
          Legal & Privacy
        </span>
        <h1 className="font-serif text-4xl text-[#1A1918] font-light mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-500 font-light mt-1">
          Last revised: September 28, 2026 · LUMIÈRE Beauty Studio Atelier
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm font-light leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">1. Introduction & Discretion</h2>
          <p>
            At LUMIÈRE Beauty Studio ("LUMIÈRE", "we", "our", or "atelier"), guest confidentiality and personal privacy are foundational tenets of our hospitality. This document outlines how we collect, store, and utilize personal information gathered through our online reservation engine, client portals, and in-person consultations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Contact Details:</strong> Legal name, email address, telephone contact, and delivery notes.</li>
            <li><strong>Service Itinerary Data:</strong> Appointment timestamps, assigned specialist, selected ritual, and transactional history.</li>
            <li><strong>Consultation Insights:</strong> Scalp sensitivities, chemical allergies, previous coloring history, and bespoke style preferences noted with your explicit consent.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">3. Purpose of Processing</h2>
          <p>
            Your information is solely used to orchestrate reservations, prevent scheduling conflicts, dispatch transactional booking updates (via email and WhatsApp), and curate custom beauty treatments. We do not sell, trade, or distribute your private contact details to commercial third parties or external marketing networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">4. Data Retention & Security</h2>
          <p>
            Client account information and appointment logs are encrypted in transit and at rest using modern cryptographic standards. Passwords are irreversibly salted and hashed. You retain the right at any time to request complete extraction or deletion of your client dossier by contacting our concierge at concierge@lumierebeauty.com.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1A1918]">5. Direct Inquiries</h2>
          <p>
            For privacy inquiries or data governance requests, please contact:
            <br />
            <strong>Concierge Privacy Officer</strong>
            <br />
            LUMIÈRE Beauty Studio, 74 Lavelle Road, Richmond Town, Bengaluru, KA 560001
          </p>
        </section>
      </div>
    </div>
  );
};
