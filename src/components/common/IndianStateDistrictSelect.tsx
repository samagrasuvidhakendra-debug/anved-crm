import React, { useState, useMemo } from 'react';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../../data/indiaGeoData';
import { MapPin, Building2, ChevronDown, Edit3, Search, Check, X, CheckCircle2 } from 'lucide-react';

interface IndianStateDistrictSelectProps {
  selectedState: string;
  selectedDistrict: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  stateLabel?: string;
  districtLabel?: string;
  stateRequired?: boolean;
  districtRequired?: boolean;
  idPrefix?: string;
  className?: string;
  layout?: 'grid-2' | 'stacked';
  districtPlaceholder?: string;
}

// Major solar states for instant 1-click selection
const TOP_SOLAR_STATES = [
  'Maharashtra',
  'Gujarat',
  'Rajasthan',
  'Karnataka',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Delhi',
  'Tamil Nadu',
  'Telangana',
  'Haryana'
];

export const IndianStateDistrictSelect: React.FC<IndianStateDistrictSelectProps> = ({
  selectedState,
  selectedDistrict,
  onStateChange,
  onDistrictChange,
  stateLabel = 'State / UT',
  districtLabel = 'District / City',
  stateRequired = false,
  districtRequired = false,
  idPrefix = 'geo',
  className = '',
  layout = 'grid-2',
  districtPlaceholder = 'Select District'
}) => {
  // Modal dialog or inline picker state
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [customDistrictMode, setCustomDistrictMode] = useState(false);

  // Official districts for the currently selected state
  const districts = useMemo(() => {
    if (!selectedState) return [];
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  // Filtered states by search query
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return ALL_INDIAN_STATES;
    const q = stateSearch.toLowerCase().trim();
    return ALL_INDIAN_STATES.filter(st => st.toLowerCase().includes(q));
  }, [stateSearch]);

  // Filtered districts by search query
  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return districts;
    const q = districtSearch.toLowerCase().trim();
    return districts.filter(d => d.toLowerCase().includes(q));
  }, [districts, districtSearch]);

  const handleSelectState = (stateName: string) => {
    onStateChange(stateName);
    setShowStatePicker(false);
    setStateSearch('');

    // Check if current district exists in the new state
    const newDistricts = getDistrictsForState(stateName);
    if (!newDistricts.includes(selectedDistrict)) {
      onDistrictChange('');
      setCustomDistrictMode(false);
    }
  };

  const handleSelectDistrict = (districtName: string) => {
    onDistrictChange(districtName);
    setShowDistrictPicker(false);
    setDistrictSearch('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className={layout === 'grid-2' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
        {/* ================= 1. STATE / UT SELECTOR ================= */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor={`${idPrefix}-state-select`}
              className="block text-slate-300 font-medium text-xs flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{stateLabel}</span>
              {stateRequired && <span className="text-amber-400 font-bold">*</span>}
            </label>
            <button
              type="button"
              onClick={() => setShowStatePicker(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-0.5"
            >
              <Search className="w-3 h-3" />
              <span>Browse All ({ALL_INDIAN_STATES.length})</span>
            </button>
          </div>

          {/* Native HTML Select (Always works 100% reliably in all environments) */}
          <div className="relative">
            <select
              id={`${idPrefix}-state-select`}
              value={selectedState}
              onChange={e => handleSelectState(e.target.value)}
              required={stateRequired}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="" className="bg-slate-900 text-slate-400">
                -- Select Indian State / UT --
              </option>
              <optgroup label="Popular Solar States" className="bg-slate-900 text-amber-300 font-semibold">
                {TOP_SOLAR_STATES.map(state => (
                  <option key={`pop-${state}`} value={state} className="bg-slate-900 text-white font-medium">
                    {state}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All 28 States & 8 Union Territories" className="bg-slate-900 text-slate-300">
                {ALL_INDIAN_STATES.map(state => (
                  <option key={`all-${state}`} value={state} className="bg-slate-900 text-white">
                    {state}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Quick Click Chips for Popular States */}
          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
            <span className="text-[10px] text-slate-400 mr-0.5">Quick:</span>
            {TOP_SOLAR_STATES.slice(0, 5).map(pst => (
              <button
                key={pst}
                type="button"
                onClick={() => handleSelectState(pst)}
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  selectedState === pst
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-amber-300'
                }`}
              >
                {pst}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowStatePicker(true)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800 hover:border-amber-400"
            >
              + More
            </button>
          </div>
        </div>

        {/* ================= 2. DISTRICT / CITY SELECTOR ================= */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor={`${idPrefix}-district-select`}
              className="block text-slate-300 font-medium text-xs flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{districtLabel}</span>
              {districtRequired && <span className="text-amber-400 font-bold">*</span>}
            </label>
            {selectedState && districts.length > 0 && (
              <button
                type="button"
                onClick={() => setCustomDistrictMode(!customDistrictMode)}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 underline font-medium"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>{customDistrictMode ? 'Official List' : 'Type Other City'}</span>
              </button>
            )}
          </div>

          {customDistrictMode || districts.length === 0 ? (
            /* Custom Text Input for other towns / talukas */
            <div className="relative">
              <input
                id={`${idPrefix}-district-input`}
                type="text"
                placeholder={
                  selectedState
                    ? `Enter city / taluka in ${selectedState}`
                    : 'Enter city or district'
                }
                value={selectedDistrict}
                onChange={e => onDistrictChange(e.target.value)}
                required={districtRequired}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          ) : (
            /* Native HTML Select for Districts */
            <div className="relative">
              <select
                id={`${idPrefix}-district-select`}
                value={selectedDistrict}
                onChange={e => handleSelectDistrict(e.target.value)}
                required={districtRequired}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="" className="bg-slate-900 text-slate-400">
                  {selectedState ? `-- Select District in ${selectedState} (${districts.length}) --` : `-- First Select State --`}
                </option>
                {districts.map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedState && districts.length > 0 && !customDistrictMode && (
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>{districts.length} official districts available</span>
              <button
                type="button"
                onClick={() => setShowDistrictPicker(true)}
                className="text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <Search className="w-2.5 h-2.5" />
                <span>Search District</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected location confirmation pill */}
      {selectedState && (
        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              Selected: <strong className="text-white">{selectedState}</strong>
              {selectedDistrict ? (
                <> &bull; <strong className="text-amber-400">{selectedDistrict}</strong></>
              ) : (
                <span className="text-slate-500"> (District pending)</span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onStateChange('');
              onDistrictChange('');
            }}
            className="text-[10px] text-slate-400 hover:text-rose-400 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* ================= STATE SEARCH PICKER MODAL ================= */}
      {showStatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Select Indian State or Union Territory
              </h4>
              <button
                type="button"
                onClick={() => setShowStatePicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Type state name (e.g. Maharashtra, Gujarat, Delhi)..."
                value={stateSearch}
                onChange={e => setStateSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
              />
              {stateSearch && (
                <button
                  type="button"
                  onClick={() => setStateSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Popular Quick-Select Section */}
            {!stateSearch && (
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Top Solar Hubs (1-Click Selection):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {TOP_SOLAR_STATES.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSelectState(st)}
                      className={`p-2 rounded-lg text-left text-xs font-medium border transition-colors flex items-center justify-between ${
                        selectedState === st
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{st}</span>
                      {selectedState === st && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Full Scrollable List */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950 divide-y divide-slate-800/60 max-h-64">
              {filteredStates.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No states found matching "{stateSearch}"
                </div>
              ) : (
                filteredStates.map(st => {
                  const isSelected = selectedState === st;
                  const count = getDistrictsForState(st).length;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSelectState(st)}
                      className={`w-full p-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{st}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-normal">
                          {count} districts
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStatePicker(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DISTRICT SEARCH PICKER MODAL ================= */}
      {showDistrictPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Select District in {selectedState} ({districts.length} available)
              </h4>
              <button
                type="button"
                onClick={() => setShowDistrictPicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder={`Search district in ${selectedState}...`}
                value={districtSearch}
                onChange={e => setDistrictSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
              />
              {districtSearch && (
                <button
                  type="button"
                  onClick={() => setDistrictSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Full Scrollable Districts List */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950 divide-y divide-slate-800/60 max-h-72">
              {filteredDistricts.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No districts found matching "{districtSearch}"
                </div>
              ) : (
                filteredDistricts.map(d => {
                  const isSelected = selectedDistrict === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSelectDistrict(d)}
                      className={`w-full p-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{d}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setCustomDistrictMode(true);
                  setShowDistrictPicker(false);
                }}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Not in list? Type custom town or taluka</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDistrictPicker(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
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
