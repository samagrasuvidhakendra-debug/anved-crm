import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  AlertCircle,
  HelpCircle,
  Building,
  KeyRound,
  RotateCcw,
  Zap,
  Check
} from 'lucide-react';
import { SolarPanelIcon } from '../common/SolarPanelIcon';
import { AppLogo } from '../common/AppLogo';

interface LoginScreenProps {
  isMobileFrame?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ isMobileFrame = true }) => {
  const { login, allUsers } = useApp();

  const [authMode, setAuthMode] = useState<'password' | 'otp' | 'roles'>('password');
  const [identifier, setIdentifier] = useState('mumbai@acssolar.in');
  const [password, setPassword] = useState('solar');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Mobile OTP state
  const [otpMobile, setOtpMobile] = useState('+91 98201 44552');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResetSuccess(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or registered mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(identifier, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 450);
  };

  const handleSendOtp = () => {
    setErrorMessage(null);
    if (!otpMobile.trim()) {
      setErrorMessage('Please enter your 10-digit mobile number.');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpCode(code); // Pre-fill for instant test convenience
    setOtpSentNotice(`[SMS SIMULATOR] ACS Solar Security: Your OTP is ${code}. Valid for 10 minutes.`);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResetSuccess(null);

    if (!otpMobile.trim() || !otpCode.trim()) {
      setErrorMessage('Please enter mobile number and the 4-digit OTP.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(otpMobile, undefined, otpCode);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid OTP code.');
      }
    }, 450);
  };

  const handleDirectRoleLogin = (userId: string) => {
    setErrorMessage(null);
    setResetSuccess(null);
    setIsLoading(true);
    setTimeout(() => {
      const targetUser = allUsers.find(u => u.id === userId);
      if (targetUser) {
        const result = login(targetUser.email, targetUser.password || 'solar');
        setIsLoading(false);
        if (!result.success) {
          setErrorMessage(result.error || 'Could not log in with selected role.');
        }
      } else {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleForgotPassword = () => {
    if (!identifier.trim()) {
      setErrorMessage('Enter your email or mobile in the input above first.');
      return;
    }
    setErrorMessage(null);
    setResetSuccess(`Password reset link and temporary login code dispatched to ${identifier}.`);
    setTimeout(() => setResetSuccess(null), 8000);
  };

  return (
    <div
      id="acs-login-screen"
      className="w-full h-full flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950 text-slate-100"
    >
      <div className="w-full max-w-5xl my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Branding & Highlights Panel (shown on large screens or compact on mobile) */}
        {!isMobileFrame && (
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Brand mark with AppLogo */}
              <div className="flex items-center gap-3">
                <AppLogo size="xl" showText={true} subtitle="Powering Businesses. Empowering Solar." />
              </div>

              <div className="space-y-3 pt-2">
                <h2 className="text-xl font-bold text-white leading-snug">
                  Unified Cloud OS for Solar EPC Franchises & Field Operations
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seamless multi-tenant infrastructure connecting Headquarters Super Admins, Franchise Owners, Field Sales, Site Surveyors, and Installation Engineers.
                </p>
              </div>

              {/* Solar Metrics Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Capacity</span>
                  </div>
                  <div className="text-lg font-extrabold text-white">14.8 MWp</div>
                  <div className="text-[10px] text-slate-400">Rooftop Solar Installed</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Efficiency</span>
                  </div>
                  <div className="text-lg font-extrabold text-white">99.8%</div>
                  <div className="text-[10px] text-slate-400">Real-time Field Sync</div>
                </div>
              </div>

              {/* Security features list */}
              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Role-Based Access Control (RBAC) & Tenant Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Offline-First Android PWA with Background Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Surya Ghar Muft Bijli Yojana & Subsidy Ready</span>
                </div>
              </div>
            </div>

            {/* Bottom assurance */}
            <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>ACS Solar Cloud Security</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Production Active
              </span>
            </div>
          </div>
        )}

        {/* Right Authentication Form Card */}
        <div
          className={`w-full ${
            isMobileFrame ? 'max-w-md mx-auto' : 'lg:col-span-7'
          } p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between`}
        >
          <div>
            {/* Header in Mobile Frame / Compact view */}
            <div className="flex items-center justify-between mb-5">
              <AppLogo size="md" showText={true} subtitle="Select mode or sign in below" />
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
              <button
                type="button"
                id="login-tab-password"
                onClick={() => {
                  setAuthMode('password');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'password'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
              <button
                type="button"
                id="login-tab-otp"
                onClick={() => {
                  setAuthMode('otp');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'otp'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile OTP</span>
              </button>
              <button
                type="button"
                id="login-tab-roles"
                onClick={() => {
                  setAuthMode('roles');
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'roles'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All Roles</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-tight">{errorMessage}</div>
              </div>
            )}

            {/* Reset Password Notification */}
            {resetSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-tight">{resetSuccess}</div>
              </div>
            )}

            {/* TAB 1: PASSWORD LOGIN */}
            {authMode === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Registered Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      id="login-identifier-input"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="e.g. mumbai@acssolar.in or 9820144552"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Admin: admin@acssolar.in • Franchise: mumbai@acssolar.in</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-300 font-semibold">Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-amber-400 hover:text-amber-300 underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Demo password: <code className="text-amber-400 font-mono">solar</code> (or{' '}
                    <code className="text-amber-400 font-mono">admin</code> for Super Admin)
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>Remember this device session</span>
                  </label>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating ACS Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to ACS Solar</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: MOBILE OTP LOGIN */}
            {authMode === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Field Engineer / Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        id="login-otp-mobile-input"
                        type="text"
                        value={otpMobile}
                        onChange={e => setOtpMobile(e.target.value)}
                        placeholder="+91 98201 44552"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400 font-bold text-xs shrink-0 transition-colors"
                    >
                      {generatedOtp ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {/* Simulated SMS notice */}
                {otpSentNotice && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">SMS Delivered (Simulator):</span>
                      <span>{otpSentNotice}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Enter 4-Digit Verification OTP
                  </label>
                  <input
                    id="login-otp-code-input"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="e.g. 1234"
                    required
                    className="w-full text-center tracking-[0.5em] font-mono text-base py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  id="login-otp-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Security Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP & Sign In</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: ONE-TAP QUICK ROLE SELECTION (ALL USERS) */}
            {authMode === 'roles' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Select any user profile to sign in instantly:</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {allUsers.length} Profiles Available
                  </span>
                </div>

                <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/40">
                  {allUsers.map(user => {
                    const isDisabled = user.status === 'disabled';
                    return (
                      <button
                        key={user.id}
                        id={`quick-login-${user.id}`}
                        type="button"
                        disabled={isDisabled || isLoading}
                        onClick={() => handleDirectRoleLogin(user.id)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          isDisabled
                            ? 'bg-slate-950/40 border-slate-800/40 opacity-40 cursor-not-allowed'
                            : 'bg-slate-950 hover:bg-slate-800/90 border-slate-800 hover:border-emerald-500/50'
                        }`}
                      >
                        <img
                          src={
                            user.profilePhoto ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                          }
                          alt={user.name}
                          className="w-9 h-9 rounded-xl object-cover border border-emerald-400/40 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{user.name}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                user.role === 'SUPER_ADMIN'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : user.role === 'FRANCHISE_OWNER'
                                  ? 'bg-sky-500/20 text-sky-300'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {user.role.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                            <span className="text-emerald-400">{user.email}</span>
                            {user.franchiseName && (
                              <span className="text-slate-500">• {user.franchiseName}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Security Badge */}
          <div className="pt-5 mt-5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted 256-bit Session</span>
            </div>
            <span className="text-slate-500">ACS Solar Portal v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
