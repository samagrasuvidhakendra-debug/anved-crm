import React from 'react';

export const SolarPanelIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Sun Corona Arc */}
    <circle cx="12" cy="7" r="3" fill="#F59E0B" stroke="#FBBF24" strokeWidth="1.2" />
    <path d="M12 1v2M18 3l-1.5 1.5M6 3l1.5 1.5" stroke="#F59E0B" strokeWidth="1.5" />
    {/* Solar Photovoltaic Grid Panel */}
    <path d="M3 21h18l-2.5-9H5.5l-2.5 9Z" stroke="#0284C7" fill="#0284C7" fillOpacity="0.25" strokeWidth="1.6" />
    <path d="M4.5 16.5h15" stroke="#38BDF8" strokeWidth="1.2" />
    <path d="M12 12v9" stroke="#38BDF8" strokeWidth="1.4" />
    <path d="M8.5 12l-1 9" stroke="#38BDF8" strokeWidth="1.2" />
    <path d="M15.5 12l1 9" stroke="#38BDF8" strokeWidth="1.2" />
    {/* Eco Leaf Arc Accent */}
    <path d="M2 20c2-5 7-7 11-6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
