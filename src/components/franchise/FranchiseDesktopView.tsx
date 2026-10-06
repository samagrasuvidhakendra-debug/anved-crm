import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users2,
  FolderGit2,
  FileText,
  CreditCard,
  Contact,
  ClipboardCheck,
  Users,
  TrendingUp,
  Bot,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  LogOut,
  Settings,
  Smartphone
} from 'lucide-react';
import { FranchiseDashboardView } from '../android/FranchiseDashboardView';
import { CRMView } from '../android/CRMView';
import { SolarProjectManagementView } from '../android/SolarProjectManagementView';
import { QuotationSystemView } from '../android/QuotationSystemView';
import { PaymentManagementView } from '../android/PaymentManagementView';
import { CustomerManagementView } from '../android/CustomerManagementView';
import { SiteSurveyView } from '../android/SiteSurveyView';
import { TeamManagementView } from '../android/TeamManagementView';
import { ReportsView } from '../android/ReportsView';
import { AIAssistantView } from '../android/AIAssistantView';
import { SettingsView } from '../admin/SettingsView';
import { Lead, Project } from '../../types';

interface FranchiseDesktopViewProps {
  onOpenAddLead: () => void;
  onOpenNewQuote: () => void;
  onOpenNewProject: () => void;
  onOpenAddPayment: () => void;
  onOpenAddCustomer: () => void;
  onOpenNewFollowUp: () => void;
  onOpenAddSalesTeam?: () => void;
  setTargetLeadForFollowUp: (lead: Lead | null) => void;
  setTargetLeadForQuote: (lead: Lead | null) => void;
  setTargetProjectForPayment: (proj: Project | null) => void;
}

export const FranchiseDesktopView: React.FC<FranchiseDesktopViewProps> = ({
  onOpenAddLead,
  onOpenNewQuote,
  onOpenNewProject,
  onOpenAddPayment,
  onOpenAddCustomer,
  onOpenNewFollowUp,
  onOpenAddSalesTeam,
  setTargetLeadForFollowUp,
  setTargetLeadForQuote,
  setTargetProjectForPayment
}) => {
  const { currentUser, allFranchises, logout, leads, projects, quotations, setDeviceFrame } = useApp();
  const currentFranchise = allFranchises.find(f => f.id === currentUser.franchiseId);
  const [activeTab, setActiveTab] = useState<
    'home' | 'crm' | 'projects' | 'quotations' | 'payments' | 'customers' | 'surveys' | 'team' | 'reports' | 'ai' | 'settings'
  >('home');
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

  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;

  const navItems: { id: string; label: string; icon: any; isSpecial?: boolean; badge?: number }[] = [
    { id: 'home', label: 'Franchise Home', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM Leads', icon: Users2, badge: leads.length },
    { id: 'projects', label: 'Solar Projects', icon: FolderGit2, badge: activeProjectsCount },
    { id: 'quotations', label: 'Quotations', icon: FileText, badge: quotations.length },
    { id: 'payments', label: 'Milestone Payments', icon: CreditCard },
    { id: 'customers', label: 'Customer Directory', icon: Contact },
    { id: 'surveys', label: 'Site Surveys', icon: ClipboardCheck },
    { id: 'team', label: 'Franchise Team', icon: Users },
    { id: 'reports', label: 'Sales & Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Themes', icon: Settings },
    { id: 'ai', label: 'ACS Solar AI', icon: Bot, isSpecial: true }
  ];

  return (
    <div id="franchise-desktop-view" className="flex-1 flex overflow-hidden bg-slate-950">
      {/* Sidebar Navigation */}
      <aside
        className={`${
          isCollapsed ? 'w-16' : 'w-60'
        } transition-all duration-200 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-53px)] shrink-0 z-20`}
      >
        {/* Franchise Header info */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {!isCollapsed && (
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs font-bold text-white truncate">
                {currentFranchise?.franchiseName || 'ACS Franchise'}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {currentFranchise?.city || 'Portal'} • {currentUser.role.replace('_', ' ')}
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button */}
        {!isCollapsed && (
          <div className="p-2.5 border-b border-slate-800/80">
            <button
              onClick={onOpenAddLead}
              className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add New Lead</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`franchise-desktop-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id as any);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setIsCollapsed(true);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'gap-2.5 px-3'
                } py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.isSpecial
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1.5 ${
                          isActive
                            ? 'bg-slate-950 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Phone Mode Switcher in Sidebar */}
        <div className="p-2 border-t border-slate-800/80">
          <button
            onClick={() => setDeviceFrame('mobile')}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-1.5'
            } rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-emerald-500/20`}
            title="Preview in Mobile Phone Mockup"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {!isCollapsed && <span className="truncate">Phone App Simulator</span>}
          </button>
        </div>

        {/* User Info Bar at bottom */}
        <div className={`p-3 border-t border-slate-800 bg-slate-950/60 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={
                  currentUser.profilePhoto ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-400/50 shrink-0"
              />
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                </div>
              )}
            </div>
            <button
              id="franchise-desktop-logout-btn"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'home' && (
            <FranchiseDashboardView
              onNavigate={(tab: string) => {
                if (tab === 'crm' || tab === 'projects' || tab === 'ai_chat' || tab === 'more') {
                  setActiveTab(tab === 'ai_chat' ? 'ai' : (tab as any));
                } else if (tab === 'quotations' || tab === 'payments' || tab === 'customers' || tab === 'surveys' || tab === 'team' || tab === 'reports') {
                  setActiveTab(tab as any);
                }
              }}
              onOpenAddLead={onOpenAddLead}
              onOpenAddCustomer={onOpenAddCustomer}
              onOpenNewQuotation={onOpenNewQuote}
              onOpenNewFollowup={onOpenNewFollowUp}
              onOpenNewProject={onOpenNewProject}
            />
          )}

          {activeTab === 'crm' && (
            <CRMView
              onOpenAddLead={onOpenAddLead}
              onOpenAddFollowupWithLead={lead => {
                setTargetLeadForFollowUp(lead);
                onOpenNewFollowUp();
              }}
              onOpenQuotationForLead={lead => {
                setTargetLeadForQuote(lead);
                onOpenNewQuote();
              }}
            />
          )}

          {activeTab === 'projects' && (
            <SolarProjectManagementView
              onOpenNewProject={onOpenNewProject}
              onOpenPaymentModal={proj => {
                setTargetProjectForPayment(proj);
                onOpenAddPayment();
              }}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationSystemView onOpenNewQuotation={onOpenNewQuote} />
          )}

          {activeTab === 'payments' && (
            <PaymentManagementView onOpenAddPaymentModal={onOpenAddPayment} />
          )}

          {activeTab === 'customers' && (
            <CustomerManagementView onOpenAddCustomer={onOpenAddCustomer} />
          )}

          {activeTab === 'surveys' && <SiteSurveyView />}

          {activeTab === 'team' && <TeamManagementView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'ai' && (
            <div className="max-w-3xl mx-auto h-[780px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <AIAssistantView />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
