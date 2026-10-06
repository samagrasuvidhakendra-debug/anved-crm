import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PerformanceOverviewWidget } from './PerformanceOverviewWidget';
import { EditProfileModal } from '../modals/EditProfileModal';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';
import {
  Bell,
  UserPlus,
  Contact,
  FileText,
  Calendar,
  FolderGit2,
  Phone,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Sun,
  ShieldCheck,
  Plus,
  Edit3,
  KeyRound,
  Lock,
  MapPin,
  Radio,
  Camera,
  Compass,
  Sparkles,
  ExternalLink,
  Battery
} from 'lucide-react';

interface FranchiseDashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenAddLead: () => void;
  onOpenAddCustomer: () => void;
  onOpenNewQuotation: () => void;
  onOpenNewFollowup: () => void;
  onOpenNewProject: () => void;
  onOpenPMSuryaGhar?: () => void;
  onOpenGPSPhoto?: () => void;
}

export const FranchiseDashboardView: React.FC<FranchiseDashboardViewProps> = ({
  onNavigate,
  onOpenAddLead,
  onOpenAddCustomer,
  onOpenNewQuotation,
  onOpenNewFollowup,
  onOpenNewProject,
  onOpenPMSuryaGhar,
  onOpenGPSPhoto
}) => {
  const {
    currentUser,
    leads,
    followUps,
    quotations,
    projects,
    notifications,
    announcements,
    allFranchises,
    pmSuryaGharRecords,
    salesRepLiveStatus,
    salesLocationLogs
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const currentFranchise = allFranchises.find(f => f.id === currentUser.franchiseId);

  // KPIs calculation for this tenant
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayFollowUps = followUps.filter(f => f.date === todayDateStr && f.status === 'Pending');
  const pendingFollowUps = followUps.filter(f => f.status === 'Pending').length;
  const siteVisitsCount = leads.filter(l => l.status === 'Site Visit').length;
  const quotationsCount = quotations.length;
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  const pendingPaymentsAmount = projects.reduce((sum, p) => sum + p.pendingAmount, 0);
  const monthlySalesAmount = projects.reduce((sum, p) => sum + p.finalAmount, 0);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div id="franchise-dashboard-view" className="p-4 space-y-4 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div
          id="dashboard-header-profile-btn"
          onClick={() => setIsEditProfileOpen(true)}
          className="flex items-center gap-3 cursor-pointer group p-1 -ml-1 rounded-2xl hover:bg-slate-900/60 transition-colors"
          title="Click to modify profile photo, name, or phone"
        >
          <div className="relative shrink-0">
            <img
              src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-400/80 shadow group-hover:border-emerald-300 transition-colors"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow">
              <Edit3 className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block group-hover:text-emerald-300 transition-colors">
              Good Day, {currentUser.name.split(' ')[0]} 👋
            </span>
            <h2 className="text-sm font-black text-white leading-tight">
              {currentUser.franchiseName || 'ACS Solar Territory'}
            </h2>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                {currentUser.franchiseId || 'ACS-MH-01'}
              </span>
              <span>•</span>
              <span>{currentFranchise?.city || 'Pune Hub'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* HQ Announcement Banner if any */}
      {announcements.length > 0 && (
        <div
          onClick={() => onNavigate('more')}
          className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-600/10 to-transparent border border-emerald-500/30 flex items-center gap-3 cursor-pointer shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold">
            <Sun className="w-4 h-4 text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider">
                HQ Notice
              </span>
              <span className="text-[10px] text-slate-400">• {announcements[0].publishDate}</span>
            </div>
            <p className="text-xs font-bold text-white truncate">{announcements[0].title}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      )}

      {/* Quick Action Buttons */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Quick Actions
        </span>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <button
            id="action-add-lead-btn"
            type="button"
            onClick={onOpenAddLead}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 leading-tight">+ Lead</span>
          </button>

          <button
            id="action-add-customer-btn"
            type="button"
            onClick={onOpenAddCustomer}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-400/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <Contact className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 leading-tight">+ Client</span>
          </button>

          {/* User Requested: PM Surya Ghar Customer Upload in Quick Action Menu */}
          <button
            id="action-pm-surya-ghar-btn"
            type="button"
            onClick={onOpenPMSuryaGhar}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-500/40 hover:border-amber-400 transition-all text-center group shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center mb-1 shadow-inner group-hover:scale-110 transition-transform">
              <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-amber-300 leading-tight">+ PM Surya Ghar</span>
          </button>

          <button
            id="action-new-quote-btn"
            type="button"
            onClick={onOpenNewQuotation}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-400/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 leading-tight">+ Quote</span>
          </button>

          <button
            id="action-new-followup-btn"
            type="button"
            onClick={onOpenNewFollowup}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-400/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 leading-tight">+ Followup</span>
          </button>

          <button
            id="action-new-project-btn"
            type="button"
            onClick={onOpenNewProject}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 leading-tight">+ Project</span>
          </button>

          <button
            id="action-hrms-attendance-btn"
            type="button"
            onClick={() => onNavigate('hrms_attendance')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 leading-tight">HRMS Punch</span>
          </button>

          {/* Field Staff Tracking Quick Action */}
          <button
            id="action-track-staff-btn"
            type="button"
            onClick={() => onNavigate('sales_location_tracker')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/50 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 leading-tight">Track Staff</span>
          </button>

          {/* GPS Photo Check-In Quick Action */}
          <button
            id="action-gps-photo-btn"
            type="button"
            onClick={() => {
              if (onOpenGPSPhoto) onOpenGPSPhoto();
              else onNavigate('sales_location_tracker');
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-b from-emerald-500/20 to-slate-900 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all text-center group shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-emerald-300 leading-tight">+ GPS Photo</span>
          </button>
        </div>
      </div>

      {/* Field Staff Live GPS Tracking & Geotag Photo Feed */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-black text-white">
                  Field Staff Live GPS & Geotag Photos
                </h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  {salesRepLiveStatus.filter(r => r.currentStatus !== 'OFF_DUTY').length} On Field
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Live carrier GPS tracking & Google Maps grounded survey photos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenGPSPhoto && (
              <button
                type="button"
                onClick={onOpenGPSPhoto}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow hover:brightness-110 active:scale-95 transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ GPS Photo</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('sales_location_tracker')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-[10px] flex items-center gap-1 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Full Radar →</span>
            </button>
          </div>
        </div>

        {/* Live Staff Mini Cards Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {salesRepLiveStatus.slice(0, 3).map(rep => (
            <div
              key={rep.userId}
              onClick={() => onNavigate('sales_location_tracker')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-emerald-500/40 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={rep.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={rep.userName}
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-400/50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{rep.userName}</h4>
                    <span className="text-[9px] text-slate-400">{rep.territoryBeat.split(' - ')[0]}</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                  {rep.currentStatus === 'AT_CLIENT' ? 'At Client' : rep.currentStatus === 'IN_TRANSIT' ? 'In Transit' : 'Active'}
                </span>
              </div>

              <div className="text-[10px] text-slate-300 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">{rep.lastAddress}</span>
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-850">
                <span className="flex items-center gap-1">
                  <Battery className="w-2.5 h-2.5 text-emerald-400" />
                  {rep.batteryLevel}%
                </span>
                <span className="font-mono text-emerald-400">{rep.todayDistanceKm} km</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${rep.latitude},${rep.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-sky-400 hover:underline flex items-center gap-0.5 font-bold"
                >
                  <span>Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Geotagged Photos Strip */}
        <div className="pt-1 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-emerald-400">
              <Camera className="w-3 h-3 text-emerald-400" />
              Latest GPS Watermarked Field Survey Photos
            </span>
            <span
              onClick={() => onNavigate('sales_location_tracker')}
              className="text-sky-400 cursor-pointer hover:underline lowercase font-mono"
            >
              view all {salesLocationLogs.filter(l => l.photoUrl).length} photos →
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {salesLocationLogs
              .filter(l => l.photoUrl)
              .slice(0, 4)
              .map(log => (
                <div
                  key={log.id}
                  onClick={() => onNavigate('sales_location_tracker')}
                  className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group cursor-pointer hover:border-emerald-400/50 transition-all shadow-sm"
                >
                  <img
                    src={log.photoUrl}
                    alt={log.locationName}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                  <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow">
                    GPS VERIFIED
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 text-left">
                    <span className="text-[10px] font-bold text-white block truncate leading-tight">
                      {log.locationName}
                    </span>
                    <span className="text-[8px] text-emerald-400 font-mono block">
                      {log.userName.split(' ')[0]} • {log.timeFormatted}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Performance Overview Widget */}
      <PerformanceOverviewWidget onNavigate={onNavigate} />

      {/* KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Operational KPIs
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold cursor-pointer" onClick={() => onNavigate('crm')}>
            Pipeline View →
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div
            onClick={() => onNavigate('crm')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-white">{totalLeads}</div>
            <div className="text-[9px] text-slate-400 font-medium">Total Leads</div>
          </div>

          <div
            onClick={() => onNavigate('crm')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-emerald-400">{newLeads}</div>
            <div className="text-[9px] text-slate-400 font-medium">New Leads</div>
          </div>

          <div
            onClick={() => onNavigate('crm')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-emerald-400">{todayFollowUps.length}</div>
            <div className="text-[9px] text-slate-400 font-medium">Today Calls</div>
          </div>

          <div
            onClick={() => onNavigate('crm')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-sky-400">{siteVisitsCount}</div>
            <div className="text-[9px] text-slate-400 font-medium">Site Visits</div>
          </div>

          <div
            onClick={() => onNavigate('quotations')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-white">{quotationsCount}</div>
            <div className="text-[9px] text-slate-400 font-medium">Quotes</div>
          </div>

          <div
            onClick={() => onNavigate('projects')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-indigo-400">{activeProjectsCount}</div>
            <div className="text-[9px] text-slate-400 font-medium">Active EPC</div>
          </div>

          <div
            onClick={() => onNavigate('projects')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-emerald-400">{completedProjectsCount}</div>
            <div className="text-[9px] text-slate-400 font-medium">Completed</div>
          </div>

          <div
            onClick={() => onNavigate('crm')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700"
          >
            <div className="text-base font-black text-rose-400">{pendingFollowUps}</div>
            <div className="text-[9px] text-slate-400 font-medium">Pending</div>
          </div>
        </div>
      </div>

      {/* Today's Follow-up Alerts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Today's Action Tasks ({todayFollowUps.length})
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium cursor-pointer" onClick={() => onNavigate('crm')}>
            View All
          </span>
        </div>

        {todayFollowUps.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No pending follow-ups scheduled for today. Good job!
          </div>
        ) : (
          <div className="space-y-2">
            {todayFollowUps.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{item.customerName}</span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {item.notes || 'Scheduled customer solar consultation'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${item.customerMobile || item.customerPhone || ''}`}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                    title="Call Customer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/91${(item.customerMobile || item.customerPhone || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(item.customerName)}%2C%20following%20up%20from%20ACS%20Solar.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Feed */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Recent Activity Feed
        </span>
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/60 text-xs">
          {notifications.slice(0, 3).map(notif => (
            <div key={notif.id} className="py-2 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-[11px]">{notif.title}</span>
                <span className="text-[9px] text-slate-500">{notif.createdAt}</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{notif.message}</p>
            </div>
          ))}
        </div>
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
