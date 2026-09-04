import React, { useState, useEffect } from 'react';
import { MonetPalette } from '../../types';
import {
  Wifi,
  Bluetooth,
  Flashlight,
  Moon,
  Volume2,
  VolumeX,
  RotateCw,
  BatteryCharging,
  Sun,
  Sliders,
  ChevronUp,
  Disc,
  Play,
  Pause
} from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface QuickSettingsShadeProps {
  palette: MonetPalette;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const QuickSettingsShade: React.FC<QuickSettingsShadeProps> = ({
  palette,
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [torch, setTorch] = useState(false);
  const [dnd, setDnd] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [brightness, setBrightness] = useState(85);
  const [musicState, setMusicState] = useState(audioEngine.getMusicState());

  useEffect(() => {
    const unsub = audioEngine.subscribe(setMusicState);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const toggles = [
    { id: 'wifi', label: 'Internet', sub: wifi ? 'Pixel_5G' : 'Off', active: wifi, icon: Wifi, action: () => setWifi(!wifi) },
    { id: 'bt', label: 'Bluetooth', sub: bluetooth ? 'Pixel Buds' : 'Off', active: bluetooth, icon: Bluetooth, action: () => setBluetooth(!bluetooth) },
    { id: 'torch', label: 'Flashlight', sub: torch ? 'On' : 'Off', active: torch, icon: Flashlight, action: () => setTorch(!torch) },
    { id: 'dnd', label: 'Do Not Disturb', sub: dnd ? 'Priority' : 'Off', active: dnd, icon: Moon, action: () => setDnd(!dnd) },
    { id: 'rotate', label: 'Auto-Rotate', sub: autoRotate ? 'On' : 'Locked', active: autoRotate, icon: RotateCw, action: () => setAutoRotate(!autoRotate) },
    { id: 'saver', label: 'Battery Saver', sub: 'Standard', active: false, icon: BatteryCharging, action: () => {} },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-neutral-950/94 backdrop-blur-2xl flex flex-col text-white select-none animate-slide-down overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold font-mono text-white">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
          <span className="text-[11px] text-neutral-400">
            • {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenSettings();
              onClose();
            }}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            title="Settings"
          >
            <Sliders size={16} />
          </button>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          >
            <ChevronUp size={16} />
          </button>
        </div>
      </div>

      {/* Quick Settings Toggles Grid */}
      <div className="p-4 grid grid-cols-2 gap-2.5">
        {toggles.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                audioEngine.playClick(item.active ? 600 : 900, 'triangle', 0.04);
                item.action();
              }}
              className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all ${
                item.active
                  ? 'text-neutral-950 shadow-md font-semibold'
                  : 'bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
              }`}
              style={item.active ? { backgroundColor: palette.primary } : {}}
            >
              <div className={`p-2 rounded-full ${item.active ? 'bg-black/15 text-neutral-950' : 'bg-neutral-800 text-white'}`}>
                <Icon size={16} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate leading-tight">{item.label}</div>
                <div className={`text-[10px] truncate ${item.active ? 'text-black/70' : 'text-neutral-500'}`}>
                  {item.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Brightness Slider */}
      <div className="px-4 py-2 flex items-center gap-3">
        <Sun size={18} className="text-neutral-400" />
        <input
          type="range"
          min="10"
          max="100"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="flex-1 accent-indigo-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
        />
        <span className="text-xs font-mono text-neutral-400 w-8">{brightness}%</span>
      </div>

      {/* Mini Media Player in Shade */}
      <div className="m-4 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
            <Disc size={18} className={musicState.isPlaying ? 'animate-spin' : ''} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{musicState.track}</span>
            <span className="text-[10px] text-neutral-400 font-mono">NovaX Lo-Fi Synth</span>
          </div>
        </div>

        <button
          onClick={() => audioEngine.toggleMusic(musicState.track)}
          className="w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-md active:scale-95"
        >
          {musicState.isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
      </div>

      {/* Notifications Section */}
      <div className="px-4 pb-6 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider px-1">
          <span>Notifications</span>
          <button className="text-indigo-400 hover:underline">Clear all</button>
        </div>

        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">NovaX Launcher</span>
            <span className="text-[10px] text-neutral-500 font-mono">Just now</span>
          </div>
          <p className="text-xs text-neutral-400">
            Customize grid size, widgets, and Material You dynamic theming.
          </p>
        </div>
      </div>
    </div>
  );
};
