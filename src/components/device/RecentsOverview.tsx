import React from 'react';
import { AppItem, MonetPalette } from '../../types';
import { Trash2, SplitSquareVertical, Info, ExternalLink } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface RecentsOverviewProps {
  palette: MonetPalette;
  apps: AppItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (app: AppItem) => void;
  onClearAll: () => void;
}

export const RecentsOverview: React.FC<RecentsOverviewProps> = ({
  palette,
  apps,
  isOpen,
  onClose,
  onSelectApp,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const recentApps = apps.slice(0, 4);

  return (
    <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xl flex flex-col justify-between p-4 text-white select-none animate-fade-in">
      {/* Top action */}
      <div className="flex justify-between items-center py-2 px-1">
        <span className="text-xs font-bold text-neutral-400">Recents Overview</span>
        <button
          onClick={() => {
            audioEngine.playClick();
            onClose();
          }}
          className="text-xs text-neutral-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* Horizontal Carousel of Recent App Cards */}
      <div className="flex-1 flex items-center gap-4 overflow-x-auto py-4 px-2 no-scrollbar">
        {recentApps.map((app) => (
          <div
            key={app.id}
            onClick={() => {
              audioEngine.playClick(900, 'sine', 0.04);
              onSelectApp(app);
              onClose();
            }}
            className="w-56 h-80 rounded-3xl bg-neutral-900 border border-neutral-700/80 shadow-2xl flex flex-col overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
          >
            {/* App Card Header */}
            <div className="p-3 bg-neutral-950 flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: app.customColor || app.defaultColor }}
                >
                  {app.name[0]}
                </div>
                <span className="text-xs font-bold truncate max-w-[100px]">{app.name}</span>
              </div>
              <ExternalLink size={13} className="text-neutral-500" />
            </div>

            {/* Simulated App Snapshot View */}
            <div className="flex-1 p-4 bg-neutral-950/80 flex flex-col items-center justify-center space-y-2 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: app.customColor || app.defaultColor }}
              >
                <span className="text-xl font-bold">{app.name[0]}</span>
              </div>
              <span className="text-xs font-semibold text-neutral-300">{app.name}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{app.packageName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Clear All Bar */}
      <div className="flex justify-center pb-2">
        <button
          onClick={() => {
            audioEngine.playClick(400, 'sine', 0.06);
            onClearAll();
            onClose();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-white shadow-lg transition-all"
        >
          <Trash2 size={15} className="text-red-400" />
          <span>Clear All Background Apps</span>
        </button>
      </div>
    </div>
  );
};
