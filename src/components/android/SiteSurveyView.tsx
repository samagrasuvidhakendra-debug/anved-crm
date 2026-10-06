import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteSurvey, RoofType, ShadowCondition } from '../../types';
import {
  Compass,
  Camera,
  Plus,
  Search,
  CheckCircle2,
  MapPin,
  Sun,
  Layers,
  X,
  Image as ImageIcon,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SiteSurveyViewProps {
  onOpenGPSPhoto?: (initialData?: { customerName?: string; address?: string }) => void;
  onInspectMapsGrounding?: (data: { name: string; lat: number; lng: number; address: string }) => void;
}

export const SiteSurveyView: React.FC<SiteSurveyViewProps> = ({
  onOpenGPSPhoto,
  onInspectMapsGrounding
}) => {
  const { siteSurveys, addSiteSurvey, currentUser, customers } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    customerName: customers[0]?.name || '',
    address: customers[0]?.address || '',
    roofType: 'RCC Flat' as RoofType,
    roofAreaSqFt: 1200,
    shadowFreeAreaSqFt: 950,
    shadowCondition: 'No Shadow' as ShadowCondition,
    connectionType: 'Three Phase' as 'Single Phase' | 'Three Phase',
    sanctionedLoadKW: 8,
    averageMonthlyBill: 6500,
    consumerNumber: 'MH-78901234',
    discomName: 'MSEDCL',
    recommendedCapacityKW: 5,
    surveyorName: currentUser.name,
    surveyDate: new Date().toISOString().split('T')[0],
    notes: 'South-facing unobstructed RCC terrace suitable for 5kW On-Grid solar plant.',
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&auto=format&fit=crop&q=80'
    ]
  });

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    addSiteSurvey({
      ...formData,
      franchiseId: currentUser.franchiseId,
      status: 'Completed'
    });
    setShowAddModal(false);
  };

  const filteredSurveys = siteSurveys.filter(s =>
    (s.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.address || s.siteAddress || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.consumerNumber || s.electricityBillNo || '').includes(search)
  );

  return (
    <div id="site-surveys-view" className="p-4 space-y-4 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-white">Rooftop Site Surveys</h2>
          <p className="text-[11px] text-slate-400">
            Field technical appraisals, shadow analysis & Discom connection specs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenGPSPhoto && (
            <button
              onClick={() => onOpenGPSPhoto()}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow hover:brightness-110 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" /> GPS Survey Photo
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center gap-1 shadow"
          >
            <Plus className="w-4 h-4" /> New Survey
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by customer, address, consumer no..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Surveys List */}
      <div className="space-y-3">
        {filteredSurveys.map(survey => (
          <div
            key={survey.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {survey.id} • {survey.surveyDate}
                </span>
                <h3 className="text-sm font-bold text-white">{survey.customerName}</h3>
                <p className="text-[11px] text-slate-400">{survey.address || survey.siteAddress}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {survey.status}
              </span>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <div>
                <span className="text-slate-500 text-[10px] block">Roof Spec:</span>
                <span className="font-semibold text-slate-200">{survey.roofType} ({survey.shadowFreeAreaSqFt || survey.availableArea || 0} sq ft free)</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Shadow Rating:</span>
                <span className="font-semibold text-emerald-400">{survey.shadowCondition}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Sanctioned Load / Discom:</span>
                <span className="font-semibold text-slate-200">{survey.sanctionedLoadKW || 5} kW ({survey.discomName || survey.meterDetails || 'MSEDCL'})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Recommended System:</span>
                <span className="font-bold text-amber-400">{survey.recommendedCapacityKW || survey.recommendedCapacity} kW</span>
              </div>
            </div>

            {/* Photos Preview */}
            {survey.photos && survey.photos.length > 0 && (
              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                {survey.photos.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt={`Site view ${i + 1}`}
                    className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                  />
                ))}
              </div>
            )}

            {/* Card Actions: GPS Photo Check-In & Google Maps Grounding */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400">
                Surveyor: <strong>{survey.surveyorName}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                {onInspectMapsGrounding && (
                  <button
                    type="button"
                    onClick={() =>
                      onInspectMapsGrounding({
                        name: survey.customerName,
                        lat: survey.gpsLocation?.latitude || 18.5204,
                        lng: survey.gpsLocation?.longitude || 73.8567,
                        address: survey.address || survey.siteAddress || 'Pune Solar Territory'
                      })
                    }
                    className="px-2 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span>Maps Intel</span>
                  </button>
                )}

                {onOpenGPSPhoto && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenGPSPhoto({
                        customerName: survey.customerName,
                        address: survey.address || survey.siteAddress
                      })
                    }
                    className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Camera className="w-3 h-3 text-emerald-400" />
                    <span>+ GPS Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Survey Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 text-xs text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" /> New Rooftop Technical Survey
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSurvey} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Customer / Property Owner *</label>
                <input
                  type="text"
                  required
                  placeholder="Customer Full Name"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Site Address</label>
                <input
                  type="text"
                  placeholder="Street / Plot address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Roof Type *</label>
                  <select
                    value={formData.roofType}
                    onChange={e => setFormData({ ...formData, roofType: e.target.value as RoofType })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="RCC Flat">RCC Flat</option>
                    <option value="Tin Shed">Tin Shed</option>
                    <option value="Tiled">Tiled</option>
                    <option value="Elevated">Elevated</option>
                    <option value="Ground">Ground</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Shadow Condition *</label>
                  <select
                    value={formData.shadowCondition}
                    onChange={e => setFormData({ ...formData, shadowCondition: e.target.value as ShadowCondition })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="No Shadow">No Shadow (Optimal)</option>
                    <option value="Partial Shadow">Partial Shadow</option>
                    <option value="Heavy Shadow">Heavy Shadow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Roof (Sq Ft)</label>
                  <input
                    type="number"
                    value={formData.roofAreaSqFt}
                    onChange={e => setFormData({ ...formData, roofAreaSqFt: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Shadow Free Area</label>
                  <input
                    type="number"
                    value={formData.shadowFreeAreaSqFt}
                    onChange={e => setFormData({ ...formData, shadowFreeAreaSqFt: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Rec. kW *</label>
                  <input
                    type="number"
                    value={formData.recommendedCapacityKW}
                    onChange={e => setFormData({ ...formData, recommendedCapacityKW: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-bold text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Electricity Discom</label>
                  <input
                    type="text"
                    value={formData.discomName}
                    onChange={e => setFormData({ ...formData, discomName: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sanctioned Load (kW)</label>
                  <input
                    type="number"
                    value={formData.sanctionedLoadKW}
                    onChange={e => setFormData({ ...formData, sanctionedLoadKW: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Technical Assessment Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
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
                  Save Survey Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
