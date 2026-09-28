import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/db.ts';
import { signToken, requireAdmin, AuthRequest } from '../middleware/auth.ts';
import {
  dispatchAppointmentNotifications,
  generateEmailHtml,
  formatWhatsAppMessage,
} from '../services/notifications.ts';
import { AppointmentStatus, NotificationTemplate } from '../../types/index.ts';

export const adminRouter = Router();

// Admin Login
adminRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and administrator password are required.' });
    }

    const admin = db.findAdminByEmail(email.trim());
    if (!admin) {
      return res.status(401).json({ error: 'Invalid administrative credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid administrative credentials.' });
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: 'ADMIN',
      fullName: admin.fullName,
    });

    res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
      token,
      message: 'Administrative session initialized.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed.' });
  }
});

// Admin Me
adminRouter.get('/me', requireAdmin, (req: AuthRequest, res: Response) => {
  res.json({ admin: req.user });
});

// Admin Stats
adminRouter.get('/stats', requireAdmin, (_req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch statistics.' });
  }
});

// Appointment Management - List
adminRouter.get('/appointments', requireAdmin, (req, res) => {
  try {
    const { status, date, serviceId, search } = req.query;
    const appointments = db.getAppointments({
      status: status as string,
      date: date as string,
      serviceId: serviceId as string,
      search: search as string,
    });
    res.json({ appointments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch appointments.' });
  }
});

// Appointment Status Update
adminRouter.patch('/appointments/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses: AppointmentStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid appointment status.' });
    }

    const updated = db.updateAppointmentStatus(id, status);

    // Trigger status change notifications
    let template: NotificationTemplate | null = null;
    if (status === 'Confirmed') template = 'BOOKING_CONFIRMED';
    if (status === 'Cancelled') template = 'BOOKING_CANCELLED';

    if (template) {
      await dispatchAppointmentNotifications(template, updated);
    }

    res.json({
      appointment: updated,
      message: `Appointment status updated to ${status}.`,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Status update failed.' });
  }
});

// Appointment Reschedule by Admin
adminRouter.post('/appointments/:id/reschedule', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: 'New appointment date and time slot are required.' });
    }

    const updated = db.rescheduleAppointment(id, date, time);
    await dispatchAppointmentNotifications('BOOKING_RESCHEDULED', updated);

    res.json({
      appointment: updated,
      message: 'Appointment successfully rescheduled.',
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Reschedule failed.' });
  }
});

// Customer Management
adminRouter.get('/customers', requireAdmin, (req, res) => {
  try {
    const { search } = req.query;
    let customers = db.getAllCustomers();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    // Attach appointment count to each customer
    const customersWithHistory = customers.map((c) => {
      const apts = db.getAppointments({ customerId: c.id });
      return {
        ...c,
        appointmentCount: apts.length,
        lastAppointment: apts[0] ? `${apts[0].appointmentDate} (${apts[0].serviceName})` : 'None',
      };
    });

    res.json({ customers: customersWithHistory });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch customer directory.' });
  }
});

adminRouter.get('/customers/:id/appointments', requireAdmin, (req, res) => {
  try {
    const appointments = db.getAppointments({ customerId: req.params.id });
    res.json({ appointments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch customer appointments.' });
  }
});

// Service Management
adminRouter.get('/services', requireAdmin, (_req, res) => {
  try {
    const services = db.getServices(false); // include inactive
    res.json({ services });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch services.' });
  }
});

adminRouter.post('/services', requireAdmin, (req, res) => {
  try {
    const { name, description, durationMinutes, price, category, imageUrl, isActive } = req.body;
    if (!name || !durationMinutes || !price || !category) {
      return res.status(400).json({ error: 'Name, duration, price, and category are required.' });
    }

    const newService = db.createService({
      name: name.trim(),
      description: description?.trim() || '',
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      category,
      imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      isActive: isActive !== false,
    });

    res.status(201).json({ service: newService, message: 'Service added successfully.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create service.' });
  }
});

adminRouter.put('/services/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    res.json({ service: updated, message: 'Service updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update service.' });
  }
});

adminRouter.delete('/services/:id', requireAdmin, (req, res) => {
  try {
    db.deleteService(req.params.id);
    res.json({ message: 'Service removed successfully.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to delete service.' });
  }
});

// Staff Management
adminRouter.get('/staff', requireAdmin, (_req, res) => {
  try {
    const staff = db.getStaff(false); // include inactive
    res.json({ staff });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch staff members.' });
  }
});

adminRouter.post('/staff', requireAdmin, (req, res) => {
  try {
    const { name, title, bio, email, phone, avatarUrl, isActive, daysAvailable, hoursStart, hoursEnd } = req.body;
    if (!name || !title || !email) {
      return res.status(400).json({ error: 'Name, title, and email are required.' });
    }

    const newStaff = db.createStaff({
      name: name.trim(),
      title: title.trim(),
      bio: bio?.trim() || '',
      email: email.trim(),
      phone: phone?.trim() || '',
      avatarUrl: avatarUrl?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isActive: isActive !== false,
      daysAvailable: Array.isArray(daysAvailable) ? daysAvailable : [1, 2, 3, 4, 5, 6],
      hoursStart: hoursStart || '09:00',
      hoursEnd: hoursEnd || '19:00',
    });

    res.status(201).json({ staff: newStaff, message: 'Staff member added successfully.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create staff member.' });
  }
});

adminRouter.put('/staff/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateStaff(req.params.id, req.body);
    res.json({ staff: updated, message: 'Staff member updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update staff member.' });
  }
});

// Settings Management
adminRouter.get('/settings', requireAdmin, (_req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch settings.' });
  }
});

adminRouter.put('/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ settings: updated, message: 'Atelier configuration updated.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update settings.' });
  }
});

// Notifications Log
adminRouter.get('/notifications', requireAdmin, (_req, res) => {
  try {
    const notifications = db.getNotifications(100);
    res.json({ notifications });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch notifications.' });
  }
});

// Interactive Email Template Preview Endpoint
adminRouter.post('/email-preview', requireAdmin, (req, res) => {
  try {
    const { template, appointmentId } = req.body;
    let appointment = appointmentId ? db.getAppointmentById(appointmentId) : null;

    if (!appointment) {
      const all = db.getAppointments();
      appointment = all[0];
    }

    if (!appointment) {
      return res.status(404).json({ error: 'No appointments available for preview.' });
    }

    const settings = db.getSettings();
    const emailData = generateEmailHtml(template || 'NEW_BOOKING', appointment, settings);
    const whatsappData = formatWhatsAppMessage('SALON', appointment, settings);

    res.json({
      subject: emailData.subject,
      html: emailData.html,
      whatsappText: whatsappData,
      appointment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Preview generation failed.' });
  }
});
