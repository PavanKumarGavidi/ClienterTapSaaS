import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { getState, subscribe, actions } from './lib/store';
import { AppState, Plan, PLAN_LIMITS, CURRENCIES, LEAD_SOURCES, DocumentType, IntakeFormField, IntakeFieldType, Meeting, TeamRole, Permission } from './lib/types';
import PortalApp from './PortalApp';
import { GrowthSettingsPage, PublicReviewsPage } from './GrowthPages';
import { MarketingSite } from './MarketingSite';
import { AuthPage } from './AuthPage';
import { FreeToolsPage } from './FreeTools';
import {
  LayoutDashboard, Users, UserCircle, FolderKanban, CreditCard, MessageSquare,
  Calendar, CheckSquare, FileText, UserPlus, Settings, Activity, Bell, Search,
  Menu, X, ChevronDown, ChevronRight, Plus, Filter, Download, Upload, Trash2,
  Mail, Phone, Building2, DollarSign, TrendingUp, Clock, Star, ArrowRight,
  LogOut, Eye, Edit, MoreVertical, GripVertical, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Zap, Shield, Globe, Heart, ExternalLink, Sparkles
} from 'lucide-react';

// Store hook
function useAppState(): AppState {
  const [state, setState] = useState(getState());
  useEffect(() => {
    const unsub = subscribe(() => setState(getState()));
    return () => { unsub(); };
  }, []);
  return state;
}

// Currency formatter
function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', AED: 'د.إ', SGD: 'S$', JPY: '¥' };
  const sym = symbols[currency] || currency + ' ';
  if (currency === 'INR') {
    return sym + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }
  return sym + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// Legacy Auth Page (replaced by AuthPage.tsx)
function LegacyAuthPage({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [country, setCountry] = useState('IN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      actions.login(email, password);
    } else {
      actions.signup({ name, email, workspaceName, country });
    }
    onAuth();
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-ink">ClienterTap</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">
            {mode === 'login' ? 'Welcome back' : 'Start your free workspace'}
          </h1>
          <p className="text-ink-muted mt-2">
            {mode === 'login' ? 'Sign in to manage your clients' : 'No credit card required. Free forever.'}
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-6 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Vikram Singh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Workspace name</label>
                  <input type="text" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="My Creative Agency" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="CA">Canada</option>
                    <option value="AE">UAE</option>
                    <option value="SG">Singapore</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-ember">
              {mode === 'login' ? 'Sign in' : 'Create workspace'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-ink-muted">
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => setMode('signup')} className="text-primary-600 font-medium hover:underline">Start free</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('login')} className="text-primary-600 font-medium hover:underline">Sign in</button></>
            )}
          </div>

          {mode === 'login' && (
            <div className="mt-4 pt-4 border-t border-line">
              <button onClick={() => { actions.login('demo@clientertap.com', 'demo'); onAuth(); }}
                className="w-full py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas transition-colors">
                Try demo workspace →
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-ink-faint mt-6">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

// Sidebar Navigation
function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: {
  currentPage: string; onNavigate: (page: string) => void; collapsed: boolean; onToggle: () => void;
}) {
  const state = useAppState();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'clients', label: 'Clients', icon: UserCircle },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'invoices', label: 'Payments', icon: CreditCard },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'team', label: 'Team', icon: UserPlus },
    { id: 'growth', label: 'Growth', icon: Zap },
    { id: 'portal', label: 'Client Portal', icon: Globe },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col w-16 bg-surface border-r border-line py-4 items-center">
        <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center mb-6 cursor-pointer" onClick={onToggle}>
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {navItems.slice(0, 8).map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-colors ${currentPage === item.id ? 'bg-primary-50 text-primary-600' : 'text-ink-muted hover:bg-canvas hover:text-ink'}`}>
            <item.icon size={18} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-col w-60 bg-surface border-r border-line py-4">
      <div className="px-4 mb-6 flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink truncate">{state.workspace?.name}</div>
          <div className="text-xs text-ink-faint capitalize">{state.workspace?.plan} plan</div>
        </div>
        <button onClick={onToggle} className="text-ink-faint hover:text-ink">
          <ChevronDown size={16} className="rotate-[-90deg]" />
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${currentPage === item.id ? 'bg-primary-50 text-primary-600' : 'text-ink-muted hover:bg-canvas hover:text-ink'}`}>
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 pt-4 border-t border-line mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-700">
              {state.users[0]?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-ink truncate">{state.users[0]?.name}</div>
            <div className="text-xs text-ink-faint truncate">{state.users[0]?.email}</div>
          </div>
          <button onClick={() => actions.logout()} className="text-ink-faint hover:text-ink">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Mobile Bottom Nav
function MobileNav({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'invoices', label: 'Payments', icon: CreditCard },
    { id: 'more', label: 'More', icon: Menu },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-line shadow-up z-50">
      <div className="flex items-center justify-around py-2">
        {items.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg ${currentPage === item.id ? 'text-primary-600' : 'text-ink-muted'}`}>
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Dashboard Page
function DashboardPage() {
  const state = useAppState();
  const currentUser = state.users[0];
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const openLeads = state.leads.filter(l => !l.isWon && !l.isLost);
  const pipelineValue = openLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
  const wonLeads = state.leads.filter(l => l.isWon);
  const winRate = state.leads.length > 0 ? Math.round((wonLeads.length / state.leads.length) * 100) : 0;

  const thisMonthRevenue = state.projects.filter(p => {
    const d = new Date(p.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, p) => sum + p.budget, 0);

  const totalReceived = state.payments.reduce((sum, p) => sum + p.amount, 0);
  const totalInvoiced = state.invoices.reduce((sum, i) => sum + i.total, 0);
  const pending = totalInvoiced - totalReceived;

  const activeRetainers = state.retainers.filter(r => r.status === 'active');
  const mrr = activeRetainers.reduce((sum, r) => sum + r.amount, 0);

  const upcomingMeetings = state.meetings.filter(m => new Date(m.date) >= new Date()).slice(0, 4);
  const upcomingTasks = state.tasks.filter(t => t.status !== 'done').slice(0, 4);

  const sourceCounts: Record<string, number> = {};
  state.leads.forEach(l => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1; });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Welcome back, {currentUser?.name?.split(' ')[0] || 'there'}</h1>
        <p className="text-ink-muted mt-1">Here's what's happening with your business today.</p>
        <p className="text-xs text-ink-faint mt-1">{today}</p>
      </div>

      {/* Sales Pipeline Card */}
      <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink">Sales Pipeline</h2>
          <button className="text-sm text-primary-600 font-medium hover:underline">View</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-ink">{openLeads.length}</div>
            <div className="text-xs text-ink-muted">Open leads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ink">{formatCurrency(pipelineValue, state.workspace?.currency || 'INR')}</div>
            <div className="text-xs text-ink-muted">Pipeline value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ink">{wonLeads.length}</div>
            <div className="text-xs text-ink-muted">Won / mo</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ink">{winRate}%</div>
            <div className="text-xs text-ink-muted">Win rate</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-line">
          <div className="text-xs font-medium text-ink-muted mb-2">Leads by source</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sourceCounts).map(([source, count]) => (
              <span key={source} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas text-xs font-medium text-ink">
                {source} <span className="text-ink-faint">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* This Month Stats */}
      <div>
        <h2 className="text-lg font-semibold text-ink mb-3">This month</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-xs text-ink-muted">Revenue</span>
            </div>
            <div className="text-xl font-bold text-ink">{formatCurrency(thisMonthRevenue, state.workspace?.currency || 'INR')}</div>
            <div className="text-xs text-ink-faint mt-1">{state.projects.length} new projects</div>
          </div>
          <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight size={14} className="text-green-600" />
              <span className="text-xs text-ink-muted">Received</span>
            </div>
            <div className="text-xl font-bold text-ink">{formatCurrency(totalReceived, state.workspace?.currency || 'INR')}</div>
            <div className="text-xs text-ink-faint mt-1">{state.payments.length} payments</div>
          </div>
          <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownRight size={14} className="text-red-500" />
              <span className="text-xs text-ink-muted">Expenses</span>
            </div>
            <div className="text-xl font-bold text-ink">{formatCurrency(0, state.workspace?.currency || 'INR')}</div>
            <div className="text-xs text-ink-faint mt-1">Team payouts & tools</div>
          </div>
          <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-primary-600" />
              <span className="text-xs text-ink-muted">In account</span>
            </div>
            <div className="text-xl font-bold text-ink">{formatCurrency(totalReceived, state.workspace?.currency || 'INR')}</div>
            <div className="text-xs text-ink-faint mt-1">Received − Expenses</div>
          </div>
        </div>
      </div>

      {/* Pipeline & Clients */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
          <h3 className="font-semibold text-ink mb-4">Pipeline & clients</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink-muted">New projects</span>
              <span className="text-sm font-semibold">{state.projects.filter(p => p.status === 'new').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink-muted">Ongoing</span>
              <span className="text-sm font-semibold">{state.projects.filter(p => p.status === 'ongoing').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink-muted">Completed</span>
              <span className="text-sm font-semibold">{state.projects.filter(p => p.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-line">
              <span className="text-sm text-ink-muted">Total projects</span>
              <span className="text-sm font-semibold">{state.projects.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink-muted">Total clients</span>
              <span className="text-sm font-semibold">{state.clients.length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-line">
              <span className="text-sm text-ink-muted">Active retainers</span>
              <span className="text-sm font-semibold">{activeRetainers.length} <span className="text-ink-faint text-xs">MRR {formatCurrency(mrr, state.workspace?.currency || 'INR')}/mo</span></span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
          <h3 className="font-semibold text-ink mb-4">Revenue by type</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink-muted">Payments received</span>
                <span className="font-semibold">{formatCurrency(totalReceived, state.workspace?.currency || 'INR')}</span>
              </div>
              <div className="h-3 bg-canvas rounded-full overflow-hidden flex">
                <div className="bg-primary-600 h-full rounded-full" style={{ width: '65%' }}></div>
                <div className="bg-primary-200 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-ink-faint mt-1">
                <span>Freelance 65%</span>
                <span>Retainer 35%</span>
              </div>
            </div>
            <div className="pt-3 border-t border-line space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Total invoiced</span>
                <span className="font-semibold">{formatCurrency(totalInvoiced, state.workspace?.currency || 'INR')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Pending</span>
                <span className="font-semibold text-amber-600">{formatCurrency(pending, state.workspace?.currency || 'INR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">Upcoming reminders</h3>
            <button className="text-sm text-primary-600 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {upcomingMeetings.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-canvas">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calendar size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{m.title}</div>
                  <div className="text-xs text-ink-faint">{m.date} at {m.time}</div>
                </div>
                <span className="text-xs text-primary-600 font-medium">In 2h</span>
              </div>
            ))}
            {upcomingTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-canvas">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <CheckSquare size={14} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{t.title}</div>
                  <div className="text-xs text-ink-faint">Due {t.dueDate}</div>
                </div>
                <span className={`text-xs font-medium ${t.priority === 'high' ? 'text-red-600' : 'text-ink-faint'}`}>
                  {t.priority}
                </span>
              </div>
            ))}
            {upcomingMeetings.length === 0 && upcomingTasks.length === 0 && (
              <p className="text-sm text-ink-faint text-center py-4">No upcoming reminders</p>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">Recent clients</h3>
            <button className="text-sm text-primary-600 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {state.clients.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-canvas">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-700">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{c.name}</div>
                  <div className="text-xs text-ink-faint">{c.phone}</div>
                </div>
                <span className="text-xs text-ink-faint">{timeAgo(c.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-surface rounded-2xl border border-line p-5 shadow-soft hover:shadow-soft-md transition-shadow text-left group">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
            <Plus size={18} className="text-primary-600" />
          </div>
          <div className="text-sm font-semibold text-ink">Add client</div>
          <div className="text-xs text-ink-faint mt-0.5">Create a new client profile</div>
        </button>
        <button className="bg-surface rounded-2xl border border-line p-5 shadow-soft hover:shadow-soft-md transition-shadow text-left group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <Calendar size={18} className="text-blue-600" />
          </div>
          <div className="text-sm font-semibold text-ink">Schedule meeting</div>
          <div className="text-xs text-ink-faint mt-0.5">Book a call with a client</div>
        </button>
      </div>
    </div>
  );
}

// Leads Pipeline Page
function LeadsPage() {
  const state = useAppState();
  const [showAddLead, setShowAddLead] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const filteredLeads = state.leads.filter(l =>
    !l.isLost && !l.convertedToClientId &&
    (l.name.toLowerCase().includes(search.toLowerCase()) ||
     l.company.toLowerCase().includes(search.toLowerCase()) ||
     l.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDrop = (stageId: string) => {
    if (draggedLead) {
      actions.moveLead(draggedLead, stageId);
      setDraggedLead(null);
    }
  };

  const lead = selectedLead ? state.leads.find(l => l.id === selectedLead) : null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Leads</h1>
          <p className="text-ink-muted text-sm">Manage your sales pipeline</p>
        </div>
        <button onClick={() => setShowAddLead(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember transition-all">
          <Plus size={16} /> Add lead
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-surface border border-line text-sm">
          <span className="text-ink-muted">Open: </span><span className="font-semibold">{state.leads.filter(l => !l.isWon && !l.isLost).length}</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-surface border border-line text-sm">
          <span className="text-ink-muted">Pipeline: </span><span className="font-semibold">{formatCurrency(state.leads.filter(l => !l.isWon && !l.isLost).reduce((s, l) => s + l.estimatedValue, 0), state.workspace?.currency || 'INR')}</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-surface border border-line text-sm">
          <span className="text-ink-muted">Won: </span><span className="font-semibold">{state.leads.filter(l => l.isWon).length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button className="px-3 py-2.5 rounded-xl border border-line bg-surface text-ink-muted hover:bg-canvas">
          <Filter size={16} />
        </button>
        <button className="px-3 py-2.5 rounded-xl border border-line bg-surface text-ink-muted hover:bg-canvas">
          <Download size={16} />
        </button>
        <button className="px-3 py-2.5 rounded-xl border border-line bg-surface text-ink-muted hover:bg-canvas">
          <Upload size={16} />
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {state.stages.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.stageId === stage.id);
          return (
            <div key={stage.id} className="flex-shrink-0 w-72"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></div>
                  <span className="text-sm font-semibold text-ink">{stage.name}</span>
                  <span className="text-xs text-ink-faint bg-canvas px-1.5 py-0.5 rounded">{stageLeads.length}</span>
                </div>
                <button onClick={() => setShowAddLead(true)} className="text-ink-faint hover:text-ink">
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {stageLeads.map(l => (
                  <div key={l.id} draggable
                    onDragStart={() => setDraggedLead(l.id)}
                    onDragEnd={() => setDraggedLead(null)}
                    onClick={() => setSelectedLead(l.id)}
                    className="bg-surface rounded-xl border border-line p-3 shadow-soft cursor-pointer hover:shadow-soft-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-ink">{l.name}</div>
                        <div className="text-xs text-ink-muted">{l.company}</div>
                      </div>
                      <GripVertical size={14} className="text-ink-faint flex-shrink-0" />
                    </div>
                    <div className="text-sm font-medium text-ink mb-2">{formatCurrency(l.estimatedValue, l.currency)}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-canvas text-ink-muted">{l.source}</span>
                      {l.followUpDate && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">Follow up</span>
                      )}
                    </div>
                    {l.isWon && (
                      <div className="mt-2 text-xs px-2 py-0.5 rounded-md bg-green-50 text-green-700 inline-block">Won ✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Drawer */}
      {lead && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/20" onClick={() => setSelectedLead(null)}></div>
          <div className="w-full max-w-md bg-surface border-l border-line shadow-soft-lg overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-ink">{lead.company}</h2>
                <span className="text-xs text-ink-muted">{state.stages.find(s => s.id === lead.stageId)?.name}</span>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-ink-faint hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <button onClick={() => {
                  const reason = prompt('Reason for marking as lost:');
                  if (reason) { actions.updateLead(lead.id, { isLost: true, lostReason: reason }); setSelectedLead(null); }
                }} className="flex-1 py-2 text-sm font-medium border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
                  Mark Lost
                </button>
                <button onClick={() => {
                  const result = actions.convertLeadToClient(lead.id);
                  if (result.success) { setSelectedLead(null); }
                  else { alert(result.error); }
                }} className="flex-1 py-2 text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700">
                  Convert to Client
                </button>
              </div>

              <div className="bg-canvas rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-ink">Lead Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-ink-muted">Name:</span> <span className="text-ink">{lead.name}</span></div>
                  <div><span className="text-ink-muted">Company:</span> <span className="text-ink">{lead.company}</span></div>
                  <div><span className="text-ink-muted">Email:</span> <span className="text-ink">{lead.email}</span></div>
                  <div><span className="text-ink-muted">Phone:</span> <span className="text-ink">{lead.phone}</span></div>
                  <div><span className="text-ink-muted">Source:</span> <span className="text-ink">{lead.source}</span></div>
                  <div><span className="text-ink-muted">Value:</span> <span className="text-ink font-medium">{formatCurrency(lead.estimatedValue, lead.currency)}</span></div>
                </div>
                {lead.notes && <div className="text-sm"><span className="text-ink-muted">Notes:</span> <span className="text-ink">{lead.notes}</span></div>}
              </div>

              <div className="bg-canvas rounded-xl p-4">
                <h3 className="text-sm font-semibold text-ink mb-2">Pipeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-muted">Stage</span><span>{state.stages.find(s => s.id === lead.stageId)?.name}</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Created</span><span>{new Date(lead.createdAt).toLocaleDateString()}</span></div>
                  {lead.followUpDate && <div className="flex justify-between"><span className="text-ink-muted">Follow up</span><span>{lead.followUpDate}</span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} />}
    </div>
  );
}

// Add Lead Modal
function AddLeadModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', source: 'Website',
    stageId: state.stages[0]?.id || '', estimatedValue: 0, currency: state.workspace?.currency || 'INR', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions.addLead({ ...form, isWon: false, isLost: false, assignedTo: state.currentUserId || '' });
    if ((result as any).error) { alert((result as any).error); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-semibold text-ink">Add new lead</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Contact name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Company *</label>
              <input type="text" required value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Source</label>
              <select value={form.source} onChange={e => setForm({...form, source: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Stage</label>
              <select value={form.stageId} onChange={e => setForm({...form, stageId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {state.stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Estimated value</label>
              <input type="number" value={form.estimatedValue} onChange={e => setForm({...form, estimatedValue: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Currency</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {CURRENCIES.slice(0, 10).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Add lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Clients Page
function ClientsPage() {
  const state = useAppState();
  const [search, setSearch] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filteredClients = state.clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const client = selectedClient ? state.clients.find(c => c.id === selectedClient) : null;
  const clientProjects = client ? state.projects.filter(p => p.clientId === client.id) : [];
  const clientInvoices = client ? state.invoices.filter(i => i.clientId === client.id) : [];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Clients</h1>
          <p className="text-ink-muted text-sm">{state.clients.length} total clients</p>
        </div>
        <button onClick={() => setShowAddClient(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember transition-all">
          <Plus size={16} /> Add client
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredClients.map(c => (
          <div key={c.id} onClick={() => setSelectedClient(c.id)}
            className="bg-surface rounded-2xl border border-line p-4 shadow-soft hover:shadow-soft-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary-700">{c.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink">{c.name}</div>
                <div className="text-xs text-ink-muted">{c.company}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md ${c.status === 'active' ? 'bg-green-50 text-green-700' : c.status === 'on-hold' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                {c.status}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-ink-faint">
              <span className="flex items-center gap-1"><Mail size={12} />{c.email}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-canvas text-ink-muted">{c.currency}</span>
              {c.portalEnabled && <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">Portal</span>}
              {c.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded bg-canvas text-ink-faint">{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Drawer */}
      {client && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/20" onClick={() => setSelectedClient(null)}></div>
          <div className="w-full max-w-lg bg-surface border-l border-line shadow-soft-lg overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">{client.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-ink">{client.name}</h2>
                  <p className="text-xs text-ink-muted">{client.company}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-ink-faint hover:text-ink"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-ink-muted">Email:</span> <span className="text-ink">{client.email}</span></div>
                <div><span className="text-ink-muted">Phone:</span> <span className="text-ink">{client.phone}</span></div>
                <div><span className="text-ink-muted">Currency:</span> <span className="text-ink">{client.currency}</span></div>
                <div><span className="text-ink-muted">Status:</span> <span className="text-ink capitalize">{client.status}</span></div>
              </div>

              <div className="bg-canvas rounded-xl p-4">
                <h3 className="text-sm font-semibold text-ink mb-3">Projects ({clientProjects.length})</h3>
                {clientProjects.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-line last:border-0">
                    <span className="text-sm text-ink">{p.name}</span>
                    <span className="text-xs text-ink-muted">{formatCurrency(p.budget, p.currency)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-canvas rounded-xl p-4">
                <h3 className="text-sm font-semibold text-ink mb-3">Invoices ({clientInvoices.length})</h3>
                {clientInvoices.map(i => (
                  <div key={i.id} className="flex justify-between items-center py-2 border-b border-line last:border-0">
                    <div>
                      <span className="text-sm text-ink">{i.number}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${i.status === 'paid' ? 'bg-green-50 text-green-700' : i.status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>{i.status}</span>
                    </div>
                    <span className="text-sm font-medium text-ink">{formatCurrency(i.total, i.currency)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {!client.portalEnabled ? (
                  <button onClick={() => {
                    const result = actions.enablePortalForClient(client.id);
                    if ((result as any).error) alert((result as any).error);
                    else if ((result as any).success) {
                      alert(`Portal enabled!\n\nMagic link token: ${(result as any).token}\nTemp password: ${(result as any).tempPassword}\n\nAn invite email would be sent to ${client.email}`);
                    }
                  }} className="w-full py-2 text-sm font-medium rounded-xl border border-line text-ink hover:bg-canvas">
                    Enable Portal Access
                  </button>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        // Simulate entering portal as this client
                        const pu = state.portalUsers.find(p => p.clientId === client.id);
                        if (pu) {
                          actions.portalLogin(pu.token);
                        }
                      }} className="flex-1 py-2 text-sm font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700">
                        Open Portal as Client
                      </button>
                      <button onClick={() => {
                        if (confirm('Revoke portal access?')) {
                          actions.disablePortalForClient(client.id);
                        }
                      }} className="py-2 px-3 text-sm font-medium rounded-xl border border-red-200 text-red-600 hover:bg-red-50">
                        Revoke
                      </button>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-xs text-green-800">
                      <div className="font-medium mb-1">✓ Portal active</div>
                      <div>Portal URL: portal.clientertap.com/{state.workspace?.slug}</div>
                      {state.portalUsers.find(p => p.clientId === client.id)?.lastLoginAt && (
                        <div className="mt-1">Last login: {new Date(state.portalUsers.find(p => p.clientId === client.id)!.lastLoginAt!).toLocaleString()}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} />}
    </div>
  );
}

function AddClientModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', address: '', currency: state.workspace?.currency || 'INR',
    status: 'active' as const, tags: [] as string[], portalEnabled: false, notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions.addClient(form);
    if (result.error) { alert(result.error); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-semibold text-ink">Add new client</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Company *</label>
              <input type="text" required value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Currency</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {CURRENCIES.slice(0, 10).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="active">Active</option>
                <option value="lead">Lead</option>
                <option value="on-hold">On hold</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Address</label>
            <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="portal" checked={form.portalEnabled} onChange={e => setForm({...form, portalEnabled: e.target.checked})}
              className="w-4 h-4 rounded border-line text-primary-600 focus:ring-primary-500" />
            <label htmlFor="portal" className="text-sm text-ink">Enable client portal access</label>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Add client</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Projects Page
function ProjectsPage() {
  const state = useAppState();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showAdd, setShowAdd] = useState(false);

  const columns = [
    { id: 'new', label: 'New', color: 'bg-blue-500' },
    { id: 'ongoing', label: 'Ongoing', color: 'bg-amber-500' },
    { id: 'completed', label: 'Completed', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Projects</h1>
          <p className="text-ink-muted text-sm">{state.projects.length} projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-line rounded-xl overflow-hidden">
            <button onClick={() => setView('kanban')} className={`px-3 py-2 text-sm ${view === 'kanban' ? 'bg-primary-50 text-primary-600' : 'text-ink-muted'}`}>Board</button>
            <button onClick={() => setView('list')} className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-ink-muted'}`}>List</button>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember transition-all">
            <Plus size={16} /> New project
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid md:grid-cols-3 gap-4">
          {columns.map(col => {
            const colProjects = state.projects.filter(p => p.status === col.id);
            return (
              <div key={col.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
                  <span className="text-sm font-semibold text-ink">{col.label}</span>
                  <span className="text-xs text-ink-faint">{colProjects.length}</span>
                </div>
                <div className="space-y-2">
                  {colProjects.map(p => {
                    const client = state.clients.find(c => c.id === p.clientId);
                    const paid = state.invoices.filter(i => i.projectId === p.id).reduce((s, i) => s + i.amountPaid, 0);
                    const pending = p.budget - paid;
                    return (
                      <div key={p.id} className="bg-surface rounded-xl border border-line p-3 shadow-soft hover:shadow-soft-md transition-shadow">
                        <div className="text-sm font-semibold text-ink mb-1">{p.name}</div>
                        <div className="text-xs text-ink-muted mb-2">{client?.company || 'No client'}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ink font-medium">{formatCurrency(p.budget, p.currency)}</span>
                          {pending > 0 && <span className="text-amber-600">{formatCurrency(pending, p.currency)} pending</span>}
                        </div>
                        {p.deadline && <div className="text-xs text-ink-faint mt-1">Due {p.deadline}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Project</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Client</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Budget</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {state.projects.map(p => {
                const client = state.clients.find(c => c.id === p.clientId);
                return (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-canvas">
                    <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{client?.company}</td>
                    <td className="px-4 py-3 text-ink">{formatCurrency(p.budget, p.currency)}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded capitalize ${p.status === 'completed' ? 'bg-green-50 text-green-700' : p.status === 'ongoing' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{p.status}</span></td>
                    <td className="px-4 py-3 text-ink-muted">{p.deadline}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddProjectModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddProjectModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    clientId: state.clients[0]?.id || '', name: '', type: 'one-off' as const,
    budget: 0, currency: state.workspace?.currency || 'INR', startDate: '', deadline: '', description: '', status: 'new' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions.addProject(form);
    if (result.error) { alert(result.error); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-semibold text-ink">New project</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Client *</label>
            <select required value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
              {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Project name *</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="one-off">One-off</option>
                <option value="retainer">Monthly Retainer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Budget</label>
              <input type="number" value={form.budget} onChange={e => setForm({...form, budget: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Start date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Create project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Invoices & Payments Page
function InvoicesPage() {
  const state = useAppState();
  const [tab, setTab] = useState<'invoices' | 'payments'>('invoices');
  const [showAddInvoice, setShowAddInvoice] = useState(false);

  const totalInvoiced = state.invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = state.invoices.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = totalInvoiced - totalPaid;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Payments</h1>
          <p className="text-ink-muted text-sm">Invoices, payments and expenses</p>
        </div>
        <button onClick={() => setShowAddInvoice(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember transition-all">
          <Plus size={16} /> New invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
          <div className="text-xs text-ink-muted mb-1">Total invoiced</div>
          <div className="text-xl font-bold text-ink">{formatCurrency(totalInvoiced, state.workspace?.currency || 'INR')}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
          <div className="text-xs text-ink-muted mb-1">Received</div>
          <div className="text-xl font-bold text-green-600">{formatCurrency(totalPaid, state.workspace?.currency || 'INR')}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
          <div className="text-xs text-ink-muted mb-1">Outstanding</div>
          <div className="text-xl font-bold text-amber-600">{formatCurrency(outstanding, state.workspace?.currency || 'INR')}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line">
        <button onClick={() => setTab('invoices')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'invoices' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
          Invoices ({state.invoices.length})
        </button>
        <button onClick={() => setTab('payments')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'payments' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
          Payments ({state.payments.length})
        </button>
      </div>

      {tab === 'invoices' ? (
        <div className="bg-surface rounded-2xl border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Invoice</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Client</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Due</th>
              </tr>
            </thead>
            <tbody>
              {state.invoices.map(inv => {
                const client = state.clients.find(c => c.id === inv.clientId);
                return (
                  <tr key={inv.id} className="border-b border-line last:border-0 hover:bg-canvas">
                    <td className="px-4 py-3 font-medium text-ink">{inv.number}</td>
                    <td className="px-4 py-3 text-ink-muted">{client?.company}</td>
                    <td className="px-4 py-3 text-ink font-medium">{formatCurrency(inv.total, inv.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${inv.status === 'paid' ? 'bg-green-50 text-green-700' : inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : inv.status === 'overdue' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{inv.dueDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Date</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Client</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Method</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Reference</th>
              </tr>
            </thead>
            <tbody>
              {state.payments.map(pay => {
                const client = state.clients.find(c => c.id === pay.clientId);
                return (
                  <tr key={pay.id} className="border-b border-line last:border-0 hover:bg-canvas">
                    <td className="px-4 py-3 text-ink-muted">{pay.date}</td>
                    <td className="px-4 py-3 text-ink">{client?.company}</td>
                    <td className="px-4 py-3 text-ink font-medium">{formatCurrency(pay.amount, pay.currency)}</td>
                    <td className="px-4 py-3 text-ink-muted">{pay.method}</td>
                    <td className="px-4 py-3 text-ink-faint text-xs">{pay.reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAddInvoice && <AddInvoiceModal onClose={() => setShowAddInvoice(false)} />}
    </div>
  );
}

function AddInvoiceModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    clientId: state.clients[0]?.id || '', projectId: '', issueDate: new Date().toISOString().split('T')[0],
    dueDate: '', currency: state.workspace?.currency || 'INR', items: [{ id: '1', description: '', quantity: 1, rate: 0, taxRate: 18, amount: 0 }],
    subtotal: 0, taxAmount: 0, discount: 0, total: 0, amountPaid: 0, status: 'draft' as const, notes: ''
  });

  const updateItem = (idx: number, field: string, value: any) => {
    const items = [...form.items];
    (items[idx] as any)[field] = value;
    items[idx].amount = items[idx].quantity * items[idx].rate;
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const taxAmount = items.reduce((s, i) => s + (i.amount * i.taxRate / 100), 0);
    setForm({ ...form, items, subtotal, taxAmount, total: subtotal + taxAmount - form.discount });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.addInvoice(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-semibold text-ink">Create invoice</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Client *</label>
              <select required value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Due date *</label>
              <input type="date" required value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Line items</label>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <input type="text" placeholder="Description" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} required
                      className="w-full px-3 py-2 rounded-lg border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-2 rounded-lg border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(idx, 'rate', Number(e.target.value))}
                      className="w-full px-2 py-2 rounded-lg border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Tax %" value={item.taxRate} onChange={e => updateItem(idx, 'taxRate', Number(e.target.value))}
                      className="w-full px-2 py-2 rounded-lg border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="col-span-1 text-right text-sm font-medium text-ink">
                    {item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setForm({...form, items: [...form.items, { id: String(Date.now()), description: '', quantity: 1, rate: 0, taxRate: 18, amount: 0 }]})}
              className="mt-2 text-sm text-primary-600 font-medium hover:underline">+ Add line item</button>
          </div>

          <div className="bg-canvas rounded-xl p-4 flex justify-end">
            <div className="text-right space-y-1">
              <div className="text-sm"><span className="text-ink-muted">Subtotal: </span><span className="font-medium">{form.subtotal.toLocaleString()}</span></div>
              <div className="text-sm"><span className="text-ink-muted">Tax: </span><span className="font-medium">{form.taxAmount.toLocaleString()}</span></div>
              <div className="text-lg font-bold text-ink pt-1 border-t border-line mt-1">Total: {form.total.toLocaleString()} {form.currency}</div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Create invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Meetings Page — Enhanced with Google Meet, Calendar sync, reminders
function MeetingsPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [showPushSetup, setShowPushSetup] = useState(false);
  const [tab, setTab] = useState<'upcoming' | 'past' | 'calendar'>('upcoming');

  const now = new Date();
  const upcoming = state.meetings.filter(m => new Date(m.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = state.meetings.filter(m => new Date(m.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEnablePush = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          actions.registerPushSubscription('push-endpoint-' + Date.now(), { p256dh: 'mock-p256dh-key', auth: 'mock-auth-key' });
          alert('✓ Push notifications enabled! You will receive meeting reminders.');
          setShowPushSetup(false);
        }
      });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Meetings</h1>
          <p className="text-ink-muted text-sm">{upcoming.length} upcoming • {past.length} past</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPushSetup(true)}
            className="inline-flex items-center gap-2 px-3 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">
            <Bell size={14} /> Push reminders
          </button>
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember transition-all">
            <Plus size={16} /> Schedule meeting
          </button>
        </div>
      </div>

      {/* Google Calendar Sync Status */}
      <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Google Calendar sync</div>
            <div className="text-xs text-ink-muted">Two-way sync with your Google Calendar</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-700 flex items-center gap-1">
            <CheckCircle2 size={12} /> Connected
          </span>
          <button className="text-xs text-primary-600 font-medium hover:underline">Sync now</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line">
        <button onClick={() => setTab('upcoming')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'upcoming' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
          Upcoming ({upcoming.length})
        </button>
        <button onClick={() => setTab('past')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'past' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
          Past ({past.length})
        </button>
        <button onClick={() => setTab('calendar')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'calendar' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
          Calendar view
        </button>
      </div>

      {tab === 'calendar' ? (
        <CalendarView meetings={state.meetings} />
      ) : (
        <div className="space-y-3">
          {(tab === 'upcoming' ? upcoming : past).map(m => {
            const client = state.clients.find(c => c.id === m.clientId);
            const isPast = new Date(m.date) < now;
            return (
              <div key={m.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isPast ? 'bg-gray-50' : 'bg-blue-50'}`}>
                    <span className={`text-xs font-medium ${isPast ? 'text-gray-500' : 'text-blue-600'}`}>{new Date(m.date).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className={`text-lg font-bold ${isPast ? 'text-gray-700' : 'text-blue-700'}`}>{new Date(m.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-ink">{m.title}</div>
                        <div className="text-xs text-ink-muted mt-0.5">
                          {client?.company && <span>{client.company} • </span>}
                          {m.time} • {m.duration}min
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {m.calendarEventId && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 flex items-center gap-0.5" title="Synced to Google Calendar">
                            <Calendar size={10} /> Synced
                          </span>
                        )}
                      </div>
                    </div>
                    {m.agenda && <div className="text-xs text-ink-faint mt-1.5">{m.agenda}</div>}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {m.meetLink && (
                        <a href={m.meetLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100">
                          <Globe size={12} /> Join Meet
                        </a>
                      )}
                      <span className="text-xs px-2 py-1 rounded-lg bg-canvas text-ink-muted">
                        {m.attendees.length} attendee{m.attendees.length !== 1 ? 's' : ''}
                      </span>
                      {m.reminderTime && !isPast && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-amber-50 text-amber-700 flex items-center gap-1">
                          <Bell size={10} /> Reminder {m.reminderTime}m before
                        </span>
                      )}
                      {m.reminderSent && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-700 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Reminder sent
                        </span>
                      )}
                      {!isPast && !m.reminderSent && m.reminderTime && (
                        <button onClick={() => actions.sendMeetingReminder(m.id)}
                          className="text-xs text-primary-600 font-medium hover:underline">
                          Send reminder now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {(tab === 'upcoming' ? upcoming : past).length === 0 && (
            <div className="text-center py-12 text-ink-faint">
              <Calendar size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No {tab} meetings</p>
            </div>
          )}
        </div>
      )}

      {showAdd && <AddMeetingModal onClose={() => setShowAdd(false)} />}
      {showPushSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowPushSetup(false)}></div>
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-soft-lg border border-line p-6">
            <h2 className="font-semibold text-ink text-lg mb-2">Enable push reminders</h2>
            <p className="text-sm text-ink-muted mb-4">Get browser notifications before your meetings start. Works even when the tab is closed.</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-ink"><CheckCircle2 size={14} className="text-green-600" /> Meeting reminders 15min before</div>
              <div className="flex items-center gap-2 text-sm text-ink"><CheckCircle2 size={14} className="text-green-600" /> Task due date alerts</div>
              <div className="flex items-center gap-2 text-sm text-ink"><CheckCircle2 size={14} className="text-green-600" /> Payment received notifications</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowPushSetup(false)} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
              <button onClick={handleEnablePush} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Enable notifications</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Calendar View (month grid)
function CalendarView({ meetings }: { meetings: Meeting[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getMeetingsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meetings.filter(m => m.date === dateStr);
  };

  return (
    <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-1.5 rounded-lg hover:bg-canvas text-ink-muted">←</button>
        <h3 className="text-sm font-semibold text-ink">{currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-1.5 rounded-lg hover:bg-canvas text-ink-muted">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-ink-muted py-1">{d}</div>
        ))}
        {days.map((day, idx) => {
          const dayMeetings = day ? getMeetingsForDay(day) : [];
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          return (
            <div key={idx} className={`min-h-[60px] p-1 rounded-lg border ${isToday ? 'border-primary-300 bg-primary-50/30' : 'border-transparent'} ${day ? 'hover:bg-canvas' : ''}`}>
              {day && (
                <>
                  <div className={`text-xs font-medium ${isToday ? 'text-primary-600' : 'text-ink-muted'}`}>{day}</div>
                  {dayMeetings.slice(0, 2).map(m => (
                    <div key={m.id} className="mt-0.5 text-[10px] px-1 py-0.5 rounded bg-blue-50 text-blue-700 truncate" title={m.title}>
                      {m.time} {m.title}
                    </div>
                  ))}
                  {dayMeetings.length > 2 && (
                    <div className="text-[10px] text-ink-faint mt-0.5">+{dayMeetings.length - 2} more</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddMeetingModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    title: '', clientId: state.clients[0]?.id || '', date: '', time: '10:00', duration: 30, attendees: [] as string[], agenda: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.addMeetingWithIntegration({ ...form, reminderTime: 15 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line">
        <div className="border-b border-line p-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Schedule meeting</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Client</label>
              <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {state.clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Date *</label>
              <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Duration (min)</label>
              <input type="number" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Agenda</label>
            <textarea value={form.agenda} onChange={e => setForm({...form, agenda: e.target.value})} rows={2}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tasks Page
function TasksPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);

  const columns = [
    { id: 'todo', label: 'To Do', color: 'bg-gray-400' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
    { id: 'done', label: 'Done', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tasks</h1>
          <p className="text-ink-muted text-sm">{state.tasks.length} tasks</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember transition-all">
          <Plus size={16} /> Add task
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {columns.map(col => {
          const colTasks = state.tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
                <span className="text-sm font-semibold text-ink">{col.label}</span>
                <span className="text-xs text-ink-faint">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {colTasks.map(t => (
                  <div key={t.id} className="bg-surface rounded-xl border border-line p-3 shadow-soft">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-ink">{t.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${t.priority === 'high' ? 'bg-red-50 text-red-600' : t.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}`}>
                        {t.priority}
                      </span>
                    </div>
                    {t.description && <p className="text-xs text-ink-muted mb-2">{t.description}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-faint">Due {t.dueDate}</span>
                      <button onClick={() => {
                        const nextStatus = col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'done' : 'todo';
                        actions.updateTask(t.id, { status: nextStatus as any });
                      }} className="text-xs text-primary-600 font-medium hover:underline">
                        Move →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddTaskModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    title: '', description: '', assigneeId: state.currentUserId || '', projectId: '', dueDate: '', priority: 'medium' as const, status: 'todo' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.addTask(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line">
        <div className="border-b border-line p-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Add task</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Due date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Add task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Activity Page
function ActivityPage() {
  const state = useAppState();

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Activity</h1>
        <p className="text-ink-muted text-sm">Recent actions across your workspace</p>
      </div>

      <div className="bg-surface rounded-2xl border border-line divide-y divide-line">
        {state.activities.map(a => (
          <div key={a.id} className="px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
              {a.type.includes('payment') ? <DollarSign size={14} className="text-green-600" /> :
               a.type.includes('meeting') ? <Calendar size={14} className="text-blue-600" /> :
               a.type.includes('lead') ? <Users size={14} className="text-purple-600" /> :
               <FolderKanban size={14} className="text-primary-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink">{a.description}</p>
              <p className="text-xs text-ink-faint">{timeAgo(a.createdAt)}</p>
            </div>
          </div>
        ))}
        {state.activities.length === 0 && (
          <div className="text-center py-12 text-ink-faint">
            <Activity size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Page
function SettingsPage() {
  const state = useAppState();
  const [tab, setTab] = useState('workspace');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: UserPlus },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'data', label: 'Data & Privacy', icon: FileText },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-ink-muted text-sm">Manage your workspace and account</p>
      </div>

      <div className="flex border-b border-line overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap flex items-center gap-2 ${tab === t.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'workspace' && (
        <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Workspace name</label>
              <input type="text" defaultValue={state.workspace?.name}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Slug</label>
              <input type="text" defaultValue={state.workspace?.slug}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Base currency</label>
              <select defaultValue={state.workspace?.currency}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {CURRENCIES.slice(0, 10).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Country</label>
              <input type="text" defaultValue={state.workspace?.country}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <button className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Save changes</button>
        </div>
      )}

      {tab === 'billing' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-line p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-ink">Current plan</h3>
                <p className="text-sm text-ink-muted capitalize">{state.workspace?.plan} plan</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium capitalize">{state.workspace?.plan}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-canvas rounded-xl p-3">
                <div className="text-xs text-ink-muted">Clients</div>
                <div className="text-sm font-semibold">{state.clients.length} / {PLAN_LIMITS[state.workspace?.plan || 'free'].clients}</div>
              </div>
              <div className="bg-canvas rounded-xl p-3">
                <div className="text-xs text-ink-muted">Projects</div>
                <div className="text-sm font-semibold">{state.projects.length} / {PLAN_LIMITS[state.workspace?.plan || 'free'].projects}</div>
              </div>
              <div className="bg-canvas rounded-xl p-3">
                <div className="text-xs text-ink-muted">Leads</div>
                <div className="text-sm font-semibold">{state.leads.filter(l => !l.isWon && !l.isLost).length} / {PLAN_LIMITS[state.workspace?.plan || 'free'].leads}</div>
              </div>
              <div className="bg-canvas rounded-xl p-3">
                <div className="text-xs text-ink-muted">AI Quotes</div>
                <div className="text-sm font-semibold">{state.aiQuotesUsed} / {PLAN_LIMITS[state.workspace?.plan || 'free'].aiQuotes}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {state.workspace?.plan !== 'pro' && (
                <button onClick={() => actions.changePlan('pro')}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">
                  Upgrade to Pro — $19/mo
                </button>
              )}
              {state.workspace?.plan !== 'ultra' && (
                <button onClick={() => actions.changePlan('ultra')}
                  className="px-4 py-2 bg-espresso hover:bg-espresso-soft text-espresso-text text-sm font-semibold rounded-xl">
                  Upgrade to Ultra — $39/mo
                </button>
              )}
              {state.workspace?.plan !== 'free' && (
                <button onClick={() => actions.changePlan('free')}
                  className="px-4 py-2 border border-line text-ink-muted text-sm font-medium rounded-xl hover:bg-canvas">
                  Downgrade to Free
                </button>
              )}
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`rounded-2xl border p-5 ${state.workspace?.plan === 'free' ? 'border-primary-500 bg-primary-50/30' : 'border-line bg-surface'}`}>
              <h4 className="font-semibold text-ink">Free</h4>
              <div className="text-2xl font-bold text-ink mt-1">$0<span className="text-sm font-normal text-ink-muted">/mo</span></div>
              <ul className="mt-3 space-y-1.5 text-xs text-ink-muted">
                <li>✓ 3 clients</li>
                <li>✓ 5 projects</li>
                <li>✓ 20 active leads</li>
                <li>✓ 1 teammate</li>
                <li>✓ 100 MB storage</li>
              </ul>
            </div>
            <div className={`rounded-2xl border p-5 ${state.workspace?.plan === 'pro' ? 'border-primary-500 bg-primary-50/30 shadow-ember' : 'border-line bg-surface'}`}>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-ink">Pro</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-primary-100 text-primary-700 font-medium">Popular</span>
              </div>
              <div className="text-2xl font-bold text-ink mt-1">$19<span className="text-sm font-normal text-ink-muted">/mo</span></div>
              <ul className="mt-3 space-y-1.5 text-xs text-ink-muted">
                <li>✓ 20 clients</li>
                <li>✓ 40 projects</li>
                <li>✓ 200 leads</li>
                <li>✓ 5 teammates</li>
                <li>✓ 1 GB storage</li>
                <li>✓ 25 AI quotes/mo</li>
              </ul>
            </div>
            <div className={`rounded-2xl border p-5 ${state.workspace?.plan === 'ultra' ? 'border-primary-500 bg-primary-50/30' : 'border-line bg-surface'}`}>
              <h4 className="font-semibold text-ink">Ultra</h4>
              <div className="text-2xl font-bold text-ink mt-1">$39<span className="text-sm font-normal text-ink-muted">/mo</span></div>
              <ul className="mt-3 space-y-1.5 text-xs text-ink-muted">
                <li>✓ Unlimited everything</li>
                <li>✓ 10 GB storage</li>
                <li>✓ 100 AI quotes/mo</li>
                <li>✓ White label</li>
                <li>✓ Custom domain</li>
                <li>✓ Lead integrations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="bg-surface rounded-2xl border border-line p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">Team members</h3>
            <button className="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">
              <Plus size={14} /> Invite
            </button>
          </div>
          <div className="space-y-3">
            {state.users.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-canvas">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-700">{u.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{u.name}</div>
                  <div className="text-xs text-ink-faint">{u.email}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-primary-50 text-primary-700 capitalize">{u.role}</span>
              </div>
            ))}
          </div>
          {state.users.length < PLAN_LIMITS[state.workspace?.plan || 'free'].teammates && (
            <p className="text-xs text-ink-faint mt-3">{PLAN_LIMITS[state.workspace?.plan || 'free'].teammates - state.users.length} seat(s) remaining</p>
          )}
        </div>
      )}

      {tab === 'notifications' && (
        <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
          <h3 className="font-semibold text-ink">Notification preferences</h3>
          {['Email notifications', 'Push notifications', 'Meeting reminders', 'Payment alerts', 'Lead follow-ups'].map(n => (
            <div key={n} className="flex items-center justify-between py-2">
              <span className="text-sm text-ink">{n}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
          <h3 className="font-semibold text-ink">Profile settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Full name</label>
              <input type="text" defaultValue={state.users[0]?.name}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Email</label>
              <input type="email" defaultValue={state.users[0]?.email}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Phone</label>
              <input type="tel" placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Timezone</label>
              <select defaultValue="America/New_York"
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Bio</label>
            <textarea placeholder="Tell us about yourself..." rows={3}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <button className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Save profile</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
            <h3 className="font-semibold text-ink">Password</h3>
            <p className="text-sm text-ink-muted">Last changed 30 days ago</p>
            <button onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">
              Change password
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
            <h3 className="font-semibold text-ink">Two-factor authentication</h3>
            <p className="text-sm text-ink-muted">Add an extra layer of security to your account</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-ink">Authenticator app</div>
                <div className="text-xs text-ink-muted">Use an app like Google Authenticator</div>
              </div>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">
                Enable
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
            <h3 className="font-semibold text-ink">Active sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-canvas">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Globe size={18} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">Current session</div>
                    <div className="text-xs text-ink-muted">Chrome on macOS • {state.workspace?.country || 'US'}</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">Active</span>
              </div>
            </div>
            <button className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50">
              Sign out all other sessions
            </button>
          </div>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-line p-6">
            <h3 className="font-semibold text-ink mb-4">Connected integrations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-canvas">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">Google Calendar</div>
                    <div className="text-xs text-ink-muted">Sync meetings and events</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">Connected</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-canvas">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <Mail size={18} className="text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">Gmail</div>
                    <div className="text-xs text-ink-muted">Send invoices and notifications</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg">
                  Connect
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-canvas">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <MessageSquare size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">Slack</div>
                    <div className="text-xs text-ink-muted">Get notifications in Slack</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg">
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'data' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
            <h3 className="font-semibold text-ink">Export your data</h3>
            <p className="text-sm text-ink-muted">Download all your data in CSV or JSON format</p>
            <div className="flex gap-2">
              <button className="px-4 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas flex items-center gap-2">
                <Download size={16} />
                Export as CSV
              </button>
              <button className="px-4 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas flex items-center gap-2">
                <Download size={16} />
                Export as JSON
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-line p-6 space-y-4">
            <h3 className="font-semibold text-ink">Privacy settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-ink">Marketing emails</div>
                  <div className="text-xs text-ink-muted">Receive product updates and tips</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-ink">Usage analytics</div>
                  <div className="text-xs text-ink-muted">Help us improve by sharing anonymous usage data</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 space-y-4">
            <h3 className="font-semibold text-red-900">Danger zone</h3>
            <p className="text-sm text-red-700">Once you delete your account, there is no going back. Please be certain.</p>
            <button onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl">
              Delete account
            </button>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowPasswordChange(false)}></div>
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-soft-lg border border-line p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">Change password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Current password</label>
                <input type="password" className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">New password</label>
                <input type="password" className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Confirm new password</label>
                <input type="password" className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowPasswordChange(false)} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
                <button onClick={() => { setShowPasswordChange(false); alert('Password changed successfully!'); }} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Update password</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-soft-lg border border-line p-6">
            <h2 className="text-lg font-semibold text-ink mb-2">Delete account?</h2>
            <p className="text-sm text-ink-muted mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="space-y-3">
              <input type="text" placeholder="Type 'DELETE' to confirm" className="w-full px-3 py-2 rounded-xl border border-red-200 bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-red-500" />
              <div className="flex gap-2">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
                <button onClick={() => { alert('Account deletion scheduled. You have 30 days to cancel.'); setShowDeleteConfirm(false); }} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl">Delete my account</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Documents Page — Full Phase 5 implementation
function DocumentsPage() {
  const state = useAppState();
  const [tab, setTab] = useState<'documents' | 'templates' | 'signatures' | 'forms'>('documents');
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [showAIWriter, setShowAIWriter] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showPublicForm, setShowPublicForm] = useState<string | null>(null);
  const [showSigningView, setShowSigningView] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);

  const limits = PLAN_LIMITS[state.workspace?.plan || 'free'];
  const aiRemaining = limits.aiQuotes - state.aiQuotesUsed;

  const renderTab = () => {
    switch (tab) {
      case 'documents': return <DocumentsTab state={state} onNew={() => setShowNewDoc(true)} onAI={() => setShowAIWriter(true)} onEdit={setEditingDoc} onSign={setShowSigningView} />;
      case 'templates': return <TemplatesTab state={state} />;
      case 'signatures': return <SignaturesTab state={state} onSign={setShowSigningView} />;
      case 'forms': return <FormsTab state={state} onNew={() => setShowFormBuilder(true)} onPreview={setShowPublicForm} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Documents</h1>
          <p className="text-ink-muted text-sm">Proposals, contracts, e-signatures, and intake forms</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 font-medium">
            <Sparkles size={12} className="inline mr-1" /> AI: {aiRemaining}/{limits.aiQuotes} remaining
          </div>
        </div>
      </div>

      <div className="flex border-b border-line overflow-x-auto">
        {[
          { id: 'documents', label: 'Documents', count: state.documents.length },
          { id: 'templates', label: 'Templates', count: state.documentTemplates.length },
          { id: 'signatures', label: 'E-Signatures', count: state.signatures.length },
          { id: 'forms', label: 'Intake Forms', count: state.intakeForms.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === t.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
            {t.label} <span className="text-xs text-ink-faint">({t.count})</span>
          </button>
        ))}
      </div>

      {renderTab()}

      {showNewDoc && <NewDocumentModal onClose={() => setShowNewDoc(false)} onAI={() => { setShowNewDoc(false); setShowAIWriter(true); }} />}
      {showAIWriter && <AIWriterModal onClose={() => setShowAIWriter(false)} />}
      {editingDoc && <DocumentEditorModal docId={editingDoc} onClose={() => setEditingDoc(null)} />}
      {showFormBuilder && <FormBuilderModal onClose={() => setShowFormBuilder(false)} />}
      {showPublicForm && <PublicFormPreview formId={showPublicForm} onClose={() => setShowPublicForm(null)} />}
      {showSigningView && <SigningViewModal signatureId={showSigningView} onClose={() => setShowSigningView(null)} />}
    </div>
  );
}

// Documents Tab
function DocumentsTab({ state, onNew, onAI, onEdit, onSign }: {
  state: AppState; onNew: () => void; onAI: () => void; onEdit: (id: string) => void; onSign: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={onNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember">
          <Plus size={16} /> New document
        </button>
        <button onClick={onAI} className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary-200 bg-primary-50 text-primary-700 text-sm font-semibold rounded-xl hover:bg-primary-100">
          <Sparkles size={16} /> Write with AI
        </button>
      </div>

      {state.documents.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-line p-12 text-center">
          <FileText size={40} className="mx-auto mb-3 text-ink-faint opacity-50" />
          <p className="text-ink-muted">No documents yet</p>
          <p className="text-xs text-ink-faint mt-1">Create a proposal, contract, or use AI to draft one</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.documents.map(doc => {
            const client = state.clients.find(c => c.id === doc.clientId);
            const sig = state.signatures.find(s => s.documentId === doc.id);
            return (
              <div key={doc.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft hover:shadow-soft-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <FileText size={18} className="text-primary-600" />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded capitalize ${doc.status === 'signed' ? 'bg-green-50 text-green-700' : doc.status === 'sent' ? 'bg-blue-50 text-blue-700' : doc.status === 'viewed' ? 'bg-amber-50 text-amber-700' : doc.status === 'declined' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
                    {doc.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-ink mb-1">{doc.title}</h3>
                <p className="text-xs text-ink-muted capitalize mb-3">{doc.type} {client && `• ${client.company}`}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => onEdit(doc.id)} className="flex-1 py-1.5 border border-line rounded-lg text-xs font-medium text-ink hover:bg-canvas flex items-center justify-center gap-1">
                    <Eye size={12} /> View
                  </button>
                  {doc.status === 'draft' && (
                    <button onClick={() => onSign(doc.id)} className="flex-1 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <Edit size={12} /> Send
                    </button>
                  )}
                  {sig && sig.status === 'signed' && (
                    <button onClick={() => onSign(sig.id)} className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 size={12} /> Audit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Templates Tab
function TemplatesTab({ state }: { state: AppState }) {
  return (
    <div className="space-y-4">
      <div className="bg-canvas rounded-xl p-4 text-sm text-ink-muted">
        <strong className="text-ink">Templates</strong> are reusable document starting points. Use merge fields like <code className="px-1 py-0.5 bg-surface rounded text-primary-600">{'{{client_name}}'}</code> that get replaced when creating a document.
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {state.documentTemplates.map(tpl => (
          <div key={tpl.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <FileText size={18} className="text-amber-600" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded capitalize bg-canvas text-ink-muted">{tpl.type}</span>
            </div>
            <h3 className="text-sm font-semibold text-ink">{tpl.name}</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {tpl.mergeFields.slice(0, 4).map(f => (
                <span key={f} className="text-xs px-1.5 py-0.5 rounded bg-primary-50 text-primary-700">{`{{${f}}}`}</span>
              ))}
              {tpl.mergeFields.length > 4 && <span className="text-xs text-ink-faint">+{tpl.mergeFields.length - 4} more</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Signatures Tab
function SignaturesTab({ state, onSign }: { state: AppState; onSign: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {state.signatures.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-line p-12 text-center">
          <Edit size={40} className="mx-auto mb-3 text-ink-faint opacity-50" />
          <p className="text-ink-muted">No signature requests yet</p>
          <p className="text-xs text-ink-faint mt-1">Send a document for e-signature to get started</p>
        </div>
      ) : (
        state.signatures.map(sig => {
          const doc = state.documents.find(d => d.id === sig.documentId);
          return (
            <div key={sig.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sig.status === 'signed' ? 'bg-green-50' : sig.status === 'viewed' ? 'bg-amber-50' : sig.status === 'declined' ? 'bg-red-50' : 'bg-blue-50'}`}>
                <Edit size={18} className={sig.status === 'signed' ? 'text-green-600' : sig.status === 'viewed' ? 'text-amber-600' : sig.status === 'declined' ? 'text-red-600' : 'text-blue-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink">{doc?.title || 'Document'}</div>
                <div className="text-xs text-ink-muted">{sig.signerName} • {sig.signerEmail}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded capitalize ${sig.status === 'signed' ? 'bg-green-50 text-green-700' : sig.status === 'viewed' ? 'bg-amber-50 text-amber-700' : sig.status === 'declined' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                {sig.status}
              </span>
              <button onClick={() => onSign(sig.id)} className="px-3 py-1.5 border border-line rounded-lg text-xs font-medium text-ink hover:bg-canvas">
                View audit
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

// Forms Tab
function FormsTab({ state, onNew, onPreview }: { state: AppState; onNew: () => void; onPreview: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember">
        <Plus size={16} /> New intake form
      </button>

      {state.intakeForms.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-line p-12 text-center">
          <FileText size={40} className="mx-auto mb-3 text-ink-faint opacity-50" />
          <p className="text-ink-muted">No intake forms yet</p>
          <p className="text-xs text-ink-faint mt-1">Create a form to collect client information via a public link</p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.intakeForms.map(form => (
            <div key={form.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{form.title}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{form.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${form.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-ink-faint mt-3">
                <span>{form.fields.length} fields</span>
                <span>{form.responseCount} response(s)</span>
              </div>
              <div className="mt-3 flex items-center gap-2 p-2 bg-canvas rounded-lg">
                <Globe size={12} className="text-ink-faint" />
                <code className="text-xs text-primary-600 flex-1 truncate">clientertap.com/form/{form.token}</code>
                <button onClick={() => onPreview(form.id)} className="px-2 py-1 bg-surface border border-line rounded text-xs font-medium text-ink hover:bg-canvas">
                  Preview
                </button>
                <button onClick={() => {
                  navigator.clipboard.writeText(`https://clientertap.com/form/${form.token}`);
                  alert('Link copied!');
                }} className="px-2 py-1 bg-surface border border-line rounded text-xs font-medium text-ink hover:bg-canvas">
                  Copy
                </button>
                <button onClick={() => {
                  if (confirm('Regenerate link? Old link will stop working.')) {
                    actions.regenerateFormToken(form.id);
                  }
                }} className="px-2 py-1 bg-surface border border-line rounded text-xs font-medium text-ink hover:bg-canvas">
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// New Document Modal
function NewDocumentModal({ onClose, onAI }: { onClose: () => void; onAI: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    title: '', type: 'proposal' as DocumentType, clientId: '', projectId: '', templateId: '', body: ''
  });

  const handleTemplateSelect = (tplId: string) => {
    const tpl = state.documentTemplates.find(t => t.id === tplId);
    if (tpl) {
      setForm({ ...form, templateId: tplId, body: tpl.body, type: tpl.type });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.addDocument({ ...form, status: 'draft', createdBy: state.currentUserId! });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-semibold text-ink">New document</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Title *</label>
              <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value as DocumentType})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="proposal">Proposal</option>
                <option value="contract">Contract</option>
                <option value="quotation">Quotation</option>
                <option value="nda">NDA</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Client</label>
              <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">— None —</option>
                {state.clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Start from template</label>
              <select value={form.templateId} onChange={e => handleTemplateSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">— Blank —</option>
                {state.documentTemplates.filter(t => t.type === form.type).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-ink">Content</label>
              <button type="button" onClick={onAI} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                <Sparkles size={12} /> Write with AI
              </button>
            </div>
            <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} rows={10}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono resize-none"
              placeholder="Write your document content here. Use HTML for formatting." />
            <p className="text-xs text-ink-faint mt-1">HTML supported. Use {'{{client_name}}'}, {'{{company}}'}, {'{{date}}'}, {'{{amount}}'} for merge fields.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Create document</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// AI Writer Modal
function AIWriterModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [type, setType] = useState<string>('proposal');
  const [brief, setBrief] = useState('');
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const limits = PLAN_LIMITS[state.workspace?.plan || 'free'];

  const handleGenerate = () => {
    if (!brief.trim()) return;
    setLoading(true);
    // Simulate AI delay
    setTimeout(() => {
      const result = actions.aiWriteDocument(brief, type as unknown as DocumentType);
      setLoading(false);
      if (result.success && result.body) {
        setGenerated(result.body);
      } else {
        alert(result.error);
      }
    }, 1500);
  };

  const handleSaveAsDocument = () => {
    if (!generated) return;
    const title = prompt('Document title:', `${type.charAt(0).toUpperCase() + type.slice(1)} — ${brief.slice(0, 30)}`);
    if (title) {
      actions.addDocument({ title, type: type as DocumentType, body: generated, status: 'draft', createdBy: state.currentUserId! });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary-600" />
            <h2 className="font-semibold text-ink">AI Document Writer</h2>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 text-xs text-primary-800">
            <strong>Quota:</strong> {limits.aiQuotes - state.aiQuotesUsed} of {limits.aiQuotes} AI quotes remaining this month. Each generation counts as 1.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Document type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="proposal">Proposal</option>
                <option value="contract">Contract</option>
                <option value="quotation">Quotation</option>
                <option value="nda">NDA</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Brief (describe what you need)</label>
            <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={4}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="E.g., A web design proposal for a D2C skincare brand needing a full rebrand including logo, packaging, and e-commerce site..." />
          </div>
          {!generated ? (
            <button onClick={handleGenerate} disabled={loading || !brief.trim()}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-ember flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <><Sparkles size={16} /> Generate document</>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-canvas rounded-xl p-4 max-h-64 overflow-y-auto">
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: generated }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setGenerated(null)} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Regenerate</button>
                <button onClick={handleSaveAsDocument} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Save as document</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Document Editor / Viewer Modal
function DocumentEditorModal({ docId, onClose }: { docId: string; onClose: () => void }) {
  const state = useAppState();
  const doc = state.documents.find(d => d.id === docId);
  const [body, setBody] = useState(doc?.body || '');
  const [showSendForSig, setShowSendForSig] = useState(false);
  const [sigForm, setSigForm] = useState({ signerName: '', signerEmail: '' });

  if (!doc) return null;
  const client = state.clients.find(c => c.id === doc.clientId);
  const sig = state.signatures.find(s => s.documentId === doc.id);

  const handleSave = () => {
    actions.updateDocument(doc.id, { body });
    onClose();
  };

  const handleSendForSignature = () => {
    if (!sigForm.signerName || !sigForm.signerEmail) return;
    actions.sendDocument(doc.id, sigForm.signerEmail, sigForm.signerName);
    setShowSendForSig(false);
    onClose();
  };

  // Render body with merge fields replaced for preview
  const renderBody = (html: string) => {
    return html
      .replace(/\{\{client_name\}\}/g, client?.name || '[Client Name]')
      .replace(/\{\{company\}\}/g, client?.company || '[Company]')
      .replace(/\{\{agency_name\}\}/g, state.workspace?.name || '[Agency]')
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replace(/\{\{amount\}\}/g, '[Amount]')
      .replace(/\{\{scope\}\}/g, '[Scope of work]')
      .replace(/\{\{timeline\}\}/g, '[Timeline]');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-semibold text-ink">{doc.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded capitalize ${doc.status === 'signed' ? 'bg-green-50 text-green-700' : doc.status === 'sent' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                {doc.status}
              </span>
              <span className="text-xs text-ink-faint">v{doc.version} • {doc.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-3 py-1.5 border border-line rounded-lg text-xs font-medium text-ink hover:bg-canvas flex items-center gap-1">
              <Download size={12} /> Print / PDF
            </button>
            <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
          </div>
        </div>

        {/* Document Preview */}
        <div className="p-6 bg-white min-h-[400px]" id="document-print-area">
          <div className="max-w-2xl mx-auto prose prose-sm" dangerouslySetInnerHTML={{ __html: renderBody(body) }} />
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-surface border-t border-line p-4 flex items-center justify-between">
          <div className="text-xs text-ink-faint">
            {client && <>Client: <strong>{client.company}</strong></>}
          </div>
          <div className="flex gap-2">
            {doc.status === 'draft' && (
              <>
                <button onClick={handleSave} className="px-4 py-2 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Save draft</button>
                <button onClick={() => setShowSendForSig(true)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl flex items-center gap-1">
                  <Edit size={14} /> Send for signature
                </button>
              </>
            )}
            {sig && (
              <div className="text-xs text-ink-muted">
                {sig.status === 'signed' && <>✓ Signed by {sig.signerName} on {new Date(sig.signedAt!).toLocaleDateString()}</>}
                {sig.status === 'pending' && <>Awaiting signature from {sig.signerName}</>}
                {sig.status === 'viewed' && <>{sig.signerName} viewed the document</>}
              </div>
            )}
          </div>
        </div>

        {/* Send for signature modal */}
        {showSendForSig && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 z-20">
            <div className="bg-surface rounded-2xl p-5 w-full max-w-md border border-line shadow-soft-lg">
              <h3 className="font-semibold text-ink mb-3">Send for e-signature</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Signer name *</label>
                  <input type="text" value={sigForm.signerName} onChange={e => setSigForm({...sigForm, signerName: e.target.value})}
                    placeholder={client?.name || 'Client name'}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Signer email *</label>
                  <input type="email" value={sigForm.signerEmail} onChange={e => setSigForm({...sigForm, signerEmail: e.target.value})}
                    placeholder={client?.email || 'client@email.com'}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <p className="text-xs text-ink-faint">The signer will receive a secure link to review and sign the document.</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowSendForSig(false)} className="flex-1 py-2 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
                  <button onClick={handleSendForSignature} className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Send</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Signing View Modal (for client to sign, or agency to view audit)
function SigningViewModal({ signatureId, onClose }: { signatureId: string; onClose: () => void }) {
  const state = useAppState();
  const sig = state.signatures.find(s => s.id === signatureId);
  const doc = sig ? state.documents.find(d => d.id === sig.documentId) : null;
  const [signatureText, setSignatureText] = useState('');
  const [signatureDrawn, setSignatureDrawn] = useState<string | null>(null);
  const [mode, setMode] = useState<'type' | 'draw'>('type');
  const [declineReason, setDeclineReason] = useState('');
  const [showDecline, setShowDecline] = useState(false);
  const canvasRef = useState<HTMLCanvasElement | null>(null);

  if (!sig || !doc) return null;

  const isSignerView = sig.status === 'pending' || sig.status === 'viewed';
  const isAuditView = sig.status === 'signed' || sig.status === 'declined';

  const renderBody = (html: string) => {
    const client = state.clients.find(c => c.id === doc.clientId);
    return html
      .replace(/\{\{client_name\}\}/g, client?.name || '[Client Name]')
      .replace(/\{\{company\}\}/g, client?.company || '[Company]')
      .replace(/\{\{agency_name\}\}/g, state.workspace?.name || '[Agency]')
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replace(/\{\{amount\}\}/g, '[Amount]')
      .replace(/\{\{scope\}\}/g, '[Scope of work]')
      .replace(/\{\{timeline\}\}/g, '[Timeline]');
  };

  const handleSign = () => {
    const sigData = mode === 'type' ? signatureText : (signatureDrawn || '');
    if (!sigData) { alert('Please provide your signature'); return; }
    actions.signDocument(sig.id, sigData, mode === 'type' ? 'typed' : 'drawn');
    onClose();
  };

  const handleDecline = () => {
    if (!declineReason.trim()) { alert('Please provide a reason'); return; }
    actions.declineSignature(sig.id, declineReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-semibold text-ink">{isAuditView ? 'Signature Audit Trail' : 'Sign Document'}</h2>
            <p className="text-xs text-ink-muted">{doc.title}</p>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>

        {/* Document content */}
        <div className="p-6 bg-white border-b border-line">
          <div className="max-w-2xl mx-auto prose prose-sm" dangerouslySetInnerHTML={{ __html: renderBody(doc.body) }} />
        </div>

        {isAuditView ? (
          // Audit trail view
          <div className="p-5 space-y-4">
            <h3 className="font-semibold text-ink flex items-center gap-2">
              <Shield size={16} className="text-green-600" /> Audit Trail
            </h3>
            <div className="bg-canvas rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">Signer</span><span className="text-ink font-medium">{sig.signerName}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Email</span><span className="text-ink">{sig.signerEmail}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Status</span>
                <span className={`px-2 py-0.5 rounded text-xs capitalize ${sig.status === 'signed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{sig.status}</span>
              </div>
              {sig.viewedAt && <div className="flex justify-between"><span className="text-ink-muted">Viewed</span><span className="text-ink">{new Date(sig.viewedAt).toLocaleString()}</span></div>}
              {sig.signedAt && <div className="flex justify-between"><span className="text-ink-muted">Signed</span><span className="text-ink">{new Date(sig.signedAt).toLocaleString()}</span></div>}
              {sig.declinedAt && <div className="flex justify-between"><span className="text-ink-muted">Declined</span><span className="text-ink">{new Date(sig.declinedAt).toLocaleString()}</span></div>}
              {sig.declinedReason && <div className="flex justify-between"><span className="text-ink-muted">Reason</span><span className="text-ink">{sig.declinedReason}</span></div>}
              <div className="flex justify-between"><span className="text-ink-muted">IP Address</span><span className="text-ink font-mono text-xs">{sig.ipAddress || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">User Agent</span><span className="text-ink font-mono text-xs truncate max-w-xs">{sig.userAgent || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Signature type</span><span className="text-ink capitalize">{sig.signatureType || 'N/A'}</span></div>
              {sig.signatureData && (
                <div className="pt-3 border-t border-line">
                  <span className="text-ink-muted text-xs">Signature:</span>
                  {sig.signatureType === 'drawn' ? (
                    <div className="mt-2 p-3 bg-white border border-line rounded-lg">
                      <img src={sig.signatureData} alt="Signature" className="max-h-16" />
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-white border border-line rounded-lg font-serif text-2xl italic text-ink">{sig.signatureData}</div>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => window.print()} className="w-full py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas flex items-center justify-center gap-2">
              <Download size={14} /> Download audit certificate (PDF)
            </button>
          </div>
        ) : (
          // Signing view
          <div className="p-5 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <strong>Review required:</strong> Please read the document above carefully before signing. By signing, you agree to be bound by its terms.
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setMode('type')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${mode === 'type' ? 'bg-primary-50 text-primary-600' : 'bg-canvas text-ink-muted'}`}>
                  Type signature
                </button>
                <button onClick={() => setMode('draw')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${mode === 'draw' ? 'bg-primary-50 text-primary-600' : 'bg-canvas text-ink-muted'}`}>
                  Draw signature
                </button>
              </div>

              {mode === 'type' ? (
                <div>
                  <input type="text" value={signatureText} onChange={e => setSignatureText(e.target.value)}
                    placeholder="Type your full name"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  {signatureText && (
                    <div className="mt-2 p-4 bg-canvas rounded-xl border border-line">
                      <div className="font-serif text-3xl italic text-ink">{signatureText}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-line rounded-xl p-4 bg-canvas">
                  <p className="text-xs text-ink-muted mb-2">Draw your signature below (simulated — in production uses canvas)</p>
                  <input type="text" value={signatureDrawn || ''} onChange={e => setSignatureDrawn(e.target.value)}
                    placeholder="[Draw signature area — using text input for demo]"
                    className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm font-serif italic" />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowDecline(true)} className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50">Decline</button>
              <button onClick={handleSign} disabled={mode === 'type' ? !signatureText : !signatureDrawn}
                className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl">
                Sign document
              </button>
            </div>

            {showDecline && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                <label className="block text-xs font-medium text-red-800">Reason for declining</label>
                <textarea value={declineReason} onChange={e => setDeclineReason(e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-red-200 bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => setShowDecline(false)} className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-700">Cancel</button>
                  <button onClick={handleDecline} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium">Confirm decline</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Form Builder Modal
function FormBuilderModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<IntakeFormField[]>([
    { id: 'f1', type: 'text', label: 'Full Name', required: true },
    { id: 'f2', type: 'email', label: 'Email', required: true },
  ]);

  const addField = (type: IntakeFieldType) => {
    setFields([...fields, { id: 'f' + Date.now(), type, label: 'New field', required: false, options: type === 'select' || type === 'multiselect' ? ['Option 1', 'Option 2'] : undefined }]);
  };

  const updateField = (id: string, updates: Partial<IntakeFormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || fields.length === 0) return;
    const result = actions.addIntakeForm({ title, description, fields, isActive: true });
    if ((result as any).success) {
      alert(`Form created!\n\nPublic link: https://clientertap.com/form/${(result as any).token}\n\nShare this link — no login required.`);
    }
    onClose();
  };

  const fieldTypes: { type: IntakeFieldType; label: string }[] = [
    { type: 'text', label: 'Short text' },
    { type: 'longtext', label: 'Long text' },
    { type: 'email', label: 'Email' },
    { type: 'phone', label: 'Phone' },
    { type: 'number', label: 'Number' },
    { type: 'select', label: 'Dropdown' },
    { type: 'multiselect', label: 'Multi-select' },
    { type: 'date', label: 'Date' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'file', label: 'File upload' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-semibold text-ink">Build intake form</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Form title *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., New Client Onboarding" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Brief description shown to respondents" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Fields</label>
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={field.id} className="bg-canvas rounded-xl p-3 flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="text" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })}
                        className="flex-1 px-2 py-1 rounded-lg border border-line bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <select value={field.type} onChange={e => updateField(field.id, { type: e.target.value as IntakeFieldType })}
                        className="px-2 py-1 rounded-lg border border-line bg-white text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                        {fieldTypes.map(ft => <option key={ft.type} value={ft.type}>{ft.label}</option>)}
                      </select>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <input type="checkbox" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })}
                        className="rounded border-line" />
                      Required
                    </label>
                    {(field.type === 'select' || field.type === 'multiselect') && (
                      <input type="text" value={(field.options || []).join(', ')}
                        onChange={e => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="Option 1, Option 2, ..."
                        className="w-full px-2 py-1 rounded-lg border border-line bg-white text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    )}
                  </div>
                  <button type="button" onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-700 p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {fieldTypes.map(ft => (
                <button key={ft.type} type="button" onClick={() => addField(ft.type)}
                  className="px-2 py-1 border border-line rounded-lg text-xs text-ink-muted hover:bg-canvas hover:text-ink">
                  + {ft.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Create form</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Public Form Preview Modal
function PublicFormPreview({ formId, onClose }: { formId: string; onClose: () => void }) {
  const state = useAppState();
  const form = state.intakeForms.find(f => f.id === formId);
  const [data, setData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!form) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.submitIntakeForm(form.id, data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Thank you!</h2>
          <p className="text-sm text-ink-muted">Your response has been submitted successfully.</p>
          <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-semibold text-ink">{form.title}</h2>
            <p className="text-xs text-ink-faint">Public preview — form token: {form.token}</p>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {form.description && <p className="text-sm text-ink-muted">{form.description}</p>}
          {form.fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-ink mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'number' ? (
                <input type={field.type} required={field.required}
                  value={data[field.id] || ''} onChange={e => setData({...data, [field.id]: e.target.value})}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              ) : field.type === 'longtext' ? (
                <textarea required={field.required} value={data[field.id] || ''} onChange={e => setData({...data, [field.id]: e.target.value})}
                  placeholder={field.placeholder} rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              ) : field.type === 'select' ? (
                <select required={field.required} value={data[field.id] || ''} onChange={e => setData({...data, [field.id]: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select...</option>
                  {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : field.type === 'multiselect' ? (
                <div className="space-y-1">
                  {(field.options || []).map(o => (
                    <label key={o} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={(data[field.id] || []).includes(o)}
                        onChange={e => {
                          const current = data[field.id] || [];
                          setData({...data, [field.id]: e.target.checked ? [...current, o] : current.filter((x: string) => x !== o)});
                        }}
                        className="rounded border-line" />
                      {o}
                    </label>
                  ))}
                </div>
              ) : field.type === 'date' ? (
                <input type="date" required={field.required} value={data[field.id] || ''} onChange={e => setData({...data, [field.id]: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!data[field.id]} onChange={e => setData({...data, [field.id]: e.target.checked})}
                    className="rounded border-line" />
                  {field.label}
                </label>
              ) : field.type === 'file' ? (
                <input type="file" required={field.required}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink" />
              ) : null}
            </div>
          ))}
          <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

// Team Page — Enhanced with invites, roles, permissions, payroll
function TeamPage() {
  const state = useAppState();
  const [tab, setTab] = useState<'members' | 'invites' | 'payroll'>('members');
  const [showInvite, setShowInvite] = useState(false);
  const [showPayroll, setShowPayroll] = useState(false);

  const limits = PLAN_LIMITS[state.workspace?.plan || 'free'];
  const activeMembers = state.teamMembers.filter(m => m.status === 'active').length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Team</h1>
          <p className="text-ink-muted text-sm">{activeMembers} of {limits.teammates === 99999 ? '∞' : limits.teammates} seats used</p>
        </div>
        <div className="flex items-center gap-2">
          {state.workspace?.plan === 'ultra' && (
            <button onClick={() => setShowPayroll(true)}
              className="inline-flex items-center gap-2 px-3 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">
              <DollarSign size={14} /> Payroll
            </button>
          )}
          <button onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember">
            <Plus size={16} /> Invite member
          </button>
        </div>
      </div>

      {/* Seat usage bar */}
      <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ink">Seat usage</span>
          <span className="text-xs text-ink-muted">{activeMembers} / {limits.teammates === 99999 ? '∞' : limits.teammates}</span>
        </div>
        <div className="h-2 bg-canvas rounded-full overflow-hidden">
          <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${Math.min((activeMembers / limits.teammates) * 100, 100)}%` }}></div>
        </div>
        {limits.teammates - activeMembers <= 1 && limits.teammates !== 99999 && (
          <p className="text-xs text-amber-600 mt-2">⚠ Running low on seats. Upgrade for more.</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line">
        <button onClick={() => setTab('members')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'members' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
          Members ({state.teamMembers.length})
        </button>
        <button onClick={() => setTab('invites')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'invites' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
          Invites ({state.teamInvites.filter(i => i.status === 'pending').length})
        </button>
        {state.workspace?.plan === 'ultra' && (
          <button onClick={() => setTab('payroll')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'payroll' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
            Payroll
          </button>
        )}
      </div>

      {tab === 'members' && (
        <div className="space-y-2">
          {state.teamMembers.map(m => (
            <div key={m.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-700">{m.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-ink">{m.name}</div>
                  {m.role === 'owner' && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">Owner</span>}
                </div>
                <div className="text-xs text-ink-faint">{m.email}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {m.permissions.map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-canvas text-ink-muted capitalize">{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded capitalize ${m.status === 'active' ? 'bg-green-50 text-green-700' : m.status === 'invited' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                  {m.status}
                </span>
                {m.role !== 'owner' && (
                  <button onClick={() => {
                    if (confirm(`Remove ${m.name} from team?`)) actions.removeTeamMember(m.id);
                  }} className="text-xs text-red-600 hover:underline">Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'invites' && (
        <div className="space-y-2">
          {state.teamInvites.filter(i => i.status === 'pending').map(inv => (
            <div key={inv.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Mail size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-ink">{inv.email}</div>
                <div className="text-xs text-ink-faint">Invited as {inv.role} • {timeAgo(inv.invitedAt)}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {inv.permissions.map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-canvas text-ink-muted capitalize">{p}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">Pending</span>
            </div>
          ))}
          {state.teamInvites.filter(i => i.status === 'pending').length === 0 && (
            <div className="text-center py-12 text-ink-faint">
              <Mail size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No pending invites</p>
            </div>
          )}
        </div>
      )}

      {tab === 'payroll' && <PayrollTab state={state} />}

      {showInvite && <InviteMemberModal onClose={() => setShowInvite(false)} />}
      {showPayroll && <PayrollModal onClose={() => setShowPayroll(false)} />}
    </div>
  );
}

// Payroll Tab (Ultra only)
function PayrollTab({ state }: { state: AppState }) {
  return (
    <div className="space-y-3">
      {state.payroll.map(pr => {
        const member = state.teamMembers.find(m => m.id === pr.teamMemberId);
        return (
          <div key={pr.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-ink">{member?.name}</div>
                <div className="text-xs text-ink-muted">{pr.month} • {pr.currency}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-ink">{formatCurrency(pr.netPay, pr.currency)}</div>
                <span className={`text-xs px-2 py-0.5 rounded capitalize ${pr.status === 'paid' ? 'bg-green-50 text-green-700' : pr.status === 'approved' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                  {pr.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-line text-xs">
              <div><span className="text-ink-muted">Base:</span> <span className="text-ink">{formatCurrency(pr.baseSalary, pr.currency)}</span></div>
              <div><span className="text-ink-muted">Bonus:</span> <span className="text-green-600">+{formatCurrency(pr.bonuses, pr.currency)}</span></div>
              <div><span className="text-ink-muted">Deductions:</span> <span className="text-red-600">-{formatCurrency(pr.deductions, pr.currency)}</span></div>
            </div>
            <div className="flex gap-2 mt-3">
              {pr.status === 'draft' && (
                <button onClick={() => actions.updateTeamMember(pr.teamMemberId, {})} className="text-xs text-primary-600 font-medium hover:underline">Approve</button>
              )}
              {pr.status !== 'paid' && (
                <button onClick={() => actions.markPayrollPaid(pr.id)} className="text-xs text-green-600 font-medium hover:underline">Mark paid</button>
              )}
              <button onClick={() => {
                const result = actions.generatePayslip(pr.id);
                if ((result as any).success) alert(`Payslip generated: ${(result as any).pdfUrl}`);
              }} className="text-xs text-ink-muted hover:text-ink">Generate payslip</button>
            </div>
          </div>
        );
      })}
      {state.payroll.length === 0 && (
        <div className="text-center py-12 text-ink-faint">
          <DollarSign size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No payroll entries yet</p>
        </div>
      )}
    </div>
  );
}

// Invite Member Modal
function InviteMemberModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamRole>('member');
  const [permissions, setPermissions] = useState<Permission[]>(['clients', 'projects']);

  const allPermissions: Permission[] = ['leads', 'clients', 'projects', 'invoices', 'team', 'settings'];

  const togglePermission = (p: Permission) => {
    setPermissions(permissions.includes(p) ? permissions.filter(x => x !== p) : [...permissions, p]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions.inviteTeamMember(email, role, permissions);
    if ((result as any).error) {
      alert((result as any).error);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line">
        <div className="border-b border-line p-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Invite team member</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email address *</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="colleague@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as TeamRole)}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="admin">Admin — Full access</option>
              <option value="member">Member — Standard access</option>
              <option value="viewer">Viewer — Read-only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {allPermissions.map(p => (
                <label key={p} className="flex items-center gap-2 p-2 rounded-lg border border-line hover:bg-canvas cursor-pointer">
                  <input type="checkbox" checked={permissions.includes(p)} onChange={() => togglePermission(p)}
                    className="rounded border-line text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-ink capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-canvas rounded-xl p-3 text-xs text-ink-muted">
            An invite email will be sent. The invite expires in 7 days.
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Send invite</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Payroll Modal (Ultra only)
function PayrollModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    teamMemberId: state.teamMembers.filter(m => m.role !== 'owner')[0]?.id || '',
    month: new Date().toISOString().slice(0, 7),
    baseSalary: 0, bonuses: 0, deductions: 0, currency: state.workspace?.currency || 'INR',
    status: 'draft' as const, notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions.addPayroll(form);
    if ((result as any).error) alert((result as any).error);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line">
        <div className="border-b border-line p-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Create payroll entry</h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Team member</label>
              <select value={form.teamMemberId} onChange={e => setForm({...form, teamMemberId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500">
                {state.teamMembers.filter(m => m.role !== 'owner').map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Month</label>
              <input type="month" value={form.month} onChange={e => setForm({...form, month: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Base salary</label>
              <input type="number" value={form.baseSalary} onChange={e => setForm({...form, baseSalary: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Bonuses</label>
              <input type="number" value={form.bonuses} onChange={e => setForm({...form, bonuses: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Deductions</label>
              <input type="number" value={form.deductions} onChange={e => setForm({...form, deductions: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="bg-canvas rounded-xl p-3 text-sm">
            <span className="text-ink-muted">Net pay: </span>
            <span className="font-bold text-ink">{formatCurrency(form.baseSalary + form.bonuses - form.deductions, form.currency)}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Portal Management Page (Agency side)
function PortalManagePage() {
  const state = useAppState();
  const portalEnabledClients = state.clients.filter(c => c.portalEnabled);
  const limits = PLAN_LIMITS[state.workspace?.plan || 'free'];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Client Portal</h1>
        <p className="text-ink-muted text-sm">Manage portal access for your clients</p>
      </div>

      <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-ink">Portal status</h3>
            <p className="text-sm text-ink-muted">{portalEnabledClients.length} of {limits.portalClients === 99999 ? '∞' : limits.portalClients} portal seats used</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">Active</span>
        </div>
        <div className="bg-canvas rounded-xl p-3 text-sm text-ink-muted">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={14} className="text-primary-600" />
            <span className="font-medium text-ink">Portal URL</span>
          </div>
          <code className="text-xs text-primary-600">portal.clientertap.com/{state.workspace?.slug}</code>
          {state.workspace?.plan === 'ultra' && (
            <div className="mt-2 text-xs text-ink-faint">Ultra plan: Custom domain available (portal.youragency.com)</div>
          )}
          {state.workspace?.plan === 'free' && (
            <div className="mt-2 text-xs text-ink-faint">Free plan: "Powered by ClienterTap" shown in portal footer</div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-ink mb-3">Clients with portal access</h2>
        {portalEnabledClients.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-line p-8 text-center">
            <Globe size={32} className="mx-auto mb-3 text-ink-faint opacity-50" />
            <p className="text-sm text-ink-muted">No clients have portal access yet</p>
            <p className="text-xs text-ink-faint mt-1">Go to Clients → Enable portal for a client</p>
          </div>
        ) : (
          <div className="space-y-2">
            {portalEnabledClients.map(c => {
              const pu = state.portalUsers.find(p => p.clientId === c.id);
              return (
                <div key={c.id} className="bg-surface rounded-xl border border-line p-4 shadow-soft flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700">{c.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink">{c.name}</div>
                    <div className="text-xs text-ink-faint">{c.email}</div>
                  </div>
                  <div className="text-right">
                    {pu?.lastLoginAt ? (
                      <div className="text-xs text-green-600">Last login: {timeAgo(pu.lastLoginAt)}</div>
                    ) : (
                      <div className="text-xs text-ink-faint">Never logged in</div>
                    )}
                  </div>
                  <button onClick={() => {
                    if (pu) {
                      actions.portalLogin(pu.token);
                    }
                  }} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                    <ExternalLink size={12} /> Preview
                  </button>
                  <button onClick={() => {
                    if (confirm('Revoke portal access for this client?')) {
                      actions.disablePortalForClient(c.id);
                    }
                  }} className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50">
                    Revoke
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Portal features list */}
      <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
        <h3 className="font-semibold text-ink mb-3">What clients see in the portal</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { icon: FolderKanban, title: 'Projects', desc: 'View progress, updates, and deadlines' },
            { icon: FileText, title: 'Invoices', desc: 'Download invoices and track payments' },
            { icon: MessageSquare, title: 'Messages', desc: 'Real-time messaging with your team' },
            { icon: CheckSquare, title: 'Approvals', desc: 'Review and sign off on project updates' },
            { icon: Star, title: 'Reviews', desc: 'Leave verified reviews for completed projects' },
            { icon: Heart, title: 'Referrals', desc: 'Refer friends and track referral status' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <f.icon size={14} className="text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-ink">{f.title}</div>
                <div className="text-xs text-ink-faint">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const state = useAppState();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [view, setView] = useState<'marketing' | 'auth' | 'app' | 'tools'>('marketing');

  // Route to marketing site by default
  if (view === 'marketing') {
    return (
      <MarketingSite 
        onSignIn={() => setView('auth')} 
        onStartFree={() => setView('auth')} 
      />
    );
  }

  // Route to free tools
  if (view === 'tools') {
    return <FreeToolsPage />;
  }

  // Route to auth page
  if (!state.isAuthenticated || view === 'auth') {
    return <AuthPage onAuth={() => setView('app')} />;
  }

  // Phase 4 — Portal mode detection
  if (state.currentPortalUserId) {
    return <PortalApp onExit={() => setView('app')} />;
  }

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'leads': return <LeadsPage />;
      case 'clients': return <ClientsPage />;
      case 'projects': return <ProjectsPage />;
      case 'invoices': return <InvoicesPage />;
      case 'meetings': return <MeetingsPage />;
      case 'tasks': return <TasksPage />;
      case 'documents': return <DocumentsPage />;
      case 'team': return <TeamPage />;
      case 'activity': return <ActivityPage />;
      case 'portal': return <PortalManagePage />;
      case 'growth': return <GrowthSettingsPage />;
      case 'reviews': return <PublicReviewsPage slug={state.workspace?.slug || ''} />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-line">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-ink-muted">
                <Menu size={20} />
              </button>
              <div className="hidden md:flex relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input type="text" placeholder="Search clients, leads, projects..."
                  className="pl-9 pr-4 py-2 w-64 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl hover:bg-canvas text-ink-muted">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer">
                <span className="text-xs font-semibold text-primary-700">{state.users[0]?.name?.charAt(0)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="fixed right-4 top-14 w-80 bg-surface rounded-2xl border border-line shadow-soft-lg z-50">
            <div className="p-3 border-b border-line flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Notifications</h3>
              <button onClick={() => actions.markAllNotificationsRead()} className="text-xs text-primary-600 font-medium">Mark all read</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {state.notifications.map(n => (
                <div key={n.id} onClick={() => actions.markNotificationRead(n.id)}
                  className={`px-3 py-2.5 border-b border-line last:border-0 cursor-pointer hover:bg-canvas ${!n.read ? 'bg-primary-50/30' : ''}`}>
                  <div className="text-sm font-medium text-ink">{n.title}</div>
                  <div className="text-xs text-ink-faint">{n.message}</div>
                  <div className="text-xs text-ink-faint mt-0.5">{timeAgo(n.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-soft-lg p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-semibold text-ink text-sm">{state.workspace?.name}</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}><X size={20} className="text-ink-muted" /></button>
            </div>
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'leads', label: 'Leads', icon: Users },
                { id: 'clients', label: 'Clients', icon: UserCircle },
                { id: 'projects', label: 'Projects', icon: FolderKanban },
                { id: 'invoices', label: 'Payments', icon: CreditCard },
                { id: 'meetings', label: 'Meetings', icon: Calendar },
                { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'team', label: 'Team', icon: UserPlus },
                { id: 'activity', label: 'Activity', icon: Activity },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(item => (
                <button key={item.id} onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${currentPage === item.id ? 'bg-primary-50 text-primary-600' : 'text-ink-muted'}`}>
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
