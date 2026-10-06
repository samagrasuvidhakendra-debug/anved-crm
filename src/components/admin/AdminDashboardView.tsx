import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  UserPlus,
  Contact,
  FolderGit2,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  IndianRupee,
  Activity,
  ArrowUpRight,
  MapPin,
  GitBranch,
  UserCheck
} from 'lucide-react';

export const AdminDashboardView: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const {
    allFranchises,
    allUsers,
    leads,
    customers,
    projects,
    payments,
    selectedAdminFranchiseFilter
  } = useApp();

  // Metrics
  const totalFranchises = allFranchises.length;
  const activeFranchises = allFranchises.filter(f => f.status === 'Active').length;
  const totalUsers = allUsers.length;
  const totalLeads = leads.length;
  const totalCustomers = customers.length;
  const activeProjects = projects.filter(p => p.status !== 'Completed').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalSales = projects.reduce((acc, p) => acc + p.finalAmount, 0);
  const pendingPayments = projects.reduce((acc, p) => acc + p.pendingAmount, 0);
  const totalReceived = payments.reduce((acc, p) => acc + p.amount, 0);

  // Franchise sales distribution data
  const franchisePerformanceData = allFranchises.map(franchise => {
    const fLeads = leads.filter(l => l.franchiseId === franchise.id);
    const fCustomers = customers.filter(c => c.franchiseId === franchise.id);
    const fProjects = projects.filter(p => p.franchiseId === franchise.id);
    const fSales = fProjects.reduce((acc, p) => acc + p.finalAmount, 0);
    const fWonLeads = fLeads.filter(l => l.status === 'Won').length;
    const conversionRate = fLeads.length > 0 ? Math.round((fWonLeads / fLeads.length) * 100) : 0;

    return {
      id: franchise.id,
      name: franchise.franchiseName,
      city: franchise.city,
      status: franchise.status,
      leads: fLeads.length,
      customers: fCustomers.length,
      projects: fProjects.length,
      sales: fSales,
      conversionRate
    };
  });

  const maxSales = Math.max(...franchisePerformanceData.map(f => f.sales), 1);

  return (
    <div id="admin-dashboard-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Scope Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Platform Executive Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Centralized monitoring of all ACS SOLAR franchise territories, sales pipelines, and EPC execution
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('sales_location_tracker')}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Sales GPS Tracker</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('hrms_attendance')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Attendance & HRMS</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('downlines')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                <span>Downlines & Leads</span>
              </button>
            </>
          )}

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Network Feed
          </span>
        </div>
      </div>

      {/* KPI Cards Grid (10 Core KPI Cards as mandated) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Franchises</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalFranchises}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>{activeFranchises} Active Franchises</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Franchises</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{activeFranchises}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            100% operational network
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Platform Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalUsers}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            Staff & Field Surveyors
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Leads</span>
            <UserPlus className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalLeads}</div>
          <div className="text-[10px] text-amber-400 mt-1 font-medium">
            CRM Inquiries
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Customers</span>
            <Contact className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalCustomers}</div>
          <div className="text-[10px] text-teal-400 mt-1 font-medium">
            Verified Rooftops
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">{activeProjects}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            Under Installation / EPC
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Completed Projects</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{completedProjects}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-medium">
            Commissioned & Net-Metered
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Sales</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            ₹{(totalSales / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Payments</span>
            <CreditCard className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">
            ₹{(pendingPayments / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">
            Due on Milestones
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Monthly Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            ₹{(totalReceived / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 font-medium">
            +18.4% vs last month
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Franchise Sales Distribution Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Franchise Sales Comparison</h3>
              <p className="text-[11px] text-slate-400">Total project book value across active territories</p>
            </div>
            <span className="text-xs text-amber-400 font-bold">Total: ₹{(totalSales / 100000).toFixed(1)} Lakhs</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {franchisePerformanceData.map(f => {
              const pct = Math.round((f.sales / maxSales) * 100);
              return (
                <div key={f.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200">{f.name}</span>
                    <span className="text-white font-bold">₹{f.sales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead & Project Growth Over Time SVG Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Lead & Project Growth (Q1 2025)</h3>
              <p className="text-[11px] text-slate-400">Monthly progression of qualified leads and executed projects</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-sky-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Leads
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Projects
              </span>
            </div>
          </div>

          {/* SVG Multi-Line Chart */}
          <div className="h-48 w-full flex items-center justify-center pt-2">
            <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="20" y1="20" x2="380" y2="20" stroke="#334155" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2="380" y2="60" stroke="#334155" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="380" y2="100" stroke="#334155" strokeDasharray="3 3" />
              <line x1="20" y1="140" x2="380" y2="140" stroke="#334155" />

              {/* Month Labels */}
              <text x="50" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Nov</text>
              <text x="130" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Dec</text>
              <text x="210" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Jan</text>
              <text x="290" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Feb</text>
              <text x="360" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Mar (Est)</text>

              {/* Leads Line (Sky) */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                points="50,110 130,90 210,65 290,38 360,25"
              />
              {/* Leads points */}
              <circle cx="50" cy="110" r="3.5" fill="#38bdf8" />
              <circle cx="130" cy="90" r="3.5" fill="#38bdf8" />
              <circle cx="210" cy="65" r="3.5" fill="#38bdf8" />
              <circle cx="290" cy="38" r="3.5" fill="#38bdf8" />
              <circle cx="360" cy="25" r="3.5" fill="#38bdf8" />

              {/* Projects Line (Emerald) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="50,130 130,115 210,95 290,70 360,50"
              />
              {/* Projects points */}
              <circle cx="50" cy="130" r="3.5" fill="#10b981" />
              <circle cx="130" cy="115" r="3.5" fill="#10b981" />
              <circle cx="210" cy="95" r="3.5" fill="#10b981" />
              <circle cx="290" cy="70" r="3.5" fill="#10b981" />
              <circle cx="360" cy="50" r="3.5" fill="#10b981" />
            </svg>
          </div>
        </div>
      </div>

      {/* Franchise Performance Comparison Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Franchise Performance Benchmarking</h3>
            <p className="text-[11px] text-slate-400">
              Comparative business KPIs: Inquiries, Closed Sales, Conversion %, and Status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Franchise</th>
                <th className="py-2.5 px-3">City / Territory</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Leads</th>
                <th className="py-2.5 px-3 text-right">Customers</th>
                <th className="py-2.5 px-3 text-right">Projects</th>
                <th className="py-2.5 px-3 text-right">Total Sales (₹)</th>
                <th className="py-2.5 px-3 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {franchisePerformanceData.map(f => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{f.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{f.city}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        f.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : f.status === 'Suspended'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium">{f.leads}</td>
                  <td className="py-3 px-3 text-right font-medium">{f.customers}</td>
                  <td className="py-3 px-3 text-right font-medium text-sky-400">{f.projects}</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-400">
                    ₹{f.sales.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-bold text-emerald-400">{f.conversionRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
