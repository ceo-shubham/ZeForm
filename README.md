# ZeForm* — Next-Generation Form & Quiz Platform

> **Branding:** ZeForm*  
> **Main Domain:** `zeform.zenstro.space`  
> **Custom Subdomains:** `your-form.zeform.zenstro.space`  
> **Master Admin:** `ceo.shubhampathak@gmail.com`

---

## 🌟 Overview & Key Features

ZeForm* is a modern Google Forms alternative with built-in superpowers:

1. **Custom Subdomains (`your-form.zeform.zenstro.space`)**
   - Each creator can pick their own custom subdomain slug.
   - Powered by **Cloudflare Wildcard DNS** and Next.js dynamic middleware rewriting for zero-latency routing.
   - Built-in real-time subdomain availability checker.

2. **Dual-Tier Dashboards & Role-Based Access**
   - **Master Admin Portal (`ceo.shubhampathak@gmail.com`)**:
     - Exclusive access strictly reserved for the CEO email.
     - View every registered user, their emails, their sign-up dates, and activity.
     - Inspect and access any form across the entire platform.
     - Telemetry overview: total users, total forms, total responses, and Cloudflare DNS status.
   - **User Dashboard**:
     - List all previously created forms.
     - Real-time response counters.
     - 1-click ON / OFF toggle to pause or resume accepting responses.
     - Copy branded subdomain link or direct path link in 1 click.

3. **Form Status & Auto-Expiry Scheduling**
   - **Manual ON/OFF Toggle**: Pause or reopen submissions anytime.
   - **Automated Expiry Scheduler**: Set a specific Date & Time; once reached, the form automatically closes and displays a sleek closed notice.

4. **Auto-Score Quiz Engine**
   - Assign points per question.
   - Configure correct answers for multiple-choice, dropdowns, checkboxes, or text fields.
   - Automatic grading upon submission with instant score calculation.
   - Option to reveal the respondent's score immediately on the Thank You screen.

5. **Respondent Tracking & Google Sign-In Gate**
   - Toggle "Require Google Sign-in" so only verified Google accounts can submit.
   - Automatically captures respondent email and name.
   - All replies and email logs are displayed in the form creator's responses dashboard.
   - 1-click **Export to CSV**.

6. **Customizable Thank You Page**
   - Custom headline (e.g. *"Thank you for your valuable feedback!"*).
   - Custom confirmation message and instructions.
   - Score badges for auto-scored quizzes.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-secret-key"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Master Admin Email
ADMIN_EMAIL="ceo.shubhampathak@gmail.com"

# Platform Domain
NEXT_PUBLIC_MAIN_DOMAIN="zeform.zenstro.space"

# Optional: Cloudflare API for automated DNS verification
CLOUDFLARE_API_TOKEN=""
CLOUDFLARE_ZONE_ID=""
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Cloudflare Setup for Wildcard Subdomains

To enable `your-form.zeform.zenstro.space` for any user subdomain automatically:

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com) and select the `zenstro.space` domain.
2. Go to **DNS > Records** and click **Add Record**:
   - **Type:** `CNAME`
   - **Name:** `*.zeform`
   - **Target:** `zeform.zenstro.space` (or your Vercel / server CNAME)
   - **Proxy status:** `Proxied` (Orange Cloud ☁️)
   - **TTL:** `Auto`
3. Click **Save**.

Now, **ANY** user form created with slug `my-survey` will immediately resolve at `https://my-survey.zeform.zenstro.space`!

---

## 🔒 Google OAuth Setup Guide

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `https://zeform.zenstro.space`
4. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://zeform.zenstro.space/api/auth/callback/google`
5. Paste the **Client ID** and **Client Secret** into your `.env` file.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Database:** Prisma ORM with SQLite (swappable to PostgreSQL / Supabase with 1 line)
- **Authentication:** NextAuth.js (Auth.js) with Google Provider + Admin Role Gating
- **DNS & Subdomains:** Cloudflare Wildcard DNS + Next.js Edge Middleware
