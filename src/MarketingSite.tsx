import { useState } from 'react';
import { Link, ChevronDown, Check, ArrowRight, Star, Shield, Zap, Users, FileText, CreditCard, Globe, MessageSquare, Calendar, TrendingUp, Menu, X } from 'lucide-react';

// Marketing Site - Homepage and all marketing pages
export function MarketingSite({ onSignIn, onStartFree }: { onSignIn: () => void; onStartFree: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-bone">
      {/* Announcement Bar */}
      <div className="bg-espresso text-espresso-text text-center py-2 text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-primary-600 text-white text-xs font-semibold">New</span>
          Introducing the Marketplace — Find verified agencies
          <ArrowRight size={14} />
        </span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-bone/95 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-ink">ClienterTap</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              {/* Solutions Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
                >
                  Solutions <ChevronDown size={14} />
                </button>
                {solutionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-surface rounded-2xl border border-line shadow-soft-lg p-4">
                    <div className="space-y-3">
                      {[
                        { icon: Users, title: 'Client Management', desc: 'Manage clients end-to-end' },
                        { icon: TrendingUp, title: 'CRM & Lead Pipeline', desc: 'Track leads from enquiry to won' },
                        { icon: FileText, title: 'Project Management', desc: 'Deliver projects on time' },
                        { icon: CreditCard, title: 'Invoicing & Payments', desc: 'Get paid faster with GST invoices' },
                        { icon: Globe, title: 'Client Portal', desc: 'White-label portal for clients' },
                        { icon: Star, title: 'Verified Reviews', desc: 'Collect and showcase reviews' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-canvas cursor-pointer">
                          <item.icon size={18} className="text-primary-600 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold text-ink">{item.title}</div>
                            <div className="text-xs text-ink-muted">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a href="#pricing" className="text-sm font-medium text-ink-muted hover:text-ink">Pricing</a>
              <a href="#marketplace" className="text-sm font-medium text-ink-muted hover:text-ink">Marketplace</a>

              {/* Free Tools Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setToolsOpen(!toolsOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
                >
                  Free Tools <ChevronDown size={14} />
                </button>
                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-surface rounded-2xl border border-line shadow-soft-lg p-4">
                    <div className="space-y-2">
                      {['Invoice Generator', 'GST Calculator', 'Rate Calculator', 'Time Converter', 'Templates'].map((tool, i) => (
                        <a key={i} href={`#tool-${i}`} className="block p-2 rounded-xl hover:bg-canvas text-sm text-ink">
                          {tool}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a href="#contact" className="text-sm font-medium text-ink-muted hover:text-ink">Contact</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="hidden sm:block text-sm font-medium text-ink hover:text-primary-600">
              Sign in
            </button>
            <button 
              onClick={onStartFree}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-ember transition-all"
            >
              Start free
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-ink-muted">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-line bg-surface p-4 space-y-3">
            <a href="#solutions" className="block py-2 text-sm font-medium text-ink">Solutions</a>
            <a href="#pricing" className="block py-2 text-sm font-medium text-ink">Pricing</a>
            <a href="#marketplace" className="block py-2 text-sm font-medium text-ink">Marketplace</a>
            <a href="#tools" className="block py-2 text-sm font-medium text-ink">Free Tools</a>
            <a href="#contact" className="block py-2 text-sm font-medium text-ink">Contact</a>
            <button onClick={onSignIn} className="block w-full py-2 text-sm font-medium text-ink text-left">
              Sign in
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bone to-cream">
        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
              <Zap size={16} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Trusted by 2,000+ agencies worldwide</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-ink leading-tight mb-6">
              Run every client from first enquiry to final{' '}
              <span className="italic font-serif text-primary-600 relative">
                payment
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 7C50 7 50 1 100 1C150 1 150 7 200 7" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-ink-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              One login for leads, quotes, e-signed contracts, projects, your client portal, invoices and payment tracking. 
              Built for agencies and established freelancers, in about 30 currencies, with GST-compliant invoicing in India.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button 
                onClick={onStartFree}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-xl shadow-ember transition-all hover:shadow-lift-2 hover:-translate-y-0.5"
              >
                Start free — no card required
              </button>
              <button className="px-8 py-4 border-2 border-line hover:border-ink text-ink text-lg font-semibold rounded-xl transition-all hover:bg-surface">
                See how it works →
              </button>
            </div>
            <p className="text-sm text-ink-faint mb-8">
              By signing up, you agree to our{' '}
              <a href="#terms" className="text-primary-600 hover:underline">Terms</a> and{' '}
              <a href="#privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5"><Shield size={16} className="text-green-600" /> Encrypted in transit</span>
              <span className="flex items-center gap-1.5"><Shield size={16} className="text-green-600" /> Per-account data isolation</span>
              <span className="flex items-center gap-1.5"><Shield size={16} className="text-green-600" /> Export anytime</span>
              <span className="flex items-center gap-1.5"><Shield size={16} className="text-green-600" /> No card required</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-6xl mx-auto px-4 pb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-bone via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="bg-surface rounded-2xl border border-line shadow-lift-3 p-6 animate-float-slow">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-line">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-canvas rounded-lg px-3 py-1.5 text-xs text-ink-faint font-mono">
                app.clientertap.com/dashboard
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                <div className="text-xs text-primary-700 mb-1 font-medium">Revenue</div>
                <div className="text-2xl font-bold text-ink">₹4,50,000</div>
                <div className="text-xs text-green-600 font-medium mt-1">↑ 12% this month</div>
              </div>
              <div className="bg-canvas rounded-xl p-4 border border-line">
                <div className="text-xs text-ink-muted mb-1">Active Projects</div>
                <div className="text-2xl font-bold text-ink">12</div>
                <div className="text-xs text-ink-faint mt-1">3 due this week</div>
              </div>
              <div className="bg-canvas rounded-xl p-4 border border-line">
                <div className="text-xs text-ink-muted mb-1">Open Leads</div>
                <div className="text-2xl font-bold text-ink">8</div>
                <div className="text-xs text-ink-faint mt-1">₹2.5L pipeline</div>
              </div>
              <div className="bg-canvas rounded-xl p-4 border border-line">
                <div className="text-xs text-ink-muted mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-ink">68%</div>
                <div className="text-xs text-green-600 font-medium mt-1">↑ 5% vs last month</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-canvas rounded-xl p-4 border border-line">
                <div className="text-sm font-semibold text-ink mb-3">Sales Pipeline</div>
                <div className="space-y-3">
                  {[
                    { stage: 'New', count: 4, color: 'bg-blue-500' },
                    { stage: 'Contacted', count: 6, color: 'bg-amber-500' },
                    { stage: 'Qualified', count: 8, color: 'bg-purple-500' },
                    { stage: 'Won', count: 12, color: 'bg-green-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      <div className="w-20 text-xs text-ink-muted">{item.stage}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${(item.count / 12) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-ink font-semibold w-8">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-canvas rounded-xl p-4 border border-line">
                <div className="text-sm font-semibold text-ink mb-3">Recent Activity</div>
                <div className="space-y-3">
                  {[
                    { icon: CreditCard, text: 'Payment received from Nova Studio', time: '2h ago', color: 'text-green-600 bg-green-50' },
                    { icon: FileText, text: 'Invoice sent to Acme Corp', time: '4h ago', color: 'text-blue-600 bg-blue-50' },
                    { icon: Users, text: 'New lead from marketplace', time: '6h ago', color: 'text-purple-600 bg-purple-50' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                        <item.icon size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-ink font-medium">{item.text}</div>
                        <div className="text-xs text-ink-faint">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee - What you're replacing */}
      <section className="bg-cream py-12 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8">
              {['Spreadsheets', 'Word invoices', 'WhatsApp threads', 'Sticky notes', 'Email chains', 'Calendar apps', 'Payment trackers', 'Reminder alarms'].map((item, j) => (
                <span key={j} className="text-2xl font-semibold text-ink-faint">
                  {item} <span className="text-primary-600 mx-4">•</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* Old Way vs New Way */}
      <section className="py-20 bg-bone">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-ink text-center mb-12">
            One app instead of <span className="italic font-serif text-primary-600">ten tabs</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface rounded-2xl border border-line p-8">
              <h3 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
                <X size={24} className="text-red-500" /> The old way
              </h3>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Leads in spreadsheets</li>
                <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Invoices in Word/Excel</li>
                <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Client comms in WhatsApp/Email</li>
                <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Projects in Trello/Notion</li>
                <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Payments in bank apps</li>
                <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Contracts in DocuSign</li>
                <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Reviews scattered everywhere</li>
              </ul>
            </div>
            <div className="bg-surface rounded-2xl border-2 border-primary-600 p-8 shadow-ember">
              <h3 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
                <Check size={24} className="text-primary-600" /> The ClienterTap way
              </h3>
              <ul className="space-y-3 text-ink">
                <li className="flex items-start gap-2"><Check size={18} className="text-primary-600 mt-0.5" /> All leads in one pipeline</li>
                <li className="flex items-start gap-2"><Check size={18} className="text-primary-600 mt-0.5" /> GST invoices with one click</li>
                <li className="flex items-start gap-2"><Check size={18} className="text-primary-600 mt-0.5" /> Client portal with messaging</li>
                <li className="flex items-start gap-2"><Check size={18} className="text-primary-600 mt-0.5" /> Projects with timelines & files</li>
                <li className="flex items-start gap-2"><Check size={18} className="text-primary-600 mt-0.5" /> Payment tracking & reminders</li>
                <li className="flex items-start gap-2"><Check size={18} className="text-primary-600 mt-0.5" /> E-signatures built-in</li>
                <li className="flex items-start gap-2"><Check size={18} className="text-primary-600 mt-0.5" /> Verified reviews on autopilot</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Act Journey */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-ink text-center mb-4">
            One client, <span className="italic font-serif text-primary-600">end to end</span>
          </h2>
          <p className="text-center text-ink-muted mb-12 max-w-2xl mx-auto">
            Follow a client's journey from first enquiry to final payment — all in one place.
          </p>
          <div className="space-y-6">
            {[
              { 
                act: 'I', 
                title: 'The Lead', 
                desc: 'Capture leads from website, ads, or marketplace. Track in pipeline.',
                mockup: '📊 Lead Pipeline View',
                features: ['Auto-capture from forms', 'Drag-and-drop stages', 'Source tracking']
              },
              { 
                act: 'II', 
                title: 'The Client', 
                desc: 'Convert won leads to clients. Send proposals and e-signed contracts.',
                mockup: '📝 Proposal & Contract',
                features: ['One-click conversion', 'AI-written proposals', 'E-signature built-in']
              },
              { 
                act: 'III', 
                title: 'The Work', 
                desc: 'Manage projects with timelines, tasks, and file sharing.',
                mockup: '📋 Project Dashboard',
                features: ['Kanban boards', 'Time tracking', 'Client file sharing']
              },
              { 
                act: 'IV', 
                title: 'Her Side', 
                desc: 'Client portal for updates, approvals, invoices, and messaging.',
                mockup: '🌐 Client Portal',
                features: ['White-label branding', 'Real-time messaging', 'Invoice downloads']
              },
              { 
                act: 'V', 
                title: 'The Loop', 
                desc: 'Collect verified reviews, get referrals, and grow your business.',
                mockup: '⭐ Review Collection',
                features: ['Auto-review requests', 'Public review page', 'Referral tracking']
              },
            ].map((item, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-line p-8 flex flex-col md:flex-row items-start gap-6 hover:shadow-lift-1 transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-ember">
                    {item.act}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-ink mb-2">{item.title}</h3>
                  <p className="text-ink-muted mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, j) => (
                      <span key={j} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-64">
                  <div className="bg-gradient-to-br from-canvas to-surface rounded-xl border border-line p-4 text-center">
                    <div className="text-4xl mb-2">{item.mockup.split(' ')[0]}</div>
                    <div className="text-sm font-medium text-ink">{item.mockup.split(' ').slice(1).join(' ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <p className="text-3xl font-bold text-ink mb-6">
              One client. <span className="italic font-serif text-primary-600">Not one spreadsheet.</span>
            </p>
            <button 
              onClick={onStartFree}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-xl shadow-ember hover:shadow-lift-2 hover:-translate-y-0.5 transition-all"
            >
              Start free — no card required
            </button>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="py-20 bg-espresso text-espresso-text">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Verified Reviews, <span className="italic font-serif text-terracotta-400">on autopilot</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-espresso-soft rounded-2xl p-6 border border-espresso-line">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-amber-400 fill-amber-400" />)}
                </div>
                <span className="text-sm text-espresso-muted">Verified Client</span>
              </div>
              <p className="text-espresso-text mb-4">
                "ClienterTap transformed how we manage clients. The portal is a game-changer — our clients love the transparency."
              </p>
              <div className="text-sm text-espresso-muted">— Priya Sharma, Bloom Studios</div>
            </div>
            <div className="bg-espresso-soft rounded-2xl p-6 border border-espresso-line">
              <div className="flex items-start gap-4">
                <div className="text-5xl font-bold text-terracotta-400">4.9</div>
                <div>
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <div className="text-sm text-espresso-muted">Based on 127 verified reviews</div>
                  <div className="mt-2 px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full inline-flex items-center gap-1">
                    <Shield size={12} /> Public review page
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Collected automatically', desc: 'Reviews requested when projects complete' },
              { num: '02', title: 'Genuinely verified', desc: 'Only authenticated clients can review' },
              { num: '03', title: 'A public page on us', desc: 'Your agency gets a review page at /r/you' },
              { num: '04', title: 'An embeddable badge', desc: 'Show reviews on your website' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-terracotta-400 mb-2">{item.num}</div>
                <div className="font-semibold text-espresso-text mb-1">{item.title}</div>
                <div className="text-sm text-espresso-muted">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-bone">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-ink text-center mb-4">
            Simple, transparent <span className="italic font-serif text-primary-600">pricing</span>
          </h2>
          <p className="text-center text-ink-muted mb-12">Start free, upgrade when you're ready. No hidden fees.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-surface rounded-2xl border border-line p-8">
              <h3 className="text-xl font-bold text-ink mb-2">Free</h3>
              <div className="text-4xl font-bold text-ink mb-1">$0</div>
              <div className="text-sm text-ink-muted mb-6">Forever free</div>
              <ul className="space-y-3 mb-8">
                {['3 clients', '5 projects', '20 active leads', '1 teammate', '100 MB storage', '3 AI quotes/month'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                    <Check size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStartFree}
                className="w-full py-3 border-2 border-line hover:border-primary-600 text-ink font-semibold rounded-xl transition-all"
              >
                Start free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-surface rounded-2xl border-2 border-primary-600 p-8 shadow-ember relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                Most popular
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Pro</h3>
              <div className="text-4xl font-bold text-ink mb-1">$19<span className="text-lg font-normal text-ink-muted">/mo</span></div>
              <div className="text-sm text-ink-muted mb-6">or ₹199/mo in India</div>
              <ul className="space-y-3 mb-8">
                {['20 clients', '40 projects', '200 leads', '5 teammates', '1 GB storage', '25 AI quotes/month', 'All clients portal access', 'Auto-invoicing retainers'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                    <Check size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStartFree}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-ember transition-all"
              >
                Start free trial
              </button>
            </div>

            {/* Ultra Plan */}
            <div className="bg-surface rounded-2xl border border-line p-8">
              <h3 className="text-xl font-bold text-ink mb-2">Ultra</h3>
              <div className="text-4xl font-bold text-ink mb-1">$39<span className="text-lg font-normal text-ink-muted">/mo</span></div>
              <div className="text-sm text-ink-muted mb-6">or ₹799/mo in India</div>
              <ul className="space-y-3 mb-8">
                {['Unlimited everything', '10 GB storage', '100 AI quotes/month', 'White label', 'Custom domain', 'Lead integrations', 'Team payroll', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                    <Check size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStartFree}
                className="w-full py-3 border-2 border-line hover:border-primary-600 text-ink font-semibold rounded-xl transition-all"
              >
                Start free trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-ink text-center mb-12">
            Your data is <span className="italic font-serif text-primary-600">secure</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Row-level security', desc: 'Every record isolated per workspace' },
              { icon: Shield, title: 'AES-256 encryption', desc: 'Data encrypted at rest and in transit' },
              { icon: Shield, title: 'No data sharing', desc: 'We never share your data with third parties' },
              { icon: Shield, title: 'Isolated per account', desc: 'Multi-tenant architecture with RLS' },
              { icon: Shield, title: 'Export anytime', desc: 'Download all your data in CSV/JSON' },
              { icon: Shield, title: 'Encrypted in transit', desc: 'TLS 1.3 for all connections' },
            ].map((item, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-line p-6 flex items-start gap-4">
                <item.icon size={24} className="text-primary-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-ink mb-1">{item.title}</div>
                  <div className="text-sm text-ink-muted">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-20 bg-bone">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-primary-100 mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-700">V</span>
          </div>
          <h2 className="text-3xl font-bold text-ink mb-6">A note from the founder</h2>
          <blockquote className="text-xl text-ink-muted mb-6 italic">
            "I built ClienterTap because I was tired of juggling 10 different tools to run my agency. 
            I wanted one place for everything — from first enquiry to final payment. 
            I hope it saves you as much time as it's saved me."
          </blockquote>
          <div className="text-ink font-semibold">Vikram Singh</div>
          <div className="text-sm text-ink-muted">Founder, ClienterTap</div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-ink text-center mb-12">
            Frequently asked <span className="italic font-serif text-primary-600">questions</span>
          </h2>
          <div className="space-y-3">
            {[
              { q: 'Is the Free plan really free?', a: 'Yes, the Free plan is forever free with no credit card required. You get 3 clients, 5 projects, and all core features.' },
              { q: 'What counts as an "active lead"?', a: 'Only open leads count against your limit. Won, lost, or converted leads free up their slot.' },
              { q: 'What happens when I reach a limit?', a: 'You can still use all existing data, but cannot add new items until you upgrade or free up space.' },
              { q: 'Can I downgrade if I\'m over a limit?', a: 'Yes, you keep all your data but cannot add new items until you\'re under the limit.' },
              { q: 'Do you process payments from my clients?', a: 'No, ClienterTap helps you track payments but does not process them. Your clients pay you directly.' },
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription anytime. You\'ll keep access until the end of your billing period.' },
            ].map((item, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-line overflow-hidden">
                <button 
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-ink">{item.q}</span>
                  <ChevronDown size={20} className={`text-ink-muted transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-4 text-ink-muted">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to run your business <span className="italic font-serif">better</span>?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of agencies and freelancers using ClienterTap to manage clients end-to-end.
          </p>
          <button 
            onClick={onStartFree}
            className="px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-xl hover:bg-cream transition-all"
          >
            Start free — no card required
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-espresso text-espresso-text py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-6 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold">ClienterTap</span>
              </div>
              <p className="text-sm text-espresso-muted">
                Run every client from first enquiry to final payment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white">Demo</a></li>
                <li><a href="#changelog" className="hover:text-white">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Use Cases</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><a href="#freelancers" className="hover:text-white">Freelancers</a></li>
                <li><a href="#agencies" className="hover:text-white">Agencies</a></li>
                <li><a href="#consultants" className="hover:text-white">Consultants</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Free Tools</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><a href="#invoice" className="hover:text-white">Invoice Generator</a></li>
                <li><a href="#gst" className="hover:text-white">GST Calculator</a></li>
                <li><a href="#rate" className="hover:text-white">Rate Calculator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><a href="#blog" className="hover:text-white">Blog</a></li>
                <li><a href="#help" className="hover:text-white">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-espresso-muted">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#privacy" className="hover:text-white">Privacy</a></li>
                <li><a href="#terms" className="hover:text-white">Terms</a></li>
                <li><a href="#security" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-espresso-line flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-espresso-muted">
              © 2026 ClienterTap. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-espresso-muted">
              <a href="#privacy" className="hover:text-white">Privacy</a>
              <a href="#terms" className="hover:text-white">Terms</a>
              <a href="#cookies" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
