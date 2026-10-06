import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, ShieldCheck, Filter } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const userName = log.userName || log.user || '';
    const entity = log.entity || log.recordType || '';
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.franchiseId && log.franchiseId.toLowerCase().includes(search.toLowerCase()));
    const matchesAction = actionFilter === 'ALL' || entity === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div id="audit-logs-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" /> Enterprise Audit & Compliance Trail
          </h1>
          <p className="text-xs text-slate-400">
            Immutable log of all user activities, status changes, quotation generations, and access authorizations
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tamper-evident logs</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by action, user, franchise ID, details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-auto"
        >
          <option value="ALL">All Entities</option>
          <option value="Lead">Leads</option>
          <option value="Project">Projects</option>
          <option value="Quotation">Quotations</option>
          <option value="Payment">Payments</option>
          <option value="User">Users</option>
          <option value="Franchise">Franchise</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Franchise ID</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-4 text-white font-sans font-semibold">{log.userName || log.user}</td>
                  <td className="py-2.5 px-4 text-amber-400">{log.userRole}</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-semibold">{log.action}</td>
                  <td className="py-2.5 px-4 text-sky-400">{log.entity || log.recordType}</td>
                  <td className="py-2.5 px-4 text-slate-400">{log.franchiseId || 'HQ'}</td>
                  <td className="py-2.5 px-4 text-slate-300 font-sans max-w-md truncate" title={log.details}>
                    {log.details}
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
