# ZeForm. — Modern Subdomain Form & Quiz Infrastructure

**ZeForm.** is a high-performance form and quiz platform built for businesses, educators, agencies, and communities who demand the simplicity of Google Forms paired with branded custom subdomains, automated grading, and edge-native infrastructure.

---

## 1. Executive Summary

Traditional form tools force users into awkward trade-offs: either complex enterprise tools with bloated features and pricing, or basic tools like Google Forms that burden users with long, unbranded URLs (`docs.google.com/forms/d/e/1FAIpQL...`), third-party extension dependencies for basic timers, and cluttered interfaces.

**ZeForm.** solves this by providing:
- **Dedicated Custom Subdomains:** Every form lives on its own clean, HTTPS-secured URL (e.g., `https://hackathon-2026.zeform.zenstro.space`).
- **Instant Auto-Scoring & Grading:** Educational quizzes evaluate correct answers instantly with customizable point systems and immediate feedback.
- **Intelligent Scheduled Deadlines:** Built-in auto-pause timers turn submissions off at exact timestamps without losing historical records, with 1-click manual override capabilities.
- **Edge Architecture:** Hosted globally across Cloudflare Pages edge locations with Cloudflare D1 distributed SQLite storage for lightning-fast loads and zero cold starts.
- **Verified Google Authentication:** Single-click creator access with optional Google identity verification for respondents to prevent spam and duplicate submissions.

---

## 2. Key Differences: ZeForm vs Google Forms

| Feature / Capability | Google Forms | ZeForm. |
| :--- | :--- | :--- |
| **Form URL / Branding** | Ugly, long, non-branded URL (`docs.google.com/forms/d/e/...`) | **Clean, dedicated custom subdomain** (`https://<your-slug>.zeform.zenstro.space`) |
| **Custom Domain SSL** | Not supported; locked into Google domains | **Automatic SSL certificate** provisioned via Cloudflare & Google Trust Services |
| **Scheduled Auto-Closing** | Requires unreliable 3rd-party Google Workspace addons (e.g. FormLimiter) | **Native built-in scheduled expiration** with exact date & time down to the minute |
| **Manual Re-opening with Record**| Disabling or changing timers often clears previous deadline settings | **Keeps historical timer records** while allowing creators to force the form Live anytime |
| **Quiz Auto-Evaluation** | Multi-step configuration buried in spreadsheet settings | **Instant zero-setup grading** with point weighting and live score calculation |
| **Respondent Authentication** | Requires full Google sign-in tied to user's Google Drive | **Flexible choice**: Public anonymous submissions OR verified Google OAuth gating |
| **Page Speed & Performance** | Heavy Google scripts, trackers, and account switchers | **Edge-native Next.js & Cloudflare Worker build**; sub-50ms TTFB worldwide |
| **Data Privacy & Telemetry** | Google ecosystem tracking and cross-service profiling | **Direct D1 database ownership**; no third-party behavioral ad trackers |
| **Design Aesthetics** | Outdated material UI with cookie banners and Google footers | **Clean, distraction-free, professional interface** designed for high completion rates |
| **Export & Portability** | Synced to Google Sheets (often prone to sync drops) | **Direct CSV export** and real-time structured API access |

---

## 3. Core Advantages of ZeForm

### 1. Branded Credibility with Dedicated Subdomains
When sharing a form with clients, students, or candidates, URLs like `docs.google.com/forms/d/e/1FAIpQLSdX...` look amateur and often trigger phishing filters. With ZeForm, creators choose their exact vanity subdomain:
```
https://designer-hiring.zeform.zenstro.space
https://math-midterm.zeform.zenstro.space
https://feedback-q3.zeform.zenstro.space
```
Each subdomain is automatically routed and protected with an active, dedicated SSL certificate managed directly at the edge.

### 2. Built-in Auto-Expiry without Third-Party Addons
In Google Forms, setting a deadline requires installing untrusted third-party addons (like FormLimiter or Email Notifications for Google Forms) which demand broad access to your entire Google Drive and Gmail account.
- **ZeForm** includes native scheduled expiration out of the box.
- When the deadline hits, the form automatically switches to `Off`, locking submissions.
- If the administrator needs to extend submissions or reopen the form, they can simply flip the **Live toggle back to ON**. The past timer remains recorded for auditing, but submissions are unlocked immediately.

### 3. Frictionless Auto-Scored Quizzes
ZeForm transforms simple forms into competitive, educational quizzes with one click:
- Assign point weights per question.
- Mark correct answers for multiple choice, checkboxes, dropdowns, and text fields.
- Optionally display the score and question breakdown to the student immediately upon submission or withhold it for reviewed grading.

### 4. Spam Prevention via Verified Google OAuth
Form spam and duplicate entries ruin survey data. ZeForm offers two operational modes:
1. **Public Submissions:** Ideal for broad customer feedback, lead capture, and public inquiries.
2. **Verified Google Identity:** Respondents must authenticate with their Google account before submitting. ZeForm captures their verified name and email address securely without asking them to type it manually.

### 5. Edge Reliability & High Availability
Google Forms often suffers from corporate firewall blocks in schools or enterprises that restrict access to Google Drive URLs. ZeForm runs independently on Cloudflare's global edge network, guaranteeing:
- High availability with DDoS mitigation.
- Instant submission processing backed by Cloudflare D1.
- No dependency on Google Workspace storage quotas or account suspension risks.

---

## 4. Technical Architecture

- **Framework:** Next.js 14 App Router (React 18, TypeScript, Tailwind CSS)
- **Edge Runtime:** Cloudflare Pages with Cloudflare Edge Workers (`@cloudflare/next-on-pages`)
- **Database:** Cloudflare D1 (Serverless globally distributed SQLite)
- **Authentication:** Google OAuth 2.0 with JWT edge session signing via `jose`
- **DNS & Domains:** Cloudflare Zone API & Cloudflare Pages Custom Domains API
- **Security:** Strict Content Security Policies, HttpOnly secure cookies across `.zenstro.space`, and parameterized SQL to eliminate injection vectors.

---

## 5. Summary

**ZeForm.** delivers the ease of Google Forms with the professional polish, branding, and independence that modern creators, businesses, and educators need.
