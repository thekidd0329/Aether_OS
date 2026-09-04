import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { TimeOfDay } from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import {
  Smartphone,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Cpu,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';

interface Pixel10ProShellProps {
  children: React.ReactNode;
  isLocked: boolean;
  isEphemeralBriefing: boolean;
  timeOfDay: TimeOfDay;
  isSoundEnabled: boolean;
  isFullscreen: boolean;
  onToggleLock: () => void;
  onToggleBriefing: () => void;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  onOpenSignalsInspector: () => void;
  onOpenGoogleSuite?: () => void;
  onOpenMockGps?: () => void;
  onOpenFirewall?: () => void;
  onOpenPermissions?: () => void;
  onOpenApkModal?: () => void;
  onToggleCyberHud?: () => void;
  isCyberHudActive?: boolean;
}

export const Pixel10ProShell: React.FC<Pixel10ProShellProps> = ({
  children,
  isLocked,
  isEphemeralBriefing,
  timeOfDay,
  isSoundEnabled,
  isFullscreen,
  onToggleLock,
  onToggleBriefing,
  onChangeTimeOfDay,
  onToggleSound,
  onToggleFullscreen,
  onOpenSignalsInspector,
  onOpenGoogleSuite,
  onOpenMockGps,
  onOpenFirewall,
  onOpenPermissions,
  onOpenApkModal,
  onToggleCyberHud,
  isCyberHudActive,
}) => {
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Capacitor.isNativePlatform() || window.innerWidth < 640;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(Capacitor.isNativePlatform() || window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldRenderFullscreen = isFullscreen || isMobileScreen;

  // On real mobile devices or when in fullscreen / native APK mode:
  // Render 100% edge-to-edge with NO artificial bezels, borders, or simulator bars.
  if (shouldRenderFullscreen) {
    return (
      <div className="fixed inset-0 w-full h-full bg-slate-950 overflow-hidden flex flex-col select-none">
        <div className="relative w-full h-full flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
      
      {/* Background Holographic Atmosphere Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-sky-600/10 blur-[130px]" />
        <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.015)_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      {/* Top Interactive Simulation Bar */}
      <div className="relative z-20 w-full max-w-2xl mb-4 px-4 py-2 rounded-2xl bg-slate-900/80 border border-sky-500/30 backdrop-blur-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-sky-200 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Device Brand & Tensor Chip badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sky-400 font-bold tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>Google Pixel 10 Pro</span>
          </div>
          <span className="hidden sm:inline text-sky-500/60">·</span>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-[10px] text-sky-300">
            Tensor G5 Neural Core
          </span>
        </div>

        {/* Action Controls & Fast Launcher Hub */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Google Suite In-OS */}
          {onOpenGoogleSuite && (
            <button
              onClick={() => {
                audioEngine.playOrbitalTick(950);
                onOpenGoogleSuite();
              }}
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-blue-500/20 via-red-500/20 to-amber-500/20 border border-sky-500/40 text-[10px] text-white hover:border-sky-300 flex items-center gap-1 font-bold"
              title="Google Unified Suite (SMS, Calls, Maps, Gmail)"
            >
              <span>G-Suite</span>
            </button>
          )}

          {/* Mark GPS */}
          {onOpenMockGps && (
            <button
              onClick={() => {
                audioEngine.playRadarPing();
                onOpenMockGps();
              }}
              className="px-2 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[10px] text-emerald-300 hover:border-emerald-300 flex items-center gap-1 font-bold"
              title="Mark GPS & GNSS Engine"
            >
              <span>Mark GPS</span>
            </button>
          )}

          {/* Firewall & Syslog */}
          {onOpenFirewall && (
            <button
              onClick={() => {
                audioEngine.playOrbitalTick(850);
                onOpenFirewall();
              }}
              className="px-2 py-1 rounded-xl bg-sky-500/20 border border-sky-500/40 text-[10px] text-sky-300 hover:border-sky-300 flex items-center gap-1 font-bold"
              title="Sentinel Firewall & Traffic Monitor"
            >
              <span>Firewall</span>
            </button>
          )}

          {/* Permissions Audit Broker */}
          {onOpenPermissions && (
            <button
              onClick={() => {
                audioEngine.playOrbitalTick(800);
                onOpenPermissions();
              }}
              className="px-2 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-[10px] text-indigo-300 hover:border-indigo-300 flex items-center gap-1 font-bold"
              title="Permissions Broker (SMS/Calls Containment)"
            >
              <span>Perms</span>
            </button>
          )}

          {/* Pack APK Engine */}
          {onOpenApkModal && (
            <button
              onClick={() => {
                audioEngine.playOrbitalTick(920);
                onOpenApkModal();
              }}
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-[10px] text-emerald-300 hover:border-emerald-300 flex items-center gap-1 font-bold"
              title="AetherOS APK Packaging & Turnkey Setup"
            >
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>Pack APK</span>
            </button>
          )}

          {/* Cyber Developer HUD Toggle */}
          {onToggleCyberHud && (
            <button
              onClick={() => {
                audioEngine.playCyberPulse();
                onToggleCyberHud();
              }}
              className={`px-2 py-1 rounded-xl border text-[10px] flex items-center gap-1 font-bold transition-all ${
                isCyberHudActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  : 'bg-slate-800 border-sky-500/30 text-sky-300 hover:text-white'
              }`}
              title="Futuristic Cyber Developer HUD"
            >
              <Sparkles className="w-3 h-3" />
              <span>Cyber HUD</span>
            </button>
          )}

          {/* Lock / Unlock Toggle */}
          <button
            onClick={onToggleLock}
            className={`p-1.5 rounded-xl border transition-all ${
              isLocked
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                : 'bg-slate-800/80 border-sky-500/30 text-sky-300 hover:border-sky-400'
            }`}
            title={isLocked ? 'Unlock Phone' : 'Lock Phone'}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-xl bg-slate-800/80 border border-sky-500/30 hover:border-sky-400 text-sky-300 transition-colors"
            title={isSoundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Micro-State Signals Inspector */}
          <button
            onClick={onOpenSignalsInspector}
            className="p-1.5 rounded-xl bg-slate-800/80 border border-sky-500/30 hover:border-sky-400 text-sky-300 transition-colors"
            title="Inspect Tensor Micro-State Signals"
          >
            <Cpu className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-800/80 border border-sky-500/30 hover:border-sky-400 text-sky-300 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Realistic Pixel 10 Pro Chassis Frame */}
      <div
        className={`relative z-10 transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-screen max-w-none rounded-none border-none p-0'
            : 'w-full max-w-[412px] h-[860px] max-h-[92vh] rounded-[48px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700/80 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/20'
        }`}
      >
        {/* Chassis Hardware Button Accents on edge */}
        {!isFullscreen && (
          <>
            {/* Power Button on Right */}
            <div
              onClick={onToggleLock}
              className="absolute -right-2 top-28 w-1.5 h-12 rounded-r-md bg-slate-600 hover:bg-sky-400 cursor-pointer transition-colors"
              title="Hardware Power Key"
            />
            {/* Volume Rocker on Right */}
            <div className="absolute -right-2 top-44 w-1.5 h-20 rounded-r-md bg-slate-600" />
            {/* SIM / Antenna band notch on Left */}
            <div className="absolute -left-2 top-36 w-1.5 h-8 rounded-l-md bg-slate-700" />
          </>
        )}

        {/* Screen Bezel & Display Viewport */}
        <div
          className={`relative w-full h-full bg-black overflow-hidden flex flex-col ${
            isFullscreen ? 'rounded-none' : 'rounded-[40px]'
          }`}
        >
          {/* Top Camera Punch Hole & Status Elements */}
          <div className="absolute top-0 left-0 right-0 h-8 z-40 flex items-center justify-between px-6 pointer-events-none">
            {/* Left Status Time */}
            <span className="text-[11px] font-mono font-medium text-sky-200">
              8:30
            </span>

            {/* Center Punch-Hole Camera Sensor */}
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900 ring-1 ring-sky-900/60" />
            </div>

            {/* Right Status Icons */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-sky-300/80">
              <span>5G</span>
              <div className="w-4 h-2 rounded-[2px] border border-sky-400/60 p-[1px] flex items-center">
                <div className="w-2.5 h-full bg-sky-400 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Core Content Viewport */}
          <div className="relative w-full h-full pt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
