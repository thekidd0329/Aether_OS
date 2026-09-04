import React, { useState, useMemo } from 'react';
import { AppItem, LauncherConfig, MonetPalette, AppCategory } from '../../types';
import { AppIcon } from '../home/AppIcon';
import { Search, ChevronDown, Sparkles, Filter } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface AppDrawerProps {
  apps: AppItem[];
  config: LauncherConfig;
  palette: MonetPalette;
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (app: AppItem) => void;
  onEditApp: (app: AppItem) => void;
  onAddToHome: (appId: string) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  apps,
  config,
  palette,
  isOpen,
  onClose,
  onOpenApp,
  onEditApp,
  onAddToHome,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AppCategory>('All');
  const [selectedAppForAction, setSelectedAppForAction] = useState<AppItem | null>(null);

  const categories: AppCategory[] = ['All', 'Favorites', 'Productivity', 'Media', 'Tools', 'Social', 'Games', 'System'];

  const visibleApps = useMemo(() => {
    return apps.filter((app) => {
      if (app.hidden) return false;
      const matchesSearch = (app.customLabel || app.name).toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => (a.customLabel || a.name).localeCompare(b.customLabel || b.name));
  }, [apps, search, activeCategory]);

  // Alphabet sections
  const alphabet = Array.from(new Set(visibleApps.map(a => (a.customLabel || a.name)[0].toUpperCase()))).sort();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-neutral-950/92 backdrop-blur-2xl flex flex-col text-white select-none animate-slide-up">
      {/* Search Header */}
      <div className="p-4 flex items-center gap-3 border-b border-neutral-800/80">
        <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 focus-within:border-indigo-500/80 transition-all">
          <Search size={16} className="text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all apps & device..."
            autoFocus
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-neutral-400 hover:text-white">
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => {
            audioEngine.playClick();
            onClose();
          }}
          className="p-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar border-b border-neutral-800/60 bg-neutral-950/40">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              audioEngine.playClick(800, 'sine', 0.02);
              setActiveCategory(cat);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'bg-indigo-600 text-white font-semibold' : 'text-neutral-400 hover:bg-neutral-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Grid with Side Alphabet Bar */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-4 overflow-y-auto">
          {visibleApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-500 text-xs">
              No applications found for "{search}"
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-y-6 gap-x-2 pb-12">
              {visibleApps.map((app) => (
                <div key={app.id} className="flex justify-center">
                  <AppIcon
                    app={app}
                    sizePercent={config.iconSize}
                    shape={config.iconShape}
                    pack={config.iconPack}
                    showLabel={config.showLabels}
                    fontSize={config.labelFontSize}
                    labelColor={config.labelColor}
                    labelShadow={config.labelShadow}
                    fontFamily={config.fontFamily}
                    badgeStyle={config.badgeStyle}
                    badgeColor={config.badgeColor}
                    palette={palette}
                    onClick={() => {
                      onOpenApp(app);
                      onClose();
                    }}
                    onLongPress={() => {
                      setSelectedAppForAction(app);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alphabet quick scroll */}
        <div className="w-6 flex flex-col items-center justify-center py-2 text-[10px] font-mono font-bold text-neutral-500 select-none">
          {alphabet.map((letter) => (
            <span key={letter} className="cursor-pointer hover:text-white py-0.5">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* App Long Press Quick Action Bottom Sheet */}
      {selectedAppForAction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-sm p-4 space-y-3 shadow-2xl animate-slide-up">
            <div className="flex items-center gap-3 pb-2 border-b border-neutral-800">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: selectedAppForAction.customColor || selectedAppForAction.defaultColor }}
              >
                <span className="font-bold">{selectedAppForAction.name[0]}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{selectedAppForAction.name}</h4>
                <span className="text-[10px] text-neutral-400">{selectedAppForAction.packageName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onAddToHome(selectedAppForAction.id);
                  setSelectedAppForAction(null);
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-800 text-xs font-semibold text-neutral-200"
              >
                + Add to Home Screen
              </button>

              <button
                onClick={() => {
                  onEditApp(selectedAppForAction);
                  setSelectedAppForAction(null);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-800 text-xs font-semibold text-neutral-200"
              >
                ✎ Customize App (Icon, Color, Label)
              </button>

              <button
                onClick={() => setSelectedAppForAction(null)}
                className="w-full text-center p-2.5 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white mt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
