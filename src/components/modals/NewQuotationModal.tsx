import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, StructureType } from '../../types';
import { FileText, X } from 'lucide-react';
import { IndianStateDistrictSelect } from '../common/IndianStateDistrictSelect';

interface NewQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillLead?: any;
}

export const NewQuotationModal: React.FC<NewQuotationModalProps> = ({
  isOpen,
  onClose,
  prefillLead
}) => {
  const { addQuotation, currentUser, quotationDefaults } = useApp();

  const [activeTab, setActiveTab] = useState('quotation_details');

  const [systemType, setSystemType] = useState(quotationDefaults?.systemTypes?.[0] || 'On-Grid');
  const [specifications, setSpecifications] = useState(quotationDefaults?.specifications || []);
  const [clientScope, setClientScope] = useState(quotationDefaults?.clientScope || []);
  const [terms, setTerms] = useState(quotationDefaults?.terms || []);

  // Form Fields State
  const [clientName, setClientName] = useState('');
  const [billAddress, setBillAddress] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativeNo, setRepresentativeNo] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [remarks, setRemarks] = useState('');

  const [meterNo, setMeterNo] = useState('');
  const [meterUnits, setMeterUnits] = useState('');
  const [unitKw, setUnitKw] = useState<any>('');
  const [rate, setRate] = useState('');
  const [selectStructure, setSelectStructure] = useState('Mono');
  const [selectRoof, setSelectRoof] = useState('G+1');

  const [structureRoofRate, setStructureRoofRate] = useState('0.00');
  const [structureRoofAmount, setStructureRoofAmount] = useState('0');
  const [selectPanelType, setSelectPanelType] = useState('Polycrystalline');
  const [panelTypeRate, setPanelTypeRate] = useState('0.00');
  const [markupAmount, setMarkupAmount] = useState('0');
  const [finalAmount, setFinalAmount] = useState('0');

  const [totalAmount, setTotalAmount] = useState('0');
  const [amount70, setAmount70] = useState('0');
  const [gst5, setGst5] = useState('0');
  const [amount30, setAmount30] = useState('0');
  const [gst18, setGst18] = useState('0');
  const [projectAmount, setProjectAmount] = useState('0');

  const [annualCapacity, setAnnualCapacity] = useState('');
  const [status, setStatus] = useState('--Select--');
  const [avgPowerGeneration, setAvgPowerGeneration] = useState('');
  const [savingPerUnit, setSavingPerUnit] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (prefillLead) {
        setClientName(prefillLead.name || prefillLead.customerName || '');
        setBillAddress(prefillLead.address || '');
        setState(prefillLead.state || 'Maharashtra');
        setCity(prefillLead.city || 'Pune');
        setUnitKw(prefillLead.expectedCapacityKW || 5);
        setRepresentativeName(prefillLead.assignedStaffName || currentUser?.name || '');
        setRepresentativeNo(currentUser?.mobile || '+91 98221 00000');
      } else {
        setRepresentativeName(currentUser?.name || '');
        setRepresentativeNo(currentUser?.mobile || '+91 98221 00000');
        if (!state) setState('Maharashtra');
        if (!city) setCity('Pune');
      }
      setErrorMsg(null);
    }
  }, [isOpen, prefillLead, currentUser]);

  if (!isOpen) return null;

  const handleSpecChange = (index: number, field: 'part' | 'make' | 'spec', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpec = () => {
    setSpecifications([...specifications, { part: '', make: '', spec: '' }]);
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const handleArrayChange = (field: 'clientScope' | 'terms', index: number, value: string) => {
    if (field === 'clientScope') {
      const newArr = [...clientScope];
      newArr[index] = value;
      setClientScope(newArr);
    } else {
      const newArr = [...terms];
      newArr[index] = value;
      setTerms(newArr);
    }
  };

  const addArrayItem = (field: 'clientScope' | 'terms') => {
    if (field === 'clientScope') setClientScope([...clientScope, '']);
    else setTerms([...terms, '']);
  };

  const removeArrayItem = (field: 'clientScope' | 'terms', index: number) => {
    if (field === 'clientScope') {
      const newArr = [...clientScope];
      newArr.splice(index, 1);
      setClientScope(newArr);
    } else {
      const newArr = [...terms];
      newArr.splice(index, 1);
      setTerms(newArr);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg('Please enter Client Name.');
      return;
    }

    addQuotation({
      franchiseId: currentUser.franchiseId,
      systemType,
      specifications,
      clientScope,
      terms,
      customerName: clientName,
      clientName,
      billAddress,
      customerMobile: representativeNo || 'N/A',
      customerAddress: billAddress || 'N/A',
      representativeName,
      representativeNo,
      state,
      city,
      remarks,
      meterNo,
      meterUnits,
      unitKw,
      rate,
      selectStructure,
      selectRoof,
      structureRoofRate,
      structureRoofAmount,
      selectPanelType,
      panelTypeRate,
      markupAmount,
      finalAmount: Number(finalAmount) || 0,
      totalAmount,
      amount70,
      gst5,
      amount30,
      gst18,
      projectAmount,
      annualCapacity,
      status,
      avgPowerGeneration,
      savingPerUnit,
      discount: 0,
      validityDays: 15,
      date: new Date().toISOString().split('T')[0],
      notes: remarks
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col text-sm text-slate-300">
        
        {/* Tabs */}
        <div className="flex items-center border-b border-slate-800 overflow-x-auto shrink-0 bg-slate-900/50 pt-2 px-2">
          {['QUOTATION DETAILS', 'SPECIFICATION', 'CLIENT SCOPE', 'TERMS & CONDITIONS'].map((tabLabel, idx) => {
            const tabId = tabLabel.toLowerCase().replace(/ /g, '_').replace('&_', '');
            const isActive = activeTab === tabId;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={`px-4 py-3 font-semibold text-xs whitespace-nowrap transition-all ${
                  isActive 
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <form id="quotation-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {activeTab === 'quotation_details' ? (
            <div className="space-y-5">
              
              {/* Row 0 - System Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">System Type</label>
                  <select
                    value={systemType}
                    onChange={e => setSystemType(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    {quotationDefaults?.systemTypes?.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Bill Address</label>
                  <input
                    type="text"
                    value={billAddress}
                    onChange={e => setBillAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Representative Name</label>
                  <input
                    type="text"
                    value={representativeName}
                    onChange={e => setRepresentativeName(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Representative No</label>
                  <input
                    type="text"
                    value={representativeNo}
                    onChange={e => setRepresentativeNo(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* State and District / City Selection */}
              <IndianStateDistrictSelect
                idPrefix="quote-geo"
                selectedState={state}
                selectedDistrict={city}
                onStateChange={val => setState(val)}
                onDistrictChange={val => setCity(val)}
                stateLabel="State / UT"
                districtLabel="District / City"
              />

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Upload Bill</label>
                  <div className="flex border border-slate-700 rounded-xl overflow-hidden bg-slate-900">
                    <button type="button" className="px-3 py-2.5 bg-slate-800 border-r border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors">
                      Choose file
                    </button>
                    <span className="p-2.5 text-xs text-slate-500 truncate flex-1">No...sen</span>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Remarks</label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Meter No</label>
                  <input
                    type="text"
                    value={meterNo}
                    onChange={e => setMeterNo(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Meter Units</label>
                  <input
                    type="text"
                    value={meterUnits}
                    onChange={e => setMeterUnits(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Unit (KW)</label>
                  <input
                    type="text"
                    value={unitKw}
                    onChange={e => setUnitKw(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Rate</label>
                  <input
                    type="text"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Select Structure</label>
                  <select
                    value={selectStructure}
                    onChange={e => setSelectStructure(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-300 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="Mono ...">Mono ...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Select Roof</label>
                  <select
                    value={selectRoof}
                    onChange={e => setSelectRoof(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-300 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="G+1">G+1</option>
                  </select>
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Structure Roof Rate</label>
                  <input
                    type="text"
                    value={structureRoofRate}
                    onChange={e => setStructureRoofRate(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Structure Roof Amount</label>
                  <input
                    type="text"
                    value={structureRoofAmount}
                    onChange={e => setStructureRoofAmount(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Select Panel Type</label>
                  <select
                    value={selectPanelType}
                    onChange={e => setSelectPanelType(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-300 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value=""></option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Panel Type Rate</label>
                  <input
                    type="text"
                    value={panelTypeRate}
                    onChange={e => setPanelTypeRate(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Markup Amount</label>
                  <input
                    type="text"
                    value={markupAmount}
                    onChange={e => setMarkupAmount(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Final Amount</label>
                  <input
                    type="text"
                    value={finalAmount}
                    onChange={e => setFinalAmount(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Total Amount</label>
                  <input
                    type="text"
                    value={totalAmount}
                    onChange={e => setTotalAmount(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Amount (70%)</label>
                  <input
                    type="text"
                    value={amount70}
                    onChange={e => setAmount70(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">GST (5%)</label>
                  <input
                    type="text"
                    value={gst5}
                    onChange={e => setGst5(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Amount (30%)</label>
                  <input
                    type="text"
                    value={amount30}
                    onChange={e => setAmount30(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">GST (18%)</label>
                  <input
                    type="text"
                    value={gst18}
                    onChange={e => setGst18(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Project Amount</label>
                  <input
                    type="text"
                    value={projectAmount}
                    onChange={e => setProjectAmount(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Annual Capacity</label>
                  <input
                    type="text"
                    value={annualCapacity}
                    onChange={e => setAnnualCapacity(e.target.value)}
                    className="w-full p-2.5 border border-amber-500/30 rounded-xl bg-amber-500/5 text-amber-100 font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-300 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="--Select--">--Sele...</option>
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Avg Power Generation Per Kwp</label>
                  <input
                    type="text"
                    value={avgPowerGeneration}
                    onChange={e => setAvgPowerGeneration(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Saving Per Unit In Electricity Consumption</label>
                  <input
                    type="text"
                    value={savingPerUnit}
                    onChange={e => setSavingPerUnit(e.target.value)}
                    className="w-full p-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

            </div>
          ) : activeTab === 'specification' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center text-xs font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">
                <div>Parts / Material</div>
                <div>Make</div>
                <div>Specification</div>
                <div className="w-16"></div>
              </div>
              {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start">
                  <input
                    type="text"
                    value={spec.part}
                    onChange={e => handleSpecChange(index, 'part', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={spec.make}
                    onChange={e => handleSpecChange(index, 'make', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={spec.spec}
                    onChange={e => handleSpecChange(index, 'spec', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <div className="flex items-center gap-1 w-16">
                    <button type="button" onClick={() => removeSpec(index)} className="w-7 h-7 flex items-center justify-center bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20">
                      -
                    </button>
                    {index === specifications.length - 1 && (
                      <button type="button" onClick={addSpec} className="w-7 h-7 flex items-center justify-center bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20">
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {specifications.length === 0 && (
                <button type="button" onClick={addSpec} className="text-xs text-amber-400 p-2 bg-amber-500/10 rounded-lg font-bold">
                  + Add Specification
                </button>
              )}
            </div>
          ) : activeTab === 'client_scope' ? (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">
                Particulars
              </div>
              {clientScope.map((scope, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={scope}
                    onChange={e => handleArrayChange('clientScope', index, e.target.value)}
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => removeArrayItem('clientScope', index)} className="w-7 h-7 flex items-center justify-center bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20">
                      -
                    </button>
                    {index === clientScope.length - 1 && (
                      <button type="button" onClick={() => addArrayItem('clientScope')} className="w-7 h-7 flex items-center justify-center bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20">
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {clientScope.length === 0 && (
                <button type="button" onClick={() => addArrayItem('clientScope')} className="text-xs text-amber-400 p-2 bg-amber-500/10 rounded-lg font-bold">
                  + Add Scope
                </button>
              )}
            </div>
          ) : activeTab === 'terms_&_conditions' ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">
                  Terms & Conditions
                </div>
                {terms.map((term, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={term}
                      onChange={e => handleArrayChange('terms', index, e.target.value)}
                      className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-400 focus:outline-none transition-colors"
                    />
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => removeArrayItem('terms', index)} className="w-7 h-7 flex items-center justify-center bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20">
                        -
                      </button>
                      {index === terms.length - 1 && (
                        <button type="button" onClick={() => addArrayItem('terms')} className="w-7 h-7 flex items-center justify-center bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20">
                          +
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {terms.length === 0 && (
                  <button type="button" onClick={() => addArrayItem('terms')} className="text-xs text-amber-400 p-2 bg-amber-500/10 rounded-lg font-bold">
                    + Add Term
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">
                  Bank Details
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <input type="radio" checked readOnly className="w-4 h-4 text-amber-500" />
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl">
                    <p className="font-bold text-white mb-1">ACS SOLAR INDIA PRIVATE LIMITED</p>
                    <p className="text-xs text-slate-400">Account: 1234567890</p>
                    <p className="text-xs text-slate-400">IFSC: HDFC0001234</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 flex items-center justify-center text-slate-400">
              <p>Settings for {activeTab.replace('_', ' ').toUpperCase()} will appear here.</p>
            </div>
          )}
        </form>

        {/* Modal Footer / Actions */}
        <div className="flex items-center justify-center gap-3 p-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="submit"
            form="quotation-form"
            className="px-6 py-2.5 rounded-xl shadow-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wide transition-all"
          >
            SUBMIT
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl shadow bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wide transition-all"
          >
            BACK TO LIST
          </button>
        </div>

      </div>
    </div>
  );
};

