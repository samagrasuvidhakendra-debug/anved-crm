import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  LeaveType,
  FieldExpenseClaim,
  UserLayer,
  getUserLayer,
  getUserLayerTitle
} from '../../types';
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  Users,
  Navigation,
  FileText,
  DollarSign,
  Plus,
  Filter,
  Search,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  Car,
  Zap,
  Shield,
  Briefcase,
  Phone,
  RefreshCw,
  Camera,
  Coffee,
  Building2,
  CalendarDays,
  Flame,
  Award,
  ArrowUpRight,
  Layers,
  Fuel
} from 'lucide-react';
import { FuelSupportManagementView } from '../hrms/FuelSupportManagementView';

interface HRMSAttendanceViewProps {
  onBack?: () => void;
  onNavigateToLocationTracker?: () => void;
}

export const HRMSAttendanceView: React.FC<HRMSAttendanceViewProps> = ({
  onBack,
  onNavigateToLocationTracker
}) => {
  const {
    currentUser,
    isSuperAdmin,
    allFranchises,
    allUsers,
    attendanceRecords,
    leaveRequests,
    expenseClaims,
    filteredAttendanceRecords,
    filteredLeaveRequests,
    filteredExpenseClaims,
    filteredFuelRecords,
    punchIn,
    punchOut,
    updateAttendanceStatus,
    applyLeave,
    updateLeaveStatus,
    submitExpenseClaim,
    updateExpenseClaimStatus,
    selectedAdminFranchiseFilter,
    setSelectedAdminFranchiseFilter
  } = useApp();

  const isFranchiseOwner = currentUser.role === 'FRANCHISE_OWNER';
  const isManagement = isSuperAdmin || isFranchiseOwner;
  const userLayer = getUserLayer(currentUser.role);
  const isFieldTeam = userLayer === 'FIELD_VISIT_TEAM';
  const isOfficeTelecaller = userLayer === 'OFFICE_SALES_TELECALLER';

  // Active view tab
  const [activeTab, setActiveTab] = useState<
    'daily_register' | 'field_telemetry' | 'leaves' | 'travel_claims' | 'my_timesheet'
  >(isManagement ? 'daily_register' : 'my_timesheet');

  // Layer filter for Management
  const [selectedLayerFilter, setSelectedLayerFilter] = useState<'ALL' | 'OFFICE' | 'FIELD'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modals & Form states
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [showTravelClaimModal, setShowTravelClaimModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // GPS state for Punch In
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    address: string;
    loading: boolean;
    error?: string;
  }>({
    lat: 19.1136,
    lng: 72.8697,
    accuracy: 9,
    address: 'Andheri West / Lokhandwala Link Road, Mumbai',
    loading: false
  });

  const fetchLiveGPS = () => {
    setGpsLocation(prev => ({ ...prev, loading: true, error: undefined }));
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setGpsLocation({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            accuracy: Math.round(pos.coords.accuracy),
            address: `Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)} (GPS Verified)`,
            loading: false
          });
          showToast('Satellite GPS coordinates locked successfully!');
        },
        () => {
          // Fallback mock location for demo environment
          setGpsLocation({
            lat: 19.1136,
            lng: 72.8697,
            accuracy: 8,
            address: 'Andheri West Commercial Hub, Mumbai (ACS Rooftop Beat)',
            loading: false
          });
          showToast('GPS coordinates calibrated.');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setGpsLocation(prev => ({
        ...prev,
        loading: false,
        address: 'Andheri West / MIDC Solar Zone'
      }));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Today's attendance record for active user
  const todayStr = currentTime.toISOString().split('T')[0];
  const myTodayRecord = attendanceRecords.find(
    r => r.userId === currentUser.id && r.date === todayStr
  );

  // Self Punch In handler
  const handleSelfPunchIn = () => {
    const record = punchIn({
      punchInLatitude: gpsLocation.lat,
      punchInLongitude: gpsLocation.lng,
      punchInAccuracy: gpsLocation.accuracy,
      punchInAddress: isFieldTeam ? gpsLocation.address : 'ACS Solar Branch Office, Desk Check-In',
      status: isFieldTeam ? 'ON_FIELD' : 'PRESENT',
      notes: isFieldTeam
        ? 'Field visiting team started daily rooftop survey route.'
        : 'Office sales & telecalling desk active.'
    });
    showToast(`Punch In Recorded at ${record.punchInTime} successfully!`);
  };

  // Self Punch Out handler
  const handleSelfPunchOut = () => {
    if (!myTodayRecord) return;
    punchOut(myTodayRecord.id, {
      punchOutAddress: isFieldTeam ? gpsLocation.address : 'ACS Solar Branch Office'
    });
    showToast('Punch Out recorded. Have a great evening!');
  };

  // Stats calculation
  const totalStaffCount = allUsers.filter(u =>
    isSuperAdmin
      ? selectedAdminFranchiseFilter === 'all'
        ? true
        : u.franchiseId === selectedAdminFranchiseFilter
      : u.franchiseId === currentUser.franchiseId
  ).length;

  const todayRecords = attendanceRecords.filter(r => r.date === todayStr);
  const presentCount = todayRecords.filter(
    r => r.status === 'PRESENT' || r.status === 'ON_FIELD' || r.status === 'LATE'
  ).length;
  const onFieldCount = todayRecords.filter(r => r.status === 'ON_FIELD').length;
  const onLeaveCount = leaveRequests.filter(
    l => l.status === 'APPROVED' && l.startDate <= todayStr && l.endDate >= todayStr
  ).length;
  const pendingLeavesCount = leaveRequests.filter(l => l.status === 'PENDING').length;
  const pendingClaimsCount = expenseClaims.filter(c => c.status === 'PENDING').length;

  // Filtered registers
  const displayAttendance = filteredAttendanceRecords.filter(rec => {
    const matchesSearch =
      (rec.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.franchiseName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.punchInAddress || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedLayerFilter === 'OFFICE') {
      return (
        rec.userLayer === 'OFFICE_SALES_TELECALLER' ||
        rec.userRole === 'SALES_MANAGER' ||
        rec.userRole === 'ACCOUNT_STAFF'
      );
    }
    if (selectedLayerFilter === 'FIELD') {
      return (
        rec.userLayer === 'FIELD_VISIT_TEAM' ||
        rec.userRole === 'SITE_SURVEYOR' ||
        rec.userRole === 'SALES_EXECUTIVE' ||
        rec.userRole === 'INSTALLATION_TEAM'
      );
    }
    return true;
  });

  // Leave Form State
  const [leaveFormData, setLeaveFormData] = useState({
    leaveType: 'CASUAL_LEAVE' as LeaveType,
    startDate: todayStr,
    endDate: todayStr,
    totalDays: 1,
    reason: ''
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveFormData.reason.trim()) {
      showToast('Please provide a reason for leave.');
      return;
    }
    applyLeave({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userLayer,
      franchiseId: currentUser.franchiseId,
      franchiseName: currentUser.franchiseName || 'ACS Solar',
      leaveType: leaveFormData.leaveType,
      startDate: leaveFormData.startDate,
      endDate: leaveFormData.endDate,
      totalDays: Number(leaveFormData.totalDays) || 1,
      reason: leaveFormData.reason
    });
    setShowApplyLeaveModal(false);
    showToast('Leave request submitted to Franchise Owner / Super Admin.');
    setLeaveFormData({
      leaveType: 'CASUAL_LEAVE',
      startDate: todayStr,
      endDate: todayStr,
      totalDays: 1,
      reason: ''
    });
  };

  // Travel Claim Form State
  const [travelFormData, setTravelFormData] = useState({
    purpose: '',
    travelMode: 'BIKE' as 'BIKE' | 'CAR' | 'PUBLIC_TRANSIT',
    startingKm: 12450,
    endingKm: 12485,
    foodMiscAmount: 100
  });

  const calculatedKm = Math.max(0, travelFormData.endingKm - travelFormData.startingKm);
  const perKmRate = travelFormData.travelMode === 'BIKE' ? 5.0 : travelFormData.travelMode === 'CAR' ? 9.0 : 0;
  const calculatedFuel = calculatedKm * perKmRate;
  const calculatedTotalClaim = calculatedFuel + Number(travelFormData.foodMiscAmount || 0);

  const handleSubmitTravelClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelFormData.purpose.trim()) {
      showToast('Please specify the site visit purpose.');
      return;
    }
    submitExpenseClaim({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      franchiseId: currentUser.franchiseId,
      franchiseName: currentUser.franchiseName || 'ACS Solar',
      date: todayStr,
      purpose: travelFormData.purpose,
      travelMode: travelFormData.travelMode,
      startingKm: travelFormData.startingKm,
      endingKm: travelFormData.endingKm,
      totalKm: calculatedKm,
      perKmRate,
      fuelAmount: calculatedFuel,
      foodMiscAmount: Number(travelFormData.foodMiscAmount || 0),
      totalClaimAmount: calculatedTotalClaim,
      notes: `Field route: ${calculatedKm} km traveled. Rate: ₹${perKmRate}/km.`
    });
    setShowTravelClaimModal(false);
    showToast(`Travel claim of ₹${calculatedTotalClaim} submitted successfully!`);
  };

  return (
    <div id="hrms-attendance-view" className="space-y-4 text-white max-w-6xl mx-auto animate-in fade-in duration-150 pb-12">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-xl sticky top-2 z-40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {getUserLayerTitle(userLayer)}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
              <FingerprintIcon className="w-6 h-6 text-amber-400" /> Attendance & HRMS Operations
            </h1>
            <p className="text-xs text-slate-400">
              {isSuperAdmin
                ? 'Centralized personnel attendance, field visit geo-tracking, leave registry & travel claims.'
                : isFranchiseOwner
                ? `Franchise workforce management for ${currentUser.franchiseName || 'your branch'}.`
                : isFieldTeam
                ? 'Field visiting team portal — GPS punch-in, rooftop site logs, and daily travel claims.'
                : 'Office sales & telecalling desk attendance, call targets & leave applications.'}
            </p>
          </div>

          {/* Action shortcuts */}
          <div className="flex items-center gap-2 flex-wrap">
            {onNavigateToLocationTracker && (
              <button
                onClick={onNavigateToLocationTracker}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-rose-400" />
                <span>Field Team GPS Tracker</span>
              </button>
            )}

            <button
              onClick={() => setShowApplyLeaveModal(true)}
              className="py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Apply Leave</span>
            </button>

            {isFieldTeam && (
              <button
                onClick={() => setActiveTab('travel_claims')}
                className="py-2 px-3 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>Fuel Support</span>
              </button>
            )}
          </div>
        </div>

        {/* Super Admin Franchise Filter Bar */}
        {isSuperAdmin && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2 text-slate-300">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">Franchise Scope:</span>
              <select
                value={selectedAdminFranchiseFilter}
                onChange={e => setSelectedAdminFranchiseFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Franchises & Headquarters Network</option>
                {allFranchises.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.franchiseName} ({f.city})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] text-slate-400">
              Showing records for {totalStaffCount} registered team members
            </span>
          </div>
        )}
      </div>

      {/* Persona Punch-In / Punch-Out Card (Personal Staff Punch Console) */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                My Shift Console • {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider border ${
                  myTodayRecord?.punchInTime
                    ? myTodayRecord.punchOutTime
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                {myTodayRecord?.punchInTime
                  ? myTodayRecord.punchOutTime
                    ? 'Shift Completed'
                    : `Active On Shift (${myTodayRecord.status})`
                  : 'Not Punched In Today'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 pt-0.5">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                In: {myTodayRecord?.punchInTime || '--:--'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-white">
                <Coffee className="w-3.5 h-3.5 text-slate-400" />
                Out: {myTodayRecord?.punchOutTime || '--:--'}
              </span>
              <span>•</span>
              <span className="text-slate-400">
                Shift Hours: <strong className="text-white">{myTodayRecord?.totalWorkingHours || 0} hrs</strong>
              </span>
            </div>

            {/* Geolocation Tag / Desk Verification */}
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">
                {isFieldTeam
                  ? `GPS Verification: ${gpsLocation.address}`
                  : `Office IP Desk Verification: ACS Solar Branch Premises`}
              </span>
              {isFieldTeam && (
                <button
                  onClick={fetchLiveGPS}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                  title="Refresh GPS Coordinates"
                >
                  <RefreshCw className={`w-3 h-3 ${gpsLocation.loading ? 'animate-spin text-amber-400' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 justify-end">
            {!myTodayRecord?.punchInTime ? (
              <button
                onClick={handleSelfPunchIn}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <FingerprintIcon className="w-5 h-5 text-slate-950" />
                <span>Punch In Now</span>
              </button>
            ) : !myTodayRecord.punchOutTime ? (
              <button
                onClick={handleSelfPunchOut}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Punch Out (End Shift)</span>
              </button>
            ) : (
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Shift Concluded
                </span>
                <span className="text-[10px] text-slate-400">Total: {myTodayRecord.totalWorkingHours} hrs recorded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Executive KPI Matrix (For Super Admin and Franchise Owners) */}
      {isManagement && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">Total Staff</span>
            <div className="text-lg font-black text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              <span>{totalStaffCount}</span>
            </div>
            <span className="text-[9px] text-slate-500">Across active roster</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">Present Today</span>
            <div className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{presentCount}</span>
            </div>
            <span className="text-[9px] text-slate-500">
              {totalStaffCount > 0 ? Math.round((presentCount / totalStaffCount) * 100) : 0}% turn-out
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">On Field Visits</span>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>{onFieldCount}</span>
            </div>
            <span className="text-[9px] text-slate-500">Rooftop surveys active</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">On Approved Leave</span>
            <div className="text-lg font-black text-indigo-400 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>{onLeaveCount}</span>
            </div>
            <span className="text-[9px] text-slate-500">Sanctioned leaves</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">Leave Requests</span>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{pendingLeavesCount}</span>
            </div>
            <span className="text-[9px] text-slate-500">{pendingLeavesCount} awaiting approval</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">Fuel Support</span>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1.5">
              <Fuel className="w-4 h-4 text-amber-400" />
              <span>₹{filteredFuelRecords.reduce((sum, r) => sum + r.fuelAmount, 0).toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[9px] text-slate-500">{filteredFuelRecords.length} fuel records</span>
          </div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {isManagement && (
            <>
              <button
                onClick={() => setActiveTab('daily_register')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'daily_register'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Daily Register</span>
              </button>

              <button
                onClick={() => setActiveTab('field_telemetry')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'field_telemetry'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Field Team Geotags</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('leaves')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'leaves'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Leave Registry {pendingLeavesCount > 0 && `(${pendingLeavesCount})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('travel_claims')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'travel_claims'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Fuel Support ({filteredFuelRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_timesheet')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'my_timesheet'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Timesheet & Calendar</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY ATTENDANCE REGISTER */}
      {activeTab === 'daily_register' && (
        <div className="space-y-4">
          {/* Controls & Layer Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, franchise, or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Layer Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setSelectedLayerFilter('ALL')}
                className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedLayerFilter === 'ALL'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Personnel
              </button>
              <button
                onClick={() => setSelectedLayerFilter('OFFICE')}
                className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedLayerFilter === 'OFFICE'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Layer 3: Office Sales & Telecaller
              </button>
              <button
                onClick={() => setSelectedLayerFilter('FIELD')}
                className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedLayerFilter === 'FIELD'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Layer 4: Field Visiting Team
              </button>
            </div>
          </div>

          {/* Attendance Cards / Table */}
          <div className="space-y-2.5">
            {displayAttendance.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Attendance Records Found</h3>
                <p className="text-xs text-slate-400">No team members match the search query or layer filter.</p>
              </div>
            ) : (
              displayAttendance.map(rec => {
                const isField = rec.userLayer === 'FIELD_VISIT_TEAM';
                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <img
                        src={
                          rec.profilePhoto ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={rec.userName}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-700 shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white truncate">{rec.userName}</h4>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider border ${
                              isField
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            }`}
                          >
                            {isField ? 'Layer 4: Field Team' : 'Layer 3: Office Sales'}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {rec.franchiseName}
                          </span>
                        </div>

                        {/* Location / Telecalling status line */}
                        <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-1 truncate">
                          {isField ? (
                            <>
                              <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate text-slate-300">
                                {rec.punchInAddress || 'GPS Geotagged site check-in'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              <span className="truncate text-slate-300">
                                Office Desk • {rec.callsMadeCount || 35} Calls made today • {rec.leadsGeneratedCount || 4} Leads
                              </span>
                            </>
                          )}
                        </div>

                        {/* Field Visits or KM badge */}
                        {isField && rec.distanceCoveredKm !== undefined && (
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span className="text-amber-400 font-semibold">
                              🛣️ {rec.distanceCoveredKm} km traveled
                            </span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              📍 {rec.fieldVisitsCount || 3} Rooftop Surveys Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time details and status */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0">
                      <div className="text-left md:text-right space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center md:justify-end gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rec.punchInTime || '--:--'}</span>
                          <span className="text-slate-500">→</span>
                          <span>{rec.punchOutTime || 'Active'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rec.totalWorkingHours ? `${rec.totalWorkingHours} hrs on shift` : 'Punch In recorded'}
                        </div>
                      </div>

                      {/* Status badge with manual override selector for Management */}
                      {isManagement ? (
                        <select
                          value={rec.status}
                          onChange={e => updateAttendanceStatus(rec.id, e.target.value as AttendanceStatus)}
                          className={`text-[10px] font-bold py-1 px-2 rounded-xl border font-mono focus:outline-none cursor-pointer ${
                            rec.status === 'PRESENT'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : rec.status === 'ON_FIELD'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : rec.status === 'LATE'
                              ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                              : rec.status === 'HALF_DAY'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          <option value="PRESENT">PRESENT</option>
                          <option value="ON_FIELD">ON_FIELD</option>
                          <option value="LATE">LATE</option>
                          <option value="HALF_DAY">HALF_DAY</option>
                          <option value="ON_LEAVE">ON_LEAVE</option>
                          <option value="ABSENT">ABSENT</option>
                        </select>
                      ) : (
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl border ${
                            rec.status === 'PRESENT' || rec.status === 'ON_FIELD'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {rec.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FIELD VISITING TEAM GEOTAGS & TELEMETRY */}
      {activeTab === 'field_telemetry' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-400" />
                Live Field Visiting Team GPS Geotags
              </h3>
              {onNavigateToLocationTracker && (
                <button
                  onClick={onNavigateToLocationTracker}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <span>Open Full Satellite Tracker</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Live rooftop surveyors, field engineers, and executive visit logs with satellite coordinates & travel metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAttendanceRecords
              .filter(
                r =>
                  r.userLayer === 'FIELD_VISIT_TEAM' ||
                  r.userRole === 'SITE_SURVEYOR' ||
                  r.userRole === 'SALES_EXECUTIVE'
              )
              .map(rec => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          rec.profilePhoto ||
                          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={rec.userName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{rec.userName}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-mono text-amber-400 font-semibold">{rec.userRole}</span>
                          <span>•</span>
                          <span>{rec.franchiseName}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        rec.status === 'ON_FIELD'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  {/* Coordinates & Accuracy */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> Current Geo-Position:
                      </span>
                      <span className="font-mono text-[10px] text-amber-300 font-bold">
                        {rec.punchInLatitude ? `${rec.punchInLatitude} N, ${rec.punchInLongitude} E` : '19.1136 N, 72.8697 E'}
                      </span>
                    </div>

                    <div className="text-white font-medium text-[11px] truncate">
                      {rec.punchInAddress || 'Andheri West / Lokhandwala Link Road Rooftop Zone'}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>GPS Precision: ±{rec.punchInAccuracy || 8} meters</span>
                      <span className="text-emerald-400 font-semibold">Satellite Signal Strong</span>
                    </div>
                  </div>

                  {/* Performance stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">KM Traveled</span>
                      <span className="font-bold text-white">{rec.distanceCoveredKm || 24.5} km</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Surveys Today</span>
                      <span className="font-bold text-amber-400">{rec.fieldVisitsCount || 3} sites</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Shift Hours</span>
                      <span className="font-bold text-emerald-400">{rec.totalWorkingHours || 6.2} hrs</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href={`tel:${rec.userMobile}`}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call Field Rep</span>
                    </a>
                    {onNavigateToLocationTracker && (
                      <button
                        onClick={onNavigateToLocationTracker}
                        className="py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Live Route</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEAVE REGISTRY & APPROVALS */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" /> Leave Management & Approvals
              </h3>
              <p className="text-xs text-slate-400">
                Submit and approve Casual, Sick, Paid, or Comp-off leaves for office sales & field visiting teams.
              </p>
            </div>
            <button
              onClick={() => setShowApplyLeaveModal(true)}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New Leave</span>
            </button>
          </div>

          {/* Leave Records list */}
          <div className="space-y-2.5">
            {filteredLeaveRequests.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Leave Requests</h3>
                <p className="text-xs text-slate-400">No active leave applications found for your scope.</p>
              </div>
            ) : (
              filteredLeaveRequests.map(leave => {
                const canReview = isManagement && leave.status === 'PENDING';
                return (
                  <div
                    key={leave.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{leave.userName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                              {leave.leaveType.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400">• {leave.franchiseName}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Duration: <strong className="text-white">{leave.startDate}</strong> to{' '}
                            <strong className="text-white">{leave.endDate}</strong> ({leave.totalDays} day{leave.totalDays > 1 ? 's' : ''})
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider border self-start sm:self-auto ${
                          leave.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : leave.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Reason for Leave:</span>
                      <p className="mt-0.5">{leave.reason}</p>
                    </div>

                    {leave.reviewedBy && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Reviewed by: <strong className="text-slate-200">{leave.reviewedBy}</strong></span>
                        {leave.reviewRemarks && <span>• Remarks: "{leave.reviewRemarks}"</span>}
                      </div>
                    )}

                    {/* Management Decision Buttons */}
                    {canReview && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => updateLeaveStatus(leave.id, 'REJECTED', 'Duty requirements at current peak capacity')}
                          className="py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(leave.id, 'APPROVED', 'Approved by franchise authority')}
                          className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
                        >
                          Approve Leave
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FUEL / FIELD TRAVEL SUPPORT (SIMPLIFIED SECTION 10) */}
      {activeTab === 'travel_claims' && (
        <FuelSupportManagementView />
      )}

      {/* TAB 5: MY MONTHLY TIMESHEET & CALENDAR */}
      {activeTab === 'my_timesheet' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-400" />
                  Monthly Attendance Timesheet ({currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
                </h3>
                <p className="text-xs text-slate-400">
                  Detailed shift audit trail, working hours, and monthly payroll attendance quotient.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Present / On Field
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Half Day
                </span>
                <span className="flex items-center gap-1 text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" /> Leave
                </span>
              </div>
            </div>

            {/* Monthly Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-bold text-slate-500 text-[10px] uppercase tracking-wider py-1">
                  {day}
                </div>
              ))}

              {/* Sample calendar day cells for September */}
              {Array.from({ length: 30 }, (_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === 19;
                const isPast = dayNum < 19;
                const isWeekend = (dayNum % 7 === 6 || dayNum % 7 === 0);
                const isPresent = isPast && !isWeekend;

                return (
                  <div
                    key={dayNum}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-between min-h-[56px] transition-all ${
                      isToday
                        ? 'bg-amber-500/20 border-amber-500/60 ring-2 ring-amber-500/20'
                        : isPresent
                        ? 'bg-slate-900/90 border-slate-800'
                        : isWeekend
                        ? 'bg-slate-950/40 border-slate-900 text-slate-600'
                        : 'bg-slate-950/20 border-slate-900 text-slate-600'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isToday ? 'text-amber-400' : 'text-slate-300'}`}>
                      {dayNum}
                    </span>

                    {isToday && (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-extrabold uppercase">
                        Today
                      </span>
                    )}

                    {isPresent && !isToday && (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-semibold">
                        {isFieldTeam ? 'Field' : '9.0h'}
                      </span>
                    )}

                    {isWeekend && (
                      <span className="text-[8px] text-slate-600 font-medium">Off</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Apply For Leave
              </h3>
              <button
                onClick={() => setShowApplyLeaveModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Leave Category</label>
                <select
                  value={leaveFormData.leaveType}
                  onChange={e => setLeaveFormData({ ...leaveFormData, leaveType: e.target.value as LeaveType })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-400 font-medium"
                >
                  <option value="CASUAL_LEAVE">Casual Leave (CL) - Balance: 6 days</option>
                  <option value="SICK_LEAVE">Sick Leave (SL) - Balance: 4 days</option>
                  <option value="PAID_LEAVE">Paid Leave (PL) - Balance: 12 days</option>
                  <option value="COMP_OFF">Compensatory Off (Comp-Off)</option>
                  <option value="UNPAID_LEAVE">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">From Date</label>
                  <input
                    type="date"
                    value={leaveFormData.startDate}
                    onChange={e => setLeaveFormData({ ...leaveFormData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">To Date</label>
                  <input
                    type="date"
                    value={leaveFormData.endDate}
                    onChange={e => setLeaveFormData({ ...leaveFormData, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Total Days</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={leaveFormData.totalDays}
                  onChange={e => setLeaveFormData({ ...leaveFormData, totalDays: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-400 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the reason for leave request..."
                  value={leaveFormData.reason}
                  onChange={e => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT TRAVEL EXPENSE CLAIM MODAL (TA/DA) */}
      {showTravelClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" /> Field Visit Travel Claim (TA/DA)
              </h3>
              <button
                onClick={() => setShowTravelClaimModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTravelClaim} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Site Survey / Client Visit Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borivali West 5kW rooftop feasibility study"
                  value={travelFormData.purpose}
                  onChange={e => setTravelFormData({ ...travelFormData, purpose: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mode of Travel</label>
                <select
                  value={travelFormData.travelMode}
                  onChange={e =>
                    setTravelFormData({
                      ...travelFormData,
                      travelMode: e.target.value as 'BIKE' | 'CAR' | 'PUBLIC_TRANSIT'
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="BIKE">Two-Wheeler (Bike) — ₹5.00 / km</option>
                  <option value="CAR">Four-Wheeler (Car) — ₹9.00 / km</option>
                  <option value="PUBLIC_TRANSIT">Public Transit / Auto / Metro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Starting Odometer (KM)</label>
                  <input
                    type="number"
                    value={travelFormData.startingKm}
                    onChange={e => setTravelFormData({ ...travelFormData, startingKm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ending Odometer (KM)</label>
                  <input
                    type="number"
                    value={travelFormData.endingKm}
                    onChange={e => setTravelFormData({ ...travelFormData, endingKm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Food / Misc Daily Allowance (₹)</label>
                <input
                  type="number"
                  value={travelFormData.foodMiscAmount}
                  onChange={e => setTravelFormData({ ...travelFormData, foodMiscAmount: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400 font-bold"
                />
              </div>

              {/* Calculated Summary Callout */}
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-slate-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Total Distance Covered:</span>
                  <strong className="text-white">{calculatedKm} km</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fuel Allowance (@ ₹{perKmRate}/km):</span>
                  <strong className="text-white">₹{calculatedFuel}</strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-sm">
                  <span className="font-bold text-white">Total Claim Amount:</span>
                  <strong className="font-black text-emerald-400">₹{calculatedTotalClaim}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTravelClaimModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors shadow"
                >
                  Submit Travel Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Fingerprint Icon Component for Attendance
function FingerprintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 3" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </svg>
  );
}
