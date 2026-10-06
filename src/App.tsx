import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { SplashScreen } from './components/common/SplashScreen';
import { AppGuideModal } from './components/common/AppGuideModal';
import { NotificationsModal } from './components/common/NotificationsModal';

// Admin Components
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { FranchiseManagementView } from './components/admin/FranchiseManagementView';
import { UserManagementView } from './components/admin/UserManagementView';
import { ProductsManagementView } from './components/admin/ProductsManagementView';
import { AnnouncementsManagementView } from './components/admin/AnnouncementsManagementView';
import { AdminGuideManagerView } from './components/admin/AdminGuideManagerView';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { SettingsView } from './components/admin/SettingsView';
import { SalesLocationHistoryView } from './components/admin/SalesLocationHistoryView';
import { DownlinesBusinessView } from './components/admin/DownlinesBusinessView';
import { HRMSAttendanceView } from './components/admin/HRMSAttendanceView';

// Android Components
import { AndroidFrame } from './components/android/AndroidFrame';
import { FranchiseDashboardView } from './components/android/FranchiseDashboardView';
import { CRMView } from './components/android/CRMView';
import { SolarProjectManagementView } from './components/android/SolarProjectManagementView';
import { AIAssistantView } from './components/android/AIAssistantView';
import { MoreHubView } from './components/android/MoreHubView';
import { QuotationSystemView } from './components/android/QuotationSystemView';
import { PaymentManagementView } from './components/android/PaymentManagementView';
import { CustomerManagementView } from './components/android/CustomerManagementView';
import { SiteSurveyView } from './components/android/SiteSurveyView';
import { TeamManagementView } from './components/android/TeamManagementView';
import { ReportsView } from './components/android/ReportsView';
import { SupportTicketSystemView } from './components/support/SupportTicketSystemView';
import { FuelSupportManagementView } from './components/hrms/FuelSupportManagementView';

// Modals
import { AddLeadModal } from './components/modals/AddLeadModal';
import { NewQuotationModal } from './components/modals/NewQuotationModal';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { AddPaymentModal } from './components/modals/AddPaymentModal';
import { NewFollowUpModal } from './components/modals/NewFollowUpModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { AddSalesTeamModal } from './components/modals/AddSalesTeamModal';
import { PMSuryaGharModal } from './components/modals/PMSuryaGharModal';
import { GPSPhotoCheckInModal } from './components/maps/GPSPhotoCheckInModal';
import { MapsGroundingDrawer } from './components/maps/MapsGroundingDrawer';
import { LoginScreen } from './components/auth/LoginScreen';

import { Lead, Project } from './types';
import { ChevronLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, deviceFrame, currentUser, addSalesLocationLog } = useApp();

  // Navigation States
  const [activeAndroidTab, setActiveAndroidTab] = useState<
    'home' | 'crm' | 'projects' | 'ai' | 'more'
  >('home');

  const [androidSubView, setAndroidSubView] = useState<string | null>(null);

  // Common Modals State
  const [showSplash, setShowSplash] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Business Action Modals
  const [showAddLead, setShowAddLead] = useState(false);
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showPMSuryaGharUpload, setShowPMSuryaGharUpload] = useState(false);
  const [showNewFollowUp, setShowNewFollowUp] = useState(false);
  const [showAddSalesTeam, setShowAddSalesTeam] = useState(false);
  const [showGPSPhotoModal, setShowGPSPhotoModal] = useState(false);
  const [gpsPhotoInitialData, setGpsPhotoInitialData] = useState<{ customerName?: string; address?: string } | null>(null);
  const [mapsGroundingTarget, setMapsGroundingTarget] = useState<{
    name: string;
    lat: number;
    lng: number;
    address: string;
    city?: string;
  } | null>(null);

  // Contextual modal pre-fills
  const [targetLeadForFollowUp, setTargetLeadForFollowUp] = useState<Lead | null>(null);
  const [targetLeadForQuote, setTargetLeadForQuote] = useState<Lead | null>(null);
  const [targetProjectForPayment, setTargetProjectForPayment] = useState<Project | null>(null);

  // Render Mobile Content
  const renderAndroidContent = () => {
    // If inside a subview from Home or More
    if (androidSubView) {
      return (
        <div className="h-full flex flex-col bg-slate-950">
          <div className="p-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center gap-2 sticky top-0 z-20 shrink-0">
            <button
              onClick={() => setAndroidSubView(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs sm:text-sm font-bold text-white capitalize truncate">
              {androidSubView === 'quotations' && 'Quotation Generator'}
              {androidSubView === 'payments' && 'Payment Collections'}
              {androidSubView === 'customers' && 'Customer Directory'}
              {androidSubView === 'surveys' && 'Rooftop Site Surveys'}
              {androidSubView === 'team' && 'Franchise Staff & Crew'}
              {androidSubView === 'reports' && 'Business Reports & Analytics'}
              {androidSubView === 'settings' && 'Settings & Visual Themes'}
              {androidSubView === 'hrms_attendance' && 'Attendance & HRMS Management'}
              {androidSubView === 'admin_overview' && 'Executive Admin Overview'}
              {androidSubView === 'sales_location_tracker' && 'Sales GPS & Live Location History'}
              {androidSubView === 'downlines' && 'Downlines & Business Directory'}
              {androidSubView === 'franchises' && 'Franchise Network Management'}
              {androidSubView === 'users' && 'User Directory & Access Control'}
              {androidSubView === 'products' && 'Solar Hardware & Pricing Catalog'}
              {androidSubView === 'announcements' && 'Broadcast Announcements'}
              {androidSubView === 'guides' && 'Interactive App Guides'}
              {androidSubView === 'audit' && 'System Audit & Activity Logs'}
              {androidSubView === 'support_tickets' && 'ACS HQ Support Ticket Desk'}
              {androidSubView === 'fuel_support' && 'Fuel / Field Travel Support'}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {androidSubView === 'quotations' && (
              <QuotationSystemView onOpenNewQuotation={() => setShowNewQuote(true)} />
            )}
            {androidSubView === 'payments' && (
              <PaymentManagementView onOpenAddPaymentModal={() => setShowAddPayment(true)} />
            )}
            {androidSubView === 'customers' && (
              <CustomerManagementView
                onOpenAddCustomer={() => setShowAddCustomer(true)}
                onOpenPMSuryaGhar={() => setShowPMSuryaGharUpload(true)}
              />
            )}
            {androidSubView === 'surveys' && (
              <SiteSurveyView
                onOpenGPSPhoto={(data) => {
                  setGpsPhotoInitialData(data || null);
                  setShowGPSPhotoModal(true);
                }}
                onInspectMapsGrounding={(target) => setMapsGroundingTarget(target)}
              />
            )}
            {androidSubView === 'team' && <TeamManagementView />}
            {androidSubView === 'reports' && <ReportsView />}
            {androidSubView === 'settings' && (
              <div className="p-1">
                <SettingsView />
              </div>
            )}
            {androidSubView === 'hrms_attendance' && (
              <HRMSAttendanceView
                onBack={() => setAndroidSubView(null)}
                onNavigateToLocationTracker={() => setAndroidSubView('sales_location_tracker')}
              />
            )}
            {androidSubView === 'admin_overview' && (
              <AdminDashboardView onNavigate={tab => setAndroidSubView(tab)} />
            )}
            {androidSubView === 'sales_location_tracker' && (
              <SalesLocationHistoryView onBack={() => setAndroidSubView(null)} />
            )}
            {androidSubView === 'downlines' && (
              <DownlinesBusinessView
                onNavigateToLocationTracker={() => setAndroidSubView('sales_location_tracker')}
                onNavigateToLeads={() => {
                  setAndroidSubView(null);
                  setActiveAndroidTab('crm');
                }}
                onNavigateToCustomers={() => setAndroidSubView('customers')}
              />
            )}
            {androidSubView === 'franchises' && <FranchiseManagementView />}
            {androidSubView === 'users' && <UserManagementView />}
            {androidSubView === 'products' && <ProductsManagementView />}
            {androidSubView === 'announcements' && <AnnouncementsManagementView />}
            {androidSubView === 'guides' && <AdminGuideManagerView />}
            {androidSubView === 'audit' && <AuditLogsView />}
            {androidSubView === 'support_tickets' && (
              <SupportTicketSystemView onBack={() => setAndroidSubView(null)} />
            )}
            {androidSubView === 'fuel_support' && (
              <FuelSupportManagementView onBack={() => setAndroidSubView(null)} />
            )}
          </div>
        </div>
      );
    }

    // Main 5 Tabs
    switch (activeAndroidTab) {
      case 'home':
        return (
          <FranchiseDashboardView
            onNavigate={(tab: string) => {
              if (tab === 'crm' || tab === 'projects' || tab === 'ai_chat' || tab === 'more') {
                setActiveAndroidTab(tab === 'ai_chat' ? 'ai' : tab as any);
              } else {
                setAndroidSubView(tab);
              }
            }}
            onOpenAddLead={() => setShowAddLead(true)}
            onOpenAddCustomer={() => setShowAddCustomer(true)}
            onOpenPMSuryaGhar={() => setShowPMSuryaGharUpload(true)}
            onOpenNewQuotation={() => setShowNewQuote(true)}
            onOpenNewFollowup={() => setShowNewFollowUp(true)}
            onOpenNewProject={() => setShowNewProject(true)}
            onOpenGPSPhoto={() => {
              setGpsPhotoInitialData(null);
              setShowGPSPhotoModal(true);
            }}
          />
        );
      case 'crm':
        return (
          <CRMView
            onOpenAddLead={() => setShowAddLead(true)}
            onOpenAddFollowupWithLead={lead => {
              setTargetLeadForFollowUp(lead);
              setShowNewFollowUp(true);
            }}
            onOpenQuotationForLead={lead => {
              setTargetLeadForQuote(lead);
              setShowNewQuote(true);
            }}
            onOpenGPSPhotoForLead={lead => {
              setGpsPhotoInitialData({
                customerName: lead.name || lead.customerName,
                address: lead.address || `${lead.city}, ${lead.state}`
              });
              setShowGPSPhotoModal(true);
            }}
            onInspectMapsGrounding={target => setMapsGroundingTarget(target)}
          />
        );
      case 'projects':
        return (
          <SolarProjectManagementView
            onOpenNewProject={() => setShowNewProject(true)}
            onOpenPaymentModal={proj => {
              setTargetProjectForPayment(proj);
              setShowAddPayment(true);
            }}
          />
        );
      case 'ai':
        return <AIAssistantView />;
      case 'more':
        return (
          <MoreHubView
            onSelectSubTab={sub => setAndroidSubView(sub)}
            onOpenAppGuide={() => setShowGuide(true)}
            onOpenAnnouncements={() => setShowNotifications(true)}
            onOpenAddSalesTeam={() => setShowAddSalesTeam(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Responsive Viewport Shell: sleek phone frame in mobile mode, expansive enterprise canvas in desktop mode */}
      <div className="flex-1 w-full h-full flex justify-center items-center overflow-hidden bg-slate-950">
        <div
          className={`w-full h-full flex flex-col bg-slate-950 overflow-hidden relative transition-all duration-300 ${
            deviceFrame === 'mobile'
              ? 'max-w-md sm:my-3 sm:rounded-[36px] sm:border-[6px] sm:border-slate-800 sm:shadow-2xl sm:ring-1 sm:ring-white/10'
              : deviceFrame === 'tablet'
              ? 'max-w-4xl sm:border-x sm:border-slate-800/80 sm:shadow-2xl'
              : 'max-w-7xl w-full sm:border-x sm:border-slate-800/60 shadow-2xl'
          }`}
        >
          {/* Top Application Header */}
          <Header
            onOpenGuide={() => setShowGuide(true)}
            onOpenNotifications={() => setShowNotifications(true)}
          />

          {/* Main Mobile App Workspace */}
          {!isAuthenticated ? (
            <div className="flex-1 overflow-y-auto flex items-center justify-center p-3">
              <LoginScreen isMobileFrame={true} />
            </div>
          ) : (
            <div className="flex-1 overflow-hidden relative flex flex-col">
              <AndroidFrame
                currentTab={activeAndroidTab === 'home' ? 'franchise_dashboard' : activeAndroidTab === 'ai' ? 'ai_chat' : activeAndroidTab}
                onSelectTab={(tab: string) => {
                  setAndroidSubView(null);
                  if (tab === 'franchise_dashboard') setActiveAndroidTab('home');
                  else if (tab === 'ai_chat') setActiveAndroidTab('ai');
                  else setActiveAndroidTab(tab as any);
                }}
              >
                {renderAndroidContent()}
              </AndroidFrame>
            </div>
          )}
        </div>
      </div>

      {/* Global Interactive Modals */}
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}
      <AppGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      <AddLeadModal isOpen={showAddLead} onClose={() => setShowAddLead(false)} />
      <NewQuotationModal
        isOpen={showNewQuote}
        onClose={() => {
          setShowNewQuote(false);
          setTargetLeadForQuote(null);
        }}
        prefillLead={targetLeadForQuote}
      />
      <NewProjectModal isOpen={showNewProject} onClose={() => setShowNewProject(false)} />
      <AddPaymentModal
        isOpen={showAddPayment}
        onClose={() => {
          setShowAddPayment(false);
          setTargetProjectForPayment(null);
        }}
        prefillProject={targetProjectForPayment}
      />
      <NewFollowUpModal
        isOpen={showNewFollowUp}
        onClose={() => {
          setShowNewFollowUp(false);
          setTargetLeadForFollowUp(null);
        }}
        prefillLead={targetLeadForFollowUp}
      />
      <AddCustomerModal isOpen={showAddCustomer} onClose={() => setShowAddCustomer(false)} />
      <PMSuryaGharModal
        isOpen={showPMSuryaGharUpload}
        onClose={() => setShowPMSuryaGharUpload(false)}
      />
      <AddSalesTeamModal isOpen={showAddSalesTeam} onClose={() => setShowAddSalesTeam(false)} />
      <GPSPhotoCheckInModal
        isOpen={showGPSPhotoModal}
        onClose={() => {
          setShowGPSPhotoModal(false);
          setGpsPhotoInitialData(null);
        }}
        onSubmitLog={log => addSalesLocationLog(log as any)}
        currentUser={currentUser}
        initialCustomerName={gpsPhotoInitialData?.customerName}
        initialAddress={gpsPhotoInitialData?.address}
      />
      <MapsGroundingDrawer
        isOpen={!!mapsGroundingTarget}
        onClose={() => setMapsGroundingTarget(null)}
        locationData={mapsGroundingTarget}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
