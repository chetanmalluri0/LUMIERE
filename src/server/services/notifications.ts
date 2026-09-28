import { Appointment, NotificationTemplate, SalonSettings } from '../../types/index.ts';
import { db } from '../db/db.ts';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface WhatsAppPayload {
  to: string;
  text: string;
}

/**
 * Generate luxury branded HTML email template for LUMIÈRE Beauty Studio
 */
export function generateEmailHtml(
  template: NotificationTemplate,
  appointment: Appointment,
  settings: SalonSettings
): { subject: string; html: string } {
  let title = 'Appointment Request Received';
  let subject = `Your appointment request [${appointment.appointmentNumber}] - LUMIÈRE`;
  let leadText = 'We have received your appointment request at LUMIÈRE Beauty Studio. Our atelier concierge is reviewing availability and will confirm shortly.';
  let badgeText = 'Request Pending';
  let badgeColor = '#9D8159';

  switch (template) {
    case 'NEW_BOOKING':
      title = 'Appointment Request Received';
      subject = `Request Received: ${appointment.serviceName} [${appointment.appointmentNumber}]`;
      leadText = 'Thank you for choosing LUMIÈRE. Your reservation request has been registered in our atelier schedule.';
      badgeText = 'Pending Confirmation';
      badgeColor = '#9D8159';
      break;

    case 'BOOKING_CONFIRMED':
      title = 'Your Reservation is Confirmed';
      subject = `Confirmed: ${appointment.serviceName} at LUMIÈRE [${appointment.appointmentNumber}]`;
      leadText = `We are delighted to confirm your bespoke session with ${appointment.staffName}. We look forward to welcoming you to our sanctuary.`;
      badgeText = 'Confirmed';
      badgeColor = '#2E7D32';
      break;

    case 'BOOKING_CANCELLED':
      title = 'Appointment Cancellation';
      subject = `Cancelled: Appointment [${appointment.appointmentNumber}] - LUMIÈRE`;
      leadText = 'Your appointment has been cancelled as requested. Any pre-consultation notes have been preserved for your next visit.';
      badgeText = 'Cancelled';
      badgeColor = '#C62828';
      break;

    case 'BOOKING_RESCHEDULED':
      title = 'Appointment Rescheduled';
      subject = `Rescheduled: ${appointment.serviceName} [${appointment.appointmentNumber}]`;
      leadText = 'Your appointment schedule has been successfully updated. Your refined reservation details are outlined below.';
      badgeText = 'Rescheduled';
      badgeColor = '#1565C0';
      break;

    case 'APPOINTMENT_REMINDER':
      title = 'Appointment Reminder';
      subject = `Reminder: Your session tomorrow at LUMIÈRE [${appointment.appointmentNumber}]`;
      leadText = `This is a gentle reminder of your upcoming session tomorrow with ${appointment.staffName}. Please arrive 10 minutes early to enjoy our welcome botanical tea.`;
      badgeText = 'Upcoming';
      badgeColor = '#9D8159';
      break;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; color: #1A1918; margin: 0; padding: 40px 10px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EFEBE4; border-radius: 4px; overflow: hidden; }
    .header { background-color: #1A1918; color: #FAF8F5; text-align: center; padding: 44px 20px 36px; border-bottom: 2px solid #C5A880; }
    .brand-title { font-family: 'Georgia', serif; font-size: 26px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; font-weight: 300; }
    .brand-tagline { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #C5A880; margin-top: 8px; }
    .content { padding: 40px 32px; }
    .badge { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: ${badgeColor}; font-weight: 600; margin-bottom: 16px; }
    .headline { font-family: 'Georgia', serif; font-size: 24px; color: #1A1918; margin: 0 0 16px; font-weight: 400; line-height: 1.3; }
    .lead { font-size: 14px; line-height: 1.6; color: #55524E; margin: 0 0 32px; }
    .details-box { background-color: #FAF8F5; border: 1px solid #EFEBE4; padding: 24px; margin-bottom: 32px; }
    .detail-row { display: flex; justify-content: space-between; border-bottom: 1px solid #EFEBE4; padding: 10px 0; font-size: 13px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #8C827A; text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; }
    .detail-value { font-weight: 600; color: #1A1918; text-align: right; }
    .cta-container { text-align: center; margin: 36px 0 16px; }
    .cta-btn { display: inline-block; background-color: #1A1918; color: #FAF8F5; padding: 14px 28px; text-decoration: none; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
    .footer { background-color: #FAF8F5; border-top: 1px solid #EFEBE4; padding: 28px 32px; font-size: 12px; color: #8C827A; text-align: center; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">LUMIÈRE</h1>
      <div class="brand-tagline">Where Beauty Meets Precision</div>
    </div>
    <div class="content">
      <div class="badge">${badgeText}</div>
      <h2 class="headline">${title}</h2>
      <p class="lead">${leadText}</p>
      
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Reservation ID</span>
          <span class="detail-value">${appointment.appointmentNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${appointment.serviceName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Specialist</span>
          <span class="detail-value">${appointment.staffName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-value">${appointment.appointmentDate} at ${appointment.appointmentTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${appointment.durationMinutes} Minutes</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Amount</span>
          <span class="detail-value">₹${appointment.servicePrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div class="cta-container">
        <a href="${process.env.APP_URL || 'https://lumierebeauty.com'}" class="cta-btn">View Reservation Portal</a>
      </div>
    </div>
    <div class="footer">
      <strong>${settings.salonName}</strong><br>
      ${settings.address}<br>
      Concierge Desk: ${settings.salonPhone} · WhatsApp: ${settings.whatsappNumber}<br>
      Operating Hours: ${settings.businessHours}
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

/**
 * Format WhatsApp notification message
 */
export function formatWhatsAppMessage(
  recipient: 'CUSTOMER' | 'SALON',
  appointment: Appointment,
  settings: SalonSettings
): string {
  if (recipient === 'SALON') {
    return `🔔 *NEW BOOKING RECEIVED - LUMIÈRE*\n\n` +
      `*ID:* ${appointment.appointmentNumber}\n` +
      `*Customer:* ${appointment.customerName}\n` +
      `*Phone:* ${appointment.customerPhone}\n` +
      `*Email:* ${appointment.customerEmail}\n` +
      `*Service:* ${appointment.serviceName}\n` +
      `*Specialist:* ${appointment.staffName}\n` +
      `*Date:* ${appointment.appointmentDate}\n` +
      `*Time:* ${appointment.appointmentTime}\n` +
      `*Amount:* ₹${appointment.servicePrice.toLocaleString('en-IN')}\n` +
      (appointment.notes ? `*Notes:* ${appointment.notes}\n\n` : `\n`) +
      `👉 Manage in Admin Portal.`;
  }

  return `✨ *LUMIÈRE Beauty Studio - Reservation Update*\n\n` +
    `Dear ${appointment.customerName},\n` +
    `Your appointment request has been recorded.\n\n` +
    `*Reservation ID:* ${appointment.appointmentNumber}\n` +
    `*Service:* ${appointment.serviceName}\n` +
    `*Specialist:* ${appointment.staffName}\n` +
    `*Date:* ${appointment.appointmentDate}\n` +
    `*Time:* ${appointment.appointmentTime}\n` +
    `*Status:* ${appointment.status}\n\n` +
    `Studio Location: ${settings.address}\n` +
    `Concierge: ${settings.salonPhone}\n\n` +
    `We look forward to curating your experience.`;
}

/**
 * Dispatches both customer and salon notifications on booking creation or status change
 */
export async function dispatchAppointmentNotifications(
  template: NotificationTemplate,
  appointment: Appointment
): Promise<void> {
  const settings = db.getSettings();

  // 1. Customer Email
  if (settings.notifyCustomerOnBook && appointment.customerEmail) {
    const { subject, html } = generateEmailHtml(template, appointment, settings);

    db.createNotification({
      recipientType: 'CUSTOMER',
      recipientEmail: appointment.customerEmail,
      recipientPhone: appointment.customerPhone,
      channel: 'EMAIL',
      template,
      subject,
      content: `Email template dispatched for ${appointment.appointmentNumber} (${template})`,
      appointmentNumber: appointment.appointmentNumber,
      status: 'SENT',
    });
  }

  // 2. Salon Admin Notification (WhatsApp & Email alert)
  if (settings.notifySalonOnBook) {
    const salonWhatsAppMsg = formatWhatsAppMessage('SALON', appointment, settings);

    db.createNotification({
      recipientType: 'SALON_ADMIN',
      recipientEmail: settings.salonEmail,
      recipientPhone: settings.whatsappNumber,
      channel: 'WHATSAPP',
      template,
      subject: `Salon WhatsApp Alert: ${appointment.appointmentNumber}`,
      content: salonWhatsAppMsg,
      appointmentNumber: appointment.appointmentNumber,
      status: 'SENT',
    });

    db.createNotification({
      recipientType: 'SALON_ADMIN',
      recipientEmail: settings.salonEmail,
      recipientPhone: settings.salonPhone,
      channel: 'EMAIL',
      template,
      subject: `Atelier Alert: ${appointment.serviceName} - ${appointment.customerName}`,
      content: `New booking: Customer: ${appointment.customerName} (${appointment.customerPhone}) Service: ${appointment.serviceName}, Specialist: ${appointment.staffName}, Date: ${appointment.appointmentDate} at ${appointment.appointmentTime}. ID: ${appointment.appointmentNumber}`,
      appointmentNumber: appointment.appointmentNumber,
      status: 'SENT',
    });
  }

  // 3. Customer WhatsApp (if enabled)
  if (settings.enableWhatsAppAlerts && appointment.customerPhone) {
    const customerWhatsAppMsg = formatWhatsAppMessage('CUSTOMER', appointment, settings);
    db.createNotification({
      recipientType: 'CUSTOMER',
      recipientPhone: appointment.customerPhone,
      channel: 'WHATSAPP',
      template,
      subject: `WhatsApp confirmation: ${appointment.appointmentNumber}`,
      content: customerWhatsAppMsg,
      appointmentNumber: appointment.appointmentNumber,
      status: 'SENT',
    });
  }
}
