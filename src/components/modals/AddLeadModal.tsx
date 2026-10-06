import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyType, SolarRequirementType, LeadSource } from '../../types';
import { UserPlus, X, Sun, IndianRupee } from 'lucide-react';
import { IndianStateDistrictSelect } from '../common/IndianStateDistrictSelect';
import { RightValueInput } from '../common/RightValueInput';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead, allUsers, currentUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411038',
    propertyType: 'Residential' as PropertyType,
    solarRequirement: 'Rooftop On-Grid' as SolarRequirementType,
    expectedCapacityKW: 5,
    electricityBillMonthly: 6000,
    monthlyConsumptionUnits: 450,
    leadSource: 'Google' as LeadSource,
    assignedStaffName: currentUser.name,
    nextFollowUpDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      alternateMobile: '',
      email: '',
      address: '',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      propertyType: 'Residential' as PropertyType,
      solarRequirement: 'Rooftop On-Grid' as SolarRequirementType,
      expectedCapacityKW: 5,
      electricityBillMonthly: 6000,
      monthlyConsumptionUnits: 450,
      leadSource: 'Google' as LeadSource,
      assignedStaffName: currentUser.name,
      nextFollowUpDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setErrorMsg(null);
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter Customer Name (letters only).');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile number (numbers only).');
      return;
    }
    if (formData.alternateMobile.trim() && formData.alternateMobile.length !== 10) {
      setErrorMsg('Alternate Mobile must be a valid 10-digit number.');
      return;
    }
    if (formData.email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMsg('Please enter a valid Email address.');
        return;
      }
    }
    if (!formData.state.trim()) {
      setErrorMsg('Please select State / UT.');
      return;
    }

    addLead({
      ...formData,
      customerName: formData.name,
      franchiseId: currentUser.franchiseId,
      systemCapacity: `${formData.expectedCapacityKW || 5} kW`,
      electricityBill: formData.electricityBillMonthly,
      monthlyConsumption: formData.monthlyConsumptionUnits,
      status: 'New'
    });

    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 text-xs text-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" /> Add Solar Lead (CRM)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <RightValueInput
              id="lead-name-input"
              label="Customer Name"
              type="name"
              required
              placeholder="e.g. Sunil Deshmukh"
              value={formData.name}
              onChange={val => setFormData({ ...formData, name: val })}
              hint="Letters only (no numbers)"
            />
            <RightValueInput
              id="lead-mobile-input"
              label="Mobile Number"
              type="mobile"
              required
              placeholder="9876543210"
              value={formData.mobile}
              onChange={val => setFormData({ ...formData, mobile: val })}
              hint="10-digit number only"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <RightValueInput
              id="lead-alt-mobile-input"
              label="Alternate Phone"
              type="mobile"
              placeholder="Optional (10 digits)"
              value={formData.alternateMobile}
              onChange={val => setFormData({ ...formData, alternateMobile: val })}
            />
            <RightValueInput
              id="lead-email-input"
              label="Email"
              type="email"
              placeholder="customer@domain.com"
              value={formData.email}
              onChange={val => setFormData({ ...formData, email: val })}
              hint="Email only"
            />
          </div>

          <div>
            <label htmlFor="lead-address-input" className="block text-slate-300 font-medium mb-1">
              Site Address
            </label>
            <input
              id="lead-address-input"
              type="text"
              placeholder="House/Plot, Society, Landmark"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <IndianStateDistrictSelect
            idPrefix="lead-geo"
            selectedState={formData.state}
            selectedDistrict={formData.city}
            onStateChange={val => setFormData({ ...formData, state: val })}
            onDistrictChange={val => setFormData({ ...formData, city: val })}
            stateLabel="State / UT"
            districtLabel="District / City"
            stateRequired
          />

          <RightValueInput
            id="lead-pincode-input"
            label="Site Pincode"
            type="pincode"
            placeholder="e.g. 411038"
            value={formData.pincode}
            onChange={val => setFormData({ ...formData, pincode: val })}
            hint="6 digits only"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={e => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Agricultural">Agricultural</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Solar Requirement</label>
              <select
                value={formData.solarRequirement}
                onChange={e => setFormData({ ...formData, solarRequirement: e.target.value as SolarRequirementType })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Rooftop On-Grid">Rooftop On-Grid</option>
                <option value="Rooftop Off-Grid">Rooftop Off-Grid</option>
                <option value="Rooftop Hybrid">Rooftop Hybrid</option>
                <option value="Ground Mount">Ground Mount</option>
                <option value="Solar Pump">Solar Pump</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Capacity (kW) *</label>
              <input
                type="number"
                value={formData.expectedCapacityKW}
                onChange={e => setFormData({ ...formData, expectedCapacityKW: Number(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Avg Bill (₹/mo)</label>
              <input
                type="number"
                value={formData.electricityBillMonthly}
                onChange={e => setFormData({ ...formData, electricityBillMonthly: Number(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Units (kWh/mo)</label>
              <input
                type="number"
                value={formData.monthlyConsumptionUnits}
                onChange={e => setFormData({ ...formData, monthlyConsumptionUnits: Number(e.target.value) })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Lead Source</label>
              <select
                value={formData.leadSource}
                onChange={e => setFormData({ ...formData, leadSource: e.target.value as LeadSource })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Google">Google / Website</option>
                <option value="Facebook">Facebook Ads</option>
                <option value="Referral">Customer Referral</option>
                <option value="Walk-in">Walk-in Hub</option>
                <option value="Telecalling">Telecalling Desk</option>
                <option value="Field Agent">Field Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Follow-up Date</label>
              <input
                type="date"
                value={formData.nextFollowUpDate}
                onChange={e => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Initial Consultation Notes</label>
            <textarea
              rows={2}
              placeholder="Roof orientation, electricity connection details, special customer request..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
            >
              Save Solar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
