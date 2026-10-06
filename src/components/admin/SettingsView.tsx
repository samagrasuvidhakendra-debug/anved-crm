import React, { useState } from 'react';
import {
  Settings,
  Save,
  Building,
  Percent,
  FileCheck,
  Shield,
  Sparkles,
  Moon,
  Sun,
  Palette,
  Check,
  UserCog,
  Phone,
  Mail,
  Camera,
  Edit3,
  KeyRound,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { QuotationDefaultsEditor } from './QuotationDefaultsEditor';
import { EditProfileModal } from '../modals/EditProfileModal';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { currentUser, theme, setTheme } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [companyName, setCompanyName] = useState('ACS SOLAR INDIA PRIVATE LIMITED');
  const [supportEmail, setSupportEmail] = useState('franchise-ops@acssolar.in');
  const [supportPhone, setSupportPhone] = useState('+91 80000 12345');
  const [compositeGst, setCompositeGst] = useState('13.8');
  const [quotationValidity, setQuotationValidity] = useState('15');
  const [mnreSubsidyEnabled, setMnreSubsidyEnabled] = useState(true);
  const [aiAssistantModel, setAiAssistantModel] = useState('gemini-3.6-flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-view" className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" /> Platform & Regulatory Settings
          </h1>
          <p className="text-xs text-slate-400">
            Global tax rules, quotation terms, user display preferences and system parameters
          </p>
        </div>
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            Settings updated successfully!
          </span>
        )}
      </div>

      {/* Franchise Owner Profile & Identity Management */}
      <div id="user-profile-settings-section" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCog className="w-4 h-4 text-amber-400" /> Franchise Owner Profile & Contact Details
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Authority to modify your display name, corporate mobile numbers, email, and executive avatar photo.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              id="settings-open-change-password-btn"
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Password</span>
            </button>
            <button
              type="button"
              id="settings-open-edit-profile-modal-btn"
              onClick={() => setIsEditProfileOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Modify Profile & Photo</span>
            </button>
          </div>
        </div>

        {/* Profile Details Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow"
              />
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow hover:bg-amber-300"
                title="Change Photo"
              >
                <Camera className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 font-medium block">Owner Full Name</span>
              <span className="text-xs font-bold text-white truncate block">{currentUser?.name}</span>
              <span className="text-[9px] text-amber-400 font-semibold uppercase">{currentUser?.role?.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 font-medium block">Primary Mobile</span>
              <span className="text-xs font-bold text-emerald-400 font-mono truncate block">
                {currentUser?.mobile || '+91 98000 00000'}
              </span>
              {currentUser?.alternateMobile && (
                <span className="text-[10px] text-slate-400 font-mono truncate block">
                  Alt: {currentUser.alternateMobile}
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 font-medium block">Corporate Email</span>
              <span className="text-xs font-bold text-white truncate block">
                {currentUser?.email || 'owner@acssolar.in'}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                {currentUser?.franchiseName || 'ACS Solar Territory'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-medium block">Password Status</span>
                <span className="text-xs font-mono font-bold text-white tracking-widest block">••••••••</span>
                <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Protected
                </span>
              </div>
            </div>
            <button
              type="button"
              id="settings-card-change-password-btn"
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* User-Specific Theme & Visual Display Preferences */}
      <div id="user-theme-settings-section" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" /> User Theme & Visual Mode
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Switch between Dark and Light display modes globally. Saved specifically for your user profile.
            </p>
          </div>
          {/* Active User Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
            <img
              src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
            />
            <div className="text-left">
              <div className="text-[10px] font-bold text-white leading-none">{currentUser?.name}</div>
              <div className="text-[9px] text-amber-400 font-medium leading-none mt-0.5">
                {currentUser?.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Toggle Switch Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Current Display Theme:</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                theme === 'dark'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              User preference for <strong className="text-slate-200">{currentUser?.name}</strong>. Automatically applied across all dashboard tabs, quotation previews, and CRM views.
            </p>
          </div>

          {/* Segmented Pill Toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <button
              type="button"
              id="theme-toggle-dark-btn"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              id="theme-toggle-light-btn"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Side-by-side Theme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Dark Card */}
          <div
            id="theme-card-dark"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
              theme === 'dark'
                ? 'border-amber-400 bg-slate-950/90 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/20'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70 opacity-70 hover:opacity-100'
            }`}
          >
            {theme === 'dark' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Dark Mode
                  <span className="text-[9px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    Solar Night
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Deep slate canvas with solar gold highlights</p>
              </div>
            </div>

            {/* Visual Preview Graphic */}
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-2.5 space-y-1.5 pointer-events-none">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[9px] text-slate-400 font-mono">
                <span className="text-amber-400 font-bold">ACS SOLAR</span>
                <span>Dashboard Preview</span>
              </div>
              <div className="flex gap-1.5">
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5">
                  <div className="w-8 h-1.5 bg-amber-400/80 rounded mb-1" />
                  <div className="w-12 h-1 bg-slate-700 rounded" />
                </div>
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5">
                  <div className="w-6 h-1.5 bg-emerald-400/80 rounded mb-1" />
                  <div className="w-10 h-1 bg-slate-700 rounded" />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed">
              Reduced eye fatigue in dim environments. Conserves battery on OLED mobile devices.
            </p>
          </div>

          {/* Light Card */}
          <div
            id="theme-card-light"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
              theme === 'light'
                ? 'border-amber-500 bg-slate-950/90 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70 opacity-70 hover:opacity-100'
            }`}
          >
            {theme === 'light' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Light Mode
                  <span className="text-[9px] font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Daylight White
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">High-contrast bright canvas for daytime operations</p>
              </div>
            </div>

            {/* Visual Preview Graphic */}
            <div className="rounded-lg bg-slate-100 border border-slate-300 p-2.5 space-y-1.5 pointer-events-none text-slate-800">
              <div className="flex items-center justify-between pb-1 border-b border-slate-300 text-[9px] text-slate-600 font-mono">
                <span className="text-amber-600 font-bold">ACS SOLAR</span>
                <span>Dashboard Preview</span>
              </div>
              <div className="flex gap-1.5">
                <div className="flex-1 bg-white border border-slate-300 rounded p-1.5 shadow-xs">
                  <div className="w-8 h-1.5 bg-amber-500 rounded mb-1" />
                  <div className="w-12 h-1 bg-slate-300 rounded" />
                </div>
                <div className="flex-1 bg-white border border-slate-300 rounded p-1.5 shadow-xs">
                  <div className="w-6 h-1.5 bg-emerald-600 rounded mb-1" />
                  <div className="w-10 h-1 bg-slate-300 rounded" />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed">
              Maximum visibility under bright sunlight for outdoor site surveys, rooftop checks, and quotation prints.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant real-time global switching • Saved to your profile</span>
          </span>
          <span className="text-[10px] text-slate-500">
            User ID: <code className="text-slate-400">{currentUser?.id}</code>
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Company Legal Profile */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" /> ACS SOLAR Corporate Entity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Registered Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Central Operations Helpline</label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Franchise Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Default Quotation Validity (Days)</label>
              <input
                type="number"
                value={quotationValidity}
                onChange={e => setQuotationValidity(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Taxation & Discom EPC Rules */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-400" /> Taxation & Solar Net-Metering Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Composite Solar GST Rate (% on Turnkey EPC)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={compositeGst}
                  onChange={e => setCompositeGst(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                As per Indian GST Council: 70% Goods @ 12% + 30% Services @ 18% = 13.8% composite rate.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                PM Surya Ghar Muft Bijli Yojana Subsidy Calculations
              </label>
              <select
                value={mnreSubsidyEnabled ? 'enabled' : 'disabled'}
                onChange={e => setMnreSubsidyEnabled(e.target.value === 'enabled')}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="enabled">Auto-calculate Central Government Subsidy (₹30,000 to ₹78,000)</option>
                <option value="disabled">Disable automated subsidy deduction</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Assistant Architecture */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> ACS SOLAR AI Engine
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Server LLM Engine</label>
              <select
                value={aiAssistantModel}
                onChange={e => setAiAssistantModel(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (Ultra-fast, Real-time)</option>
                <option value="gemini-3.6-pro">Gemini 3.6 Pro (Deep Analytics)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Security Isolation Enforcer</label>
              <input
                type="text"
                disabled
                value="Strict Multi-Tenant Backend Isolation (Active)"
                className="w-full p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-emerald-400 font-semibold cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>

      <QuotationDefaultsEditor />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};
