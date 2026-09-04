import React, { useState } from 'react';
import { AppItem, MonetPalette } from '../../types';
import * as LucideIcons from 'lucide-react';
import { X, Check, EyeOff, RotateCcw } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface EditAppModalProps {
  app: AppItem;
  palette: MonetPalette;
  onSave: (appId: string, updates: Partial<AppItem>) => void;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  'Phone', 'MessageSquare', 'Camera', 'Globe', 'Sliders', 'Music', 'CloudSun', 'Clock',
  'Calculator', 'FileText', 'Image', 'Terminal', 'ShoppingBag', 'Mail', 'MapPin', 'PlaySquare',
  'Activity', 'Folder', 'Headphones', 'Radio', 'Flame', 'Code', 'Calendar', 'Gamepad2',
  'Zap', 'Star', 'Heart', 'Shield', 'Compass', 'Send', 'Sparkles', 'Cpu'
];

export const EditAppModal: React.FC<EditAppModalProps> = ({
  app,
  palette,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(app.customLabel || app.name);
  const [color, setColor] = useState(app.customColor || app.defaultColor);
  const [icon, setIcon] = useState(app.customIcon || app.iconName);
  const [hidden, setHidden] = useState(Boolean(app.hidden));

  const handleSave = () => {
    audioEngine.playClick(950, 'sine', 0.04);
    onSave(app.id, {
      customLabel: name.trim() || app.name,
      customColor: color,
      customIcon: icon,
      hidden,
    });
    onClose();
  };

  const handleReset = () => {
    setName(app.name);
    setColor(app.defaultColor);
    setIcon(app.iconName);
    setHidden(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950">
          <h3 className="text-sm font-bold text-white">Customize {app.name}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center py-3 bg-neutral-950/60 rounded-2xl border border-neutral-800">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mb-2"
              style={{ backgroundColor: color }}
            >
              {React.createElement((LucideIcons as any)[icon] || LucideIcons.AppWindow, { size: 26 })}
            </div>
            <span className="text-xs font-semibold text-white">{name || app.name}</span>
            <span className="text-[10px] text-neutral-500 font-mono mt-0.5">{app.packageName}</span>
          </div>

          {/* Edit Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">App Label</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950 text-xs px-3 py-2 rounded-xl border border-neutral-700 text-white focus:outline-none"
            />
          </div>

          {/* Color Palette */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Icon Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#6366f1', '#ec4899', '#0ea5e9', '#8b5cf6', '#14b8a6', '#f97316'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white shadow' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-none"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Choose Icon</label>
            <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-neutral-950 rounded-xl border border-neutral-800">
              {AVAILABLE_ICONS.map((iconKey) => {
                const IconComp = (LucideIcons as any)[iconKey] || LucideIcons.AppWindow;
                const isSelected = icon === iconKey;
                return (
                  <button
                    key={iconKey}
                    onClick={() => setIcon(iconKey)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <IconComp size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hide app toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <EyeOff size={14} className="text-neutral-400" />
              <span>Hide in App Drawer</span>
            </div>
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-800 bg-neutral-950">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow"
              style={{ backgroundColor: palette.primary }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
