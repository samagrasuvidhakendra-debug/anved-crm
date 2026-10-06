import { SolarPanelIcon } from "../common/SolarPanelIcon";
import { AppLogo } from "../common/AppLogo";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuotationStatus } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Download,
  Share2,
  CheckCircle,
  IndianRupee,
  MessageSquare,
  Printer,
  Sparkles,
   
  X,
  Eye
} from 'lucide-react';

interface QuotationSystemViewProps {
  onOpenNewQuotation: () => void;
}

export const QuotationSystemView: React.FC<QuotationSystemViewProps> = ({ onOpenNewQuotation }) => {
  const { quotations, updateQuotationStatus, addProject, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const filteredQuotations = quotations.filter(q =>
    (q.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
    (q.quotationNumber || q.quotationNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (q.panelBrand || q.panel || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleConvertToProject = (quote: Quotation) => {
    updateQuotationStatus(quote.id, 'Accepted');

    addProject({
      projectName: `${quote.customerName} - ${quote.systemCapacityKW || quote.systemCapacity}kW Solar EPC`,
      customerId: quote.customerId || 'CUST-GEN',
      customerName: quote.customerName,
      customerMobile: quote.customerMobile,
      customerAddress: quote.customerAddress,
      franchiseId: quote.franchiseId || currentUser.franchiseId,
      systemCapacityKW: quote.systemCapacityKW,
      panelBrand: quote.panelBrand,
      panelQuantity: quote.panelQuantity,
      inverterBrand: quote.inverterBrand,
      structureType: quote.structureType,
      totalQuotationValue: quote.finalAmount,
      finalAmount: quote.finalAmount,
      receivedAmount: 0,
      pendingAmount: quote.finalAmount,
      status: 'Order Confirmed',
      assignedInstallationLead: 'Field EPC Team',
      quotationNumber: quote.quotationNumber,
      notes: `Converted directly from Quotation ${quote.quotationNumber || quote.quotationNo || quote.id}`
    });

    setBannerMsg(`Success! Quotation ${quote.quotationNumber || quote.id} accepted and converted to an active Solar Project.`);
    setTimeout(() => setBannerMsg(null), 5000);
  };

  return (
    <div id="quotations-view" className="p-4 space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Solar Quotations</h2>
          <p className="text-[11px] text-slate-400">
            Professional branded estimates with Discom net-metering & GST
          </p>
        </div>
        <button
          onClick={onOpenNewQuotation}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
        >
          <Plus className="w-4 h-4" /> New Quote
        </button>
      </div>

      {bannerMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{bannerMsg}</span>
          </div>
          <button onClick={() => setBannerMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by quote number, customer name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Quotations List */}
      <div className="space-y-3">
        {filteredQuotations.map(quote => (
          <div
            key={quote.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {quote.quotationNumber}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{quote.customerName}</h3>
                <p className="text-[11px] text-slate-400">{quote.customerAddress}</p>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  quote.status === 'Accepted'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : quote.status === 'Sent'
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {quote.status}
              </span>
            </div>

            {/* Capacity and Specs */}
            <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-300">
                {quote.systemCapacityKW} kW • {quote.panelBrand}
              </span>
              <span className="font-black text-emerald-400 text-sm">
                ₹{quote.finalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 gap-1 text-xs">
              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/91${quote.customerMobile.replace(/\D/g, '')}?text=Dear%20${encodeURIComponent(quote.customerName)}%2C%20here%20is%20your%20ACS%20SOLAR%20quotation%20${quote.quotationNumber}%20for%20a%20${quote.systemCapacityKW}kW%20system.%20Total%20Value%3A%20%E2%82%B9${quote.finalAmount.toLocaleString('en-IN')}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700"
                  title="Share via WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setPreviewQuote(quote)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-sky-400" /> Preview
                </button>
              </div>

              {quote.status !== 'Accepted' ? (
                <button
                  onClick={() => handleConvertToProject(quote)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" /> Convert to Project
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">✓ Converted</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Professional Branded Quotation Preview Modal */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-xs text-slate-300 space-y-4">
            {/* Quotation Branded Header */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
              <AppLogo
                size="lg"
                showText={true}
                subtitle={`${currentUser.franchiseName || 'ACS Solar Territory'} • Official EPC Proposal`}
              />

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-400">{previewQuote.quotationNumber}</div>
                <div className="text-[10px] text-slate-400">Date: {previewQuote.createdAt}</div>
                <div className="text-[10px] text-amber-400 font-medium">Valid: {previewQuote.validityDays} Days</div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-[11px]">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Client Details</div>
              <div className="text-white font-bold text-xs">{previewQuote.customerName}</div>
              <div className="text-slate-300">{previewQuote.customerMobile}</div>
              <div className="text-slate-400">{previewQuote.customerAddress}</div>
            </div>

            {/* Bill of Materials (BOM) Table */}
            <div>
              <div className="text-slate-400 font-bold uppercase text-[10px] mb-1.5">Scope of Supply & EPC</div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="py-2 px-3">Item Description</th>
                      <th className="py-2 px-3 text-right">Spec / Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-2 px-3 text-white">System Capacity Rating</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-400">{previewQuote.systemCapacityKW} kWp</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-white">Solar PV Modules (Tier-1)</td>
                      <td className="py-2 px-3 text-right text-slate-300">{previewQuote.panelBrand} ({previewQuote.panelQuantity} pcs)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-white">Grid-Tied Solar Inverter</td>
                      <td className="py-2 px-3 text-right text-slate-300">{previewQuote.inverterBrand}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-white">Mounting Structure</td>
                      <td className="py-2 px-3 text-right text-slate-300">{previewQuote.structureType} HDG</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-white">Balance of System (BOS & Cabling)</td>
                      <td className="py-2 px-3 text-right text-slate-300">DC/AC SPD, Copper Earthing</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-white">Turnkey Installation & Net-Meter Liaison</td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-semibold">Included</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cost Breakdown & GST */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base Equipment & EPC Value</span>
                <span>₹{(previewQuote.basePrice || previewQuote.finalAmount * 0.86).toLocaleString('en-IN')}</span>
              </div>
              {previewQuote.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promotional Franchise Discount</span>
                  <span>- ₹{previewQuote.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Composite Solar GST ({previewQuote.gstRate || previewQuote.taxRate || 13.8}%)</span>
                <span>₹{(previewQuote.gstAmount || previewQuote.taxAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-slate-800">
                <span>Final Contract Value</span>
                <span className="text-emerald-400">₹{previewQuote.finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment terms */}
            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-300 block mb-1">Standard Payment Terms:</span>
              <p>Advance with PO: {previewQuote.advancePercentage}% | Material Delivery: {previewQuote.deliveryPercentage}% | Net-Meter Handover: {previewQuote.commissioningPercentage}%</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>

              <button
                onClick={() => setPreviewQuote(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
