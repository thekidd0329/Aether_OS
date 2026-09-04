import React from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Sun, CloudRain, Wind, Droplets, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onOpenWeather?: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  widget,
  palette,
  onOpenWeather,
}) => {
  return (
    <div
      onClick={onOpenWeather}
      className="w-full h-full flex flex-col justify-between cursor-pointer p-0.5"
    >
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="flex items-center gap-1 font-medium">
          <MapPin size={12} style={{ color: palette.primary }} />
          <span>San Francisco</span>
        </span>
        <span className="text-[11px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">
          Clear
        </span>
      </div>

      <div className="flex items-center justify-between my-auto">
        <div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            72°<span className="text-sm font-normal text-white/60">F</span>
          </div>
          <div className="text-[11px] text-white/60 font-medium">
            H: 76° • L: 58°
          </div>
        </div>
        <div className="relative">
          <Sun size={36} className="text-amber-400 animate-spin-slow drop-shadow-md" />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-white/65 pt-1.5 border-t border-white/10">
        <span className="flex items-center gap-1">
          <Droplets size={11} className="text-sky-400" />
          <span>48%</span>
        </span>
        <span className="flex items-center gap-1">
          <Wind size={11} className="text-emerald-400" />
          <span>8 mph</span>
        </span>
      </div>
    </div>
  );
};
