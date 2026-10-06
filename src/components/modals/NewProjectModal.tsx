import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus, StructureType } from '../../types';
import { FolderGit2, X, Sun } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, customers, currentUser } = useApp();

  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [customerMobile, setCustomerMobile] = useState(customers[0]?.mobile || customers[0]?.phone || '+91 98221 55667');
  const [customerAddress, setCustomerAddress] = useState(customers[0]?.address || 'Baner, Pune');
  const [systemCapacityKW, setSystemCapacityKW] = useState(5);
  const [panelBrand, setPanelBrand] = useState('Waaree 540W Mono PERC');
  const [panelQuantity, setPanelQuantity] = useState(10);
  const [inverterBrand, setInverterBrand] = useState('Growatt 5kW Dual MPPT');
  const [structureType, setStructureType] = useState<StructureType>('Elevated');
  const [totalValue, setTotalValue] = useState(245000);
  const [advanceReceived, setAdvanceReceived] = useState(50000);
  const [assignedLead, setAssignedLead] = useState('Prakash Shinde (Field EPC Lead)');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter customer name');
      return;
    }

    addProject({
      projectName: `${customerName} - ${systemCapacityKW}kW Solar Plant`,
      customerId: 'CUST-MANUAL',
      customerName,
      customerPhone: customerMobile,
      customerMobile,
      customerAddress,
      franchiseId: currentUser.franchiseId,
      systemCapacity: `${systemCapacityKW} kW`,
      systemCapacityKW,
      panel: panelBrand,
      panelBrand,
      panelQuantity,
      inverter: inverterBrand,
      inverterBrand,
      structure: structureType,
      structureType,
      quotationAmount: totalValue,
      totalQuotationValue: totalValue,
      finalAmount: totalValue,
      advanceReceived,
      receivedAmount: advanceReceived,
      pendingAmount: Math.max(0, totalValue - advanceReceived),
      status: advanceReceived > 0 ? 'Advance Payment' : 'Order Confirmed',
      assignedTeam: assignedLead,
      assignedInstallationLead: assignedLead,
      notes: 'Initiated via Project Management module'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 text-xs text-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-amber-400" /> Commission New Solar Project
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
            <div>
              <label className="block text-slate-300 font-medium mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Customer Mobile</label>
              <input
                type="text"
                value={customerMobile}
                onChange={e => setCustomerMobile(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Project Site Address</label>
            <input
              type="text"
              value={customerAddress}
              onChange={e => setCustomerAddress(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Capacity (kW) *</label>
              <input
                type="number"
                value={systemCapacityKW}
                onChange={e => {
                  const cap = Number(e.target.value);
                  setSystemCapacityKW(cap);
                  setPanelQuantity(Math.ceil((cap * 1000) / 540));
                }}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Panels Qty</label>
              <input
                type="number"
                value={panelQuantity}
                onChange={e => setPanelQuantity(Number(e.target.value))}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Structure</label>
              <select
                value={structureType}
                onChange={e => setStructureType(e.target.value as StructureType)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="Elevated">Elevated</option>
                <option value="Standard">Standard</option>
                <option value="Tin Shed">Tin Shed</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Panel Brand</label>
              <input
                type="text"
                value={panelBrand}
                onChange={e => setPanelBrand(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Inverter Brand</label>
              <input
                type="text"
                value={inverterBrand}
                onChange={e => setInverterBrand(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Contract Total (₹) *</label>
              <input
                type="number"
                value={totalValue}
                onChange={e => setTotalValue(Number(e.target.value))}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Advance Received (₹)</label>
              <input
                type="number"
                value={advanceReceived}
                onChange={e => setAdvanceReceived(Number(e.target.value))}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Assigned Installation Lead</label>
            <input
              type="text"
              value={assignedLead}
              onChange={e => setAssignedLead(e.target.value)}
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
              Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
