import React, { useState, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { AppItem, IconPack, IconShape, MonetPalette } from '../../types';
import { audioEngine } from '../../utils/audioEngine';

interface AppIconProps {
  app: AppItem;
  sizePercent: number; // 60 - 150
  shape: IconShape;
  pack: IconPack;
  showLabel: boolean;
  fontSize: number;
  labelColor: string;
  labelShadow: boolean;
  fontFamily: string;
  badgeStyle: 'numeric' | 'dots' | 'none';
  badgeColor: string;
  palette: MonetPalette;
  isEditMode?: boolean;
  onClick?: () => void;
  onLongPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onDelete?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({
  app,
  sizePercent,
  shape,
  pack,
  showLabel,
  fontSize,
  labelColor,
  labelShadow,
  fontFamily,
  badgeStyle,
  badgeColor,
  palette,
  isEditMode = false,
  onClick,
  onLongPress,
  onDelete,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef<any>(null);

  // Dynamic Icon retrieval from lucide-react
  const IconComponent = (LucideIcons as any)[app.customIcon || app.iconName] || LucideIcons.AppWindow;

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      audioEngine.playClick(400, 'triangle', 0.08);
      onLongPress?.(e);
    }, 450);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      audioEngine.playClick(400, 'triangle', 0.08);
      onLongPress?.(e);
    }, 450);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) return;
    audioEngine.playClick(900, 'sine', 0.03);
    onClick?.();
  };

  // Shape CSS classes
  const getShapeClasses = (): string => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'squircle': return 'rounded-[26%]';
      case 'rounded': return 'rounded-2xl';
      case 'square': return 'rounded-lg';
      case 'teardrop': return 'rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-sm';
      case 'pebble': return 'rounded-[40%_60%_70%_30%/40%_50%_60%_55%]';
      case 'hexagon': return 'rounded-xl rotate-0 clip-path-hex';
      default: return 'rounded-2xl';
    }
  };

  // Pack specific color styling
  const getPackStyles = () => {
    const baseColor = app.customColor || app.defaultColor;

    switch (pack) {
      case 'material_you':
        return {
          bg: palette.primaryContainer,
          fg: palette.primary,
          border: `1px solid ${palette.primary}33`,
          shadow: `0 4px 12px ${palette.primary}22`,
        };
      case 'pixel_minimal':
        return {
          bg: 'rgba(255, 255, 255, 0.12)',
          fg: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          shadow: '0 4px 12px rgba(0,0,0,0.3)',
          backdropBlur: 'blur(8px)',
        };
      case 'cyberpunk':
        return {
          bg: 'rgba(10, 15, 25, 0.85)',
          fg: palette.accent || '#00ffcc',
          border: `1.5px solid ${palette.accent || '#00ffcc'}`,
          shadow: `0 0 14px ${palette.accent || '#00ffcc'}55`,
        };
      case 'glass':
        return {
          bg: `${baseColor}33`,
          fg: '#ffffff',
          border: `1.5px solid rgba(255, 255, 255, 0.4)`,
          shadow: '0 8px 24px rgba(0,0,0,0.35)',
          backdropBlur: 'blur(12px)',
        };
      case 'retro_pixel':
        return {
          bg: baseColor,
          fg: '#ffffff',
          border: '2px solid #000000',
          shadow: '3px 3px 0px #000000',
        };
      case 'nothing_os':
        return {
          bg: '#18181b',
          fg: '#f4f4f5',
          border: '1px solid #27272a',
          shadow: '0 2px 8px rgba(0,0,0,0.4)',
        };
      case 'mono_dark':
        return {
          bg: '#09090b',
          fg: '#fafafa',
          border: '1px solid #3f3f46',
          shadow: '0 2px 6px rgba(0,0,0,0.5)',
        };
      case 'pastel':
        return {
          bg: `${baseColor}44`,
          fg: baseColor,
          border: `1.5px solid ${baseColor}66`,
          shadow: `0 4px 14px ${baseColor}33`,
        };
      default:
        return {
          bg: baseColor,
          fg: '#ffffff',
          border: 'none',
          shadow: '0 4px 10px rgba(0,0,0,0.25)',
        };
    }
  };

  const packStyle = getPackStyles();
  const basePixelSize = Math.round(52 * (sizePercent / 100));
  const iconPixelSize = Math.round(basePixelSize * 0.52);

  return (
    <div
      className={`relative flex flex-col items-center justify-center cursor-pointer select-none group transition-transform ${
        isPressed ? 'scale-90' : isEditMode ? 'animate-wiggle' : 'active:scale-95'
      }`}
      style={{ fontFamily }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.(e);
      }}
    >
      {/* Delete button in edit mode */}
      {isEditMode && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-1.5 -right-1.5 z-20 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-lg hover:bg-red-600 transition-colors"
          title="Remove from home"
        >
          ✕
        </button>
      )}

      {/* Main Icon Plate */}
      <div
        className={`relative flex items-center justify-center transition-all duration-200 overflow-hidden ${getShapeClasses()}`}
        style={{
          width: `${basePixelSize}px`,
          height: `${basePixelSize}px`,
          backgroundColor: packStyle.bg,
          border: packStyle.border,
          boxShadow: packStyle.shadow,
          backdropFilter: packStyle.backdropBlur,
        }}
      >
        {/* Subtle top glare reflection for glass look */}
        {pack === 'glass' && (
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        )}

        {/* Icon Component */}
        <IconComponent
          size={iconPixelSize}
          color={packStyle.fg}
          strokeWidth={pack === 'nothing_os' ? 1.75 : pack === 'cyberpunk' ? 2.2 : 2}
          className="relative z-10 drop-shadow-sm transition-transform group-hover:scale-105"
        />

        {/* Badge */}
        {badgeStyle !== 'none' && (app.badgeCount ?? 0) > 0 && (
          <div
            className={`absolute top-1 right-1 z-20 flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md ${
              badgeStyle === 'dots' ? 'w-2.5 h-2.5' : 'min-w-[16px] h-4 px-1'
            }`}
            style={{ backgroundColor: badgeColor || palette.accent }}
          >
            {badgeStyle === 'numeric' ? (app.badgeCount! > 99 ? '99+' : app.badgeCount) : null}
          </div>
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className="mt-1.5 text-center leading-tight tracking-tight truncate max-w-[76px] transition-colors"
          style={{
            fontSize: `${fontSize}px`,
            color: labelColor,
            textShadow: labelShadow ? '0 1px 3px rgba(0, 0, 0, 0.8)' : 'none',
          }}
        >
          {app.customLabel || app.name}
        </span>
      )}
    </div>
  );
};
