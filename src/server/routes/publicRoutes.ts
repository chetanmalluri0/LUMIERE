import { Router, Response } from 'express';
import { db } from '../db/db.ts';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { dispatchAppointmentNotifications } from '../services/notifications.ts';

export const publicRouter = Router();

// Services List
publicRouter.get('/services', (_req, res) => {
  try {
    const services = db.getServices(true);
    res.json({ services });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch services.' });
  }
});

// Single Service Details
publicRouter.get('/services/:id', (req, res) => {
  try {
    const service = db.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    res.json({ service });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch service.' });
  }
});

// Staff List
publicRouter.get('/staff', (_req, res) => {
  try {
    const staff = db.getStaff(true);
    res.json({ staff });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch staff directory.' });
  }
});

// Real-time Slot Availability Check
publicRouter.get('/availability', (req, res) => {
  try {
    const { date, staffId, durationMinutes } = req.query;
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Date is required (format: YYYY-MM-DD).' });
    }

    const availableSlots = db.getAvailableSlots(
      date,
      staffId as string | undefined,
      durationMinutes ? Number(durationMinutes) : 45
    );

    res.json({
      date,
      staffId: staffId || 'any',
      availableSlots,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Availability check failed.' });
  }
});

// Create Appointment (Booking)
publicRouter.post('/appointments', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      serviceId,
      staffId,
      appointmentDate,
      appointmentTime,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = req.body;

    // Strict input validation
    if (!serviceId) return res.status(400).json({ error: 'Please select a service.' });
    if (!appointmentDate) return res.status(400).json({ error: 'Please select an appointment date.' });
    if (!appointmentTime) return res.status(400).json({ error: 'Please select an appointment time slot.' });
    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!customerEmail || !customerEmail.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!customerPhone || customerPhone.trim().length < 7) {
      return res.status(400).json({ error: 'Please enter a valid telephone number.' });
    }

    const customerId = req.user?.role === 'CUSTOMER' ? req.user.id : undefined;

    const newAppointment = db.createAppointment({
      customerId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      serviceId,
      staffId: staffId || 'any',
      appointmentDate,
      appointmentTime,
      notes: notes?.trim() || undefined,
    });

    // Dispatch background notifications
    await dispatchAppointmentNotifications('NEW_BOOKING', newAppointment);

    res.status(201).json({
      appointment: newAppointment,
      message: 'Your appointment request has been received.',
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Appointment reservation failed.' });
  }
});

// Customer Appointments (Authenticated)
publicRouter.get('/customer/appointments', requireAuth, (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== 'CUSTOMER') {
    return res.status(401).json({ error: 'Customer session required.' });
  }

  try {
    const appointments = db.getAppointments({ customerId: req.user.id });
    res.json({ appointments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch your appointments.' });
  }
});

// Customer Cancel Appointment
publicRouter.patch('/customer/appointments/:id/cancel', requireAuth, async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== 'CUSTOMER') {
    return res.status(401).json({ error: 'Customer session required.' });
  }

  try {
    const { id } = req.params;
    const apt = db.getAppointmentById(id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found.' });

    if (apt.customerId !== req.user.id && apt.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ error: 'Unauthorized to cancel this appointment.' });
    }

    if (apt.status === 'Cancelled' || apt.status === 'Completed') {
      return res.status(400).json({ error: `Cannot cancel an appointment that is already ${apt.status}.` });
    }

    const updated = db.updateAppointmentStatus(id, 'Cancelled');
    await dispatchAppointmentNotifications('BOOKING_CANCELLED', updated);

    res.json({
      appointment: updated,
      message: 'Appointment successfully cancelled.',
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Cancellation failed.' });
  }
});

// Customer Reschedule Appointment
publicRouter.post('/customer/appointments/:id/reschedule', requireAuth, async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== 'CUSTOMER') {
    return res.status(401).json({ error: 'Customer session required.' });
  }

  try {
    const { id } = req.params;
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ error: 'New appointment date and time are required.' });
    }

    const apt = db.getAppointmentById(id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found.' });

    if (apt.customerId !== req.user.id && apt.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ error: 'Unauthorized to reschedule this appointment.' });
    }

    const updated = db.rescheduleAppointment(id, date, time);
    await dispatchAppointmentNotifications('BOOKING_RESCHEDULED', updated);

    res.json({
      appointment: updated,
      message: 'Appointment rescheduled successfully.',
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Reschedule failed.' });
  }
});

// Lookup Appointment by Number (Public)
publicRouter.get('/appointments/lookup/:number', (req, res) => {
  try {
    const apt = db.getAppointmentById(req.params.number);
    if (!apt) return res.status(404).json({ error: 'Appointment reference not found.' });
    res.json({ appointment: apt });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lookup failed.' });
  }
});

// Public Salon Settings
publicRouter.get('/settings/public', (_req, res) => {
  try {
    const s = db.getSettings();
    res.json({
      settings: {
        salonName: s.salonName,
        salonTagline: s.salonTagline,
        salonEmail: s.salonEmail,
        salonPhone: s.salonPhone,
        whatsappNumber: s.whatsappNumber,
        address: s.address,
        businessHours: s.businessHours,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch atelier details.' });
  }
});
