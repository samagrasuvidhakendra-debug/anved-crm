import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Franchise } from '../../types';
import { IndianStateDistrictSelect } from '../common/IndianStateDistrictSelect';
import { RightValueInput } from '../common/RightValueInput';
import { getDiscomNamesForState, STATE_DISCOMS_MAP } from '../../data/indiaDiscomData';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderGit2,
  IndianRupee,
  Eye,
  Edit2,
  X,
  Zap,
  Sliders,
  Check,
  CheckSquare,
  Square,
  Save,
  Trash2,
  PlayCircle,
  PauseCircle,
  ShieldAlert
} from 'lucide-react';

export const FranchiseManagementView: React.FC = () => {
  const {
    allFranchises,
    addFranchise,
    updateFranchise,
    deleteFranchise,
    allUsers,
    customers,
    leads,
    projects,
    payments
  } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [franchiseToDelete, setFranchiseToDelete] = useState<Franchise | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Configure Area & DISCOM Modal state
  const [editingAreaFranchise, setEditingAreaFranchise] = useState<Franchise | null>(null);
  const [editAreaState, setEditAreaState] = useState('');
  const [editAreaDistrict, setEditAreaDistrict] = useState('');
  const [editAreaName, setEditAreaName] = useState('');
  const [editAreaPincodes, setEditAreaPincodes] = useState('');
  const [editAreaDiscoms, setEditAreaDiscoms] = useState<string[]>([]);
  const [customDiscomInput, setCustomDiscomInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // New franchise form state
  const [formData, setFormData] = useState({
    franchiseName: '',
    franchiseCode: '',
    ownerName: '',
    ownerMobile: '',
    ownerEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    areaName: '',
    assignedPincodes: [] as string[],
    assignedDiscoms: [] as string[],
    startDate: new Date().toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'Inactive' | 'Suspended',
    notes: ''
  });

  const filteredFranchises = allFranchises.filter(f =>
    f.franchiseName.toLowerCase().includes(search.toLowerCase()) ||
    f.city.toLowerCase().includes(search.toLowerCase()) ||
    f.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    (f.areaName && f.areaName.toLowerCase().includes(search.toLowerCase())) ||
    (f.assignedDiscoms && f.assignedDiscoms.some(d => d.toLowerCase().includes(search.toLowerCase())))
  );

  const handleOpenEditArea = (franchise: Franchise) => {
    const fState = franchise.state || 'Maharashtra';
    const defaultDiscoms = getDiscomNamesForState(fState);
    setEditingAreaFranchise(franchise);
    setEditAreaState(fState);
    setEditAreaDistrict(franchise.district || franchise.city || '');
    setEditAreaName(franchise.areaName || `${franchise.district || franchise.city} Zone`);
    setEditAreaPincodes((franchise.assignedPincodes || [franchise.pincode]).filter(Boolean).join(', '));
    setEditAreaDiscoms(franchise.assignedDiscoms && franchise.assignedDiscoms.length > 0
      ? franchise.assignedDiscoms
      : defaultDiscoms);
    setCustomDiscomInput('');
  };

  const handleSaveEditArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAreaFranchise) return;

    const pincodeList = editAreaPincodes
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    updateFranchise(editingAreaFranchise.id, {
      state: editAreaState,
      district: editAreaDistrict,
      city: editAreaDistrict || editingAreaFranchise.city,
      areaName: editAreaName.trim() || `${editAreaDistrict || editingAreaFranchise.city} Zone`,
      assignedPincodes: pincodeList,
      assignedDiscoms: editAreaDiscoms,
      operatingRegion: `${editAreaDistrict ? `${editAreaDistrict}, ` : ''}${editAreaState}`
    });

    setSaveSuccessMsg(`Area parameters and DISCOM selection for ${editingAreaFranchise.franchiseName} successfully updated.`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
    setEditingAreaFranchise(null);
  };

  const toggleDiscom = (discom: string) => {
    setEditAreaDiscoms(prev =>
      prev.includes(discom) ? prev.filter(d => d !== discom) : [...prev, discom]
    );
  };

  const handleAddCustomDiscom = () => {
    if (!customDiscomInput.trim()) return;
    const trimmed = customDiscomInput.trim();
    if (!editAreaDiscoms.includes(trimmed)) {
      setEditAreaDiscoms(prev => [...prev, trimmed]);
    }
    setCustomDiscomInput('');
  };

  const handleCreateFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.franchiseName.trim()) {
      setFormError('Please enter a Franchise Name.');
      return;
    }
    if (!formData.ownerName.trim()) {
      setFormError('Please enter the Owner Name (letters only).');
      return;
    }
    if (!formData.ownerMobile.trim() || formData.ownerMobile.length !== 10) {
      setFormError('Please enter a valid 10-digit Owner Mobile number (numbers only).');
      return;
    }
    if (formData.ownerEmail.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.ownerEmail.trim())) {
        setFormError('Please enter a valid Owner Email (e.g. name@domain.com).');
        return;
      }
    }
    if (!formData.state.trim()) {
      setFormError('Please select a Franchise State / UT.');
      return;
    }
    if (!formData.city.trim()) {
      setFormError('Please select or enter the Franchise District / City.');
      return;
    }

    setFormError(null);
    const resolvedDiscoms = formData.assignedDiscoms.length > 0
      ? formData.assignedDiscoms
      : getDiscomNamesForState(formData.state || 'Maharashtra');

    const resolvedPincodes = formData.assignedPincodes.length > 0
      ? formData.assignedPincodes
      : (formData.pincode ? [formData.pincode] : []);

    addFranchise({
      ...formData,
      district: formData.city,
      areaName: formData.areaName.trim() || `${formData.city} Area`,
      assignedPincodes: resolvedPincodes,
      assignedDiscoms: resolvedDiscoms,
      operatingRegion: `${formData.city ? `${formData.city}, ` : ''}${formData.state}`,
      franchiseCode: formData.franchiseCode || `ACS-${(formData.city || 'HQ').substring(0, 2).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`
    });

    setShowAddModal(false);
    setFormData({
      franchiseName: '',
      franchiseCode: '',
      ownerName: '',
      ownerMobile: '',
      ownerEmail: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      areaName: '',
      assignedPincodes: [],
      assignedDiscoms: [],
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      notes: ''
    });
  };

  return (
    <div id="franchise-management-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Success Toast Banner */}
      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {toastMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" /> Franchise Network Directory
          </h1>
          <p className="text-xs text-slate-400">
            Provision and configure territorial boundaries, covered pincodes, and authorized DISCOMs for each franchise
          </p>
        </div>
        <button
          id="add-franchise-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Add Franchise
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search franchises by name, owner, area, or DISCOM..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Franchise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFranchises.map(franchise => {
          const fUsers = allUsers.filter(u => u.franchiseId === franchise.id);
          const fProjects = projects.filter(p => p.franchiseId === franchise.id);
          const fSales = fProjects.reduce((acc, p) => acc + p.finalAmount, 0);
          const fDiscoms = franchise.assignedDiscoms && franchise.assignedDiscoms.length > 0
            ? franchise.assignedDiscoms
            : getDiscomNamesForState(franchise.state || 'Maharashtra');

          return (
            <div
              key={franchise.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                      {franchise.franchiseCode}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{franchise.franchiseName}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      franchise.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : franchise.status === 'Suspended'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {franchise.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Owner: <strong>{franchise.ownerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{franchise.ownerMobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{franchise.city}, {franchise.state}</span>
                  </div>
                </div>

                {/* Operating Area & DISCOM Tags */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1.5 mb-3 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-amber-300 truncate">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{franchise.areaName || `${franchise.city} Territory`}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">
                      PIN: {(franchise.assignedPincodes || [franchise.pincode])[0] || 'All'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-300 flex-wrap">
                    <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-slate-400 font-semibold">DISCOMs:</span>
                    {fDiscoms.slice(0, 2).map(d => (
                      <span key={d} className="bg-slate-800/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20 truncate max-w-[120px]">
                        {d.split(' ')[0]}
                      </span>
                    ))}
                    {fDiscoms.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        +{fDiscoms.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Micro Stats */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">Team</div>
                    <div className="text-xs font-bold text-white">{fUsers.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Projects</div>
                    <div className="text-xs font-bold text-sky-400">{fProjects.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Booked Sales</div>
                    <div className="text-xs font-bold text-amber-400">₹{(fSales / 100000).toFixed(1)}L</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 flex-wrap">
                <button
                  onClick={() => setSelectedFranchise(franchise)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> 360° View
                </button>
                <button
                  onClick={() => handleOpenEditArea(franchise)}
                  title="Configure Area, Covered Pincodes, and Assigned DISCOMs"
                  className="py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" /> Area
                </button>

                {franchise.status === 'Suspended' ? (
                  <button
                    onClick={() => {
                      updateFranchise(franchise.id, { status: 'Active' });
                      setToastMsg(`Franchise ${franchise.franchiseName} successfully reactivated.`);
                    }}
                    title="Reactivate franchise"
                    className="py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-emerald-400" /> Reactivate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateFranchise(franchise.id, { status: 'Suspended' });
                      setToastMsg(`Franchise ${franchise.franchiseName} suspended immediately.`);
                    }}
                    title="Suspend franchise operations"
                    className="py-1.5 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <PauseCircle className="w-3.5 h-3.5 text-rose-400" /> Suspend
                  </button>
                )}

                <button
                  onClick={() => setFranchiseToDelete(franchise)}
                  title="Remove / Delete Franchise"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Franchise 360 Detail Modal */}
      {selectedFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  {selectedFranchise.franchiseCode}
                </span>
                <h2 className="text-xl font-black text-white">{selectedFranchise.franchiseName}</h2>
                <p className="text-xs text-slate-400">{selectedFranchise.address}, {selectedFranchise.city}, {selectedFranchise.state} - {selectedFranchise.pincode}</p>
              </div>
              <button
                onClick={() => setSelectedFranchise(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Area & DISCOM Configuration Summary */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Territorial Area & DISCOM Authorization
                </h4>
                <button
                  onClick={() => {
                    const f = selectedFranchise;
                    setSelectedFranchise(null);
                    handleOpenEditArea(f);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] flex items-center gap-1 border border-amber-500/30 transition-colors"
                >
                  <Sliders className="w-3 h-3" /> Edit Settings
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Designated Operating Area:</span>
                  <span className="font-bold text-white text-sm">
                    {selectedFranchise.areaName || `${selectedFranchise.city} Area`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">State & District:</span>
                  <span className="font-semibold text-white">
                    {selectedFranchise.district ? `${selectedFranchise.district}, ` : ''}{selectedFranchise.state}
                  </span>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px]">Assigned Pincodes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(selectedFranchise.assignedPincodes && selectedFranchise.assignedPincodes.length > 0
                      ? selectedFranchise.assignedPincodes
                      : [selectedFranchise.pincode]
                    ).filter(Boolean).map(pin => (
                      <span key={pin} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px]">Authorized DISCOMs:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(selectedFranchise.assignedDiscoms && selectedFranchise.assignedDiscoms.length > 0
                      ? selectedFranchise.assignedDiscoms
                      : getDiscomNamesForState(selectedFranchise.state || 'Maharashtra')
                    ).map(discom => (
                      <span key={discom} className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span>{discom}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Primary Franchise Owner</h4>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>Name: <strong className="text-white">{selectedFranchise.ownerName}</strong></div>
                <div>Mobile: <strong className="text-white">{selectedFranchise.ownerMobile}</strong></div>
                <div>Email: <strong className="text-white">{selectedFranchise.ownerEmail}</strong></div>
                <div>Start Date: <strong className="text-white">{selectedFranchise.startDate}</strong></div>
              </div>
              {selectedFranchise.notes && (
                <div className="pt-2 text-slate-400 italic">Notes: {selectedFranchise.notes}</div>
              )}
            </div>

            {/* Franchise Performance Snapshot */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Associated Business Data</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Staff Assigned</div>
                  <div className="text-base font-bold text-white">
                    {allUsers.filter(u => u.franchiseId === selectedFranchise.id).length}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Leads</div>
                  <div className="text-base font-bold text-amber-400">
                    {leads.filter(l => l.franchiseId === selectedFranchise.id).length}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Customers</div>
                  <div className="text-base font-bold text-teal-400">
                    {customers.filter(c => c.franchiseId === selectedFranchise.id).length}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Projects</div>
                  <div className="text-base font-bold text-sky-400">
                    {projects.filter(p => p.franchiseId === selectedFranchise.id).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Downlines & Sales Team Roster */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-400" /> Downline Personnel & Sales Team
                </h4>
                <span className="text-[10px] text-slate-400">
                  {allUsers.filter(u => u.franchiseId === selectedFranchise.id).length} Active Members
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {allUsers
                  .filter(u => u.franchiseId === selectedFranchise.id)
                  .map(member => (
                    <div
                      key={member.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={member.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={member.name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{member.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <span className="text-amber-400">{member.role.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{member.mobile}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                          member.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {selectedFranchise.status === 'Suspended' ? (
                  <button
                    onClick={() => {
                      updateFranchise(selectedFranchise.id, { status: 'Active' });
                      setSelectedFranchise({ ...selectedFranchise, status: 'Active' });
                      setToastMsg(`Franchise ${selectedFranchise.franchiseName} reactivated.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4 text-emerald-400" /> Reactivate Franchise
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateFranchise(selectedFranchise.id, { status: 'Suspended' });
                      setSelectedFranchise({ ...selectedFranchise, status: 'Suspended' });
                      setToastMsg(`Franchise ${selectedFranchise.franchiseName} suspended.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <PauseCircle className="w-4 h-4 text-rose-400" /> Suspend Franchise
                  </button>
                )}

                <button
                  onClick={() => {
                    const toDel = selectedFranchise;
                    setSelectedFranchise(null);
                    setFranchiseToDelete(toDel);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-700/60 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" /> Remove Franchise
                </button>
              </div>

              <button
                onClick={() => setSelectedFranchise(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Area & DISCOM Configuration Modal */}
      {editingAreaFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" /> Configure Area & DISCOM Access
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set the geographical operational territory and available DISCOMs for <strong>{editingAreaFranchise.franchiseName}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingAreaFranchise(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditArea} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  Area / Zone Territory Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai West & Suburban Zone"
                  value={editAreaName}
                  onChange={e => setEditAreaName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Displayed on the franchise dashboard and PM Surya Ghar registration forms
                </span>
              </div>

              <IndianStateDistrictSelect
                idPrefix="edit-franchise-geo"
                selectedState={editAreaState}
                selectedDistrict={editAreaDistrict}
                onStateChange={val => {
                  setEditAreaState(val);
                  // When state changes, update DISCOM selection options
                  const newStateDiscoms = getDiscomNamesForState(val);
                  setEditAreaDiscoms(newStateDiscoms);
                }}
                onDistrictChange={val => setEditAreaDistrict(val)}
                stateLabel="Operating State / UT *"
                districtLabel="Operating District / City *"
                districtRequired
              />

              <div>
                <label className="block text-slate-200 font-bold mb-1">
                  Covered Pincodes (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 400050, 400051, 400052, 400053"
                  value={editAreaPincodes}
                  onChange={e => setEditAreaPincodes(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Pincodes where this franchise is authorized to book consumer solar connections
                </span>
              </div>

              {/* DISCOM Selection Section */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-slate-200 font-bold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> Authorized DISCOMs for this Area *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Franchise owners will be restricted to select from these DISCOMs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditAreaDiscoms(getDiscomNamesForState(editAreaState))}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-amber-500 text-[10px] text-amber-300 font-semibold"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditAreaDiscoms([])}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-rose-500 text-[10px] text-rose-300 font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {getDiscomNamesForState(editAreaState).map(discom => {
                    const isChecked = editAreaDiscoms.includes(discom);
                    return (
                      <div
                        key={discom}
                        onClick={() => toggleDiscom(discom)}
                        className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                            : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:bg-slate-850'
                        }`}
                      >
                        <span className="text-xs font-medium">{discom}</span>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom DISCOM */}
                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom private or special DISCOM..."
                    value={customDiscomInput}
                    onChange={e => setCustomDiscomInput(e.target.value)}
                    className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomDiscom}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAreaFranchise(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Area & DISCOM Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Franchise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" /> Provision New Franchise
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateFranchise} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="franchise-name-input" className="block text-slate-300 font-medium mb-1">
                    Franchise Name <span className="text-amber-400 font-bold">*</span>
                  </label>
                  <input
                    id="franchise-name-input"
                    type="text"
                    required
                    placeholder="e.g. ACS Solar Pune Hub"
                    value={formData.franchiseName}
                    onChange={e => setFormData({ ...formData, franchiseName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <RightValueInput
                  id="franchise-code-input"
                  label="Franchise Code / ID"
                  type="code"
                  value={formData.franchiseCode}
                  onChange={val => setFormData({ ...formData, franchiseCode: val })}
                  placeholder="Auto-generated if blank (e.g. ACS-MH-05)"
                  hint="Uppercase letters, digits, and hyphens only"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <RightValueInput
                  id="franchise-owner-name-input"
                  label="Owner Name"
                  type="name"
                  required
                  value={formData.ownerName}
                  onChange={val => setFormData({ ...formData, ownerName: val })}
                  placeholder="e.g. Aniket Sawant"
                  hint="Letters only (no numbers allowed)"
                />
                <RightValueInput
                  id="franchise-owner-mobile-input"
                  label="Owner Mobile"
                  type="mobile"
                  required
                  value={formData.ownerMobile}
                  onChange={val => setFormData({ ...formData, ownerMobile: val })}
                  placeholder="9876543210"
                  hint="Strictly 10-digit number (digits only)"
                />
                <RightValueInput
                  id="franchise-owner-email-input"
                  label="Owner Email"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={val => setFormData({ ...formData, ownerEmail: val })}
                  placeholder="owner@domain.com"
                  hint="Valid email format only"
                />
              </div>

              <div>
                <label htmlFor="franchise-address-input" className="block text-slate-300 font-medium mb-1">
                  Commercial Address
                </label>
                <input
                  id="franchise-address-input"
                  type="text"
                  placeholder="Street / Office number / Landmark"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <IndianStateDistrictSelect
                idPrefix="franchise-geo"
                selectedState={formData.state}
                selectedDistrict={formData.city}
                onStateChange={val => {
                  const stateDiscoms = getDiscomNamesForState(val);
                  setFormData({
                    ...formData,
                    state: val,
                    assignedDiscoms: stateDiscoms
                  });
                }}
                onDistrictChange={val => setFormData({ ...formData, city: val })}
                stateLabel="Franchise State / UT"
                districtLabel="Franchise District / City"
                stateRequired
                districtRequired
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="franchise-area-input" className="block text-slate-300 font-medium mb-1">
                    Area / Zone Name
                  </label>
                  <input
                    id="franchise-area-input"
                    type="text"
                    placeholder="e.g. Pune City & Pimpri Zone"
                    value={formData.areaName}
                    onChange={e => setFormData({ ...formData, areaName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <RightValueInput
                  id="franchise-pincodes-input"
                  label="Covered Pincodes"
                  type="pincodes"
                  value={formData.pincode}
                  onChange={val => {
                    const pins = val.split(',').map(p => p.trim()).filter(Boolean);
                    setFormData({ ...formData, pincode: val, assignedPincodes: pins });
                  }}
                  placeholder="411001, 411002, 411004"
                  hint="6-digit numbers and commas only"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  {/* Interactive Button Segment for 100% reliable clickability */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    {(['Active', 'Inactive', 'Suspended'] as const).map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: st })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                          formData.status === st
                            ? st === 'Active'
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                              : st === 'Inactive'
                              ? 'bg-amber-500 text-slate-950 font-bold shadow'
                              : 'bg-rose-500 text-white font-bold shadow'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="franchise-start-date" className="block text-slate-300 font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    id="franchise-start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Franchise Agreement</label>
                <textarea
                  rows={2}
                  placeholder="Special terms or territory coverage..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Create Franchise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Remove Franchise Confirmation Modal */}
      {franchiseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remove Franchise?</h3>
                <p className="text-xs text-rose-300/80">Permanent Administrative Action</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="text-slate-300">
                You are about to remove <strong className="text-white">{franchiseToDelete.franchiseName}</strong> (Code: <code className="text-amber-400 font-mono">{franchiseToDelete.franchiseCode || franchiseToDelete.id}</code>).
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Primary Owner: <strong>{franchiseToDelete.ownerName}</strong> ({franchiseToDelete.ownerMobile}). This will revoke franchise platform access and archive downline linkages.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFranchiseToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFranchise(franchiseToDelete.id);
                  setToastMsg(`Franchise ${franchiseToDelete.franchiseName} and downline credentials successfully removed.`);
                  setFranchiseToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" /> Confirm & Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
