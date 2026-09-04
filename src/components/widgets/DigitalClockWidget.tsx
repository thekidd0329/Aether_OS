import React, { useState, useEffect } from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { AlarmClock, BatteryMedium, Sparkles } from 'lucide-react';

interface DigitalClockProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onOpenClock?: () => void;
}

export const DigitalClockWidget: React.FC<DigitalClockProps> = ({
  widget,
  palette,
  onOpenClock,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.toLocaleTimeString([], { hour: '2-digit', hour12: false });
  const minutes = time.toLocaleTimeString([], { minute: '2-digit' });
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onOpenClock}
      className="w-full h-full flex flex-col justify-between cursor-pointer p-1"
    >
      <div className="flex items-center justify-between text-xs text-white/70 font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} style={{ color: palette.primary }} />
          <span>Local Device Time</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded-full">
          <AlarmClock size={11} className="text-amber-400" />
          <span>7:00 AM</span>
        </span>
      </div>

      <div className="flex items-baseline gap-1 my-auto">
        <span
          className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono"
          style={{ color: palette.primary }}
        >
          {hours}:{minutes}
        </span>
        <span className="text-sm font-mono text-white/50">{seconds}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-white/75 pt-1 border-t border-white/10">
        <span className="font-medium">{dateStr}</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <BatteryMedium size={14} />
          <span>88%</span>
        </span>
      </div>
    </div>
  );
};
