import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentMethod, PaymentStage } from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  IndianRupee,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  X,
  Building
} from 'lucide-react';

interface PaymentManagementViewProps {
  onOpenAddPaymentModal: () => void;
}

export const PaymentManagementView: React.FC<PaymentManagementViewProps> = ({ onOpenAddPaymentModal }) => {
  const { payments, projects, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const totalProjectValue = projects.reduce((sum, p) => sum + p.finalAmount, 0);
  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = projects.reduce((sum, p) => sum + p.pendingAmount, 0);

  const filteredPayments = payments.filter(p =>
    (p.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.receiptNumber || p.receiptNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.transactionReference || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="payments-view" className="p-4 space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Payment Collections</h2>
          <p className="text-[11px] text-slate-400">
            Track milestone payments, UPI/NEFT receipts & accounts reconciliation
          </p>
        </div>
        <button
          onClick={onOpenAddPaymentModal}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
        >
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* 3 Mandated Financial Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Contract Book
          </span>
          <div className="text-sm font-black text-white mt-0.5">
            ₹{(totalProjectValue / 100000).toFixed(2)}L
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">
            Collected
          </span>
          <div className="text-sm font-black text-emerald-400 mt-0.5">
            ₹{(totalReceived / 100000).toFixed(2)}L
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">
            Outstanding
          </span>
          <div className="text-sm font-black text-rose-400 mt-0.5">
            ₹{(totalPending / 100000).toFixed(2)}L
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search receipt number, customer, UTR..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Payments History List */}
      <div className="space-y-3">
        {filteredPayments.map(payment => (
          <div
            key={payment.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    {payment.receiptNumber || payment.receiptNo}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                    {payment.stage}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5">{payment.customerName}</h3>
                <p className="text-[11px] text-slate-400">UTR / Ref: {payment.transactionReference}</p>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-emerald-400 block">
                  + ₹{payment.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">{payment.paymentDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 text-[11px]">
                Mode: <strong className="text-slate-200">{payment.paymentMode}</strong> • Handled by: {payment.receivedByName}
              </span>

              <button
                onClick={() => setReceiptPayment(payment)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1"
              >
                <FileCheck className="w-3 h-3 text-emerald-400" /> Receipt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Official Payment Receipt Modal */}
      {receiptPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 text-xs text-slate-300 space-y-4">
            {/* Receipt Header */}
            <div className="text-center pb-3 border-b border-slate-800 space-y-1">
              <div className="text-base font-black text-white">ACS OFFICIAL RECEIPT</div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase">{receiptPayment.receiptNumber || receiptPayment.receiptNo}</p>
              <p className="text-[10px] text-slate-400">{currentUser.franchiseName || 'ACS Solar Territory'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Amount Received</span>
              <div className="text-2xl font-black text-emerald-400">
                ₹{receiptPayment.amount.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500">Status: Verified & Accounted</span>
            </div>

            <div className="space-y-2 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Received From:</span>
                <strong className="text-white">{receiptPayment.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Project / Stage:</span>
                <strong className="text-slate-200">{receiptPayment.stage} Payment</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <strong className="text-slate-200">{receiptPayment.paymentMode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UTR / Ref Number:</span>
                <strong className="text-slate-200 font-mono">{receiptPayment.transactionReference}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Date:</span>
                <strong className="text-slate-200">{receiptPayment.paymentDate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authorized Receiver:</span>
                <strong className="text-slate-200">{receiptPayment.receivedByName}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>

              <button
                onClick={() => setReceiptPayment(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
