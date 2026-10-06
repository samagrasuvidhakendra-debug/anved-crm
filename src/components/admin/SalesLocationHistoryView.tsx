import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesLocationLog, SalesRepLiveStatus, SalesActivityType } from '../../types';
import {
  MapPin,
  Navigation,
  Battery,
  Wifi,
  Clock,
  Calendar,
  Filter,
  Search,
  User,
  Building,
  RefreshCw,
  FileDown,
  ChevronRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  Car,
  Briefcase,
  Layers,
  Phone,
  ArrowUpRight,
  Plus,
  X,
  Eye,
  SlidersHorizontal,
  Route,
  Zap,
  Radio,
  Camera,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { FieldStaffMapRadar } from '../maps/FieldStaffMapRadar';
import { MapsGroundingDrawer } from '../maps/MapsGroundingDrawer';
import { GPSPhotoCheckInModal } from '../maps/GPSPhotoCheckInModal';

export const SalesLocationHistoryView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const {
    currentUser,
    isSuperAdmin,
    allFranchises,
    allUsers,
    salesLocationLogs,
    salesRepLiveStatus,
    filteredSalesLocationLogs,
    filteredSalesRepLiveStatus,
    addSalesLocationLog,
    pingSalesRepGPS,
    selectedAdminFranchiseFilter,
    setSelectedAdminFranchiseFilter
  } = useApp();

  // Filters
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>(
    isSuperAdmin ? selectedAdminFranchiseFilter || 'all' : currentUser.franchiseId
  );
  const [selectedRepId, setSelectedRepId] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-19');

  // Selected Log for detail modal
  const [activeLogModal, setActiveLogModal] = useState<SalesLocationLog | null>(null);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState<boolean>(false);
  const [isGpsPhotoModalOpen, setIsGpsPhotoModalOpen] = useState<boolean>(false);
  const [mapsGroundingTarget, setMapsGroundingTarget] = useState<{
    name: string;
    lat: number;
    lng: number;
    address: string;
    city?: string;
  } | null>(null);
  const [showMapRadar, setShowMapRadar] = useState<boolean>(true);
  const [isPinging, setIsPinging] = useState<string | null>(null);

  // Form state for adding manual log
  const [newLogUserId, setNewLogUserId] = useState<string>('USR-004');
  const [newLogActivity, setNewLogActivity] = useState<SalesActivityType>('CLIENT_VISIT');
  const [newLogLocationName, setNewLogLocationName] = useState<string>('');
  const [newLogLandmark, setNewLogLandmark] = useState<string>('');
  const [newLogLeadName, setNewLogLeadName] = useState<string>('');
  const [newLogNotes, setNewLogNotes] = useState<string>('');
  const [newLogDistance, setNewLogDistance] = useState<string>('2.5');

  // Sales reps available
  const salesStaff = useMemo(() => {
    return allUsers.filter(u => {
      const isSales = u.role === 'SALES_EXECUTIVE' || u.role === 'SALES_MANAGER' || u.role === 'SITE_SURVEYOR';
      if (!isSales) return false;
      if (isSuperAdmin) {
        if (selectedFranchiseId === 'all') return true;
        return u.franchiseId === selectedFranchiseId;
      }
      return u.franchiseId === currentUser.franchiseId;
    });
  }, [allUsers, isSuperAdmin, selectedFranchiseId, currentUser]);

  // Filtered live status reps
  const displayReps = useMemo(() => {
    return filteredSalesRepLiveStatus.filter(rep => {
      if (selectedFranchiseId !== 'all' && rep.franchiseId !== selectedFranchiseId) return false;
      if (selectedRepId !== 'all' && rep.userId !== selectedRepId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rep.userName.toLowerCase().includes(q) ||
          rep.lastAddress.toLowerCase().includes(q) ||
          rep.franchiseName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filteredSalesRepLiveStatus, selectedFranchiseId, selectedRepId, searchQuery]);

  // Filtered logs
  const displayLogs = useMemo(() => {
    return salesLocationLogs.filter(log => {
      if (selectedFranchiseId !== 'all' && log.franchiseId !== selectedFranchiseId) return false;
      if (selectedRepId !== 'all' && log.userId !== selectedRepId) return false;
      if (selectedActivity !== 'all' && log.activityType !== selectedActivity) return false;
      if (selectedDate && log.date !== selectedDate) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.userName.toLowerCase().includes(q) ||
          log.locationName.toLowerCase().includes(q) ||
          (log.customerName && log.customerName.toLowerCase().includes(q)) ||
          (log.leadName && log.leadName.toLowerCase().includes(q)) ||
          (log.landmark && log.landmark.toLowerCase().includes(q)) ||
          (log.notes && log.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [salesLocationLogs, selectedFranchiseId, selectedRepId, selectedActivity, selectedDate, searchQuery]);

  // Summary Metrics
  const totalVisitsToday = displayLogs.filter(
    l => l.activityType === 'CLIENT_VISIT' || l.activityType === 'LEAD_MEETING' || l.activityType === 'SITE_SURVEY'
  ).length;

  const totalDistanceCovered = useMemo(() => {
    const repDistances = displayReps.reduce((sum, r) => sum + (r.todayDistanceKm || 0), 0);
    return repDistances.toFixed(1);
  }, [displayReps]);

  const activeRepsOnDuty = displayReps.filter(r => r.currentStatus !== 'OFF_DUTY').length;

  // Handle GPS ping
  const handlePing = (userId: string) => {
    setIsPinging(userId);
    pingSalesRepGPS(userId);
    setTimeout(() => {
      setIsPinging(null);
    }, 900);
  };

  // Submit on-demand location log
  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = allUsers.find(u => u.id === newLogUserId);
    if (!rep) return;

    addSalesLocationLog({
      userId: rep.id,
      userName: rep.name,
      userRole: rep.role,
      userMobile: rep.mobile,
      profilePhoto: rep.profilePhoto,
      franchiseId: rep.franchiseId,
      franchiseName: rep.franchiseName || 'ACS Solar',
      latitude: 19.1205 + (Math.random() - 0.5) * 0.02,
      longitude: 72.852 + (Math.random() - 0.5) * 0.02,
      accuracyMeters: Math.floor(Math.random() * 4) + 3,
      speedKmH: newLogActivity === 'TRANSIT' ? 32 : 0,
      batteryLevel: Math.floor(Math.random() * 25) + 70,
      networkStatus: '5G Real-Time Telemetry',
      locationName: newLogLocationName || 'Field Location, Mumbai',
      landmark: newLogLandmark,
      city: rep.city || 'Mumbai',
      state: rep.state || 'Maharashtra',
      activityType: newLogActivity,
      status: 'COMPLETED',
      leadName: newLogLeadName,
      customerName: newLogLeadName,
      notes: newLogNotes || 'Manual field check-in recorded by Super Admin command center.',
      distanceCoveredKm: parseFloat(newLogDistance) || 1.5,
      durationMinutes: 30
    });

    setIsAddLogModalOpen(false);
    setNewLogLocationName('');
    setNewLogLandmark('');
    setNewLogLeadName('');
    setNewLogNotes('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Log ID',
      'Sales Rep',
      'Role',
      'Franchise',
      'Date',
      'Time',
      'Activity Type',
      'Location / Address',
      'Landmark',
      'Client / Lead',
      'Distance (km)',
      'Battery %',
      'GPS Accuracy',
      'Notes'
    ];
    const rows = displayLogs.map(l => [
      l.id,
      `"${l.userName}"`,
      l.userRole,
      `"${l.franchiseName}"`,
      l.date,
      l.timeFormatted,
      l.activityType,
      `"${l.locationName.replace(/"/g, '""')}"`,
      `"${(l.landmark || '').replace(/"/g, '""')}"`,
      `"${(l.customerName || l.leadName || '').replace(/"/g, '""')}"`,
      l.distanceCoveredKm || 0,
      `${l.batteryLevel}%`,
      `${l.accuracyMeters}m`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Location_History_${selectedDate}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <MapPin className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Sales Personnel GPS & Location History
              </h1>
              {isSuperAdmin && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Super Admin Full Control
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Real-time GPS telemetry, live movement breadcrumbs, battery monitoring, and client visit logs across all downline franchises.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="capture-gps-photo-btn"
              type="button"
              onClick={() => setIsGpsPhotoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
              title="Capture GPS camera photo with verified watermark"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>Capture GPS Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMapRadar(!showMapRadar)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                showMapRadar
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{showMapRadar ? 'Hide Map Radar' : 'Show Map Radar'}</span>
            </button>

            <button
              id="export-location-csv-btn"
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Export filtered location history to CSV"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              id="add-location-log-btn"
              type="button"
              onClick={() => setIsAddLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Manual Check-In</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>On-Duty Reps</span>
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-white">{activeRepsOnDuty}</span>
              <span className="text-[11px] text-slate-400">/ {displayReps.length} active</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Client Visits Today</span>
              <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-sky-400">{totalVisitsToday}</span>
              <span className="text-[11px] text-slate-400">meetings</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Field Distance</span>
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-amber-400">{totalDistanceCovered}</span>
              <span className="text-[11px] text-slate-400">km total</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>GPS Logs Recorded</span>
              <Route className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-purple-400">{displayLogs.length}</span>
              <span className="text-[11px] text-slate-400">points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Franchise Selector (Super Admin downline access) */}
          {isSuperAdmin && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Downline Franchise
              </label>
              <select
                id="filter-location-franchise"
                value={selectedFranchiseId}
                onChange={e => {
                  setSelectedFranchiseId(e.target.value);
                  setSelectedRepId('all');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Downline Franchises</option>
                {allFranchises.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.franchiseName} ({f.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sales Rep Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sales Representative
            </label>
            <select
              id="filter-location-salesrep"
              value={selectedRepId}
              onChange={e => setSelectedRepId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Sales Personnel ({salesStaff.length})</option>
              {salesStaff.map(rep => (
                <option key={rep.id} value={rep.id}>
                  {rep.name} ({rep.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Activity Type
            </label>
            <select
              id="filter-location-activity"
              value={selectedActivity}
              onChange={e => setSelectedActivity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Activities</option>
              <option value="CLIENT_VISIT">Client Visit</option>
              <option value="SITE_SURVEY">Site Survey</option>
              <option value="LEAD_MEETING">Lead Meeting</option>
              <option value="TRANSIT">In Transit</option>
              <option value="CHECK_IN">Check-In</option>
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                id="filter-location-date"
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search Location / Client
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="search-location-logs-input"
                type="text"
                placeholder="Search area, landmark, customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 0: Interactive Field Staff Map Radar (Live GPS)  */}
      {/* ======================================================== */}
      {showMapRadar && (
        <FieldStaffMapRadar
          reps={displayReps}
          logs={displayLogs}
          selectedRepId={selectedRepId}
          onSelectRep={userId => setSelectedRepId(userId)}
          onSelectLog={log => setActiveLogModal(log)}
          onInspectMapsGrounding={target =>
            setMapsGroundingTarget({ ...target, city: 'Pune' })
          }
        />
      )}

      {/* ======================================================== */}
      {/* SECTION 1: Live Field Radar & Personnel Status Cards     */}
      {/* ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            Live Sales Telemetry & Active Status
          </h2>
          <span className="text-xs text-slate-400">
            {displayReps.length} personnel monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayReps.map(rep => {
            const statusConfig = {
              AT_CLIENT: { label: 'At Client Site', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
              IN_TRANSIT: { label: 'In Transit', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
              ON_DUTY: { label: 'On Duty', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
              OFF_DUTY: { label: 'Off Duty', bg: 'bg-slate-800 text-slate-400 border-slate-700' }
            }[rep.currentStatus] || { label: rep.currentStatus, bg: 'bg-slate-800 text-slate-400 border-slate-700' };

            const isThisPinging = isPinging === rep.userId;

            return (
              <div
                key={rep.userId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: User info + Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        {rep.profilePhoto ? (
                          <img
                            src={rep.profilePhoto}
                            alt={rep.userName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                            {rep.userName.charAt(0)}
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-slate-900 ${
                            rep.currentStatus === 'AT_CLIENT'
                              ? 'bg-sky-400'
                              : rep.currentStatus === 'IN_TRANSIT'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          {rep.userName}
                        </h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-500" />
                          {rep.franchiseName}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusConfig.bg}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Territory & Active Lead */}
                  <div className="space-y-1.5 py-2 px-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-2.5 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-[11px] leading-tight text-slate-200">
                        {rep.lastAddress}
                      </span>
                    </div>

                    {rep.activeLeadName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium pt-0.5 border-t border-slate-800/60">
                        <Briefcase className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">Active Pitch: {rep.activeLeadName}</span>
                      </div>
                    )}
                  </div>

                  {/* Telemetry Stats: Battery, Accuracy, Distance */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] py-1 border-y border-slate-800/60 text-slate-400 mb-3">
                    <div>
                      <span className="block text-[10px] text-slate-500">Today's Run</span>
                      <span className="font-bold text-white">{rep.todayDistanceKm} km</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500">Visits Done</span>
                      <span className="font-bold text-sky-400">{rep.visitsCompletedToday} meetings</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500">Battery / GPS</span>
                      <span className="font-bold text-emerald-400 flex items-center justify-center gap-0.5">
                        <Battery className="w-3 h-3 text-emerald-400" />
                        {rep.batteryLevel}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pinged: {rep.lastPingTime}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${rep.latitude},${rep.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-sky-400 border border-slate-700 text-[11px] font-semibold flex items-center gap-1"
                      title="View live coordinates on Google Maps"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        setMapsGroundingTarget({
                          name: rep.userName,
                          lat: rep.latitude,
                          lng: rep.longitude,
                          address: rep.lastAddress,
                          city: rep.franchiseName
                        })
                      }
                      className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1"
                      title="Run Google Maps Grounded AI Intel (gemini-3.5-flash)"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Intel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePing(rep.userId)}
                      disabled={isThisPinging}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 border border-slate-700/80 transition-colors"
                      title="Request immediate GPS satellite fix"
                    >
                      <RefreshCw className={`w-3 h-3 text-emerald-400 ${isThisPinging ? 'animate-spin' : ''}`} />
                      <span>{isThisPinging ? 'Pinging...' : 'Ping'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRepId(rep.userId);
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 border border-emerald-500/30 transition-colors"
                    >
                      <span>Trail</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: Visual Route & Location Breadcrumb Trail      */}
      {/* ======================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-amber-400" />
              Chronological Location History & Breadcrumb Trail
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified GPS points, check-in markers, client meetings, and travel routes for {selectedDate}.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total Entries:</span>
            <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {displayLogs.length} logs
            </span>
          </div>
        </div>

        {displayLogs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white">No Location Logs Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No GPS track points match your filter criteria for {selectedDate}. Try clearing filters or click "Log Field Check-In".
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedFranchiseId('all');
                setSelectedRepId('all');
                setSelectedActivity('all');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-sky-500 before:to-emerald-500">
            {displayLogs.map((log, index) => {
              const isFirst = index === 0;
              const isLast = index === displayLogs.length - 1;

              const activityBadge = {
                CLIENT_VISIT: { label: 'Client Visit', icon: Briefcase, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
                SITE_SURVEY: { label: 'Site Survey', icon: Compass, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
                LEAD_MEETING: { label: 'Lead Meeting', icon: User, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
                TRANSIT: { label: 'In Transit', icon: Car, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
                CHECK_IN: { label: 'Check-In', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
                CHECK_OUT: { label: 'Check-Out', icon: CheckCircle2, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
                PMSG_VERIFICATION: { label: 'PM Surya Ghar', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' }
              }[log.activityType] || { label: log.activityType, icon: MapPin, color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' };

              const Icon = activityBadge.icon;

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-slate-900 shadow-md ${
                      isFirst
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : isLast
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 border border-slate-700 text-slate-300'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>

                  {/* Card Body */}
                  <div className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 transition-all shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-white">{log.userName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                          {log.franchiseName}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${activityBadge.bg} ${activityBadge.color}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {activityBadge.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="font-mono font-bold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {log.timeFormatted}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Battery className="w-3 h-3 text-emerald-400" />
                          {log.batteryLevel}%
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                          ±{log.accuracyMeters}m GPS
                        </span>
                      </div>
                    </div>

                    {/* Location Address & Landmark */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-start gap-1.5 text-xs text-slate-200 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{log.locationName}</span>
                      </div>
                      {log.landmark && (
                        <p className="text-[11px] text-slate-400 pl-5">
                          Landmark: {log.landmark} ({log.city}, {log.state})
                        </p>
                      )}
                    </div>

                    {/* Lead / Customer Association */}
                    {(log.customerName || log.leadName) && (
                      <div className="mb-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-sky-400" />
                          <span className="text-slate-300">
                            Client:{' '}
                            <strong className="text-white">
                              {log.customerName || log.leadName}
                            </strong>
                          </span>
                          {log.leadId && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {log.leadId}
                            </span>
                          )}
                        </div>
                        {log.distanceCoveredKm && (
                          <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            {log.distanceCoveredKm} km leg
                          </span>
                        )}
                      </div>
                    )}

                    {/* Visit Notes */}
                    {log.notes && (
                      <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded-xl border border-slate-800/60 italic leading-relaxed">
                        "{log.notes}"
                      </p>
                    )}

                    {/* Attached GPS Geotagged Photo Preview if present */}
                    {log.photoUrl && (
                      <div className="mb-2 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
                        <img
                          src={log.photoUrl}
                          alt="Geotagged Survey Photo"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[10px] font-mono text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
                          <Camera className="w-3 h-3" />
                          <span>GPS PHOTO EVIDENCE</span>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[9px] font-mono text-slate-300">
                          {log.latitude.toFixed(4)}° N, {log.longitude.toFixed(4)}° E
                        </div>
                      </div>
                    )}

                    {/* Footer Coordinates & View Details */}
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-[11px] text-slate-500 flex-wrap gap-2">
                      <span className="font-mono">
                        GPS: {log.latitude.toFixed(4)}° N, {log.longitude.toFixed(4)}° E • {log.networkStatus}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${log.latitude},${log.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                          title="Open coordinates in Google Maps"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Google Maps</span>
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            setMapsGroundingTarget({
                              name: log.userName,
                              lat: log.latitude,
                              lng: log.longitude,
                              address: log.locationName,
                              city: log.city
                            })
                          }
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                          title="Analyze Location via Google Maps Grounding (gemini-3.5-flash)"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>Maps Intel</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveLogModal(log)}
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-semibold transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: Inspect Telemetry & Geotag Details              */}
      {/* ======================================================== */}
      {activeLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-5 text-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    GPS Fix & Field Telemetry Record
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeLogModal.id} • {activeLogModal.timestamp}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveLogModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stylized Map / Photo Geotag Visual Box */}
            {activeLogModal.photoUrl ? (
              <div className="w-full rounded-2xl overflow-hidden border border-slate-800 mb-4 relative group">
                <img
                  src={activeLogModal.photoUrl}
                  alt="GPS Photo"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow">
                  <Camera className="w-3 h-3" />
                  <span>VERIFIED GPS PHOTO EVIDENCE</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur text-[11px] font-mono text-white flex items-center justify-between">
                  <span>LAT: {activeLogModal.latitude} | LNG: {activeLogModal.longitude}</span>
                  <span className="text-emerald-400">±{activeLogModal.accuracyMeters}m</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-44 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-4 mb-4 text-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/10">
                    <Navigation className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-0.5">
                    Verified Geotag Position
                  </h4>
                  <p className="text-[11px] font-mono text-emerald-400">
                    LAT: {activeLogModal.latitude} | LNG: {activeLogModal.longitude}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">
                    Precision: ±{activeLogModal.accuracyMeters} meters (Carrier High Precision)
                  </span>
                </div>
              </div>
            )}

            {/* Quick Map Actions inside Modal */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeLogModal.latitude},${activeLogModal.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sky-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const target = {
                    name: activeLogModal.userName,
                    lat: activeLogModal.latitude,
                    lng: activeLogModal.longitude,
                    address: activeLogModal.locationName,
                    city: activeLogModal.city
                  };
                  setActiveLogModal(null);
                  setMapsGroundingTarget(target);
                }}
                className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Maps Grounding</span>
              </button>
            </div>

            {/* Field Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Sales Representative
                </span>
                <span className="font-bold text-white">{activeLogModal.userName}</span>
                <span className="text-[11px] text-slate-400 block">{activeLogModal.userMobile}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Franchise Branch
                </span>
                <span className="font-bold text-white">{activeLogModal.franchiseName}</span>
                <span className="text-[11px] text-slate-400 block">{activeLogModal.city}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Activity Classification
                </span>
                <span className="font-bold text-amber-400">{activeLogModal.activityType}</span>
                <span className="text-[11px] text-slate-400 block">Status: {activeLogModal.status}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                  Device Telemetry
                </span>
                <span className="font-bold text-emerald-400">{activeLogModal.batteryLevel}% Battery</span>
                <span className="text-[11px] text-slate-400 block">{activeLogModal.networkStatus}</span>
              </div>
            </div>

            {/* Address & Notes */}
            <div className="space-y-2 text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Physical Site Address
                </span>
                <p className="text-slate-200">{activeLogModal.locationName}</p>
                {activeLogModal.landmark && (
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Landmark: {activeLogModal.landmark}
                  </p>
                )}
              </div>

              {activeLogModal.notes && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Meeting & Field Notes
                  </span>
                  <p className="text-slate-300 italic">{activeLogModal.notes}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveLogModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close Telemetry Modal
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Log Field Check-In On Demand                    */}
      {/* ======================================================== */}
      {isAddLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-5 text-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Record Field Check-In / Client Visit
                  </h3>
                  <p className="text-xs text-slate-400">
                    Submit instant on-demand location fix and meeting note to the system log.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sales Representative *
                </label>
                <select
                  value={newLogUserId}
                  onChange={e => setNewLogUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                >
                  {allUsers
                    .filter(u => u.role === 'SALES_EXECUTIVE' || u.role === 'SALES_MANAGER' || u.role === 'SITE_SURVEYOR')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role.replace('_', ' ')} - {u.franchiseName || u.franchiseId})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Activity Type *
                  </label>
                  <select
                    value={newLogActivity}
                    onChange={e => setNewLogActivity(e.target.value as SalesActivityType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="CLIENT_VISIT">Client Visit</option>
                    <option value="SITE_SURVEY">Site Survey</option>
                    <option value="LEAD_MEETING">Lead Meeting</option>
                    <option value="PMSG_VERIFICATION">PM Surya Ghar Verification</option>
                    <option value="TRANSIT">In Transit</option>
                    <option value="CHECK_IN">Shift Check-In</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Travel Leg Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLogDistance}
                    onChange={e => setNewLogDistance(e.target.value)}
                    placeholder="e.g. 3.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Physical Address / Building *
                </label>
                <input
                  type="text"
                  value={newLogLocationName}
                  onChange={e => setNewLogLocationName(e.target.value)}
                  placeholder="e.g. B-402 Sea Breeze Apts, 16th Road, Bandra West"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={newLogLandmark}
                    onChange={e => setNewLogLandmark(e.target.value)}
                    placeholder="e.g. Near Pali Hill Reservoir"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Client / Prospect Name
                  </label>
                  <input
                    type="text"
                    value={newLogLeadName}
                    onChange={e => setNewLogLeadName(e.target.value)}
                    placeholder="e.g. Vikram Shah"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Field Observations & Meeting Notes
                </label>
                <textarea
                  rows={3}
                  value={newLogNotes}
                  onChange={e => setNewLogNotes(e.target.value)}
                  placeholder="Summarize proposal discussion, subsidy verification, or roof shadow findings..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                >
                  Save Location Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: Live GPS Photo Capture & Watermark Camera       */}
      {/* ======================================================== */}
      <GPSPhotoCheckInModal
        isOpen={isGpsPhotoModalOpen}
        onClose={() => setIsGpsPhotoModalOpen(false)}
        onSubmitLog={newLog => {
          addSalesLocationLog(newLog as any);
        }}
        currentUser={{
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          mobile: currentUser.mobile,
          franchiseId: currentUser.franchiseId,
          franchiseName: currentUser.franchiseName
        }}
      />

      {/* ======================================================== */}
      {/* MODAL 4: Google Maps Grounding Field Intel Drawer        */}
      {/* ======================================================== */}
      <MapsGroundingDrawer
        isOpen={!!mapsGroundingTarget}
        onClose={() => setMapsGroundingTarget(null)}
        locationData={mapsGroundingTarget}
      />
    </div>
  );
};
