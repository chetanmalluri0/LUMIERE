import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

interface CustomerRegisterPageProps {
  onNavigate: (page: string) => void;
}

export const CustomerRegisterPage: React.FC<CustomerRegisterPageProps> = ({ onNavigate }) => {
  const { registerCustomer } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) {
      showToast('Please fill out all required registration fields.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      await registerCustomer(email, password, fullName, phone);
      showToast('Your LUMIÈRE client profile has been registered.', 'success');
      onNavigate('customer-dashboard');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-16">
      <div className="bg-white border border-[#EFEBE4] rounded shadow-lg max-w-md w-full p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9D8159] font-semibold">
            Atelier Membership
          </span>
          <h1 className="font-serif text-3xl text-[#1A1918]">Create Client Profile</h1>
          <p className="text-xs text-stone-500 font-light leading-relaxed">
            Join the LUMIÈRE guest community for seamless online reservations, custom treatment dossiers, and priority access.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Zoya Khan"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
              Contact Telephone / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 00000"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
              Create Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-500 font-light">
            <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
            <span>We maintain strict discretion and never share client information with third parties.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A1918] hover:bg-[#362B28] disabled:bg-stone-400 text-[#FAF8F5] text-xs uppercase tracking-[0.18em] font-semibold rounded transition-colors shadow-sm mt-3 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Registering...' : 'Complete Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 font-light pt-2 border-t border-[#EFEBE4]">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('customer-login')}
            className="text-[#1A1918] font-semibold hover:text-[#C5A880] underline transition-colors"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
