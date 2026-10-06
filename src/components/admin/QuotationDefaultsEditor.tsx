import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Save } from 'lucide-react';

export const QuotationDefaultsEditor: React.FC = () => {
  const { quotationDefaults, updateQuotationDefaults } = useApp();
  const [localDefaults, setLocalDefaults] = useState(quotationDefaults);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateQuotationDefaults(localDefaults);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSpecChange = (index: number, field: 'part' | 'make' | 'spec', value: string) => {
    const newSpecs = [...localDefaults.specifications];
    newSpecs[index][field] = value;
    setLocalDefaults(prev => ({ ...prev, specifications: newSpecs }));
  };

  const addSpec = () => {
    setLocalDefaults(prev => ({
      ...prev,
      specifications: [...prev.specifications, { part: '', make: '', spec: '' }]
    }));
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...localDefaults.specifications];
    newSpecs.splice(index, 1);
    setLocalDefaults(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleArrayChange = (field: 'clientScope' | 'terms' | 'systemTypes', index: number, value: string) => {
    const newArr = [...localDefaults[field]];
    newArr[index] = value;
    setLocalDefaults(prev => ({ ...prev, [field]: newArr }));
  };

  const addArrayItem = (field: 'clientScope' | 'terms' | 'systemTypes') => {
    setLocalDefaults(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'clientScope' | 'terms' | 'systemTypes', index: number) => {
    const newArr = [...localDefaults[field]];
    newArr.splice(index, 1);
    setLocalDefaults(prev => ({ ...prev, [field]: newArr }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 mt-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          Quotation Maker Templates
        </h2>
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            Templates saved successfully!
          </span>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-400">System Types</h3>
          <button type="button" onClick={() => addArrayItem('systemTypes')} className="p-1.5 bg-amber-500/10 text-amber-400 rounded hover:bg-amber-500/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {localDefaults.systemTypes.map((type, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={type}
                onChange={e => handleArrayChange('systemTypes', index, e.target.value)}
                className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <button type="button" onClick={() => removeArrayItem('systemTypes', index)} className="p-2 text-rose-400 bg-rose-500/10 rounded hover:bg-rose-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-400">Default Specifications</h3>
          <button type="button" onClick={addSpec} className="p-1.5 bg-amber-500/10 text-amber-400 rounded hover:bg-amber-500/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {localDefaults.specifications.map((spec, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Part/Material"
                value={spec.part}
                onChange={e => handleSpecChange(index, 'part', e.target.value)}
                className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Make"
                value={spec.make}
                onChange={e => handleSpecChange(index, 'make', e.target.value)}
                className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Specification"
                value={spec.spec}
                onChange={e => handleSpecChange(index, 'spec', e.target.value)}
                className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <button type="button" onClick={() => removeSpec(index)} className="p-2 text-rose-400 bg-rose-500/10 rounded hover:bg-rose-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-400">Default Client Scope</h3>
          <button type="button" onClick={() => addArrayItem('clientScope')} className="p-1.5 bg-amber-500/10 text-amber-400 rounded hover:bg-amber-500/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {localDefaults.clientScope.map((scope, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={scope}
                onChange={e => handleArrayChange('clientScope', index, e.target.value)}
                className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <button type="button" onClick={() => removeArrayItem('clientScope', index)} className="p-2 text-rose-400 bg-rose-500/10 rounded hover:bg-rose-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-400">Default Terms & Conditions</h3>
          <button type="button" onClick={() => addArrayItem('terms')} className="p-1.5 bg-amber-500/10 text-amber-400 rounded hover:bg-amber-500/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {localDefaults.terms.map((term, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={term}
                onChange={e => handleArrayChange('terms', index, e.target.value)}
                className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <button type="button" onClick={() => removeArrayItem('terms', index)} className="p-2 text-rose-400 bg-rose-500/10 rounded hover:bg-rose-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow"
        >
          <Save className="w-4 h-4" /> Save Templates
        </button>
      </div>
    </div>
  );
};
