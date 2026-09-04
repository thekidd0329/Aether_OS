import React, { useState, useEffect } from 'react';
import { WidgetItem, MonetPalette } from '../../types';

interface AnalogClockProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onOpenClock?: () => void;
}

export const AnalogClockWidget: React.FC<AnalogClockProps> = ({
  widget,
  palette,
  onOpenClock,
}) => {
  const [time, setTime] = useState(new Date());
  const face = widget.settings.clockFace || 'material_flower';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div
      onClick={onOpenClock}
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer relative"
    >
      <div
        className={`relative flex items-center justify-center transition-all ${
          face === 'material_flower'
            ? 'w-24 h-24 rounded-[36%_64%_64%_36%/36%_36%_64%_64%]'
            : face === 'bauhaus'
            ? 'w-24 h-24 rounded-full'
            : 'w-24 h-24 rounded-full'
        }`}
        style={{
          backgroundColor: face === 'material_flower' ? palette.primaryContainer : 'rgba(255, 255, 255, 0.08)',
          border: `2px solid ${palette.primary}55`,
          boxShadow: `0 6px 20px ${palette.primary}22`,
        }}
      >
        {/* Hour markers */}
        <div className="absolute inset-2 flex flex-col justify-between items-center opacity-40 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
        <div className="absolute inset-2 flex justify-between items-center opacity-40 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>

        {/* Center pin */}
        <div
          className="absolute z-20 w-3 h-3 rounded-full shadow-md"
          style={{ backgroundColor: palette.primary }}
        />

        {/* Hour hand */}
        <div
          className="absolute origin-bottom rounded-full z-10 transition-transform duration-200"
          style={{
            bottom: '50%',
            left: 'calc(50% - 2.5px)',
            width: '5px',
            height: '24px',
            backgroundColor: palette.onPrimary || '#ffffff',
            transform: `rotate(${hourDeg}deg)`,
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute origin-bottom rounded-full z-10 transition-transform duration-200"
          style={{
            bottom: '50%',
            left: 'calc(50% - 1.5px)',
            width: '3px',
            height: '34px',
            backgroundColor: palette.primary || '#6366f1',
            transform: `rotate(${minDeg}deg)`,
          }}
        />

        {/* Second hand */}
        <div
          className="absolute origin-bottom rounded-full z-10"
          style={{
            bottom: '50%',
            left: 'calc(50% - 0.75px)',
            width: '1.5px',
            height: '38px',
            backgroundColor: '#ef4444',
            transform: `rotate(${secDeg}deg)`,
          }}
        />
      </div>

      <div className="mt-2 text-center">
        <span className="text-[11px] font-medium tracking-wide text-white/70">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};
