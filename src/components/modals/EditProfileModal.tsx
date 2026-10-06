import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Camera,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building,
  ShieldCheck,
  KeyRound,
  Lock
} from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Curated executive solar business avatar presets
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [alternateMobile, setAlternateMobile] = useState(currentUser?.alternateMobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || PRESET_AVATARS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload with instant data URL preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfilePhoto(reader.result);
        setErrorMsg(null);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customPhotoUrl.trim()) return;
    setProfilePhoto(customPhotoUrl.trim());
    setCustomPhotoUrl('');
    setShowUrlInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate Name
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Validate Mobile
    const cleanMobile = mobile.replace(/[^\d+]/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate Email
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid corporate email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      updateUserProfile(currentUser.id, {
        name: name.trim(),
        mobile: cleanMobile,
        alternateMobile: alternateMobile.trim(),
        email: email.trim(),
        address: address.trim(),
        bio: bio.trim(),
        profilePhoto
      });

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="edit-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="edit-profile-modal-card"
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                Modify Owner Profile
              </h2>
              <p className="text-[11px] text-slate-400">
                Update your personal identity, contact details, and photo
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-edit-profile-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Notification Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 text-xs font-semibold animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Profile Photo Customization */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Profile Photo & Avatar</span>
              </label>
              <span className="text-[10px] text-slate-400">Tap avatar or upload</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              {/* Main Avatar Preview */}
              <div className="relative group shrink-0">
                <img
                  src={profilePhoto}
                  alt={name || 'Profile Preview'}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-xl ring-2 ring-amber-400/20"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold gap-1"
                  title="Click to replace photo"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Change</span>
                </button>
              </div>

              {/* Upload Controls & Presets */}
              <div className="flex-1 min-w-0 space-y-2.5 w-full">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="profile-photo-file-input"
                  />
                  <button
                    type="button"
                    id="upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Device Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Web URL
                  </button>
                </div>

                {/* Optional Custom URL Input */}
                {showUrlInput && (
                  <div className="flex items-center gap-2 animate-in fade-in">
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={customPhotoUrl}
                      onChange={e => setCustomPhotoUrl(e.target.value)}
                      className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="py-2 px-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Preset Avatars Row */}
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block mb-1.5">
                    Or select a business executive preset:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfilePhoto(url)}
                        className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          profilePhoto === url
                            ? 'border-amber-400 scale-105 shadow-md'
                            : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Contact Information */}
          <div className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Name</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                id="edit-profile-name-input"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rajesh Patil"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Mobile Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Number</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  id="edit-profile-mobile-input"
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="e.g. +91 98210 12345"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Alternate / WhatsApp</span>
                </label>
                <input
                  id="edit-profile-alt-mobile-input"
                  type="tel"
                  value={alternateMobile}
                  onChange={e => setAlternateMobile(e.target.value)}
                  placeholder="e.g. +91 98210 99887"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Email Address</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                id="edit-profile-email-input"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. rajesh.patil@acssolar.in"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Branch / Office Address */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Office / Branch Address</span>
              </label>
              <input
                id="edit-profile-address-input"
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. Shop 12, Solar Plaza, MG Road, Pune"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Bio / Professional Designation */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Bio / Designation Tagline</span>
              </label>
              <textarea
                id="edit-profile-bio-input"
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="e.g. ACS Solar Authorized Partner & Certified Rooftop EPC Lead"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Section 3: Assigned Area & DISCOM Territory Configuration */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">
                    Assigned Franchise & Area
                  </span>
                  <span className="font-bold text-white text-xs">
                    {currentUser?.franchiseName || 'ACS Solar Central Hub'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold uppercase">
                  {currentUser?.role.replace('_', ' ')}
                </span>
                <span className="text-[9px] text-slate-500 block font-mono mt-0.5">
                  ID: {currentUser?.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block font-medium">Jurisdiction Area / Zone</span>
                <span className="text-slate-200 font-semibold truncate block mt-0.5">
                  {currentUser?.areaName || 'Designated Regional Territory'}
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono block mt-0.5">
                  {currentUser?.city ? `${currentUser.city}, ` : ''}{currentUser?.state || 'All India'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 block font-medium">Designated Electricity DISCOMs</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentUser?.assignedDiscoms && currentUser.assignedDiscoms.length > 0 ? (
                    currentUser.assignedDiscoms.map(d => (
                      <span
                        key={d}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                      >
                        {d}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">State DISCOMs Assigned</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>
                Covered Pincodes:{' '}
                <strong className="text-slate-300 font-mono">
                  {currentUser?.assignedPincodes && currentUser.assignedPincodes.length > 0
                    ? currentUser.assignedPincodes.join(', ')
                    : 'All Franchise Pincodes'}
                </strong>
              </span>
              <span className="text-[9px] text-slate-500 italic">
                (Configured by Super Admin)
              </span>
            </div>
          </div>

          {/* Account Security & Password Management */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">Account Security & Password</span>
                <span className="text-[10px] text-slate-400">Update your account login password</span>
              </div>
            </div>
            <button
              type="button"
              id="edit-profile-open-change-password-btn"
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="cancel-edit-profile-btn"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="save-edit-profile-btn"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};
