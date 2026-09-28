# LUMIÈRE Beauty Studio — Architecture & Deployment Guide

This full-stack application is engineered for **LUMIÈRE Beauty Studio** ("Where Beauty Meets Precision").

---

## 1. System Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons.
- **Backend**: Node.js & Express (`server.ts`) with custom REST APIs (`/api/*`).
- **Database**: Relational SQL Architecture (PostgreSQL DDL schema + Prisma ORM schema + persistent database engine).
- **Authentication**: Role-based access control (`CUSTOMER`, `ADMIN`) with salted password hashing (bcrypt) and cryptographic JWT session tokens.
- **Booking Engine**: Multi-step interactive booking system with real-time double-booking prevention, unique reference codes (`LUM-XXXXXX`), and status lifecycle controls.
- **Notification Layer**: Branded transactional HTML email templates and WhatsApp Cloud API notification dispatchers.
- **Administration Suite**: Real-time metrics, appointment management, customer dossiers, service menu management, specialist faculty configuration, and settings.

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Local and production port | `3000` |
| `JWT_SECRET` | Secret key for signing session tokens | `lumiere_super_secret_jwt_key_2026_production` |
| `ADMIN_EMAIL` | Default administrator account | `admin@lumierebeauty.com` |
| `ADMIN_PASSWORD` | Default administrator password | `admin123456` |
| `SALON_NAME` | Display name of the salon | `LUMIÈRE Beauty Studio` |
| `SALON_TAGLINE` | Brand tagline | `Where Beauty Meets Precision.` |
| `SALON_EMAIL` | Concierge email address | `concierge@lumierebeauty.com` |
| `SALON_PHONE` | Studio phone number | `+919876543210` |
| `SALON_WHATSAPP` | Salon WhatsApp concierge number | `+919876543210` |
| `SALON_ADDRESS` | Physical atelier address | `74 Lavelle Road, Richmond Town, Bengaluru, KA 560001` |
| `SALON_HOURS` | Studio operating schedule | `09:00 - 20:00 Daily` |
| `RESEND_API_KEY` | Transactional email provider API key | `re_sample_api_key_production` |
| `EMAIL_FROM` | Dispatcher email header | `LUMIÈRE <bookings@lumierebeauty.com>` |
| `WHATSAPP_CLOUD_API_TOKEN` | Meta WhatsApp Cloud API access token | `wa_token_sample` |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business Account phone number ID | `wa_phone_id_sample` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/lumiere_db?schema=public` |

---

## 3. Database Schema & Migration Setup

### Relational SQL DDL
The full PostgreSQL DDL is defined in `src/server/db/schema.sql` covering:
- `users`: Registered customers, hashed credentials, contact telephone.
- `admins`: Privileged studio directors.
- `services`: 10 bespoke hair, skincare, and bridal rituals.
- `staff`: 5 specialist faculty profiles.
- `staff_availability`: Specialist working hours and days.
- `appointments`: Real-time booking records with status controls.
- `notifications`: Audit log of all dispatched emails and WhatsApp messages.
- `settings`: Atelier configuration.

### Prisma Migration Commands
When deploying to a PostgreSQL instance (e.g. Supabase, Neon, Cloud SQL):
```bash
# Install Prisma CLI
npm install -D prisma @prisma/client

# Generate Prisma Client
npx prisma generate

# Run migrations to provision tables
npx prisma migrate dev --name init_lumiere_tables

# Push schema directly to database (optional)
npx prisma db push
```

---

## 4. Local Development

Start the full-stack development server (Express + Vite HMR on Port 3000):

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 5. Seed Data & Default Credentials

The system seeds the database automatically upon first initialization:

### Administrative Account
- **URL**: `/#admin-login`
- **Email**: `admin@lumierebeauty.com`
- **Password**: `admin123456`
- **Role**: `ADMIN`

### Demo Customer Account
- **URL**: `/#customer-login`
- **Email**: `ananya.deshmukh@example.com`
- **Password**: `customer123`
- **Role**: `CUSTOMER`

---

## 6. WhatsApp & Email Integration Workflow

1. **Customer Booking**: Customer selects service, specialist, date, and open slot.
2. **Double Booking Guard**: The backend validates that neither the specialist nor slot is reserved.
3. **Database Insertion**: Unique reference `LUM-XXXXXX` generated and stored with status `Pending`.
4. **Dispatch Queue**:
   - Customer receives branded HTML email (`NEW_BOOKING`).
   - Salon receives real-time WhatsApp alert formatted with customer name, phone, service, specialist, and timestamp.
   - Salon concierge clicks confirmation in Admin Suite $\to$ triggers `BOOKING_CONFIRMED` email to customer.
5. **Inspection & Previews**:
   - Navigate to **Admin Dashboard $\to$ Dispatch Log** or click **Email & WhatsApp Previews** to inspect and test all 5 branded transactional HTML templates live.

---

## 7. Production Deployment (Vercel / Cloud Run)

### Vercel Deployment:
1. Connect repository in Vercel dashboard.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variables in Project Settings.

### Container / Cloud Run Deployment:
```bash
# Build production bundle
npm run build

# Start production server
npm start
```
