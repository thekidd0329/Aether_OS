import React from 'react';
import { AppItem, LauncherConfig, MonetPalette } from '../../types';
import { AppIcon } from './AppIcon';
import { ChevronUp } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface DockProps {
  dockApps: AppItem[];
  config: LauncherConfig;
  palette: MonetPalette;
  isEditMode?: boolean;
  onOpenApp: (app: AppItem) => void;
  onOpenAppDrawer: () => void;
  onEditApp: (app: AppItem) => void;
  onRemoveFromDock?: (appId: string) => void;
}

export const Dock: React.FC<DockProps> = ({
  dockApps,
  config,
  palette,
  isEditMode = false,
  onOpenApp,
  onOpenAppDrawer,
  onEditApp,
  onRemoveFromDock,
}) => {
  if (!config.dockEnabled) return null;

  return (
    <div className="w-full px-4 pb-2 pt-1 flex flex-col items-center select-none z-20">
      {/* Swipe up hint indicator */}
      <div
        onClick={() => {
          audioEngine.playClick(800, 'sine', 0.02);
          onOpenAppDrawer();
        }}
        className="flex flex-col items-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity mb-1"
        title="Swipe or tap for App Drawer"
      >
        <ChevronUp size={14} className="text-white animate-bounce-slow" />
      </div>

      {/* Dock Bar */}
      <div
        className={`w-full max-w-md py-2 px-3 flex items-center justify-around transition-all ${
          config.dockGlassBackground
            ? 'rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl'
            : ''
        }`}
        style={{
          transform: `scale(${config.dockScale})`,
        }}
      >
        {dockApps.slice(0, config.dockColumns).map((app) => (
          <div key={app.id} className="flex justify-center flex-1">
            <AppIcon
              app={app}
              sizePercent={config.iconSize}
              shape={config.iconShape}
              pack={config.iconPack}
              showLabel={false}
              fontSize={config.labelFontSize}
              labelColor={config.labelColor}
              labelShadow={config.labelShadow}
              fontFamily={config.fontFamily}
              badgeStyle={config.badgeStyle}
              badgeColor={config.badgeColor}
              palette={palette}
              isEditMode={isEditMode}
              onClick={() => onOpenApp(app)}
              onLongPress={() => onEditApp(app)}
              onDelete={onRemoveFromDock ? () => onRemoveFromDock(app.id) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
