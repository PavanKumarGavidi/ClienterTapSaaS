import { useState, useEffect } from 'react';
import { getState, subscribe, actions } from './lib/store';
import { AppState, PortalUser, Client, Project, Invoice, MessageThread, Message, FileRecord, ProjectUpdate, Review, Referral } from './lib/types';
import {
  Home, FolderKanban, FileText, MessageSquare, Star, UserPlus, LogOut,
  Bell, CheckCircle2, Clock, DollarSign, AlertCircle, Send, Paperclip,
  Download, Eye, ChevronRight, Calendar, ArrowLeft, Shield, Sparkles
} from 'lucide-react';

function useAppState(): AppState {
  const [state, setState] = useState(getState());
  useEffect(() => {
    const unsub = subscribe(() => setState(getState()));
    return () => { unsub(); };
  }, []);
  return state;
}

function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const sym = symbols[currency] || currency + ' ';
  if (currency === 'INR') return sym + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
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

// Portal Login Page
function PortalLoginPage({ onLogin }: { onLogin: (portalUserId: string) => void }) {
  const state = useAppState();
  const [mode, setMode] = useState<'token' | 'password'>('token');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = mode === 'token'
      ? actions.portalLogin(token)
      : actions.portalLogin(email, password);
    if (result.success && result.portalUserId) {
      onLogin(result.portalUserId);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const workspace = state.workspace;
  const brandColor = workspace?.brandColor || '#ea580c';

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: brandColor }}>
              <span className="text-white font-bold text-lg">
                {workspace?.name?.charAt(0) || 'C'}
              </span>
            </div>
            <span className="text-xl font-bold text-ink">{workspace?.name || 'Agency'}</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">Client Portal</h1>
          <p className="text-ink-muted mt-2">Sign in to view your projects and invoices</p>
        </div>

        <div className="bg-surface rounded-2xl border border-line p-6 shadow-soft">
          <div className="flex border-b border-line mb-4">
            <button onClick={() => setMode('token')}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 -mb-px ${mode === 'token' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
              Magic Link
            </button>
            <button onClick={() => setMode('password')}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 -mb-px ${mode === 'password' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}>
              Password
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'token' ? (
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Portal token</label>
                <input type="text" value={token} onChange={e => setToken(e.target.value)} required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Paste your magic link token" />
                <p className="text-xs text-ink-faint mt-1.5">Check your email for the portal link</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••" />
                </div>
              </>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button type="submit" className="w-full py-3 text-white font-semibold rounded-xl transition-all shadow-ember" style={{ backgroundColor: brandColor }}>
              Sign in to portal
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-line">
            <p className="text-xs text-ink-faint text-center">
              Demo: use token <code className="px-1 py-0.5 bg-canvas rounded text-primary-600">portal-token-ananya-xyz</code> or email <code className="px-1 py-0.5 bg-canvas rounded text-primary-600">ananya@novastudio.in</code> with password <code className="px-1 py-0.5 bg-canvas rounded text-primary-600">welcome123</code>
            </p>
          </div>
        </div>

        {workspace?.plan === 'free' && (
          <p className="text-center text-xs text-ink-faint mt-4">
            Powered by <span className="font-semibold text-primary-600">ClienterTap</span>
          </p>
        )}
      </div>
    </div>
  );
}

// Portal Layout
function PortalLayout({ children, currentPage, onNavigate, onLogout, isAgencyPreview }: {
  children: React.ReactNode; currentPage: string; onNavigate: (page: string) => void; onLogout: () => void; isAgencyPreview?: boolean;
}) {
  const state = useAppState();
  const portalUser = state.portalUsers.find(pu => pu.id === state.currentPortalUserId);
  const client = state.clients.find(c => c.id === portalUser?.clientId);
  const brandColor = state.workspace?.brandColor || '#ea580c';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'referrals', label: 'Refer', icon: UserPlus },
  ];

  const unreadMessages = state.messages.filter(m => {
    const thread = state.messageThreads.find(t => t.id === m.threadId);
    return thread?.clientId === client?.id && !m.read && m.senderType === 'agency';
  }).length;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Portal Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-line">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: brandColor }}>
              <span className="text-white font-bold text-sm">{state.workspace?.name?.charAt(0) || 'C'}</span>
            </div>
            <span className="font-semibold text-ink text-sm hidden sm:block">{state.workspace?.name}</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id ? 'bg-primary-50 text-primary-600' : 'text-ink-muted hover:text-ink hover:bg-canvas'}`}>
                {item.label}
                {item.id === 'messages' && unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadMessages}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {isAgencyPreview && (
              <button onClick={onLogout} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
                ← Back to Agency
              </button>
            )}
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-ink">{portalUser?.name}</div>
              <div className="text-xs text-ink-faint">{client?.company}</div>
            </div>
            <button onClick={onLogout} className="p-2 rounded-lg hover:bg-canvas text-ink-muted" title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto border-t border-line px-2 py-1.5 gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`relative flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${currentPage === item.id ? 'bg-primary-50 text-primary-600' : 'text-ink-muted'}`}>
              {item.label}
              {item.id === 'messages' && unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{unreadMessages}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Portal Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-line mt-8">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} {state.workspace?.name}. All rights reserved.</p>
          {state.workspace?.plan === 'free' && (
            <p className="text-xs text-ink-faint">
              Powered by <span className="font-semibold text-primary-600">ClienterTap</span>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

// Portal Home
function PortalHomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const state = useAppState();
  const portalUser = state.portalUsers.find(pu => pu.id === state.currentPortalUserId);
  const client = state.clients.find(c => c.id === portalUser?.clientId);
  if (!client) return null;

  const clientProjects = state.projects.filter(p => p.clientId === client.id);
  const clientInvoices = state.invoices.filter(i => i.clientId === client.id);
  const totalOwed = clientInvoices.reduce((sum, i) => sum + (i.total - i.amountPaid), 0);
  const pendingUpdates = state.projectUpdates.filter(u => {
    const proj = clientProjects.find(p => p.id === u.projectId);
    return proj && u.requestSignOff && u.status === 'pending';
  });
  const unreadMessages = state.messages.filter(m => {
    const thread = state.messageThreads.find(t => t.id === m.threadId);
    return thread?.clientId === client.id && !m.read && m.senderType === 'agency';
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Welcome, {client.name.split(' ')[0]}</h1>
        <p className="text-ink-muted text-sm mt-1">Here's what's happening with your projects.</p>
      </div>

      {/* Attention Items */}
      {(pendingUpdates.length > 0 || unreadMessages > 0 || totalOwed > 0) && (
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-primary-800 mb-3 flex items-center gap-2">
            <Bell size={16} /> Needs your attention
          </h2>
          <div className="space-y-2">
            {pendingUpdates.length > 0 && (
              <button onClick={() => onNavigate('projects')} className="w-full flex items-center justify-between p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-colors">
                <span className="text-sm text-ink">{pendingUpdates.length} update(s) awaiting your approval</span>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            )}
            {unreadMessages > 0 && (
              <button onClick={() => onNavigate('messages')} className="w-full flex items-center justify-between p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-colors">
                <span className="text-sm text-ink">{unreadMessages} new message(s)</span>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            )}
            {totalOwed > 0 && (
              <button onClick={() => onNavigate('invoices')} className="w-full flex items-center justify-between p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-colors">
                <span className="text-sm text-ink">Outstanding balance: {formatCurrency(totalOwed, client.currency)}</span>
                <ChevronRight size={16} className="text-ink-faint" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban size={14} className="text-primary-600" />
            <span className="text-xs text-ink-muted">Active projects</span>
          </div>
          <div className="text-2xl font-bold text-ink">{clientProjects.filter(p => p.status === 'ongoing').length}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-green-600" />
            <span className="text-xs text-ink-muted">Total paid</span>
          </div>
          <div className="text-2xl font-bold text-ink">{formatCurrency(clientInvoices.reduce((s, i) => s + i.amountPaid, 0), client.currency)}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-amber-600" />
            <span className="text-xs text-ink-muted">Outstanding</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalOwed, client.currency)}</div>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={14} className="text-blue-600" />
            <span className="text-xs text-ink-muted">Messages</span>
          </div>
          <div className="text-2xl font-bold text-ink">{unreadMessages}</div>
        </div>
      </div>

      {/* Running Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-ink">Your projects</h2>
          <button onClick={() => onNavigate('projects')} className="text-sm text-primary-600 font-medium">View all</button>
        </div>
        <div className="space-y-2">
          {clientProjects.slice(0, 3).map(p => (
            <div key={p.id} className="bg-surface rounded-xl border border-line p-4 shadow-soft flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === 'completed' ? 'bg-green-50' : p.status === 'ongoing' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                <FolderKanban size={18} className={p.status === 'completed' ? 'text-green-600' : p.status === 'ongoing' ? 'text-amber-600' : 'text-blue-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink">{p.name}</div>
                <div className="text-xs text-ink-muted capitalize">{p.status} • Budget: {formatCurrency(p.budget, p.currency)}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg capitalize ${p.status === 'completed' ? 'bg-green-50 text-green-700' : p.status === 'ongoing' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Portal Projects Page
function PortalProjectsPage() {
  const state = useAppState();
  const portalUser = state.portalUsers.find(pu => pu.id === state.currentPortalUserId);
  const client = state.clients.find(c => c.id === portalUser?.clientId);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  if (!client) return null;
  const clientProjects = state.projects.filter(p => p.clientId === client.id);

  const handleApprove = (updateId: string) => {
    actions.approveProjectUpdate(updateId, portalUser!.id);
  };

  const handleSubmitReview = (projectId: string) => {
    if (reviewRating < 1 || !reviewText.trim()) return;
    actions.addReview({
      clientId: client.id,
      projectId,
      rating: reviewRating as 1|2|3|4|5,
      text: reviewText,
      clientName: client.name,
    });
    setShowReviewForm(null);
    setReviewText('');
    setReviewRating(5);
  };

  if (selectedProject) {
    const project = clientProjects.find(p => p.id === selectedProject);
    if (!project) return null;
    const projectUpdates = state.projectUpdates.filter(u => u.projectId === project.id);
    const projectFiles = state.files.filter(f => f.projectId === project.id && f.sharedWithClient);
    const projectInvoices = state.invoices.filter(i => i.projectId === project.id);

    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => setSelectedProject(null)} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft size={16} /> Back to projects
        </button>

        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-ink">{project.name}</h1>
              <p className="text-sm text-ink-muted mt-1">{project.description}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-lg capitalize ${project.status === 'completed' ? 'bg-green-50 text-green-700' : project.status === 'ongoing' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
              {project.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-line">
            <div>
              <div className="text-xs text-ink-muted">Budget</div>
              <div className="text-sm font-semibold text-ink">{formatCurrency(project.budget, project.currency)}</div>
            </div>
            <div>
              <div className="text-xs text-ink-muted">Start date</div>
              <div className="text-sm font-semibold text-ink">{project.startDate}</div>
            </div>
            <div>
              <div className="text-xs text-ink-muted">Deadline</div>
              <div className="text-sm font-semibold text-ink">{project.deadline}</div>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div>
          <h2 className="text-lg font-semibold text-ink mb-3">Updates</h2>
          {projectUpdates.length === 0 ? (
            <p className="text-sm text-ink-faint">No updates yet.</p>
          ) : (
            <div className="space-y-3">
              {projectUpdates.map(u => (
                <div key={u.id} className="bg-surface rounded-xl border border-line p-4 shadow-soft">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-ink">{u.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${u.status === 'approved' ? 'bg-green-50 text-green-700' : u.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                      {u.status === 'approved' ? '✓ Approved' : u.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted mb-3">{u.body}</p>
                  {u.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {u.attachments.map(f => (
                        <span key={f.id} className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg bg-canvas text-ink-muted">
                          <Paperclip size={12} /> {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {u.requestSignOff && u.status === 'pending' && (
                    <div className="flex gap-2 pt-2 border-t border-line">
                      <button onClick={() => handleApprove(u.id)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                        <CheckCircle2 size={12} /> Approve
                      </button>
                    </div>
                  )}
                  {u.approvedBy && (
                    <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Approved by {u.approvedBy} on {new Date(u.approvedAt!).toLocaleDateString()}
                    </div>
                  )}
                  <div className="text-xs text-ink-faint mt-2">{timeAgo(u.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared Files */}
        <div>
          <h2 className="text-lg font-semibold text-ink mb-3">Shared files</h2>
          {projectFiles.length === 0 ? (
            <p className="text-sm text-ink-faint">No files shared yet.</p>
          ) : (
            <div className="space-y-2">
              {projectFiles.map(f => (
                <div key={f.id} className="bg-surface rounded-xl border border-line p-3 shadow-soft flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                    <FileText size={16} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{f.name}</div>
                    <div className="text-xs text-ink-faint">{(f.size / 1024 / 1024).toFixed(1)} MB</div>
                  </div>
                  <button className="px-3 py-1.5 border border-line rounded-lg text-xs font-medium text-ink-muted hover:bg-canvas flex items-center gap-1">
                    <Download size={12} /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices for this project */}
        {projectInvoices.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-ink mb-3">Invoices</h2>
            <div className="space-y-2">
              {projectInvoices.map(inv => (
                <div key={inv.id} className="bg-surface rounded-xl border border-line p-3 shadow-soft flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-ink">{inv.number}</div>
                    <div className="text-xs text-ink-faint">Due {inv.dueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-ink">{formatCurrency(inv.total, inv.currency)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${inv.status === 'paid' ? 'bg-green-50 text-green-700' : inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Review (only for completed projects) */}
        {project.status === 'completed' && !state.reviews.find(r => r.projectId === project.id && r.clientId === client.id) && (
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-primary-600" />
              <h3 className="text-sm font-semibold text-primary-800">Share your feedback</h3>
            </div>
            <p className="text-xs text-primary-700 mb-3">This project is complete. We'd love to hear how we did!</p>
            {showReviewForm === project.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setReviewRating(n)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${n <= reviewRating ? 'bg-primary-600 text-white' : 'bg-white border border-line text-ink-muted'}`}>
                        <Star size={14} fill={n <= reviewRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Your review</label>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Tell us about your experience..." />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowReviewForm(null)} className="px-3 py-1.5 border border-line rounded-lg text-xs font-medium text-ink-muted">Cancel</button>
                  <button onClick={() => handleSubmitReview(project.id)} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg">Submit review</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowReviewForm(project.id)}
                className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg">
                Write a review
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Projects</h1>
        <p className="text-ink-muted text-sm">{clientProjects.length} project(s)</p>
      </div>
      <div className="space-y-3">
        {clientProjects.map(p => {
          const paid = state.invoices.filter(i => i.projectId === p.id).reduce((s, i) => s + i.amountPaid, 0);
          const pendingUpdates = state.projectUpdates.filter(u => u.projectId === p.id && u.requestSignOff && u.status === 'pending');
          return (
            <div key={p.id} onClick={() => setSelectedProject(p.id)}
              className="bg-surface rounded-2xl border border-line p-4 shadow-soft hover:shadow-soft-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{p.name}</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{p.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded capitalize ${p.status === 'completed' ? 'bg-green-50 text-green-700' : p.status === 'ongoing' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                  {p.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-ink-faint">
                <span>Budget: {formatCurrency(p.budget, p.currency)}</span>
                <span>Paid: {formatCurrency(paid, p.currency)}</span>
                <span>Due: {p.deadline}</span>
              </div>
              {pendingUpdates.length > 0 && (
                <div className="mt-2 text-xs text-primary-600 font-medium flex items-center gap-1">
                  <Bell size={12} /> {pendingUpdates.length} update(s) awaiting approval
                </div>
              )}
            </div>
          );
        })}
        {clientProjects.length === 0 && (
          <div className="text-center py-12 text-ink-faint">
            <FolderKanban size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Portal Invoices Page
function PortalInvoicesPage() {
  const state = useAppState();
  const portalUser = state.portalUsers.find(pu => pu.id === state.currentPortalUserId);
  const client = state.clients.find(c => c.id === portalUser?.clientId);
  if (!client) return null;

  const clientInvoices = state.invoices.filter(i => i.clientId === client.id);
  const totalOwed = clientInvoices.reduce((s, i) => s + (i.total - i.amountPaid), 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Invoices</h1>
        <p className="text-ink-muted text-sm">{clientInvoices.length} invoice(s)</p>
      </div>

      {totalOwed > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-amber-800">Outstanding balance</div>
            <div className="text-xs text-amber-700">Please settle at your earliest convenience</div>
          </div>
          <div className="text-xl font-bold text-amber-800">{formatCurrency(totalOwed, client.currency)}</div>
        </div>
      )}

      <div className="space-y-3">
        {clientInvoices.map(inv => (
          <div key={inv.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">{inv.number}</h3>
                <p className="text-xs text-ink-muted mt-0.5">Issued {inv.issueDate} • Due {inv.dueDate}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg capitalize font-medium ${inv.status === 'paid' ? 'bg-green-50 text-green-700' : inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : inv.status === 'overdue' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
                {inv.status}
              </span>
            </div>
            <div className="bg-canvas rounded-xl p-3 mb-3">
              {inv.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1 border-b border-line/50 last:border-0">
                  <span className="text-ink">{item.description}</span>
                  <span className="text-ink-muted">{formatCurrency(item.amount, inv.currency)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 mt-1 border-t border-line font-semibold">
                <span className="text-ink">Total</span>
                <span className="text-ink">{formatCurrency(inv.total, inv.currency)}</span>
              </div>
              {inv.amountPaid > 0 && (
                <div className="flex justify-between text-xs pt-1 text-ink-muted">
                  <span>Paid</span>
                  <span>{formatCurrency(inv.amountPaid, inv.currency)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 border border-line rounded-xl text-xs font-medium text-ink hover:bg-canvas flex items-center justify-center gap-1">
                <Download size={12} /> Download PDF
              </button>
              {inv.status !== 'paid' && (
                <button className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1">
                  <DollarSign size={12} /> Record payment
                </button>
              )}
            </div>
          </div>
        ))}
        {clientInvoices.length === 0 && (
          <div className="text-center py-12 text-ink-faint">
            <FileText size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Portal Messages Page
function PortalMessagesPage() {
  const state = useAppState();
  const portalUser = state.portalUsers.find(pu => pu.id === state.currentPortalUserId);
  const client = state.clients.find(c => c.id === portalUser?.clientId);
  const [newMessage, setNewMessage] = useState('');

  if (!client) return null;
  const thread = state.messageThreads.find(t => t.clientId === client.id);
  if (!thread) return <p className="text-ink-faint">No message thread available.</p>;

  const threadMessages = state.messages.filter(m => m.threadId === thread.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Mark messages as read when viewing
  useEffect(() => {
    actions.markMessagesRead(thread.id);
  }, [thread.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    actions.sendMessage(thread.id, newMessage);
    setNewMessage('');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-ink">Messages</h1>
        <p className="text-ink-muted text-sm">{thread.subject}</p>
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {threadMessages.map(m => {
            const isMe = m.senderType === 'client';
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMe ? 'bg-primary-600 text-white' : 'bg-canvas text-ink border border-line'}`}>
                  {!isMe && <div className="text-xs font-medium mb-0.5 opacity-70">{m.senderName}</div>}
                  <p className="text-sm">{m.body}</p>
                  <div className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-ink-faint'}`}>{timeAgo(m.createdAt)}</div>
                </div>
              </div>
            );
          })}
          {threadMessages.length === 0 && (
            <div className="text-center py-8 text-ink-faint">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-line p-3 flex gap-2">
          <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <button type="submit" disabled={!newMessage.trim()}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-1.5">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

// Portal Reviews Page
function PortalReviewsPage() {
  const state = useAppState();
  const portalUser = state.portalUsers.find(pu => pu.id === state.currentPortalUserId);
  const client = state.clients.find(c => c.id === portalUser?.clientId);
  if (!client) return null;

  const clientReviews = state.reviews.filter(r => r.clientId === client.id);
  const allReviews = state.reviews;
  const avgRating = allReviews.length > 0 ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : '0';

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Reviews</h1>
        <p className="text-ink-muted text-sm">Verified client feedback</p>
      </div>

      {/* Agency rating summary */}
      <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-ink">{avgRating}</div>
          <div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={18} className={n <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
              ))}
            </div>
            <p className="text-xs text-ink-muted mt-1">{allReviews.length} verified review(s)</p>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {allReviews.map(r => (
          <div key={r.id} className="bg-surface rounded-2xl border border-line p-4 shadow-soft">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-700">{r.clientName.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">{r.clientName}</div>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={12} className={n <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                      ))}
                    </div>
                    <span className="text-xs text-green-600 flex items-center gap-0.5">
                      <Shield size={10} /> Verified
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-ink-faint">{timeAgo(r.createdAt)}</span>
            </div>
            <p className="text-sm text-ink">{r.text}</p>
            {r.agencyReply && (
              <div className="mt-3 pl-4 border-l-2 border-primary-200">
                <div className="text-xs font-medium text-ink-muted mb-0.5">Response from {state.workspace?.name}</div>
                <p className="text-sm text-ink-muted">{r.agencyReply}</p>
              </div>
            )}
          </div>
        ))}
        {allReviews.length === 0 && (
          <div className="text-center py-12 text-ink-faint">
            <Star size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No reviews yet. Complete a project to leave a review!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Portal Referrals Page
function PortalReferralsPage() {
  const state = useAppState();
  const portalUser = state.portalUsers.find(pu => pu.id === state.currentPortalUserId);
  const client = state.clients.find(c => c.id === portalUser?.clientId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contactName: '', contactEmail: '', contactPhone: '', message: '' });

  if (!client) return null;
  const clientReferrals = state.referrals.filter(r => r.referrerClientId === client.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.addReferral({ ...form, referrerClientId: client.id, status: 'pending' });
    setForm({ contactName: '', contactEmail: '', contactPhone: '', message: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Refer a friend</h1>
          <p className="text-ink-muted text-sm">Know someone who needs our services?</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember">
          <UserPlus size={16} /> New referral
        </button>
      </div>

      {showForm && (
        <div className="bg-surface rounded-2xl border border-line p-5 shadow-soft animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Contact name *</label>
                <input type="text" required value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email *</label>
                <input type="email" required value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Phone</label>
              <input type="tel" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Why are you referring them?</label>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={2}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Send referral</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {clientReferrals.map(r => (
          <div key={r.id} className="bg-surface rounded-xl border border-line p-4 shadow-soft flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <UserPlus size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-ink">{r.contactName}</div>
              <div className="text-xs text-ink-muted">{r.contactEmail}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded capitalize ${r.status === 'converted' ? 'bg-green-50 text-green-700' : r.status === 'contacted' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
              {r.status}
            </span>
          </div>
        ))}
        {clientReferrals.length === 0 && !showForm && (
          <div className="text-center py-12 text-ink-faint">
            <Sparkles size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">You haven't referred anyone yet</p>
            <p className="text-xs mt-1">Refer a friend and help them grow their business</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Portal App
export default function PortalApp({ onExit }: { onExit: () => void }) {
  const state = useAppState();
  const [currentPage, setCurrentPage] = useState('home');

  // If no portal user is logged in, show login
  if (!state.currentPortalUserId) {
    return <PortalLoginPage onLogin={() => {}} />;
  }

  const handleLogout = () => {
    actions.portalLogout();
    onExit();
  };

  // Check if we're in "preview" mode (agency user viewing as client)
  const isAgencyPreview = !!(state.isAuthenticated && state.currentUserId && state.currentPortalUserId);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <PortalHomePage onNavigate={setCurrentPage} />;
      case 'projects': return <PortalProjectsPage />;
      case 'invoices': return <PortalInvoicesPage />;
      case 'messages': return <PortalMessagesPage />;
      case 'reviews': return <PortalReviewsPage />;
      case 'referrals': return <PortalReferralsPage />;
      default: return <PortalHomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <PortalLayout currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} isAgencyPreview={isAgencyPreview}>
      {renderPage()}
    </PortalLayout>
  );
}
