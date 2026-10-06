import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  IndianRupee,
  FolderGit2,
  Users2,
  CheckCircle2,
  Download,
  Filter
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { leads, projects, payments, currentUser } = useApp();
  const [timeFilter, setTimeFilter] = useState<'Today' | 'This Week' | 'This Month' | 'Last Month' | 'This Year'>('This Month');

  // Calculations
  const totalBookedSales = projects.reduce((acc, p) => acc + p.finalAmount, 0);
  const totalCollections = payments.reduce((acc, p) => acc + p.amount, 0);
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const conversionRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;

  // Lead Sources breakdown
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    sourceCounts[l.leadSource] = (sourceCounts[l.leadSource] || 0) + 1;
  });

  return (
    <div id="reports-view" className="p-4 space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Business Intelligence Reports</h2>
          <p className="text-[11px] text-slate-400">
            Performance analytics for {currentUser.franchiseName || 'Territory'}
          </p>
        </div>
      </div>

      {/* Time Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['Today', 'This Week', 'This Month', 'Last Month', 'This Year'] as const).map(f => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              timeFilter === f
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Closed EPC Sales
          </span>
          <div className="text-xl font-black text-amber-400 mt-1">
            ₹{(totalBookedSales / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block font-medium">
            {projects.length} Total Projects
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Lead Conversion Rate
          </span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {conversionRate}%
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">
            {wonLeads} Won of {leads.length} Leads
          </span>
        </div>
      </div>

      {/* Monthly Sales Bar Chart SVG */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Monthly Sales Volume (₹ in Lakhs)</span>
          <span className="text-[10px] text-amber-400 font-bold">2024-2025</span>
        </div>

        <div className="h-40 w-full flex items-end justify-between pt-4 px-2">
          {[
            { month: 'Oct', val: 4.2 },
            { month: 'Nov', val: 6.8 },
            { month: 'Dec', val: 9.4 },
            { month: 'Jan', val: 12.1 },
            { month: 'Feb', val: 15.6 },
            { month: 'Mar', val: 18.2 }
          ].map((bar, i) => (
            <div key={bar.month} className="flex flex-col items-center gap-1.5 h-full justify-end flex-1">
              <span className="text-[9px] text-slate-400 font-mono">₹{bar.val}L</span>
              <div
                className="w-7 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg transition-all"
                style={{ height: `${(bar.val / 20) * 100}%` }}
              />
              <span className="text-[10px] font-bold text-slate-300">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Sources Distribution */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-white block">Inquiry Attribution & Lead Sources</span>
        <div className="space-y-2">
          {Object.entries(sourceCounts).map(([src, count]) => {
            const pct = Math.round((count / leads.length) * 100);
            return (
              <div key={src} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{src}</span>
                  <span className="font-bold text-white">{count} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
