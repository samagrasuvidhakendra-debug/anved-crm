import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerStatus } from '../../types';
import {
  Contact,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FolderGit2,
  FileText,
  CreditCard,
  ChevronRight,
  X,
  Sun,
  Camera,
  Compass,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface CustomerManagementViewProps {
  onOpenAddCustomer: () => void;
  onOpenPMSuryaGhar?: () => void;
}

export const CustomerManagementView: React.FC<CustomerManagementViewProps> = ({
  onOpenAddCustomer,
  onOpenPMSuryaGhar
}) => {
  const { customers, projects, quotations, payments, pmSuryaGharRecords } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.mobile || c.phone || '').includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="customers-view" className="p-4 space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Customer 360° Directory</h2>
          <p className="text-[11px] text-slate-400">
            {customers.length} Verified solar rooftop owners • {pmSuryaGharRecords?.length || 0} PM Surya Ghar
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {onOpenPMSuryaGhar && (
            <button
              id="customer-pmsg-upload-btn"
              type="button"
              onClick={onOpenPMSuryaGhar}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-all"
              title="Upload PM Surya Ghar Customer Details"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>+ PM Surya Ghar</span>
            </button>
          )}
          <button
            onClick={onOpenAddCustomer}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search customers by name, mobile, city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Customer Cards List */}
      <div className="space-y-3">
        {filteredCustomers.map(customer => {
          const custProjects = projects.filter(p => p.customerId === customer.id || p.customerName === customer.name);
          const custQuotations = quotations.filter(q => q.customerId === customer.id || q.customerName === customer.name);
          const custPayments = payments.filter(p => p.customerName === customer.name);
          const pmsgRecord = customer.pmSuryaGharData || pmSuryaGharRecords.find(
            r => r.customerId === customer.id || (r.mobile && (r.mobile === customer.mobile || r.mobile === customer.phone))
          );

          return (
            <div
              key={customer.id}
              className={`p-4 rounded-2xl bg-slate-900 border transition-all space-y-2.5 shadow-sm ${
                pmsgRecord || customer.isPMSuryaGhar
                  ? 'border-amber-500/40 hover:border-amber-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400">{customer.id}</span>
                    {(pmsgRecord || customer.isPMSuryaGhar) && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                        <Sun className="w-2.5 h-2.5 text-amber-400" />
                        <span>PM Surya Ghar</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{customer.name}</h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{customer.city}, {customer.state}</span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {customer.customerStatus}
                </span>
              </div>

              {/* Micro stats */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block">Quotations</span>
                  <span className="font-bold text-white">{custQuotations.length}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Projects</span>
                  <span className="font-bold text-sky-400">{custProjects.length}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Receipts</span>
                  <span className="font-bold text-emerald-400">{custPayments.length}</span>
                </div>
              </div>

              {pmsgRecord && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-[11px]">
                  <div className="text-amber-200">
                    <span className="font-bold">CA No:</span> {pmsgRecord.consumerNumber} • {pmsgRecord.proposedCapacityKW}kW
                  </div>
                  <div className="font-bold text-emerald-400">
                    Subsidy: ₹{pmsgRecord.estimatedSubsidyAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <a
                  href={`tel:${customer.mobile}`}
                  className="text-emerald-400 text-xs font-semibold flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> {customer.mobile}
                </a>

                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  360° Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer 360 View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 text-xs text-slate-300 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                    {selectedCustomer.id}
                  </span>
                  {(selectedCustomer.isPMSuryaGhar || selectedCustomer.pmSuryaGharData) && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                      <Sun className="w-2.5 h-2.5 text-amber-400" />
                      <span>PM Surya Ghar Verified</span>
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-white">{selectedCustomer.name}</h3>
                <p className="text-[11px] text-slate-400">{selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact cards */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>Mobile: <strong className="text-white">{selectedCustomer.mobile}</strong></div>
              <div>Alt Mobile: <strong className="text-white">{selectedCustomer.alternateMobile || 'None'}</strong></div>
              <div>Email: <strong className="text-white">{selectedCustomer.email || 'None'}</strong></div>
              <div>Property: <strong className="text-white">{selectedCustomer.propertyType}</strong></div>
            </div>

            {/* PM SURYA GHAR VERIFIED DOSSIER */}
            {(() => {
              const pmsg = selectedCustomer.pmSuryaGharData || pmSuryaGharRecords.find(
                r => r.customerId === selectedCustomer.id || (r.mobile && (r.mobile === selectedCustomer.mobile || r.mobile === selectedCustomer.phone))
              );

              if (!pmsg) return null;

              return (
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-slate-950 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/30">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>PM Surya Ghar Application Dossier</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ₹{pmsg.estimatedSubsidyAmount.toLocaleString('en-IN')} DBT Subsidy
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">CA Account Number:</span>
                      <strong className="text-white font-mono">{pmsg.consumerNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">DISCOM / Board:</span>
                      <strong className="text-white truncate block">{pmsg.discomName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Proposed Capacity:</span>
                      <strong className="text-white">{pmsg.proposedCapacityKW} kW Solar Plant</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Portal App Number:</span>
                      <strong className="text-amber-300 font-mono">{pmsg.nationalPortalAppNumber}</strong>
                    </div>
                  </div>

                  {/* Uploaded Documents Grid */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Uploaded Mandatory Documents:
                    </span>

                    {/* Electricity Bill & Site Photo */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 text-[10px] flex items-center gap-1">
                            <FileText className="w-3 h-3 text-amber-400" /> Bill
                          </span>
                          <a href={pmsg.electricityBillUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline text-[10px]">
                            View
                          </a>
                        </div>
                        <img src={pmsg.electricityBillUrl} alt="Electricity Bill" className="w-full h-16 object-cover rounded-lg border border-slate-700 bg-slate-950" />
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 text-[10px] flex items-center gap-1">
                            <Camera className="w-3 h-3 text-sky-400" /> Site Photo
                          </span>
                          <span className="text-slate-400 text-[10px]">{pmsg.roofType}</span>
                        </div>
                        <img src={pmsg.sitePhotoUrl} alt="Site Rooftop" className="w-full h-16 object-cover rounded-lg border border-slate-700 bg-slate-950" />
                      </div>
                    </div>

                    {/* Aadhaar Card Both Sides */}
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 text-[10px] flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-teal-400" /> Aadhaar Card (Both Sides)
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{pmsg.aadhaarNumber}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] text-slate-400 block mb-0.5">Front Side</span>
                          <img src={pmsg.aadhaarFrontUrl} alt="Aadhaar Front" className="w-full h-16 object-cover rounded-lg border border-slate-700 bg-slate-950" />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block mb-0.5">Back Side</span>
                          <img src={pmsg.aadhaarBackUrl} alt="Aadhaar Back" className="w-full h-16 object-cover rounded-lg border border-slate-700 bg-slate-950" />
                        </div>
                      </div>
                    </div>

                    {/* Video of Site from South Direction */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[10px] flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-amber-400" /> Site Video from South Direction (180° S)
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                          Verified {pmsg.videoDuration || '00:30'}
                        </span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-700 bg-black">
                        <video src={pmsg.siteVideoSouthUrl} controls className="w-full max-h-36 object-contain" />
                      </div>
                    </div>

                    {/* Geotagged Location */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-teal-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-teal-300 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" /> Geotag Coordinates
                        </div>
                        <span className="font-mono text-slate-300 text-[10px] block">
                          {pmsg.geotag.latitude}°, {pmsg.geotag.longitude}° (Accuracy: ±{pmsg.geotag.accuracy}m)
                        </span>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${pmsg.geotag.latitude},${pmsg.geotag.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-[10px] flex items-center gap-1 border border-teal-500/40"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Maps</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Associated Projects */}
            <div>
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">
                Associated Solar Projects ({projects.filter(p => p.customerName === selectedCustomer.name).length})
              </h4>
              <div className="space-y-1.5">
                {projects.filter(p => p.customerName === selectedCustomer.name).map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{p.projectName}</div>
                      <div className="text-[10px] text-slate-400">{p.systemCapacityKW}kW • {p.status}</div>
                    </div>
                    <div className="text-right font-bold text-amber-400">
                      ₹{p.finalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Payments */}
            <div>
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">
                Payment History ({payments.filter(p => p.customerName === selectedCustomer.name).length})
              </h4>
              <div className="space-y-1.5">
                {payments.filter(p => p.customerName === selectedCustomer.name).map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-emerald-400">{p.receiptNumber}</div>
                      <div className="text-[10px] text-slate-400">{p.stage} ({p.paymentMode})</div>
                    </div>
                    <div className="text-right font-bold text-white">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
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
