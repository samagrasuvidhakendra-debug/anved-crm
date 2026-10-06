import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, UserStatus } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Shield,
  Building2,
  Lock,
  CheckCircle,
  XCircle,
  Key,
  X,
  Trash2,
  ShieldAlert
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { allUsers, allFranchises, addUser, updateUserStatus, deleteUser, addAuditLog, isUserSuspended } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New user form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    role: 'SALES_EXECUTIVE' as UserRole,
    franchiseId: allFranchises[0]?.id || 'ACS-MH-01',
    status: 'active' as UserStatus,
    joiningDate: new Date().toISOString().split('T')[0],
    assignedTeam: 'Field Operations'
  });

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search) ||
      (u.franchiseName && u.franchiseName.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    const isSusp = isUserSuspended(u);
    const effectiveStatus: UserStatus = isSusp ? 'suspended' : u.status;
    const matchesStatus =
      statusFilter === 'ALL' ||
      effectiveStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.email.trim()) {
      setFormError('Please fill out required fields (Name, Mobile, Email).');
      return;
    }

    setFormError(null);
    const selectedFranchise = allFranchises.find(f => f.id === formData.franchiseId);

    addUser({
      ...formData,
      franchiseName: formData.role === 'SUPER_ADMIN' ? 'ACS Headquarters' : selectedFranchise?.franchiseName || 'ACS Solar',
      profilePhoto: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&auto=format&fit=crop&q=80`
    });

    setShowAddModal(false);
    setToastMessage(`Staff account for ${formData.name} successfully provisioned.`);
    setTimeout(() => setToastMessage(null), 5000);
    setFormData({
      name: '',
      mobile: '',
      email: '',
      role: 'SALES_EXECUTIVE',
      franchiseId: allFranchises[0]?.id || 'ACS-MH-01',
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      assignedTeam: 'Field Operations'
    });
  };

  const handleResetPassword = (user: User) => {
    setToastMessage(`A secure password reset link has been dispatched to ${user.email} (SMS OTP sent to ${user.mobile}).`);
    setTimeout(() => setToastMessage(null), 6000);
    addAuditLog('Password Reset Dispatched', 'User', user.id, `Password reset generated for ${user.name}`);
  };

  return (
    <div id="user-management-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" /> Platform Staff & Access Control
          </h1>
          <p className="text-xs text-slate-400">
            Provision staff roles, assign franchise territories, and audit security permissions
          </p>
        </div>
        <button
          id="add-user-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow shadow-amber-500/20"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search users by name, mobile, email, territory..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-auto font-medium"
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="FRANCHISE_OWNER">Franchise Owner</option>
          <option value="OFFICE_SALES_TELECALLER">Office Sales Team / Telecaller</option>
          <option value="FIELD_VISIT_TEAM">Field Visiting Team</option>
          <option value="SALES_MANAGER">Sales Manager</option>
          <option value="SALES_EXECUTIVE">Sales Executive</option>
          <option value="SITE_SURVEYOR">Site Surveyor</option>
          <option value="INSTALLATION_TEAM">Installation Team</option>
          <option value="ACCOUNT_STAFF">Account Staff</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-auto font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="suspended">Suspended Only</option>
          <option value="disabled">Disabled Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Assigned Franchise</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">ID Status</th>
                <th className="py-3 px-4 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map(user => {
                const isSuspended = isUserSuspended(user);
                const effectiveStatus: UserStatus = isSuspended ? 'suspended' : user.status;
                const linkedFranchise = allFranchises.find(
                  f => f.id === user.franchiseId || f.franchiseCode === user.franchiseId
                );
                const isDueToFranchiseSuspension =
                  user.role !== 'SUPER_ADMIN' && linkedFranchise?.status === 'Suspended';

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={
                            user.profilePhoto ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                          }
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                            effectiveStatus === 'active'
                              ? 'bg-emerald-400'
                              : effectiveStatus === 'suspended'
                              ? 'bg-rose-500'
                              : 'bg-slate-500'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.role === 'FRANCHISE_OWNER' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold border border-amber-500/30">
                              Owner
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {user.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : user.role === 'FRANCHISE_OWNER'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        }`}
                      >
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      <div className="flex flex-col">
                        <span>{user.role === 'SUPER_ADMIN' ? 'All Territories (HQ)' : user.franchiseName || user.franchiseId}</span>
                        {linkedFranchise && (
                          <span className={`text-[10px] ${linkedFranchise.status === 'Suspended' ? 'text-rose-400 font-semibold' : 'text-slate-500'}`}>
                            Franchise: {linkedFranchise.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 space-y-0.5 text-[11px]">
                      <div className="text-white">{user.mobile}</div>
                      <div className="text-slate-400">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider inline-flex items-center gap-1.5 w-fit ${
                            effectiveStatus === 'suspended'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                              : effectiveStatus === 'disabled'
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : effectiveStatus === 'inactive'
                              ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              effectiveStatus === 'suspended' || effectiveStatus === 'disabled'
                                ? 'bg-rose-400 animate-pulse'
                                : effectiveStatus === 'inactive'
                                ? 'bg-slate-400'
                                : 'bg-emerald-400'
                            }`}
                          />
                          {effectiveStatus === 'suspended' ? 'Suspended' : effectiveStatus}
                        </span>
                        {isDueToFranchiseSuspension && (
                          <span className="text-[9px] text-rose-400 font-semibold">
                            (Franchise Suspended)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleResetPassword(user)}
                        title="Reset Password / OTP"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>

                      {effectiveStatus === 'suspended' ? (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          title="Reactivate ID and restore full access"
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[10px] font-bold transition-colors shadow-sm"
                        >
                          Reactivate ID
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          title="Suspend ID immediately (prevents login and marks owner as suspended)"
                          className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 text-[10px] font-bold transition-colors shadow-sm"
                        >
                          Suspend ID
                        </button>
                      )}

                      {user.status !== 'disabled' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'disabled')}
                          title="Disable Account"
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-rose-300 text-[10px] font-bold transition-colors"
                        >
                          Disable
                        </button>
                      )}

                      <button
                        onClick={() => setUserToDelete(user)}
                        title="Remove / Delete User Account"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> Provision Staff User
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@acssolar.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role Permission *</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="FRANCHISE_OWNER">Franchise Owner</option>
                    <option value="OFFICE_SALES_TELECALLER">Office Sales Team / Telecaller</option>
                    <option value="FIELD_VISIT_TEAM">Field Visiting Team</option>
                    <option value="SALES_MANAGER">Sales Manager</option>
                    <option value="SALES_EXECUTIVE">Sales Executive</option>
                    <option value="SITE_SURVEYOR">Site Surveyor</option>
                    <option value="INSTALLATION_TEAM">Installation Team</option>
                    <option value="ACCOUNT_STAFF">Account Staff</option>
                    <option value="SUPER_ADMIN">Super Admin (Platform Level)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Franchise *</label>
                  <select
                    disabled={formData.role === 'SUPER_ADMIN'}
                    value={formData.franchiseId}
                    onChange={e => setFormData({ ...formData, franchiseId: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    {allFranchises.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.franchiseName} ({f.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Department / Team Name</label>
                <input
                  type="text"
                  placeholder="e.g. Field Survey Desk / EPC Execution"
                  value={formData.assignedTeam}
                  onChange={e => setFormData({ ...formData, assignedTeam: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remove User Account?</h3>
                <p className="text-xs text-rose-300/80">Permanent Administrative Action</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="text-slate-300">
                You are removing user <strong className="text-white">{userToDelete.name}</strong> ({userToDelete.role.replace('_', ' ')}).
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Contact: <strong>{userToDelete.mobile}</strong> ({userToDelete.email}). Franchise: {userToDelete.franchiseName || userToDelete.franchiseId}. Their credentials, login sessions, and HRMS access will be permanently revoked.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(userToDelete.id);
                  setToastMessage(`User account for ${userToDelete.name} has been permanently deleted.`);
                  setUserToDelete(null);
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
