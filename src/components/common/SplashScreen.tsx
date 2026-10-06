import React from 'react';
import { Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  return (
    <div
      id="acs-splash-screen"
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 text-white cursor-pointer select-none transition-all"
    >
      {/* Solar & Eco glow ambient lighting */}
      <div className="absolute w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Animated Brand Logo Emblem */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center p-3">
              <AppLogo size="xl" showText={false} />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-emerald-400/40">
            <Zap className="w-3 h-3 fill-current text-amber-300" /> SOLAR OS
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            ACS <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-300">SOLAR</span>
          </h1>
        </div>

        <p className="text-emerald-200/90 font-medium text-base mb-8 tracking-wide">
          Powering Businesses. Empowering Solar.
        </p>

        <div className="flex items-center gap-4 py-2 px-4 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 text-xs text-slate-300 mb-8 shadow-sm">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Tenant Cloud
          </span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span className="text-amber-400 font-bold">v2.6 Enterprise</span>
        </div>

        <button
          id="splash-enter-btn"
          onClick={onDismiss}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Enter ACS Solar Platform</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>

        <p className="text-slate-400 text-xs mt-4">
          Tap anywhere to start
        </p>
      </div>
    </div>
  );
};
