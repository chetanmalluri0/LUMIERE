import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import {
  AdminStats,
  Appointment,
  AppointmentStatus,
  Service,
  Staff,
  SalonSettings,
  NotificationRecord,
} from '../types/index.ts';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  Settings,
  Bell,
  Search,
  Plus,
  Check,
  X,
  Clock,
  Shield,
  Phone,
  Mail,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  FileText,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
  onOpenEmailPreview: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onOpenEmailPreview,
}) => {
  const { admin, token, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'customers' | 'services' | 'staff' | 'settings' | 'notifications'
  >('overview');

  // Stats
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState('ALL');
  const [aptDateFilter, setAptDateFilter] = useState('');
  const [loadingApts, setLoadingApts] = useState(false);

  // Reschedule Modal
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Customers
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<any | null>(null);

  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Staff
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Partial<Staff> | null>(null);
  const [isNewStaff, setIsNewStaff] = useState(false);

  // Settings
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  // Load initial stats & settings
  const fetchStats = () => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setStats(data.stats))
      .catch(console.error);
  };

  const fetchAppointments = () => {
    setLoadingApts(true);
    const params = new URLSearchParams();
    if (aptSearch) params.set('search', aptSearch);
    if (aptStatusFilter !== 'ALL') params.set('status', aptStatusFilter);
    if (aptDateFilter) params.set('date', aptDateFilter);

    fetch(`/api/admin/appointments?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setAppointments(data.appointments || []))
      .catch(console.error)
      .finally(() => setLoadingApts(false));
  };

  const fetchCustomers = () => {
    fetch(`/api/admin/customers?search=${encodeURIComponent(customerSearch)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(console.error);
  };

  const fetchServices = () => {
    fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(console.error);
  };

  const fetchStaff = () => {
    fetch('/api/admin/staff', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setStaffList(data.staff || []))
      .catch(console.error);
  };

  const fetchSettings = () => {
    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setSettings(data.settings))
      .catch(console.error);
  };

  const fetchNotifications = () => {
    fetch('/api/admin/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(console.error);
  };

  useEffect(() => {
    if (!token) return;
    fetchStats();
    fetchAppointments();
    fetchCustomers();
    fetchServices();
    fetchStaff();
    fetchSettings();
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (activeTab === 'appointments') fetchAppointments();
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'notifications') fetchNotifications();
  }, [aptStatusFilter, aptDateFilter, aptSearch, customerSearch, activeTab]);

  // Appointment Status Actions
  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`Appointment status updated to ${status}.`, 'success');
      fetchAppointments();
      fetchStats();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Appointment Reschedule
  const handleAdminReschedule = async () => {
    if (!rescheduleApt || !rescheduleDate || !rescheduleTime) {
      showToast('Please provide both new date and time.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/admin/appointments/${rescheduleApt.id}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: rescheduleDate, time: rescheduleTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleTime}.`, 'success');
      setRescheduleApt(null);
      fetchAppointments();
      fetchStats();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const url = isNewService ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;
      const method = isNewService ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingService),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(isNewService ? 'New service created.' : 'Service updated.', 'success');
      setEditingService(null);
      fetchServices();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Delete Service
  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this service?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete service');
      showToast('Service deleted.', 'info');
      fetchServices();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Staff
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      const url = isNewStaff ? '/api/admin/staff' : `/api/admin/staff/${editingStaff.id}`;
      const method = isNewStaff ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingStaff),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(isNewStaff ? 'Specialist added.' : 'Specialist profile updated.', 'success');
      setEditingStaff(null);
      fetchStaff();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('Atelier settings and notification preferences saved.', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!admin) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1A1918]">Administrative Access Required</h2>
        <p className="text-xs text-stone-500">Please sign in via the administrative portal.</p>
        <button
          onClick={() => onNavigate('admin-login')}
          className="px-6 py-2.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider rounded font-medium"
        >
          Go to Admin Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Top Header */}
      <div className="bg-[#1A1918] text-[#FAF8F5] rounded p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-[#362B28]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A880]">
            <Shield className="w-4 h-4" />
            <span>Atelier Administration Suite</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] mt-1">
            LUMIÈRE Control Center
          </h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Live database synchronisation · Authenticated as {admin.fullName} ({admin.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenEmailPreview}
            className="px-4 py-2.5 bg-[#23211F] hover:bg-[#2D2A27] text-[#C5A880] border border-[#362B28] text-xs uppercase tracking-wider font-semibold rounded transition-colors flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & WhatsApp Previews</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 bg-[#23211F] hover:bg-[#2D2A27] text-stone-400 hover:text-white border border-[#362B28] text-xs uppercase tracking-wider font-medium rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#EFEBE4] pb-2 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3.5 rounded transition-all flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-[#1A1918] text-[#FAF8F5]' : 'text-stone-600 hover:bg-[#F5F2EB]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`py-2 px-3.5 rounded transition-all flex items-center gap-2 ${
            activeTab === 'appointments' ? 'bg-[#1A1918] text-[#FAF8F5]' : 'text-stone-600 hover:bg-[#F5F2EB]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`py-2 px-3.5 rounded transition-all flex items-center gap-2 ${
            activeTab === 'customers' ? 'bg-[#1A1918] text-[#FAF8F5]' : 'text-stone-600 hover:bg-[#F5F2EB]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Customer Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`py-2 px-3.5 rounded transition-all flex items-center gap-2 ${
            activeTab === 'services' ? 'bg-[#1A1918] text-[#FAF8F5]' : 'text-stone-600 hover:bg-[#F5F2EB]'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Services Menu ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`py-2 px-3.5 rounded transition-all flex items-center gap-2 ${
            activeTab === 'staff' ? 'bg-[#1A1918] text-[#FAF8F5]' : 'text-stone-600 hover:bg-[#F5F2EB]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Specialists ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-3.5 rounded transition-all flex items-center gap-2 ${
            activeTab === 'settings' ? 'bg-[#1A1918] text-[#FAF8F5]' : 'text-stone-600 hover:bg-[#F5F2EB]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Atelier Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-2 px-3.5 rounded transition-all flex items-center gap-2 ${
            activeTab === 'notifications' ? 'bg-[#1A1918] text-[#FAF8F5]' : 'text-stone-600 hover:bg-[#F5F2EB]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Dispatch Log ({notifications.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="p-4 bg-white border border-[#EFEBE4] rounded space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-light">
                Total Clients
              </span>
              <div className="font-serif text-2xl text-[#1A1918] tabular-nums font-normal">
                {stats.totalCustomers}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EFEBE4] rounded space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-light">
                Today's Sessions
              </span>
              <div className="font-serif text-2xl text-[#1A1918] tabular-nums font-normal">
                {stats.todayAppointments}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EFEBE4] rounded space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-light">
                Upcoming
              </span>
              <div className="font-serif text-2xl text-emerald-700 tabular-nums font-normal">
                {stats.upcomingAppointments}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EFEBE4] rounded space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-light">
                Pending Requests
              </span>
              <div className="font-serif text-2xl text-[#9D8159] tabular-nums font-normal">
                {stats.pendingRequests}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EFEBE4] rounded space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-light">
                Completed
              </span>
              <div className="font-serif text-2xl text-stone-700 tabular-nums font-normal">
                {stats.completedAppointments}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EFEBE4] rounded space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-light">
                Cancelled / No Show
              </span>
              <div className="font-serif text-2xl text-red-600 tabular-nums font-normal">
                {stats.cancelledAppointments}
              </div>
            </div>

            <div className="p-4 bg-[#F5F2EB] border border-[#DFD7CB] rounded space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-600 font-medium">
                Est. Revenue
              </span>
              <div className="font-serif text-2xl text-[#1A1918] tabular-nums font-semibold">
                ₹{stats.estimatedRevenue.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Quick Action Queue: Pending Requests */}
          <div className="bg-white border border-[#EFEBE4] rounded p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#EFEBE4] pb-3">
              <div>
                <h3 className="font-serif text-xl text-[#1A1918]">Action Required: Pending Requests</h3>
                <p className="text-xs text-stone-500 font-light">
                  New appointment reservations awaiting atelier concierge confirmation.
                </p>
              </div>
              <button
                onClick={() => {
                  setAptStatusFilter('Pending');
                  setActiveTab('appointments');
                }}
                className="text-xs uppercase tracking-wider font-semibold text-[#1A1918] hover:text-[#C5A880]"
              >
                View Filtered ({stats.pendingRequests}) →
              </button>
            </div>

            <div className="divide-y divide-[#EFEBE4]">
              {appointments
                .filter((a) => a.status === 'Pending')
                .slice(0, 5)
                .map((apt) => (
                  <div key={apt.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#1A1918]">{apt.appointmentNumber}</span>
                        <span className="text-stone-400">·</span>
                        <strong className="text-stone-900">{apt.customerName}</strong>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-600">{apt.customerPhone}</span>
                      </div>
                      <div className="text-stone-500 font-light mt-0.5">
                        {apt.serviceName} with <strong>{apt.staffName}</strong> on{' '}
                        <strong>{apt.appointmentDate} at {apt.appointmentTime}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded text-xs"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              {stats.pendingRequests === 0 && (
                <div className="py-6 text-center text-xs text-stone-400">
                  All reservation requests have been processed.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS MANAGEMENT */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-[#EFEBE4] rounded p-4 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={aptSearch}
                onChange={(e) => setAptSearch(e.target.value)}
                placeholder="Search by ID (LUM-XXXXX), customer name, email, phone..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#DFD7CB] rounded text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={aptStatusFilter}
                onChange={(e) => setAptStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#FAF8F5] border border-[#DFD7CB] rounded text-xs text-stone-700 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>

              <input
                type="date"
                value={aptDateFilter}
                onChange={(e) => setAptDateFilter(e.target.value)}
                className="px-3 py-2 bg-[#FAF8F5] border border-[#DFD7CB] rounded text-xs text-stone-700 focus:outline-none"
              />

              {(aptSearch || aptStatusFilter !== 'ALL' || aptDateFilter) && (
                <button
                  onClick={() => {
                    setAptSearch('');
                    setAptStatusFilter('ALL');
                    setAptDateFilter('');
                  }}
                  className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white border border-[#EFEBE4] rounded overflow-hidden">
            {loadingApts ? (
              <div className="py-20 text-center text-xs text-stone-400">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="py-20 text-center text-xs text-stone-400">No appointments matching filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F2EB] border-b border-[#EFEBE4] uppercase tracking-wider text-stone-600 font-semibold">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Guest</th>
                      <th className="p-3.5">Service</th>
                      <th className="p-3.5">Specialist</th>
                      <th className="p-3.5">Date & Slot</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFEBE4]">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-3.5 font-mono font-medium text-stone-600">{apt.appointmentNumber}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-stone-900">{apt.customerName}</div>
                          <div className="text-[11px] text-stone-500 font-light">{apt.customerPhone}</div>
                        </td>
                        <td className="p-3.5 font-serif text-sm text-[#1A1918]">{apt.serviceName}</td>
                        <td className="p-3.5 text-stone-600 font-light">{apt.staffName}</td>
                        <td className="p-3.5 tabular-nums text-stone-700">
                          <div>{apt.appointmentDate}</div>
                          <div className="text-[11px] text-stone-400 font-light">{apt.appointmentTime}</div>
                        </td>
                        <td className="p-3.5 font-medium tabular-nums text-stone-900">
                          ₹{apt.servicePrice.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-block text-[11px] font-medium uppercase tracking-wider ${
                              apt.status === 'Confirmed'
                                ? 'text-emerald-700'
                                : apt.status === 'Pending'
                                ? 'text-[#9D8159]'
                                : apt.status === 'Completed'
                                ? 'text-stone-500'
                                : apt.status === 'Cancelled'
                                ? 'text-red-600'
                                : 'text-stone-400'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                          {apt.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-medium"
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status === 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                              className="px-2.5 py-1 bg-[#1A1918] text-[#FAF8F5] rounded text-[11px] font-medium hover:bg-[#362B28]"
                            >
                              Complete
                            </button>
                          )}
                          {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                            <button
                              onClick={() => {
                                setRescheduleApt(apt);
                                setRescheduleDate(apt.appointmentDate);
                                setRescheduleTime(apt.appointmentTime);
                              }}
                              className="px-2.5 py-1 border border-[#DFD7CB] text-stone-700 hover:bg-[#F5F2EB] rounded text-[11px]"
                            >
                              Reschedule
                            </button>
                          )}
                          {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px]"
                            >
                              Cancel
                            </button>
                          )}
                          {apt.status === 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'No Show')}
                              className="px-2 py-1 text-stone-400 hover:text-stone-700 rounded text-[11px]"
                            >
                              No Show
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EFEBE4] rounded p-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search registered patrons by name, email, phone..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#DFD7CB] rounded text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="bg-white border border-[#EFEBE4] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F2EB] border-b border-[#EFEBE4] uppercase tracking-wider text-stone-600 font-semibold">
                  <tr>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Total Appointments</th>
                    <th className="p-3.5">Latest Activity</th>
                    <th className="p-3.5 text-right">Profile History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEBE4]">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3.5 font-serif text-sm text-[#1A1918]">{c.fullName}</td>
                      <td className="p-3.5 text-stone-600 font-light">{c.email}</td>
                      <td className="p-3.5 text-stone-600 font-light">{c.phone}</td>
                      <td className="p-3.5 font-medium tabular-nums text-stone-900">
                        {c.appointmentCount} sessions
                      </td>
                      <td className="p-3.5 text-stone-500 font-light text-[11px]">
                        {c.lastAppointment}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            fetch(`/api/admin/customers/${c.id}/appointments`, {
                              headers: { Authorization: `Bearer ${token}` },
                            })
                              .then((r) => r.json())
                              .then((data) => {
                                setSelectedCustomerHistory({ customer: c, appointments: data.appointments || [] });
                              });
                          }}
                          className="px-3 py-1 border border-[#DFD7CB] text-stone-700 hover:bg-[#F5F2EB] rounded text-xs"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-[#EFEBE4] rounded p-4">
            <div>
              <h3 className="font-serif text-lg text-[#1A1918]">Atelier Service Menu</h3>
              <p className="text-xs text-stone-500 font-light">
                Configure prices, session durations, descriptions, and active status.
              </p>
            </div>
            <button
              onClick={() => {
                setIsNewService(true);
                setEditingService({
                  name: '',
                  description: '',
                  durationMinutes: 45,
                  price: 999,
                  category: 'Hair',
                  imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
                  isActive: true,
                });
              }}
              className="px-4 py-2 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white border border-[#EFEBE4] rounded overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={srv.imageUrl}
                      alt={srv.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-stone-800 rounded">
                      {srv.isActive ? 'Active' : 'Disabled'}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-serif text-lg text-[#1A1918]">{srv.name}</h4>
                      <span className="text-sm font-semibold tabular-nums text-stone-900">
                        ₹{srv.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#9D8159] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{srv.durationMinutes} mins · {srv.category}</span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-light">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-[#EFEBE4] bg-[#FAF8F5] flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsNewService(false);
                      setEditingService(srv);
                    }}
                    className="p-1.5 text-stone-600 hover:text-stone-900 border border-[#DFD7CB] rounded"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 border border-red-200 rounded"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STAFF MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-[#EFEBE4] rounded p-4">
            <div>
              <h3 className="font-serif text-lg text-[#1A1918]">Atelier Specialist Faculty</h3>
              <p className="text-xs text-stone-500 font-light">
                Manage stylist profiles, biographies, operating hours, and active statuses.
              </p>
            </div>
            <button
              onClick={() => {
                setIsNewStaff(true);
                setEditingStaff({
                  name: '',
                  title: '',
                  bio: '',
                  email: '',
                  phone: '',
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                  isActive: true,
                  daysAvailable: [1, 2, 3, 4, 5, 6],
                  hoursStart: '09:00',
                  hoursEnd: '19:00',
                });
              }}
              className="px-4 py-2 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specialist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((st) => (
              <div
                key={st.id}
                className="bg-white border border-[#EFEBE4] rounded p-5 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={st.avatarUrl}
                    alt={st.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border border-[#DFD7CB] shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-lg text-[#1A1918]">{st.name}</h4>
                    <p className="text-xs text-[#9D8159] font-medium">{st.title}</p>
                    <p className="text-[11px] text-stone-500 font-light mt-1">
                      {st.email} · {st.hoursStart} - {st.hoursEnd}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                  {st.bio}
                </p>

                <div className="pt-3 border-t border-[#EFEBE4] flex justify-between items-center">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium ${
                      st.isActive ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {st.isActive ? 'Active on Schedule' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => {
                      setIsNewStaff(false);
                      setEditingStaff(st);
                    }}
                    className="px-3 py-1 border border-[#DFD7CB] text-stone-700 hover:bg-[#F5F2EB] rounded text-xs"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS (/admin/settings) */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white border border-[#EFEBE4] rounded p-8 max-w-2xl">
          <div className="border-b border-[#EFEBE4] pb-4 mb-6">
            <h2 className="font-serif text-2xl text-[#1A1918]">Atelier Settings & Integrations</h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Configure brand identity, studio contact numbers, WhatsApp bridge, and dispatch preferences.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Salon Brand Name
              </label>
              <input
                type="text"
                required
                value={settings.salonName}
                onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Salon Tagline
              </label>
              <input
                type="text"
                value={settings.salonTagline}
                onChange={(e) => setSettings({ ...settings, salonTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Concierge Email
                </label>
                <input
                  type="email"
                  required
                  value={settings.salonEmail}
                  onChange={(e) => setSettings({ ...settings, salonEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Direct Telephone
                </label>
                <input
                  type="text"
                  required
                  value={settings.salonPhone}
                  onChange={(e) => setSettings({ ...settings, salonPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  WhatsApp Business Number
                </label>
                <input
                  type="text"
                  required
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Operating Hours
                </label>
                <input
                  type="text"
                  required
                  value={settings.businessHours}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Physical Studio Address
              </label>
              <textarea
                rows={2}
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
              />
            </div>

            {/* Notification Preferences */}
            <div className="pt-4 border-t border-[#EFEBE4] space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-stone-700 font-semibold">
                Dispatch Preferences
              </h4>
              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyCustomerOnBook}
                  onChange={(e) =>
                    setSettings({ ...settings, notifyCustomerOnBook: e.target.checked })
                  }
                  className="rounded text-[#1A1918]"
                />
                <span>Automatically dispatch branded HTML confirmation email to client</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifySalonOnBook}
                  onChange={(e) =>
                    setSettings({ ...settings, notifySalonOnBook: e.target.checked })
                  }
                  className="rounded text-[#1A1918]"
                />
                <span>Send instantaneous booking notification to atelier staff WhatsApp & Email</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableWhatsAppAlerts}
                  onChange={(e) =>
                    setSettings({ ...settings, enableWhatsAppAlerts: e.target.checked })
                  }
                  className="rounded text-[#1A1918]"
                />
                <span>Enable WhatsApp notification workflow for customers</span>
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded shadow-sm"
              >
                {savingSettings ? 'Saving Settings...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 7: DISPATCH NOTIFICATIONS LOG */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-[#EFEBE4] rounded overflow-hidden">
          <div className="p-4 bg-[#F5F2EB] border-b border-[#EFEBE4] flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg text-[#1A1918]">Automated Notifications Dispatch Log</h3>
              <p className="text-xs text-stone-500 font-light">
                Real-time audit log of customer emails and atelier WhatsApp messages dispatched by the system.
              </p>
            </div>
            <button
              onClick={onOpenEmailPreview}
              className="px-3.5 py-1.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium rounded"
            >
              Open Email Template Inspector
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#EFEBE4] uppercase tracking-wider text-stone-600 font-semibold">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Recipient</th>
                  <th className="p-3.5">Template</th>
                  <th className="p-3.5">Subject / Preview</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE4]">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3.5 tabular-nums text-stone-500 font-light whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wider ${
                          n.channel === 'EMAIL' ? 'text-blue-700' : 'text-emerald-700'
                        }`}
                      >
                        {n.channel === 'EMAIL' ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        <span>{n.channel}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-stone-800">{n.recipientType}</div>
                      <div className="text-[11px] text-stone-500 font-light">
                        {n.recipientEmail || n.recipientPhone}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-stone-600">{n.template}</td>
                    <td className="p-3.5 max-w-xs truncate text-stone-700 font-light" title={n.content}>
                      {n.subject}
                    </td>
                    <td className="p-3.5">
                      <span className="text-emerald-700 font-medium text-[11px]">SENT</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reschedule Modal (Admin) */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded max-w-md w-full p-6 space-y-4 animate-scale-up shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#EFEBE4] pb-3">
              <h3 className="font-serif text-xl text-[#1A1918]">
                Reschedule {rescheduleApt.appointmentNumber}
              </h3>
              <button
                onClick={() => setRescheduleApt(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  New Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  New Time Slot (e.g. 11:15, 14:00)
                </label>
                <input
                  type="text"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  placeholder="11:15"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#EFEBE4] flex justify-end gap-3">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-[#1A1918]"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminReschedule}
                className="px-5 py-2 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded"
              >
                Save Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer History Modal */}
      {selectedCustomerHistory && (
        <div className="fixed inset-0 z-50 bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded max-w-2xl w-full p-6 space-y-4 animate-scale-up shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-[#EFEBE4] pb-3">
              <div>
                <h3 className="font-serif text-xl text-[#1A1918]">
                  {selectedCustomerHistory.customer.fullName}
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  {selectedCustomerHistory.customer.email} · {selectedCustomerHistory.customer.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomerHistory(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-[#EFEBE4]">
              {selectedCustomerHistory.appointments.map((apt: any) => (
                <div key={apt.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-semibold text-stone-600">{apt.appointmentNumber}</span>
                    <h4 className="font-serif text-sm text-[#1A1918]">{apt.serviceName}</h4>
                    <p className="text-stone-500 font-light">
                      Specialist: {apt.staffName} · {apt.appointmentDate} at {apt.appointmentTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold tabular-nums text-stone-900">
                      ₹{Number(apt.servicePrice).toLocaleString('en-IN')}
                    </span>
                    <div className="text-[11px] font-medium text-stone-600">{apt.status}</div>
                  </div>
                </div>
              ))}
              {selectedCustomerHistory.appointments.length === 0 && (
                <div className="py-8 text-center text-xs text-stone-400">
                  No appointments registered for this guest.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#EFEBE4] flex justify-end">
              <button
                onClick={() => setSelectedCustomerHistory(null)}
                className="px-5 py-2 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider rounded font-medium"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded max-w-lg w-full p-6 space-y-4 animate-scale-up shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#EFEBE4] pb-3">
              <h3 className="font-serif text-xl text-[#1A1918]">
                {isNewService ? 'Create Bespoke Service' : 'Edit Service Details'}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingService.price || ''}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingService.durationMinutes || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={editingService.category || 'Hair'}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                >
                  <option value="Hair">Hair</option>
                  <option value="Hair Care">Hair Care</option>
                  <option value="Color">Color</option>
                  <option value="Treatments">Treatments</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Nails">Nails</option>
                  <option value="Bridal & Luxury">Bridal & Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingService.imageUrl || ''}
                  onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="srvActive"
                  checked={editingService.isActive !== false}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                />
                <label htmlFor="srvActive" className="text-stone-700 font-medium">
                  Service is actively available for online booking
                </label>
              </div>

              <div className="pt-4 border-t border-[#EFEBE4] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-stone-600 hover:text-[#1A1918] uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1918] text-[#FAF8F5] uppercase tracking-wider font-semibold rounded"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded max-w-lg w-full p-6 space-y-4 animate-scale-up shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#EFEBE4] pb-3">
              <h3 className="font-serif text-xl text-[#1A1918]">
                {isNewStaff ? 'Add Atelier Specialist' : 'Edit Specialist Profile'}
              </h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingStaff.name || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                  Title & Specialty
                </label>
                <input
                  type="text"
                  required
                  value={editingStaff.title || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editingStaff.email || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editingStaff.phone || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                  Biography & Qualifications
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingStaff.bio || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                    Operating Hours Start
                  </label>
                  <input
                    type="text"
                    value={editingStaff.hoursStart || '09:00'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, hoursStart: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold uppercase tracking-wider mb-1">
                    Operating Hours End
                  </label>
                  <input
                    type="text"
                    value={editingStaff.hoursEnd || '19:00'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, hoursEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="staffActive"
                  checked={editingStaff.isActive !== false}
                  onChange={(e) => setEditingStaff({ ...editingStaff, isActive: e.target.checked })}
                />
                <label htmlFor="staffActive" className="text-stone-700 font-medium">
                  Specialist is actively available for online booking
                </label>
              </div>

              <div className="pt-4 border-t border-[#EFEBE4] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-stone-600 hover:text-[#1A1918] uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1918] text-[#FAF8F5] uppercase tracking-wider font-semibold rounded"
                >
                  Save Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
