import React, { useState } from 'react';
import { Mail, Phone, User, Hash, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export type RightValueType = 'email' | 'mobile' | 'name' | 'pincode' | 'pincodes' | 'code' | 'number' | 'text';

interface RightValueInputProps {
  id: string;
  label: string;
  type: RightValueType;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  hint?: string;
}

export const RightValueInput: React.FC<RightValueInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
  disabled = false,
  autoFocus = false,
  hint
}) => {
  const [touched, setTouched] = useState(false);

  // Validate value based on type
  const getValidationState = (): { isValid: boolean; message: string; badge: string } => {
    if (!value || value.trim() === '') {
      if (required) {
        return {
          isValid: false,
          message: 'This field is required',
          badge: 'Required'
        };
      }
      return {
        isValid: true,
        message: '',
        badge: ''
      };
    }

    if (type === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const hasAt = value.includes('@');
      const hasDomain = value.includes('.') && value.split('.').pop()!.length >= 2;
      
      if (!hasAt) {
        return {
          isValid: false,
          message: 'Missing @ symbol (e.g. name@domain.com)',
          badge: 'Email Only • Needs @'
        };
      }
      if (!hasDomain) {
        return {
          isValid: false,
          message: 'Incomplete domain (e.g. .com, .in)',
          badge: 'Email Only • Incomplete'
        };
      }
      if (!emailRegex.test(value)) {
        return {
          isValid: false,
          message: 'Invalid email address format',
          badge: 'Email Only'
        };
      }
      return {
        isValid: true,
        message: 'Valid email address',
        badge: '✓ Verified Email'
      };
    }

    if (type === 'mobile') {
      if (value.length < 10) {
        return {
          isValid: false,
          message: `Enter 10 digits (${value.length}/10 entered)`,
          badge: `Numbers Only • ${value.length}/10`
        };
      }
      if (!/^[6-9]\d{9}$/.test(value)) {
        return {
          isValid: false,
          message: 'Indian mobile numbers must start with 6, 7, 8, or 9',
          badge: '10-Digit Mobile'
        };
      }
      return {
        isValid: true,
        message: 'Valid 10-digit mobile number',
        badge: '✓ Verified Mobile'
      };
    }

    if (type === 'name') {
      if (value.trim().length < 2) {
        return {
          isValid: false,
          message: 'Name must be at least 2 characters',
          badge: 'Letters Only'
        };
      }
      return {
        isValid: true,
        message: 'Valid name (letters only)',
        badge: '✓ Valid Name'
      };
    }

    if (type === 'pincode') {
      if (value.length < 6) {
        return {
          isValid: false,
          message: `6-digit pincode required (${value.length}/6 entered)`,
          badge: `6 Digits • ${value.length}/6`
        };
      }
      return {
        isValid: true,
        message: 'Valid 6-digit postal code',
        badge: '✓ Valid Pincode'
      };
    }

    if (type === 'pincodes') {
      const pins = value.split(',').map(p => p.trim()).filter(Boolean);
      const invalidPins = pins.filter(p => p.length !== 6 || !/^\d{6}$/.test(p));
      if (invalidPins.length > 0) {
        return {
          isValid: false,
          message: `Each pincode must be 6 digits (invalid: ${invalidPins.join(', ')})`,
          badge: 'Digits & Commas Only'
        };
      }
      return {
        isValid: true,
        message: `${pins.length} valid pincode(s) registered`,
        badge: `✓ ${pins.length} Pincode(s)`
      };
    }

    if (type === 'code') {
      return {
        isValid: true,
        message: 'Franchise ID format',
        badge: 'Code Only'
      };
    }

    return {
      isValid: true,
      message: '',
      badge: ''
    };
  };

  const validation = getValidationState();

  // Strict keystroke sanitizer: prevents entering illegal characters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    let sanitized = rawVal;

    if (type === 'email') {
      // Strictly email characters only: letters, digits, @, ., _, -, +
      // Spaces, quotes, brackets, and invalid symbols are blocked immediately
      sanitized = rawVal.replace(/[^a-zA-Z0-9.@+_-]/g, '').toLowerCase();
    } else if (type === 'mobile') {
      // Strictly digits only, max 10 digits
      sanitized = rawVal.replace(/\D/g, '').slice(0, 10);
    } else if (type === 'name') {
      // Strictly letters, spaces, dots, hyphens
      sanitized = rawVal.replace(/[^a-zA-Z\s.'-]/g, '');
    } else if (type === 'pincode') {
      // Strictly 6 digits
      sanitized = rawVal.replace(/\D/g, '').slice(0, 6);
    } else if (type === 'pincodes') {
      // Strictly digits and commas
      sanitized = rawVal.replace(/[^0-9,\s]/g, '');
    } else if (type === 'code') {
      // Strictly uppercase alphanumeric and hyphen
      sanitized = rawVal.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16);
    } else if (type === 'number') {
      // Strictly numbers and decimal
      sanitized = rawVal.replace(/[^0-9.]/g, '');
    }

    onChange(sanitized);
  };

  // Keyboard protection: blocks invalid keys from being pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Always allow control/navigation keys
    const allowedControlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Home',
      'End',
      'Enter'
    ];

    if (allowedControlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }

    if (type === 'mobile' || type === 'pincode') {
      // Block anything not a digit
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    } else if (type === 'pincodes') {
      // Block anything not a digit or comma or space
      if (!/[\d,\s]/.test(e.key)) {
        e.preventDefault();
      }
    } else if (type === 'name') {
      // Block numbers and symbols
      if (!/^[a-zA-Z\s.'-]$/.test(e.key)) {
        e.preventDefault();
      }
    } else if (type === 'email') {
      // Block spaces and special characters that are never allowed in emails
      if (/\s/.test(e.key) || /[^\w.@+_-]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-amber-400" />;
      case 'mobile':
        return <Phone className="w-3.5 h-3.5 text-amber-400" />;
      case 'name':
        return <User className="w-3.5 h-3.5 text-amber-400" />;
      case 'pincode':
      case 'pincodes':
      case 'code':
        return <Hash className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getTypePlaceholder = () => {
    if (placeholder) return placeholder;
    switch (type) {
      case 'email':
        return 'owner@acs-solar.in (email only)';
      case 'mobile':
        return '10-digit mobile number (digits only)';
      case 'name':
        return 'Full name (letters only)';
      case 'pincode':
        return '6-digit pincode';
      case 'pincodes':
        return '411001, 411002 (comma separated)';
      case 'code':
        return 'ACS-MH-01';
      default:
        return '';
    }
  };

  const isError = touched && !validation.isValid && (required || value.length > 0);
  const isSuccess = touched && validation.isValid && value.length > 0;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label Row with Strict Value Type Badge */}
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={id} className="text-slate-300 font-medium flex items-center gap-1.5">
          {getIcon()}
          <span>{label}</span>
          {required && <span className="text-amber-400 font-bold">*</span>}
        </label>
        {validation.badge && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium transition-colors ${
              isError
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : isSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {validation.badge}
          </span>
        )}
      </div>

      {/* Input container with dynamic validation border */}
      <div className="relative">
        <input
          id={id}
          type={type === 'email' ? 'email' : type === 'mobile' ? 'tel' : 'text'}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTouched(true)}
          required={required}
          placeholder={getTypePlaceholder()}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={type === 'email' ? 'email' : type === 'mobile' ? 'tel' : 'name'}
          className={`w-full p-2.5 bg-slate-950 border rounded-xl text-white text-xs focus:outline-none transition-all ${
            isError
              ? 'border-rose-500/80 focus:border-rose-400 ring-1 ring-rose-500/30'
              : isSuccess
              ? 'border-emerald-500/70 focus:border-emerald-400'
              : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20'
          }`}
        />

        {/* Real-time status indicator on the right */}
        <div className="absolute right-2.5 top-2.5 flex items-center pointer-events-none">
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
        </div>
      </div>

      {/* Error or Hint Message */}
      {isError && (
        <p className="text-[10px] text-rose-400 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{validation.message}</span>
        </p>
      )}
      {!isError && hint && (
        <p className="text-[10px] text-slate-500">{hint}</p>
      )}
    </div>
  );
};
