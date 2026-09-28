import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  AdminUser,
  Service,
  Staff,
  Appointment,
  NotificationRecord,
  SalonSettings,
  AdminStats,
} from '../../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseData {
  users: (User & { passwordHash: string })[];
  admins: (AdminUser & { passwordHash: string })[];
  services: Service[];
  staff: Staff[];
  appointments: Appointment[];
  notifications: NotificationRecord[];
  settings: SalonSettings;
}

class Database {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('Error reading database file, initializing fresh database:', err);
    }

    const initial = this.seedInitialData();
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave: DatabaseData = this.data): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private seedInitialData(): DatabaseData {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123456', salt);
    const demoCustomerPasswordHash = bcrypt.hashSync('customer123', salt);

    // 10 Real Services from brief
    const services: Service[] = [
      {
        id: 'srv-01',
        name: 'Haircut',
        description: 'Bespoke precision haircut including personal consultation, luxury hair bath, scalp massage, and bespoke blow-dry styling.',
        durationMinutes: 45,
        price: 799,
        category: 'Hair',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-02',
        name: 'Hair Styling',
        description: 'Artisanal styling for high-profile galas, red carpet events, and special occasions. Tailored thermal waves, sleek structural looks, or editorial finishes.',
        durationMinutes: 45,
        price: 999,
        category: 'Hair',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-03',
        name: 'Hair Spa',
        description: 'Deep revitalizing scalp and hair mask treatment infused with botanical keratin, essential amino acids, and warm steam infusion.',
        durationMinutes: 60,
        price: 1499,
        category: 'Hair Care',
        imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-04',
        name: 'Hair Coloring',
        description: 'Dimensional balayage, French gloss tinting, soft root melts, and bespoke highlights curated to harmonise with skin undertones.',
        durationMinutes: 120,
        price: 2999,
        category: 'Color',
        imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-05',
        name: 'Keratin Treatment',
        description: 'Intense smoothing complex providing radiant glass shine, anti-humidity seal, and frizz elimination lasting up to 16 weeks.',
        durationMinutes: 150,
        price: 3999,
        category: 'Treatments',
        imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-06',
        name: 'Facial',
        description: 'Signature multi-acid exfoliation, peptide ultrasound infusion, lymphatic drainage massage, and deeply restorative algae mask.',
        durationMinutes: 60,
        price: 1499,
        category: 'Skincare',
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-07',
        name: 'Cleanup',
        description: 'Express clarifying facial purifying pores, gently lifting surface congestion, and rehydrating with pure hyaluronic botanical essence.',
        durationMinutes: 30,
        price: 799,
        category: 'Skincare',
        imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f02e6a0d4c8?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-08',
        name: 'Manicure',
        description: 'Deluxe cuticle refinement, organic shea butter exfoliation, relaxing hand massage, and flawless gel polish application.',
        durationMinutes: 40,
        price: 699,
        category: 'Nails',
        imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-09',
        name: 'Pedicure',
        description: 'Aromatic foot soak, mineral salt scrub, restorative callus care, deep moisturizing mask, and high-shine precision polish.',
        durationMinutes: 50,
        price: 899,
        category: 'Nails',
        imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'srv-10',
        name: 'Bridal Makeup',
        description: 'Haute couture bridal artistry featuring skin prep with 24K gold serum, HD airbrush foundation, precision eye sculpting, and veil placement.',
        durationMinutes: 180,
        price: 7999,
        category: 'Bridal & Luxury',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        createdAt: '2026-01-01T10:00:00.000Z',
      },
    ];

    // 5 Staff members from brief
    const staff: Staff[] = [
      {
        id: 'staff-01',
        name: 'Claire Fontaine',
        title: 'Master Stylist & Creative Director',
        bio: 'Trained at the Académie de Coiffure in Paris with 14 years shaping editorial runways and defining modern haircutting silhouettes.',
        email: 'claire@lumierebeauty.com',
        phone: '+919876543201',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isActive: true,
        daysAvailable: [1, 2, 3, 4, 5, 6],
        hoursStart: '09:00',
        hoursEnd: '18:00',
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'staff-02',
        name: 'Maya Sharma',
        title: 'Senior Colorist & Hair Architect',
        bio: 'Specialist in custom balayage, corrective toning, and seamless dimensional highlights tailored to natural facial contours.',
        email: 'maya@lumierebeauty.com',
        phone: '+919876543202',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        isActive: true,
        daysAvailable: [1, 2, 3, 4, 5, 6],
        hoursStart: '10:00',
        hoursEnd: '19:00',
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'staff-03',
        name: 'Elena Rostova',
        title: 'Lead Aesthetician & Skin Therapist',
        bio: 'Dermatological skincare specialist certified in cellular rejuvenation, chemical peeling, and clinical facial therapy.',
        email: 'elena@lumierebeauty.com',
        phone: '+919876543203',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        isActive: true,
        daysAvailable: [0, 2, 3, 4, 5, 6],
        hoursStart: '09:30',
        hoursEnd: '18:30',
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'staff-04',
        name: 'Aisha Patel',
        title: 'Senior Nail Artist & Spa Specialist',
        bio: 'Precision manicure and pedicure artisan renowned for architectural nail shaping, Russian manicures, and botanical spa rituals.',
        email: 'aisha@lumierebeauty.com',
        phone: '+919876543204',
        avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
        isActive: true,
        daysAvailable: [1, 2, 4, 5, 6, 0],
        hoursStart: '10:00',
        hoursEnd: '20:00',
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: 'staff-05',
        name: 'Marcus Vance',
        title: 'Bridal Specialist & Master Artistry Lead',
        bio: 'Celebrity bridal makeup artist crafting timeless radiant complexions that photograph flawlessly in natural daylight and grand ballroom fixtures.',
        email: 'marcus@lumierebeauty.com',
        phone: '+919876543205',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        isActive: true,
        daysAvailable: [1, 3, 4, 5, 6, 0],
        hoursStart: '09:00',
        hoursEnd: '19:00',
        createdAt: '2026-01-01T10:00:00.000Z',
      },
    ];

    // 20 Demo Customers
    const customersData = [
      { name: 'Ananya Deshmukh', email: 'ananya.deshmukh@example.com', phone: '+919820112233' },
      { name: 'Rohan Mehra', email: 'rohan.mehra@example.com', phone: '+919820223344' },
      { name: 'Priya Sundaram', email: 'priya.sundaram@example.com', phone: '+919820334455' },
      { name: 'Aditya Kapoor', email: 'aditya.kapoor@example.com', phone: '+919820445566' },
      { name: 'Zoya Khan', email: 'zoya.khan@example.com', phone: '+919820556677' },
      { name: 'Vikramaditya Roy', email: 'vikram.roy@example.com', phone: '+919820667788' },
      { name: 'Natasha Singhal', email: 'natasha.singhal@example.com', phone: '+919820778899' },
      { name: 'Kavita Menon', email: 'kavita.menon@example.com', phone: '+919820889900' },
      { name: 'Devika Banerjee', email: 'devika.banerjee@example.com', phone: '+919820990011' },
      { name: 'Arjun Nambiar', email: 'arjun.nambiar@example.com', phone: '+919821001122' },
      { name: 'Tara Sethi', email: 'tara.sethi@example.com', phone: '+919821112233' },
      { name: 'Kabir Oberoi', email: 'kabir.oberoi@example.com', phone: '+919821223344' },
      { name: 'Sanya Malhotra', email: 'sanya.malhotra@example.com', phone: '+919821334455' },
      { name: 'Nikhil Kashyap', email: 'nikhil.kashyap@example.com', phone: '+919821445566' },
      { name: 'Rhea Chakraborty', email: 'rhea.c@example.com', phone: '+919821556677' },
      { name: 'Ishaan Verma', email: 'ishaan.verma@example.com', phone: '+919821667788' },
      { name: 'Mira Sengupta', email: 'mira.sengupta@example.com', phone: '+919821778899' },
      { name: 'Siddharth Varma', email: 'siddharth.v@example.com', phone: '+919821889900' },
      { name: 'Tanvi Agarwal', email: 'tanvi.agarwal@example.com', phone: '+919821990011' },
      { name: 'Pooja Hegde', email: 'pooja.hegde@example.com', phone: '+919822001122' },
    ];

    const users: (User & { passwordHash: string })[] = customersData.map((c, i) => ({
      id: `usr-${String(i + 1).padStart(2, '0')}`,
      email: c.email,
      fullName: c.name,
      phone: c.phone,
      passwordHash: demoCustomerPasswordHash,
      role: 'CUSTOMER',
      createdAt: '2026-01-10T08:00:00.000Z',
      updatedAt: '2026-01-10T08:00:00.000Z',
    }));

    // Admin user
    const admins: (AdminUser & { passwordHash: string })[] = [
      {
        id: 'adm-01',
        email: process.env.ADMIN_EMAIL || 'admin@lumierebeauty.com',
        fullName: 'LUMIÈRE Atelier Management',
        role: 'ADMIN',
        passwordHash: adminPasswordHash,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    // 30 Sample Appointments
    const appointments: Appointment[] = [];
    const statuses: Appointment['status'][] = [
      'Completed',
      'Completed',
      'Completed',
      'Confirmed',
      'Pending',
      'Cancelled',
      'Completed',
      'Confirmed',
    ];

    // Seed dates around today (September 2026)
    const baseDate = new Date('2026-09-28T09:00:00.000Z');
    const timeSlots = ['09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'];

    for (let i = 0; i < 30; i++) {
      const dayOffset = (i % 15) - 7; // -7 to +7 days
      const appointmentDateObj = new Date(baseDate);
      appointmentDateObj.setDate(appointmentDateObj.getDate() + dayOffset);
      const appointmentDate = appointmentDateObj.toISOString().split('T')[0];

      const user = users[i % users.length];
      const service = services[i % services.length];
      const staffMember = staff[i % staff.length];
      const timeSlot = timeSlots[i % timeSlots.length];
      const isPast = dayOffset < 0;
      const isToday = dayOffset === 0;

      let status: Appointment['status'] = 'Confirmed';
      if (isPast) {
        status = i % 5 === 0 ? 'Cancelled' : i % 7 === 0 ? 'No Show' : 'Completed';
      } else if (isToday) {
        status = i % 3 === 0 ? 'Pending' : 'Confirmed';
      } else {
        status = i % 4 === 0 ? 'Pending' : 'Confirmed';
      }

      appointments.push({
        id: `apt-${String(i + 1).padStart(3, '0')}`,
        appointmentNumber: `LUM-${10000 + i * 47}`,
        customerId: user.id,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        staffId: staffMember.id,
        staffName: staffMember.name,
        appointmentDate,
        appointmentTime: timeSlot,
        durationMinutes: service.durationMinutes,
        status,
        notes: i % 3 === 0 ? 'Prefers gentle scalp pressure and organic lavender rinse.' : undefined,
        createdAt: new Date(Date.now() - (30 - i) * 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - (30 - i) * 3600000 * 6).toISOString(),
      });
    }

    const notifications: NotificationRecord[] = [
      {
        id: 'notif-01',
        recipientType: 'CUSTOMER',
        recipientEmail: 'ananya.deshmukh@example.com',
        recipientPhone: '+919820112233',
        channel: 'EMAIL',
        template: 'BOOKING_CONFIRMED',
        subject: 'Confirmed: Bespoke Hair Spa at LUMIÈRE Beauty Studio',
        content: 'Your appointment LUM-10000 has been verified and confirmed with Claire Fontaine.',
        appointmentNumber: 'LUM-10000',
        status: 'SENT',
        createdAt: '2026-09-27T10:00:00.000Z',
      },
      {
        id: 'notif-02',
        recipientType: 'SALON_ADMIN',
        recipientEmail: 'concierge@lumierebeauty.com',
        recipientPhone: '+919876543210',
        channel: 'WHATSAPP',
        template: 'NEW_BOOKING',
        subject: 'New Booking Alert: LUM-10047',
        content: 'New Booking received from Rohan Mehra for Hair Styling on 2026-09-28 at 11:00.',
        appointmentNumber: 'LUM-10047',
        status: 'SENT',
        createdAt: '2026-09-27T14:30:00.000Z',
      },
    ];

    const settings: SalonSettings = {
      salonName: process.env.SALON_NAME || 'LUMIÈRE Beauty Studio',
      salonTagline: process.env.SALON_TAGLINE || 'Where Beauty Meets Precision.',
      salonEmail: process.env.SALON_EMAIL || 'concierge@lumierebeauty.com',
      salonPhone: process.env.SALON_PHONE || '+919876543210',
      whatsappNumber: process.env.SALON_WHATSAPP || '+919876543210',
      address: process.env.SALON_ADDRESS || '74 Lavelle Road, Richmond Town, Bengaluru, KA 560001',
      businessHours: process.env.SALON_HOURS || '09:00 - 20:00 Daily',
      notifyCustomerOnBook: true,
      notifySalonOnBook: true,
      enableWhatsAppAlerts: true,
    };

    return {
      users,
      admins,
      services,
      staff,
      appointments,
      notifications,
      settings,
    };
  }

  // User Operations
  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public createUser(userData: { email: string; password: string; fullName: string; phone: string }) {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('A customer with this email address is already registered.');
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password, salt);
    const id = `usr-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newUser = {
      id,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone,
      passwordHash,
      role: 'CUSTOMER' as const,
      createdAt: now,
      updatedAt: now,
    };

    this.data.users.push(newUser);
    this.persist();
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  public updateUser(id: string, updates: Partial<Pick<User, 'fullName' | 'phone'>>) {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Customer not found');

    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    const { passwordHash: _, ...safeUser } = this.data.users[index];
    return safeUser;
  }

  public getAllCustomers() {
    return this.data.users.map(({ passwordHash, ...safeUser }) => safeUser);
  }

  // Admin Operations
  public findAdminByEmail(email: string) {
    return this.data.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  // Services Operations
  public getServices(onlyActive = true) {
    if (onlyActive) {
      return this.data.services.filter((s) => s.isActive);
    }
    return this.data.services;
  }

  public getServiceById(id: string) {
    return this.data.services.find((s) => s.id === id);
  }

  public createService(serviceData: Omit<Service, 'id' | 'createdAt'>) {
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.services.push(newService);
    this.persist();
    return newService;
  }

  public updateService(id: string, updates: Partial<Omit<Service, 'id' | 'createdAt'>>) {
    const index = this.data.services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Service not found');
    this.data.services[index] = {
      ...this.data.services[index],
      ...updates,
    };
    this.persist();
    return this.data.services[index];
  }

  public deleteService(id: string) {
    const index = this.data.services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Service not found');
    this.data.services.splice(index, 1);
    this.persist();
    return true;
  }

  // Staff Operations
  public getStaff(onlyActive = true) {
    if (onlyActive) {
      return this.data.staff.filter((s) => s.isActive);
    }
    return this.data.staff;
  }

  public getStaffById(id: string) {
    return this.data.staff.find((s) => s.id === id);
  }

  public createStaff(staffData: Omit<Staff, 'id' | 'createdAt'>) {
    const newStaff: Staff = {
      ...staffData,
      id: `staff-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.staff.push(newStaff);
    this.persist();
    return newStaff;
  }

  public updateStaff(id: string, updates: Partial<Omit<Staff, 'id' | 'createdAt'>>) {
    const index = this.data.staff.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Staff member not found');
    this.data.staff[index] = {
      ...this.data.staff[index],
      ...updates,
    };
    this.persist();
    return this.data.staff[index];
  }

  // Appointments & Slot Availability Operations
  public getAvailableSlots(date: string, staffId?: string, durationMinutes = 45): string[] {
    const allSlots = ['09:00', '09:45', '10:30', '11:15', '12:00', '13:30', '14:15', '15:00', '15:45', '16:30', '17:15', '18:00', '18:45'];

    // If specific staff selected, check their day availability
    if (staffId && staffId !== 'any') {
      const staffMember = this.getStaffById(staffId);
      if (staffMember) {
        const dateObj = new Date(`${date}T12:00:00Z`);
        const dayOfWeek = dateObj.getUTCDay();
        if (!staffMember.daysAvailable.includes(dayOfWeek)) {
          return []; // Staff is off on this day
        }
      }
    }

    // Get active appointments for this date (excluding Cancelled)
    const bookedAppointments = this.data.appointments.filter(
      (a) => a.appointmentDate === date && a.status !== 'Cancelled'
    );

    // Filter slots that are booked for the specified staff (or if staff is selected)
    const available = allSlots.filter((slot) => {
      if (staffId && staffId !== 'any') {
        const isStaffBooked = bookedAppointments.some(
          (a) => a.staffId === staffId && a.appointmentTime === slot
        );
        return !isStaffBooked;
      } else {
        // If "any", slot is available if at least one active staff member is free
        const activeStaff = this.getStaff(true);
        const bookedCount = bookedAppointments.filter((a) => a.appointmentTime === slot).length;
        return bookedCount < activeStaff.length;
      }
    });

    return available;
  }

  public createAppointment(params: {
    customerId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceId: string;
    staffId: string;
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
  }): Appointment {
    const service = this.getServiceById(params.serviceId);
    if (!service) throw new Error('Selected service not found.');

    let assignedStaff = this.getStaffById(params.staffId);
    if (!assignedStaff) {
      // Pick first available staff
      const activeStaff = this.getStaff(true);
      const bookedOnSlot = this.data.appointments
        .filter(
          (a) =>
            a.appointmentDate === params.appointmentDate &&
            a.appointmentTime === params.appointmentTime &&
            a.status !== 'Cancelled'
        )
        .map((a) => a.staffId);
      assignedStaff = activeStaff.find((s) => !bookedOnSlot.includes(s.id)) || activeStaff[0];
    }

    // Double-booking prevention check
    const doubleBooked = this.data.appointments.some(
      (a) =>
        a.staffId === assignedStaff!.id &&
        a.appointmentDate === params.appointmentDate &&
        a.appointmentTime === params.appointmentTime &&
        a.status !== 'Cancelled'
    );

    if (doubleBooked) {
      throw new Error('This time slot has just been reserved. Please select another slot.');
    }

    const uniqueNum = `LUM-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString(36)}`,
      appointmentNumber: uniqueNum,
      customerId: params.customerId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      staffId: assignedStaff.id,
      staffName: assignedStaff.name,
      appointmentDate: params.appointmentDate,
      appointmentTime: params.appointmentTime,
      durationMinutes: service.durationMinutes,
      status: 'Pending',
      notes: params.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.data.appointments.unshift(newAppointment);
    this.persist();
    return newAppointment;
  }

  public getAppointments(filters?: {
    customerId?: string;
    status?: string;
    date?: string;
    search?: string;
    serviceId?: string;
  }) {
    let result = [...this.data.appointments];

    if (filters?.customerId) {
      result = result.filter(
        (a) =>
          a.customerId === filters.customerId ||
          a.customerEmail.toLowerCase() === filters.customerId?.toLowerCase()
      );
    }
    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters?.serviceId && filters.serviceId !== 'ALL') {
      result = result.filter((a) => a.serviceId === filters.serviceId);
    }
    if (filters?.date) {
      result = result.filter((a) => a.appointmentDate === filters.date);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.appointmentNumber.toLowerCase().includes(q) ||
          a.customerName.toLowerCase().includes(q) ||
          a.customerEmail.toLowerCase().includes(q) ||
          a.customerPhone.includes(q) ||
          a.serviceName.toLowerCase().includes(q) ||
          a.staffName.toLowerCase().includes(q)
      );
    }

    // Sort by date and time descending
    result.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
      return dateB.getTime() - dateA.getTime();
    });

    return result;
  }

  public getAppointmentById(id: string) {
    return this.data.appointments.find((a) => a.id === id || a.appointmentNumber === id);
  }

  public updateAppointmentStatus(id: string, status: Appointment['status']) {
    const index = this.data.appointments.findIndex((a) => a.id === id || a.appointmentNumber === id);
    if (index === -1) throw new Error('Appointment not found');

    this.data.appointments[index].status = status;
    this.data.appointments[index].updatedAt = new Date().toISOString();
    this.persist();
    return this.data.appointments[index];
  }

  public rescheduleAppointment(id: string, newDate: string, newTime: string) {
    const apt = this.getAppointmentById(id);
    if (!apt) throw new Error('Appointment not found');

    // Prevent double booking check
    const doubleBooked = this.data.appointments.some(
      (a) =>
        a.id !== apt.id &&
        a.staffId === apt.staffId &&
        a.appointmentDate === newDate &&
        a.appointmentTime === newTime &&
        a.status !== 'Cancelled'
    );

    if (doubleBooked) {
      throw new Error('This time slot is already booked for this specialist.');
    }

    const index = this.data.appointments.findIndex((a) => a.id === apt.id);
    this.data.appointments[index].appointmentDate = newDate;
    this.data.appointments[index].appointmentTime = newTime;
    this.data.appointments[index].status = 'Confirmed';
    this.data.appointments[index].updatedAt = new Date().toISOString();
    this.persist();
    return this.data.appointments[index];
  }

  // Notifications Operations
  public createNotification(record: Omit<NotificationRecord, 'id' | 'createdAt'>) {
    const newNotif: NotificationRecord = {
      ...record,
      id: `notif-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    this.persist();
    return newNotif;
  }

  public getNotifications(limit = 50) {
    return this.data.notifications.slice(0, limit);
  }

  // Settings Operations
  public getSettings(): SalonSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SalonSettings>): SalonSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.persist();
    return this.data.settings;
  }

  // Admin Analytics & Metrics
  public getAdminStats(): AdminStats {
    const appointments = this.data.appointments;
    const todayStr = new Date().toISOString().split('T')[0];

    const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr).length;
    const upcomingAppointments = appointments.filter(
      (a) => a.appointmentDate >= todayStr && (a.status === 'Confirmed' || a.status === 'Pending')
    ).length;
    const pendingRequests = appointments.filter((a) => a.status === 'Pending').length;
    const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
    const cancelledAppointments = appointments.filter(
      (a) => a.status === 'Cancelled' || a.status === 'No Show'
    ).length;

    const estimatedRevenue = appointments
      .filter((a) => a.status === 'Completed' || a.status === 'Confirmed')
      .reduce((sum, a) => sum + (Number(a.servicePrice) || 0), 0);

    return {
      totalCustomers: this.data.users.length,
      todayAppointments,
      upcomingAppointments,
      pendingRequests,
      completedAppointments,
      cancelledAppointments,
      estimatedRevenue,
    };
  }
}

export const db = new Database();
