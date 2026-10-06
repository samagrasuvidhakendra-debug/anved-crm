import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, PropertyType, SolarRequirementType, LeadSource } from '../../types';
import {
  Search,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Eye,
  FileText,
  MapPin,
  Zap,
  Filter,
  CheckCircle2,
  X,
  UserCheck,
  Building2,
  Sun,
  IndianRupee,
  Copy,
  Check,
  LayoutGrid,
  List,
  Edit3,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Camera
} from 'lucide-react';
import { AddLeadModal } from '../modals/AddLeadModal';

interface CRMViewProps {
  onOpenAddLead?: () => void;
  onOpenAddFollowupWithLead?: (lead: Lead) => void;
  onOpenQuotationForLead?: (lead: Lead) => void;
  onOpenGPSPhotoForLead?: (lead: Lead) => void;
  onInspectMapsGrounding?: (data: { name: string; lat: number; lng: number; address: string }) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({
  onOpenAddLead,
  onOpenAddFollowupWithLead,
  onOpenQuotationForLead,
  onOpenGPSPhotoForLead,
  onInspectMapsGrounding
}) => {
  const { leads, updateLeadStatus, updateLead, allUsers, currentUser } = useApp();

  // Search, filter and view state
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Detail / View Lead Modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditingInModal, setIsEditingInModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Lead>>({});
  const [copiedMobile, setCopiedMobile] = useState(false);

  // Internal Add Lead Modal state (guarantees add lead always works)
  const [internalAddLeadOpen, setInternalAddLeadOpen] = useState(false);

  const pipelineStages: { id: string; label: string; color: string }[] = [
    { id: 'ALL', label: 'All Leads', color: 'slate' },
    { id: 'New', label: 'New Inquiries', color: 'blue' },
    { id: 'Contacted', label: 'Contacted', color: 'indigo' },
    { id: 'Site Visit', label: 'Site Visit', color: 'purple' },
    { id: 'Quotation', label: 'Quoted', color: 'amber' },
    { id: 'Negotiation', label: 'Negotiation', color: 'orange' },
    { id: 'Won', label: 'Won / Booked', color: 'emerald' },
    { id: 'Lost', label: 'Lost', color: 'rose' }
  ];

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const leadName = lead.name || lead.customerName || '';
      const matchesSearch =
        leadName.toLowerCase().includes(search.toLowerCase()) ||
        (lead.mobile || '').includes(search) ||
        (lead.city || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.assignedStaffName || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.id || '').toLowerCase().includes(search.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || lead.status === selectedStatus;
      const matchesProperty =
        selectedPropertyFilter === 'ALL' || lead.propertyType === selectedPropertyFilter;

      return matchesSearch && matchesStatus && matchesProperty;
    });
  }, [leads, search, selectedStatus, selectedPropertyFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCount = leads.length;
    const newCount = leads.filter(l => l.status === 'New').length;
    const activePipeline = leads.filter(l => ['Contacted', 'Site Visit', 'Quotation', 'Negotiation'].includes(l.status)).length;
    const wonCount = leads.filter(l => l.status === 'Won').length;
    const totalKW = leads.reduce((acc, l) => {
      const kw = l.expectedCapacityKW || (l.systemCapacity ? parseFloat(l.systemCapacity) : 0) || 0;
      return acc + (isNaN(kw) ? 0 : kw);
    }, 0);

    return { totalCount, newCount, activePipeline, wonCount, totalKW };
  }, [leads]);

  // Handle Add Lead Trigger
  const handleTriggerAddLead = () => {
    if (onOpenAddLead) {
      onOpenAddLead();
    } else {
      setInternalAddLeadOpen(true);
    }
  };

  // Open View Modal for a lead
  const handleOpenLeadView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditingInModal(false);
    setEditFormData({
      name: lead.name || lead.customerName,
      customerName: lead.customerName || lead.name,
      mobile: lead.mobile,
      alternateMobile: lead.alternateMobile || '',
      email: lead.email || '',
      address: lead.address || '',
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode || '',
      propertyType: lead.propertyType,
      solarRequirement: lead.solarRequirement,
      expectedCapacityKW: lead.expectedCapacityKW || (lead.systemCapacity ? parseFloat(lead.systemCapacity) : 5),
      electricityBillMonthly: lead.electricityBillMonthly || lead.electricityBill || 0,
      monthlyConsumptionUnits: lead.monthlyConsumptionUnits || lead.monthlyConsumption || 0,
      assignedStaffName: lead.assignedStaffName || currentUser.name,
      nextFollowUpDate: lead.nextFollowUpDate || '',
      notes: lead.notes || ''
    });
  };

  // Handle save in edit mode
  const handleSaveLeadEdits = () => {
    if (!selectedLead) return;

    updateLead(selectedLead.id, {
      ...editFormData,
      customerName: editFormData.name || selectedLead.customerName,
      name: editFormData.name || selectedLead.name,
      systemCapacity: `${editFormData.expectedCapacityKW || 5} kW`,
      electricityBill: editFormData.electricityBillMonthly,
      monthlyConsumption: editFormData.monthlyConsumptionUnits
    });

    // Update current selected modal data
    setSelectedLead(prev => (prev ? { ...prev, ...editFormData } : null));
    setIsEditingInModal(false);
  };

  // Copy mobile
  const handleCopyMobile = (mobile: string) => {
    navigator.clipboard.writeText(mobile);
    setCopiedMobile(true);
    setTimeout(() => setCopiedMobile(false), 2000);
  };

  // Helper badge color
  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Contacted':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'Site Visit':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Quotation':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Negotiation':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'Won':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Lost':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div id="crm-view" className="p-3 sm:p-5 space-y-4 text-white">
      {/* ========================================================= */}
      {/* 1. Header with Title, Territory & Primary "Add Lead" CTA */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">Solar CRM & Leads</h2>
            <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
              {currentUser.franchiseName || 'Territory Hub'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Capture, qualify, view 360° inquiries and progress solar leads through the sales pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle (Grid vs Table) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid / Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table / Pipeline View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Primary "+ Add Lead" Button */}
          <button
            id="crm-primary-add-lead-btn"
            type="button"
            onClick={handleTriggerAddLead}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. Pipeline Summary Statistics Cards */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Leads</div>
            <div className="text-base font-black text-white">{metrics.totalCount}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">New Inquiries</div>
            <div className="text-base font-black text-blue-400">{metrics.newCount}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">In Pipeline</div>
            <div className="text-base font-black text-purple-400">{metrics.activePipeline}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Won / Booked</div>
            <div className="text-base font-black text-emerald-400">{metrics.wonCount}</div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Demand Capacity</div>
            <div className="text-base font-black text-amber-400">{metrics.totalKW} kW</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. Search & Property Filter Bar */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search leads by customer name, mobile, city, staff, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="sm:col-span-4 flex gap-2">
          <select
            value={selectedPropertyFilter}
            onChange={e => setSelectedPropertyFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Property Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Agricultural">Agricultural</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. Horizontal Pipeline Filter Pills */}
      {/* ========================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {pipelineStages.map(stage => {
          const count =
            stage.id === 'ALL' ? leads.length : leads.filter(l => l.status === stage.id).length;
          const isSelected = selectedStatus === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelectedStatus(stage.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{stage.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 5. Leads List: Card View vs Table View */}
      {/* ========================================================= */}
      {filteredLeads.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">No solar leads found</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {search || selectedStatus !== 'ALL'
                ? 'Try adjusting your search criteria or status filter.'
                : 'Get started by creating your first customer solar inquiry.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleTriggerAddLead}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Solar Lead</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID / CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredLeads.map(lead => {
            const leadName = lead.name || lead.customerName || 'Inquiry';
            const capacity = lead.expectedCapacityKW || (lead.systemCapacity ? parseFloat(lead.systemCapacity) : 5);
            return (
              <div
                key={lead.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-sm hover:shadow-md group relative"
              >
                {/* Top: Customer name, kW pill, status selector */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => handleOpenLeadView(lead)}
                    className="cursor-pointer group-hover:text-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
                        <span>{leadName}</span>
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {capacity} kW
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">
                        {lead.city}, {lead.state}
                      </span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium">{lead.propertyType}</span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className={`text-[10px] font-bold rounded-lg py-1 px-2 border focus:outline-none transition-colors ${getStatusBadgeClass(
                      lead.status
                    )}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Quotation">Quotation</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                {/* Requirement & Monthly Bill */}
                <div className="flex items-center justify-between gap-2 text-xs bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-sky-400 font-semibold truncate">
                    <Sun className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{lead.solarRequirement}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 shrink-0">
                    Bill: <strong className="text-white">₹{lead.electricityBillMonthly || lead.electricityBill || 0}</strong>/mo
                  </div>
                </div>

                {/* Next Followup / Staff */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                  <span className="truncate">
                    Staff: <strong className="text-slate-300">{lead.assignedStaffName || 'Unassigned'}</strong>
                  </span>
                  {lead.nextFollowUpDate && (
                    <span className="text-amber-400/90 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{lead.nextFollowUpDate}</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons Bar */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  {/* Direct Contact Tools */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${lead.mobile}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700 transition-colors"
                      title="Direct Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/91${lead.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                        leadName
                      )}%2C%20following%20up%20regarding%20your%20${capacity}kW%20solar%20inquiry.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700 transition-colors"
                      title="Send WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAddFollowupWithLead) onOpenAddFollowupWithLead(lead);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-purple-600/30 text-purple-400 border border-slate-700 transition-colors"
                      title="Schedule Follow-up"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>

                    {onOpenGPSPhotoForLead && (
                      <button
                        type="button"
                        onClick={() => onOpenGPSPhotoForLead(lead)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 border border-slate-700 transition-colors"
                        title="GPS Photo Check-In & Site Visit"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Primary "View Lead" and "Quote" */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenQuotationForLead) onOpenQuotationForLead(lead);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Create Solar Quotation"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Quote</span>
                    </button>

                    <button
                      id={`view-lead-btn-${lead.id}`}
                      type="button"
                      onClick={() => handleOpenLeadView(lead)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow transition-all hover:scale-105"
                      title="Open 360° Lead View & Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / PIPELINE LIST VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3 px-4">Lead & Customer</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Requirement</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLeads.map(lead => {
                  const leadName = lead.name || lead.customerName || 'Inquiry';
                  const capacity = lead.expectedCapacityKW || (lead.systemCapacity ? parseFloat(lead.systemCapacity) : 5);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div
                          onClick={() => handleOpenLeadView(lead)}
                          className="font-bold text-white hover:text-amber-400 cursor-pointer transition-colors"
                        >
                          {leadName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{lead.mobile}</span>
                          {lead.leadSource && (
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {lead.leadSource}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200">{lead.city}</div>
                        <div className="text-[10px] text-slate-400">{lead.state}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-sky-300 font-medium">{lead.solarRequirement}</div>
                        <div className="text-[10px] text-slate-400">{lead.propertyType}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          {capacity} kW
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className={`text-[10px] font-bold rounded-lg py-1 px-2 border focus:outline-none ${getStatusBadgeClass(
                            lead.status
                          )}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Site Visit">Site Visit</option>
                          <option value="Quotation">Quotation</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {lead.assignedStaffName || 'Unassigned'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenLeadView(lead)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
                            title="View Lead 360"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenQuotationForLead) onOpenQuotationForLead(lead);
                            }}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            title="Create Quotation"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`tel:${lead.mobile}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 border border-slate-700"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. COMPREHENSIVE "VIEW LEAD 360°" MODAL */}
      {/* ========================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col text-xs text-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-slate-950/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                    ID: {selectedLead.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                      selectedLead.status
                    )}`}
                  >
                    {selectedLead.status}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white">
                  {selectedLead.name || selectedLead.customerName}
                </h3>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>
                    {selectedLead.address ? `${selectedLead.address}, ` : ''}
                    {selectedLead.city}, {selectedLead.state}
                    {selectedLead.pincode ? ` - ${selectedLead.pincode}` : ''}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit Mode Button */}
                <button
                  type="button"
                  onClick={() => setIsEditingInModal(!isEditingInModal)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isEditingInModal
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingInModal ? 'Cancel Edit' : 'Edit Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Pipeline Interactive Stepper */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Sales Pipeline Progress</span>
                  <span className="text-amber-400">Click to advance stage</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {(['New', 'Contacted', 'Site Visit', 'Quotation', 'Negotiation', 'Won'] as LeadStatus[]).map(
                    stage => {
                      const isCurrent = selectedLead.status === stage;
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => {
                            updateLeadStatus(selectedLead.id, stage);
                            setSelectedLead(prev => (prev ? { ...prev, status: stage } : null));
                          }}
                          className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-bold transition-all border ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {stage}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Edit Mode vs View Mode */}
              {isEditingInModal ? (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                    <Edit3 className="w-4 h-4" /> Editing Lead Information
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Customer Full Name *
                      </label>
                      <input
                        type="text"
                        value={editFormData.name || ''}
                        onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        value={editFormData.mobile || ''}
                        onChange={e => setEditFormData({ ...editFormData, mobile: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Target Capacity (kW)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={editFormData.expectedCapacityKW || 5}
                        onChange={e =>
                          setEditFormData({
                            ...editFormData,
                            expectedCapacityKW: parseFloat(e.target.value) || 1
                          })
                        }
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Monthly Electricity Bill (₹)
                      </label>
                      <input
                        type="number"
                        value={editFormData.electricityBillMonthly || 0}
                        onChange={e =>
                          setEditFormData({
                            ...editFormData,
                            electricityBillMonthly: parseFloat(e.target.value) || 0
                          })
                        }
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Property Type
                      </label>
                      <select
                        value={editFormData.propertyType || 'Residential'}
                        onChange={e =>
                          setEditFormData({
                            ...editFormData,
                            propertyType: e.target.value as PropertyType
                          })
                        }
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Agricultural">Agricultural</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Solar Requirement
                      </label>
                      <select
                        value={editFormData.solarRequirement || 'Rooftop On-Grid'}
                        onChange={e =>
                          setEditFormData({
                            ...editFormData,
                            solarRequirement: e.target.value as SolarRequirementType
                          })
                        }
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Rooftop On-Grid">Rooftop On-Grid</option>
                        <option value="Rooftop Off-Grid">Rooftop Off-Grid</option>
                        <option value="Rooftop Hybrid">Rooftop Hybrid</option>
                        <option value="Solar Pump">Solar Pump</option>
                        <option value="Ground Mount">Ground Mount</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Assigned Staff
                      </label>
                      <select
                        value={editFormData.assignedStaffName || ''}
                        onChange={e =>
                          setEditFormData({ ...editFormData, assignedStaffName: e.target.value })
                        }
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {allUsers.map(u => (
                          <option key={u.id} value={u.name}>
                            {u.name} ({u.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Next Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={editFormData.nextFollowUpDate || ''}
                        onChange={e =>
                          setEditFormData({ ...editFormData, nextFollowUpDate: e.target.value })
                        }
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Notes & Observations
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.notes || ''}
                      onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingInModal(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLeadEdits}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard View Mode */
                <>
                  {/* Contact & Geography Details */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" /> Customer Contact & Location
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyMobile(selectedLead.mobile)}
                        className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                      >
                        {copiedMobile ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Mobile
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mobile</span>
                        <a
                          href={`tel:${selectedLead.mobile}`}
                          className="font-bold text-white hover:text-amber-400 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{selectedLead.mobile}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Alt Mobile</span>
                        <strong className="text-slate-200">
                          {selectedLead.alternateMobile || 'Not provided'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Email</span>
                        <strong className="text-slate-200 truncate block">
                          {selectedLead.email || 'Not provided'}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Lead Source</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold text-[10px]">
                          {selectedLead.leadSource || 'Direct'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Solar Technical Feasibility & Estimated ROI */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5" /> Technical Requirement & Solar Feasibility
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Target Capacity</span>
                        <strong className="text-base font-black text-amber-400">
                          {selectedLead.expectedCapacityKW || 5} kW
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">System Type</span>
                        <strong className="text-sky-400 font-bold">
                          {selectedLead.solarRequirement}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Property Type</span>
                        <strong className="text-white font-semibold">
                          {selectedLead.propertyType}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Monthly Bill</span>
                        <strong className="text-white font-bold">
                          ₹{selectedLead.electricityBillMonthly || selectedLead.electricityBill || 0}
                        </strong>
                      </div>
                    </div>

                    {/* Calculated Feasibility Metrics */}
                    {(() => {
                      const kw = selectedLead.expectedCapacityKW || 5;
                      const roofAreaReq = kw * 100; // ~100 sqft per kW
                      const dailyGen = (kw * 4.2).toFixed(1); // ~4.2 kWh per kW/day
                      const monthlyGen = Math.round(kw * 125);
                      const annualCo2 = (kw * 1.25).toFixed(1);

                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 bg-slate-900/60 p-2.5 rounded-xl text-center">
                          <div>
                            <div className="text-[10px] text-slate-400">Roof Area Req.</div>
                            <div className="font-bold text-slate-200">~{roofAreaReq} sq.ft</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Daily Generation</div>
                            <div className="font-bold text-emerald-400">~{dailyGen} kWh/day</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Monthly Yield</div>
                            <div className="font-bold text-sky-400">~{monthlyGen} Units</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">CO2 Offset</div>
                            <div className="font-bold text-amber-400">~{annualCo2} T/yr</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Staff Assignment & Follow-Up Info */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Sales Execution & Follow-Up
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Assigned Sales Staff</span>
                        <div className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span>{selectedLead.assignedStaffName || 'Unassigned'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Next Scheduled Follow-up</span>
                        <div className="font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{selectedLead.nextFollowUpDate || 'No date scheduled'}</span>
                        </div>
                      </div>
                    </div>

                    {selectedLead.notes && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block mb-0.5 uppercase font-semibold">
                          Notes / Observations:
                        </span>
                        <p className="text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                          {selectedLead.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Bottom Actions Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedLead.mobile}`}
                  className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/91${selectedLead.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                    selectedLead.name || selectedLead.customerName
                  )}%2C%20following%20up%20regarding%20your%20${
                    selectedLead.expectedCapacityKW || 5
                  }kW%20solar%20inquiry.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenQuotationForLead) onOpenQuotationForLead(selectedLead);
                    setSelectedLead(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Quotation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAddFollowupWithLead) onOpenAddFollowupWithLead(selectedLead);
                    setSelectedLead(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Follow-up</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. Built-in Add Lead Modal (Fail-Safe) */}
      {/* ========================================================= */}
      <AddLeadModal
        isOpen={internalAddLeadOpen}
        onClose={() => setInternalAddLeadOpen(false)}
      />
    </div>
  );
};
