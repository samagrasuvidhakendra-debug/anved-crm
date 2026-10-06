import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Franchise, Lead, Customer, Project, User } from '../../types';
import {
  Building,
  Users,
  Briefcase,
  Layers,
  MapPin,
  TrendingUp,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Zap,
  Radio,
  FileDown,
  Compass,
  DollarSign
} from 'lucide-react';

interface DownlinesBusinessViewProps {
  onNavigateToLocationTracker?: () => void;
  onNavigateToLeads?: () => void;
  onNavigateToCustomers?: () => void;
}

export const DownlinesBusinessView: React.FC<DownlinesBusinessViewProps> = ({
  onNavigateToLocationTracker,
  onNavigateToLeads,
  onNavigateToCustomers
}) => {
  const {
    currentUser,
    isSuperAdmin,
    allFranchises,
    allUsers,
    leads,
    customers,
    projects,
    quotations,
    payments,
    salesRepLiveStatus,
    selectedAdminFranchiseFilter,
    setSelectedAdminFranchiseFilter
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'leads' | 'customers' | 'staff' | 'financials'>('matrix');
  const [franchiseFilter, setFranchiseFilter] = useState<string>(selectedAdminFranchiseFilter || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize with global filter if changed
  const handleFranchiseFilterChange = (id: string) => {
    setFranchiseFilter(id);
    setSelectedAdminFranchiseFilter(id);
  };

  // Downlines performance matrix
  const downlineMatrix = useMemo(() => {
    return allFranchises.map(franchise => {
      const fLeads = leads.filter(l => l.franchiseId === franchise.id);
      const fCustomers = customers.filter(c => c.franchiseId === franchise.id);
      const fProjects = projects.filter(p => p.franchiseId === franchise.id);
      const fQuotations = quotations.filter(q => q.franchiseId === franchise.id);
      const fPayments = payments.filter(p => p.franchiseId === franchise.id);
      const fStaff = allUsers.filter(u => u.franchiseId === franchise.id);
      const fSalesStaff = fStaff.filter(
        u => u.role === 'SALES_EXECUTIVE' || u.role === 'SALES_MANAGER' || u.role === 'SITE_SURVEYOR'
      );

      const wonLeads = fLeads.filter(l => l.status === 'Won').length;
      const conversionRate = fLeads.length > 0 ? Math.round((wonLeads / fLeads.length) * 100) : 0;

      const totalBookedKw = fProjects.reduce((sum, p) => {
        const kw = parseFloat((p.systemCapacity || '').replace(/[^\d.]/g, '')) || 0;
        return sum + kw;
      }, 0);

      const totalQuotationValue = fQuotations.reduce((sum, q) => sum + (q.finalAmount || 0), 0);
      const totalCollected = fPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const pendingReceivables = totalQuotationValue > totalCollected ? totalQuotationValue - totalCollected : 0;

      const activeReps = salesRepLiveStatus.filter(
        r => r.franchiseId === franchise.id && r.currentStatus !== 'OFF_DUTY'
      ).length;

      return {
        ...franchise,
        totalStaff: fStaff.length,
        salesStaffCount: fSalesStaff.length,
        activeReps,
        totalLeads: fLeads.length,
        wonLeads,
        conversionRate,
        totalCustomers: fCustomers.length,
        totalProjects: fProjects.length,
        totalBookedKw: totalBookedKw.toFixed(1),
        totalQuotationValue,
        totalCollected,
        pendingReceivables
      };
    });
  }, [allFranchises, leads, customers, projects, quotations, payments, allUsers, salesRepLiveStatus]);

  // Filtered Leads across all downlines
  const downlineLeads = useMemo(() => {
    return leads.filter(l => {
      if (franchiseFilter !== 'all' && l.franchiseId !== franchiseFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const franchiseMatch = allFranchises.find(f => f.id === l.franchiseId)?.franchiseName.toLowerCase().includes(q);
        return (
          l.customerName.toLowerCase().includes(q) ||
          (l.mobile && l.mobile.includes(q)) ||
          l.city.toLowerCase().includes(q) ||
          Boolean(franchiseMatch)
        );
      }
      return true;
    });
  }, [leads, franchiseFilter, searchQuery, allFranchises]);

  // Filtered Customers across all downlines
  const downlineCustomers = useMemo(() => {
    return customers.filter(c => {
      if (franchiseFilter !== 'all' && c.franchiseId !== franchiseFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const phone = c.mobile || c.phone || '';
        return (
          c.name.toLowerCase().includes(q) ||
          phone.includes(q) ||
          c.city.toLowerCase().includes(q) ||
          (c.address && c.address.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [customers, franchiseFilter, searchQuery]);

  // Filtered Staff across all downlines
  const downlineStaff = useMemo(() => {
    return allUsers.filter(u => {
      if (franchiseFilter !== 'all' && u.franchiseId !== franchiseFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.mobile.includes(q) ||
          (u.franchiseName && u.franchiseName.toLowerCase().includes(q)) ||
          u.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allUsers, franchiseFilter, searchQuery]);

  // Aggregate Metrics
  const aggregateKpis = useMemo(() => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter(l => l.status === 'Won').length;
    const totalCust = customers.length;
    const totalCapacity = projects.reduce((sum, p) => sum + (parseFloat((p.systemCapacity || '').replace(/[^\d.]/g, '')) || 0), 0);
    const totalRev = quotations.reduce((sum, q) => sum + (q.finalAmount || 0), 0);
    const totalColl = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    return {
      totalLeads,
      wonLeads,
      conversionRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
      totalCust,
      totalCapacity: totalCapacity.toFixed(1),
      totalRev,
      totalColl
    };
  }, [leads, customers, projects, quotations, payments]);

  // Format currency in INR
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Building className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Downline Network & Business Hub
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                Super Admin Master Access
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Consolidated command center providing full transparency into downline franchises, customer registries, sales leads, financial collections, and field operations.
            </p>
          </div>

          {/* Quick Filter Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400 font-semibold">Scope:</span>
              <select
                id="downline-scope-selector"
                value={franchiseFilter}
                onChange={e => handleFranchiseFilterChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Downlines Consolidated</option>
                {allFranchises.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.franchiseName} ({f.city})
                  </option>
                ))}
              </select>
            </div>

            {onNavigateToLocationTracker && (
              <button
                type="button"
                onClick={onNavigateToLocationTracker}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              >
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Sales GPS Tracker</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Downline Branches</span>
            <span className="text-lg font-black text-white">{allFranchises.length}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Active network</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Consolidated Leads</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-amber-400">{aggregateKpis.totalLeads}</span>
              <span className="text-[10px] text-slate-500">({aggregateKpis.wonLeads} won)</span>
            </div>
            <span className="text-[10px] text-sky-400 block mt-0.5">{aggregateKpis.conversionRate}% conversion</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Total Customers</span>
            <span className="text-lg font-black text-sky-400">{aggregateKpis.totalCust}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">verified accounts</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Booked Solar</span>
            <span className="text-lg font-black text-emerald-400">{aggregateKpis.totalCapacity}</span>
            <span className="text-[10px] text-emerald-500 block mt-0.5">kW commissioned</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Pipeline Quotations</span>
            <span className="text-lg font-black text-white truncate block">{formatINR(aggregateKpis.totalRev)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">gross proposals</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Realized Collections</span>
            <span className="text-lg font-black text-emerald-400 truncate block">{formatINR(aggregateKpis.totalColl)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">inward receipts</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'matrix'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Downlines Matrix ({allFranchises.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leads'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            All Downline Leads ({downlineLeads.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            All Downline Customers ({downlineCustomers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'staff'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Downlines Staff & Field Force ({downlineStaff.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search downline records..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: Downlines Performance Matrix Cards               */}
      {/* ======================================================== */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downlineMatrix.map(f => {
              const isSelected = franchiseFilter === f.id;
              return (
                <div
                  key={f.id}
                  className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all shadow-md ${
                    isSelected ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{f.franchiseName}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            f.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {f.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {f.city}, {f.state} • Code: {f.franchiseCode}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFranchiseFilterChange(isSelected ? 'all' : f.id)}
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isSelected ? 'Viewing Scope' : 'Filter Scope'}
                    </button>
                  </div>

                  {/* Owner details */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Franchise Owner
                      </span>
                      <span className="font-bold text-white">{f.ownerName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{f.ownerMobile}</span>
                      <span className="text-[10px] text-slate-500">{f.ownerEmail}</span>
                    </div>
                  </div>

                  {/* Business Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Leads / Won</span>
                      <span className="font-bold text-white">
                        {f.totalLeads} <span className="text-sky-400">({f.wonLeads})</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 block">{f.conversionRate}% conv.</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Customers</span>
                      <span className="font-bold text-sky-400">{f.totalCustomers}</span>
                      <span className="text-[10px] text-slate-400 block">{f.totalBookedKw} kW</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Collections</span>
                      <span className="font-bold text-emerald-400">{formatINR(f.totalCollected)}</span>
                      <span className="text-[10px] text-amber-400 block">
                        {formatINR(f.totalQuotationValue)} pipeline
                      </span>
                    </div>
                  </div>

                  {/* Field Force & Quick Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        {f.totalStaff} staff ({f.salesStaffCount} sales)
                      </span>
                      {f.activeReps > 0 && (
                        <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                          <Radio className="w-3 h-3 animate-pulse" />
                          {f.activeReps} on field
                        </span>
                      )}
                    </div>

                    {onNavigateToLocationTracker && (
                      <button
                        type="button"
                        onClick={onNavigateToLocationTracker}
                        className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors"
                      >
                        <span>Track Sales GPS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Consolidated Leads Table Across All Downlines    */}
      {/* ======================================================== */}
      {activeTab === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Consolidated Downline Leads Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every customer lead logged across all branches with full proposal & status tracking.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {downlineLeads.length} leads
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Lead Name / Contact</th>
                  <th className="p-3.5">Downline Franchise</th>
                  <th className="p-3.5">Property & Solar Req.</th>
                  <th className="p-3.5">Est. Value</th>
                  <th className="p-3.5">Assigned Rep</th>
                  <th className="p-3.5">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {downlineLeads.map(lead => {
                  const stageBg: Record<string, string> = {
                    Won: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                    Negotiation: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                    Quotation: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                    'Site Visit': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                    Contacted: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
                    New: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
                    Lost: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  };
                  const badgeClass = stageBg[lead.status] || 'bg-slate-800 text-slate-300 border-slate-700';
                  const franchise = allFranchises.find(f => f.id === lead.franchiseId);

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{lead.customerName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{lead.mobile}</span>
                          <span>•</span>
                          <span>{lead.city}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-200 block">{franchise?.franchiseName || lead.franchiseId}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{lead.franchiseId}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-white">{lead.systemCapacity || `${lead.expectedCapacityKW || 3} kW`}</div>
                        <span className="text-[11px] text-slate-400">{lead.propertyType}</span>
                      </td>
                      <td className="p-3.5 font-bold text-amber-400">
                        {lead.electricityBillMonthly ? formatINR(lead.electricityBillMonthly * 24) : '₹ 1,85,000'}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {lead.assignedStaffName || 'Sales Field Rep'}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: Consolidated Customers Master Roster             */}
      {/* ======================================================== */}
      {activeTab === 'customers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                All Downline Customers Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every verified solar rooftop owner across all downlines with utility tariff and connection details.
              </p>
            </div>
            <span className="text-xs text-sky-400 font-bold bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
              {downlineCustomers.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Customer / Contact</th>
                  <th className="p-3.5">Branch / Downline</th>
                  <th className="p-3.5">Address & City</th>
                  <th className="p-3.5">Solar Capacity</th>
                  <th className="p-3.5">Monthly Power Bill</th>
                  <th className="p-3.5">Property Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {downlineCustomers.map(cust => {
                  return (
                    <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{cust.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{cust.phone}</div>
                        {cust.email && <div className="text-[10px] text-slate-500">{cust.email}</div>}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-200 block">{cust.franchiseId}</span>
                        <span className="text-[10px] text-slate-500">
                          {allFranchises.find(f => f.id === cust.franchiseId)?.franchiseName || 'Downline Branch'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-300 line-clamp-1">{cust.address}</div>
                        <span className="text-[11px] text-slate-400">{cust.city}, {cust.state} {cust.pincode}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-emerald-400">{cust.systemCapacity || '3kW'}</span>
                        <span className="text-[10px] text-slate-500 block">Rooftop Solar</span>
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {cust.electricityBill ? formatINR(cust.electricityBill) : '₹ 4,500'}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                          {cust.propertyType}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: Downlines Staff & Field Force Directory          */}
      {/* ======================================================== */}
      {activeTab === 'staff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Downline Workforce & Field Sales Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every executive, surveyor, and manager registered across downline branches.
              </p>
            </div>
            <span className="text-xs text-purple-400 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              {downlineStaff.length} employees
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Employee Name</th>
                  <th className="p-3.5">Branch / Franchise</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Contact Number</th>
                  <th className="p-3.5">Sales Quota</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {downlineStaff.map(staff => {
                  const liveRep = salesRepLiveStatus.find(r => r.userId === staff.id);

                  return (
                    <tr key={staff.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          {staff.profilePhoto ? (
                            <img
                              src={staff.profilePhoto}
                              alt={staff.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                              {staff.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white">{staff.name}</div>
                            <span className="text-[10px] text-slate-500 font-mono">{staff.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-200 block">{staff.franchiseName || staff.franchiseId}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{staff.franchiseId}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] font-bold text-amber-400">
                          {staff.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {staff.mobile}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {staff.salesTargetKW ? `${staff.salesTargetKW} kW` : '—'}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            staff.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {liveRep && onNavigateToLocationTracker && (
                          <button
                            type="button"
                            onClick={onNavigateToLocationTracker}
                            className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] inline-flex items-center gap-1 border border-amber-500/30"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Track GPS</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
