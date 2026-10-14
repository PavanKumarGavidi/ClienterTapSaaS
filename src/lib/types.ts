export type Plan = 'free' | 'pro' | 'ultra';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  currency: string;
  country: string;
  gstin?: string;
  plan: Plan;
  brandColor?: string;
  createdAt: string;
}

export interface User {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
  avatar?: string;
}

export interface Lead {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stageId: string;
  estimatedValue: number;
  currency: string;
  notes: string;
  assignedTo: string;
  followUpDate?: string;
  isWon: boolean;
  isLost: boolean;
  lostReason?: string;
  convertedToClientId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  order: number;
}

export interface Client {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  status: 'active' | 'lead' | 'on-hold';
  tags: string[];
  portalEnabled: boolean;
  portalToken?: string;
  gstin?: string;
  notes: string;
  leadId?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  clientId: string;
  name: string;
  type: 'one-off' | 'retainer';
  budget: number;
  currency: string;
  startDate: string;
  deadline: string;
  description: string;
  status: 'new' | 'ongoing' | 'completed';
  createdAt: string;
}

export interface Invoice {
  id: string;
  workspaceId: string;
  clientId: string;
  projectId?: string;
  number: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue';
  notes: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  amount: number;
}

export interface Payment {
  id: string;
  workspaceId: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  currency: string;
  date: string;
  method: string;
  reference: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  workspaceId: string;
  title: string;
  clientId?: string;
  projectId?: string;
  date: string;
  time: string;
  duration: number;
  attendees: string[];
  agenda: string;
  notes: string;
  meetLink?: string;
  calendarEventId?: string;
  reminderSent: boolean;
  reminderTime?: number; // minutes before
  createdAt: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  assigneeId: string;
  projectId?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export interface Retainer {
  id: string;
  workspaceId: string;
  clientId: string;
  name: string;
  amount: number;
  currency: string;
  billingDay: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'ended';
  scope: string;
}

export interface Activity {
  id: string;
  workspaceId: string;
  type: string;
  description: string;
  entityType: string;
  entityId: string;
  userId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Phase 4 — Portal types
export interface PortalUser {
  id: string;
  workspaceId: string;
  clientId: string;
  email: string;
  name: string;
  token: string; // magic-link token
  tempPassword?: string; // temporary password (hashed in production)
  mustChangePassword: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  workspaceId: string;
  clientId: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  workspaceId: string;
  senderType: 'agency' | 'client';
  senderId: string;
  senderName: string;
  body: string;
  attachments: FileRecord[];
  read: boolean;
  createdAt: string;
}

export interface FileRecord {
  id: string;
  workspaceId: string;
  clientId?: string;
  projectId?: string;
  name: string;
  size: number; // bytes
  mimeType: string;
  sharedWithClient: boolean;
  signedUrl?: string; // expires
  uploadedBy: string;
  createdAt: string;
}

export interface ProjectUpdate {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  body: string;
  attachments: FileRecord[];
  requestSignOff: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  workspaceId: string;
  clientId: string;
  projectId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  clientName: string;
  verified: boolean;
  agencyReply?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  workspaceId: string;
  referrerClientId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
  leadId?: string;
  status: 'pending' | 'contacted' | 'converted';
  createdAt: string;
}

// Phase 6 — Team & Scheduling types
export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';
export type Permission = 'leads' | 'clients' | 'projects' | 'invoices' | 'team' | 'settings';

export interface TeamMember {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  role: TeamRole;
  permissions: Permission[];
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'invited' | 'suspended';
}

export interface TeamInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: TeamRole;
  permissions: Permission[];
  token: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface Payroll {
  id: string;
  workspaceId: string;
  teamMemberId: string;
  month: string; // YYYY-MM
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  currency: string;
  status: 'draft' | 'approved' | 'paid';
  paidAt?: string;
  notes: string;
  createdAt: string;
}

export interface Payslip {
  id: string;
  workspaceId: string;
  payrollId: string;
  teamMemberId: string;
  generatedAt: string;
  pdfUrl?: string;
}

export interface PushSubscription {
  id: string;
  workspaceId: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  workspaceId: string;
  userId: string;
  email: boolean;
  push: boolean;
  meetingReminders: boolean;
  paymentAlerts: boolean;
  leadFollowups: boolean;
  taskReminders: boolean;
}

// Phase 5 — Documents types
export type DocumentType = 'proposal' | 'contract' | 'quotation' | 'nda' | 'other';
export type DocumentStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired';

export interface Document {
  id: string;
  workspaceId: string;
  type: DocumentType;
  title: string;
  body: string; // HTML content with merge fields
  clientId?: string;
  projectId?: string;
  status: DocumentStatus;
  templateId?: string;
  version: number;
  createdBy: string;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  declinedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplate {
  id: string;
  workspaceId: string;
  name: string;
  type: DocumentType;
  body: string;
  mergeFields: string[]; // e.g. ['client_name', 'company', 'amount']
  isDefault: boolean;
  createdAt: string;
}

export interface Signature {
  id: string;
  workspaceId: string;
  documentId: string;
  signerName: string;
  signerEmail: string;
  signerRole: 'client' | 'agency';
  status: 'pending' | 'viewed' | 'signed' | 'declined' | 'expired';
  signatureData?: string; // base64 image (drawn) or text (typed)
  signatureType?: 'typed' | 'drawn';
  token: string; // unique signing link token
  viewedAt?: string;
  signedAt?: string;
  declinedAt?: string;
  declinedReason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export type IntakeFieldType = 'text' | 'longtext' | 'email' | 'phone' | 'select' | 'multiselect' | 'date' | 'file' | 'checkbox' | 'number';

export interface IntakeFormField {
  id: string;
  type: IntakeFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select/multiselect
}

export interface IntakeForm {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  fields: IntakeFormField[];
  clientId?: string;
  projectId?: string;
  token: string; // public access token
  isActive: boolean;
  responseCount: number;
  createdAt: string;
}

export interface IntakeResponse {
  id: string;
  workspaceId: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  currentUserId: string | null;
  workspace: Workspace | null;
  users: User[];
  leads: Lead[];
  stages: PipelineStage[];
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  payments: Payment[];
  meetings: Meeting[];
  tasks: Task[];
  retainers: Retainer[];
  activities: Activity[];
  notifications: Notification[];
  aiQuotesUsed: number;
  aiQuotesResetDate: string;
  storageUsed: number;
  // Phase 4 — Portal
  portalUsers: PortalUser[];
  currentPortalUserId: string | null; // null = not in portal
  messageThreads: MessageThread[];
  messages: Message[];
  files: FileRecord[];
  projectUpdates: ProjectUpdate[];
  reviews: Review[];
  referrals: Referral[];
  // Phase 5 — Documents
  documents: Document[];
  documentTemplates: DocumentTemplate[];
  signatures: Signature[];
  intakeForms: IntakeForm[];
  intakeResponses: IntakeResponse[];
  // Phase 6 — Team & Scheduling
  teamMembers: TeamMember[];
  teamInvites: TeamInvite[];
  payroll: Payroll[];
  payslips: Payslip[];
  pushSubscriptions: PushSubscription[];
  notificationPreferences: NotificationPreference[];
}

export const PLAN_LIMITS: Record<Plan, {
  clients: number; projects: number; leads: number;
  teammates: number; storageMB: number; aiQuotes: number;
  portalClients: number;
}> = {
  free: { clients: 3, projects: 5, leads: 20, teammates: 1, storageMB: 100, aiQuotes: 3, portalClients: 1 },
  pro: { clients: 20, projects: 40, leads: 200, teammates: 5, storageMB: 1024, aiQuotes: 25, portalClients: 999 },
  ultra: { clients: 99999, projects: 99999, leads: 99999, teammates: 99999, storageMB: 10240, aiQuotes: 100, portalClients: 99999 },
};

export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'JPY', 'CHF', 'BRL', 'ZAR', 'NZD', 'HKD', 'KRW', 'MXN', 'THB', 'MYR', 'PHP', 'IDR', 'VND', 'BDT', 'PKR', 'LKR', 'NPR', 'SAR', 'QAR', 'KWD', 'OMR', 'BHD'];

export const LEAD_SOURCES = ['Instagram', 'Website', 'Referral', 'Ads', 'Cold Call', 'IndiaMART', 'Meta', 'Google Ads', 'Marketplace', 'Webhook', 'Other'];

export const COUNTRY_CURRENCY: Record<string, string> = {
  'IN': 'INR', 'US': 'USD', 'GB': 'GBP', 'AU': 'AUD', 'CA': 'CAD', 'DE': 'EUR', 'FR': 'EUR', 'AE': 'AED', 'SG': 'SGD', 'JP': 'JPY',
};
