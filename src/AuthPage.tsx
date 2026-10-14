import { useState, useEffect } from 'react';
import { actions } from './lib/store';
import { Mail, Lock, User, Building2, Globe, CheckCircle2, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [country, setCountry] = useState('IN');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // UTM tracking
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');

  // Capture UTM parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmSource(params.get('utm_source') || '');
    setUtmMedium(params.get('utm_medium') || '');
    setUtmCampaign(params.get('utm_campaign') || '');
  }, []);

  // Auto-generate slug from workspace name
  useEffect(() => {
    if (workspaceName && !slug) {
      const generatedSlug = workspaceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [workspaceName]);

  // Check slug availability (debounced)
  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    const timer = setTimeout(() => {
      // Simulate availability check (in production would call API)
      const taken = ['admin', 'clientertap', 'demo', 'test'];
      setSlugAvailable(!taken.includes(slug.toLowerCase()));
      setCheckingSlug(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    
    if (strength <= 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (strength <= 4) return { level: 'medium', color: 'bg-amber-500', text: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Accept any email/password for demo (simulates real auth)
    // In production, this would validate against the backend
    if (loginEmail && loginPassword) {
      actions.login(loginEmail, loginPassword);
      onAuth();
    } else {
      alert('Please enter both email and password');
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      alert('Please agree to the Terms and Privacy Policy');
      return;
    }

    if (!slugAvailable) {
      alert('Please choose a different workspace slug');
      return;
    }

    if (passwordStrength.level === 'weak') {
      alert('Please choose a stronger password');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create account
    actions.signup({
      name,
      email,
      password,
      workspaceName,
      slug,
      country,
      utmSource,
      utmMedium,
      utmCampaign
    });
    
    onAuth();
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    // Simulate Google OAuth flow
    // In production, this would redirect to Google OAuth consent screen
    // For demo, we simulate a successful Google login
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate Google user data
    const googleUser = {
      name: 'Google User',
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
      picture: `https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff`
    };
    
    // Check if this is login or signup mode
    if (mode === 'login') {
      // For login, just log in with the Google user
      actions.login(googleUser.email, 'google-oauth-token');
      onAuth();
    } else {
      // For signup, create a new workspace with Google user data
      const workspaceName = `${googleUser.name}'s Workspace`;
      const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      actions.signup({
        name: googleUser.name,
        email: googleUser.email,
        workspaceName,
        slug,
        country: 'US',
        utmSource,
        utmMedium,
        utmCampaign
      });
      
      onAuth();
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            {mode === 'login' ? 'Welcome back' : 'Start your free workspace'}
          </h1>
          <p className="text-ink-muted">
            {mode === 'login' 
              ? 'Sign in to manage your clients' 
              : 'No credit card required. Free forever.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-surface rounded-2xl border border-line p-8 shadow-soft">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                mode === 'login'
                  ? 'bg-primary-600 text-white shadow-ember'
                  : 'bg-canvas text-ink-muted hover:bg-gray-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-primary-600 text-white shadow-ember'
                  : 'bg-canvas text-ink-muted hover:bg-gray-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full mb-4 py-3 border border-line rounded-xl font-medium text-ink hover:bg-canvas transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-ink-muted">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-line text-primary-600 focus:ring-primary-500" />
                  <span className="text-ink-muted">Remember me</span>
                </label>
                <a href="#forgot" className="text-primary-600 hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-ember transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="text-center text-sm text-ink-muted">
                💡 Enter any email and password to sign in (demo mode)
              </div>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      <div className={`h-1 flex-1 rounded-full ${passwordStrength.level === 'weak' ? 'bg-red-500' : passwordStrength.level === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${passwordStrength.level === 'medium' || passwordStrength.level === 'strong' ? (passwordStrength.level === 'medium' ? 'bg-amber-500' : 'bg-green-500') : 'bg-gray-200'}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${passwordStrength.level === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className="text-xs text-ink-muted">Password strength: <span className={`font-medium ${passwordStrength.level === 'weak' ? 'text-red-600' : passwordStrength.level === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>{passwordStrength.text}</span></div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Workspace Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="My Agency"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Workspace URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={18} />
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    required
                    className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="my-agency"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {checkingSlug && <Loader2 size={16} className="animate-spin text-ink-faint" />}
                    {!checkingSlug && slugAvailable === true && <CheckCircle2 size={16} className="text-green-600" />}
                    {!checkingSlug && slugAvailable === false && <XCircle size={16} className="text-red-600" />}
                    <span className="text-sm text-ink-faint">.clientertap.com</span>
                  </div>
                </div>
                {slugAvailable === false && (
                  <p className="text-xs text-red-600 mt-1">This URL is already taken. Please choose another.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-line bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="SG">Singapore</option>
                  <option value="AE">United Arab Emirates</option>
                </select>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-line text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-ink-muted">
                  I agree to the{' '}
                  <a href="#terms" className="text-primary-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !slugAvailable || passwordStrength.level === 'weak'}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-ember transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating workspace...
                  </>
                ) : (
                  'Create Workspace'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-ink-muted">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-primary-600 hover:underline font-medium">
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-primary-600 hover:underline font-medium">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
