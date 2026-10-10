import { useState, useEffect, useCallback, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { getState, subscribe, actions } from './lib/store';
import { AppState, Plan, PLAN_LIMITS, Lead, Client, Project } from './lib/types';
import { LayoutDashboard, Users, UserCircle, FolderKanban, Receipt, CreditCard, MessageSquare, CalendarDays, CheckSquare, FileText, UserPlus, Settings, Activity, LogOut, Search, Bell, Menu, X, Plus, ChevronDown, Star, TrendingUp, Clock, ArrowRight, Filter, MoreVertical, Trash2, GripVertical, Send, Upload, Eye, Edit, Download, ChevronRight, BarChart3, Target, Zap, Shield, Globe, Sparkles, Heart, Award, ArrowUpRight, Check, AlertCircle, IndianRupee, DollarSign, Building2, Phone, Mail, MapPin, Tag, Calendar, FileCheck, PenTool, Link2, ExternalLink, Copy, RefreshCw, ChevronLeft } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

// ============ HOOK ============
function useAppState(): AppState {
  const [state, setState] = useState(getState());
  useEffect(() => subscribe(() => setState(getState())), []);
  return state;
}

// ============ AUTH GUARD ============
function AuthGuard({ children }: { children: ReactNode }) {
  const state = useAppState();
  if (!state.isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

// ============ APP SHELL ============
function AppShell({ children }: { children: ReactNode }) {
  const state = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/leads', icon: Target, label: 'Leads' },
    { path: '/app/clients', icon: Users, label: 'Clients' },
    { path: '/app/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/app/retainers', icon: RefreshCw, label: 'Retainers' },
    { path: '/app/invoices', icon: Receipt, label: 'Invoices' },
    { path: '/app/payments', icon: CreditCard, label: 'Payments' },
    { path: '/app/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/app/meetings', icon: CalendarDays, label: 'Meetings' },
    { path: '/app/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/app/documents', icon: FileText, label: 'Documents' },
    { path: '/app/team', icon: UserPlus, label: 'Team' },
    { path: '/app/billing', icon: CreditCard, label: 'Billing' },
  ];

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 1 ? [
    ...state.clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(c => ({ type: 'Client', name: c.name, sub: c.company, path: '/app/clients' })),
    ...state.leads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.company.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(l => ({ type: 'Lead', name: l.name, sub: l.company, path: '/app/leads' })),
    ...state.projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(p => ({ type: 'Project', name: p.name, sub: '', path: '/app/projects' })),
  ] : [];

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-line shrink-0">
        <div className="p-4 border-b border-line">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-ink">ClienterTap</span>
          </Link>
        </div>
        <div className="p-3 border-b border-line">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {state.users[0]?.name?.[0] || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{state.workspace?.name}</p>
              <p className="text-xs text-ink-muted capitalize">{state.workspace?.plan} plan</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-primary-50 text-primary-700' : 'text-ink-muted hover:bg-line/50 hover:text-ink'}`}>
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-line mt-2 pt-2">
            <Link to="/app/activity" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/app/activity' ? 'bg-primary-50 text-primary-700' : 'text-ink-muted hover:bg-line/50 hover:text-ink'}`}>
              <Activity className="w-4.5 h-4.5" /> Activity
            </Link>
            <Link to="/app/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/app/settings' ? 'bg-primary-50 text-primary-700' : 'text-ink-muted hover:bg-line/50 hover:text-ink'}`}>
              <Settings className="w-4.5 h-4.5" /> Settings
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-surface animate-slide-up">
            <div className="p-4 border-b border-line flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
                <span className="font-bold text-lg text-ink">ClienterTap</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-2 overflow-y-auto h-[calc(100vh-73px)]">
              {navItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${location.pathname === item.path ? 'bg-primary-50 text-primary-700' : 'text-ink-muted'}`}>
                  <item.icon className="w-5 h-5" />{item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-line bg-surface flex items-center px-4 gap-3 shrink-0">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="flex-1 relative">
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-canvas border border-line rounded-lg text-sm text-ink-muted hover:border-primary-300 transition-colors w-full max-w-md">
              <Search className="w-4 h-4" />
              <span>Search clients, leads, projects...</span>
            </button>
          </div>
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 relative hover:bg-canvas rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-ink-muted" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-surface border border-line rounded-xl shadow-soft-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-line flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <button onClick={() => actions.markAllNotificationsRead()} className="text-xs text-primary-600 hover:text-primary-700">Mark all read</button>
                </div>
                {state.notifications.map(n => (
                  <div key={n.id} className={`p-3 border-b border-line-soft ${!n.read ? 'bg-primary-50/30' : ''}`}>
                    <p className="text-sm font-medium text-ink">{n.title}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm cursor-pointer">
            {state.users[0]?.name?.[0] || 'V'}
          </div>
        </header>

        {/* Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
            <div className="absolute inset-0 bg-black/40" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
            <div className="relative w-full max-w-lg bg-surface rounded-xl shadow-soft-lg border border-line mx-4">
              <div className="flex items-center gap-2 p-3 border-b border-line">
                <Search className="w-5 h-5 text-ink-muted" />
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="flex-1 text-sm outline-none bg-transparent" />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-xs text-ink-muted">ESC</button>
              </div>
              {searchResults.length > 0 && (
                <div className="p-2 max-h-64 overflow-y-auto">
                  {searchResults.map((r, i) => (
                    <button key={i} onClick={() => { navigate(r.path); setSearchOpen(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-canvas text-left">
                      <span className="text-xs font-medium text-ink-muted bg-line px-1.5 py-0.5 rounded">{r.type}</span>
                      <div><p className="text-sm font-medium">{r.name}</p>{r.sub && <p className="text-xs text-ink-muted">{r.sub}</p>}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-line shadow-up flex items-center justify-around py-2 px-2 z-40">
        {[
          { path: '/app', icon: LayoutDashboard, label: 'Home' },
          { path: '/app/leads', icon: Target, label: 'Leads' },
          { path: '/app/projects', icon: FolderKanban, label: 'Projects' },
          { path: '/app/invoices', icon: Receipt, label: 'Invoices' },
          { path: '/app/settings', icon: Settings, label: 'More' },
        ].map(item => (
          <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === item.path ? 'text-primary-600' : 'text-ink-muted'}`}>
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

// ============ DASHBOARD PAGE ============
function DashboardPage() {
  const state = useAppState();
  const navigate = useNavigate();
  const openLeads = state.leads.filter(l => !l.isWon && !l.isLost);
  const pipelineValue = openLeads.reduce((s, l) => s + l.estimatedValue, 0);
  const wonLeads = state.leads.filter(l => l.isWon);
  const winRate = state.leads.length > 0 ? Math.round((wonLeads.length / state.leads.length) * 100) : 0;
  const thisMonthRevenue = state.projects.filter(p => p.createdAt.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, p) => s + p.budget, 0);
  const received = state.payments.reduce((s, p) => s + p.amount, 0);
  const expenses = 0;
  const moneyInAccount = received - expenses;
  const activeRetainers = state.retainers.filter(r => r.status === 'active');
  const mrr = activeRetainers.reduce((s, r) => s + r.amount, 0);

  const revenueData = [
    { month: 'Oct', received: 45000, pending: 12000 },
    { month: 'Nov', received: 68000, pending: 8000 },
    { month: 'Dec', received: 52000, pending: 25000 },
    { month: 'Jan', received: 118000, pending: 15000 },
    { month: 'Feb', received: 85000, pending: 20000 },
    { month: 'Mar', received: 92000, pending: 30000 },
  ];

  const upcomingMeetings = state.meetings.filter(m => new Date(m.date) >= new Date()).slice(0, 4);
  const upcomingTasks = state.tasks.filter(t => t.status !== 'done').slice(0, 4);

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Welcome back, {state.users[0]?.name?.split(' ')[0] || 'there'}</h1>
        <p className="text-sm text-ink-muted mt-1">Here's what's happening with your business today.</p>
        <p className="text-xs text-ink-faint mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Sales Pipeline Card */}
      <div className="bg-surface border border-line rounded-2xl p-5 shadow-soft mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink">Sales Pipeline</h2>
          <button onClick={() => navigate('/app/leads')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">View →</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div><p className="text-2xl font-bold text-ink">{openLeads.length}</p><p className="text-xs text-ink-muted">Open leads</p></div>
          <div><p className="text-2xl font-bold text-ink">₹{(pipelineValue / 100000).toFixed(1)}L</p><p className="text-xs text-ink-muted">Pipeline value</p></div>
          <div><p className="text-2xl font-bold text-ink">{wonLeads.length}/mo</p><p className="text-xs text-ink-muted">Won per month</p></div>
          <div><p className="text-2xl font-bold text-ink">{winRate}%</p><p className="text-xs text-ink-muted">Win rate</p></div>
        </div>
      </div>

      {/* This Month Stats */}
      <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">This month</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue" value={`₹${(thisMonthRevenue / 1000).toFixed(0)}K`} caption="Sum of new project budgets" icon={TrendingUp} color="text-green-600" />
        <StatCard label="Received" value={`₹${(received / 1000).toFixed(0)}K`} caption="Payments collected" icon={CreditCard} color="text-primary-600" />
        <StatCard label="Expenses" value={`₹${(expenses / 1000).toFixed(0)}K`} caption="Team payouts & tools" icon={ArrowUpRight} color="text-red-500" />
        <StatCard label="In account" value={`₹${(moneyInAccount / 1000).toFixed(0)}K`} caption="Received - Expenses" icon={BarChart3} color="text-blue-600" />
      </div>

      {/* Pipeline & Clients */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <MiniStat label="New projects" value={state.projects.filter(p => p.status === 'new').length} />
        <MiniStat label="Ongoing" value={state.projects.filter(p => p.status === 'ongoing').length} />
        <MiniStat label="Completed" value={state.projects.filter(p => p.status === 'completed').length} />
        <MiniStat label="Total projects" value={state.projects.length} />
        <MiniStat label="Total clients" value={state.clients.length} />
        <div className="bg-surface border border-line rounded-xl p-3">
          <p className="text-xs text-ink-muted">Active retainers</p>
          <p className="text-lg font-bold text-ink">{activeRetainers.length}</p>
          <p className="text-xs text-primary-600 font-medium">MRR ${mrr}/mo</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface border border-line rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold text-ink mb-4">6-month revenue trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#78716C" />
              <YAxis tick={{ fontSize: 12 }} stroke="#78716C" />
              <Tooltip />
              <Bar dataKey="received" fill="#ea580c" radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="pending" fill="#fed7aa" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface border border-line rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold text-ink mb-4">All-time revenue overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-ink-muted">Total value</p><p className="text-lg font-bold">₹3.3L</p></div>
            <div><p className="text-xs text-ink-muted">Received</p><p className="text-lg font-bold text-green-600">₹2.18L</p></div>
            <div><p className="text-xs text-ink-muted">Pending</p><p className="text-lg font-bold text-amber-600">₹1.12L</p></div>
            <div><p className="text-xs text-ink-muted">Collection rate</p><p className="text-lg font-bold text-primary-600">73%</p></div>
          </div>
          <div className="mt-4 h-3 bg-line rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full" style={{ width: '73%' }} />
          </div>
        </div>
      </div>

      {/* Upcoming & Recent */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface border border-line rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ink">Upcoming reminders</h3>
            <button onClick={() => navigate('/app/meetings')} className="text-xs text-primary-600 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {upcomingMeetings.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-canvas">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center"><CalendarDays className="w-4 h-4 text-primary-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{m.title}</p>
                  <p className="text-xs text-ink-muted">{m.date} at {m.time}</p>
                </div>
              </div>
            ))}
            {upcomingTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-canvas">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><CheckSquare className="w-4 h-4 text-blue-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{t.title}</p>
                  <p className="text-xs text-ink-muted">Due {t.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface border border-line rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ink">Recent clients</h3>
            <button onClick={() => navigate('/app/clients')} className="text-xs text-primary-600 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {state.clients.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-canvas">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs">{c.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                  <p className="text-xs text-ink-muted">{c.company}</p>
                </div>
                <span className="text-xs text-ink-faint">{c.phone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/app/clients')} className="bg-surface border border-line rounded-2xl p-5 shadow-soft hover:shadow-soft-md transition-shadow text-left">
          <Plus className="w-6 h-6 text-primary-600 mb-2" />
          <p className="font-semibold text-ink">Add client</p>
          <p className="text-xs text-ink-muted mt-1">Create a new client record</p>
        </button>
        <button onClick={() => navigate('/app/meetings')} className="bg-surface border border-line rounded-2xl p-5 shadow-soft hover:shadow-soft-md transition-shadow text-left">
          <CalendarDays className="w-6 h-6 text-primary-600 mb-2" />
          <p className="font-semibold text-ink">Schedule meeting</p>
          <p className="text-xs text-ink-muted mt-1">Book a call or video meeting</p>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, caption, icon: Icon, color }: { label: string; value: string; caption: string; icon: any; color: string }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-ink-muted">{label}</span>
      </div>
      <p className="text-xl font-bold text-ink">{value}</p>
      <p className="text-[11px] text-ink-faint mt-1">{caption}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

// ============ LEADS PAGE ============
function LeadsPage() {
  const state = useAppState();
  const [showAddLead, setShowAddLead] = useState(false);
  const [showStages, setShowStages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const openLeads = state.leads.filter(l => !l.isWon && !l.isLost && !l.convertedToClientId);
  const pipelineValue = openLeads.reduce((s, l) => s + l.estimatedValue, 0);
  const wonCount = state.leads.filter(l => l.isWon).length;
  const winRate = state.leads.length > 0 ? Math.round((state.leads.filter(l => l.isWon).length / state.leads.length) * 100) : 0;

  const filteredLeads = state.leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone.includes(searchQuery)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      actions.moveLead(active.id as string, over.id as string);
    }
    setDraggedLead(null);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-line bg-surface">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-ink">Leads Pipeline</h1>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-ink-muted">Open: <strong className="text-ink">{openLeads.length}</strong></span>
              <span className="text-ink-muted">Pipeline: <strong className="text-ink">₹{(pipelineValue / 100000).toFixed(1)}L</strong></span>
              <span className="text-ink-muted">Won: <strong className="text-ink">{wonCount}</strong></span>
              <span className="text-ink-muted">Win rate: <strong className="text-ink">{winRate}%</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search leads..." className="pl-9 pr-3 py-2 text-sm border border-line rounded-lg bg-canvas w-48 focus:outline-none focus:border-primary-400" />
            </div>
            <button onClick={() => setBulkMode(!bulkMode)} className={`px-3 py-2 text-sm rounded-lg border ${bulkMode ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-line text-ink-muted hover:bg-canvas'}`}>
              Select
            </button>
            <button onClick={() => setShowStages(true)} className="px-3 py-2 text-sm rounded-lg border border-line text-ink-muted hover:bg-canvas">
              Stages
            </button>
            <button onClick={() => setShowAddLead(true)} className="px-3 py-2 text-sm rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 shadow-ember flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Lead
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4 lg:p-6">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={(e) => setDraggedLead(e.active.id as string)}>
          <div className="flex gap-4 min-w-max">
            {state.stages.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.stageId === stage.id && !l.isWon && !l.isLost);
              return (
                <DroppableColumn key={stage.id} id={stage.id}>
                  <div className="w-72 shrink-0">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                        <h3 className="text-sm font-semibold text-ink">{stage.name}</h3>
                        <span className="text-xs text-ink-muted bg-line px-1.5 py-0.5 rounded-full">{stageLeads.length}</span>
                      </div>
                      <button onClick={() => setShowAddLead(true)} className="p-1 hover:bg-canvas rounded"><Plus className="w-4 h-4 text-ink-muted" /></button>
                    </div>
                    <div className="space-y-2 min-h-[200px]">
                      {stageLeads.map(lead => (
                        <DraggableCard key={lead.id} id={lead.id}>
                          <div onClick={() => !bulkMode && setDrawerLead(lead)} className={`bg-surface border border-line rounded-xl p-3 shadow-soft cursor-pointer hover:shadow-soft-md transition-shadow ${bulkMode ? '' : ''}`}>
                            {bulkMode && (
                              <input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={e => {
                                if (e.target.checked) setSelectedLeads([...selectedLeads, lead.id]);
                                else setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                              }} className="mb-2" />
                            )}
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-ink">{lead.name}</p>
                                <p className="text-xs text-ink-muted">{lead.company}</p>
                              </div>
                              <GripVertical className="w-4 h-4 text-ink-faint cursor-grab" />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-semibold text-ink">{lead.currency === 'INR' ? '₹' : '$'}{lead.estimatedValue.toLocaleString()}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-line text-ink-muted">{lead.source}</span>
                            </div>
                            {lead.followUpDate && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                                <Clock className="w-3 h-3" /> Follow up: {lead.followUpDate}
                              </div>
                            )}
                          </div>
                        </DraggableCard>
                      ))}
                    </div>
                  </div>
                </DroppableColumn>
              );
            })}
          </div>
          <DragOverlay>
            {draggedLead ? (
              <div className="bg-surface border-2 border-primary-400 rounded-xl p-3 shadow-lift-3 w-64 opacity-90 rotate-2">
                <p className="text-sm font-medium">{state.leads.find(l => l.id === draggedLead)?.name}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Add Lead Modal */}
      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} />}
      {/* Manage Stages Modal */}
      {showStages && <ManageStagesModal onClose={() => setShowStages(false)} />}
      {/* Lead Drawer */}
      {drawerLead && <LeadDrawer lead={drawerLead} onClose={() => setDrawerLead(null)} />}
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${isOver ? 'bg-primary-50/50 rounded-xl' : ''} transition-colors`}>
      {children}
    </div>
  );
}

function DraggableCard({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={isDragging ? 'opacity-50' : ''}>
      {children}
    </div>
  );
}

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', source: 'Website', stageId: state.stages[0]?.id || '', estimatedValue: 0, currency: state.workspace?.currency || 'INR', notes: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company) { setError('Name and company are required'); return; }
    const result = actions.addLead(form);
    if (result.error) { setError(result.error); return; }
    onClose();
  };

  return (
    <Modal title="Add Lead" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Contact Name *" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <InputField label="Company *" value={form.company} onChange={v => setForm({ ...form, company: v })} />
          <InputField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <InputField label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Source</label>
            <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas focus:outline-none focus:border-primary-400">
              {['Instagram', 'Website', 'Referral', 'Ads', 'Cold Call', 'IndiaMART', 'Meta', 'Google Ads', 'Marketplace', 'Webhook', 'Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Stage</label>
            <select value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas focus:outline-none focus:border-primary-400">
              {state.stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <InputField label="Estimated Value" type="number" value={String(form.estimatedValue)} onChange={v => setForm({ ...form, estimatedValue: Number(v) })} />
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Currency</label>
            <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas focus:outline-none focus:border-primary-400">
              {['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'AED', 'SGD'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas focus:outline-none focus:border-primary-400 resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Add Lead</button>
        </div>
      </form>
    </Modal>
  );
}

function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState(lead);
  const [showLostReason, setShowLostReason] = useState(false);
  const [lostReason, setLostReason] = useState('');

  const handleSave = () => {
    actions.updateLead(lead.id, form);
    onClose();
  };

  const handleMarkLost = () => {
    if (!lostReason) return;
    actions.updateLead(lead.id, { isLost: true, lostReason });
    onClose();
  };

  const handleConvert = () => {
    const result = actions.convertLeadToClient(lead.id);
    if (result.error) { alert(result.error); return; }
    onClose();
  };

  const stage = state.stages.find(s => s.id === lead.stageId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface h-full overflow-y-auto animate-slide-up lg:animate-none">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-semibold text-ink">{lead.company}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: stage?.color + '20', color: stage?.color }}>{stage?.name}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-canvas rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setShowLostReason(true)} className="flex-1 px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium">Mark Lost</button>
            <button onClick={handleConvert} className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Convert to Client</button>
          </div>

          {showLostReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-700 mb-2">Why did we lose this lead?</p>
              <input value={lostReason} onChange={e => setLostReason(e.target.value)} placeholder="Reason..." className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg mb-2" />
              <button onClick={handleMarkLost} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg">Confirm</button>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Lead Details</h3>
            <InputField label="Contact Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <InputField label="Company" value={form.company} onChange={v => setForm({ ...form, company: v })} />
            <InputField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
            <InputField label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
            <InputField label="Estimated Value" type="number" value={String(form.estimatedValue)} onChange={v => setForm({ ...form, estimatedValue: Number(v) })} />
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Source</label>
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
                {['Instagram', 'Website', 'Referral', 'Ads', 'Cold Call', 'IndiaMART', 'Meta', 'Google Ads', 'Marketplace', 'Webhook', 'Other'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Follow-up Date</label>
              <input type="date" value={form.followUpDate || ''} onChange={e => setForm({ ...form, followUpDate: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas" />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas resize-none" />
            </div>
          </div>

          <div className="pt-3 border-t border-line">
            <h3 className="text-sm font-semibold text-ink mb-2">Pipeline</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-ink-muted">Stage:</span> <span className="font-medium">{stage?.name}</span></div>
              <div><span className="text-ink-muted">Source:</span> <span className="font-medium">{lead.source}</span></div>
              <div><span className="text-ink-muted">Created:</span> <span className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</span></div>
              <div><span className="text-ink-muted">Value:</span> <span className="font-medium">{lead.currency === 'INR' ? '₹' : '$'}{lead.estimatedValue.toLocaleString()}</span></div>
            </div>
          </div>

          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ManageStagesModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');

  return (
    <Modal title="Manage Stages" onClose={onClose}>
      <div className="space-y-3">
        {state.stages.map(stage => (
          <div key={stage.id} className="flex items-center gap-3 p-3 border border-line rounded-lg">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
            <span className="flex-1 text-sm font-medium">{stage.name}</span>
            <button onClick={() => { const result = actions.deleteStage(stage.id); if (result.error) alert(result.error); }} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-2 border-t border-line">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New stage name" className="flex-1 px-3 py-2 text-sm border border-line rounded-lg" />
          <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-10 rounded-lg border border-line cursor-pointer" />
          <button onClick={() => { if (newName) { actions.addStage(newName, newColor); setNewName(''); } }} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg">Add</button>
        </div>
      </div>
    </Modal>
  );
}

// ============ CLIENTS PAGE ============
function ClientsPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filtered = state.clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Clients</h1>
          <p className="text-sm text-ink-muted">{state.clients.length} total clients</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 text-sm border border-line rounded-lg bg-surface w-48" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-line rounded-lg bg-surface">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="lead">Lead</option>
            <option value="on-hold">On-hold</option>
          </select>
          <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Client
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map(client => {
          const clientProjects = state.projects.filter(p => p.clientId === client.id);
          const clientInvoices = state.invoices.filter(i => i.clientId === client.id);
          const totalInvoiced = clientInvoices.reduce((s, i) => s + i.total, 0);
          const totalPaid = clientInvoices.reduce((s, i) => s + i.amountPaid, 0);

          return (
            <div key={client.id} onClick={() => setSelectedClient(client)} className="bg-surface border border-line rounded-xl p-4 shadow-soft hover:shadow-soft-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">{client.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-ink">{client.name}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${client.status === 'active' ? 'bg-green-50 text-green-700' : client.status === 'on-hold' ? 'bg-amber-50 text-amber-700' : 'bg-line text-ink-muted'}`}>{client.status}</span>
                    {client.portalEnabled && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">Portal</span>}
                  </div>
                  <p className="text-xs text-ink-muted">{client.company} · {client.email} · {client.phone}</p>
                </div>
                <div className="hidden lg:flex items-center gap-6 text-right">
                  <div><p className="text-xs text-ink-muted">Projects</p><p className="text-sm font-semibold">{clientProjects.length}</p></div>
                  <div><p className="text-xs text-ink-muted">Invoiced</p><p className="text-sm font-semibold">{client.currency === 'INR' ? '₹' : '$'}{totalInvoiced.toLocaleString()}</p></div>
                  <div><p className="text-xs text-ink-muted">Paid</p><p className="text-sm font-semibold text-green-600">{client.currency === 'INR' ? '₹' : '$'}{totalPaid.toLocaleString()}</p></div>
                </div>
              </div>
              {client.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {client.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-line text-ink-muted">{tag}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-ink-faint mx-auto mb-3" />
          <p className="text-ink-muted">No clients found</p>
        </div>
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
      {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
    </div>
  );
}

function AddClientModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', address: '', currency: state.workspace?.currency || 'INR', status: 'active' as const, tags: [] as string[], portalEnabled: false, gstin: '', notes: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setError('Name is required'); return; }
    const result = actions.addClient(form);
    if (result.error) { setError(result.error); return; }
    onClose();
  };

  return (
    <Modal title="Add Client" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Name *" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <InputField label="Company" value={form.company} onChange={v => setForm({ ...form, company: v })} />
          <InputField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <InputField label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <InputField label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
          <InputField label="GSTIN" value={form.gstin} onChange={v => setForm({ ...form, gstin: v })} />
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Currency</label>
            <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
              {['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'AED', 'SGD'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
              <option value="active">Active</option>
              <option value="lead">Lead</option>
              <option value="on-hold">On-hold</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.portalEnabled} onChange={e => setForm({ ...form, portalEnabled: e.target.checked })} id="portal" />
          <label htmlFor="portal" className="text-sm text-ink">Enable client portal access</label>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Add Client</button>
        </div>
      </form>
    </Modal>
  );
}

function ClientDetailModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const state = useAppState();
  const projects = state.projects.filter(p => p.clientId === client.id);
  const invoices = state.invoices.filter(i => i.clientId === client.id);
  const payments = state.payments.filter(p => p.clientId === client.id);
  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = totalInvoiced - totalPaid;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface h-full overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">{client.name[0]}</div>
            <div>
              <h2 className="font-semibold text-ink">{client.name}</h2>
              <p className="text-xs text-ink-muted">{client.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-canvas rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-canvas rounded-lg p-3 text-center">
              <p className="text-xs text-ink-muted">Invoiced</p>
              <p className="text-lg font-bold">{client.currency === 'INR' ? '₹' : '$'}{totalInvoiced.toLocaleString()}</p>
            </div>
            <div className="bg-canvas rounded-lg p-3 text-center">
              <p className="text-xs text-ink-muted">Paid</p>
              <p className="text-lg font-bold text-green-600">{client.currency === 'INR' ? '₹' : '$'}{totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-canvas rounded-lg p-3 text-center">
              <p className="text-xs text-ink-muted">Outstanding</p>
              <p className="text-lg font-bold text-amber-600">{client.currency === 'INR' ? '₹' : '$'}{outstanding.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-ink-muted" />{client.email}</div>
            <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-ink-muted" />{client.phone}</div>
            {client.address && <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-ink-muted" />{client.address}</div>}
            {client.gstin && <div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-ink-muted" />GSTIN: {client.gstin}</div>}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Projects ({projects.length})</h3>
            {projects.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 border border-line rounded-lg mb-2">
                <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-ink-muted">{p.status}</p></div>
                <p className="text-sm font-semibold">{p.currency === 'INR' ? '₹' : '$'}{p.budget.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Invoices ({invoices.length})</h3>
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-2 border border-line rounded-lg mb-2">
                <div><p className="text-sm font-medium">{inv.number}</p><p className="text-xs text-ink-muted">{inv.status}</p></div>
                <p className="text-sm font-semibold">{inv.currency === 'INR' ? '₹' : '$'}{inv.total.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-line">
            <span className={`text-xs px-2 py-1 rounded-full ${client.portalEnabled ? 'bg-green-50 text-green-700' : 'bg-line text-ink-muted'}`}>
              Portal: {client.portalEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <span className="text-xs text-ink-muted">Currency: {client.currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PROJECTS PAGE ============
function ProjectsPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const columns = [
    { key: 'new', label: 'New', color: '#3b82f6' },
    { key: 'ongoing', label: 'Ongoing', color: '#f59e0b' },
    { key: 'completed', label: 'Completed', color: '#22c55e' },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="p-4 lg:p-6 border-b border-line bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">Projects</h1>
            <p className="text-sm text-ink-muted">{state.projects.length} projects</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-line rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('kanban')} className={`px-3 py-1.5 text-sm ${viewMode === 'kanban' ? 'bg-primary-50 text-primary-700' : 'text-ink-muted'}`}>Board</button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-primary-50 text-primary-700' : 'text-ink-muted'}`}>List</button>
            </div>
            <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Project
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4 lg:p-6">
        {viewMode === 'kanban' ? (
          <div className="flex gap-4 min-w-max">
            {columns.map(col => {
              const colProjects = state.projects.filter(p => p.status === col.key);
              return (
                <div key={col.key} className="w-80 shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="text-sm font-semibold">{col.label}</h3>
                    <span className="text-xs text-ink-muted bg-line px-1.5 py-0.5 rounded-full">{colProjects.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colProjects.map(project => {
                      const client = state.clients.find(c => c.id === project.clientId);
                      const paid = state.invoices.filter(i => i.projectId === project.id).reduce((s, i) => s + i.amountPaid, 0);
                      const pending = project.budget - paid;
                      return (
                        <div key={project.id} onClick={() => setSelectedProject(project)} className="bg-surface border border-line rounded-xl p-3 shadow-soft cursor-pointer hover:shadow-soft-md transition-shadow">
                          <p className="text-sm font-medium text-ink">{project.name}</p>
                          <p className="text-xs text-ink-muted mt-0.5">{client?.company || 'Unknown'}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm font-semibold">{project.currency === 'INR' ? '₹' : '$'}{project.budget.toLocaleString()}</span>
                            <span className="text-xs text-amber-600">Pending: {project.currency === 'INR' ? '₹' : '$'}{pending.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-line text-ink-muted">{project.type}</span>
                            <span className="text-[10px] text-ink-faint">{project.deadline}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
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
                    <tr key={p.id} onClick={() => setSelectedProject(p)} className="border-b border-line-soft hover:bg-canvas cursor-pointer">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-ink-muted">{client?.company}</td>
                      <td className="px-4 py-3">{p.currency === 'INR' ? '₹' : '$'}{p.budget.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'completed' ? 'bg-green-50 text-green-700' : p.status === 'ongoing' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{p.status}</span></td>
                      <td className="px-4 py-3 text-ink-muted">{p.deadline}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddProjectModal onClose={() => setShowAdd(false)} />}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}

function AddProjectModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({ clientId: state.clients[0]?.id || '', name: '', type: 'one-off' as const, budget: 0, currency: state.workspace?.currency || 'INR', startDate: new Date().toISOString().split('T')[0], deadline: '', description: '', status: 'new' as const });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.clientId) { setError('Name and client are required'); return; }
    const result = actions.addProject(form);
    if (result.error) { setError(result.error); return; }
    onClose();
  };

  return (
    <Modal title="Add Project" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Client *</label>
          <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
            {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
          </select>
        </div>
        <InputField label="Project Name *" value={form.name} onChange={v => setForm({ ...form, name: v })} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
              <option value="one-off">One-off</option>
              <option value="retainer">Monthly Retainer</option>
            </select>
          </div>
          <InputField label="Budget" type="number" value={String(form.budget)} onChange={v => setForm({ ...form, budget: Number(v) })} />
          <InputField label="Start Date" type="date" value={form.startDate} onChange={v => setForm({ ...form, startDate: v })} />
          <InputField label="Deadline" type="date" value={form.deadline} onChange={v => setForm({ ...form, deadline: v })} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Create Project</button>
        </div>
      </form>
    </Modal>
  );
}

function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const state = useAppState();
  const client = state.clients.find(c => c.id === project.clientId);
  const projectInvoices = state.invoices.filter(i => i.projectId === project.id);
  const totalPaid = projectInvoices.reduce((s, i) => s + i.amountPaid, 0);
  const pending = project.budget - totalPaid;
  const progress = project.budget > 0 ? Math.round((totalPaid / project.budget) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface h-full overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-semibold text-ink">{project.name}</h2>
            <p className="text-xs text-ink-muted">{client?.company}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-canvas rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-canvas rounded-lg p-3 text-center">
              <p className="text-xs text-ink-muted">Budget</p>
              <p className="text-lg font-bold">{project.currency === 'INR' ? '₹' : '$'}{project.budget.toLocaleString()}</p>
            </div>
            <div className="bg-canvas rounded-lg p-3 text-center">
              <p className="text-xs text-ink-muted">Received</p>
              <p className="text-lg font-bold text-green-600">{project.currency === 'INR' ? '₹' : '$'}{totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-canvas rounded-lg p-3 text-center">
              <p className="text-xs text-ink-muted">Pending</p>
              <p className="text-lg font-bold text-amber-600">{project.currency === 'INR' ? '₹' : '$'}{pending.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-ink-muted">Progress</span>
              <span className="text-xs font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-line rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-ink-muted">Type:</span> <span className="font-medium capitalize">{project.type}</span></div>
            <div><span className="text-ink-muted">Status:</span> <span className="font-medium capitalize">{project.status}</span></div>
            <div><span className="text-ink-muted">Start:</span> <span className="font-medium">{project.startDate}</span></div>
            <div><span className="text-ink-muted">Deadline:</span> <span className="font-medium">{project.deadline}</span></div>
          </div>

          {project.description && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Description</h3>
              <p className="text-sm text-ink-muted">{project.description}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <select value={project.status} onChange={e => actions.updateProject(project.id, { status: e.target.value as any })} className="flex-1 px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
              <option value="new">New</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ INVOICES PAGE ============
function InvoicesPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? state.invoices : state.invoices.filter(i => i.status === filter);
  const totalOutstanding = state.invoices.reduce((s, i) => s + (i.total - i.amountPaid), 0);

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Invoices</h1>
          <p className="text-sm text-ink-muted">{state.invoices.length} invoices · Outstanding: ₹{totalOutstanding.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Invoice
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['all', 'draft', 'sent', 'partial', 'paid', 'overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${filter === f ? 'bg-primary-50 text-primary-700 font-medium' : 'text-ink-muted hover:bg-canvas'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-canvas border-b border-line">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-ink-muted">Invoice</th>
              <th className="text-left px-4 py-3 font-medium text-ink-muted">Client</th>
              <th className="text-left px-4 py-3 font-medium text-ink-muted">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-ink-muted">Paid</th>
              <th className="text-left px-4 py-3 font-medium text-ink-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-ink-muted">Due</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
              const client = state.clients.find(c => c.id === inv.clientId);
              return (
                <tr key={inv.id} className="border-b border-line-soft hover:bg-canvas">
                  <td className="px-4 py-3 font-medium">{inv.number}</td>
                  <td className="px-4 py-3 text-ink-muted">{client?.company || '—'}</td>
                  <td className="px-4 py-3">{inv.currency === 'INR' ? '₹' : '$'}{inv.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600">{inv.currency === 'INR' ? '₹' : '$'}{inv.amountPaid.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status === 'paid' ? 'bg-green-50 text-green-700' : inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : inv.status === 'overdue' ? 'bg-red-50 text-red-700' : inv.status === 'sent' ? 'bg-blue-50 text-blue-700' : 'bg-line text-ink-muted'}`}>
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

      {showAdd && <AddInvoiceModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddInvoiceModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({
    clientId: state.clients[0]?.id || '',
    projectId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    currency: state.workspace?.currency || 'INR',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, taxRate: 18, amount: 0 }],
    discount: 0,
    notes: '',
  });

  const updateItem = (idx: number, field: string, value: any) => {
    const items = [...form.items];
    (items[idx] as any)[field] = value;
    items[idx].amount = items[idx].quantity * items[idx].rate;
    setForm({ ...form, items });
  };

  const subtotal = form.items.reduce((s, i) => s + i.amount, 0);
  const taxAmount = form.items.reduce((s, i) => s + (i.amount * i.taxRate / 100), 0);
  const total = subtotal + taxAmount - form.discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.addInvoice({ ...form, subtotal, taxAmount, total, amountPaid: 0, status: 'draft' });
    onClose();
  };

  return (
    <Modal title="Create Invoice" onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Client *</label>
            <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
              {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Project</label>
            <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
              <option value="">None</option>
              {state.projects.filter(p => p.clientId === form.clientId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <InputField label="Issue Date" type="date" value={form.issueDate} onChange={v => setForm({ ...form, issueDate: v })} />
          <InputField label="Due Date" type="date" value={form.dueDate} onChange={v => setForm({ ...form, dueDate: v })} />
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Line Items</h3>
          {form.items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
              <div className="col-span-5">
                <input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Description" className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas" />
              </div>
              <div className="col-span-2">
                <input type="number" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} placeholder="Qty" className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas" />
              </div>
              <div className="col-span-2">
                <input type="number" value={item.rate} onChange={e => updateItem(idx, 'rate', Number(e.target.value))} placeholder="Rate" className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas" />
              </div>
              <div className="col-span-2">
                <input type="number" value={item.taxRate} onChange={e => updateItem(idx, 'taxRate', Number(e.target.value))} placeholder="Tax %" className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas" />
              </div>
              <div className="col-span-1 text-right text-sm font-medium">{form.currency === 'INR' ? '₹' : '$'}{item.amount.toLocaleString()}</div>
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { id: String(Date.now()), description: '', quantity: 1, rate: 0, taxRate: 18, amount: 0 }] })} className="text-sm text-primary-600 font-medium">+ Add item</button>
        </div>

        <div className="bg-canvas rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-ink-muted">Subtotal</span><span>{form.currency === 'INR' ? '₹' : '$'}{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-ink-muted">Tax</span><span>{form.currency === 'INR' ? '₹' : '$'}{taxAmount.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-ink-muted">Discount</span>
            <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} className="w-24 px-2 py-1 text-sm border border-line rounded text-right" />
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-line"><span>Total</span><span>{form.currency === 'INR' ? '₹' : '$'}{total.toLocaleString()}</span></div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Create Invoice</button>
        </div>
      </form>
    </Modal>
  );
}

// ============ OTHER APP PAGES ============
function PaymentsPage() {
  const state = useAppState();
  const [showRecord, setShowRecord] = useState(false);

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Payments</h1>
          <p className="text-sm text-ink-muted">{state.payments.length} payments recorded</p>
        </div>
        <button onClick={() => setShowRecord(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>
      <div className="bg-surface border border-line rounded-xl overflow-hidden">
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
            {state.payments.map(p => {
              const client = state.clients.find(c => c.id === p.clientId);
              return (
                <tr key={p.id} className="border-b border-line-soft hover:bg-canvas">
                  <td className="px-4 py-3">{p.date}</td>
                  <td className="px-4 py-3 font-medium">{client?.company || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{p.currency === 'INR' ? '₹' : '$'}{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.method}</td>
                  <td className="px-4 py-3 text-ink-muted font-mono text-xs">{p.reference}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showRecord && <RecordPaymentModal onClose={() => setShowRecord(false)} />}
    </div>
  );
}

function RecordPaymentModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({ invoiceId: state.invoices[0]?.id || '', clientId: state.invoices[0]?.clientId || '', amount: 0, currency: state.workspace?.currency || 'INR', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', reference: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount <= 0) return;
    actions.addPayment(form);
    onClose();
  };

  return (
    <Modal title="Record Payment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Invoice</label>
          <select value={form.invoiceId} onChange={e => { const inv = state.invoices.find(i => i.id === e.target.value); if (inv) setForm({ ...form, invoiceId: inv.id, clientId: inv.clientId, currency: inv.currency }); }} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
            {state.invoices.map(i => <option key={i.id} value={i.id}>{i.number} — {i.currency === 'INR' ? '₹' : '$'}{i.total.toLocaleString()}</option>)}
          </select>
        </div>
        <InputField label="Amount" type="number" value={String(form.amount)} onChange={v => setForm({ ...form, amount: Number(v) })} />
        <InputField label="Date" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Method</label>
          <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
            {['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Credit Card', 'Wire Transfer', 'Other'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <InputField label="Reference" value={form.reference} onChange={v => setForm({ ...form, reference: v })} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Record Payment</button>
        </div>
      </form>
    </Modal>
  );
}

function RetainersPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);
  const mrr = state.retainers.filter(r => r.status === 'active').reduce((s, r) => s + r.amount, 0);

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Retainers</h1>
          <p className="text-sm text-ink-muted">MRR: ${mrr.toLocaleString()}/mo</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Retainer
        </button>
      </div>
      <div className="grid gap-3">
        {state.retainers.map(r => {
          const client = state.clients.find(c => c.id === r.clientId);
          return (
            <div key={r.id} className="bg-surface border border-line rounded-xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{r.name}</h3>
                  <p className="text-xs text-ink-muted">{client?.company} · Billing day: {r.billingDay}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{r.currency === 'INR' ? '₹' : '$'}{r.amount.toLocaleString()}<span className="text-xs text-ink-muted">/mo</span></p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-50 text-green-700' : r.status === 'paused' ? 'bg-amber-50 text-amber-700' : 'bg-line text-ink-muted'}`}>{r.status}</span>
                </div>
              </div>
              <p className="text-xs text-ink-muted mt-2">{r.scope}</p>
            </div>
          );
        })}
        {state.retainers.length === 0 && <div className="text-center py-12 text-ink-muted">No retainers yet</div>}
      </div>
      {showAdd && <AddRetainerModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddRetainerModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({ clientId: state.clients[0]?.id || '', name: '', amount: 0, currency: 'USD', billingDay: 1, startDate: new Date().toISOString().split('T')[0], status: 'active' as const, scope: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.addRetainer(form);
    onClose();
  };

  return (
    <Modal title="Add Retainer" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Client</label>
          <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
            {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
          </select>
        </div>
        <InputField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Amount" type="number" value={String(form.amount)} onChange={v => setForm({ ...form, amount: Number(v) })} />
          <InputField label="Billing Day" type="number" value={String(form.billingDay)} onChange={v => setForm({ ...form, billingDay: Number(v) })} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Scope</label>
          <textarea value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Create</button>
        </div>
      </form>
    </Modal>
  );
}

function MeetingsPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Meetings</h1>
          <p className="text-sm text-ink-muted">{state.meetings.length} meetings</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Meeting
        </button>
      </div>
      <div className="grid gap-3">
        {state.meetings.map(m => {
          const client = state.clients.find(c => c.id === m.clientId);
          return (
            <div key={m.id} className="bg-surface border border-line rounded-xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><CalendarDays className="w-5 h-5 text-primary-600" /></div>
                  <div>
                    <h3 className="text-sm font-semibold">{m.title}</h3>
                    <p className="text-xs text-ink-muted">{client?.company} · {m.attendees.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{m.date}</p>
                  <p className="text-xs text-ink-muted">{m.time} · {m.duration}min</p>
                </div>
              </div>
              {m.agenda && <p className="text-xs text-ink-muted mt-2">Agenda: {m.agenda}</p>}
            </div>
          );
        })}
        {state.meetings.length === 0 && <div className="text-center py-12 text-ink-muted">No meetings scheduled</div>}
      </div>
      {showAdd && <AddMeetingModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddMeetingModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({ title: '', clientId: '', projectId: '', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 60, attendees: [] as string[], agenda: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    actions.addMeeting(form);
    onClose();
  };

  return (
    <Modal title="Schedule Meeting" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Title *" value={form.title} onChange={v => setForm({ ...form, title: v })} />
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Client</label>
          <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
            <option value="">None</option>
            {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField label="Date" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
          <InputField label="Time" type="time" value={form.time} onChange={v => setForm({ ...form, time: v })} />
          <InputField label="Duration (min)" type="number" value={String(form.duration)} onChange={v => setForm({ ...form, duration: Number(v) })} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Agenda</label>
          <textarea value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas resize-none" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Schedule</button>
        </div>
      </form>
    </Modal>
  );
}

function TasksPage() {
  const state = useAppState();
  const [showAdd, setShowAdd] = useState(false);

  const columns = [
    { key: 'todo', label: 'To Do', color: '#78716C' },
    { key: 'in-progress', label: 'In Progress', color: '#f59e0b' },
    { key: 'done', label: 'Done', color: '#22c55e' },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="p-4 lg:p-6 border-b border-line bg-surface flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Tasks</h1>
          <p className="text-sm text-ink-muted">{state.tasks.length} tasks</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Task
        </button>
      </div>
      <div className="flex-1 overflow-x-auto p-4 lg:p-6">
        <div className="flex gap-4 min-w-max">
          {columns.map(col => {
            const colTasks = state.tasks.filter(t => t.status === col.key);
            return (
              <div key={col.key} className="w-72 shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }} />
                  <h3 className="text-sm font-semibold">{col.label}</h3>
                  <span className="text-xs text-ink-muted bg-line px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.map(task => (
                    <div key={task.id} className="bg-surface border border-line rounded-xl p-3 shadow-soft">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-ink">{task.title}</p>
                        <button onClick={() => {
                          const nextStatus = col.key === 'todo' ? 'in-progress' : col.key === 'in-progress' ? 'done' : 'todo';
                          actions.updateTask(task.id, { status: nextStatus as any });
                        }} className="p-1 hover:bg-canvas rounded"><ChevronRight className="w-4 h-4 text-ink-muted" /></button>
                      </div>
                      {task.description && <p className="text-xs text-ink-muted mt-1">{task.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-50 text-red-700' : task.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-line text-ink-muted'}`}>{task.priority}</span>
                        <span className="text-[10px] text-ink-faint">Due: {task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddTaskModal({ onClose }: { onClose: () => void }) {
  const state = useAppState();
  const [form, setForm] = useState({ title: '', description: '', assigneeId: state.users[0]?.id || '', projectId: '', dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], priority: 'medium' as const, status: 'todo' as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    actions.addTask(form);
    onClose();
  };

  return (
    <Modal title="Add Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Title *" value={form.title} onChange={v => setForm({ ...form, title: v })} />
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Due Date" type="date" value={form.dueDate} onChange={v => setForm({ ...form, dueDate: v })} />
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Priority</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Add Task</button>
        </div>
      </form>
    </Modal>
  );
}

function MessagesPage() {
  const state = useAppState();
  const [activeThread, setActiveThread] = useState<string | null>(state.clients[0]?.id || null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string; from: string; time: string }[]>([
    { id: '1', text: 'Hi, just checking on the brand concepts!', from: 'client', time: '10:30 AM' },
    { id: '2', text: 'Working on them now! Will share by EOD.', from: 'me', time: '10:45 AM' },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: String(Date.now()), text: message, from: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
  };

  return (
    <div className="h-full flex animate-fade-in">
      <div className="w-72 border-r border-line bg-surface hidden md:flex flex-col">
        <div className="p-3 border-b border-line">
          <h2 className="font-semibold text-sm">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {state.clients.map(c => (
            <button key={c.id} onClick={() => setActiveThread(c.id)} className={`w-full flex items-center gap-3 p-3 text-left hover:bg-canvas ${activeThread === c.id ? 'bg-primary-50' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs">{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-ink-muted truncate">{c.company}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-line bg-surface">
          <h3 className="font-semibold text-sm">{state.clients.find(c => c.id === activeThread)?.name || 'Select a conversation'}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.from === 'me' ? 'bg-primary-600 text-white' : 'bg-canvas border border-line text-ink'}`}>
                {m.text}
                <p className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-primary-200' : 'text-ink-faint'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-line bg-surface">
          <div className="flex items-center gap-2">
            <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-2 text-sm border border-line rounded-full bg-canvas focus:outline-none focus:border-primary-400" />
            <button onClick={sendMessage} className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsPage() {
  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Documents</h1>
          <p className="text-sm text-ink-muted">Proposals, contracts, quotations</p>
        </div>
        <button className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Write with AI
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Proposals', desc: 'Create and send proposals', icon: FileText, count: 2 },
          { title: 'Contracts', desc: 'E-sign contracts', icon: PenTool, count: 1 },
          { title: 'Quotations', desc: 'Itemised quotes', icon: Receipt, count: 3 },
        ].map(doc => (
          <div key={doc.title} className="bg-surface border border-line rounded-xl p-5 shadow-soft hover:shadow-soft-md transition-shadow cursor-pointer">
            <doc.icon className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-ink">{doc.title}</h3>
            <p className="text-xs text-ink-muted mt-1">{doc.desc}</p>
            <p className="text-sm font-medium text-primary-600 mt-3">{doc.count} documents</p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-surface border border-line rounded-xl p-5 shadow-soft">
        <h3 className="font-semibold text-ink mb-3">Recent Documents</h3>
        <div className="space-y-2">
          {['Website Redesign Proposal — Acme Corp', 'Service Agreement — Nova Studio', 'Q2 Marketing Quote — Bright Media'].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-line rounded-lg hover:bg-canvas">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-ink-muted" />
                <span className="text-sm font-medium">{doc}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-muted">{['Sent', 'Signed', 'Draft'][i]}</span>
                <button className="p-1 hover:bg-line rounded"><Eye className="w-4 h-4 text-ink-muted" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamPage() {
  const state = useAppState();
  const [showInvite, setShowInvite] = useState(false);
  const limits = PLAN_LIMITS[state.workspace!.plan];

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Team</h1>
          <p className="text-sm text-ink-muted">{state.users.length} / {limits.teammates} members</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <UserPlus className="w-4 h-4" /> Invite
        </button>
      </div>
      <div className="space-y-3">
        {state.users.map(user => (
          <div key={user.id} className="bg-surface border border-line rounded-xl p-4 shadow-soft flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">{user.name[0]}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-ink-muted">{user.email}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'owner' ? 'bg-primary-50 text-primary-700' : 'bg-line text-ink-muted'}`}>{user.role}</span>
          </div>
        ))}
      </div>
      {showInvite && (
        <Modal title="Invite Team Member" onClose={() => setShowInvite(false)}>
          <div className="space-y-4">
            <InputField label="Email" type="email" placeholder="colleague@company.com" value="" onChange={() => {}} />
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Role</label>
              <select className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas">
                <option>Team member</option>
                <option>Viewer</option>
              </select>
            </div>
            <button onClick={() => setShowInvite(false)} className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Send Invite</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BillingPage() {
  const state = useAppState();
  const limits = PLAN_LIMITS[state.workspace!.plan];
  const usage = {
    clients: state.clients.length,
    projects: state.projects.length,
    leads: state.leads.filter(l => !l.isWon && !l.isLost).length,
    teammates: state.users.length,
    aiQuotes: state.aiQuotesUsed,
  };

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-xl font-bold text-ink mb-6">Billing & Plan</h1>

      <div className="bg-surface border border-line rounded-xl p-5 shadow-soft mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-ink capitalize">{state.workspace?.plan} Plan</h2>
            <p className="text-sm text-ink-muted">${state.workspace?.plan === 'free' ? '0' : state.workspace?.plan === 'pro' ? '19' : '39'}/month</p>
          </div>
          {state.workspace?.plan !== 'ultra' && (
            <button onClick={() => actions.changePlan(state.workspace?.plan === 'free' ? 'pro' : 'ultra')} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-ember">
              Upgrade
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <UsageMeter label="Clients" used={usage.clients} limit={limits.clients} />
          <UsageMeter label="Projects" used={usage.projects} limit={limits.projects} />
          <UsageMeter label="Leads" used={usage.leads} limit={limits.leads} />
          <UsageMeter label="Teammates" used={usage.teammates} limit={limits.teammates} />
          <UsageMeter label="AI Quotes" used={usage.aiQuotes} limit={limits.aiQuotes} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: 'Free', price: '$0', features: ['3 clients', '5 projects', '20 leads', '1 teammate', '100 MB storage', '3 AI quotes/mo'], current: state.workspace?.plan === 'free' },
          { name: 'Pro', price: '$19/mo', features: ['20 clients', '40 projects', '200 leads', '5 teammates', '1 GB storage', '25 AI quotes/mo', 'Auto-invoicing', 'Email support'], current: state.workspace?.plan === 'pro', popular: true },
          { name: 'Ultra', price: '$39/mo', features: ['Unlimited everything', '10 GB storage', '100 AI quotes/mo', 'White label', 'Custom domain', 'Lead integrations', 'Payroll', 'Priority support'], current: state.workspace?.plan === 'ultra' },
        ].map(plan => (
          <div key={plan.name} className={`bg-surface border rounded-xl p-5 ${plan.popular ? 'border-primary-400 shadow-ember' : 'border-line shadow-soft'} ${plan.current ? 'ring-2 ring-primary-600' : ''}`}>
            {plan.popular && <span className="text-xs font-semibold text-primary-600 mb-2 block">Most popular</span>}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className="text-2xl font-bold mt-1">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />{f}
                </li>
              ))}
            </ul>
            {!plan.current && (
              <button onClick={() => actions.changePlan(plan.name.toLowerCase() as Plan)} className="w-full mt-4 py-2 text-sm border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50">
                {plan.name === 'Free' ? 'Downgrade' : 'Upgrade'}
              </button>
            )}
            {plan.current && <p className="w-full mt-4 py-2 text-sm text-center text-green-600 font-medium">Current plan</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const isOver = used >= limit;
  return (
    <div className="bg-canvas rounded-lg p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="text-sm font-bold">{used} / {limit >= 99999 ? '∞' : limit}</p>
      <div className="h-1.5 bg-line rounded-full mt-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-primary-600'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ActivityPage() {
  const state = useAppState();
  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-xl font-bold text-ink mb-6">Activity</h1>
      <div className="space-y-3">
        {state.activities.map(a => (
          <div key={a.id} className="bg-surface border border-line rounded-xl p-4 shadow-soft flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-ink">{a.description}</p>
              <p className="text-xs text-ink-faint">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  const state = useAppState();
  const [wsName, setWsName] = useState(state.workspace?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    actions.updateWorkspace({ name: wsName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-bold text-ink mb-6">Settings</h1>

      <div className="bg-surface border border-line rounded-xl p-5 shadow-soft mb-4">
        <h2 className="font-semibold text-ink mb-4">Workspace</h2>
        <div className="space-y-3">
          <InputField label="Workspace Name" value={wsName} onChange={setWsName} />
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Slug</label>
            <p className="text-sm text-ink px-3 py-2 bg-canvas border border-line rounded-lg">{state.workspace?.slug}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Base Currency</label>
            <p className="text-sm text-ink px-3 py-2 bg-canvas border border-line rounded-lg">{state.workspace?.currency}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Country</label>
            <p className="text-sm text-ink px-3 py-2 bg-canvas border border-line rounded-lg">{state.workspace?.country}</p>
          </div>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-xl p-5 shadow-soft mb-4">
        <h2 className="font-semibold text-ink mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Name</label>
            <p className="text-sm text-ink px-3 py-2 bg-canvas border border-line rounded-lg">{state.users[0]?.name}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Email</label>
            <p className="text-sm text-ink px-3 py-2 bg-canvas border border-line rounded-lg">{state.users[0]?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-xl p-5 shadow-soft">
        <h2 className="font-semibold text-ink mb-4">Data</h2>
        <div className="flex gap-3">
          <button onClick={() => { const data = JSON.stringify(getState(), null, 2); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'clientertap-export.json'; a.click(); }} className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-canvas font-medium">Export Data (JSON)</button>
          <button onClick={() => { if (confirm('Reset all demo data?')) actions.resetState(); }} className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium">Reset Demo Data</button>
        </div>
      </div>
    </div>
  );
}

// ============ AUTH PAGES ============
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('vikram@nova.co');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    actions.login(email, password);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
            <span className="text-2xl font-bold text-ink">ClienterTap</span>
          </Link>
          <h1 className="text-xl font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-ink-muted mt-1">Sign in to your workspace</p>
        </div>
        <form onSubmit={handleLogin} className="bg-surface border border-line rounded-2xl p-6 shadow-soft-md space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <InputField label="Email" type="email" value={email} onChange={setEmail} />
          <InputField label="Password" type="password" value={password} onChange={setPassword} />
          <button type="submit" className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 shadow-ember">Sign in</button>
          <p className="text-center text-sm text-ink-muted">Don't have an account? <Link to="/signup" className="text-primary-600 font-medium">Sign up free</Link></p>
        </form>
        <p className="text-center text-xs text-ink-faint mt-4">Demo: Use any email/password to sign in</p>
      </div>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', workspaceName: '', country: 'IN' });
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.workspaceName) { setError('All fields are required'); return; }
    actions.signup(form);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
            <span className="text-2xl font-bold text-ink">ClienterTap</span>
          </Link>
          <h1 className="text-xl font-bold text-ink">Start for free</h1>
          <p className="text-sm text-ink-muted mt-1">No credit card required</p>
        </div>
        <form onSubmit={handleSignup} className="bg-surface border border-line rounded-2xl p-6 shadow-soft-md space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <InputField label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <InputField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <InputField label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} />
          <InputField label="Workspace Name" value={form.workspaceName} onChange={v => setForm({ ...form, workspaceName: v })} />
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Country</label>
            <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas focus:outline-none focus:border-primary-400">
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
              <option value="AE">UAE</option>
              <option value="SG">Singapore</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 shadow-ember">Create workspace</button>
          <p className="text-center text-sm text-ink-muted">Already have an account? <Link to="/login" className="text-primary-600 font-medium">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}

// ============ MARKETING PAGES ============
function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bone">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-bone/95 backdrop-blur-sm border-b border-line">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-lg text-ink">ClienterTap</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-sm text-ink-muted hover:text-ink transition-colors">Features</Link>
            <Link to="/pricing" className="text-sm text-ink-muted hover:text-ink transition-colors">Pricing</Link>
            <Link to="/tools" className="text-sm text-ink-muted hover:text-ink transition-colors">Free Tools</Link>
            <Link to="/contact" className="text-sm text-ink-muted hover:text-ink transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-ink hover:text-primary-600">Sign in</Link>
            <Link to="/signup" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-ember">Start free</Link>
          </div>
        </div>
      </nav>
      {children}
      {/* Footer */}
      <footer className="bg-espresso text-espresso-text">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-espresso-text mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><Link to="/features" className="hover:text-espresso-text">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-espresso-text">Pricing</Link></li>
                <li><Link to="/demo" className="hover:text-espresso-text">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-espresso-text mb-3">Use Cases</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><Link to="/for/freelancers" className="hover:text-espresso-text">Freelancers</Link></li>
                <li><Link to="/for/web-design-agencies" className="hover:text-espresso-text">Agencies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-espresso-text mb-3">Free Tools</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><Link to="/tools/invoice" className="hover:text-espresso-text">Invoice Generator</Link></li>
                <li><Link to="/tools/gst-calculator" className="hover:text-espresso-text">GST Calculator</Link></li>
                <li><Link to="/tools/freelance-rate-calculator" className="hover:text-espresso-text">Rate Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-espresso-text mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><Link to="/about" className="hover:text-espresso-text">About</Link></li>
                <li><Link to="/contact" className="hover:text-espresso-text">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-espresso-text">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-espresso-text">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-espresso-line mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <span className="text-sm text-espresso-muted">© 2026 ClienterTap. All rights reserved.</span>
            </div>
            <p className="text-xs text-espresso-muted">Grievance Officer: support@clientertap.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs font-medium text-primary-700 mb-6">
          <Sparkles className="w-3 h-3" /> New: Introducing the Marketplace
        </div>
        <h1 className="text-display text-ink font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Run every client from first enquiry to{' '}
          <span className="font-serif-display italic text-primary-600">final payment</span>
        </h1>
        <p className="mt-6 text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
          One login for leads, quotes, e-signed contracts, projects, your client portal, invoices and payment tracking. Built for agencies and established freelancers, in about 30 currencies, with GST-compliant invoicing in India.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/signup" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-ember-lg text-base">Start free</Link>
          <Link to="/demo" className="px-6 py-3 border border-line text-ink rounded-xl font-semibold hover:bg-surface text-base">See how it works</Link>
        </div>
        <p className="mt-4 text-xs text-ink-faint">No credit card required · Free forever plan · Setup in 2 minutes</p>

        {/* Trust chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {['Encrypted in transit', 'Per-account data isolation', 'Export anytime', 'No card required'].map(chip => (
            <span key={chip} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-line rounded-full text-xs text-ink-muted">
              <Shield className="w-3 h-3 text-green-500" />{chip}
            </span>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-surface border border-line rounded-2xl shadow-lift-3 p-6 animate-float-slow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-canvas rounded-xl p-4"><p className="text-xs text-ink-muted">Revenue</p><p className="text-xl font-bold text-ink">₹3.3L</p></div>
            <div className="bg-canvas rounded-xl p-4"><p className="text-xs text-ink-muted">Received</p><p className="text-xl font-bold text-green-600">₹2.18L</p></div>
            <div className="bg-canvas rounded-xl p-4"><p className="text-xs text-ink-muted">Pending</p><p className="text-xl font-bold text-amber-600">₹1.12L</p></div>
            <div className="bg-canvas rounded-xl p-4"><p className="text-xs text-ink-muted">Win Rate</p><p className="text-xl font-bold text-primary-600">73%</p></div>
          </div>
          <div className="h-40 bg-canvas rounded-xl flex items-center justify-center">
            <div className="flex items-end gap-2 h-24">
              {[40, 65, 50, 80, 70, 90].map((h, i) => (
                <div key={i} className="w-8 bg-primary-400 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-line bg-cream py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...'Spreadsheets,Word invoices,WhatsApp threads,Sticky notes,Email chains,Calendar apps,Payment trackers,Reminder alarms,'.split(',')].concat(['Spreadsheets','Word invoices','WhatsApp threads','Sticky notes','Email chains','Calendar apps','Payment trackers','Reminder alarms']).map((item, i) => (
            <span key={i} className="mx-6 text-lg text-ink-faint font-medium">{item} ✦</span>
          ))}
        </div>
      </section>

      {/* One app instead of ten */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-ink text-center mb-12">One app instead of ten tabs</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface border border-line rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">The old way</h3>
            <ul className="space-y-3 text-sm text-ink-muted">
              {['Excel for leads', 'Word for proposals', 'WhatsApp for client chats', 'Gmail for invoices', 'Google Sheets for payments', 'Trello for tasks', 'Calendar for meetings', 'Dropbox for files', 'Zoom for calls', 'Another app for reviews'].map(item => (
                <li key={item} className="flex items-center gap-2"><X className="w-4 h-4 text-red-400" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-primary-200 rounded-2xl p-6 shadow-soft-md">
            <h3 className="text-lg font-semibold text-primary-600 mb-4">The ClienterTap way</h3>
            <ul className="space-y-3 text-sm text-ink">
              {['CRM pipeline with drag & drop', 'AI-written proposals & e-sign', 'Built-in messaging with clients', 'GST-compliant invoicing', 'Payment tracking & receipts', 'Task boards per project', 'Meetings with Google Calendar sync', 'File storage with client sharing', 'Video calls via Google Meet', 'Verified client reviews'].map(item => (
                <li key={item} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-ink text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-center text-ink-muted mb-12">Start free. Upgrade when you're ready.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Free', price: '$0', desc: 'For getting started', features: ['3 clients', '5 projects', '20 leads', '1 teammate'] },
              { name: 'Pro', price: '$19', desc: 'Most popular', features: ['20 clients', '40 projects', '200 leads', '5 teammates', 'Auto-invoicing'], popular: true },
              { name: 'Ultra', price: '$39', desc: 'For growing agencies', features: ['Unlimited everything', 'White label', 'Custom domain', 'Lead integrations'] },
            ].map(plan => (
              <div key={plan.name} className={`bg-surface border rounded-2xl p-6 ${plan.popular ? 'border-primary-400 shadow-ember' : 'border-line shadow-soft'}`}>
                {plan.popular && <span className="text-xs font-semibold text-primary-600">Most popular</span>}
                <h3 className="text-xl font-bold mt-1">{plan.name}</h3>
                <p className="text-3xl font-bold mt-2">{plan.price}<span className="text-sm text-ink-muted font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-ink-muted"><Check className="w-4 h-4 text-green-500" />{f}</li>)}
                </ul>
                <Link to="/signup" className={`block text-center mt-6 py-2.5 rounded-lg font-medium text-sm ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border border-line hover:bg-canvas text-ink'}`}>Get started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-espresso py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-espresso-text mb-4">Your data, locked down</h2>
          <p className="text-espresso-muted mb-10 max-w-xl mx-auto">Enterprise-grade security on every plan. Your clients' data never leaves your workspace.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Row-level security', 'AES-256 encryption', 'No data sharing ever', 'Isolated per-account', 'Export anytime', 'Encrypted in transit'].map(chip => (
              <span key={chip} className="flex items-center gap-2 px-4 py-2 bg-espresso-soft border border-espresso-line rounded-full text-sm text-espresso-text">
                <Shield className="w-4 h-4 text-primary-400" />{chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-ink text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-3">
          {[
            { q: 'Is Free really free?', a: 'Yes. The Free plan has no time limit and no credit card required. You get 3 clients, 5 projects, and 20 active leads forever.' },
            { q: 'What counts as an active lead?', a: 'Only open leads count. Won, lost, or converted leads free up their slot immediately.' },
            { q: 'What happens when I reach a limit?', a: 'You can\'t add more, but nothing is deleted. Existing data stays editable. Upgrade to add more.' },
            { q: 'Do you process payments from my clients?', a: 'No. Clients pay you directly (bank transfer, UPI, etc.). We just help you track what\'s been paid and what\'s outstanding.' },
            { q: 'Can I export my data?', a: 'Yes, anytime. Full CSV/JSON export of all your data plus files.' },
          ].map((faq, i) => (
            <details key={i} className="group bg-surface border border-line rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-sm text-ink">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-ink-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-sm text-ink-muted">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to run your business better?</h2>
          <p className="text-primary-100 mb-8">Join thousands of freelancers and agencies already using ClienterTap.</p>
          <Link to="/signup" className="inline-block px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 shadow-lift-2">Start free — no card required</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

function PricingPage() {
  return (
    <MarketingLayout>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-ink text-center">Simple pricing for every stage</h1>
        <p className="text-center text-ink-muted mt-4 max-w-xl mx-auto">Start free. Upgrade when you need more. Cancel anytime.</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          {[
            { name: 'Free', price: '$0', period: 'forever', features: ['3 clients', '5 projects', '20 active leads', '1 teammate', '100 MB storage', '3 AI quotes/month', 'Client portal (1 client)', 'Google Calendar sync', 'Invoicing in ~30 currencies', 'Leads pipeline', 'E-signatures', 'Community support'], limits: { clients: 3, projects: 5, leads: 20, teammates: 1, storage: '100 MB', ai: 3 } },
            { name: 'Pro', price: '$19', period: '/month', features: ['20 clients', '40 projects', '200 active leads', '5 teammates', '1 GB storage', '25 AI quotes/month', 'Portal for all clients', 'No "Powered by" mark', 'Auto-invoicing retainers', 'Auto follow-up reminders', 'Email support'], popular: true, limits: { clients: 20, projects: 40, leads: 200, teammates: 5, storage: '1 GB', ai: 25 } },
            { name: 'Ultra', price: '$39', period: '/month', features: ['Unlimited clients', 'Unlimited projects', 'Unlimited leads', 'Unlimited teammates', '10 GB storage', '100 AI quotes/month', 'White label (brand colour)', 'Custom domain', 'Lead integrations', 'Team payroll & payslips', 'Priority support'], limits: { clients: '∞', projects: '∞', leads: '∞', teammates: '∞', storage: '10 GB', ai: 100 } },
          ].map(plan => (
            <div key={plan.name} className={`bg-surface border rounded-2xl p-6 ${plan.popular ? 'border-primary-400 shadow-ember relative' : 'border-line shadow-soft'}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">Most popular</div>}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-4xl font-bold mt-3">{plan.price}<span className="text-base text-ink-muted font-normal">{plan.period}</span></p>
              <ul className="mt-6 space-y-3">
                {plan.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-ink-muted"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />{f}</li>)}
              </ul>
              <Link to="/signup" className={`block text-center mt-6 py-3 rounded-xl font-semibold text-sm ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-ember' : 'border border-line hover:bg-canvas text-ink'}`}>Get started</Link>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-ink text-center mb-8">Full comparison</h2>
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-canvas">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-ink-muted">Feature</th>
                  <th className="text-center px-4 py-3 font-medium">Free</th>
                  <th className="text-center px-4 py-3 font-medium text-primary-600">Pro</th>
                  <th className="text-center px-4 py-3 font-medium">Ultra</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Clients', '3', '20', 'Unlimited'],
                  ['Projects', '5', '40', 'Unlimited'],
                  ['Active leads', '20', '200', 'Unlimited'],
                  ['Teammates', '1', '5', 'Unlimited'],
                  ['Storage', '100 MB', '1 GB', '10 GB'],
                  ['AI quotes/month', '3', '25', '100'],
                  ['Client portal', '1 client', 'All clients', 'All + custom domain'],
                  ['Auto-invoicing', '—', '✓', '✓'],
                  ['White label', '—', '—', '✓'],
                  ['Lead integrations', '—', '—', '✓'],
                  ['Payroll', '—', '—', '✓'],
                ].map(([feature, free, pro, ultra], i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{feature}</td>
                    <td className="px-4 py-3 text-center text-ink-muted">{free}</td>
                    <td className="px-4 py-3 text-center text-ink">{pro}</td>
                    <td className="px-4 py-3 text-center text-ink">{ultra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function FeaturesPage() {
  return (
    <MarketingLayout>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-ink text-center">One app to run your whole freelance business</h1>
        <p className="text-center text-ink-muted mt-4 max-w-2xl mx-auto">From first enquiry to final payment, ClienterTap handles every step of your client workflow.</p>

        <div className="mt-16 space-y-20">
          {[
            { num: '01', title: 'Win the work', desc: 'CRM pipeline, client management, quotations, proposals & e-signatures, intake forms', features: ['Drag-and-drop lead pipeline', 'AI-written proposals', 'E-signatures with audit trail', 'Public intake forms', 'Auto lead capture from Meta, Google Ads, IndiaMART'] },
            { num: '02', title: 'Deliver the work', desc: 'Project tracking, white-label client portal, Google Calendar & Meet, meetings & reminders', features: ['Kanban project boards', 'Client portal with approvals', 'Google Calendar two-way sync', 'Auto Google Meet links', 'Push notification reminders'] },
            { num: '03', title: 'Get paid & grow', desc: 'Smart invoicing, verified client reviews, revenue analytics', features: ['GST-compliant invoices', 'Payment tracking & receipts', 'Retainer auto-invoicing', 'Verified review collection', 'Revenue dashboard & analytics'] },
            { num: '04', title: 'Your team', desc: 'Team management, permissions, payroll', features: ['Role-based permissions', 'Team task assignment', 'Payroll & payslips (Ultra)', 'Activity audit log', 'Real-time messaging'] },
          ].map(section => (
            <div key={section.num} className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-5xl font-bold text-primary-200">{section.num}</span>
                <h2 className="text-2xl font-bold text-ink mt-2">{section.title}</h2>
                <p className="text-ink-muted mt-2">{section.desc}</p>
                <ul className="mt-4 space-y-2">
                  {section.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-ink"><Check className="w-4 h-4 text-primary-600" />{f}</li>)}
                </ul>
              </div>
              <div className="bg-surface border border-line rounded-2xl p-6 shadow-soft-md h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-sm text-ink-muted">{section.title} — UI preview</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <Link to="/signup" className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-ember-lg">Free forever plan, no credit card</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

function ToolsPage() {
  return (
    <MarketingLayout>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-ink text-center">Free tools for freelancers</h1>
        <p className="text-center text-ink-muted mt-4">No login required. Use them as much as you like.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[
            { title: 'Invoice Generator', desc: 'Create GST-compliant invoices instantly', icon: Receipt, path: '/tools/invoice' },
            { title: 'GST Calculator', desc: 'Add or remove GST with CGST/SGST split', icon: Calculator, path: '/tools/gst-calculator' },
            { title: 'Rate Calculator', desc: 'Calculate your ideal freelance rate', icon: DollarSign, path: '/tools/freelance-rate-calculator' },
            { title: 'Time Converter', desc: 'Convert time zones for global clients', icon: Globe, path: '/tools/time-converter' },
            { title: 'Templates', desc: 'Download contract & proposal templates', icon: FileText, path: '/templates' },
          ].map(tool => (
            <Link key={tool.title} to={tool.path} className="bg-surface border border-line rounded-xl p-6 shadow-soft hover:shadow-soft-md transition-shadow group">
              <tool.icon className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-ink group-hover:text-primary-600 transition-colors">{tool.title}</h3>
              <p className="text-sm text-ink-muted mt-1">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

function InvoiceToolPage() {
  const [items, setItems] = useState([{ desc: 'Website Design', qty: 1, rate: 50000, taxRate: 18 }]);
  const [clientName, setClientName] = useState('');
  const [gstType, setGstType] = useState('cgst-sgst');

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = items.reduce((s, i) => s + (i.qty * i.rate * i.taxRate / 100), 0);
  const total = subtotal + tax;

  return (
    <MarketingLayout>
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-ink">Free Invoice Generator</h1>
        <p className="text-ink-muted mt-2">Create GST-compliant invoices. Download as PDF.</p>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <InputField label="Client Name" value={clientName} onChange={setClientName} />
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">GST Type</label>
              <select value={gstType} onChange={e => setGstType(e.target.value)} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-surface">
                <option value="cgst-sgst">CGST + SGST (Intra-state)</option>
                <option value="igst">IGST (Inter-state)</option>
              </select>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Line Items</h3>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                  <input value={item.desc} onChange={e => { const n = [...items]; n[i].desc = e.target.value; setItems(n); }} placeholder="Description" className="col-span-2 px-3 py-2 text-sm border border-line rounded-lg" />
                  <input type="number" value={item.qty} onChange={e => { const n = [...items]; n[i].qty = Number(e.target.value); setItems(n); }} placeholder="Qty" className="px-3 py-2 text-sm border border-line rounded-lg" />
                  <input type="number" value={item.rate} onChange={e => { const n = [...items]; n[i].rate = Number(e.target.value); setItems(n); }} placeholder="Rate" className="px-3 py-2 text-sm border border-line rounded-lg" />
                </div>
              ))}
              <button onClick={() => setItems([...items, { desc: '', qty: 1, rate: 0, taxRate: 18 }])} className="text-sm text-primary-600 font-medium">+ Add item</button>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div><span className="font-bold">Your Agency</span></div>
              <span className="text-sm text-ink-muted">INV-2026-001</span>
            </div>
            <p className="text-sm text-ink-muted mb-4">Bill to: {clientName || 'Client name'}</p>
            <table className="w-full text-sm mb-4">
              <thead><tr className="border-b border-line"><th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Rate</th><th className="text-right py-2">Amount</th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-line-soft">
                    <td className="py-2">{item.desc || '—'}</td>
                    <td className="text-right py-2">{item.qty}</td>
                    <td className="text-right py-2">₹{item.rate.toLocaleString()}</td>
                    <td className="text-right py-2 font-medium">₹{(item.qty * item.rate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">GST ({gstType === 'igst' ? 'IGST' : 'CGST+SGST'})</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-line"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
            <button className="w-full mt-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Download PDF</button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  return (
    <MarketingLayout>
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-ink">Get in touch</h1>
        <p className="text-ink-muted mt-2">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>

        {sent ? (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Message sent!</p>
            <p className="text-sm text-green-600 mt-1">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-4 bg-surface border border-line rounded-xl p-6 shadow-soft">
            <InputField label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <InputField label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas resize-none focus:outline-none focus:border-primary-400" />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Send message</button>
          </form>
        )}
      </section>
    </MarketingLayout>
  );
}

function SimplePage({ title, content }: { title: string; content: string }) {
  return (
    <MarketingLayout>
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-ink">{title}</h1>
        <div className="mt-6 prose prose-sm text-ink-muted" dangerouslySetInnerHTML={{ __html: content }} />
      </section>
    </MarketingLayout>
  );
}

// ============ SHARED COMPONENTS ============
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-surface rounded-2xl shadow-soft-lg border border-line w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-surface border-b border-line p-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-canvas rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-muted mb-1 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-sm border border-line rounded-lg bg-canvas focus:outline-none focus:border-primary-400 transition-colors" />
    </div>
  );
}

// ============ PORTAL ============
function PortalPage() {
  const state = useAppState();
  const client = state.clients.find(c => c.portalEnabled) || state.clients[0];
  const projects = state.projects.filter(p => p.clientId === client?.id);
  const invoices = state.invoices.filter(i => i.clientId === client?.id);
  const [tab, setTab] = useState('home');

  if (!client) return <div className="p-8 text-center text-ink-muted">No portal-enabled client found</div>;

  return (
    <div className="min-h-screen bg-canvas">
      <nav className="bg-surface border-b border-line sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-ink">{state.workspace?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-muted">{client.name}</span>
            <Link to="/app" className="text-xs text-primary-600 font-medium">← Back to app</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 border-b border-line">
          {['home', 'projects', 'invoices', 'documents', 'messages'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted hover:text-ink'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'home' && (
          <div className="space-y-6">
            <div className="bg-surface border border-line rounded-xl p-5 shadow-soft">
              <h2 className="font-semibold text-ink mb-3">Welcome, {client.name}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-canvas rounded-lg p-3"><p className="text-xs text-ink-muted">Active Projects</p><p className="text-xl font-bold">{projects.filter(p => p.status !== 'completed').length}</p></div>
                <div className="bg-canvas rounded-lg p-3"><p className="text-xs text-ink-muted">Outstanding</p><p className="text-xl font-bold text-amber-600">{client.currency === 'INR' ? '₹' : '$'}{invoices.reduce((s, i) => s + (i.total - i.amountPaid), 0).toLocaleString()}</p></div>
                <div className="bg-canvas rounded-lg p-3"><p className="text-xs text-ink-muted">Total Paid</p><p className="text-xl font-bold text-green-600">{client.currency === 'INR' ? '₹' : '$'}{invoices.reduce((s, i) => s + i.amountPaid, 0).toLocaleString()}</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="bg-surface border border-line rounded-xl p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-ink">{p.name}</h3>
                    <p className="text-xs text-ink-muted">{p.status} · Due {p.deadline}</p>
                  </div>
                  <p className="text-lg font-bold">{p.currency === 'INR' ? '₹' : '$'}{p.budget.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'invoices' && (
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="bg-surface border border-line rounded-xl p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-ink">{inv.number}</h3>
                    <p className="text-xs text-ink-muted">Due {inv.dueDate} · {inv.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{inv.currency === 'INR' ? '₹' : '$'}{inv.total.toLocaleString()}</p>
                    <p className="text-xs text-green-600">Paid: {inv.currency === 'INR' ? '₹' : '$'}{inv.amountPaid.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'documents' && (
          <div className="text-center py-12 text-ink-muted">
            <FileText className="w-12 h-12 mx-auto mb-3 text-ink-faint" />
            <p>No documents to review</p>
          </div>
        )}

        {tab === 'messages' && (
          <div className="bg-surface border border-line rounded-xl p-4 shadow-soft">
            <div className="space-y-3">
              <div className="flex justify-start"><div className="bg-canvas border border-line rounded-2xl px-4 py-2 text-sm max-w-xs">Hi! How's the project going?</div></div>
              <div className="flex justify-end"><div className="bg-primary-600 text-white rounded-2xl px-4 py-2 text-sm max-w-xs">Going great! Will share updates soon.</div></div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-line mt-12 py-4 text-center">
        {state.workspace?.plan === 'free' && <p className="text-xs text-ink-faint">Powered by <span className="font-medium text-primary-600">ClienterTap</span></p>}
      </footer>
    </div>
  );
}

// ============ DEMO PAGE ============
function DemoPage() {
  return (
    <MarketingLayout>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-ink text-center">Live Demo</h1>
        <p className="text-center text-ink-muted mt-4">Explore ClienterTap with pre-loaded sample data. No sign-up needed.</p>
        <div className="text-center mt-8">
          <Link to="/app" className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-ember-lg">Enter Demo Workspace</Link>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Nova Studio', type: 'Client', status: 'Active' },
            { name: 'Acme Corp', type: 'Client', status: 'Active' },
            { name: 'Pixel Labs', type: 'Lead', status: 'Qualified' },
            { name: 'Bright Media', type: 'Client', status: 'Active' },
          ].map(item => (
            <div key={item.name} className="bg-surface border border-line rounded-xl p-4 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold mb-2">{item.name[0]}</div>
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-xs text-ink-muted">{item.type} · {item.status}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

// ============ MAIN APP ============
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing */}
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/invoice" element={<InvoiceToolPage />} />
        <Route path="/tools/gst-calculator" element={<SimplePage title="GST Calculator" content="<p>Calculate GST amounts with CGST/SGST split. Enter your base amount and get the breakdown instantly.</p>" />} />
        <Route path="/tools/freelance-rate-calculator" element={<SimplePage title="Freelance Rate Calculator" content="<p>Calculate your ideal hourly or project rate based on your desired income, expenses, and billable hours.</p>" />} />
        <Route path="/tools/time-converter" element={<SimplePage title="Time Zone Converter" content="<p>Convert between time zones for scheduling meetings with global clients.</p>" />} />
        <Route path="/templates" element={<SimplePage title="Templates" content="<p>Download free contract, proposal, and invoice templates for your freelance business.</p>" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/about" element={<SimplePage title="About ClienterTap" content="<p>ClienterTap is built for agencies and freelancers who want one app to manage their entire client lifecycle — from first enquiry to final payment.</p>" />} />
        <Route path="/privacy" element={<SimplePage title="Privacy Policy" content="<p>Your data is encrypted, isolated per workspace, and never shared. You can export or delete your data at any time. We comply with India's DPDP Act and global privacy standards.</p>" />} />
        <Route path="/terms" element={<SimplePage title="Terms of Service" content="<p>By using ClienterTap, you agree to our terms. We provide the software as-is, you own your data, and we never process payments on your behalf.</p>" />} />
        <Route path="/for/freelancers" element={<SimplePage title="For Freelancers" content="<p>Stop juggling 10 different tools. ClienterTap gives you CRM, invoicing, project management, and a client portal — all in one place.</p>" />} />
        <Route path="/for/web-design-agencies" element={<SimplePage title="For Web Design Agencies" content="<p>Manage multiple clients, track projects, send invoices, and collect verified reviews. Built for agencies that deliver beautiful work.</p>" />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Portal */}
        <Route path="/portal" element={<PortalPage />} />

        {/* App */}
        <Route path="/app" element={<AuthGuard><AppShell><DashboardPage /></AppShell></AuthGuard>} />
        <Route path="/app/leads" element={<AuthGuard><AppShell><LeadsPage /></AppShell></AuthGuard>} />
        <Route path="/app/clients" element={<AuthGuard><AppShell><ClientsPage /></AppShell></AuthGuard>} />
        <Route path="/app/projects" element={<AuthGuard><AppShell><ProjectsPage /></AppShell></AuthGuard>} />
        <Route path="/app/retainers" element={<AuthGuard><AppShell><RetainersPage /></AppShell></AuthGuard>} />
        <Route path="/app/invoices" element={<AuthGuard><AppShell><InvoicesPage /></AppShell></AuthGuard>} />
        <Route path="/app/payments" element={<AuthGuard><AppShell><PaymentsPage /></AppShell></AuthGuard>} />
        <Route path="/app/messages" element={<AuthGuard><AppShell><MessagesPage /></AppShell></AuthGuard>} />
        <Route path="/app/meetings" element={<AuthGuard><AppShell><MeetingsPage /></AppShell></AuthGuard>} />
        <Route path="/app/tasks" element={<AuthGuard><AppShell><TasksPage /></AppShell></AuthGuard>} />
        <Route path="/app/documents" element={<AuthGuard><AppShell><DocumentsPage /></AppShell></AuthGuard>} />
        <Route path="/app/team" element={<AuthGuard><AppShell><TeamPage /></AppShell></AuthGuard>} />
        <Route path="/app/billing" element={<AuthGuard><AppShell><BillingPage /></AppShell></AuthGuard>} />
        <Route path="/app/activity" element={<AuthGuard><AppShell><ActivityPage /></AppShell></AuthGuard>} />
        <Route path="/app/settings" element={<AuthGuard><AppShell><SettingsPage /></AppShell></AuthGuard>} />

        {/* Catch all */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
