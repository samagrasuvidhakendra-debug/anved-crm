import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FuelRecord } from '../../types';
import {
  Fuel,
  Plus,
  Search,
  Calendar,
  IndianRupee,
  User,
  Trash2,
  FileText,
  X,
  CheckCircle2,
  Building2,
  ArrowLeft,
  Briefcase
} from 'lucide-react';

interface FuelSupportManagementViewProps {
  onBack?: () => void;
}

export const FuelSupportManagementView: React.FC<FuelSupportManagementViewProps> = ({ onBack }) => {
  const {
    currentUser,
    isSuperAdmin,
    isFranchiseOwner,
    allUsers,
    filteredFuelRecords,
    addFuelRecord,
    deleteFuelRecord
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedPersonFilter, setSelectedPersonFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Field sales reps available for selection
  const fieldPersonnel = useMemo(() => {
    return allUsers.filter(u => {
      const matchesFranchise = isSuperAdmin || u.franchiseId === currentUser.franchiseId;
      const isField =
        u.role === 'FIELD_VISIT_TEAM' ||
        u.role === 'SALES_EXECUTIVE' ||
        u.role === 'SITE_SURVEYOR' ||
        u.role === 'INSTALLATION_TEAM';
      return matchesFranchise && (isField || true);
    });
  }, [allUsers, currentUser.franchiseId, isSuperAdmin]);

  // New fuel record state
  const [formData, setFormData] = useState({
    userId: fieldPersonnel[0]?.id || currentUser.id,
    fieldSalesPersonName: fieldPersonnel[0]?.name || currentUser.name,
    date: new Date().toISOString().split('T')[0],
    fuelAmount: 500,
    purpose: 'Rooftop Site Surveys & Customer Meetings',
    basicNotes: ''
  });

  // Filtered records
  const displayRecords = useMemo(() => {
    return filteredFuelRecords.filter(rec => {
      const matchesSearch =
        rec.fieldSalesPersonName.toLowerCase().includes(search.toLowerCase()) ||
        rec.purpose.toLowerCase().includes(search.toLowerCase()) ||
        (rec.basicNotes || '').toLowerCase().includes(search.toLowerCase());

      const matchesPerson = selectedPersonFilter === 'ALL' || rec.userId === selectedPersonFilter;

      return matchesSearch && matchesPerson;
    });
  }, [filteredFuelRecords, search, selectedPersonFilter]);

  // Aggregate metrics
  const totalFuelAmount = useMemo(() => {
    return displayRecords.reduce((sum, r) => sum + r.fuelAmount, 0);
  }, [displayRecords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fuelAmount || formData.fuelAmount <= 0) {
      alert('Please enter a valid fuel amount.');
      return;
    }

    const selectedPerson = allUsers.find(u => u.id === formData.userId);

    addFuelRecord({
      franchiseId: currentUser.franchiseId || 'ACS-MH-01',
      franchiseName: currentUser.franchiseName || 'ACS Solar Territory',
      userId: formData.userId,
      fieldSalesPersonName: selectedPerson?.name || formData.fieldSalesPersonName,
      date: formData.date,
      fuelAmount: Number(formData.fuelAmount),
      purpose: formData.purpose.trim(),
      basicNotes: formData.basicNotes.trim() || undefined
    });

    setIsModalOpen(false);
    setFormData({
      userId: fieldPersonnel[0]?.id || currentUser.id,
      fieldSalesPersonName: fieldPersonnel[0]?.name || currentUser.name,
      date: new Date().toISOString().split('T')[0],
      fuelAmount: 500,
      purpose: 'Rooftop Site Surveys & Customer Meetings',
      basicNotes: ''
    });
  };

  return (
    <div id="fuel-support-view" className="p-3 sm:p-5 space-y-4 text-white">
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
                <Fuel className="w-5 h-5 text-amber-400" />
                <span>Fuel / Field Travel Support</span>
              </h2>
              <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                Section 10 Simplified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Clean, simple fuel allowance records for field sales personnel without complicated expense workflows.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Fuel Provided</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Fuel Provided
            </span>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              ₹{totalFuelAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-400">Total recorded disbursements</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Fuel className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Fuel Records
            </span>
            <div className="text-xl font-black text-white mt-0.5">{displayRecords.length}</div>
            <span className="text-[11px] text-slate-400">Field trips supported</span>
          </div>
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Field Team
            </span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {new Set(displayRecords.map(r => r.userId)).size} Personnel
            </div>
            <span className="text-[11px] text-slate-400">Receiving fuel allowance</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by sales person, purpose, or notes..."
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
            value={selectedPersonFilter}
            onChange={e => setSelectedPersonFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Field Personnel</option>
            {fieldPersonnel.map(person => (
              <option key={person.id} value={person.id}>
                {person.name} ({person.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table / Cards */}
      <div className="space-y-2">
        {displayRecords.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <Fuel className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No fuel records found</h3>
            <p className="text-xs text-slate-400">
              Record fuel provided to field sales executives for site surveys and rooftop visits.
            </p>
          </div>
        ) : (
          displayRecords.map(record => (
            <div
              key={record.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <Fuel className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-white">{record.fieldSalesPersonName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                      {record.date}
                    </span>
                    {record.franchiseName && (
                      <span className="text-[10px] text-slate-400">{record.franchiseName}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 mt-1 font-medium">{record.purpose}</p>
                  {record.basicNotes && (
                    <p className="text-[11px] text-slate-400 italic mt-0.5">Note: {record.basicNotes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <div className="text-base font-black text-amber-400">
                    ₹{record.fuelAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                    Disbursed
                  </span>
                </div>

                {(isSuperAdmin || isFranchiseOwner) && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove fuel record for ${record.fieldSalesPersonName} (₹${record.fuelAmount})?`)) {
                        deleteFuelRecord(record.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* RECORD FUEL PROVIDED MODAL */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Record Fuel Support</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Field Sales Person *
                </label>
                <select
                  value={formData.userId}
                  onChange={e => {
                    const person = fieldPersonnel.find(p => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      userId: e.target.value,
                      fieldSalesPersonName: person?.name || formData.fieldSalesPersonName
                    });
                  }}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {fieldPersonnel.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name} ({person.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Fuel Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    step="50"
                    placeholder="e.g. 500"
                    value={formData.fuelAmount}
                    onChange={e => setFormData({ ...formData, fuelAmount: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rooftop visits in Andheri West & Borivali"
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Basic Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Cash handed over at franchise morning briefing"
                  value={formData.basicNotes}
                  onChange={e => setFormData({ ...formData, basicNotes: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
                >
                  Save Fuel Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
