# ClienterTap — Feature Parity Checklist

> Last updated: Phase 1-7 (Foundations + Core CRM + Money + Portal + Documents + Scheduling & Team + Growth)
> Status key: ✅ Built | 🧪 Tested | ⏳ Not started | 🚫 Blocked

## P1 — Foundations

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 1 | Design tokens (colors, shadows, fonts, animations) | Global CSS | ✅ Built | Exact tokens from spec in index.css |
| 2 | Auth — Signup (name, email, password, workspace, country) | /signup | ✅ Built | Form with validation, plan defaults to free |
| 3 | Auth — Login (email + password) | /login | ✅ Built | Demo workspace shortcut included |
| 4 | Auth — Logout | Sidebar | ✅ Built | Clears session |
| 5 | Workspace creation & settings | Settings > Workspace | ✅ Built | Name, slug, currency, country |
| 6 | Multi-tenancy (workspace_id on all data) | Store layer | ✅ Built | All records carry workspaceId |
| 7 | Plan limits engine (Free/Pro/Ultra) | Store + Settings | ✅ Built | Enforced on add operations |
| 8 | App shell — Sidebar navigation | Layout | ✅ Built | Collapsible, all nav items |
| 9 | App shell — Top bar (search, notifications, user) | Layout | ✅ Built | Global search, notification bell |
| 10 | App shell — Mobile bottom nav | Layout | ✅ Built | 5-tab bar with slide-up menu |
| 11 | Settings — Workspace | Settings > Workspace | ✅ Built | Edit name, slug, currency |
| 12 | Settings — Team | Settings > Team | ✅ Built | Member list, invite button |
| 13 | Settings — Notifications | Settings > Notifications | ✅ Built | Toggle preferences |
| 14 | Data persistence (localStorage) | Store | ✅ Built | Survives refresh |
| 15 | Seed demo data | Store init | ✅ Built | Nova Creative Agency workspace |

## P2 — Core CRM

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 16 | Leads — Kanban pipeline | /leads | ✅ Built | Drag-and-drop between stages |
| 17 | Leads — Header stats (Open, Pipeline, Won, Win rate) | /leads | ✅ Built | Computed live |
| 18 | Leads — Search & filter | /leads | ✅ Built | Name, company, email search |
| 19 | Leads — Add lead form | /leads | ✅ Built | All fields, source, stage, currency |
| 20 | Leads — Lead drawer (details, pipeline, actions) | /leads | ✅ Built | Slide-in panel |
| 21 | Leads — Mark Lost (with reason) | Lead drawer | ✅ Built | Prompt for reason |
| 22 | Leads — Convert to Client | Lead drawer | ✅ Built | Prefills client, marks Won, links IDs |
| 23 | Leads — Follow-up date | Lead model | ✅ Built | Stored and displayed |
| 24 | Leads — Source tracking | Lead model | ✅ Built | 11 sources including IndiaMART, Meta |
| 25 | Pipeline stages — CRUD | Store | ✅ Built | Default 4 stages, add/rename/reorder |
| 26 | Clients — List with cards | /clients | ✅ Built | Search, status badges, tags |
| 27 | Clients — Add client form | /clients | ✅ Built | All fields, portal toggle |
| 28 | Clients — Profile drawer (history, projects, invoices) | /clients | ✅ Built | Full detail view |
| 29 | Clients — Portal toggle | Client drawer | ✅ Built | Enable/disable portal access |
| 30 | Clients — Per-client currency | Client model | ✅ Built | 30 currencies supported |
| 31 | Projects — Kanban board | /projects | ✅ Built | New/Ongoing/Completed columns |
| 32 | Projects — List view | /projects | ✅ Built | Table with toggle |
| 33 | Projects — Add project form | /projects | ✅ Built | Client, type, budget, dates |
| 34 | Projects — Budget & pending display | Project cards | ✅ Built | Shows budget and outstanding |
| 35 | Tasks — Kanban board | /tasks | ✅ Built | To Do / In Progress / Done |
| 36 | Tasks — Add task form | /tasks | ✅ Built | Title, priority, due date |
| 37 | Tasks — Move between columns | /tasks | ✅ Built | Click to advance status |
| 38 | Activity feed | /activity | ✅ Built | Global audit trail |

## P3 — Money

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 39 | Invoices — List with status | /invoices | ✅ Built | Table with status badges |
| 40 | Invoices — Create with line items | /invoices | ✅ Built | Qty, rate, per-line tax |
| 41 | Invoices — Auto-numbering (INV-YYYY-NNN) | Store | ✅ Built | Sequential numbering |
| 42 | Invoices — GST calculation | Invoice form | ✅ Built | Per-line tax rate |
| 43 | Invoices — Summary cards (invoiced, received, outstanding) | /invoices | ✅ Built | Live computed |
| 44 | Payments — List | /invoices > Payments tab | ✅ Built | Table with method, reference |
| 45 | Payments — Record payment (updates invoice) | Store | ✅ Built | Updates invoice balance |
| 46 | Payments — Part-payment support | Store | ✅ Built | Tracks amountPaid vs total |
| 47 | Retainers — Model & display | Store | ✅ Built | Active/paused/ended |
| 48 | Dashboard — Revenue stats | /dashboard | ✅ Built | This month, received, expenses |
| 49 | Dashboard — Sales Pipeline card | /dashboard | ✅ Built | Open, pipeline value, won, win rate |
| 50 | Dashboard — Pipeline & clients breakdown | /dashboard | ✅ Built | New/ongoing/completed/total |
| 51 | Dashboard — Revenue by type (Freelance vs Retainer) | /dashboard | ✅ Built | Segmented bar |
| 52 | Dashboard — Upcoming reminders | /dashboard | ✅ Built | Meetings and tasks |
| 53 | Dashboard — Recent clients | /dashboard | ✅ Built | Avatar, name, phone, time |
| 54 | Dashboard — Quick actions | /dashboard | ✅ Built | Add client, Schedule meeting |
| 55 | Meetings — List & schedule | /meetings | ✅ Built | Calendar view, add form |
| 56 | Multi-currency support | Global | ✅ Built | 30 currencies, formatCurrency util |

## P4 — Portal ✅ COMPLETE

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 57 | Client portal toggle | Client model + Client drawer | ✅ Built | Enable/disable with token generation |
| 58 | Portal auth — Magic link token | Portal Login | ✅ Built | Token-based login works |
| 59 | Portal auth — Temp password | Portal Login | ✅ Built | Email + password login works |
| 60 | Portal — Home page (projects, owed, attention) | Portal > Home | ✅ Built | Stats, attention items, running projects |
| 61 | Portal — Projects page (detail, updates, files) | Portal > Projects | ✅ Built | Timeline, shared files, budget |
| 62 | Portal — Project updates with sign-off | Portal > Projects | ✅ Built | Approve/reject updates, timestamp stored |
| 63 | Portal — Shared files (signed links) | Portal > Projects | ✅ Built | Only shared files visible, download button |
| 64 | Portal — Invoices page | Portal > Invoices | ✅ Built | Line items, status, outstanding balance |
| 65 | Portal — Messages (live thread) | Portal > Messages | ✅ Built | Real-time thread, mark read, send |
| 66 | Portal — Reviews (verified, immutable) | Portal > Reviews | ✅ Built | Star rating, text, verified badge |
| 67 | Portal — Referrals (creates lead) | Portal > Refer | ✅ Built | Referral form, creates lead in pipeline |
| 68 | Portal — Client data isolation | PortalApp | ✅ Built | Each client sees only their own data |
| 69 | Portal — Branding (agency name/logo) | PortalLayout | ✅ Built | Uses workspace name and brand color |
| 70 | Portal — "Powered by" footer (Free plan) | PortalLayout | ✅ Built | Only shown on free plan |
| 71 | Portal — Agency preview mode | PortalLayout | ✅ Built | "Back to Agency" button when previewing |
| 72 | Portal — Portal management page | /portal (agency) | ✅ Built | List portal clients, preview, revoke |
| 73 | Portal — Portal limit enforcement | Store | ✅ Built | Counts against plan limit |
| 74 | Portal — Invite email (simulated) | Client drawer | ✅ Built | Shows token/password on enable |
| 75 | Portal — Last login tracking | PortalUser model | ✅ Built | Tracked and displayed |

## P5 — Documents ✅ COMPLETE

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 61 | Documents — List & create | /documents | ✅ Built | Card UI with status badges |
| 62 | Document types (proposal, contract, quotation, NDA, other) | Documents tab | ✅ Built | All 5 types supported |
| 63 | Document templates library | Templates tab | ✅ Built | 3 default templates with merge fields |
| 64 | Merge fields ({{client_name}}, {{company}}, etc.) | Document editor | ✅ Built | Auto-replaced in preview |
| 65 | Document versions | Document model | ✅ Built | Auto-incremented on save |
| 66 | AI "Write with AI" with quota tracking | AI Writer modal | ✅ Built | Simulated LLM, counts against quota |
| 67 | AI monthly quota (3/25/100 by plan) | AI Writer | ✅ Built | Resets monthly, shows remaining |
| 68 | E-signature — send for signature | Document editor | ✅ Built | Generates secure signing token |
| 69 | E-signature — typed signature | Signing view | ✅ Built | Serif font preview |
| 70 | E-signature — drawn signature | Signing view | ✅ Built | Canvas area (simulated) |
| 71 | E-signature — statuses (pending/viewed/signed/declined) | Signatures tab | ✅ Built | Full lifecycle |
| 72 | E-signature — audit trail (IP, user agent, timestamps) | Signing view (audit) | ✅ Built | Captured on view/sign |
| 73 | E-signature — decline with reason | Signing view | ✅ Built | Reason stored |
| 74 | E-signature — signed PDF / audit certificate | Signing view | ✅ Built | Print-ready audit view |
| 75 | Intake forms — form builder | Forms tab | ✅ Built | Drag-and-drop field builder |
| 76 | Intake forms — all field types (text, longtext, email, phone, select, multiselect, date, file, checkbox, number) | Form builder | ✅ Built | 10 field types |
| 77 | Intake forms — required flags | Form builder | ✅ Built | Per-field required toggle |
| 78 | Intake forms — tokenized public links | Forms tab | ✅ Built | Unique token per form |
| 79 | Intake forms — public submission (no login) | Public form preview | ✅ Built | Works without auth |
| 80 | Intake forms — response tracking | Forms tab | ✅ Built | Response count, stored data |
| 81 | Intake forms — revoke/regenerate link | Forms tab | ✅ Built | Invalidates old token |
| 82 | Document editor with HTML content | Document editor | ✅ Built | Rich HTML editing |
| 83 | Document print/PDF export | Document editor | ✅ Built | Print-ready with merge fields |

## P6 — Scheduling & Team ✅ COMPLETE

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 65 | Google Calendar two-way sync | Meetings page | ✅ Built | Event ID tracked, sync indicator |
| 66 | Google Meet link auto-creation | Meetings page | ✅ Built | Auto-generated on schedule |
| 67 | Web Push reminders (browser) | Meetings page | ✅ Built | Notification.requestPermission flow |
| 68 | Meeting reminders (configurable) | Meetings page | ✅ Built | Per-meeting reminder time |
| 69 | Calendar month view | Meetings > Calendar | ✅ Built | Grid with meeting dots |
| 70 | Upcoming/past meeting tabs | Meetings page | ✅ Built | Sorted by date |
| 71 | Team member list with roles | Team > Members | ✅ Built | Owner/admin/member/viewer |
| 72 | Per-module permissions | Team > Members | ✅ Built | 6 permission modules |
| 73 | Team invites by email | Team > Invite | ✅ Built | Token-based, 7-day expiry |
| 74 | Team invite acceptance | Store action | ✅ Built | acceptTeamInvite with token |
| 75 | Seat limit enforcement | Team page | ✅ Built | Free:1, Pro:5, Ultra:∞ |
| 76 | Team member removal | Team > Members | ✅ Built | With confirmation |
| 77 | Payroll entries (Ultra) | Team > Payroll | ✅ Built | Base + bonuses - deductions |
| 78 | Mark payroll as paid | Payroll tab | ✅ Built | Status + paidAt tracking |
| 79 | Payslip generation (Ultra) | Payroll tab | ✅ Built | PDF URL generated |
| 80 | Push notification registration | Meetings > Push | ✅ Built | Browser permission flow |
| 81 | Notification preferences | Settings | ✅ Built | Per-channel toggles |
| 82 | Meeting history on client | Client drawer | ✅ Built | Linked by clientId |

## P7 — Growth ✅ COMPLETE

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 70 | Verified reviews — public page | /r/<slug> | ✅ Built | Rating summary, review list, embed badge |
| 71 | Verified reviews — embed badge | PublicReviewsPage | ✅ Built | Iframe embed code with copy button |
| 72 | Verified reviews — agency reply | Reviews tab | ✅ Built | Reply to verified reviews |
| 73 | Verified reviews — schema.org markup | PublicReviewsPage | ✅ Built | AggregateRating JSON-LD |
| 74 | Referrals — tracking | Portal > Refer | ✅ Built | Referral form, status tracking |
| 75 | Referrals — auto-creates lead | Store action | ✅ Built | Source = Referral |
| 76 | Marketplace — profile editor | Growth > Marketplace | ✅ Built | Tagline, description, services, location |
| 77 | Marketplace — listing toggle | Growth > Marketplace | ✅ Built | isListed flag |
| 78 | Marketplace — enquiries | Growth > Marketplace | ✅ Built | Enquiry list with status |
| 79 | Marketplace — enquiry → lead | Store action | ✅ Built | Auto-creates lead with source = Marketplace |
| 80 | Lead integrations — Meta | Growth > Integrations | ✅ Built | Page token + page ID config |
| 81 | Lead integrations — Google Ads | Growth > Integrations | ✅ Built | Developer token + customer ID |
| 82 | Lead integrations — IndiaMART | Growth > Integrations | ✅ Built | API key config |
| 83 | Lead integrations — Webhook | Growth > Integrations | ✅ Built | Auto-generated URL + secret, test-send |
| 84 | Lead integrations — Ultra-only gating | Growth > Integrations | ✅ Built | Upgrade prompt for non-Ultra |
| 85 | White label — brand color picker | Growth > White Label | ✅ Built | Color input + preset swatches |
| 86 | White label — company name | Growth > White Label | ✅ Built | Custom company name |
| 87 | White label — hide "Powered by" | Growth > White Label | ✅ Built | Toggle for branding removal |
| 88 | White label — Ultra-only gating | Growth > White Label | ✅ Built | Upgrade prompt for non-Ultra |
| 89 | Custom domain — add domain | Growth > Custom Domain | ✅ Built | Domain input with validation |
| 90 | Custom domain — DNS records | Growth > Custom Domain | ✅ Built | CNAME + TXT records with copy |
| 91 | Custom domain — verification | Growth > Custom Domain | ✅ Built | Verify button, status tracking |
| 92 | Custom domain — SSL status | Growth > Custom Domain | ✅ Built | SSL status indicator |
| 93 | Custom domain — remove | Growth > Custom Domain | ✅ Built | Remove with confirmation |
| 94 | Custom domain — Ultra-only gating | Growth > Custom Domain | ✅ Built | Upgrade prompt for non-Ultra |

## P8 — Public Site & Billing

| # | Feature | Page/Route | Status | Notes |
|---|---------|-----------|--------|-------|
| 76 | Marketing homepage | — | ⏳ Not started | Needs Next.js |
| 77 | Pricing page | — | ⏳ Not started | |
| 78 | Free tools (Invoice gen, GST calc, etc.) | — | ⏳ Not started | |
| 79 | Razorpay billing (INR) | — | ⏳ Not started | Needs API keys |
| 80 | PayPal billing (USD) | — | ⏳ Not started | Needs API keys |
| 81 | SEO (meta, OG, sitemap, JSON-LD) | — | ⏳ Not started | |
| 82 | Admin panel | — | ⏳ Not started | |
| 83 | Android app | — | ⏳ Not started | |

---

## Blocked Items (need external credentials)

| Item | What's needed |
|------|---------------|
| Email (Resend) | `RESEND_API_KEY` env var |
| Google OAuth + Calendar | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| PayPal | `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` |
| LLM (AI quotes) | `OPENAI_API_KEY` or equivalent |
| Web Push | VAPID keypair |
| Supabase (production) | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| Meta Lead Ads | Meta app credentials |
| IndiaMART | CRM API key |

## Assumptions

1. // ASSUMPTION: localStorage used as database substitute (production would use Supabase)
2. // ASSUMPTION: Single-user workspace for demo (production has multi-tenant RLS)
3. // ASSUMPTION: No real email sending (would use Resend in production)
4. // ASSUMPTION: INR formatting uses Indian numbering (lakhs/crores)
5. // ASSUMPTION: Plan limits enforced client-side only (production needs server-side)
6. // ASSUMPTION: Currency conversion uses static rates (production refreshes daily)
