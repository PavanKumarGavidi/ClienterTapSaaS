import { AppState, Lead, Client, Project, Invoice, Payment, Meeting, Task, Retainer, PipelineStage, Activity, Notification, User, Workspace, Plan, PLAN_LIMITS, PortalUser, MessageThread, Message, FileRecord, ProjectUpdate, Review, Referral, Document, DocumentTemplate, Signature, IntakeForm, IntakeResponse, TeamMember, TeamInvite, Payroll, Payslip, PushSubscription, NotificationPreference, TeamRole, Permission, Integration, IntegrationType, MarketplaceEnquiry, MarketplaceProfile, CustomDomain, WhiteLabelConfig } from './types';
import { v4 as uuid } from 'uuid';

const STORAGE_KEY = 'clientertap_state';

function createDefaultState(): AppState {
  const wsId = 'ws-demo';
  const userId = 'user-1';
  const now = new Date().toISOString();
  const stages: PipelineStage[] = [
    { id: 's1', workspaceId: wsId, name: 'New', color: '#3b82f6', order: 0 },
    { id: 's2', workspaceId: wsId, name: 'Contacted', color: '#f59e0b', order: 1 },
    { id: 's3', workspaceId: wsId, name: 'Qualified', color: '#8b5cf6', order: 2 },
    { id: 's4', workspaceId: wsId, name: 'Won', color: '#22c55e', order: 3 },
  ];
  const leads: Lead[] = [
    { id: 'l1', workspaceId: wsId, name: 'Priya Sharma', company: 'Bloom Studios', email: 'priya@bloom.co', phone: '+91 98765 43210', source: 'Instagram', stageId: 's1', estimatedValue: 75000, currency: 'INR', notes: 'Wants a full brand redesign', assignedTo: userId, isWon: false, isLost: false, createdAt: now, updatedAt: now },
    { id: 'l2', workspaceId: wsId, name: 'Arjun Mehta', company: 'TechFlow', email: 'arjun@techflow.in', phone: '+91 87654 32109', source: 'Website', stageId: 's2', estimatedValue: 120000, currency: 'INR', notes: 'Needs CRM integration', assignedTo: userId, followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], isWon: false, isLost: false, createdAt: now, updatedAt: now },
    { id: 'l3', workspaceId: wsId, name: 'Sarah Chen', company: 'Pixel Labs', email: 'sarah@pixellabs.com', phone: '+1 415 555 0123', source: 'Referral', stageId: 's3', estimatedValue: 5000, currency: 'USD', notes: 'Mobile app development', assignedTo: userId, isWon: false, isLost: false, createdAt: now, updatedAt: now },
    { id: 'l4', workspaceId: wsId, name: 'Raj Patel', company: 'GreenLeaf Co', email: 'raj@greenleaf.in', phone: '+91 76543 21098', source: 'IndiaMART', stageId: 's1', estimatedValue: 45000, currency: 'INR', notes: 'E-commerce website', assignedTo: userId, isWon: false, isLost: false, createdAt: now, updatedAt: now },
  ];
  const clients: Client[] = [
    { id: 'c1', workspaceId: wsId, name: 'Ananya Gupta', company: 'Nova Studio', email: 'ananya@novastudio.in', phone: '+91 99887 76655', address: 'Mumbai, India', currency: 'INR', status: 'active', tags: ['design', 'branding'], portalEnabled: true, gstin: '27AABCU9603R1ZM', notes: 'Premium client', createdAt: now },
    { id: 'c2', workspaceId: wsId, name: 'David Kim', company: 'Acme Corp', email: 'david@acme.co', phone: '+1 212 555 0199', address: 'New York, USA', currency: 'USD', status: 'active', tags: ['web', 'development'], portalEnabled: true, notes: 'Monthly retainer', createdAt: now },
    { id: 'c3', workspaceId: wsId, name: 'Meera Iyer', company: 'Bright Media', email: 'meera@brightmedia.in', phone: '+91 88776 65544', address: 'Bangalore, India', currency: 'INR', status: 'active', tags: ['marketing'], portalEnabled: false, notes: '', createdAt: now },
  ];
  const projects: Project[] = [
    { id: 'p1', workspaceId: wsId, clientId: 'c1', name: 'Brand Redesign', type: 'one-off', budget: 250000, currency: 'INR', startDate: '2026-01-15', deadline: '2026-04-30', description: 'Complete brand identity overhaul', status: 'ongoing', createdAt: now },
    { id: 'p2', workspaceId: wsId, clientId: 'c2', name: 'Website Maintenance', type: 'retainer', budget: 2000, currency: 'USD', startDate: '2026-01-01', deadline: '2026-12-31', description: 'Monthly website updates and maintenance', status: 'ongoing', createdAt: now },
    { id: 'p3', workspaceId: wsId, clientId: 'c3', name: 'Social Media Campaign', type: 'one-off', budget: 80000, currency: 'INR', startDate: '2026-03-01', deadline: '2026-05-15', description: 'Q2 social media strategy and execution', status: 'new', createdAt: now },
  ];
  const invoices: Invoice[] = [
    { id: 'inv1', workspaceId: wsId, clientId: 'c1', projectId: 'p1', number: 'INV-2026-001', issueDate: '2026-01-15', dueDate: '2026-02-15', currency: 'INR', items: [{ id: 'ii1', description: 'Brand Strategy', quantity: 1, rate: 100000, taxRate: 18, amount: 100000 }], subtotal: 100000, taxAmount: 18000, discount: 0, total: 118000, amountPaid: 118000, status: 'paid', notes: '', createdAt: now },
    { id: 'inv2', workspaceId: wsId, clientId: 'c2', projectId: 'p2', number: 'INV-2026-002', issueDate: '2026-03-01', dueDate: '2026-03-31', currency: 'USD', items: [{ id: 'ii2', description: 'Monthly Maintenance', quantity: 1, rate: 2000, taxRate: 0, amount: 2000 }], subtotal: 2000, taxAmount: 0, discount: 0, total: 2000, amountPaid: 1000, status: 'partial', notes: '', createdAt: now },
  ];
  const payments: Payment[] = [
    { id: 'pay1', workspaceId: wsId, invoiceId: 'inv1', clientId: 'c1', amount: 118000, currency: 'INR', date: '2026-02-10', method: 'Bank Transfer', reference: 'NEFT-001234', createdAt: now },
    { id: 'pay2', workspaceId: wsId, invoiceId: 'inv2', clientId: 'c2', amount: 1000, currency: 'USD', date: '2026-03-15', method: 'Wire Transfer', reference: 'WT-5678', createdAt: now },
  ];
  const meetings: Meeting[] = [
    { id: 'm1', workspaceId: wsId, title: 'Brand Review Call', clientId: 'c1', projectId: 'p1', date: new Date(Date.now() + 7200000).toISOString().split('T')[0], time: '14:00', duration: 60, attendees: ['Ananya Gupta'], agenda: 'Review brand concepts', notes: '', meetLink: 'https://meet.google.com/abc-defg-hij', calendarEventId: 'evt_123', reminderSent: false, reminderTime: 15, createdAt: now },
    { id: 'm2', workspaceId: wsId, title: 'Sprint Planning', clientId: 'c2', projectId: 'p2', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], time: '10:00', duration: 45, attendees: ['David Kim'], agenda: 'Plan next sprint tasks', notes: '', meetLink: 'https://meet.google.com/klm-nopq-rst', calendarEventId: 'evt_456', reminderSent: false, reminderTime: 30, createdAt: now },
  ];
  const tasks: Task[] = [
    { id: 't1', workspaceId: wsId, title: 'Finalize logo concepts', description: 'Create 3 logo options', assigneeId: userId, projectId: 'p1', dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], priority: 'high', status: 'in-progress', createdAt: now },
    { id: 't2', workspaceId: wsId, title: 'Send invoice for March', description: 'Monthly retainer invoice', assigneeId: userId, projectId: 'p2', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], priority: 'medium', status: 'todo', createdAt: now },
    { id: 't3', workspaceId: wsId, title: 'Update portfolio site', description: 'Add recent projects', assigneeId: userId, dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], priority: 'low', status: 'todo', createdAt: now },
  ];
  const retainers: Retainer[] = [
    { id: 'r1', workspaceId: wsId, clientId: 'c2', name: 'Website Maintenance', amount: 2000, currency: 'USD', billingDay: 1, startDate: '2026-01-01', status: 'active', scope: 'Monthly website updates, bug fixes, and content changes' },
  ];
  const activities: Activity[] = [
    { id: 'a1', workspaceId: wsId, type: 'project_created', description: 'Created project "Brand Redesign"', entityType: 'project', entityId: 'p1', userId, createdAt: now },
    { id: 'a2', workspaceId: wsId, type: 'payment_received', description: 'Received ₹1,18,000 from Nova Studio', entityType: 'payment', entityId: 'pay1', userId, createdAt: now },
    { id: 'a3', workspaceId: wsId, type: 'meeting_scheduled', description: 'Scheduled "Brand Review Call" with Ananya Gupta', entityType: 'meeting', entityId: 'm1', userId, createdAt: now },
  ];
  const notifications: Notification[] = [
    { id: 'n1', workspaceId: wsId, userId, title: 'Meeting in 2 hours', message: 'Brand Review Call with Ananya Gupta at 2:00 PM', read: false, createdAt: now },
    { id: 'n2', workspaceId: wsId, userId, title: 'Payment received', message: '₹1,18,000 received from Nova Studio', read: true, createdAt: now },
  ];
  // Phase 4 — Portal seed data
  const portalUsers: PortalUser[] = [
    { id: 'pu1', workspaceId: wsId, clientId: 'c1', email: 'ananya@novastudio.in', name: 'Ananya Gupta', token: 'portal-token-ananya-xyz', tempPassword: 'welcome123', mustChangePassword: true, createdAt: now },
    { id: 'pu2', workspaceId: wsId, clientId: 'c2', email: 'david@acme.co', name: 'David Kim', token: 'portal-token-david-abc', tempPassword: 'welcome123', mustChangePassword: true, lastLoginAt: now, createdAt: now },
  ];
  const messageThreads: MessageThread[] = [
    { id: 'mt1', workspaceId: wsId, clientId: 'c1', subject: 'Brand Redesign Discussion', createdAt: now, updatedAt: now },
    { id: 'mt2', workspaceId: wsId, clientId: 'c2', subject: 'Website Maintenance Updates', createdAt: now, updatedAt: now },
  ];
  const messages: Message[] = [
    { id: 'msg1', threadId: 'mt1', workspaceId: wsId, senderType: 'agency', senderId: userId, senderName: 'Vikram Singh', body: 'Hi Ananya, I have uploaded the first round of logo concepts for your review. Let me know your thoughts!', attachments: [], read: true, createdAt: now },
    { id: 'msg2', threadId: 'mt1', workspaceId: wsId, senderType: 'client', senderId: 'pu1', senderName: 'Ananya Gupta', body: 'Thanks Vikram! I will review them this evening and get back to you.', attachments: [], read: true, createdAt: new Date(Date.now() + 3600000).toISOString() },
    { id: 'msg3', threadId: 'mt2', workspaceId: wsId, senderType: 'agency', senderId: userId, senderName: 'Vikram Singh', body: 'Hi David, the March maintenance is complete. All plugins updated and security patches applied.', attachments: [], read: false, createdAt: now },
  ];
  const files: FileRecord[] = [
    { id: 'f1', workspaceId: wsId, clientId: 'c1', projectId: 'p1', name: 'Logo_Concepts_v1.pdf', size: 2400000, mimeType: 'application/pdf', sharedWithClient: true, uploadedBy: userId, createdAt: now },
    { id: 'f2', workspaceId: wsId, clientId: 'c1', projectId: 'p1', name: 'Brand_Guidelines_Draft.docx', size: 1800000, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', sharedWithClient: false, uploadedBy: userId, createdAt: now },
    { id: 'f3', workspaceId: wsId, clientId: 'c2', projectId: 'p2', name: 'Maintenance_Report_March.pdf', size: 980000, mimeType: 'application/pdf', sharedWithClient: true, uploadedBy: userId, createdAt: now },
  ];
  const projectUpdates: ProjectUpdate[] = [
    { id: 'upd1', workspaceId: wsId, projectId: 'p1', title: 'Logo concepts ready for review', body: 'We have completed the first round of logo concepts. Please review the attached PDF and let us know your top 2 choices.', attachments: [files[0]], requestSignOff: true, status: 'pending', createdAt: now },
    { id: 'upd2', workspaceId: wsId, projectId: 'p2', title: 'March maintenance complete', body: 'All WordPress plugins updated to latest versions. Security patches applied. Site speed optimized.', attachments: [files[2]], requestSignOff: false, status: 'pending', createdAt: now },
  ];
  const reviews: Review[] = [];
  const referrals: Referral[] = [];
  // Phase 5 — Documents seed data
  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'tpl-1', workspaceId: wsId, name: 'Service Agreement', type: 'contract',
      body: `<h1>Service Agreement</h1><p>This Service Agreement ("Agreement") is entered into as of <strong>{{date}}</strong>.</p><h2>Parties</h2><p><strong>Service Provider:</strong> {{agency_name}}<br/><strong>Client:</strong> {{client_name}} of {{company}}</p><h2>Scope of Work</h2><p>{{scope}}</p><h2>Payment Terms</h2><p>Total project value: <strong>{{amount}}</strong>. Payment schedule: 50% upfront, 50% on completion.</p><h2>Terms</h2><p>Both parties agree to the terms outlined above. This agreement is binding upon signature.</p>`,
      mergeFields: ['date', 'agency_name', 'client_name', 'company', 'scope', 'amount'], isDefault: true, createdAt: now
    },
    {
      id: 'tpl-2', workspaceId: wsId, name: 'Project Proposal', type: 'proposal',
      body: `<h1>Project Proposal</h1><p>Prepared for <strong>{{client_name}}</strong> at {{company}}</p><p>Date: {{date}}</p><h2>Project Overview</h2><p>{{scope}}</p><h2>Investment</h2><p>Total: <strong>{{amount}}</strong></p><h2>Timeline</h2><p>Estimated completion: {{timeline}}</p><h2>Next Steps</h2><p>To proceed, please sign and return this proposal.</p>`,
      mergeFields: ['date', 'client_name', 'company', 'scope', 'amount', 'timeline'], isDefault: true, createdAt: now
    },
    {
      id: 'tpl-3', workspaceId: wsId, name: 'Mutual NDA', type: 'nda',
      body: `<h1>Mutual Non-Disclosure Agreement</h1><p>This NDA is entered into between {{agency_name}} and {{company}} ({{client_name}}) on {{date}}.</p><p>Both parties agree to keep confidential any proprietary information shared during the course of business.</p>`,
      mergeFields: ['date', 'agency_name', 'client_name', 'company'], isDefault: true, createdAt: now
    },
  ];
  const documents: Document[] = [
    {
      id: 'doc-1', workspaceId: wsId, type: 'contract', title: 'Brand Redesign Service Agreement',
      body: documentTemplates[0].body, clientId: 'c1', projectId: 'p1', status: 'signed',
      templateId: 'tpl-1', version: 1, createdBy: userId, sentAt: now, viewedAt: now, signedAt: now,
      createdAt: now, updatedAt: now
    },
    {
      id: 'doc-2', workspaceId: wsId, type: 'proposal', title: 'Social Media Campaign Proposal',
      body: documentTemplates[1].body, clientId: 'c3', projectId: 'p3', status: 'sent',
      templateId: 'tpl-2', version: 1, createdBy: userId, sentAt: now,
      createdAt: now, updatedAt: now
    },
  ];
  const signatures: Signature[] = [
    {
      id: 'sig-1', workspaceId: wsId, documentId: 'doc-1', signerName: 'Ananya Gupta', signerEmail: 'ananya@novastudio.in',
      signerRole: 'client', status: 'signed', signatureData: 'Ananya Gupta', signatureType: 'typed',
      token: 'sig-token-ananya-xyz', viewedAt: now, signedAt: now,
      ipAddress: '103.21.58.123', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: now
    },
  ];
  const intakeForms: IntakeForm[] = [
    {
      id: 'form-1', workspaceId: wsId, title: 'New Client Onboarding',
      description: 'Please fill out this form to help us understand your business and project needs.',
      fields: [
        { id: 'f1', type: 'text', label: 'Full Name', required: true },
        { id: 'f2', type: 'email', label: 'Email Address', required: true },
        { id: 'f3', type: 'phone', label: 'Phone Number', required: false },
        { id: 'f4', type: 'text', label: 'Company Name', required: true },
        { id: 'f5', type: 'select', label: 'Service Needed', required: true, options: ['Web Design', 'Branding', 'Marketing', 'Development', 'Other'] },
        { id: 'f6', type: 'longtext', label: 'Tell us about your project', required: true, placeholder: 'Describe your goals, timeline, and budget...' },
        { id: 'f7', type: 'checkbox', label: 'I agree to be contacted about my enquiry', required: false },
      ],
      token: 'form-token-onboarding-abc', isActive: true, responseCount: 2, createdAt: now
    },
  ];
  const intakeResponses: IntakeResponse[] = [
    {
      id: 'resp-1', workspaceId: wsId, formId: 'form-1',
      data: { f1: 'Priya Sharma', f2: 'priya@bloom.co', f3: '+91 98765 43210', f4: 'Bloom Studios', f5: 'Branding', f6: 'Need a complete brand refresh for our D2C skincare line.', f7: true },
      submittedAt: now, ipAddress: '103.21.58.45', userAgent: 'Mozilla/5.0'
    },
    {
      id: 'resp-2', workspaceId: wsId, formId: 'form-1',
      data: { f1: 'Raj Patel', f2: 'raj@greenleaf.in', f4: 'GreenLeaf Co', f5: 'Web Design', f6: 'E-commerce website for organic products.', f7: true },
      submittedAt: new Date(Date.now() - 86400000).toISOString(), ipAddress: '103.21.58.78', userAgent: 'Mozilla/5.0'
    },
  ];
  // Phase 6 — Team & Scheduling seed data
  const teamMembers: TeamMember[] = [
    { id: 'tm-1', workspaceId: wsId, userId, name: 'Vikram Singh', email: 'vikram@nova.co', role: 'owner', permissions: ['leads', 'clients', 'projects', 'invoices', 'team', 'settings'], joinedAt: now, status: 'active' },
    { id: 'tm-2', workspaceId: wsId, userId: 'user-2', name: 'Priya Designer', email: 'priya.d@nova.co', role: 'member', permissions: ['clients', 'projects'], joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(), status: 'active' },
  ];
  const teamInvites: TeamInvite[] = [
    { id: 'ti-1', workspaceId: wsId, email: 'rahul.dev@nova.co', role: 'member', permissions: ['projects'], token: 'invite-token-rahul', invitedBy: userId, invitedAt: now, expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(), status: 'pending' },
  ];
  const payroll: Payroll[] = [
    { id: 'pr-1', workspaceId: wsId, teamMemberId: 'tm-2', month: '2026-03', baseSalary: 45000, bonuses: 5000, deductions: 2000, netPay: 48000, currency: 'INR', status: 'paid', paidAt: '2026-03-28', notes: 'March salary with project bonus', createdAt: now },
    { id: 'pr-2', workspaceId: wsId, teamMemberId: 'tm-2', month: '2026-04', baseSalary: 45000, bonuses: 0, deductions: 0, netPay: 45000, currency: 'INR', status: 'draft', notes: 'April salary', createdAt: now },
  ];
  const payslips: Payslip[] = [
    { id: 'ps-1', workspaceId: wsId, payrollId: 'pr-1', teamMemberId: 'tm-2', generatedAt: '2026-03-28T10:00:00Z', pdfUrl: '/payslips/ps-1.pdf' },
  ];
  const pushSubscriptions: PushSubscription[] = [];
  const notificationPreferences: NotificationPreference[] = [
    { id: 'np-1', workspaceId: wsId, userId, email: true, push: true, meetingReminders: true, paymentAlerts: true, leadFollowups: true, taskReminders: true },
  ];
  // Phase 7 — Growth seed data
  const integrations: Integration[] = [
    {
      id: 'int-1', workspaceId: wsId, type: 'webhook', name: 'Website Contact Form',
      status: 'connected', config: { url: 'https://novacreative.com/contact' },
      fieldMapping: { name: 'full_name', email: 'email_address', phone: 'phone', message: 'message' },
      webhookUrl: 'https://api.clientertap.com/webhooks/nova-creative/abc123',
      webhookSecret: 'whsec_' + uuid().slice(0, 16),
      lastSyncAt: new Date(Date.now() - 3600000).toISOString(),
      connectedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      createdAt: now
    },
  ];
  const marketplaceEnquiries: MarketplaceEnquiry[] = [];
  return {
    isAuthenticated: true,
    currentUserId: userId,
    workspace: { id: wsId, name: 'Nova Creative Agency', slug: 'nova-creative', logo: '', currency: 'INR', country: 'IN', gstin: '27AABCU9603R1ZM', plan: 'pro', createdAt: now },
    users: [{ id: userId, workspaceId: wsId, name: 'Vikram Singh', email: 'vikram@nova.co', role: 'owner' }],
    leads, stages, clients, projects, invoices, payments, meetings, tasks, retainers, activities, notifications,
    aiQuotesUsed: 1, aiQuotesResetDate: '2026-04-01', storageUsed: 45,
    portalUsers, currentPortalUserId: null, messageThreads, messages, files, projectUpdates, reviews, referrals,
    documents, documentTemplates, signatures, intakeForms, intakeResponses,
    teamMembers, teamInvites, payroll, payslips, pushSubscriptions, notificationPreferences,
    integrations, marketplaceEnquiries,
  };
}

let state: AppState = loadState();
let listeners: Set<() => void> = new Set();

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return createDefaultState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach(l => l());
}

export function getState(): AppState { return state; }
export function subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); }

export function useStore(): [AppState, typeof actions] {
  return [state, actions];
}

export const actions = {
  // Auth
  login(email: string, _password: string) {
    state = { ...state, isAuthenticated: true, currentUserId: state.users[0]?.id || null };
    saveState();
  },
  logout() {
    state = { ...state, isAuthenticated: false, currentUserId: null };
    saveState();
  },
  signup(data: { name: string; email: string; workspaceName: string; country: string }) {
    const wsId = 'ws-' + uuid().slice(0, 8);
    const userId = 'user-' + uuid().slice(0, 8);
    state = createDefaultState();
    state.workspace = { id: wsId, name: data.workspaceName, slug: data.workspaceName.toLowerCase().replace(/\s+/g, '-'), logo: '', currency: 'INR', country: data.country, plan: 'free', createdAt: new Date().toISOString() };
    state.users = [{ id: userId, workspaceId: wsId, name: data.name, email: data.email, role: 'owner' }];
    state.currentUserId = userId;
    state.isAuthenticated = true;
    saveState();
  },

  // Leads
  addLead(lead: Omit<Lead, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>) {
    const activeLeads = state.leads.filter(l => !l.isWon && !l.isLost && !l.convertedToClientId);
    const limits = PLAN_LIMITS[state.workspace!.plan];
    if (activeLeads.length >= limits.leads) return { error: 'Lead limit reached. Upgrade your plan.' };
    const newLead: Lead = { ...lead, id: 'l-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    state = { ...state, leads: [...state.leads, newLead] };
    addActivity('lead_created', `Added lead "${lead.name}"`, 'lead', newLead.id);
    saveState();
    return { success: true };
  },
  updateLead(id: string, updates: Partial<Lead>) {
    state = { ...state, leads: state.leads.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l) };
    saveState();
  },
  moveLead(id: string, stageId: string) {
    const lead = state.leads.find(l => l.id === id);
    const stage = state.stages.find(s => s.id === stageId);
    if (lead && stage) {
      const updates: Partial<Lead> = { stageId };
      if (stage.name === 'Won') updates.isWon = true;
      state = { ...state, leads: state.leads.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l) };
      addActivity('lead_moved', `Moved "${lead.name}" to ${stage.name}`, 'lead', id);
      saveState();
    }
  },
  deleteLead(id: string) {
    state = { ...state, leads: state.leads.filter(l => l.id !== id) };
    saveState();
  },
  convertLeadToClient(leadId: string) {
    const lead = state.leads.find(l => l.id === leadId);
    if (!lead) return { error: 'Lead not found' };
    const activeClients = state.clients.filter(c => c.status !== 'lead');
    const limits = PLAN_LIMITS[state.workspace!.plan];
    if (activeClients.length >= limits.clients) return { error: 'Client limit reached. Upgrade your plan.' };
    const newClient: Client = { id: 'c-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, name: lead.name, company: lead.company, email: lead.email, phone: lead.phone, address: '', currency: lead.currency, status: 'active', tags: [], portalEnabled: false, notes: lead.notes, leadId: lead.id, createdAt: new Date().toISOString() };
    state = {
      ...state,
      clients: [...state.clients, newClient],
      leads: state.leads.map(l => l.id === leadId ? { ...l, isWon: true, convertedToClientId: newClient.id, updatedAt: new Date().toISOString() } : l),
    };
    addActivity('lead_converted', `Converted "${lead.name}" to client`, 'client', newClient.id);
    saveState();
    return { success: true, clientId: newClient.id };
  },

  // Stages
  addStage(name: string, color: string) {
    const newStage: PipelineStage = { id: 's-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, name, color, order: state.stages.length };
    state = { ...state, stages: [...state.stages, newStage] };
    saveState();
  },
  updateStage(id: string, updates: Partial<PipelineStage>) {
    state = { ...state, stages: state.stages.map(s => s.id === id ? { ...s, ...updates } : s) };
    saveState();
  },
  deleteStage(id: string) {
    const leadsInStage = state.leads.filter(l => l.stageId === id);
    if (leadsInStage.length > 0) return { error: 'Move all leads out of this stage first' };
    state = { ...state, stages: state.stages.filter(s => s.id !== id) };
    saveState();
    return { success: true };
  },

  // Clients
  addClient(client: Omit<Client, 'id' | 'workspaceId' | 'createdAt'>) {
    const activeClients = state.clients.filter(c => c.status !== 'lead');
    const limits = PLAN_LIMITS[state.workspace!.plan];
    if (activeClients.length >= limits.clients) return { error: 'Client limit reached. Upgrade your plan.' };
    const newClient: Client = { ...client, id: 'c-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, createdAt: new Date().toISOString() };
    state = { ...state, clients: [...state.clients, newClient] };
    addActivity('client_created', `Added client "${client.name}"`, 'client', newClient.id);
    saveState();
    return { success: true };
  },
  updateClient(id: string, updates: Partial<Client>) {
    state = { ...state, clients: state.clients.map(c => c.id === id ? { ...c, ...updates } : c) };
    saveState();
  },
  deleteClient(id: string) {
    state = { ...state, clients: state.clients.filter(c => c.id !== id) };
    saveState();
  },

  // Projects
  addProject(project: Omit<Project, 'id' | 'workspaceId' | 'createdAt'>) {
    const limits = PLAN_LIMITS[state.workspace!.plan];
    if (state.projects.length >= limits.projects) return { error: 'Project limit reached. Upgrade your plan.' };
    const newProject: Project = { ...project, id: 'p-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, createdAt: new Date().toISOString() };
    state = { ...state, projects: [...state.projects, newProject] };
    addActivity('project_created', `Created project "${project.name}"`, 'project', newProject.id);
    saveState();
    return { success: true };
  },
  updateProject(id: string, updates: Partial<Project>) {
    state = { ...state, projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p) };
    if (updates.status === 'completed') addActivity('project_completed', `Completed project`, 'project', id);
    saveState();
  },
  deleteProject(id: string) {
    state = { ...state, projects: state.projects.filter(p => p.id !== id) };
    saveState();
  },

  // Invoices
  addInvoice(invoice: Omit<Invoice, 'id' | 'workspaceId' | 'createdAt' | 'number'>) {
    const num = `INV-${new Date().getFullYear()}-${String(state.invoices.length + 1).padStart(3, '0')}`;
    const newInvoice: Invoice = { ...invoice, id: 'inv-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, number: num, createdAt: new Date().toISOString() };
    state = { ...state, invoices: [...state.invoices, newInvoice] };
    addActivity('invoice_created', `Created invoice ${num}`, 'invoice', newInvoice.id);
    saveState();
    return { success: true, invoiceId: newInvoice.id };
  },
  updateInvoice(id: string, updates: Partial<Invoice>) {
    state = { ...state, invoices: state.invoices.map(i => i.id === id ? { ...i, ...updates } : i) };
    saveState();
  },

  // Payments
  addPayment(payment: Omit<Payment, 'id' | 'workspaceId' | 'createdAt'>) {
    const newPayment: Payment = { ...payment, id: 'pay-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, createdAt: new Date().toISOString() };
    state = { ...state, payments: [...state.payments, newPayment] };
    // Update invoice
    const inv = state.invoices.find(i => i.id === payment.invoiceId);
    if (inv) {
      const newPaid = inv.amountPaid + payment.amount;
      const status = newPaid >= inv.total ? 'paid' : 'partial';
      state = { ...state, invoices: state.invoices.map(i => i.id === payment.invoiceId ? { ...i, amountPaid: newPaid, status: status as Invoice['status'] } : i) };
    }
    addActivity('payment_received', `Received ${payment.currency === 'INR' ? '₹' : '$'}${payment.amount} payment`, 'payment', newPayment.id);
    saveState();
    return { success: true };
  },

  // Meetings
  addMeeting(meeting: Omit<Meeting, 'id' | 'workspaceId' | 'createdAt'>) {
    const newMeeting: Meeting = { ...meeting, id: 'm-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, createdAt: new Date().toISOString() };
    state = { ...state, meetings: [...state.meetings, newMeeting] };
    addActivity('meeting_scheduled', `Scheduled "${meeting.title}"`, 'meeting', newMeeting.id);
    saveState();
    return { success: true };
  },
  deleteMeeting(id: string) {
    state = { ...state, meetings: state.meetings.filter(m => m.id !== id) };
    saveState();
  },

  // Tasks
  addTask(task: Omit<Task, 'id' | 'workspaceId' | 'createdAt'>) {
    const newTask: Task = { ...task, id: 't-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, createdAt: new Date().toISOString() };
    state = { ...state, tasks: [...state.tasks, newTask] };
    saveState();
    return { success: true };
  },
  updateTask(id: string, updates: Partial<Task>) {
    state = { ...state, tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) };
    saveState();
  },
  deleteTask(id: string) {
    state = { ...state, tasks: state.tasks.filter(t => t.id !== id) };
    saveState();
  },

  // Retainers
  addRetainer(retainer: Omit<Retainer, 'id' | 'workspaceId'>) {
    const newRetainer: Retainer = { ...retainer, id: 'r-' + uuid().slice(0, 8), workspaceId: state.workspace!.id };
    state = { ...state, retainers: [...state.retainers, newRetainer] };
    saveState();
    return { success: true };
  },
  updateRetainer(id: string, updates: Partial<Retainer>) {
    state = { ...state, retainers: state.retainers.map(r => r.id === id ? { ...r, ...updates } : r) };
    saveState();
  },

  // Notifications
  markNotificationRead(id: string) {
    state = { ...state, notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) };
    saveState();
  },
  markAllNotificationsRead() {
    state = { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    saveState();
  },

  // Workspace
  updateWorkspace(updates: Partial<Workspace>) {
    if (state.workspace) {
      state = { ...state, workspace: { ...state.workspace, ...updates } };
      saveState();
    }
  },
  changePlan(plan: Plan) {
    if (state.workspace) {
      state = { ...state, workspace: { ...state.workspace, plan } };
      saveState();
    }
  },

  // Phase 4 — Portal actions
  enablePortalForClient(clientId: string) {
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return { error: 'Client not found' };
    const limits = PLAN_LIMITS[state.workspace!.plan];
    const portalEnabledCount = state.clients.filter(c => c.portalEnabled).length;
    if (portalEnabledCount >= limits.portalClients && !client.portalEnabled) {
      return { error: 'Portal client limit reached. Upgrade your plan.' };
    }
    const token = 'pt-' + uuid().slice(0, 12);
    const tempPassword = 'welcome' + Math.random().toString(36).slice(2, 8);
    state = {
      ...state,
      clients: state.clients.map(c => c.id === clientId ? { ...c, portalEnabled: true, portalToken: token } : c),
    };
    // Create portal user if not exists
    const existingPortalUser = state.portalUsers.find(pu => pu.clientId === clientId);
    if (!existingPortalUser) {
      const pu: PortalUser = {
        id: 'pu-' + uuid().slice(0, 8),
        workspaceId: state.workspace!.id,
        clientId,
        email: client.email,
        name: client.name,
        token,
        tempPassword,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
      };
      state = { ...state, portalUsers: [...state.portalUsers, pu] };
      // Create message thread
      const thread: MessageThread = {
        id: 'mt-' + uuid().slice(0, 8),
        workspaceId: state.workspace!.id,
        clientId,
        subject: 'General',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state = { ...state, messageThreads: [...state.messageThreads, thread] };
    }
    addActivity('portal_enabled', `Enabled portal for "${client.name}"`, 'client', clientId);
    saveState();
    return { success: true, token, tempPassword };
  },

  disablePortalForClient(clientId: string) {
    state = {
      ...state,
      clients: state.clients.map(c => c.id === clientId ? { ...c, portalEnabled: false, portalToken: undefined } : c),
    };
    saveState();
  },

  portalLogin(tokenOrEmail: string, password?: string): { success: boolean; portalUserId?: string; error?: string } {
    // Try token-based (magic link) login
    const byToken = state.portalUsers.find(pu => pu.token === tokenOrEmail);
    if (byToken) {
      state = {
        ...state,
        currentPortalUserId: byToken.id,
        portalUsers: state.portalUsers.map(pu => pu.id === byToken.id ? { ...pu, lastLoginAt: new Date().toISOString() } : pu),
      };
      saveState();
      return { success: true, portalUserId: byToken.id };
    }
    // Try email + password login
    const byEmail = state.portalUsers.find(pu => pu.email === tokenOrEmail);
    if (byEmail && byEmail.tempPassword === password) {
      state = {
        ...state,
        currentPortalUserId: byEmail.id,
        portalUsers: state.portalUsers.map(pu => pu.id === byEmail.id ? { ...pu, lastLoginAt: new Date().toISOString() } : pu),
      };
      saveState();
      return { success: true, portalUserId: byEmail.id };
    }
    return { success: false, error: 'Invalid credentials or portal not enabled for this client.' };
  },

  portalLogout() {
    state = { ...state, currentPortalUserId: null };
    saveState();
  },

  sendMessage(threadId: string, body: string, attachments: FileRecord[] = []) {
    const pu = state.portalUsers.find(p => p.id === state.currentPortalUserId);
    const isClient = !!pu;
    const msg: Message = {
      id: 'msg-' + uuid().slice(0, 8),
      threadId,
      workspaceId: state.workspace!.id,
      senderType: isClient ? 'client' : 'agency',
      senderId: isClient ? pu!.id : state.currentUserId!,
      senderName: isClient ? pu!.name : (state.users[0]?.name || 'Agency'),
      body,
      attachments,
      read: false,
      createdAt: new Date().toISOString(),
    };
    state = {
      ...state,
      messages: [...state.messages, msg],
      messageThreads: state.messageThreads.map(t => t.id === threadId ? { ...t, updatedAt: new Date().toISOString() } : t),
    };
    saveState();
    return { success: true };
  },

  markMessagesRead(threadId: string) {
    state = {
      ...state,
      messages: state.messages.map(m => m.threadId === threadId && !m.read ? { ...m, read: true } : m),
    };
    saveState();
  },

  addProjectUpdate(projectId: string, title: string, body: string, requestSignOff: boolean, attachments: FileRecord[] = []) {
    const update: ProjectUpdate = {
      id: 'upd-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      projectId,
      title,
      body,
      attachments,
      requestSignOff,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    state = { ...state, projectUpdates: [...state.projectUpdates, update] };
    addActivity('project_update', `Posted update "${title}"`, 'project', projectId);
    saveState();
    return { success: true };
  },

  approveProjectUpdate(updateId: string, portalUserId: string) {
    const pu = state.portalUsers.find(p => p.id === portalUserId);
    state = {
      ...state,
      projectUpdates: state.projectUpdates.map(u => u.id === updateId ? { ...u, status: 'approved' as const, approvedBy: pu?.name || 'Client', approvedAt: new Date().toISOString() } : u),
    };
    addActivity('update_approved', 'Client approved a project update', 'project_update', updateId);
    saveState();
  },

  addFile(file: Omit<FileRecord, 'id' | 'workspaceId' | 'createdAt'>) {
    const newFile: FileRecord = {
      ...file,
      id: 'f-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      createdAt: new Date().toISOString(),
    };
    state = { ...state, files: [...state.files, newFile], storageUsed: state.storageUsed + Math.round(file.size / 1024 / 1024) };
    saveState();
    return { success: true, fileId: newFile.id };
  },

  toggleFileSharing(fileId: string) {
    state = {
      ...state,
      files: state.files.map(f => f.id === fileId ? { ...f, sharedWithClient: !f.sharedWithClient, signedUrl: !f.sharedWithClient ? 'https://files.clientertap.com/signed/' + fileId + '?exp=' + (Date.now() + 86400000) : undefined } : f),
    };
    saveState();
  },

  addReview(review: Omit<Review, 'id' | 'workspaceId' | 'createdAt' | 'verified'>) {
    const newReview: Review = {
      ...review,
      id: 'rev-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      verified: true,
      createdAt: new Date().toISOString(),
    };
    state = { ...state, reviews: [...state.reviews, newReview] };
    saveState();
    return { success: true };
  },

  addReferral(referral: Omit<Referral, 'id' | 'workspaceId' | 'createdAt'>) {
    const newReferral: Referral = {
      ...referral,
      id: 'ref-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      createdAt: new Date().toISOString(),
    };
    state = { ...state, referrals: [...state.referrals, newReferral] };
    // Also create a lead from the referral
    const leadResult = actions.addLead({
      name: referral.contactName,
      company: '',
      email: referral.contactEmail,
      phone: referral.contactPhone,
      source: 'Referral',
      stageId: state.stages[0]?.id || '',
      estimatedValue: 0,
      currency: state.workspace?.currency || 'INR',
      notes: `Referred by ${referral.contactName}. Message: ${referral.message}`,
      assignedTo: state.currentUserId || '',
      isWon: false,
      isLost: false,
    });
    if ((leadResult as any).success) {
      const lastLead = state.leads[state.leads.length - 1];
      state = { ...state, referrals: state.referrals.map(r => r.id === newReferral.id ? { ...r, leadId: lastLead.id } : r) };
    }
    saveState();
    return { success: true };
  },

  // Phase 5 — Documents actions
  addDocument(doc: Omit<Document, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt' | 'version'>) {
    const newDoc: Document = {
      ...doc, id: 'doc-' + uuid().slice(0, 8), workspaceId: state.workspace!.id,
      version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    state = { ...state, documents: [...state.documents, newDoc] };
    addActivity('document_created', `Created document "${doc.title}"`, 'document', newDoc.id);
    saveState();
    return { success: true, documentId: newDoc.id };
  },
  updateDocument(id: string, updates: Partial<Document>) {
    state = {
      ...state,
      documents: state.documents.map(d => d.id === id ? { ...d, ...updates, version: d.version + 1, updatedAt: new Date().toISOString() } : d)
    };
    saveState();
  },
  deleteDocument(id: string) {
    state = { ...state, documents: state.documents.filter(d => d.id !== id) };
    saveState();
  },
  sendDocument(id: string, signerEmail: string, signerName: string, signerRole: 'client' | 'agency' = 'client') {
    const doc = state.documents.find(d => d.id === id);
    if (!doc) return { error: 'Document not found' };
    const token = 'sig-' + uuid().slice(0, 12);
    const sig: Signature = {
      id: 'sig-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, documentId: id,
      signerName, signerEmail, signerRole, status: 'pending', token, createdAt: new Date().toISOString()
    };
    state = {
      ...state,
      signatures: [...state.signatures, sig],
      documents: state.documents.map(d => d.id === id ? { ...d, status: 'sent' as const, sentAt: new Date().toISOString() } : d)
    };
    addActivity('document_sent', `Sent "${doc.title}" to ${signerName}`, 'document', id);
    saveState();
    return { success: true, signatureId: sig.id, token };
  },
  viewSignature(token: string) {
    const sig = state.signatures.find(s => s.token === token);
    if (!sig) return { error: 'Invalid signature link' };
    if (sig.status !== 'pending') return { error: 'This signature request is no longer active' };
    state = {
      ...state,
      signatures: state.signatures.map(s => s.id === sig.id ? { ...s, status: 'viewed' as const, viewedAt: new Date().toISOString(), ipAddress: '103.21.58.100', userAgent: navigator.userAgent } : s)
    };
    saveState();
    return { success: true, signature: sig };
  },
  signDocument(signatureId: string, signatureData: string, signatureType: 'typed' | 'drawn') {
    const sig = state.signatures.find(s => s.id === signatureId);
    if (!sig) return { error: 'Signature not found' };
    state = {
      ...state,
      signatures: state.signatures.map(s => s.id === signatureId ? {
        ...s, status: 'signed' as const, signatureData, signatureType, signedAt: new Date().toISOString()
      } : s),
      documents: state.documents.map(d => d.id === sig.documentId ? { ...d, status: 'signed' as const, signedAt: new Date().toISOString() } : d)
    };
    addActivity('document_signed', `Document signed by ${sig.signerName}`, 'document', sig.documentId);
    saveState();
    return { success: true };
  },
  declineSignature(signatureId: string, reason: string) {
    const sig = state.signatures.find(s => s.id === signatureId);
    if (!sig) return { error: 'Signature not found' };
    state = {
      ...state,
      signatures: state.signatures.map(s => s.id === signatureId ? {
        ...s, status: 'declined' as const, declinedAt: new Date().toISOString(), declinedReason: reason
      } : s),
      documents: state.documents.map(d => d.id === sig.documentId ? { ...d, status: 'declined' as const, declinedAt: new Date().toISOString() } : d)
    };
    saveState();
    return { success: true };
  },
  aiWriteDocument(brief: string, type: string): { success: boolean; body?: string; error?: string } {
    const limits = PLAN_LIMITS[state.workspace!.plan];
    // Check monthly reset
    const now = new Date();
    const resetDate = new Date(state.aiQuotesResetDate);
    if (now >= resetDate) {
      state = { ...state, aiQuotesUsed: 0, aiQuotesResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString() };
    }
    if (state.aiQuotesUsed >= limits.aiQuotes) {
      return { success: false, error: `AI quote limit reached (${limits.aiQuotes}/month). Upgrade your plan for more.` };
    }
    // Simulate AI generation based on brief
    const client = state.clients[0];
    const body = generateAIDocument(brief, String(type), state.workspace?.name || 'Agency', client?.name || 'Client', client?.company || 'Company');
    state = { ...state, aiQuotesUsed: state.aiQuotesUsed + 1 };
    addActivity('ai_document_generated', `AI-generated ${type} from brief`, 'document', '');
    saveState();
    return { success: true, body };
  },
  // Intake Forms
  addIntakeForm(form: Omit<IntakeForm, 'id' | 'workspaceId' | 'createdAt' | 'token' | 'responseCount'>) {
    const newForm: IntakeForm = {
      ...form, id: 'form-' + uuid().slice(0, 8), workspaceId: state.workspace!.id,
      token: 'form-' + uuid().slice(0, 12), responseCount: 0, createdAt: new Date().toISOString()
    };
    state = { ...state, intakeForms: [...state.intakeForms, newForm] };
    saveState();
    return { success: true, formId: newForm.id, token: newForm.token };
  },
  updateIntakeForm(id: string, updates: Partial<IntakeForm>) {
    state = { ...state, intakeForms: state.intakeForms.map(f => f.id === id ? { ...f, ...updates } : f) };
    saveState();
  },
  deleteIntakeForm(id: string) {
    state = { ...state, intakeForms: state.intakeForms.filter(f => f.id !== id), intakeResponses: state.intakeResponses.filter(r => r.formId !== id) };
    saveState();
  },
  regenerateFormToken(id: string) {
    state = { ...state, intakeForms: state.intakeForms.map(f => f.id === id ? { ...f, token: 'form-' + uuid().slice(0, 12) } : f) };
    saveState();
  },
  submitIntakeForm(formId: string, data: Record<string, any>) {
    const form = state.intakeForms.find(f => f.id === formId);
    if (!form || !form.isActive) return { error: 'Form not found or inactive' };
    const response: IntakeResponse = {
      id: 'resp-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, formId,
      data, submittedAt: new Date().toISOString(),
      ipAddress: '103.21.58.100', userAgent: navigator.userAgent
    };
    state = {
      ...state,
      intakeResponses: [...state.intakeResponses, response],
      intakeForms: state.intakeForms.map(f => f.id === formId ? { ...f, responseCount: f.responseCount + 1 } : f)
    };
    // If linked to a client, add activity
    if (form.clientId) {
      addActivity('form_submitted', `Intake form "${form.title}" submitted`, 'intake_form', formId);
    }
    saveState();
    return { success: true };
  },
  // Document Templates
  addTemplate(tpl: Omit<DocumentTemplate, 'id' | 'workspaceId' | 'createdAt'>) {
    const newTpl: DocumentTemplate = {
      ...tpl, id: 'tpl-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, createdAt: new Date().toISOString()
    };
    state = { ...state, documentTemplates: [...state.documentTemplates, newTpl] };
    saveState();
    return { success: true };
  },

  // Phase 6 — Team & Scheduling actions
  inviteTeamMember(email: string, role: TeamRole, permissions: Permission[]) {
    const limits = PLAN_LIMITS[state.workspace!.plan];
    const activeMembers = state.teamMembers.filter(m => m.status === 'active').length;
    if (activeMembers >= limits.teammates) {
      return { error: `Team member limit reached (${limits.teammates}). Upgrade your plan.` };
    }
    const token = 'invite-' + uuid().slice(0, 12);
    const invite: TeamInvite = {
      id: 'ti-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      email,
      role,
      permissions,
      token,
      invitedBy: state.currentUserId!,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      status: 'pending'
    };
    state = { ...state, teamInvites: [...state.teamInvites, invite] };
    addActivity('team_invite_sent', `Invited ${email} as ${role}`, 'team', invite.id);
    saveState();
    return { success: true, inviteId: invite.id, token };
  },

  acceptTeamInvite(token: string, name: string) {
    const invite = state.teamInvites.find(i => i.token === token);
    if (!invite) return { error: 'Invalid invite token' };
    if (invite.status !== 'pending') return { error: 'Invite already accepted or expired' };
    if (new Date(invite.expiresAt) < new Date()) return { error: 'Invite has expired' };

    const member: TeamMember = {
      id: 'tm-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      userId: 'user-' + uuid().slice(0, 8),
      name,
      email: invite.email,
      role: invite.role,
      permissions: invite.permissions,
      joinedAt: new Date().toISOString(),
      status: 'active'
    };
    state = {
      ...state,
      teamMembers: [...state.teamMembers, member],
      teamInvites: state.teamInvites.map(i => i.id === invite.id ? { ...i, status: 'accepted' as const } : i)
    };
    addActivity('team_member_joined', `${name} joined the team as ${invite.role}`, 'team', member.id);
    saveState();
    return { success: true, memberId: member.id };
  },

  updateTeamMember(id: string, updates: Partial<TeamMember>) {
    state = { ...state, teamMembers: state.teamMembers.map(m => m.id === id ? { ...m, ...updates } : m) };
    saveState();
  },

  removeTeamMember(id: string) {
    state = { ...state, teamMembers: state.teamMembers.filter(m => m.id !== id) };
    saveState();
  },

  // Meetings with Google Calendar/Meet integration
  addMeetingWithIntegration(meeting: Omit<Meeting, 'id' | 'workspaceId' | 'createdAt' | 'meetLink' | 'calendarEventId' | 'reminderSent'>) {
    const meetLink = `https://meet.google.com/${uuid().slice(0, 3)}-${uuid().slice(0, 4)}-${uuid().slice(0, 3)}`;
    const calendarEventId = 'evt_' + uuid().slice(0, 8);
    const newMeeting: Meeting = {
      ...meeting,
      id: 'm-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      meetLink,
      calendarEventId,
      reminderSent: false,
      createdAt: new Date().toISOString()
    };
    state = { ...state, meetings: [...state.meetings, newMeeting] };
    addActivity('meeting_scheduled', `Scheduled "${meeting.title}" with Meet link`, 'meeting', newMeeting.id);
    saveState();
    return { success: true, meetingId: newMeeting.id, meetLink, calendarEventId };
  },

  sendMeetingReminder(meetingId: string) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return { error: 'Meeting not found' };
    state = {
      ...state,
      meetings: state.meetings.map(m => m.id === meetingId ? { ...m, reminderSent: true } : m)
    };
    addActivity('meeting_reminder_sent', `Sent reminder for "${meeting.title}"`, 'meeting', meetingId);
    saveState();
    return { success: true };
  },

  // Web Push
  registerPushSubscription(endpoint: string, keys: { p256dh: string; auth: string }) {
    const sub: PushSubscription = {
      id: 'push-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      userId: state.currentUserId!,
      endpoint,
      keys,
      createdAt: new Date().toISOString()
    };
    state = { ...state, pushSubscriptions: [...state.pushSubscriptions, sub] };
    saveState();
    return { success: true };
  },

  // Notification preferences
  updateNotificationPreferences(userId: string, updates: Partial<NotificationPreference>) {
    state = {
      ...state,
      notificationPreferences: state.notificationPreferences.map(p => p.userId === userId ? { ...p, ...updates } : p)
    };
    saveState();
  },

  // Payroll (Ultra feature)
  addPayroll(entry: Omit<Payroll, 'id' | 'workspaceId' | 'createdAt' | 'netPay'>) {
    if (state.workspace?.plan !== 'ultra') {
      return { error: 'Payroll is only available on Ultra plan' };
    }
    const netPay = entry.baseSalary + entry.bonuses - entry.deductions;
    const newPayroll: Payroll = {
      ...entry,
      id: 'pr-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      netPay,
      createdAt: new Date().toISOString()
    };
    state = { ...state, payroll: [...state.payroll, newPayroll] };
    addActivity('payroll_created', `Created payroll for ${entry.month}`, 'payroll', newPayroll.id);
    saveState();
    return { success: true, payrollId: newPayroll.id };
  },

  markPayrollPaid(id: string) {
    state = {
      ...state,
      payroll: state.payroll.map(p => p.id === id ? { ...p, status: 'paid' as const, paidAt: new Date().toISOString() } : p)
    };
    saveState();
  },

  generatePayslip(payrollId: string) {
    const payroll = state.payroll.find(p => p.id === payrollId);
    if (!payroll) return { error: 'Payroll entry not found' };
    const payslip: Payslip = {
      id: 'ps-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      payrollId,
      teamMemberId: payroll.teamMemberId,
      generatedAt: new Date().toISOString(),
      pdfUrl: `/payslips/ps-${uuid().slice(0, 8)}.pdf`
    };
    state = { ...state, payslips: [...state.payslips, payslip] };
    saveState();
    return { success: true, payslipId: payslip.id, pdfUrl: payslip.pdfUrl };
  },

  // Phase 7 — Growth actions
  
  // White Label
  updateWhiteLabel(config: Partial<WhiteLabelConfig>) {
    if (state.workspace?.plan !== 'ultra') {
      return { error: 'White label is only available on Ultra plan' };
    }
    state = {
      ...state,
      workspace: {
        ...state.workspace!,
        whiteLabel: { ...state.workspace!.whiteLabel, ...config } as WhiteLabelConfig,
        brandColor: config.brandColor || state.workspace!.brandColor
      }
    };
    saveState();
    return { success: true };
  },

  // Custom Domain
  addCustomDomain(domain: string) {
    if (state.workspace?.plan !== 'ultra') {
      return { error: 'Custom domains are only available on Ultra plan' };
    }
    const customDomain: CustomDomain = {
      id: 'cd-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      domain,
      status: 'pending',
      dnsRecords: [
        { type: 'CNAME', name: 'portal', value: 'portal.clientertap.com' },
        { type: 'TXT', name: '_verify', value: 'clientertap-verify=' + uuid().slice(0, 16) }
      ],
      sslStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    state = {
      ...state,
      workspace: { ...state.workspace!, customDomain }
    };
    saveState();
    return { success: true, domainId: customDomain.id };
  },

  verifyCustomDomain() {
    if (!state.workspace?.customDomain) return { error: 'No custom domain configured' };
    // Simulate verification (in production would check DNS)
    state = {
      ...state,
      workspace: {
        ...state.workspace!,
        customDomain: {
          ...state.workspace!.customDomain,
          status: 'verified',
          verifiedAt: new Date().toISOString(),
          sslStatus: 'active'
        }
      }
    };
    saveState();
    return { success: true };
  },

  removeCustomDomain() {
    state = {
      ...state,
      workspace: { ...state.workspace!, customDomain: undefined }
    };
    saveState();
    return { success: true };
  },

  // Marketplace
  updateMarketplaceProfile(profile: Partial<MarketplaceProfile>) {
    if (!state.workspace?.marketplaceProfile) {
      const newProfile: MarketplaceProfile = {
        id: 'mp-' + uuid().slice(0, 8),
        workspaceId: state.workspace!.id,
        agencyName: state.workspace!.name,
        tagline: '',
        description: '',
        services: [],
        location: '',
        portfolio: [],
        isListed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...profile
      };
      state = {
        ...state,
        workspace: { ...state.workspace!, marketplaceProfile: newProfile }
      };
    } else {
      state = {
        ...state,
        workspace: {
          ...state.workspace!,
          marketplaceProfile: {
            ...state.workspace!.marketplaceProfile,
            ...profile,
            updatedAt: new Date().toISOString()
          }
        }
      };
    }
    saveState();
    return { success: true };
  },

  addMarketplaceEnquiry(enquiry: Omit<MarketplaceEnquiry, 'id' | 'workspaceId' | 'createdAt' | 'status'>) {
    const newEnquiry: MarketplaceEnquiry = {
      ...enquiry,
      id: 'mke-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    state = { ...state, marketplaceEnquiries: [...state.marketplaceEnquiries, newEnquiry] };
    // Auto-create lead
    const leadResult = actions.addLead({
      name: enquiry.fromName,
      company: enquiry.fromCompany,
      email: enquiry.fromEmail,
      phone: '',
      source: 'Marketplace',
      stageId: state.stages[0]?.id || '',
      estimatedValue: 0,
      currency: state.workspace?.currency || 'INR',
      notes: `Marketplace enquiry: ${enquiry.message}`,
      assignedTo: state.currentUserId || '',
      isWon: false,
      isLost: false
    });
    if ((leadResult as any).success) {
      const lastLead = state.leads[state.leads.length - 1];
      state = {
        ...state,
        marketplaceEnquiries: state.marketplaceEnquiries.map(e => 
          e.id === newEnquiry.id ? { ...e, leadId: lastLead.id } : e
        )
      };
    }
    saveState();
    return { success: true, enquiryId: newEnquiry.id };
  },

  updateMarketplaceEnquiry(id: string, updates: Partial<MarketplaceEnquiry>) {
    state = {
      ...state,
      marketplaceEnquiries: state.marketplaceEnquiries.map(e => e.id === id ? { ...e, ...updates } : e)
    };
    saveState();
  },

  // Integrations
  connectIntegration(type: IntegrationType, config: Record<string, any>) {
    if (state.workspace?.plan !== 'ultra') {
      return { error: 'Lead integrations are only available on Ultra plan' };
    }
    const integration: Integration = {
      id: 'int-' + uuid().slice(0, 8),
      workspaceId: state.workspace!.id,
      type,
      name: type === 'meta' ? 'Meta Lead Ads' : type === 'google_ads' ? 'Google Ads' : type === 'indiamart' ? 'IndiaMART' : 'Webhook',
      status: 'connected',
      config,
      connectedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    if (type === 'webhook') {
      integration.webhookUrl = `https://api.clientertap.com/webhooks/${state.workspace!.slug}/${uuid().slice(0, 8)}`;
      integration.webhookSecret = 'whsec_' + uuid().slice(0, 16);
    }
    state = { ...state, integrations: [...state.integrations, integration] };
    addActivity('integration_connected', `Connected ${integration.name}`, 'integration', integration.id);
    saveState();
    return { success: true, integrationId: integration.id };
  },

  disconnectIntegration(id: string) {
    state = { ...state, integrations: state.integrations.filter(i => i.id !== id) };
    saveState();
    return { success: true };
  },

  updateIntegration(id: string, updates: Partial<Integration>) {
    state = {
      ...state,
      integrations: state.integrations.map(i => i.id === id ? { ...i, ...updates } : i)
    };
    saveState();
  },

  testWebhook(id: string) {
    const integration = state.integrations.find(i => i.id === id);
    if (!integration || integration.type !== 'webhook') {
      return { error: 'Integration not found or not a webhook' };
    }
    // Simulate test (in production would send actual HTTP request)
    state = {
      ...state,
      integrations: state.integrations.map(i => 
        i.id === id ? { ...i, lastSyncAt: new Date().toISOString(), lastError: undefined } : i
      )
    };
    saveState();
    return { success: true, message: 'Test webhook sent successfully' };
  },

  // Reviews
  addAgencyReply(reviewId: string, reply: string) {
    state = {
      ...state,
      reviews: state.reviews.map(r => r.id === reviewId ? { ...r, agencyReply: reply } : r)
    };
    saveState();
    return { success: true };
  },

  // Reset
  resetState() {
    state = createDefaultState();
    saveState();
  },
};

// AI document generator (simulated — production would call LLM API)
function generateAIDocument(brief: string, type: string, agencyName: string, clientName: string, company: string): string {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  if (type === 'contract') {
    return `<h1>Service Agreement</h1>
<p>This Service Agreement is entered into as of <strong>${today}</strong> between <strong>${agencyName}</strong> ("Service Provider") and <strong>${clientName}</strong> of <strong>${company}</strong> ("Client").</p>
<h2>1. Scope of Work</h2>
<p>${brief}</p>
<h2>2. Deliverables</h2>
<p>The Service Provider shall deliver all work products as outlined in the scope above, meeting professional industry standards.</p>
<h2>3. Timeline</h2>
<p>Work shall commence upon signing and be completed within the agreed timeframe. Any delays will be communicated in writing.</p>
<h2>4. Payment Terms</h2>
<p>Payment is due within 15 days of invoice. A 50% deposit is required to commence work, with the balance due on completion.</p>
<h2>5. Intellectual Property</h2>
<p>Upon full payment, all intellectual property rights in the deliverables transfer to the Client.</p>
<h2>6. Confidentiality</h2>
<p>Both parties agree to keep confidential any proprietary information shared during the engagement.</p>
<h2>7. Termination</h2>
<p>Either party may terminate with 14 days written notice. The Client shall pay for work completed up to the termination date.</p>
<p><em>By signing below, both parties agree to the terms of this Agreement.</em></p>`;
  }
  if (type === 'proposal') {
    return `<h1>Project Proposal</h1>
<p>Prepared for <strong>${clientName}</strong> at <strong>${company}</strong></p>
<p>Date: ${today}</p>
<h2>Executive Summary</h2>
<p>${brief}</p>
<h2>Our Approach</h2>
<p>We will work closely with your team through a collaborative process that includes discovery, design, development, and delivery phases. Each phase includes review checkpoints to ensure alignment with your vision.</p>
<h2>Deliverables</h2>
<ul>
<li>Comprehensive discovery and strategy session</li>
<li>Design concepts with up to 3 revision rounds</li>
<li>Final deliverables in all required formats</li>
<li>Documentation and handoff materials</li>
</ul>
<h2>Timeline</h2>
<p>Estimated project duration: 4-6 weeks from kickoff.</p>
<h2>Investment</h2>
<p>We will provide a detailed quotation upon approval of this proposal.</p>
<h2>Why Work With Us</h2>
<p>With years of experience and a portfolio of successful projects, we bring both creativity and reliability to every engagement.</p>
<p><em>We look forward to the possibility of working together.</em></p>`;
  }
  if (type === 'quotation') {
    return `<h1>Quotation</h1>
<p>To: <strong>${clientName}</strong>, ${company}</p>
<p>Date: ${today}</p>
<p>Valid for: 30 days</p>
<h2>Project Summary</h2>
<p>${brief}</p>
<h2>Breakdown</h2>
<table style="width:100%; border-collapse:collapse;">
<tr style="border-bottom:1px solid #eee;"><th style="text-align:left; padding:8px;">Item</th><th style="text-align:right; padding:8px;">Amount</th></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Discovery & Strategy</td><td style="text-align:right; padding:8px;">TBD</td></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Design & Development</td><td style="text-align:right; padding:8px;">TBD</td></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Revisions & Final Delivery</td><td style="text-align:right; padding:8px;">TBD</td></tr>
</table>
<p><em>Please review and let us know if you have any questions.</em></p>`;
  }
  if (type === 'nda') {
    return `<h1>Mutual Non-Disclosure Agreement</h1>
<p>This Mutual Non-Disclosure Agreement ("NDA") is entered into as of <strong>${today}</strong>.</p>
<h2>Parties</h2>
<p><strong>${agencyName}</strong> and <strong>${company}</strong> (represented by ${clientName})</p>
<h2>Purpose</h2>
<p>The parties wish to explore a potential business relationship and may share confidential information during discussions.</p>
<h2>Confidential Information</h2>
<p>Includes but is not limited to: business plans, financial data, technical information, trade secrets, client lists, and any information marked as confidential.</p>
<h2>Obligations</h2>
<p>Both parties agree to: (a) hold confidential information in strict confidence; (b) not disclose to third parties without written consent; (c) use information solely for the purpose of evaluating the business relationship.</p>
<h2>Term</h2>
<p>This NDA remains in effect for 2 years from the date of signing.</p>
<p><em>By signing below, both parties accept these terms.</em></p>`;
  }
  return `<h1>Document</h1><p>${brief}</p>`;
}

function addActivity(type: string, description: string, entityType: string, entityId: string) {
  const activity: Activity = { id: 'a-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, type, description, entityType, entityId, userId: state.currentUserId!, createdAt: new Date().toISOString() };
  state = { ...state, activities: [activity, ...state.activities] };
}
