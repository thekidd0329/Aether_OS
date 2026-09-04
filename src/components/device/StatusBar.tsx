import React, { useState, useEffect } from 'react';
import { LauncherConfig, MonetPalette } from '../../types';
import { Wifi, Signal, Battery, BatteryCharging, Bell, Moon, VolumeX, ShieldAlert } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface StatusBarProps {
  config: LauncherConfig;
  palette: MonetPalette;
  onOpenQuickSettings: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  config,
  palette,
  onOpenQuickSettings,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!config.showStatusBar) return null;

  return (
    <div
      onClick={() => {
        audioEngine.playClick(700, 'sine', 0.02);
        onOpenQuickSettings();
      }}
      className="w-full h-7 px-5 flex items-center justify-between text-[11px] font-semibold tracking-tight text-white select-none z-30 cursor-pointer hover:bg-white/5 transition-colors"
    >
      {/* Left side: Clock & Notification icons */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-white/95">{timeStr}</span>
        <div className="flex items-center gap-1 text-white/60">
          <Bell size={11} className="text-indigo-400" />
        </div>
      </div>

      {/* Center Dynamic Island / Pill Style if active */}
      {config.statusBarStyle === 'dynamic_island' && (
        <div className="h-4 px-3 rounded-full bg-black/80 border border-white/20 flex items-center gap-1.5 shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-white/80">NovaX Active</span>
        </div>
      )}

      {/* Right side: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-1.5 text-white/85">
        <span className="text-[9px] font-mono font-bold tracking-widest text-white/70">
          {config.networkType}
        </span>
        <Signal size={12} className="text-white/85" />
        <Wifi size={12} className="text-white/85" />
        <div className="flex items-center gap-1">
          {config.showBatteryPercentage && (
            <span className="text-[10px] font-mono text-white/75">88%</span>
          )}
          <Battery size={14} className="text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
