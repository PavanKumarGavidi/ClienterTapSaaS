import { useState, useEffect } from 'react';
import { getState, subscribe, actions } from './lib/store';
import { AppState, Review, MarketplaceProfile, MarketplaceEnquiry, Integration, IntegrationType } from './lib/types';
import {
  Star, Globe, Link2, Palette, Shield, CheckCircle2, AlertCircle, Copy,
  ExternalLink, MessageSquare, Briefcase, MapPin, Mail, Phone, Send,
  RefreshCw, Trash2, Edit3, Eye, Zap, Webhook, Facebook, Target, X
} from 'lucide-react';

function useAppState(): AppState {
  const [state, setState] = useState(getState());
  useEffect(() => {
    const unsub = subscribe(() => setState(getState()));
    return () => { unsub(); };
  }, []);
  return state;
}

// Public Reviews Page (/r/<slug>)
export function PublicReviewsPage({ slug }: { slug: string }) {
  const state = useAppState();
  
  if (state.workspace?.slug !== slug) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-ink-faint" />
          <h1 className="text-2xl font-bold text-ink mb-2">Agency not found</h1>
          <p className="text-ink-muted">The agency you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const reviews = state.reviews;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const brandColor = state.workspace?.whiteLabel?.brandColor || state.workspace?.brandColor || '#ea580c';

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="bg-surface border-b border-line">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: brandColor }}
            >
              {state.workspace?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink">{state.workspace?.name}</h1>
              <p className="text-ink-muted">Verified Client Reviews</p>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="bg-canvas rounded-2xl p-6 flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-ink">{avgRating}</div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={20}
                    className={i <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <div className="text-sm text-ink-muted mt-2">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex gap-0.5 w-20">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          size={12}
                          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-ink-muted w-8">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Reviews List */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare size={48} className="mx-auto mb-4 text-ink-faint" />
            <h2 className="text-xl font-semibold text-ink mb-2">No reviews yet</h2>
            <p className="text-ink-muted">Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-surface rounded-2xl border border-line p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: brandColor }}>
                      {review.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-ink">{review.clientName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star
                              key={i}
                              size={14}
                              className={i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-ink-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Shield size={12} />
                      Verified
                    </div>
                  )}
                </div>
                <p className="text-ink leading-relaxed mb-4">{review.text}</p>
                {review.agencyReply && (
                  <div className="mt-4 pl-4 border-l-2 border-line">
                    <div className="text-sm font-semibold text-ink mb-1">Response from {state.workspace?.name}</div>
                    <p className="text-sm text-ink-muted">{review.agencyReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Embed Badge Section */}
        <div className="mt-12 bg-surface rounded-2xl border border-line p-6">
          <h2 className="text-lg font-semibold text-ink mb-2">Embed this badge on your website</h2>
          <p className="text-sm text-ink-muted mb-4">Show off your verified reviews with a simple embed code.</p>
          <div className="bg-canvas rounded-xl p-4 font-mono text-xs text-ink overflow-x-auto">
            {`<iframe src="https://clientertap.com/r/${slug}/badge" width="300" height="150" frameborder="0"></iframe>`}
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`<iframe src="https://clientertap.com/r/${slug}/badge" width="300" height="150" frameborder="0"></iframe>`);
              alert('Embed code copied!');
            }}
            className="mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl flex items-center gap-2"
          >
            <Copy size={14} />
            Copy embed code
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-ink-muted">
          Reviews powered by <span className="font-semibold" style={{ color: brandColor }}>ClienterTap</span>
        </div>
      </footer>
    </div>
  );
}

// Growth Settings Page (White Label, Custom Domain, Marketplace, Integrations)
export function GrowthSettingsPage() {
  const state = useAppState();
  const [tab, setTab] = useState<'whitelabel' | 'domain' | 'marketplace' | 'integrations'>('whitelabel');

  const isUltra = state.workspace?.plan === 'ultra';

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Growth</h1>
        <p className="text-ink-muted text-sm">White label, custom domain, marketplace, and integrations</p>
      </div>

      <div className="flex border-b border-line overflow-x-auto">
        <button 
          onClick={() => setTab('whitelabel')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap flex items-center gap-2 ${tab === 'whitelabel' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}
        >
          <Palette size={16} /> White Label
        </button>
        <button 
          onClick={() => setTab('domain')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap flex items-center gap-2 ${tab === 'domain' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}
        >
          <Globe size={16} /> Custom Domain
        </button>
        <button 
          onClick={() => setTab('marketplace')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap flex items-center gap-2 ${tab === 'marketplace' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}
        >
          <Briefcase size={16} /> Marketplace
        </button>
        <button 
          onClick={() => setTab('integrations')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap flex items-center gap-2 ${tab === 'integrations' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted'}`}
        >
          <Zap size={16} /> Integrations
        </button>
      </div>

      {tab === 'whitelabel' && <WhiteLabelSettings isUltra={isUltra} />}
      {tab === 'domain' && <CustomDomainSettings isUltra={isUltra} />}
      {tab === 'marketplace' && <MarketplaceSettings />}
      {tab === 'integrations' && <IntegrationsSettings isUltra={isUltra} />}
    </div>
  );
}

// White Label Settings
function WhiteLabelSettings({ isUltra }: { isUltra: boolean }) {
  const state = useAppState();
  const [brandColor, setBrandColor] = useState(state.workspace?.whiteLabel?.brandColor || state.workspace?.brandColor || '#ea580c');
  const [companyName, setCompanyName] = useState(state.workspace?.whiteLabel?.companyName || state.workspace?.name || '');
  const [hidePoweredBy, setHidePoweredBy] = useState(state.workspace?.whiteLabel?.hidePoweredBy || false);

  if (!isUltra) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-8 text-center">
        <Palette size={48} className="mx-auto mb-4 text-ink-faint" />
        <h2 className="text-xl font-semibold text-ink mb-2">White Label</h2>
        <p className="text-ink-muted mb-4">Customize the app with your brand colors and remove ClienterTap branding.</p>
        <button 
          onClick={() => actions.changePlan('ultra')}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
        >
          Upgrade to Ultra — $39/mo
        </button>
      </div>
    );
  }

  const handleSave = () => {
    actions.updateWhiteLabel({
      brandColor,
      companyName,
      hidePoweredBy
    });
    alert('White label settings saved!');
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-2xl border border-line p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Brand Color</h2>
        <div className="flex items-center gap-4">
          <input 
            type="color" 
            value={brandColor}
            onChange={e => setBrandColor(e.target.value)}
            className="w-16 h-16 rounded-xl border border-line cursor-pointer"
          />
          <div className="flex-1">
            <input 
              type="text"
              value={brandColor}
              onChange={e => setBrandColor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink font-mono"
            />
            <p className="text-xs text-ink-muted mt-1">This color will be used throughout the app, portal, and invoices.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-2">
          {['#ea580c', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'].map(color => (
            <button
              key={color}
              onClick={() => setBrandColor(color)}
              className="h-10 rounded-xl border-2 border-line hover:border-ink-muted transition-colors"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-line p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Company Name</h2>
        <input 
          type="text"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink"
          placeholder="Your Agency Name"
        />
        <p className="text-xs text-ink-muted mt-1">Displayed in the portal, invoices, and emails.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-line p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Branding Removal</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox"
            checked={hidePoweredBy}
            onChange={e => setHidePoweredBy(e.target.checked)}
            className="w-5 h-5 rounded border-line text-primary-600 focus:ring-primary-500"
          />
          <div>
            <div className="text-sm font-medium text-ink">Hide "Powered by ClienterTap"</div>
            <div className="text-xs text-ink-muted">Remove ClienterTap branding from portal footer and emails.</div>
          </div>
        </label>
      </div>

      <button 
        onClick={handleSave}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
      >
        Save White Label Settings
      </button>
    </div>
  );
}

// Custom Domain Settings
function CustomDomainSettings({ isUltra }: { isUltra: boolean }) {
  const state = useAppState();
  const [domain, setDomain] = useState('');
  const customDomain = state.workspace?.customDomain;

  if (!isUltra) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-8 text-center">
        <Globe size={48} className="mx-auto mb-4 text-ink-faint" />
        <h2 className="text-xl font-semibold text-ink mb-2">Custom Domain</h2>
        <p className="text-ink-muted mb-4">Use your own domain for the client portal (e.g., portal.youragency.com).</p>
        <button 
          onClick={() => actions.changePlan('ultra')}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
        >
          Upgrade to Ultra — $39/mo
        </button>
      </div>
    );
  }

  const handleAddDomain = () => {
    if (!domain.trim()) return;
    const result = actions.addCustomDomain(domain);
    if ((result as any).error) {
      alert((result as any).error);
    } else {
      setDomain('');
      alert('Domain added! Please configure DNS records.');
    }
  };

  const handleVerify = () => {
    const result = actions.verifyCustomDomain();
    if ((result as any).success) {
      alert('Domain verified successfully!');
    }
  };

  const handleRemove = () => {
    if (confirm('Remove custom domain?')) {
      actions.removeCustomDomain();
    }
  };

  return (
    <div className="space-y-4">
      {!customDomain ? (
        <div className="bg-surface rounded-2xl border border-line p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Add Custom Domain</h2>
          <div className="flex gap-2">
            <input 
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="portal.youragency.com"
              className="flex-1 px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink"
            />
            <button 
              onClick={handleAddDomain}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
            >
              Add Domain
            </button>
          </div>
          <p className="text-xs text-ink-muted mt-2">Enter the domain you want to use for your client portal.</p>
        </div>
      ) : (
        <>
          <div className="bg-surface rounded-2xl border border-line p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">{customDomain.domain}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    customDomain.status === 'active' ? 'bg-green-50 text-green-700' :
                    customDomain.status === 'verified' ? 'bg-blue-50 text-blue-700' :
                    customDomain.status === 'failed' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {customDomain.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    customDomain.sslStatus === 'active' ? 'bg-green-50 text-green-700' :
                    customDomain.sslStatus === 'failed' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    SSL: {customDomain.sslStatus}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleRemove}
                className="px-3 py-1.5 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50"
              >
                Remove
              </button>
            </div>

            {customDomain.status !== 'active' && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-ink mb-2">DNS Configuration</h3>
                <p className="text-xs text-ink-muted mb-3">Add these records to your DNS provider:</p>
                <div className="space-y-2">
                  {customDomain.dnsRecords.map((record, idx) => (
                    <div key={idx} className="bg-canvas rounded-xl p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-xs text-ink-muted">Type: {record.type}</div>
                        <div className="text-sm font-mono text-ink">{record.name}</div>
                        <div className="text-xs font-mono text-ink-muted">{record.value}</div>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(record.value);
                          alert('Copied!');
                        }}
                        className="p-2 hover:bg-surface rounded-lg"
                      >
                        <Copy size={14} className="text-ink-muted" />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleVerify}
                  className="mt-4 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Verify Domain
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Marketplace Settings
function MarketplaceSettings() {
  const state = useAppState();
  const profile = state.workspace?.marketplaceProfile;
  const [form, setForm] = useState({
    tagline: profile?.tagline || '',
    description: profile?.description || '',
    services: profile?.services || [],
    location: profile?.location || '',
    website: profile?.website || '',
    isListed: profile?.isListed || false
  });

  const serviceOptions = ['Web Design', 'Branding', 'Marketing', 'Development', 'SEO', 'Social Media', 'Content', 'Photography', 'Video', 'Other'];

  const handleSave = () => {
    actions.updateMarketplaceProfile(form);
    alert('Marketplace profile saved!');
  };

  const toggleService = (service: string) => {
    setForm({
      ...form,
      services: form.services.includes(service)
        ? form.services.filter(s => s !== service)
        : [...form.services, service]
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-2xl border border-line p-6">
        <h2 className="text-lg font-semibold text-ink mb-4">Marketplace Profile</h2>
        <p className="text-sm text-ink-muted mb-4">
          List your agency on the ClienterTap marketplace to get discovered by potential clients.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Tagline</label>
            <input 
              type="text"
              value={form.tagline}
              onChange={e => setForm({...form, tagline: e.target.value})}
              placeholder="Short description of your agency"
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Description</label>
            <textarea 
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Tell potential clients about your agency..."
              rows={4}
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Services</label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map(service => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.services.includes(service)
                      ? 'bg-primary-600 text-white'
                      : 'bg-canvas text-ink-muted border border-line hover:bg-surface'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Location</label>
            <input 
              type="text"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              placeholder="City, Country"
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Website</label>
            <input 
              type="url"
              value={form.website}
              onChange={e => setForm({...form, website: e.target.value})}
              placeholder="https://youragency.com"
              className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox"
              checked={form.isListed}
              onChange={e => setForm({...form, isListed: e.target.checked})}
              className="w-5 h-5 rounded border-line text-primary-600 focus:ring-primary-500"
            />
            <div>
              <div className="text-sm font-medium text-ink">List on marketplace</div>
              <div className="text-xs text-ink-muted">Make your agency visible to potential clients.</div>
            </div>
          </label>
        </div>

        <button 
          onClick={handleSave}
          className="mt-6 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
        >
          Save Profile
        </button>
      </div>

      {state.marketplaceEnquiries.length > 0 && (
        <div className="bg-surface rounded-2xl border border-line p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Marketplace Enquiries</h2>
          <div className="space-y-3">
            {state.marketplaceEnquiries.map(enquiry => (
              <div key={enquiry.id} className="bg-canvas rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-ink">{enquiry.fromName}</div>
                    <div className="text-xs text-ink-muted">{enquiry.fromCompany}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    enquiry.status === 'new' ? 'bg-blue-50 text-blue-700' :
                    enquiry.status === 'contacted' ? 'bg-amber-50 text-amber-700' :
                    enquiry.status === 'qualified' ? 'bg-green-50 text-green-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {enquiry.status}
                  </span>
                </div>
                <p className="text-sm text-ink mb-2">{enquiry.message}</p>
                <div className="text-xs text-ink-muted">
                  {enquiry.fromEmail} • {new Date(enquiry.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Integrations Settings
function IntegrationsSettings({ isUltra }: { isUltra: boolean }) {
  const state = useAppState();
  const [showConnect, setShowConnect] = useState<IntegrationType | null>(null);

  if (!isUltra) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-8 text-center">
        <Zap size={48} className="mx-auto mb-4 text-ink-faint" />
        <h2 className="text-xl font-semibold text-ink mb-2">Lead Integrations</h2>
        <p className="text-ink-muted mb-4">Automatically import leads from Meta, Google Ads, IndiaMART, and custom webhooks.</p>
        <button 
          onClick={() => actions.changePlan('ultra')}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
        >
          Upgrade to Ultra — $39/mo
        </button>
      </div>
    );
  }

  const integrationTypes: { type: IntegrationType; name: string; icon: any; description: string }[] = [
    { type: 'meta', name: 'Meta Lead Ads', icon: Facebook, description: 'Import leads from Facebook and Instagram ads' },
    { type: 'google_ads', name: 'Google Ads', icon: Target, description: 'Import leads from Google Ads lead forms' },
    { type: 'indiamart', name: 'IndiaMART', icon: Briefcase, description: 'Import leads from IndiaMART enquiries' },
    { type: 'webhook', name: 'Webhook', icon: Webhook, description: 'Custom webhook for any integration' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {integrationTypes.map(({ type, name, icon: Icon, description }) => {
          const integration = state.integrations.find(i => i.type === type);
          const isConnected = !!integration;

          return (
            <div key={type} className="bg-surface rounded-2xl border border-line p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Icon size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{name}</h3>
                    <p className="text-xs text-ink-muted">{description}</p>
                  </div>
                </div>
                {isConnected && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                    Connected
                  </span>
                )}
              </div>

              {isConnected ? (
                <div className="space-y-3">
                  {integration?.type === 'webhook' && (
                    <div className="bg-canvas rounded-xl p-3">
                      <div className="text-xs text-ink-muted mb-1">Webhook URL</div>
                      <div className="text-xs font-mono text-ink break-all">{integration?.webhookUrl}</div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(integration?.webhookUrl || '');
                          alert('Webhook URL copied!');
                        }}
                        className="mt-2 text-xs text-primary-600 font-medium flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                  )}
                  {integration?.lastSyncAt && (
                    <div className="text-xs text-ink-muted">
                      Last sync: {new Date(integration.lastSyncAt).toLocaleString()}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {integration?.type === 'webhook' && (
                      <button 
                        onClick={() => {
                          const result = actions.testWebhook(integration.id);
                          if ((result as any).success) {
                            alert('Test webhook sent!');
                          }
                        }}
                        className="flex-1 py-2 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas flex items-center justify-center gap-2"
                      >
                        <Send size={14} /> Test
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (confirm('Disconnect integration?')) {
                          actions.disconnectIntegration(integration!.id);
                        }
                      }}
                      className="flex-1 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} /> Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConnect(type)}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showConnect && (
        <ConnectIntegrationModal 
          type={showConnect} 
          onClose={() => setShowConnect(null)} 
        />
      )}
    </div>
  );
}

// Connect Integration Modal
function ConnectIntegrationModal({ type, onClose }: { type: IntegrationType; onClose: () => void }) {
  const [config, setConfig] = useState<Record<string, any>>({});

  const handleConnect = () => {
    const result = actions.connectIntegration(type, config);
    if ((result as any).success) {
      onClose();
      alert('Integration connected!');
    } else {
      alert((result as any).error);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'meta':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Page Access Token</label>
              <input 
                type="text"
                value={config.accessToken || ''}
                onChange={e => setConfig({...config, accessToken: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink font-mono"
                placeholder="EAAB..."
              />
              <p className="text-xs text-ink-muted mt-1">Get this from Facebook Developer Console.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Page ID</label>
              <input 
                type="text"
                value={config.pageId || ''}
                onChange={e => setConfig({...config, pageId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink font-mono"
                placeholder="123456789"
              />
            </div>
          </>
        );
      case 'google_ads':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Developer Token</label>
              <input 
                type="text"
                value={config.developerToken || ''}
                onChange={e => setConfig({...config, developerToken: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Customer ID</label>
              <input 
                type="text"
                value={config.customerId || ''}
                onChange={e => setConfig({...config, customerId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink font-mono"
                placeholder="123-456-7890"
              />
            </div>
          </>
        );
      case 'indiamart':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">API Key</label>
              <input 
                type="text"
                value={config.apiKey || ''}
                onChange={e => setConfig({...config, apiKey: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-line bg-canvas text-sm text-ink font-mono"
              />
              <p className="text-xs text-ink-muted mt-1">Get this from IndiaMART CRM settings.</p>
            </div>
          </>
        );
      case 'webhook':
        return (
          <div className="bg-canvas rounded-xl p-4">
            <p className="text-sm text-ink mb-2">
              A unique webhook URL will be generated for you. Use this URL to send POST requests with lead data.
            </p>
            <p className="text-xs text-ink-muted">
              Expected JSON format: {"{"}"name": "...", "email": "...", "phone": "...", "message": "..."{"}"}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-soft-lg border border-line">
        <div className="border-b border-line p-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">
            Connect {type === 'meta' ? 'Meta Lead Ads' : type === 'google_ads' ? 'Google Ads' : type === 'indiamart' ? 'IndiaMART' : 'Webhook'}
          </h2>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          {renderFields()}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 border border-line rounded-xl text-sm font-medium text-ink hover:bg-canvas">Cancel</button>
            <button onClick={handleConnect} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );
}
