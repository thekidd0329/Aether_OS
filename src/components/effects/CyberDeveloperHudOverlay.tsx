import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import {
  Cpu,
  Terminal,
  Activity,
  Zap,
  Radio,
  Sliders,
  Crosshair,
  Maximize2,
  Sparkles,
  Eye,
  ShieldAlert,
  Code,
  Layers,
  X,
} from 'lucide-react';

interface CyberDeveloperHudOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
  onOpenGoogleSuite?: () => void;
  onOpenMockGps?: () => void;
  onOpenFirewall?: () => void;
  onOpenPermissions?: () => void;
  onOpenApkModal?: () => void;
}

export const CyberDeveloperHudOverlay: React.FC<CyberDeveloperHudOverlayProps> = ({
  isVisible,
  onToggle,
  onOpenGoogleSuite,
  onOpenMockGps,
  onOpenFirewall,
  onOpenPermissions,
  onOpenApkModal,
}) => {
  const [fps, setFps] = useState(120);
  const [frameTimeMs, setFrameTimeMs] = useState(3.2);
  const [vramMb, setVramMb] = useState(3420);
  const [tpuOps, setTpuOps] = useState(58.4);
  const [matrixBits, setMatrixBits] = useState<string[]>([]);
  const [hudMode, setHudMode] = useState<'cyber' | 'minimal' | 'radar'>('cyber');

  useEffect(() => {
    // Generate simulated dynamic 64-byte memory entropy
    const bits: string[] = [];
    for (let i = 0; i < 64; i++) {
      bits.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase());
    }
    setMatrixBits(bits);

    const interval = setInterval(() => {
      setFps(Math.floor(118 + Math.random() * 3));
      setFrameTimeMs(+(3.1 + Math.random() * 0.4).toFixed(2));
      setVramMb(Math.floor(3400 + Math.random() * 80));
      setTpuOps(+(57.5 + Math.random() * 2.5).toFixed(1));

      // Random bit flip
      const randIdx = Math.floor(Math.random() * 64);
      setMatrixBits((prev) => {
        const next = [...prev];
        next[randIdx] = Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none overflow-hidden font-mono">
      {/* 1. CYBER SCANLINE & VIGNETTE EFFECT */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:100%_3px] opacity-70" />

      {/* 2. TOP-RIGHT DEVELOPER GPU & NPU TELEMETRY CORNER */}
      <div className="absolute top-12 right-3 pointer-events-auto flex flex-col items-end gap-1.5 z-50">
        <div className="p-2.5 rounded-2xl bg-slate-950/85 border border-sky-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.25)] flex flex-col gap-1 text-[10px]">
          <div className="flex items-center justify-between gap-3 border-b border-sky-500/20 pb-1">
            <span className="text-sky-300 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> VULKAN 1.3 HUD
            </span>
            <span className="text-emerald-400 font-bold">{fps} FPS</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-300 text-[9px]">
            <span>Frame Time:</span>
            <span className="text-right text-sky-400 font-bold">{frameTimeMs} ms</span>
            <span>VRAM In-Use:</span>
            <span className="text-right text-sky-400 font-bold">{vramMb} MB</span>
            <span>Tensor G5 TPU:</span>
            <span className="text-right text-emerald-400 font-bold">{tpuOps} TOPS</span>
          </div>

          {/* Quick HUD switch buttons */}
          <div className="flex items-center gap-1 pt-1 mt-0.5 border-t border-sky-500/15">
            {onOpenGoogleSuite && (
              <button
                onClick={onOpenGoogleSuite}
                className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/40 text-[8px]"
              >
                G-Suite
              </button>
            )}
            {onOpenMockGps && (
              <button
                onClick={onOpenMockGps}
                className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 text-[8px]"
              >
                GPS
              </button>
            )}
            {onOpenFirewall && (
              <button
                onClick={onOpenFirewall}
                className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 text-[8px]"
              >
                Firewall
              </button>
            )}
            {onOpenApkModal && (
              <button
                onClick={onOpenApkModal}
                className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 text-[8px] font-bold"
                title="Pack APK"
              >
                APK
              </button>
            )}
            <button
              onClick={onToggle}
              className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white text-[8px]"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM-LEFT 64-BYTE LOCAL ENTROPY BIT STREAM */}
      <div className="absolute bottom-20 left-3 pointer-events-auto flex flex-col gap-1 z-40">
        <div className="p-2 rounded-2xl bg-slate-950/85 border border-sky-500/30 backdrop-blur-xl shadow-[0_0_15px_rgba(56,189,248,0.2)] max-w-[210px]">
          <div className="flex items-center justify-between text-[9px] text-sky-300 border-b border-sky-500/20 pb-0.5 mb-1">
            <span className="font-bold flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5 text-sky-400" /> 64-Byte Cache
            </span>
            <span className="text-[8px] text-emerald-400">Zero-Token Enclave</span>
          </div>
          <div className="grid grid-cols-8 gap-0.5 text-[7px] text-sky-400/80 leading-none">
            {matrixBits.map((hex, i) => (
              <span
                key={i}
                className={`p-0.5 rounded text-center transition-colors ${
                  i % 7 === 0 ? 'text-emerald-300 font-bold bg-emerald-950/60' : 'bg-slate-900/60'
                }`}
              >
                {hex}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. HOLOGRAPHIC RETICLES & CORNER BRACKETS */}
      <div className="absolute top-8 left-3 w-4 h-4 border-t-2 border-l-2 border-sky-400/60" />
      <div className="absolute top-8 right-3 w-4 h-4 border-t-2 border-r-2 border-sky-400/60" />
      <div className="absolute bottom-8 left-3 w-4 h-4 border-b-2 border-l-2 border-sky-400/60" />
      <div className="absolute bottom-8 right-3 w-4 h-4 border-b-2 border-r-2 border-sky-400/60" />
    </div>
  );
};
