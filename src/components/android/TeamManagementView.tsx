import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, UserStatus } from '../../types';
import {
  Users,
  Phone,
  Mail,
  FolderGit2,
  TrendingUp,
  UserCheck,
  Search,
  Plus,
  Target,
  Award,
  MapPin,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Key,
  MessageSquare,
  Sparkles,
  UserPlus,
  Trash2,
  ShieldAlert,
  PlayCircle,
  PauseCircle,
  Navigation,
  Clock
} from 'lucide-react';
import { AddSalesTeamModal } from '../modals/AddSalesTeamModal';

interface TeamManagementViewProps {
  onOpenAddSalesModal?: () => void;
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = () => {
  const { allUsers, currentUser, leads, projects, attendanceRecords, updateUserStatus, deleteUser, addAuditLog } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'OFFICE_SALES' | 'FIELD_VISIT' | 'MANAGERS' | 'OTHER'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Franchise Owners and Super Admins have the explicit right to add sales teams
  const canAddSalesTeam =
    currentUser.role === 'FRANCHISE_OWNER' || currentUser.role === 'SUPER_ADMIN';

  // Only show staff from current franchise unless super admin
  const teamMembers = allUsers.filter(u =>
    currentUser.role === 'SUPER_ADMIN' ? true : u.franchiseId === currentUser.franchiseId
  );

  const officeSalesCount = teamMembers.filter(
    u => u.role === 'OFFICE_SALES_TELECALLER'
  ).length;

  const fieldVisitCount = teamMembers.filter(
    u => u.role === 'FIELD_VISIT_TEAM' || u.role === 'SALES_EXECUTIVE' || u.role === 'SITE_SURVEYOR'
  ).length;

  const managersCount = teamMembers.filter(
    u => u.role === 'SALES_MANAGER' || u.role === 'FRANCHISE_OWNER'
  ).length;

  const otherCount = teamMembers.filter(
    u => u.role === 'INSTALLATION_TEAM' || u.role === 'ACCOUNT_STAFF'
  ).length;

  const filteredTeam = teamMembers.filter(m => {
    const matchesSearch =
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.mobile || '').includes(search) ||
      (m.territoryBeat || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.assignedTeam || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'OFFICE_SALES') {
      return m.role === 'OFFICE_SALES_TELECALLER';
    }
    if (activeTab === 'FIELD_VISIT') {
      return m.role === 'FIELD_VISIT_TEAM' || m.role === 'SALES_EXECUTIVE' || m.role === 'SITE_SURVEYOR';
    }
    if (activeTab === 'MANAGERS') {
      return m.role === 'SALES_MANAGER' || m.role === 'FRANCHISE_OWNER';
    }
    if (activeTab === 'OTHER') {
      return m.role === 'INSTALLATION_TEAM' || m.role === 'ACCOUNT_STAFF';
    }
    return true;
  });

  const handleToggleStatus = (member: User) => {
    if (!canAddSalesTeam) return;
    const newStatus: UserStatus = member.status === 'suspended' ? 'active' : 'suspended';
    updateUserStatus(member.id, newStatus);
    setToastMessage(`Access for ${member.name} has been ${newStatus === 'active' ? 'reactivated' : 'suspended'}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetPassword = (member: User) => {
    setToastMessage(`Password reset OTP dispatched to ${member.mobile} & ${member.email}.`);
    setTimeout(() => setToastMessage(null), 5000);
    addAuditLog('Password Reset', 'User', member.id, `Franchise Owner triggered password reset for ${member.name}`);
  };

  return (
    <div id="team-management-view" className="p-3 sm:p-4 space-y-4 text-white max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Header with Prominent Add Sales Team CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white">Franchise Staff & Sales Force</h2>
            {canAddSalesTeam && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Franchise Owner Delegation Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {teamMembers.length} active staff deployed in {currentUser.franchiseName || 'Your Franchise'} • {officeSalesCount + fieldVisitCount} Field & Office Reps
          </p>
        </div>

        {/* Action Button for Franchise Owners */}
        {canAddSalesTeam && (
          <button
            id="franchise-add-sales-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Sales Team</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              activeTab === 'ALL'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Crew ({teamMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('OFFICE_SALES')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'OFFICE_SALES'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Office Sales & Telecaller ({officeSalesCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('FIELD_VISIT')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'FIELD_VISIT'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Field Visiting Team ({fieldVisitCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('MANAGERS')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'MANAGERS'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Leaders & Managers ({managersCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('OTHER')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              activeTab === 'OTHER'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            EPC & Tech ({otherCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, role, beat, sales unit, or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Team Cards Grid (Responsive 1 or 2 columns) */}
      {filteredTeam.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Team Members Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'OFFICE_SALES' || activeTab === 'FIELD_VISIT'
              ? 'You have not added any sales executives or field team members to this franchise yet.'
              : 'No staff match the selected filter or search keyword.'}
          </p>
          {canAddSalesTeam && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add First Sales Representative</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTeam.map(member => {
            const memberLeads = leads.filter(l => l.assignedStaffName === member.name);
            const memberProjects = projects.filter(
              p => (p.assignedInstallationLead || p.assignedTeam || '').includes(member.name)
            );

            const isSalesRole =
              member.role === 'SALES_EXECUTIVE' || member.role === 'SALES_MANAGER';

            return (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          member.profilePhoto ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-white truncate">{member.name}</h3>
                          {member.reportsToName && (
                            <span className="text-[9px] text-slate-400 font-medium hidden sm:inline truncate">
                              • By {member.reportsToName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider border ${
                              member.role === 'SALES_MANAGER'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : member.role === 'SALES_EXECUTIVE'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : member.role === 'FRANCHISE_OWNER'
                                ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {member.role.replace('_', ' ')}
                          </span>

                          <span className="text-[10px] text-slate-400 truncate">
                            {member.assignedTeam || 'Field Operations'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`tel:${member.mobile}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700 transition-colors"
                        title="Call staff"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/91${(member.mobile || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(member.name)}%2C%20regarding%20ACS%20Solar%20leads.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 border border-slate-700 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Territory Beat & Commission Badges for Sales Roles */}
                  {isSalesRole && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate text-slate-300">
                          {member.territoryBeat || 'Territory Beat: Core City'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate text-slate-300">
                          {member.commissionRate || '₹1,500 / kW'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mt-2.5 px-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{member.mobile}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Snapshot & Live HRMS Status */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {/* Today's HRMS Attendance & Field Telemetry */}
                  {(() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const todayRecord = attendanceRecords.find(r => r.userId === member.id && r.date === todayStr);
                    const isFieldCrew = member.role === 'FIELD_VISIT_TEAM' || member.role === 'SALES_EXECUTIVE' || member.role === 'SITE_SURVEYOR';

                    return (
                      <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Today's Attendance:</span>
                          </div>
                          {todayRecord ? (
                            <span className="font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                              In: {todayRecord.punchInTime} ({todayRecord.status})
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Not Punched In</span>
                          )}
                        </div>

                        {isFieldCrew && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                            <div className="flex items-center gap-1 text-rose-400">
                              <Navigation className="w-3 h-3 text-rose-400 animate-pulse" />
                              <span className="font-semibold">Field GPS Telemetry:</span>
                            </div>
                            <span className="text-slate-300 font-mono">
                              {todayRecord?.punchInAddress
                                ? todayRecord.punchInAddress.split(',')[0]
                                : 'Live On Beat'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block">
                        {isSalesRole ? 'Active Leads' : 'Assigned'}
                      </span>
                      <span className="font-bold text-white">{memberLeads.length}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">
                        {isSalesRole ? 'Target Quota' : 'Active EPC'}
                      </span>
                      <span className="font-bold text-amber-400">
                        {isSalesRole ? `${member.salesTargetKW || 30} kW` : memberProjects.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Access Status</span>
                      <span
                        className={`font-bold capitalize ${
                          member.status === 'active'
                            ? 'text-emerald-400'
                            : member.status === 'suspended'
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  </div>

                  {/* Owner Controls: Suspend, Reactivate, Reset, Remove */}
                  {canAddSalesTeam && member.id !== currentUser.id && (
                    <div className="flex items-center justify-between gap-1.5 pt-1 text-[11px] flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {member.status === 'suspended' ? (
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold transition-colors"
                          >
                            <PlayCircle className="w-3 h-3" />
                            <span>Reactivate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-semibold transition-colors"
                          >
                            <PauseCircle className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleResetPassword(member)}
                          className="flex items-center gap-1 text-slate-400 hover:text-amber-400 py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <Key className="w-3 h-3 text-amber-400" />
                          <span>Reset</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setMemberToDelete(member)}
                        title="Remove Staff Member"
                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Sales Team Modal */}
      <AddSalesTeamModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={addedName => {
          setToastMessage(`Sales executive ${addedName} successfully onboarded under your franchise!`);
          setTimeout(() => setToastMessage(null), 6000);
        }}
      />

      {/* Delete / Remove Member Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remove Team Member?</h3>
                <p className="text-xs text-rose-300/80">Franchise Staff De-provisioning</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="text-slate-300">
                Are you sure you want to remove <strong className="text-white">{memberToDelete.name}</strong> ({memberToDelete.role.replace('_', ' ')})?
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Mobile: <strong>{memberToDelete.mobile}</strong>. All active leads and assignments will be returned to the franchise pool and app access will be terminated.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(memberToDelete.id);
                  setToastMessage(`Staff member ${memberToDelete.name} has been removed.`);
                  setMemberToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" /> Confirm & Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
