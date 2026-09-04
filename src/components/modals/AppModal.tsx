import React from 'react';
import { AppItem, LauncherConfig, MonetPalette, WallpaperPreset } from '../../types';
import { X, Minus, Maximize2, ArrowLeft } from 'lucide-react';
import { CalculatorApp } from '../apps/CalculatorApp';
import { WeatherApp } from '../apps/WeatherApp';
import { MusicApp } from '../apps/MusicApp';
import { NotesApp } from '../apps/NotesApp';
import { CameraApp } from '../apps/CameraApp';
import { PhoneApp } from '../apps/PhoneApp';
import { GalleryApp } from '../apps/GalleryApp';
import { TerminalApp } from '../apps/TerminalApp';
import { ClockApp } from '../apps/ClockApp';
import { LauncherSettingsApp } from '../apps/LauncherSettingsApp';
import { audioEngine } from '../../utils/audioEngine';

interface AppModalProps {
  app: AppItem;
  config: LauncherConfig;
  palette: MonetPalette;
  onClose: () => void;
  onUpdateConfig: (newConfig: Partial<LauncherConfig>) => void;
  onApplyPreset: (preset: any) => void;
  onResetDefaults: () => void;
  onOpenWidgetGallery: () => void;
  onSetWallpaper: (wp: WallpaperPreset) => void;
}

export const AppModal: React.FC<AppModalProps> = ({
  app,
  config,
  palette,
  onClose,
  onUpdateConfig,
  onApplyPreset,
  onResetDefaults,
  onOpenWidgetGallery,
  onSetWallpaper,
}) => {
  const renderAppContent = () => {
    switch (app.id) {
      case 'settings':
        return (
          <LauncherSettingsApp
            config={config}
            palette={palette}
            onUpdateConfig={onUpdateConfig}
            onApplyPreset={onApplyPreset}
            onResetDefaults={onResetDefaults}
            onClose={onClose}
            onOpenWidgetGallery={onOpenWidgetGallery}
          />
        );
      case 'calculator':
        return <CalculatorApp palette={palette} onClose={onClose} />;
      case 'weather':
        return <WeatherApp palette={palette} onClose={onClose} />;
      case 'music':
      case 'spotify':
        return <MusicApp palette={palette} onClose={onClose} />;
      case 'notes':
        return <NotesApp palette={palette} onClose={onClose} />;
      case 'camera':
        return <CameraApp palette={palette} onClose={onClose} />;
      case 'phone':
        return <PhoneApp palette={palette} onClose={onClose} />;
      case 'gallery':
        return (
          <GalleryApp
            palette={palette}
            currentWallpaperId={config.wallpaperId}
            onSetWallpaper={onSetWallpaper}
            onClose={onClose}
          />
        );
      case 'terminal':
        return <TerminalApp palette={palette} onClose={onClose} />;
      case 'clock':
        return <ClockApp palette={palette} onClose={onClose} />;
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-neutral-950 text-white space-y-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl"
              style={{ backgroundColor: app.customColor || app.defaultColor }}
            >
              <span className="text-3xl font-bold">{app.name[0]}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold">{app.name}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-1">{app.packageName}</p>
            </div>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              This simulated Android app is running in the background. You can customize its icon, label, and shortcuts in NovaX Settings!
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-bold text-neutral-950 shadow-md"
              style={{ backgroundColor: palette.primary }}
            >
              Back to Home Screen
            </button>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black overflow-hidden animate-app-launch">
      {/* App bar / Window controls */}
      <div className="h-10 px-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between flex-shrink-0 z-50">
        <button
          onClick={() => {
            audioEngine.playClick(600, 'sine', 0.03);
            onClose();
          }}
          className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="font-semibold truncate max-w-[140px]">{app.name}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="w-5 h-5 rounded-full bg-neutral-800 hover:bg-red-500/80 text-neutral-400 hover:text-white flex items-center justify-center transition-colors text-[10px]"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main app surface */}
      <div className="flex-1 overflow-hidden relative">
        {renderAppContent()}
      </div>
    </div>
  );
};
