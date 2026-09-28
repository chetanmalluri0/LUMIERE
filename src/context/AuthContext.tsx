import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AdminUser } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  admin: AdminUser | null;
  token: string | null;
  role: 'CUSTOMER' | 'ADMIN' | null;
  isLoading: boolean;
  loginCustomer: (email: string, pass: string) => Promise<void>;
  registerCustomer: (email: string, pass: string, fullName: string, phone: string) => Promise<void>;
  loginAdmin: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUserInContext: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth from localStorage token
  useEffect(() => {
    const savedToken = localStorage.getItem('lumiere_token');
    const savedRole = localStorage.getItem('lumiere_role') as 'CUSTOMER' | 'ADMIN' | null;

    if (!savedToken || !savedRole) {
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    setRole(savedRole);

    if (savedRole === 'ADMIN') {
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session expired');
          return res.json();
        })
        .then((data) => {
          setAdmin(data.admin);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session expired');
          return res.json();
        })
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const loginCustomer = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');

    setUser(data.user);
    setAdmin(null);
    setToken(data.token);
    setRole('CUSTOMER');
    localStorage.setItem('lumiere_token', data.token);
    localStorage.setItem('lumiere_role', 'CUSTOMER');
  };

  const registerCustomer = async (email: string, pass: string, fullName: string, phone: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, fullName, phone }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    setUser(data.user);
    setAdmin(null);
    setToken(data.token);
    setRole('CUSTOMER');
    localStorage.setItem('lumiere_token', data.token);
    localStorage.setItem('lumiere_role', 'CUSTOMER');
  };

  const loginAdmin = async (email: string, pass: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin credentials invalid');

    setAdmin(data.admin);
    setUser(null);
    setToken(data.token);
    setRole('ADMIN');
    localStorage.setItem('lumiere_token', data.token);
    localStorage.setItem('lumiere_role', 'ADMIN');
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('lumiere_token');
    localStorage.removeItem('lumiere_role');
  };

  const updateUserInContext = (updated: User) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        role,
        isLoading,
        loginCustomer,
        registerCustomer,
        loginAdmin,
        logout,
        updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
