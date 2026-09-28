import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Appointment, AppointmentStatus } from '../types/index.ts';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  X,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface CustomerDashboardPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  const { user, token, logout, updateUserInContext } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'profile'>('upcoming');

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Reschedule Modal State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [savingReschedule, setSavingReschedule] = useState(false);

  // Cancel Modal State
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.fullName);
      setEditPhone(user.phone);
    }
  }, [user]);

  const fetchAppointments = () => {
    if (!token) return;
    setLoading(true);
    fetch('/api/customer/appointments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch((err) => {
        showToast('Error loading reservations: ' + err.message, 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  // Handle slot lookup for rescheduling
  useEffect(() => {
    if (!rescheduleApt || !newDate) return;
    setLoadingSlots(true);
    fetch(`/api/availability?date=${newDate}&staffId=${rescheduleApt.staffId}&durationMinutes=${rescheduleApt.durationMinutes}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
      })
      .catch(console.error)
      .finally(() => setLoadingSlots(false));
  }, [rescheduleApt, newDate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: editName, phone: editPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      updateUserInContext(data.user);
      showToast('Client profile updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelApt) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/customer/appointments/${cancelApt.id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancellation failed');

      showToast(`Appointment ${cancelApt.appointmentNumber} has been cancelled.`, 'info');
      setCancelApt(null);
      fetchAppointments();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleApt || !newDate || !newSlot) {
      showToast('Please select both a new date and available time slot.', 'error');
      return;
    }

    setSavingReschedule(true);
    try {
      const res = await fetch(`/api/customer/appointments/${rescheduleApt.id}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: newDate, time: newSlot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reschedule failed');

      showToast(`Appointment rescheduled to ${newDate} at ${newSlot}.`, 'success');
      setRescheduleApt(null);
      setNewSlot('');
      fetchAppointments();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSavingReschedule(false);
    }
  };

  // Filter appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingList = appointments.filter(
    (a) => a.appointmentDate >= todayStr && (a.status === 'Confirmed' || a.status === 'Pending')
  );
  const historyList = appointments.filter(
    (a) => a.appointmentDate < todayStr || a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'No Show'
  );

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return <span className="text-emerald-700 font-medium">Confirmed</span>;
      case 'Pending':
        return <span className="text-[#9D8159] font-medium">Pending Review</span>;
      case 'Completed':
        return <span className="text-stone-500 font-light">Completed</span>;
      case 'Cancelled':
        return <span className="text-red-600 font-light">Cancelled</span>;
      case 'No Show':
        return <span className="text-stone-400 font-light">No Show</span>;
    }
  };

  if (!user) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1A1918]">Authentication Required</h2>
        <p className="text-xs text-stone-500">Please sign in to access your client dashboard.</p>
        <button
          onClick={() => onNavigate('customer-login')}
          className="px-6 py-2.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider rounded font-medium"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Top Banner */}
      <div className="bg-[#F5F2EB] border border-[#EFEBE4] rounded p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9D8159] font-semibold">
            Client Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1918] mt-0.5">
            Greetings, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs text-stone-600 font-light mt-1">
            Member Account: {user.email} · Registered {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-white border border-[#DFD7CB] hover:bg-stone-50 text-stone-700 text-xs uppercase tracking-wider font-medium rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#EFEBE4] pb-2 text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-3 font-semibold transition-all relative ${
            activeTab === 'upcoming'
              ? 'text-[#1A1918] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#C5A880]'
              : 'text-stone-500 hover:text-[#1A1918]'
          }`}
        >
          Upcoming Reservations ({upcomingList.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-3 font-semibold transition-all relative ${
            activeTab === 'history'
              ? 'text-[#1A1918] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#C5A880]'
              : 'text-stone-500 hover:text-[#1A1918]'
          }`}
        >
          Appointment History ({historyList.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-3 font-semibold transition-all relative ${
            activeTab === 'profile'
              ? 'text-[#1A1918] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#C5A880]'
              : 'text-stone-500 hover:text-[#1A1918]'
          }`}
        >
          Guest Profile & Information
        </button>
      </div>

      {/* Tab 1: Upcoming Appointments */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-xs text-stone-400">Loading your reservations...</div>
          ) : upcomingList.length === 0 ? (
            <div className="py-16 bg-white border border-[#EFEBE4] rounded text-center space-y-3 p-8">
              <CalendarCheck className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif text-xl text-[#1A1918]">No Upcoming Appointments</h3>
              <p className="text-xs text-stone-500 font-light max-w-sm mx-auto">
                You have no active appointments scheduled. Reserve your next bespoke haircut, color treatment, or facial therapy today.
              </p>
              <button
                onClick={onOpenBooking}
                className="mt-2 px-6 py-2.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider rounded font-medium inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Reserve a Session</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingList.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white border border-[#EFEBE4] rounded p-6 shadow-sm hover:border-[#DFD7CB] transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-[#EFEBE4]">
                      <span className="font-mono font-medium text-stone-500">{apt.appointmentNumber}</span>
                      <div className="text-xs">{getStatusBadge(apt.status)}</div>
                    </div>

                    <div className="pt-3 space-y-2">
                      <h3 className="font-serif text-2xl text-[#1A1918] font-normal">
                        {apt.serviceName}
                      </h3>
                      <div className="text-xs text-[#9D8159] font-medium">
                        Specialist: <strong>{apt.staffName}</strong>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-600 font-light pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{apt.appointmentDate}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{apt.appointmentTime} ({apt.durationMinutes}m)</span>
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 pt-1 font-semibold tabular-nums">
                        Amount: ₹{apt.servicePrice.toLocaleString('en-IN')}
                      </div>
                      {apt.notes && (
                        <p className="text-[11px] text-stone-500 bg-[#FAF8F5] p-2.5 rounded border border-[#EFEBE4] font-light italic">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EFEBE4] flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setRescheduleApt(apt);
                        setNewDate(apt.appointmentDate);
                      }}
                      className="px-3.5 py-1.5 border border-[#DFD7CB] hover:bg-[#F5F2EB] text-stone-700 text-xs uppercase tracking-wider font-medium rounded transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => setCancelApt(apt)}
                      className="px-3.5 py-1.5 text-red-600 hover:bg-red-50 text-xs uppercase tracking-wider font-medium rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Appointment History */}
      {activeTab === 'history' && (
        <div className="bg-white border border-[#EFEBE4] rounded overflow-hidden">
          {historyList.length === 0 ? (
            <div className="py-16 text-center text-xs text-stone-400">
              No previous appointment history recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F2EB] border-b border-[#EFEBE4] uppercase tracking-wider text-stone-600 font-semibold">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Specialist</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEBE4]">
                  {historyList.map((apt) => (
                    <tr key={apt.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono font-medium text-stone-500">{apt.appointmentNumber}</td>
                      <td className="p-4 font-serif text-sm text-[#1A1918]">{apt.serviceName}</td>
                      <td className="p-4 text-stone-600 font-light">{apt.staffName}</td>
                      <td className="p-4 text-stone-600 font-light tabular-nums">
                        {apt.appointmentDate} at {apt.appointmentTime}
                      </td>
                      <td className="p-4 text-stone-900 font-medium tabular-nums">
                        ₹{apt.servicePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">{getStatusBadge(apt.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile & Personal Info */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#EFEBE4] rounded p-8 max-w-xl">
          <div className="border-b border-[#EFEBE4] pb-4 mb-6">
            <h2 className="font-serif text-2xl text-[#1A1918]">Personal Details</h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Keep your contact information updated for automated appointment updates.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DFD7CB] rounded text-sm text-stone-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-stone-400 font-light mt-0.5 block">
                Email address serves as your unique membership ID and cannot be modified directly.
              </span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors shadow-sm"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded max-w-lg w-full p-6 space-y-5 animate-scale-up shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#EFEBE4] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#9D8159] font-semibold">
                  Reschedule Session
                </span>
                <h3 className="font-serif text-xl text-[#1A1918]">
                  {rescheduleApt.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setRescheduleApt(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Select New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  min={todayStr}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1 font-medium">
                  Select New Time Slot
                </label>
                {loadingSlots ? (
                  <div className="py-4 text-center text-xs text-stone-400">Loading open slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-3 bg-white border border-dashed border-[#DFD7CB] text-center text-xs text-stone-500 rounded">
                    No open slots on this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewSlot(slot)}
                        className={`py-2 text-xs rounded border tabular-nums transition-all ${
                          newSlot === slot
                            ? 'bg-[#1A1918] text-[#FAF8F5] border-[#1A1918] font-semibold'
                            : 'bg-white text-stone-800 border-[#DFD7CB] hover:border-[#C5A880]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#EFEBE4] flex justify-end gap-3">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-[#1A1918]"
              >
                Dismiss
              </button>
              <button
                disabled={savingReschedule || !newSlot}
                onClick={handleConfirmReschedule}
                className="px-5 py-2 bg-[#1A1918] disabled:bg-stone-300 text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded"
              >
                {savingReschedule ? 'Rescheduling...' : 'Confirm New Time'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelApt && (
        <div className="fixed inset-0 z-50 bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded max-w-md w-full p-6 space-y-4 animate-scale-up shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-xl text-[#1A1918]">Confirm Cancellation</h3>
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Are you sure you wish to cancel reservation{' '}
              <strong>{cancelApt.appointmentNumber}</strong> ({cancelApt.serviceName} on {cancelApt.appointmentDate} at {cancelApt.appointmentTime})? This slot will immediately become available to other guests.
            </p>
            <div className="pt-3 border-t border-[#EFEBE4] flex justify-end gap-3">
              <button
                onClick={() => setCancelApt(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-[#1A1918]"
              >
                Keep Appointment
              </button>
              <button
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold rounded"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
