import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  textClassName?: string;
  variant?: 'emblem' | 'full';
}

const sizeMap = {
  xs: { icon: 'w-4 h-4', text: 'text-xs', sub: 'text-[9px]' },
  sm: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[10px]' },
  md: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[11px]' },
  lg: { icon: 'w-10 h-10', text: 'text-lg', sub: 'text-xs' },
  xl: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
  '2xl': { icon: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = false,
  subtitle,
  className = '',
  textClassName = '',
}) => {
  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Vector SVG Mark */}
      <div className={`relative shrink-0 flex items-center justify-center ${currentSize.icon}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm transition-transform duration-200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sun Glow */}
            <radialGradient id="appLogoSun" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="75%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>

            {/* Sun Ray Gradient */}
            <linearGradient id="appLogoRay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.3" />
            </linearGradient>

            {/* Silicon Photovoltaic Panel Face Gradient */}
            <linearGradient id="appLogoPanel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="25%" stopColor="#0284C7" />
              <stop offset="70%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Eco Leaf & Renewable Arc Gradient */}
            <linearGradient id="appLogoLeaf" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="35%" stopColor="#059669" />
              <stop offset="75%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* Glass Glint Sheen */}
            <linearGradient id="appLogoGlint" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Radiating Sun Flares */}
          <g>
            <path d="M100 18 L100 32" stroke="url(#appLogoRay)" strokeWidth="5" strokeLinecap="round" />
            <path d="M136 28 L126 38" stroke="url(#appLogoRay)" strokeWidth="5" strokeLinecap="round" />
            <path d="M158 56 L144 62" stroke="url(#appLogoRay)" strokeWidth="5" strokeLinecap="round" />
            <path d="M64 28 L74 38" stroke="url(#appLogoRay)" strokeWidth="5" strokeLinecap="round" />
            <path d="M42 56 L56 62" stroke="url(#appLogoRay)" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Golden Rising Sun Disc */}
          <circle cx="100" cy="74" r="36" fill="url(#appLogoSun)" />

          {/* Solar Panel Array Grid with Perspective */}
          <g>
            {/* Panel Base Foundation */}
            <polygon points="46,140 154,140 142,88 58,88" fill="#020617" stroke="#1E293B" strokeWidth="2" />
            
            {/* Photovoltaic Active Silicon Face */}
            <polygon points="48,138 152,138 140,90 60,90" fill="url(#appLogoPanel)" />
            
            {/* High-Tech Grid Cell Subdivision Lines */}
            <line x1="56" y1="106" x2="144" y2="106" stroke="#BAE6FD" strokeWidth="1.6" strokeOpacity="0.85" />
            <line x1="52" y1="122" x2="148" y2="122" stroke="#BAE6FD" strokeWidth="1.6" strokeOpacity="0.85" />
            <line x1="80" y1="90" x2="74" y2="138" stroke="#BAE6FD" strokeWidth="1.6" strokeOpacity="0.8" />
            <line x1="100" y1="90" x2="100" y2="138" stroke="#BAE6FD" strokeWidth="1.8" strokeOpacity="0.9" />
            <line x1="120" y1="90" x2="126" y2="138" stroke="#BAE6FD" strokeWidth="1.6" strokeOpacity="0.8" />

            {/* Glass Surface Reflection Glint */}
            <polygon points="50,136 105,91 140,91 80,136" fill="url(#appLogoGlint)" />
          </g>

          {/* Sweeping Emerald Leaf Eco Arc */}
          <g>
            <path
              d="M26,142 C30,95 72,60 120,62 C108,82 92,106 72,126 C54,144 38,148 26,142 Z"
              fill="url(#appLogoLeaf)"
            />
            <path
              d="M38,154 C58,168 112,176 156,146 C168,137 176,124 180,110 C168,126 148,140 126,146 C88,157 54,152 38,154 Z"
              fill="url(#appLogoLeaf)"
            />
            {/* Elegant Leaf Vein */}
            <path
              d="M34,144 C56,118 84,94 112,74"
              stroke="#A7F3D0"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
          </g>

          {/* Clean Tech Power Spark */}
          <circle cx="160" cy="144" r="3.5" fill="#FDE047" />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className={`min-w-0 ${textClassName}`}>
          <div className={`font-black tracking-tight flex items-center gap-1.5 ${currentSize.text}`}>
            <span className="text-white dark:text-white [data-theme=light]:text-slate-900">ACS</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 font-extrabold">
              SOLAR
            </span>
          </div>
          {subtitle && (
            <p className={`font-semibold tracking-wide text-emerald-400/90 truncate ${currentSize.sub}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
