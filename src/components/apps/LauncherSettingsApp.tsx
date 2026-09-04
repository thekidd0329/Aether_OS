import React, { useState } from 'react';
import {
  LauncherConfig,
  MonetPalette,
  IconShape,
  IconPack,
  ThemeMode,
  PageTransition,
  StatusBarStyle,
  NavStyle,
  PresetProfile
} from '../../types';
import { WALLPAPER_PRESETS } from '../../data/wallpapers';
import { PRESET_PROFILES } from '../../data/presetThemes';
import {
  LayoutGrid,
  Palette,
  Sparkles,
  Smartphone,
  Layers,
  Sliders,
  Check,
  RotateCcw,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Type,
  Maximize2,
  Grid
} from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface LauncherSettingsAppProps {
  config: LauncherConfig;
  palette: MonetPalette;
  onUpdateConfig: (newConfig: Partial<LauncherConfig>) => void;
  onApplyPreset: (preset: PresetProfile) => void;
  onResetDefaults: () => void;
  onClose: () => void;
  onOpenWidgetGallery: () => void;
}

export const LauncherSettingsApp: React.FC<LauncherSettingsAppProps> = ({
  config,
  palette,
  onUpdateConfig,
  onApplyPreset,
  onResetDefaults,
  onClose,
  onOpenWidgetGallery,
}) => {
  const [activeTab, setActiveTab] = useState<'icons' | 'grid' | 'theme' | 'gestures' | 'presets'>('icons');
  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const tabs = [
    { id: 'icons', label: 'Icons & Text', icon: Layers },
    { id: 'grid', label: 'Grid & Dock', icon: LayoutGrid },
    { id: 'theme', label: 'Theme & Wallpaper', icon: Palette },
    { id: 'gestures', label: 'System & Gestures', icon: Sliders },
    { id: 'presets', label: 'Presets & Backup', icon: Sparkles },
  ] as const;

  const iconShapes: { id: IconShape; label: string }[] = [
    { id: 'squircle', label: 'Squircle' },
    { id: 'circle', label: 'Circle' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'square', label: 'Square' },
    { id: 'teardrop', label: 'Teardrop' },
    { id: 'pebble', label: 'Pebble' },
    { id: 'hexagon', label: 'Hexagon' },
  ];

  const iconPacks: { id: IconPack; label: string; desc: string }[] = [
    { id: 'material_you', label: 'Material You', desc: 'Dynamic adaptive colors based on theme' },
    { id: 'pixel_minimal', label: 'Pixel Minimal', desc: 'Clean translucent glass glyphs' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'High-contrast neon glow outlines' },
    { id: 'glass', label: 'Frosted Glass', desc: 'Aesthetic blur with light reflection' },
    { id: 'retro_pixel', label: 'Retro Pixel', desc: '8-bit nostalgic pixel border' },
    { id: 'nothing_os', label: 'Nothing OS', desc: 'Monochrome dot-matrix aesthetics' },
    { id: 'mono_dark', label: 'Mono Dark', desc: 'Minimal dark matte finish' },
    { id: 'pastel', label: 'Pastel Dream', desc: 'Soft warm candy tones' },
  ];

  const transitions: { id: PageTransition; label: string }[] = [
    { id: 'slide', label: 'Standard Slide' },
    { id: 'cube', label: '3D Cube Rotate' },
    { id: 'stack', label: 'Card Stack' },
    { id: 'fade', label: 'Smooth Fade' },
    { id: 'zoom', label: 'Scale Zoom' },
    { id: 'accordion', label: 'Accordion Fold' },
  ];

  const chassisOptions = [
    { id: 'pixel9_obsidian', label: 'Pixel 9 Pro (Obsidian)' },
    { id: 'pixel9_porcelain', label: 'Pixel 9 Pro (Porcelain)' },
    { id: 'galaxy_titanium', label: 'Galaxy S24 (Titanium)' },
    { id: 'iphone_midnight', label: 'Modern Flagship' },
    { id: 'fullscreen', label: 'Frameless Fill' },
  ] as const;

  const handleExport = () => {
    audioEngine.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'novax_launcher_config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      onUpdateConfig(parsed);
      setShowImportModal(false);
      audioEngine.playClick(1000, 'triangle', 0.08);
    } catch {
      alert('Invalid JSON config format.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900 text-neutral-100 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: palette.primary }}
          >
            <Sliders size={15} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">NovaX Launcher Settings</h2>
            <p className="text-[10px] text-neutral-400">Total Customization Suite</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
        >
          Done
        </button>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-neutral-950 border-b border-neutral-800/80 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioEngine.playClick(750, 'sine', 0.03);
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'text-neutral-950 shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
              style={isActive ? { backgroundColor: palette.primary } : {}}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 1. ICONS & LABELS */}
        {activeTab === 'icons' && (
          <div className="space-y-6">
            {/* Icon Size */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200">Icon Size</span>
                <span className="text-xs font-mono font-bold text-neutral-400">{config.iconSize}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                step="5"
                value={config.iconSize}
                onChange={(e) => onUpdateConfig({ iconSize: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Icon Shape */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Icon Shape Mask</span>
              <div className="grid grid-cols-4 gap-2">
                {iconShapes.map((shape) => {
                  const isSelected = config.iconShape === shape.id;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => {
                        audioEngine.playClick(800, 'triangle', 0.04);
                        onUpdateConfig({ iconShape: shape.id });
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/15 text-white'
                          : 'border-neutral-700/60 bg-neutral-900/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 border-2 transition-all ${
                          shape.id === 'circle' ? 'rounded-full' :
                          shape.id === 'squircle' ? 'rounded-[26%]' :
                          shape.id === 'rounded' ? 'rounded-md' :
                          shape.id === 'square' ? 'rounded-none' :
                          shape.id === 'teardrop' ? 'rounded-tl-full rounded-tr-full rounded-bl-full' :
                          shape.id === 'pebble' ? 'rounded-[40%_60%_70%_30%]' : 'rounded-sm'
                        }`}
                        style={{ borderColor: isSelected ? palette.primary : '#71717a' }}
                      />
                      <span className="text-[10px] font-medium">{shape.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Icon Packs */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Icon Pack Style</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {iconPacks.map((pack) => {
                  const isSelected = config.iconPack === pack.id;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => {
                        audioEngine.playClick(900, 'sine', 0.04);
                        onUpdateConfig({ iconPack: pack.id });
                      }}
                      className={`flex items-start justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-neutral-700/60 bg-neutral-900/40 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{pack.label}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{pack.desc}</div>
                      </div>
                      {isSelected && <Check size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Labels Customization */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-4">
              <span className="text-xs font-semibold text-neutral-200 block">App Labels & Typography</span>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Show App Labels</span>
                <input
                  type="checkbox"
                  checked={config.showLabels}
                  onChange={(e) => onUpdateConfig({ showLabels: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              {config.showLabels && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>Font Size</span>
                      <span className="font-mono text-neutral-400">{config.labelFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="16"
                      value={config.labelFontSize}
                      onChange={(e) => onUpdateConfig({ labelFontSize: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-300">Font Family</span>
                    <select
                      value={config.fontFamily}
                      onChange={(e) => onUpdateConfig({ fontFamily: e.target.value as any })}
                      className="bg-neutral-900 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 text-neutral-200"
                    >
                      <option value="Outfit">Outfit (Modern)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta (Clean)</option>
                      <option value="Space Grotesk">Space Grotesk (Tech)</option>
                      <option value="JetBrains Mono">JetBrains (Developer)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-300">Text Shadow</span>
                    <input
                      type="checkbox"
                      checked={config.labelShadow}
                      onChange={(e) => onUpdateConfig({ labelShadow: e.target.checked })}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Notification Badges */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Notification Badges</span>
              <div className="grid grid-cols-3 gap-2">
                {(['dots', 'numeric', 'none'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => onUpdateConfig({ badgeStyle: style })}
                    className={`p-2 rounded-xl border text-xs font-medium capitalize transition-all ${
                      config.badgeStyle === style
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-neutral-700/60 bg-neutral-900/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. GRID & DOCK */}
        {activeTab === 'grid' && (
          <div className="space-y-6">
            {/* Desktop Grid Columns & Rows */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-4">
              <span className="text-xs font-semibold text-neutral-200 block">Desktop Grid Dimensions</span>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Columns ({config.gridColumns})</span>
                  <span className="text-neutral-400 font-mono">3 to 6 cols</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="6"
                  value={config.gridColumns}
                  onChange={(e) => onUpdateConfig({ gridColumns: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Rows ({config.gridRows})</span>
                  <span className="text-neutral-400 font-mono">4 to 8 rows</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="8"
                  value={config.gridRows}
                  onChange={(e) => onUpdateConfig({ gridRows: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Page Margin Padding ({config.gridPadding}px)</span>
                  <span className="text-neutral-400 font-mono">0 to 32px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="2"
                  value={config.gridPadding}
                  onChange={(e) => onUpdateConfig({ gridPadding: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Dock Configuration */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-4">
              <span className="text-xs font-semibold text-neutral-200 block">Dock Customization</span>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Enable Dock</span>
                <input
                  type="checkbox"
                  checked={config.dockEnabled}
                  onChange={(e) => onUpdateConfig({ dockEnabled: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              {config.dockEnabled && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>Dock Columns ({config.dockColumns})</span>
                      <span className="text-neutral-400 font-mono">3 to 6</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="6"
                      value={config.dockColumns}
                      onChange={(e) => onUpdateConfig({ dockColumns: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-300">Frosted Glass Background</span>
                    <input
                      type="checkbox"
                      checked={config.dockGlassBackground}
                      onChange={(e) => onUpdateConfig({ dockGlassBackground: e.target.checked })}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Quick Add Widget Button */}
            <button
              onClick={() => {
                onClose();
                onOpenWidgetGallery();
              }}
              className="w-full py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
            >
              <Grid size={15} />
              <span>Browse & Add Interactive Widgets</span>
            </button>
          </div>
        )}

        {/* 3. THEME & WALLPAPERS */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            {/* Theme Mode */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Theme Atmosphere</span>
              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'light', 'amoled', 'cyberpunk', 'solarized'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      audioEngine.playClick(600, 'triangle', 0.04);
                      onUpdateConfig({ themeMode: mode });
                    }}
                    className={`p-2 rounded-xl border text-xs font-medium capitalize transition-all ${
                      config.themeMode === mode
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-neutral-700/60 bg-neutral-900/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Monet Seed Color Picker */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Material You Seed Color</span>
              <div className="flex items-center gap-2">
                {['#e07a5f', '#6366f1', '#0ea5e9', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#00ffcc'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      audioEngine.playClick(750, 'sine', 0.03);
                      onUpdateConfig({ monetSeed: color });
                    }}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      config.monetSeed === color ? 'scale-125 ring-2 ring-white shadow-md' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={config.monetSeed}
                  onChange={(e) => onUpdateConfig({ monetSeed: e.target.value })}
                  className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-none"
                  title="Custom hex color"
                />
              </div>
            </div>

            {/* Wallpaper Selection */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Curated Wallpapers</span>
              <div className="grid grid-cols-3 gap-2.5">
                {WALLPAPER_PRESETS.map((wp) => {
                  const isSelected = config.wallpaperId === wp.id;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => {
                        audioEngine.playClick(850, 'sine', 0.04);
                        onUpdateConfig({
                          wallpaperId: wp.id,
                          liveWallpaper: Boolean(wp.isLive),
                          liveWallpaperType: wp.liveType || 'none',
                          monetSeed: wp.monetSeed,
                        });
                      }}
                      className={`group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected ? 'border-indigo-400 ring-2 ring-indigo-500/50 scale-[1.02]' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={wp.thumbnail}
                        alt={wp.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 to-transparent">
                        <span className="text-[10px] font-medium text-white block truncate leading-tight">
                          {wp.name}
                        </span>
                        {wp.isLive && (
                          <span className="text-[8px] bg-indigo-500 text-white px-1 rounded inline-block mt-0.5">
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wallpaper Effects (Blur & Dim) */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-4">
              <span className="text-xs font-semibold text-neutral-200 block">Wallpaper Optics</span>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Wallpaper Blur ({config.wallpaperBlur}px)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={config.wallpaperBlur}
                  onChange={(e) => onUpdateConfig({ wallpaperBlur: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Wallpaper Dimming ({config.wallpaperDim}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={config.wallpaperDim}
                  onChange={(e) => onUpdateConfig({ wallpaperDim: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. GESTURES & SYSTEM */}
        {activeTab === 'gestures' && (
          <div className="space-y-6">
            {/* Page Transition */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Page Transition Animation</span>
              <div className="grid grid-cols-2 gap-2">
                {transitions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      audioEngine.playClick(800, 'triangle', 0.04);
                      onUpdateConfig({ pageTransition: t.id });
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      config.pageTransition === t.id
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-neutral-700/60 bg-neutral-900/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gestures */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Gesture Shortcuts</span>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Swipe Down Action</span>
                <select
                  value={config.swipeDownAction}
                  onChange={(e) => onUpdateConfig({ swipeDownAction: e.target.value as any })}
                  className="bg-neutral-900 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
                >
                  <option value="quick_settings">Quick Settings Shade</option>
                  <option value="search">Global App Search</option>
                  <option value="notifications">Notification List</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Double Tap Blank Screen</span>
                <select
                  value={config.doubleTapAction}
                  onChange={(e) => onUpdateConfig({ doubleTapAction: e.target.value as any })}
                  className="bg-neutral-900 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
                >
                  <option value="screen_lock">Lock Screen</option>
                  <option value="settings">Launcher Settings</option>
                  <option value="camera">Quick Camera</option>
                </select>
              </div>
            </div>

            {/* Audio & Haptic Synthesizer */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Tactile Audio Feedback</span>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Tactile Audio Clicks</span>
                <input
                  type="checkbox"
                  checked={config.soundEffects}
                  onChange={(e) => {
                    const val = e.target.checked;
                    audioEngine.setMuted(!val);
                    onUpdateConfig({ soundEffects: val });
                  }}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* System UI */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">System Bars & Hardware Frame</span>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Show Status Bar</span>
                <input
                  type="checkbox"
                  checked={config.showStatusBar}
                  onChange={(e) => onUpdateConfig({ showStatusBar: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Navigation Bar Style</span>
                <select
                  value={config.navStyle}
                  onChange={(e) => onUpdateConfig({ navStyle: e.target.value as any })}
                  className="bg-neutral-900 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
                >
                  <option value="gesture_pill">Gesture Pill</option>
                  <option value="3_button">3-Button (Back/Home/Recents)</option>
                  <option value="hidden">Immersive (Hidden)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300">Device Mockup Frame</span>
                <select
                  value={config.deviceChassis}
                  onChange={(e) => onUpdateConfig({ deviceChassis: e.target.value as any })}
                  className="bg-neutral-900 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
                >
                  {chassisOptions.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 5. PRESETS & BACKUP */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            {/* Quick Profiles */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Instant Launcher Profiles</span>
              <div className="space-y-2">
                {PRESET_PROFILES.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-700/60 hover:border-neutral-600 transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.previewColor }}
                        />
                        <span className="text-xs font-bold text-white">{preset.name}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">{preset.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        audioEngine.playClick(1000, 'triangle', 0.06);
                        onApplyPreset(preset);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Backup / Export / Import */}
            <div className="bg-neutral-800/60 p-3.5 rounded-2xl border border-neutral-700/60 space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">Backup & Migration</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-200 transition-colors"
                >
                  <Download size={14} />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-200 transition-colors"
                >
                  <Upload size={14} />
                  <span>Import JSON</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm('Reset launcher to factory defaults?')) {
                    onResetDefaults();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors mt-2"
              >
                <RotateCcw size={14} />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-4 w-full max-w-sm space-y-3">
            <h3 className="text-sm font-bold text-white">Import Configuration</h3>
            <p className="text-xs text-neutral-400">Paste your exported NovaX JSON configuration below:</p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"gridColumns": 4, ...}'
              className="w-full h-36 bg-neutral-950 text-xs p-2 rounded-lg border border-neutral-800 font-mono text-neutral-200 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Apply Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
