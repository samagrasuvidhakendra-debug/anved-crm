import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CreditCard,
  Contact,
  Compass,
  Users,
  UserPlus,
  TrendingUp,
  BookOpen,
  Megaphone,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building,
  MapPin,
  GitBranch,
  Settings,
  LayoutDashboard,
  Package,
  UserCheck,
  UserCog,
  Phone,
  Edit3,
  KeyRound,
  Lock,
  Fuel,
  LifeBuoy
} from 'lucide-react';
import { EditProfileModal } from '../modals/EditProfileModal';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface MoreHubViewProps {
  onSelectSubTab: (tab: string) => void;
  onOpenAppGuide: () => void;
  onOpenAnnouncements: () => void;
  onOpenAddSalesTeam?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  color: string;
  action?: () => void;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({
  onSelectSubTab,
  onOpenAppGuide,
  onOpenAnnouncements,
  onOpenAddSalesTeam
}) => {
  const { currentUser, allUsers, switchUserRole, logout } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const canAddSales = currentUser.role === 'FRANCHISE_OWNER' || currentUser.role === 'SUPER_ADMIN';

  const franchiseStaff = (allUsers || []).filter(u =>
    currentUser.role === 'SUPER_ADMIN' ? true : u.franchiseId === currentUser.franchiseId
  );
  const salesReps = franchiseStaff.filter(
    u => u.role === 'SALES_EXECUTIVE' || u.role === 'SALES_MANAGER'
  );
  const totalSalesQuota = salesReps.reduce((sum, u) => sum + (u.salesTargetKW || 30), 0);

  const menuSections: MenuSection[] = [
    ...(currentUser.role === 'SUPER_ADMIN'
      ? [
          {
            title: 'Super Admin Executive Controls',
            items: [
              { id: 'admin_overview', label: 'Executive Admin Dashboard', icon: LayoutDashboard, color: 'text-amber-400' },
              { id: 'sales_location_tracker', label: 'Field Visiting Team GPS & Location', icon: MapPin, color: 'text-rose-400' },
              { id: 'downlines', label: 'Downlines & Business Directory', icon: GitBranch, color: 'text-amber-400' },
              { id: 'hrms_attendance', label: 'Attendance & HRMS Management', icon: UserCheck, color: 'text-emerald-400' },
              { id: 'franchises', label: 'Franchise Network & Approvals', icon: Building, color: 'text-sky-400' },
              { id: 'users', label: 'User Directory & Access Control', icon: UserCheck, color: 'text-indigo-400' },
              { id: 'products', label: 'Solar Hardware & Pricing', icon: Package, color: 'text-emerald-400' },
              { id: 'audit', label: 'Security & Audit Logs', icon: ShieldCheck, color: 'text-purple-400' }
            ]
          }
        ]
      : []),
    {
      title: 'Sales & Project Tools',
      items: [
        { id: 'quotations', label: 'Quotation Generator', icon: FileText, color: 'text-sky-400' },
        { id: 'payments', label: 'Payment Collections', icon: CreditCard, color: 'text-emerald-400' },
        { id: 'customers', label: 'Customer Directory', icon: Contact, color: 'text-teal-400' },
        { id: 'surveys', label: 'Rooftop Site Surveys', icon: Compass, color: 'text-amber-400' }
      ]
    },
    {
      title: canAddSales ? 'Sales Force & Operations' : 'Operations & Management',
      items: [
        { id: 'hrms_attendance', label: 'Attendance & HRMS Management', icon: UserCheck, color: 'text-emerald-400' },
        { id: 'fuel_support', label: 'Fuel / Field Travel Support', icon: Fuel, color: 'text-amber-400' },
        { id: 'sales_location_tracker', label: 'Field Visiting Team Live GPS', icon: MapPin, color: 'text-rose-400' },
        ...(canAddSales && onOpenAddSalesTeam
          ? [{ id: 'add_sales_member', label: '+ Add Sales Executive', icon: UserPlus, color: 'text-amber-400', action: onOpenAddSalesTeam }]
          : []),
        { id: 'team', label: canAddSales ? 'Sales Team & Franchise Crew' : 'Franchise Staff & Crew', icon: Users, color: 'text-purple-400' },
        { id: 'reports', label: 'Business Reports & Analytics', icon: TrendingUp, color: 'text-rose-400' }
      ]
    },
    {
      title: 'Franchise Identity & HQ Support',
      items: [
        { id: 'support_tickets', label: 'ACS HQ Support Ticket Desk', icon: LifeBuoy, color: 'text-rose-400' },
        { id: 'edit_profile', label: 'My Owner Profile & Contact Info', icon: UserCog, color: 'text-amber-400', action: () => setIsEditProfileOpen(true) },
        { id: 'change_password', label: 'Change Account Password', icon: KeyRound, color: 'text-amber-400', action: () => setIsChangePasswordOpen(true) },
        { id: 'settings', label: 'Settings & Theme Preferences', icon: Settings, color: 'text-amber-400' },
        { id: 'guide', label: 'Interactive App Guide', icon: BookOpen, color: 'text-sky-400', action: onOpenAppGuide },
        { id: 'announcements', label: 'Headquarters Notices', icon: Megaphone, color: 'text-yellow-400', action: onOpenAnnouncements }
      ]
    }
  ];

  return (
    <div id="more-hub-view" className="p-4 space-y-4 text-white">
      {/* Profile Card with Edit Authority */}
      <div
        id="more-profile-card"
        className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-400 shadow-md ring-2 ring-emerald-400/20"
              />
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md hover:bg-emerald-300 transition-colors"
                title="Edit Photo"
              >
                <Edit3 className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white truncate">{currentUser.name}</h3>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-500/30 font-bold uppercase tracking-wider shrink-0">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                {currentUser.franchiseName || 'ACS Solar Territory'}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                  {currentUser.mobile || '+91 98000 00000'}
                </span>
                <span>•</span>
                <span className="truncate">{currentUser.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              id="more-change-password-btn"
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Change Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Password</span>
            </button>
            <button
              type="button"
              id="more-edit-profile-btn"
              onClick={() => setIsEditProfileOpen(true)}
              className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <UserCog className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Franchise Owner Sales Team Spotlight in More Menu */}
      {canAddSales && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 font-bold shadow-inner">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Franchise Sales Force
                  </h4>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-500/30 font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
                    Owner Access
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug mt-0.5">
                  Add & assign sales executives to your branch
                </p>
              </div>
            </div>
            {onOpenAddSalesTeam && (
              <button
                id="more-add-sales-btn"
                onClick={onOpenAddSalesTeam}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Add Rep</span>
              </button>
            )}
          </div>

          <div className="pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs">
            <div
              onClick={() => onSelectSubTab('team')}
              className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition-colors text-center"
            >
              <span className="text-[10px] text-slate-400 block font-medium">Sales Team</span>
              <span className="font-bold text-amber-400 text-xs sm:text-sm mt-0.5 block">{salesReps.length} Reps</span>
            </div>
            <div
              onClick={() => onSelectSubTab('team')}
              className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition-colors text-center"
            >
              <span className="text-[10px] text-slate-400 block font-medium">Target Capacity</span>
              <span className="font-bold text-emerald-400 text-xs sm:text-sm mt-0.5 block">{totalSalesQuota} kW</span>
            </div>
          </div>
        </div>
      )}

      {/* Menu Sections */}
      <div className="space-y-4">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              {section.title}
            </span>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden shadow-sm">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        onSelectSubTab(item.id);
                      }
                    }}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg bg-slate-950 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Session Management */}
      <div className="pt-2 space-y-2">
        {currentUser.role !== 'SUPER_ADMIN' ? (
          <button
            onClick={() => {
              switchUserRole('USR-001'); // Switch to Super Admin
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Switch Role to Super Admin</span>
          </button>
        ) : (
          <button
            onClick={() => {
              switchUserRole('USR-002'); // Switch to Franchise Owner
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Switch Role to Franchise Owner</span>
          </button>
        )}

        <button
          id="mobile-hub-logout-btn"
          onClick={logout}
          className="w-full py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Log Out of ACS Solar</span>
        </button>
      </div>

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
