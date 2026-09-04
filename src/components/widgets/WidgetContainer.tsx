import React from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Trash2, Move, Maximize2 } from 'lucide-react';

interface WidgetContainerProps {
  widget: WidgetItem;
  palette: MonetPalette;
  isEditMode?: boolean;
  onDelete?: () => void;
  onResize?: () => void;
  children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  palette,
  isEditMode = false,
  onDelete,
  onResize,
  children,
}) => {
  const bgOpacity = widget.settings.bgOpacity ?? 0.35;
  const blur = widget.settings.blur ?? 16;
  const borderRadius = widget.settings.borderRadius ?? 24;

  return (
    <div
      className={`relative w-full h-full transition-all duration-200 overflow-hidden select-none group ${
        isEditMode ? 'ring-2 ring-indigo-500/80 ring-offset-2 ring-offset-black/40' : ''
      }`}
      style={{
        backgroundColor: `rgba(18, 20, 29, ${bgOpacity})`,
        backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
        WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : undefined,
        borderRadius: `${borderRadius}px`,
        border: `1px solid rgba(255, 255, 255, 0.12)`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Edit Overlay */}
      {isEditMode && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
          <span className="text-[10px] text-white/70 font-mono">
            {widget.colSpan}x{widget.rowSpan}
          </span>
          {onResize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResize();
              }}
              className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
              title="Cycle widget size"
            >
              <Maximize2 size={12} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-red-400 hover:text-red-200 hover:bg-red-500/30 rounded-full transition-colors"
              title="Remove widget"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}

      {/* Widget Content */}
      <div className="w-full h-full p-3.5 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
