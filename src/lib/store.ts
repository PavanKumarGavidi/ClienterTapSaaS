import { AppState, Lead, Client, Project, Invoice, Payment, Meeting, Task, Retainer, PipelineStage, Activity, Notification, User, Workspace, Plan, PLAN_LIMITS } from './types';
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
    { id: 'm1', workspaceId: wsId, title: 'Brand Review Call', clientId: 'c1', projectId: 'p1', date: new Date(Date.now() + 7200000).toISOString().split('T')[0], time: '14:00', duration: 60, attendees: ['Ananya Gupta'], agenda: 'Review brand concepts', notes: '', createdAt: now },
    { id: 'm2', workspaceId: wsId, title: 'Sprint Planning', clientId: 'c2', projectId: 'p2', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], time: '10:00', duration: 45, attendees: ['David Kim'], agenda: 'Plan next sprint tasks', notes: '', createdAt: now },
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
  return {
    isAuthenticated: true,
    currentUserId: userId,
    workspace: { id: wsId, name: 'Nova Creative Agency', slug: 'nova-creative', logo: '', currency: 'INR', country: 'IN', gstin: '27AABCU9603R1ZM', plan: 'pro', createdAt: now },
    users: [{ id: userId, workspaceId: wsId, name: 'Vikram Singh', email: 'vikram@nova.co', role: 'owner' }],
    leads, stages, clients, projects, invoices, payments, meetings, tasks, retainers, activities, notifications,
    aiQuotesUsed: 1, aiQuotesResetDate: '2026-04-01', storageUsed: 45,
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

  // Reset
  resetState() {
    state = createDefaultState();
    saveState();
  },
};

function addActivity(type: string, description: string, entityType: string, entityId: string) {
  const activity: Activity = { id: 'a-' + uuid().slice(0, 8), workspaceId: state.workspace!.id, type, description, entityType, entityId, userId: state.currentUserId!, createdAt: new Date().toISOString() };
  state = { ...state, activities: [activity, ...state.activities] };
}
