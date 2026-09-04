import React from 'react';
import { MicroStateContext } from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import { Fingerprint, Lock, ShieldAlert, Sparkles, MapPin, Battery } from 'lucide-react';

interface LockscreenViewProps {
  context: MicroStateContext;
  onUnlock: () => void;
}

export const LockscreenView: React.FC<LockscreenViewProps> = ({
  context,
  onUnlock,
}) => {
  const handleBiometricTap = () => {
    audioEngine.playUnlock();
    onUnlock();
  };

  return (
    <div
      onClick={handleBiometricTap}
      className="relative w-full h-full flex flex-col justify-between items-center p-6 select-none cursor-pointer bg-gradient-to-b from-black via-slate-950 to-slate-950 text-slate-100 overflow-hidden"
    >
      {/* Background Holographic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-sky-500/10 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Top Status */}
      <div className="relative z-10 flex flex-col items-center gap-2 pt-8">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-[11px] font-mono text-sky-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Tensor Protected Key · Aether OS</span>
        </div>

        {/* Big Holographic Time */}
        <h1 className="text-6xl font-extralight tracking-tighter text-white drop-shadow-[0_0_25px_rgba(56,189,248,0.4)] mt-4">
          8:30
        </h1>
        <span className="text-sm font-light text-sky-300/80 tracking-wide">
          Tuesday, September 1
        </span>
      </div>

      {/* Center Holographic Orbital Pulse */}
      <div className="relative z-10 flex flex-col items-center gap-3 my-auto">
        <div className="relative w-28 h-28 rounded-full border border-sky-500/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
          <div className="w-20 h-20 rounded-full border border-dashed border-sky-400/40 animate-[spin_10s_linear_infinite_reverse]" />
          <div className="absolute w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <Sparkles className="w-5 h-5 text-sky-300 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-mono text-sky-300 font-semibold tracking-wider uppercase">
            3 Priority Vectors Queued
          </span>
          <span className="text-[11px] text-sky-400/60 font-mono">
            {context.location}
          </span>
        </div>
      </div>

      {/* Bottom Biometric Fingerprint Scanner */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBiometricTap();
          }}
          className="group w-16 h-16 rounded-3xl bg-sky-950/80 hover:bg-sky-900/80 border border-sky-400/50 hover:border-sky-300 flex items-center justify-center text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.35)] active:scale-95 transition-all"
        >
          <Fingerprint className="w-8 h-8 group-hover:scale-110 group-hover:text-sky-200 transition-all" />
        </button>

        <span className="text-xs font-mono text-sky-400/80 animate-pulse">
          Touch fingerprint sensor to unlock Concierge
        </span>
      </div>
    </div>
  );
};
