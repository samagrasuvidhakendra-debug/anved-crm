import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, PaymentStage, Project } from '../../types';
import { CreditCard, X, IndianRupee } from 'lucide-react';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillProject?: Project | null;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  prefillProject
}) => {
  const { addPayment, projects, currentUser } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [amount, setAmount] = useState(50000);
  const [stage, setStage] = useState<PaymentStage>('Advance');
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>('UPI');
  const [transactionReference, setTransactionReference] = useState(`UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (prefillProject) {
        setSelectedProjectId(prefillProject.id);
        setAmount(prefillProject.pendingAmount > 0 ? Math.min(50000, prefillProject.pendingAmount) : 50000);
      } else if (projects.length > 0) {
        setSelectedProjectId(projects[0].id);
        setAmount(projects[0].pendingAmount > 0 ? Math.min(50000, projects[0].pendingAmount) : 50000);
      }
      setTransactionReference(`UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setErrorMsg(null);
    }
  }, [isOpen, prefillProject, projects]);

  const selectedProj = projects.find(p => p.id === selectedProjectId) || projects[0];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj || amount <= 0) {
      setErrorMsg('Please select a valid project and enter a positive payment amount.');
      return;
    }

    addPayment({
      projectId: selectedProj.id,
      customerName: selectedProj.customerName,
      franchiseId: selectedProj.franchiseId || currentUser.franchiseId,
      stage,
      amount: Number(amount),
      paymentMode,
      transactionReference,
      paymentDate,
      receivedByName: currentUser.name,
      status: 'Paid'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-xs text-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" /> Record Milestone Payment
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
          <div>
            <label className="block text-slate-300 font-medium mb-1">Target Project *</label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-semibold"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.customerName} - {p.projectName || p.projectId || 'Solar EPC'} (Pending: ₹{p.pendingAmount.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Milestone Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as PaymentStage)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Advance">Advance (PO)</option>
                <option value="Installation">Installation Milestone</option>
                <option value="Commissioning">Commissioning & Net Meter</option>
                <option value="Final">Final Balance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Payment Channel</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as PaymentMethod)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="UPI">UPI (Google Pay / PhonePe)</option>
                <option value="Bank Transfer">NEFT / RTGS</option>
                <option value="Cheque">Cheque Deposit</option>
                <option value="Cash">Cash Receipt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Amount Collected (₹) *</label>
            <input
              type="number"
              required
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-black text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">UTR / Ref Number</label>
              <input
                type="text"
                value={transactionReference}
                onChange={e => setTransactionReference(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow"
            >
              Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
