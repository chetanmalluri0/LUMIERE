import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Menu, X, User as UserIcon, Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, onOpenBooking }) => {
  const { user, admin, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'team', label: 'Specialists' },
    { id: 'gallery', label: 'Atelier' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFEBE4] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-left font-serif text-2xl tracking-[0.2em] font-normal text-[#1A1918] hover:text-[#C5A880] transition-colors"
        >
          LUMIÈRE
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.15em] font-medium text-[#55524E]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`transition-colors py-1 hover:text-[#1A1918] relative ${
                activePage === link.id
                  ? 'text-[#1A1918] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#C5A880]'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden md:flex items-center gap-4">
          {role === 'ADMIN' ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-[#1A1918] hover:text-[#C5A880] transition-colors px-3 py-2 border border-[#DFD7CB] rounded"
              >
                <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Admin Suite</span>
              </button>
              <button
                onClick={logout}
                title="Log out"
                className="text-stone-500 hover:text-[#1A1918] p-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : role === 'CUSTOMER' && user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('customer-dashboard')}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#1A1918] hover:text-[#C5A880] px-3 py-2 border border-[#DFD7CB] rounded transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="max-w-[120px] truncate">{user.fullName.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                title="Log out"
                className="text-stone-500 hover:text-[#1A1918] p-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('customer-login')}
              className="text-xs uppercase tracking-wider font-medium text-[#55524E] hover:text-[#1A1918] px-3 py-2 transition-colors"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs font-medium uppercase tracking-[0.15em] transition-colors rounded shadow-sm"
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenBooking}
            className="px-3.5 py-2 bg-[#1A1918] text-[#FAF8F5] text-[11px] font-medium uppercase tracking-wider rounded"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1A1918] focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#EFEBE4] px-6 py-6 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-4 text-sm uppercase tracking-widest font-medium text-[#55524E]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left py-2 hover:text-[#1A1918] ${
                  activePage === link.id ? 'text-[#1A1918] font-semibold pl-2 border-l-2 border-[#C5A880]' : ''
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-[#EFEBE4] flex flex-col gap-3">
              {role === 'ADMIN' ? (
                <>
                  <button
                    onClick={() => handleLinkClick('admin-dashboard')}
                    className="flex items-center gap-2 text-left py-2 text-stone-900 font-semibold"
                  >
                    <Shield className="w-4 h-4 text-[#C5A880]" />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 text-red-600"
                  >
                    Log Out
                  </button>
                </>
              ) : role === 'CUSTOMER' && user ? (
                <>
                  <button
                    onClick={() => handleLinkClick('customer-dashboard')}
                    className="flex items-center gap-2 text-left py-2 text-stone-900 font-semibold"
                  >
                    <UserIcon className="w-4 h-4 text-[#C5A880]" />
                    <span>My Dashboard ({user.fullName})</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 text-red-600"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleLinkClick('customer-login')}
                    className="text-left py-2 text-stone-800"
                  >
                    Customer Sign In
                  </button>
                  <button
                    onClick={() => handleLinkClick('admin-login')}
                    className="text-left py-2 text-stone-500 text-xs"
                  >
                    Staff & Admin Access
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
