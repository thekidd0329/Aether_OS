import React from 'react';
import { MonetPalette } from '../../types';
import { Plus, Image, Sliders, Check, LayoutGrid, Trash2 } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface EditModeToolbarProps {
  palette: MonetPalette;
  onDone: () => void;
  onOpenWidgets: () => void;
  onOpenWallpapers: () => void;
  onOpenSettings: () => void;
  onAddPage: () => void;
}

export const EditModeToolbar: React.FC<EditModeToolbarProps> = ({
  palette,
  onDone,
  onOpenWidgets,
  onOpenWallpapers,
  onOpenSettings,
  onAddPage,
}) => {
  return (
    <div className="absolute top-8 inset-x-4 z-40 flex items-center justify-between p-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl animate-slide-down">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            audioEngine.playClick(900, 'sine', 0.03);
            onOpenWidgets();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          <Plus size={14} className="text-indigo-400" />
          <span>Widgets</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick(900, 'sine', 0.03);
            onOpenWallpapers();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          <Image size={14} className="text-pink-400" />
          <span>Wallpapers</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick(900, 'sine', 0.03);
            onOpenSettings();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          <Sliders size={14} className="text-amber-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick(900, 'sine', 0.03);
            onAddPage();
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          title="Add Home Screen Page"
        >
          <Plus size={14} />
          <span>Page</span>
        </button>
      </div>

      <button
        onClick={() => {
          audioEngine.playClick(1000, 'triangle', 0.05);
          onDone();
        }}
        className="px-4 py-1.5 rounded-xl text-xs font-bold text-neutral-950 shadow-md ml-2 flex-shrink-0"
        style={{ backgroundColor: palette.primary }}
      >
        Done
      </button>
    </div>
  );
};
