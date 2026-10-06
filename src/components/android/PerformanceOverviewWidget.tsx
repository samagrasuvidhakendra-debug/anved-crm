import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Users,
  FolderGit2,
  IndianRupee,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
  Sun,
  FileText,
  Compass,
  Calendar,
  UserCheck
} from 'lucide-react';

interface PerformanceOverviewWidgetProps {
  onNavigate: (tab: string) => void;
}

type TimeframeFilter = 'today' | 'week' | 'month' | 'all';

export const PerformanceOverviewWidget: React.FC<PerformanceOverviewWidgetProps> = ({
  onNavigate
}) => {
  const {
    leads,
    projects,
    quotations,
    followUps,
    filteredAttendanceRecords,
    currentUser
  } = useApp();

  const [timeframe, setTimeframe] = useState<TimeframeFilter>('all');

  // Helper currency formatter
  const formatRupees = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Date ranges
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const isDateInTimeframe = (dateStr?: string) => {
    if (!dateStr) return timeframe === 'all';
    const cleanDate = dateStr.slice(0, 10);
    if (timeframe === 'today') return cleanDate === todayStr;
    if (timeframe === 'week') return cleanDate >= sevenDaysAgo && cleanDate <= todayStr;
    if (timeframe === 'month') return cleanDate.startsWith(currentMonthPrefix);
    return true;
  };

  // 1. Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => isDateInTimeframe(l.createdAt));
  }, [leads, timeframe, todayStr, currentMonthPrefix, sevenDaysAgo]);

  // 2. Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => isDateInTimeframe(p.createdAt));
  }, [projects, timeframe, todayStr, currentMonthPrefix, sevenDaysAgo]);

  // 3. Quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter(q => isDateInTimeframe(q.createdAt));
  }, [quotations, timeframe, todayStr, currentMonthPrefix, sevenDaysAgo]);

  // 4. Follow-ups
  const filteredFollowUps = useMemo(() => {
    return followUps.filter(f => isDateInTimeframe(f.date));
  }, [followUps, timeframe, todayStr, currentMonthPrefix, sevenDaysAgo]);

  // ----------------------------------------------------
  // SECTION 1: ALL 15 MANDATED METRICS CALCULATION
  // ----------------------------------------------------
  // 1. Total Leads
  const totalLeads = filteredLeads.length;

  // 2. New Leads
  const newLeads = filteredLeads.filter(l => l.status === 'New').length;

  // 3. Follow-ups Due
  const followUpsDue = filteredFollowUps.filter(f => f.status === 'Pending').length;

  // 4. Site Visits Scheduled
  const siteVisitsScheduled = filteredLeads.filter(l => l.status === 'Site Visit').length;

  // 5. Quotations Generated
  const quotationsGenerated = filteredQuotations.length;

  // 6. Won Projects
  const wonProjects = filteredProjects.length;

  // 7. Active Projects
  const activeProjects = filteredProjects.filter(p => p.status !== 'Completed').length;

  // 8. Completed Projects
  const completedProjects = filteredProjects.filter(p => p.status === 'Completed').length;

  // 9. Total kW Sold (sum of capacities from booked projects)
  const totalKWSold = filteredProjects.reduce((acc, p) => {
    if (p.systemCapacityKW) return acc + p.systemCapacityKW;
    const match = (p.systemCapacity || '').match(/([\d.]+)/);
    return acc + (match ? parseFloat(match[1]) : 3);
  }, 0);

  // 10. Total kW Installed (sum of capacities from completed projects)
  const totalKWInstalled = filteredProjects
    .filter(p => p.status === 'Completed')
    .reduce((acc, p) => {
      if (p.systemCapacityKW) return acc + p.systemCapacityKW;
      const match = (p.systemCapacity || '').match(/([\d.]+)/);
      return acc + (match ? parseFloat(match[1]) : 3);
    }, 0);

  // 11. Total Sales Value
  const totalSalesValue = filteredProjects.reduce((sum, p) => sum + (p.finalAmount || 0), 0);

  // 12. Payment Collected
  const paymentCollected = filteredProjects.reduce(
    (sum, p) => sum + (p.receivedAmount || (p.finalAmount - p.pendingAmount) || 0),
    0
  );

  // 13. Pending Payment
  const pendingPayment = filteredProjects.reduce((sum, p) => sum + (p.pendingAmount || 0), 0);

  // 14. Team Attendance (Today's Present count)
  const teamAttendance = filteredAttendanceRecords.filter(
    a => a.date === todayStr && (a.status === 'PRESENT' || a.status === 'ON_FIELD' || a.status === 'LATE')
  ).length;

  // 15. Monthly Sales Target
  const monthlyTargetKW = 50; // Target in kW for the franchise
  const targetAchievedPercent = Math.min(100, Math.round((totalKWSold / monthlyTargetKW) * 100));

  return (
    <section
      id="franchise-performance-overview"
      aria-label="Franchise Dashboard Overview"
      className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden space-y-4"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row & Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide">Franchise Performance Hub</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Real-time synchronized" />
            </div>
            <p className="text-[10px] text-slate-400">15 Real-time KPIs across pipeline, solar EPC & collections</p>
          </div>
        </div>

        {/* Mandated Filter Options: Today, This Week, This Month, All Time */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold self-start sm:self-auto overflow-x-auto">
          <button
            type="button"
            id="perf-timeframe-today"
            onClick={() => setTimeframe('today')}
            className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
              timeframe === 'today'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            id="perf-timeframe-week"
            onClick={() => setTimeframe('week')}
            className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
              timeframe === 'week'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            id="perf-timeframe-month"
            onClick={() => setTimeframe('month')}
            className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
              timeframe === 'month'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            id="perf-timeframe-all"
            onClick={() => setTimeframe('all')}
            className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
              timeframe === 'all'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Row 1: High Priority Financial & kW Metrics (4 Key Hero Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 relative z-10">
        {/* Total Sales Value */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Total Sales Value</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-400 tracking-tight">
            {formatRupees(totalSalesValue)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
            <span>{wonProjects} won projects</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>

        {/* Payment Collected */}
        <div
          onClick={() => onNavigate('payments')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Payment Collected</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white tracking-tight">
            {formatRupees(paymentCollected)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
            <span>
              {totalSalesValue > 0 ? Math.round((paymentCollected / totalSalesValue) * 100) : 0}% realized
            </span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>

        {/* Pending Payment */}
        <div
          onClick={() => onNavigate('payments')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-rose-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Pending Payment</span>
            <IndianRupee className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-rose-400 tracking-tight">
            {formatRupees(pendingPayment)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
            <span>Milestone dues</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </div>
        </div>

        {/* Total kW Sold & Target */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Total kW Sold</span>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-400 tracking-tight">
            {totalKWSold.toFixed(1)} kW
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
            <span>{totalKWInstalled.toFixed(1)} kW installed</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* Row 2: Sales Pipeline & Site Survey Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative z-10">
        {/* 1. Total Leads */}
        <button
          type="button"
          onClick={() => onNavigate('crm')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-left transition-all"
        >
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
            <span>Total Leads</span>
            <Users className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-base font-black text-white mt-1">{totalLeads}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Territory intake</div>
        </button>

        {/* 2. New Leads */}
        <button
          type="button"
          onClick={() => onNavigate('crm')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/50 text-left transition-all"
        >
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
            <span>New Leads</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-base font-black text-emerald-400 mt-1">{newLeads}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Uncontacted</div>
        </button>

        {/* 3. Follow-ups Due */}
        <button
          type="button"
          onClick={() => onNavigate('crm')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-left transition-all"
        >
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
            <span>Follow-ups Due</span>
            <Clock className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-base font-black text-amber-400 mt-1">{followUpsDue}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Calls scheduled</div>
        </button>

        {/* 4. Site Visits Scheduled */}
        <button
          type="button"
          onClick={() => onNavigate('surveys')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-400/50 text-left transition-all"
        >
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
            <span>Site Visits</span>
            <Compass className="w-3 h-3 text-sky-400" />
          </div>
          <div className="text-base font-black text-sky-400 mt-1">{siteVisitsScheduled}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Rooftop surveys</div>
        </button>

        {/* 5. Quotations Generated */}
        <button
          type="button"
          onClick={() => onNavigate('quotations')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-400/50 text-left transition-all"
        >
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
            <span>Quotations</span>
            <FileText className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="text-base font-black text-indigo-400 mt-1">{quotationsGenerated}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Proposals sent</div>
        </button>

        {/* 6. Won Projects */}
        <button
          type="button"
          onClick={() => onNavigate('projects')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/50 text-left transition-all"
        >
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
            <span>Won Projects</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-base font-black text-emerald-400 mt-1">{wonProjects}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Converted deals</div>
        </button>
      </div>

      {/* Row 3: Solar Projects EPC & Team Operations Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
        {/* Active Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
            <span>Active EPC</span>
            <FolderGit2 className="w-3 h-3 text-sky-400" />
          </div>
          <div className="text-sm font-black text-sky-400 mt-0.5">{activeProjects} Ongoing</div>
          <div className="text-[9px] text-slate-500">In execution</div>
        </div>

        {/* Completed Projects & Installed kW */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
            <span>Total kW Installed</span>
            <Zap className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-sm font-black text-emerald-400 mt-0.5">{totalKWInstalled.toFixed(1)} kW</div>
          <div className="text-[9px] text-slate-500">{completedProjects} completed sites</div>
        </div>

        {/* Team Attendance */}
        <div
          onClick={() => onNavigate('hrms_attendance')}
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
            <span>Team Attendance</span>
            <UserCheck className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-sm font-black text-white mt-0.5">{teamAttendance} Present</div>
          <div className="text-[9px] text-slate-500">Logged in today</div>
        </div>

        {/* Monthly Sales Target & Achievement */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
            <span>Monthly Sales Target</span>
            <Target className="w-3 h-3 text-rose-400" />
          </div>
          <div className="text-sm font-black text-amber-400 mt-0.5">{targetAchievedPercent}%</div>
          <div className="text-[9px] text-slate-500">
            {totalKWSold.toFixed(0)} / {monthlyTargetKW} kW goal
          </div>
        </div>
      </div>
    </section>
  );
};
