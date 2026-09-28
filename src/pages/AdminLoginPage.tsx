import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Shield, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { loginAdmin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please provide both administrator email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email, password);
      showToast('Administrative privileges verified. Welcome to Atelier Suite.', 'success');
      onNavigate('admin-dashboard');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@lumierebeauty.com');
    setPassword('admin123456');
    showToast('Admin credentials filled (admin@lumierebeauty.com).', 'info');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-[#F5F2EB]/50">
      <div className="bg-[#1A1918] text-[#FAF8F5] border border-[#362B28] rounded shadow-2xl max-w-md w-full p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#23211F] border border-[#C5A880]/30 mx-auto flex items-center justify-center text-[#C5A880] mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            Administrative Gateway
          </span>
          <h1 className="font-serif text-3xl font-light text-[#FAF8F5]">
            Atelier Management
          </h1>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            Restricted access portal for atelier directors, master artist scheduling, and appointment workflow controls.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1 font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lumierebeauty.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#23211F] border border-[#362B28] rounded text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1 font-medium">
              Admin Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#23211F] border border-[#362B28] rounded text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C5A880] hover:bg-[#b39366] text-[#1A1918] text-xs uppercase tracking-[0.18em] font-bold rounded transition-colors shadow mt-3 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Verifying Credentials...' : 'Authenticate Admin'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="pt-2 border-t border-[#362B28]">
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="w-full py-2.5 bg-[#23211F] hover:bg-[#2D2A27] text-[#C5A880] text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 border border-[#362B28]"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Fast Fill Demo Admin Credentials</span>
          </button>
        </div>

        <div className="text-center text-xs text-stone-500 font-light pt-1">
          <button
            onClick={() => onNavigate('customer-login')}
            className="text-stone-400 hover:text-[#FAF8F5] transition-colors"
          >
            ← Return to Guest Client Portal
          </button>
        </div>
      </div>
    </div>
  );
};
