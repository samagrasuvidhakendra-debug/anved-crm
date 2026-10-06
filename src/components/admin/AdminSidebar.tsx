import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserPlus,
  Contact,
  FolderGit2,
  FileText,
  CreditCard,
  Package,
  TrendingUp,
  Bell,
  Megaphone,
  BookOpen,
  Bot,
  Settings,
  History,
  LogOut,
  Sun,
  Filter,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, onSelectTab }) => {
  const {
    currentUser,
    allFranchises,
    selectedAdminFranchiseFilter,
    setSelectedAdminFranchiseFilter,
    switchUserRole,
    logout
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'franchises', label: 'Franchises', icon: Building2 },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'leads', label: 'Leads (CRM)', icon: UserPlus },
    { id: 'customers', label: 'Customers', icon: Contact },
    { id: 'projects', label: 'Solar Projects', icon: FolderGit2 },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'products', label: 'Products & Pricing', icon: Package },
    { id: 'reports', label: 'Sales & Reports', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'app_guide', label: 'App Guide CMS', icon: BookOpen },
    { id: 'ai_assistant', label: 'AI Assistant', icon: Bot },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'audit_logs', label: 'Audit Logs', icon: History }
  ];

  return (
    <aside
      id="admin-sidebar"
      className={`${
        isCollapsed ? 'w-16' : 'w-60 sm:w-64'
      } transition-all duration-200 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-53px)] shrink-0 relative z-30`}
    >
      {/* Collapse Toggle Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 bg-slate-950/60">
        {!isCollapsed && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Control Deck
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${isCollapsed ? 'mx-auto' : 'ml-auto'}`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Franchise Global Filter Bar for Super Admin */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Filter className="w-3 h-3 text-emerald-400" /> Platform Scope Filter
          </label>
          <select
            id="admin-franchise-filter"
            value={selectedAdminFranchiseFilter}
            onChange={e => setSelectedAdminFranchiseFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-medium"
          >
            <option value="all">All Franchises (Platform View)</option>
            {allFranchises.map(f => (
              <option key={f.id} value={f.id}>
                {f.franchiseName} ({f.city})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => {
                onSelectTab(item.id);
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setIsCollapsed(true);
                }
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-2.5 px-3'} py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Admin User Info Footer */}
      <div className={`p-3 border-t border-slate-800 bg-slate-950/60 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-400/60"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-400 font-semibold truncate">SUPER ADMIN</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                id="admin-logout-btn"
                onClick={logout}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-semibold transition-colors"
                title="Log out of Super Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
              <button
                id="admin-switch-franchise-btn"
                onClick={() => {
                  switchUserRole('USR-002'); // Switch to Rajesh Patil (Franchise Owner)
                }}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-medium transition-colors"
                title="Preview Franchise Portal"
              >
                <span>Franchise</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
