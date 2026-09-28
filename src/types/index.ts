export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: 'Hair' | 'Hair Care' | 'Color' | 'Treatments' | 'Skincare' | 'Nails' | 'Bridal & Luxury';
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  avatarUrl: string;
  isActive: boolean;
  daysAvailable: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  hoursStart: string; // e.g. "09:00"
  hoursEnd: string; // e.g. "19:00"
  createdAt: string;
}

export interface StaffAvailability {
  id: string;
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  appointmentNumber: string; // e.g. "LUM-10492"
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  staffId: string;
  staffName: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationChannel = 'EMAIL' | 'WHATSAPP' | 'SYSTEM';
export type NotificationTemplate =
  | 'NEW_BOOKING'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_RESCHEDULED'
  | 'APPOINTMENT_REMINDER';

export interface NotificationRecord {
  id: string;
  recipientType: 'CUSTOMER' | 'SALON_ADMIN';
  recipientEmail?: string;
  recipientPhone?: string;
  channel: NotificationChannel;
  template: NotificationTemplate;
  subject: string;
  content: string;
  appointmentNumber?: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  createdAt: string;
}

export interface SalonSettings {
  salonName: string;
  salonTagline: string;
  salonEmail: string;
  salonPhone: string;
  whatsappNumber: string;
  address: string;
  businessHours: string;
  notifyCustomerOnBook: boolean;
  notifySalonOnBook: boolean;
  enableWhatsAppAlerts: boolean;
}

export interface AdminStats {
  totalCustomers: number;
  todayAppointments: number;
  upcomingAppointments: number;
  pendingRequests: number;
  completedAppointments: number;
  cancelledAppointments: number;
  estimatedRevenue: number;
}
