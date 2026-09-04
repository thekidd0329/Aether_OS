import React, { useState, useRef } from 'react';
import {
  AppItem,
  WidgetItem,
  GridItemPlacement,
  LauncherConfig,
  MonetPalette,
  PageTransition,
} from '../../types';
import { AppIcon } from './AppIcon';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import { audioEngine } from '../../utils/audioEngine';

interface HomeScreenProps {
  apps: AppItem[];
  widgets: WidgetItem[];
  placements: GridItemPlacement[];
  config: LauncherConfig;
  palette: MonetPalette;
  activePageIndex: number;
  totalPages: number;
  isEditMode: boolean;
  onPageChange: (index: number) => void;
  onOpenApp: (app: AppItem) => void;
  onEditApp: (app: AppItem) => void;
  onRemoveAppPlacement: (placementId: string) => void;
  onRemoveWidget: (widgetId: string) => void;
  onResizeWidget: (widgetId: string) => void;
  onEnterEditMode: () => void;
  onDoubleTap: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  apps,
  widgets,
  placements,
  config,
  palette,
  activePageIndex,
  totalPages,
  isEditMode,
  onPageChange,
  onOpenApp,
  onEditApp,
  onRemoveAppPlacement,
  onRemoveWidget,
  onResizeWidget,
  onEnterEditMode,
  onDoubleTap,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const lastTapRef = useRef<number>(0);

  // Swipe threshold
  const minSwipeDistance = 50;

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activePageIndex < totalPages - 1) {
      audioEngine.playClick(650, 'sine', 0.02);
      onPageChange(activePageIndex + 1);
    }
    if (isRightSwipe && activePageIndex > 0) {
      audioEngine.playClick(650, 'sine', 0.02);
      onPageChange(activePageIndex - 1);
    }
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected!
      audioEngine.playClick(900, 'triangle', 0.05);
      onDoubleTap();
    }
    lastTapRef.current = now;
  };

  // Filter items for the active page
  const pagePlacements = placements.filter((p) => p.pageIndex === activePageIndex);
  const pageWidgets = widgets.filter((w) => w.pageIndex === activePageIndex);

  // Transition style classes
  const getTransitionStyle = () => {
    switch (config.pageTransition) {
      case 'fade':
        return 'transition-opacity duration-300';
      case 'zoom':
        return 'transition-transform duration-300';
      case 'cube':
        return 'perspective-1000 transition-transform duration-400';
      default:
        return 'transition-all duration-300';
    }
  };

  return (
    <div
      className="flex-1 flex flex-col justify-between overflow-hidden select-none relative z-10"
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
      onClick={handleScreenClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onEnterEditMode();
      }}
    >
      {/* Grid Container */}
      <div
        className={`flex-1 grid gap-2.5 ${getTransitionStyle()}`}
        style={{
          padding: `${config.gridPadding}px`,
          gridTemplateColumns: `repeat(${config.gridColumns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${config.gridRows}, minmax(0, 1fr))`,
        }}
      >
        {/* Render Widgets */}
        {pageWidgets.map((w) => {
          const colSpan = Math.min(w.colSpan, config.gridColumns);
          const rowSpan = Math.min(w.rowSpan, config.gridRows);

          return (
            <div
              key={w.id}
              className="relative"
              style={{
                gridColumn: `span ${colSpan} / span ${colSpan}`,
                gridRow: `span ${rowSpan} / span ${rowSpan}`,
              }}
            >
              <WidgetRenderer
                widget={w}
                palette={palette}
                isEditMode={isEditMode}
                onDelete={() => onRemoveWidget(w.id)}
                onResize={() => onResizeWidget(w.id)}
                onOpenApp={(appId) => {
                  const target = apps.find((a) => a.id === appId);
                  if (target) onOpenApp(target);
                }}
              />
            </div>
          );
        })}

        {/* Render App Icons Placements on this page */}
        {pagePlacements.map((p) => {
          const app = apps.find((a) => a.id === p.appId);
          if (!app) return null;

          return (
            <div
              key={p.id}
              className="flex items-center justify-center relative"
              style={{
                gridColumn: `span 1 / span 1`,
                gridRow: `span 1 / span 1`,
              }}
            >
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
                isEditMode={isEditMode}
                onClick={() => onOpenApp(app)}
                onLongPress={() => onEditApp(app)}
                onDelete={() => onRemoveAppPlacement(p.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Page Dots Indicator */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-1 z-20">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                audioEngine.playClick(800, 'sine', 0.02);
                onPageChange(idx);
              }}
              className={`transition-all rounded-full ${
                activePageIndex === idx
                  ? 'w-4 h-1.5 bg-white shadow-md'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
