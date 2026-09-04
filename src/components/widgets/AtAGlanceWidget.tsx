import React, { useState, useEffect } from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { CloudSun, Calendar, Sparkles } from 'lucide-react';

interface AtAGlanceProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onOpenWeather?: () => void;
  onOpenCalendar?: () => void;
}

export const AtAGlanceWidget: React.FC<AtAGlanceProps> = ({
  widget,
  palette,
  onOpenWeather,
  onOpenCalendar,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex items-center justify-between gap-2 px-1 text-white">
      {/* Date & Event */}
      <div
        onClick={onOpenCalendar}
        className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium tracking-wide">
          <Calendar size={13} className="text-white/80" />
          <span>{dateStr}</span>
        </div>
        <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5 mt-0.5">
          <Sparkles size={13} style={{ color: palette.primary }} />
          <span>Focus Time • 2:30 PM</span>
        </div>
      </div>

      {/* Weather chip */}
      <div
        onClick={onOpenWeather}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer transition-all border border-white/10 shadow-sm"
      >
        <CloudSun size={18} className="text-amber-300 animate-pulse" />
        <span className="text-sm font-semibold">72°F</span>
      </div>
    </div>
  );
};
