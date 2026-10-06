import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyType } from '../../types';
import { Contact, X } from 'lucide-react';
import { IndianStateDistrictSelect } from '../common/IndianStateDistrictSelect';
import { RightValueInput } from '../common/RightValueInput';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer, currentUser } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411038');
  const [propertyType, setPropertyType] = useState<PropertyType>('Residential');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter Full Name (letters only).');
      return;
    }
    if (!mobile.trim() || mobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile number (numbers only).');
      return;
    }
    if (alternateMobile.trim() && alternateMobile.length !== 10) {
      setErrorMsg('Alternate Mobile must be a valid 10-digit number.');
      return;
    }
    if (email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Please enter a valid Email address.');
        return;
      }
    }
    if (!state.trim()) {
      setErrorMsg('Please select State / UT.');
      return;
    }

    addCustomer({
      name,
      franchiseId: currentUser?.franchiseId || '',
      phone: mobile,
      mobile,
      alternatePhone: alternateMobile,
      alternateMobile,
      email,
      address,
      city,
      state,
      pincode,
      propertyType,
      customerStatus: 'Active Customer'
    });

    setName('');
    setMobile('');
    setAlternateMobile('');
    setEmail('');
    setAddress('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-5 text-xs text-slate-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Contact className="w-5 h-5 text-teal-400" /> Add Solar Client
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
              id="customer-name-input"
              label="Full Name"
              type="name"
              required
              placeholder="e.g. Ramesh Patel"
              value={name}
              onChange={val => setName(val)}
              hint="Letters only"
            />
            <RightValueInput
              id="customer-mobile-input"
              label="Mobile Number"
              type="mobile"
              required
              placeholder="9876543210"
              value={mobile}
              onChange={val => setMobile(val)}
              hint="10-digit mobile number only"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <RightValueInput
              id="customer-alt-mobile-input"
              label="Alt Mobile"
              type="mobile"
              placeholder="Optional (10 digits)"
              value={alternateMobile}
              onChange={val => setAlternateMobile(val)}
            />
            <RightValueInput
              id="customer-email-input"
              label="Email"
              type="email"
              placeholder="client@domain.com"
              value={email}
              onChange={val => setEmail(val)}
              hint="Valid email format only"
            />
          </div>

          <div>
            <label htmlFor="customer-address-input" className="block text-slate-300 font-medium mb-1">
              Address
            </label>
            <input
              id="customer-address-input"
              type="text"
              placeholder="Street / Flat / House number"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <IndianStateDistrictSelect
            idPrefix="customer-geo"
            selectedState={state}
            selectedDistrict={city}
            onStateChange={val => setState(val)}
            onDistrictChange={val => setCity(val)}
            stateLabel="State / UT"
            districtLabel="District / City"
            stateRequired
          />

          <RightValueInput
            id="customer-pincode-input"
            label="Pincode"
            type="pincode"
            placeholder="e.g. 411038"
            value={pincode}
            onChange={val => setPincode(val)}
            hint="6-digit PIN code only"
          />

          <div>
            <label className="block text-slate-300 font-medium mb-1">Property Type</label>
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value as PropertyType)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
            </select>
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
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow"
            >
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
