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
