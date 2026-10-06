import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  UserPlus,
  X,
  ShieldCheck,
  Phone,
  Mail,
  Briefcase,
  Target,
  Award,
  Key,
  Copy,
  Check,
  Share2,
  Building2,
  Sparkles
} from 'lucide-react';

interface AddSalesTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userName: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
];

export const AddSalesTeamModal: React.FC<AddSalesTeamModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, allFranchises, addUser, addAuditLog } = useApp();

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  // Determine current franchise for this user
  const initialFranchiseId = isSuperAdmin
    ? allFranchises[0]?.id || 'ACS-MH-01'
    : currentUser.franchiseId || 'ACS-MH-01';

  const [selectedFranchiseId, setSelectedFranchiseId] = useState(initialFranchiseId);

  const activeFranchise = allFranchises.find(f => f.id === selectedFranchiseId) || allFranchises[0];

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('SALES_EXECUTIVE');
  const [assignedTeam, setAssignedTeam] = useState('Direct Residential Sales');
  const [territoryBeat, setTerritoryBeat] = useState('Central City Zone');
  const [salesTargetKW, setSalesTargetKW] = useState<number>(30);
  const [monthlyTargetAmount, setMonthlyTargetAmount] = useState<number>(1500000);
  const [commissionRate, setCommissionRate] = useState('₹1,500 / kW installed');
  const [password, setPassword] = useState('solar123');
  const [profilePhoto, setProfilePhoto] = useState(PRESET_AVATARS[0]);
  const [showAllRoles, setShowAllRoles] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Please enter the full name.');
      return;
    }

    const cleanMobile = mobile.trim();
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setErrorMsg(null);

    const franchiseId = isSuperAdmin ? selectedFranchiseId : currentUser.franchiseId;
    const franchiseName = isSuperAdmin
      ? activeFranchise?.franchiseName || 'ACS Solar'
      : currentUser.franchiseName || activeFranchise?.franchiseName || 'ACS Solar';

    const formattedMobile = cleanMobile.startsWith('+91')
      ? cleanMobile
      : `+91 ${cleanMobile.replace(/\D/g, '')}`;

    const newUser = addUser({
      name: name.trim(),
      mobile: formattedMobile,
      email: email.trim().toLowerCase(),
      password: password || 'solar123',
      role,
      franchiseId,
      franchiseName,
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      profilePhoto,
      assignedTeam,
      salesTargetKW: Number(salesTargetKW) || 30,
      monthlyTargetAmount: Number(monthlyTargetAmount) || 1500000,
      commissionRate,
      territoryBeat,
      reportsToName: currentUser.name,
      reportsToRole: currentUser.role,
      addedByUserId: currentUser.id,
      addedByUserName: currentUser.name
    });

    addAuditLog(
      'Sales Team Member Added',
      'User',
      newUser.id,
      `Franchise Owner added ${newUser.name} as ${newUser.role} in ${franchiseName} (Target: ${newUser.salesTargetKW} kW)`
    );

    if (onSuccess) {
      onSuccess(newUser.name);
    }

    onClose();
  };

  const handleCopyInvite = () => {
    const inviteText = `*ACS Solar - Sales Team Invitation*\n\nHello ${name || 'Team Member'},\nYou have been onboarded as *${role.replace('_', ' ')}* at ACS Solar (${activeFranchise?.franchiseName || 'Franchise'}).\n\nLogin Credentials:\n• Portal: ${window.location.origin}\n• Mobile / Email: ${mobile || email || 'your contact'}\n• Default Password: ${password}\n• Monthly Quota: ${salesTargetKW} kW\n\nPlease log in and activate your sales portal!`;
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  return (
    <div
      id="add-sales-team-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col text-xs text-slate-300 my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-3 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Add Sales Team Member</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Owner Right
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Delegate sales pipeline, targets, and lead closing rights under your franchise
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Territory & Franchise Scope Banner */}
        <div className="px-4 sm:px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-amber-300/80 uppercase font-bold block">Assigned Franchise Territory</span>
              <span className="text-xs font-extrabold text-white truncate">
                {activeFranchise?.franchiseName} ({activeFranchise?.id || activeFranchise?.franchiseCode})
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-slate-900/90 text-amber-400 border border-amber-400/30 px-2 py-1 rounded-lg font-bold shrink-0">
            {isSuperAdmin ? 'HQ Admin Mode' : 'Franchise Locked'}
          </span>
        </div>

        {/* Super Admin Franchise Switcher if applicable */}
        {isSuperAdmin && (
          <div className="px-4 sm:px-5 py-2 border-b border-slate-800 bg-slate-950/40">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Select Franchise to Add Staff Into
            </label>
            <select
              value={selectedFranchiseId}
              onChange={e => setSelectedFranchiseId(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
            >
              {allFranchises.map(f => (
                <option key={f.id} value={f.id}>
                  {f.franchiseName} ({f.city}, {f.state})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Form Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="sales-team-form" onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Basic Info */}
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 block mb-2">
                1. Member Personal & Contact Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aakash Kulkarni"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Number (10 digits) *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="98230 11223"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="aakash.sales@acssolar.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Staff Avatar Photo</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProfilePhoto(url)}
                    className={`relative rounded-xl p-0.5 transition-transform ${
                      profilePhoto === url ? 'ring-2 ring-amber-400 scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${i + 1}`} className="w-10 h-10 rounded-lg object-cover" />
                    {profilePhoto === url && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sales Role & Team Alignment */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400">
                  2. Sales Designation & Department
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllRoles(!showAllRoles)}
                  className="text-[10px] text-slate-400 hover:text-amber-400 underline font-medium"
                >
                  {showAllRoles ? 'Show Sales Roles Only' : 'Show All Crew Roles'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setRole('OFFICE_SALES_TELECALLER');
                    setAssignedTeam('In-Office Telecalling & Inbound Desk');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'OFFICE_SALES_TELECALLER'
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">Office Sales / Telecaller</span>
                    {role === 'OFFICE_SALES_TELECALLER' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Layer 3: Inbound calls, tele-calling, lead qualification, phone quotations
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('FIELD_VISIT_TEAM');
                    setAssignedTeam('On-Ground Field Visit Team');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'FIELD_VISIT_TEAM'
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">Field Visiting Team</span>
                    {role === 'FIELD_VISIT_TEAM' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Layer 4: Physical site visits, live GPS tracking, doorstep consultation & closing
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('SALES_EXECUTIVE');
                    setAssignedTeam('Direct Residential Sales');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'SALES_EXECUTIVE'
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">Sales Executive</span>
                    {role === 'SALES_EXECUTIVE' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Frontline lead closing, rooftop consultation, customer follow-up
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('SALES_MANAGER');
                    setAssignedTeam('Commercial & Industrial Sales');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    role === 'SALES_MANAGER'
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">Sales Manager</span>
                    {role === 'SALES_MANAGER' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Pod leader, large C&I deals, quote approval & team quota
                  </p>
                </button>
              </div>

              {showAllRoles && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-3 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Other Franchise Crew:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRole('SITE_SURVEYOR')}
                      className={`p-2 rounded-lg text-[10px] font-bold border transition-colors ${
                        role === 'SITE_SURVEYOR'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Site Surveyor
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('INSTALLATION_TEAM')}
                      className={`p-2 rounded-lg text-[10px] font-bold border transition-colors ${
                        role === 'INSTALLATION_TEAM'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      EPC Installer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('ACCOUNT_STAFF')}
                      className={`p-2 rounded-lg text-[10px] font-bold border transition-colors ${
                        role === 'ACCOUNT_STAFF'
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Account Staff
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sales Unit / Department</label>
                  <select
                    value={assignedTeam}
                    onChange={e => setAssignedTeam(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Direct Residential Sales">Direct Residential Sales</option>
                    <option value="Commercial & Industrial Rooftop">Commercial & Industrial Rooftop</option>
                    <option value="Housing Societies & Apartments">Housing Societies & Apartments</option>
                    <option value="Government & Institutional">Government & Institutional</option>
                    <option value="Field Channel Partners">Field Channel Partners</option>
                    <option value="Inbound & Telecalling Desk">Inbound & Telecalling Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Territory Beat / Zone</label>
                  <input
                    type="text"
                    placeholder="e.g. Kothrud & Baner Zone"
                    value={territoryBeat}
                    onChange={e => setTerritoryBeat(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* 3. Sales Targets & Incentive Structure */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 block mb-2">
                3. Quota Delegation & Incentive Structure
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monthly Target (kW)</label>
                  <div className="relative">
                    <Target className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={salesTargetKW}
                      onChange={e => setSalesTargetKW(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Revenue (₹)</label>
                  <input
                    type="number"
                    step={50000}
                    value={monthlyTargetAmount}
                    onChange={e => setMonthlyTargetAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Commission Slab</label>
                  <input
                    type="text"
                    value={commissionRate}
                    onChange={e => setCommissionRate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* 4. Login Credentials */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 block mb-2">
                4. App Access & Initial Password
              </span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white">Default Login Password:</span>
                      <p className="text-[10px] text-slate-400">Can be reset by employee after first sign-in</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-32 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs font-bold text-center focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Invitation Link & Credentials:</span>
                  <button
                    type="button"
                    onClick={handleCopyInvite}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
                  >
                    {copiedInvite ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Invite Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="sales-team-form"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Sales Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};
