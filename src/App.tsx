/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { BookingWizard } from './components/booking/BookingWizard.tsx';
import { ServiceDetailModal } from './components/services/ServiceDetailModal.tsx';
import { EmailTemplatePreviewModal } from './components/email/EmailTemplatePreviewModal.tsx';
import { Service } from './types/index.ts';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { TeamPage } from './pages/TeamPage.tsx';
import { PricingPage } from './pages/PricingPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { CustomerLoginPage } from './pages/CustomerLoginPage.tsx';
import { CustomerRegisterPage } from './pages/CustomerRegisterPage.tsx';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';

function MainApp() {
  const { role } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [selectedDetailService, setSelectedDetailService] = useState<Service | null>(null);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  // Sync with browser hash / path
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActivePage(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (window.location.hash) {
      handleHash();
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page: string) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceId?: string) => {
    setBookingServiceId(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1918]">
      {/* Navbar (Zone 1-3 strict contract) */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onOpenBooking={handleOpenBooking}
            onSelectService={(s) => setSelectedDetailService(s)}
          />
        )}
        {activePage === 'services' && (
          <ServicesPage
            onOpenBooking={handleOpenBooking}
            onSelectService={(s) => setSelectedDetailService(s)}
          />
        )}
        {activePage === 'about' && (
          <AboutPage
            onOpenBooking={() => handleOpenBooking()}
            onNavigate={navigateTo}
          />
        )}
        {activePage === 'team' && (
          <TeamPage onOpenBooking={() => handleOpenBooking()} />
        )}
        {activePage === 'pricing' && (
          <PricingPage onOpenBooking={() => handleOpenBooking()} />
        )}
        {activePage === 'gallery' && <GalleryPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'customer-login' && (
          <CustomerLoginPage onNavigate={navigateTo} />
        )}
        {activePage === 'customer-register' && (
          <CustomerRegisterPage onNavigate={navigateTo} />
        )}
        {activePage === 'customer-dashboard' && (
          <CustomerDashboardPage
            onOpenBooking={() => handleOpenBooking()}
            onNavigate={navigateTo}
          />
        )}
        {activePage === 'admin-login' && (
          <AdminLoginPage onNavigate={navigateTo} />
        )}
        {activePage === 'admin-dashboard' && (
          <AdminDashboardPage
            onNavigate={navigateTo}
            onOpenEmailPreview={() => setIsEmailPreviewOpen(true)}
          />
        )}
        {activePage === 'privacy' && <PrivacyPolicyPage />}
        {activePage === 'terms' && <TermsPage />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Booking Wizard Modal */}
      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingServiceId(undefined);
        }}
        preSelectedServiceId={bookingServiceId}
        onViewDashboard={() => navigateTo('customer-dashboard')}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedDetailService}
        onClose={() => setSelectedDetailService(null)}
        onBook={(id) => handleOpenBooking(id)}
      />

      {/* Email & WhatsApp Template Preview Modal */}
      <EmailTemplatePreviewModal
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
