import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FollowUpType, Lead } from '../../types';
import { Calendar, X, Clock, MessageSquare, Phone } from 'lucide-react';

interface NewFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillLead?: Lead | null;
}

export const NewFollowUpModal: React.FC<NewFollowUpModalProps> = ({
  isOpen,
  onClose,
  prefillLead
}) => {
  const { addFollowUp, leads, currentUser } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:30 AM');
  const [type, setType] = useState<FollowUpType>('Phone Call');
  const [notes, setNotes] = useState('Discuss system capacity and rooftop shadow clearance.');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (prefillLead) {
        setCustomerName(prefillLead.name || prefillLead.customerName || '');
        setCustomerMobile(prefillLead.mobile || '');
      } else if (leads.length > 0) {
        setCustomerName(leads[0].name || leads[0].customerName || '');
        setCustomerMobile(leads[0].mobile || '');
      } else {
        setCustomerName('');
        setCustomerMobile('');
      }
      setFollowUpDate(new Date().toISOString().split('T')[0]);
      setErrorMsg(null);
    }
  }, [isOpen, prefillLead, leads]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerMobile) {
      setErrorMsg('Please select or specify customer details.');
      return;
    }

    addFollowUp({
      franchiseId: prefillLead?.franchiseId || currentUser.franchiseId,
      customerId: prefillLead?.id || 'LEAD-GEN',
      assignedUserId: currentUser.id,
      assignedUserName: currentUser.name,
      purpose: notes,
      leadId: prefillLead?.id,
      customerName,
      customerMobile,
      customerPhone: customerMobile,
      date: followUpDate,
      followUpDate,
      time,
      type,
      notes,
      assignedStaffName: currentUser.name,
      status: 'Upcoming'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-xs text-slate-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" /> Schedule Lead Follow-up
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
            <label className="block text-slate-300 font-medium mb-1">Customer / Lead Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Contact Mobile</label>
            <input
              type="text"
              value={customerMobile}
              onChange={e => setCustomerMobile(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Time Slot</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Action Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as FollowUpType)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
            >
              <option value="Phone Call">Phone Call</option>
              <option value="WhatsApp">WhatsApp Inquiry</option>
              <option value="Site Visit">Site Visit / Meeting</option>
              <option value="Office Meeting">Office Consultation</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Agenda / Follow-up Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
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
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
