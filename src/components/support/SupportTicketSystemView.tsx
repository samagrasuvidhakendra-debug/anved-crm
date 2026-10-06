import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, SupportTicketCategory, SupportTicketStatus } from '../../types';
import {
  LifeBuoy,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  MessageSquare,
  Send,
  Building2,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  Check,
  FileText
} from 'lucide-react';

interface SupportTicketSystemViewProps {
  onBack?: () => void;
}

const TICKET_CATEGORIES: SupportTicketCategory[] = [
  'Technical Support',
  'Solar Product Issue',
  'Installation Issue',
  'Net Metering Issue',
  'Customer Issue',
  'Quotation Issue',
  'Payment Information Issue',
  'Software Issue',
  'Other'
];

export const SupportTicketSystemView: React.FC<SupportTicketSystemViewProps> = ({ onBack }) => {
  const {
    currentUser,
    isSuperAdmin,
    filteredSupportTickets,
    addSupportTicket,
    updateSupportTicketStatus,
    leads,
    projects
  } = useApp();

  // Search, category & status filter state
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New ticket form state
  const [formData, setFormData] = useState<{
    category: SupportTicketCategory;
    subject: string;
    description: string;
    priority: 'Normal' | 'High' | 'Urgent';
    relatedCustomerName: string;
    relatedProjectId: string;
  }>({
    category: 'Technical Support',
    subject: '',
    description: '',
    priority: 'Normal',
    relatedCustomerName: '',
    relatedProjectId: ''
  });

  // Admin status update state
  const [newStatus, setNewStatus] = useState<SupportTicketStatus>('Open');
  const [assignedToName, setAssignedToName] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return filteredSupportTickets.filter(ticket => {
      const matchesSearch =
        ticket.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase()) ||
        ticket.franchiseName.toLowerCase().includes(search.toLowerCase()) ||
        (ticket.relatedCustomerName || '').toLowerCase().includes(search.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || ticket.status === selectedStatus;
      const matchesCategory = selectedCategory === 'ALL' || ticket.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [filteredSupportTickets, search, selectedStatus, selectedCategory]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: filteredSupportTickets.length,
      open: filteredSupportTickets.filter(t => t.status === 'Open').length,
      assigned: filteredSupportTickets.filter(t => t.status === 'Assigned').length,
      inProgress: filteredSupportTickets.filter(t => t.status === 'In Progress').length,
      resolved: filteredSupportTickets.filter(t => t.status === 'Resolved').length,
      closed: filteredSupportTickets.filter(t => t.status === 'Closed').length
    };
  }, [filteredSupportTickets]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      alert('Please provide a subject and detailed description of the issue.');
      return;
    }

    addSupportTicket({
      franchiseId: currentUser.franchiseId || 'ACS-MH-01',
      franchiseName: currentUser.franchiseName || 'ACS Solar Territory',
      createdByUserId: currentUser.id,
      createdByName: currentUser.name,
      category: formData.category,
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: 'Open',
      relatedCustomerName: formData.relatedCustomerName.trim() || undefined,
      relatedProjectId: formData.relatedProjectId.trim() || undefined
    });

    setIsCreateModalOpen(false);
    setFormData({
      category: 'Technical Support',
      subject: '',
      description: '',
      priority: 'Normal',
      relatedCustomerName: '',
      relatedProjectId: ''
    });
  };

  const handleOpenDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAssignedToName(ticket.assignedToName || '');
    setResolutionNotes(ticket.resolutionNotes || '');
  };

  const handleSaveStatusUpdate = () => {
    if (!selectedTicket) return;
    updateSupportTicketStatus(selectedTicket.id, newStatus, resolutionNotes.trim() || undefined, assignedToName.trim() || undefined);
    setSelectedTicket(prev => prev ? {
      ...prev,
      status: newStatus,
      resolutionNotes: resolutionNotes.trim() || undefined,
      assignedToName: assignedToName.trim() || undefined
    } : null);
  };

  const getStatusBadge = (status: SupportTicketStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Assigned':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'In Progress':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      case 'Resolved':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Closed':
        return 'bg-slate-700/40 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getPriorityBadge = (priority: 'Normal' | 'High' | 'Urgent') => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div id="support-ticket-system-view" className="p-3 sm:p-5 space-y-4 text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-amber-400" />
                <span>ACS HQ Support Ticket Desk</span>
              </h2>
              <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                Section 13
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct escalation & technical helpline between Franchise Owners and ACS Solar Headquarters.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Raise New Ticket</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
        <div
          onClick={() => setSelectedStatus('ALL')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            selectedStatus === 'ALL'
              ? 'bg-amber-500/20 border-amber-500/50 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-base font-black text-white">{counts.all}</div>
          <div className="text-[10px]">All Tickets</div>
        </div>
        <div
          onClick={() => setSelectedStatus('Open')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            selectedStatus === 'Open'
              ? 'bg-amber-500/20 border-amber-500/50 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-base font-black text-amber-400">{counts.open}</div>
          <div className="text-[10px]">Open</div>
        </div>
        <div
          onClick={() => setSelectedStatus('Assigned')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            selectedStatus === 'Assigned'
              ? 'bg-sky-500/20 border-sky-500/50 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-base font-black text-sky-400">{counts.assigned}</div>
          <div className="text-[10px]">Assigned</div>
        </div>
        <div
          onClick={() => setSelectedStatus('In Progress')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            selectedStatus === 'In Progress'
              ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-base font-black text-indigo-400">{counts.inProgress}</div>
          <div className="text-[10px]">In Progress</div>
        </div>
        <div
          onClick={() => setSelectedStatus('Resolved')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            selectedStatus === 'Resolved'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-base font-black text-emerald-400">{counts.resolved}</div>
          <div className="text-[10px]">Resolved</div>
        </div>
        <div
          onClick={() => setSelectedStatus('Closed')}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
            selectedStatus === 'Closed'
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-base font-black text-slate-300">{counts.closed}</div>
          <div className="text-[10px]">Closed</div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ticket #, subject, customer, or franchise..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Categories</option>
            {TICKET_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-2.5">
        {filteredTickets.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <LifeBuoy className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No support tickets found</h3>
            <p className="text-xs text-slate-400">
              {search || selectedStatus !== 'ALL' || selectedCategory !== 'ALL'
                ? 'Try adjusting your search query or filters.'
                : 'Need assistance from ACS HQ? Raise your first support ticket above.'}
            </p>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => handleOpenDetail(ticket)}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2.5 shadow-sm group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    #{ticket.ticketNumber}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {ticket.category}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider border ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className="text-[11px] text-slate-400">{ticket.createdAt}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                  {ticket.subject}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{ticket.description}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {ticket.franchiseName}
                  </span>
                  <span>•</span>
                  <span>Raised by <strong className="text-slate-200">{ticket.createdByName}</strong></span>
                  {ticket.relatedCustomerName && (
                    <>
                      <span>•</span>
                      <span>Customer: <strong className="text-amber-300">{ticket.relatedCustomerName}</strong></span>
                    </>
                  )}
                </div>

                {ticket.assignedToName ? (
                  <span className="text-sky-300 font-medium">Assigned: {ticket.assignedToName}</span>
                ) : (
                  <span className="text-amber-400/80 font-medium">Pending HQ Assignment</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* RAISE NEW TICKET MODAL */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Raise Support Ticket to ACS HQ</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Ticket Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as SupportTicketCategory })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {TICKET_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High (Impacting Customer)</option>
                    <option value="Urgent">Urgent (Plant Down / Discom Hold)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Related Customer (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Aniket Joshi"
                    value={formData.relatedCustomerName}
                    onChange={e => setFormData({ ...formData, relatedCustomerName: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject / Brief Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Net meter inspection delay from MSEDCL sub-division"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Issue Details & Observations *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete context, consumer CA number, inverter serial number, error codes or discom communication..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
                >
                  Submit Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TICKET DETAIL & RESOLUTION WORKFLOW MODAL */}
      {/* ========================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    #{selectedTicket.ticketNumber}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority} Priority
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-1">{selectedTicket.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Category</span>
                <span className="font-bold text-white">{selectedTicket.category}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Franchise Territory</span>
                <span className="font-bold text-white truncate">{selectedTicket.franchiseName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Raised By</span>
                <span className="font-bold text-white">{selectedTicket.createdByName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Created Timestamp</span>
                <span className="font-bold text-slate-300">{selectedTicket.createdAt}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Issue Description
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            {/* Resolution notes if present */}
            {selectedTicket.resolutionNotes && (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolution & HQ Action Notes
                </span>
                <p className="text-xs text-emerald-100 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.resolutionNotes}
                </p>
              </div>
            )}

            {/* Workflow Progression: Open -> Assigned -> In Progress -> Resolved -> Closed */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                {isSuperAdmin ? 'ACS HQ Ticket Resolution Control' : 'HQ Workflow Status'}
              </span>

              {isSuperAdmin ? (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Workflow Stage
                      </label>
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as SupportTicketStatus)}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Assigned Officer / Engineering Desk
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HQ Grid Integration Desk"
                        value={assignedToName}
                        onChange={e => setAssignedToName(e.target.value)}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      HQ Resolution / Action Update
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add resolution instructions, courier consignment numbers, testing approvals or next steps for the franchise..."
                      value={resolutionNotes}
                      onChange={e => setResolutionNotes(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveStatusUpdate}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save Ticket Progress
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="text-slate-400">
                    Assigned Desk:{' '}
                    <strong className="text-white">{selectedTicket.assignedToName || 'Under Review by ACS HQ'}</strong>
                  </div>
                  <div className="text-slate-400">
                    Status: <strong className="text-amber-400">{selectedTicket.status}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500">
                Ticket ID: {selectedTicket.id} • Complete audit trail logged
              </span>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
