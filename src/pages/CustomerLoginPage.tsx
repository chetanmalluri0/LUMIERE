import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface CustomerLoginPageProps {
  onNavigate: (page: string) => void;
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({ onNavigate }) => {
  const { loginCustomer } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await loginCustomer(email, password);
      showToast('Welcome back to LUMIÈRE.', 'success');
      onNavigate('customer-dashboard');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('ananya.deshmukh@example.com');
    setPassword('customer123');
    showToast('Demo customer credentials filled.', 'info');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-16">
      <div className="bg-white border border-[#EFEBE4] rounded shadow-lg max-w-md w-full p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9D8159] font-semibold">
            Client Portal
          </span>
          <h1 className="font-serif text-3xl text-[#1A1918]">Welcome Back</h1>
          <p className="text-xs text-stone-500 font-light leading-relaxed">
            Sign in to review upcoming atelier reservations, reschedule sessions, and view your beauty itinerary.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
              Email Address
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
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A1918] hover:bg-[#362B28] disabled:bg-stone-400 text-[#FAF8F5] text-xs uppercase tracking-[0.18em] font-semibold rounded transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="pt-2 border-t border-[#EFEBE4]">
          <button
            type="button"
            onClick={fillDemoCustomer}
            className="w-full py-2 bg-[#F5F2EB] hover:bg-[#EFEBE4] text-[#1A1918] text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Fast Fill Demo Customer (Ananya Deshmukh)</span>
          </button>
        </div>

        <div className="text-center text-xs text-stone-500 font-light space-y-2 pt-2">
          <div>
            First time guest?{' '}
            <button
              onClick={() => onNavigate('customer-register')}
              className="text-[#1A1918] font-semibold hover:text-[#C5A880] underline transition-colors"
            >
              Create Client Account
            </button>
          </div>
          <div>
            <button
              onClick={() => onNavigate('admin-login')}
              className="text-stone-400 hover:text-stone-700 text-[11px] transition-colors"
            >
              Administrative Staff Portal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
