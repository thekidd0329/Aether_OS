import React, { useState } from 'react';
import { MonetPalette } from '../../types';
import { Sun, CloudRain, Cloud, Wind, Droplets, MapPin, Eye, Compass } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface WeatherAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

const CITIES = [
  { name: 'San Francisco', temp: 72, condition: 'Sunny', high: 76, low: 58, humidity: 48, wind: 8 },
  { name: 'Tokyo', temp: 64, condition: 'Rainy', high: 68, low: 55, humidity: 82, wind: 12 },
  { name: 'New York', temp: 58, condition: 'Cloudy', high: 62, low: 49, humidity: 60, wind: 15 },
  { name: 'London', temp: 52, condition: 'Drizzle', high: 56, low: 46, humidity: 88, wind: 10 },
  { name: 'Paris', temp: 61, condition: 'Clear', high: 66, low: 51, humidity: 55, wind: 6 },
];

export const WeatherApp: React.FC<WeatherAppProps> = ({ palette, onClose }) => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  const hourly = [
    { time: 'Now', temp: selectedCity.temp, icon: Sun },
    { time: '12 PM', temp: selectedCity.temp + 2, icon: Sun },
    { time: '2 PM', temp: selectedCity.high, icon: Sun },
    { time: '4 PM', temp: selectedCity.temp + 1, icon: Cloud },
    { time: '6 PM', temp: selectedCity.temp - 3, icon: CloudRain },
    { time: '8 PM', temp: selectedCity.low + 4, icon: Cloud },
  ];

  const forecast = [
    { day: 'Today', high: selectedCity.high, low: selectedCity.low, cond: selectedCity.condition },
    { day: 'Wed', high: selectedCity.high + 1, low: selectedCity.low + 2, cond: 'Sunny' },
    { day: 'Thu', high: selectedCity.high - 3, low: selectedCity.low - 1, cond: 'Cloudy' },
    { day: 'Fri', high: selectedCity.high + 2, low: selectedCity.low + 1, cond: 'Sunny' },
    { day: 'Sat', high: selectedCity.high + 4, low: selectedCity.low + 3, cond: 'Clear' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-sky-950 via-slate-900 to-neutral-950 text-white select-none overflow-y-auto">
      {/* Header & City Selector */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <MapPin size={16} className="text-sky-400" />
          <select
            value={selectedCity.name}
            onChange={(e) => {
              audioEngine.playClick();
              const found = CITIES.find((c) => c.name === e.target.value);
              if (found) setSelectedCity(found);
            }}
            className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name} className="bg-neutral-900 text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-white/80">
          Live Forecast
        </span>
      </div>

      {/* Hero Temperature */}
      <div className="flex flex-col items-center py-6 px-4 space-y-1 text-center">
        <Sun size={64} className="text-amber-400 animate-spin-slow mb-2" />
        <div className="text-6xl font-extrabold tracking-tight font-sans">
          {selectedCity.temp}°
        </div>
        <div className="text-base font-semibold text-sky-200">{selectedCity.condition}</div>
        <div className="text-xs text-white/60 font-medium">
          H: {selectedCity.high}° • L: {selectedCity.low}°
        </div>
      </div>

      {/* Hourly Strip */}
      <div className="px-4 py-2">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-white/50 mb-2 block tracking-wider">
            Hourly Forecast
          </span>
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
            {hourly.map((h, i) => {
              const IconComp = h.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[44px]">
                  <span className="text-[11px] text-white/70">{h.time}</span>
                  <IconComp size={16} className="text-amber-300 my-0.5" />
                  <span className="text-xs font-bold">{h.temp}°</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5-Day Forecast & Metrics */}
      <div className="px-4 py-2 space-y-2.5 pb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-white/50 block tracking-wider">
            5-Day Outlook
          </span>
          {forecast.map((f, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
              <span className="font-medium text-white/90 w-12">{f.day}</span>
              <span className="text-sky-300 text-[11px]">{f.cond}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-white/60">{f.low}°</span>
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-amber-400 w-full" />
                </div>
                <span className="font-bold">{f.high}°</span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
              <Droplets size={13} className="text-sky-400" />
              <span>Humidity</span>
            </div>
            <div className="text-lg font-bold">{selectedCity.humidity}%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
              <Wind size={13} className="text-emerald-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-lg font-bold">{selectedCity.wind} mph</div>
          </div>
        </div>
      </div>
    </div>
  );
};
