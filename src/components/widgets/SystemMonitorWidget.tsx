import React, { useState, useEffect } from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Cpu, HardDrive, Zap, Activity } from 'lucide-react';

interface SystemMonitorProps {
  widget: WidgetItem;
  palette: MonetPalette;
}

export const SystemMonitorWidget: React.FC<SystemMonitorProps> = ({
  widget,
  palette,
}) => {
  const [cpu, setCpu] = useState(28);
  const [ram, setRam] = useState(4.2);
  const [temp, setTemp] = useState(36);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(Math.floor(20 + Math.random() * 25));
      setTemp(Math.floor(34 + Math.random() * 5));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between p-0.5 text-white">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="flex items-center gap-1.5 font-mono font-medium">
          <Activity size={13} style={{ color: palette.accent || '#00ffcc' }} />
          <span>Snapdragon 8 Gen 3</span>
        </span>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          HEALTHY
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 my-auto">
        {/* CPU */}
        <div className="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col items-center justify-center">
          <Cpu size={16} className="text-cyan-400 mb-1" />
          <span className="text-lg font-bold font-mono tracking-tight">{cpu}%</span>
          <span className="text-[10px] text-white/50 uppercase">CPU</span>
        </div>

        {/* RAM */}
        <div className="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col items-center justify-center">
          <Zap size={16} className="text-amber-400 mb-1" />
          <span className="text-lg font-bold font-mono tracking-tight">{ram}G</span>
          <span className="text-[10px] text-white/50 uppercase">RAM (12G)</span>
        </div>

        {/* Temp */}
        <div className="bg-white/5 rounded-xl p-2 border border-white/5 flex flex-col items-center justify-center">
          <HardDrive size={16} className="text-pink-400 mb-1" />
          <span className="text-lg font-bold font-mono tracking-tight">{temp}°C</span>
          <span className="text-[10px] text-white/50 uppercase">SOC TEMP</span>
        </div>
      </div>

      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
        <div className="bg-cyan-400 h-full" style={{ width: `${cpu}%` }} />
        <div className="bg-amber-400 h-full" style={{ width: '35%' }} />
        <div className="bg-emerald-400 h-full" style={{ width: '20%' }} />
      </div>
    </div>
  );
};
