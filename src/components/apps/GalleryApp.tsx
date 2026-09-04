import React, { useState } from 'react';
import { MonetPalette, WallpaperPreset } from '../../types';
import { WALLPAPER_PRESETS } from '../../data/wallpapers';
import { Image, Check, Sparkles, Upload } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface GalleryAppProps {
  palette: MonetPalette;
  currentWallpaperId: string;
  onSetWallpaper: (wp: WallpaperPreset) => void;
  onClose: () => void;
}

export const GalleryApp: React.FC<GalleryAppProps> = ({
  palette,
  currentWallpaperId,
  onSetWallpaper,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedWp, setSelectedWp] = useState<WallpaperPreset>(
    WALLPAPER_PRESETS.find((w) => w.id === currentWallpaperId) || WALLPAPER_PRESETS[0]
  );

  const categories = ['All', 'Abstract', 'AMOLED', 'Cyberpunk', 'Nature', 'Gradient'];

  const filtered = activeCategory === 'All'
    ? WALLPAPER_PRESETS
    : WALLPAPER_PRESETS.filter((w) => w.category === activeCategory);

  const handleApply = (wp: WallpaperPreset) => {
    audioEngine.playClick(1000, 'triangle', 0.08);
    onSetWallpaper(wp);
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Image size={16} style={{ color: palette.primary }} />
          <span className="text-xs font-bold text-neutral-300">NovaX Wallpapers & Gallery</span>
        </div>
        <button
          onClick={() => handleApply(selectedWp)}
          className="px-3 py-1 rounded-full text-xs font-bold text-neutral-950 transition-all hover:scale-105"
          style={{ backgroundColor: palette.primary }}
        >
          Set as Wallpaper
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900/60 overflow-x-auto no-scrollbar border-b border-neutral-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              audioEngine.playClick(700, 'sine', 0.02);
              setActiveCategory(cat);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((wp) => {
          const isSelected = selectedWp.id === wp.id;
          const isCurrent = currentWallpaperId === wp.id;
          return (
            <div
              key={wp.id}
              onClick={() => {
                audioEngine.playClick();
                setSelectedWp(wp);
              }}
              className={`group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                isSelected ? 'border-indigo-400 ring-4 ring-indigo-500/40 scale-[1.02]' : 'border-transparent opacity-85 hover:opacity-100'
              }`}
            >
              <img src={wp.thumbnail} alt={wp.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                <span className="text-xs font-bold text-white block truncate">{wp.name}</span>
                <span className="text-[10px] text-neutral-400">{wp.category}</span>
              </div>
              {isCurrent && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
