import React, { useState } from 'react';
import { WidgetType, MonetPalette } from '../../types';
import {
  Clock,
  CloudSun,
  Music,
  Activity,
  FileText,
  CheckSquare,
  Search,
  Quote,
  Sparkles,
  X,
  Plus
} from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface WidgetGalleryModalProps {
  palette: MonetPalette;
  onAddWidget: (type: WidgetType, colSpan: number, rowSpan: number) => void;
  onClose: () => void;
}

interface WidgetTemplate {
  type: WidgetType;
  title: string;
  category: string;
  icon: any;
  defaultCol: number;
  defaultRow: number;
  description: string;
}

export const WidgetGalleryModal: React.FC<WidgetGalleryModalProps> = ({
  palette,
  onAddWidget,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<WidgetType>('weather_forecast');
  const [colSpan, setColSpan] = useState(2);
  const [rowSpan, setRowSpan] = useState(2);

  const widgets: WidgetTemplate[] = [
    {
      type: 'at_a_glance',
      title: 'At a Glance',
      category: 'Smart / Essential',
      icon: Sparkles,
      defaultCol: 4,
      defaultRow: 1,
      description: 'Material You smart pill displaying live time, calendar reminders, and dynamic weather.',
    },
    {
      type: 'analog_clock',
      title: 'Analog Clock',
      category: 'Time & Date',
      icon: Clock,
      defaultCol: 2,
      defaultRow: 2,
      description: 'Smooth ticking analog clock with Material You flower and Bauhaus styling options.',
    },
    {
      type: 'digital_clock',
      title: 'Digital Clock',
      category: 'Time & Date',
      icon: Clock,
      defaultCol: 4,
      defaultRow: 2,
      description: 'High-visibility digital clock with battery percentage, full date, and alarm status.',
    },
    {
      type: 'weather_forecast',
      title: 'Weather Radar',
      category: 'Weather',
      icon: CloudSun,
      defaultCol: 2,
      defaultRow: 2,
      description: 'Real-time temperature, condition icon, humidity, wind velocity, and high/low stats.',
    },
    {
      type: 'music_player',
      title: 'Lo-Fi Music Synthesizer',
      category: 'Media',
      icon: Music,
      defaultCol: 4,
      defaultRow: 2,
      description: 'Active audio synthesizer playing ambient lo-fi synth loops with waveform visualizer.',
    },
    {
      type: 'system_monitor',
      title: 'System Diagnostics',
      category: 'Utilities',
      icon: Activity,
      defaultCol: 4,
      defaultRow: 2,
      description: 'Real-time CPU telemetry load graph, RAM utilization meter, and SoC temperature.',
    },
    {
      type: 'quick_notes',
      title: 'Sticky Scratchpad',
      category: 'Productivity',
      icon: FileText,
      defaultCol: 2,
      defaultRow: 2,
      description: 'Directly editable sticky note on the home screen with auto-save.',
    },
    {
      type: 'quick_tasks',
      title: 'Tasks Checklist',
      category: 'Productivity',
      icon: CheckSquare,
      defaultCol: 2,
      defaultRow: 2,
      description: 'Interactive checklist widget with instant checkmarks and fast task addition.',
    },
    {
      type: 'search_bar',
      title: 'Search Bar',
      category: 'Smart / Essential',
      icon: Search,
      defaultCol: 4,
      defaultRow: 1,
      description: 'Pill search bar with Google Assistant mic and camera Lens shortcuts.',
    },
    {
      type: 'step_fitness',
      title: 'Activity Rings',
      category: 'Health',
      icon: Activity,
      defaultCol: 4,
      defaultRow: 2,
      description: 'Circular progress activity rings tracking daily steps, active minutes, and calories.',
    },
    {
      type: 'quote_card',
      title: 'Daily Inspiration',
      category: 'Lifestyle',
      icon: Quote,
      defaultCol: 4,
      defaultRow: 1,
      description: 'Handcrafted inspirational quotes and daily motivation reflections.',
    },
  ];

  const currentTemplate = widgets.find((w) => w.type === selectedType) || widgets[0];

  const handleAdd = () => {
    audioEngine.playClick(900, 'sine', 0.05);
    onAddWidget(selectedType, colSpan, rowSpan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-lg h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: palette.primary }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Widget Catalog</h3>
              <p className="text-[11px] text-neutral-400">Choose and resize interactive widgets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Split list + preview) */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Widget list */}
          <div className="w-full sm:w-1/2 overflow-y-auto p-3 space-y-1.5 border-r border-neutral-800 bg-neutral-900/50">
            {widgets.map((w) => {
              const Icon = w.icon;
              const isSelected = selectedType === w.type;
              return (
                <button
                  key={w.type}
                  onClick={() => {
                    audioEngine.playClick(800, 'sine', 0.02);
                    setSelectedType(w.type);
                    setColSpan(w.defaultCol);
                    setRowSpan(w.defaultRow);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/80 text-white'
                      : 'hover:bg-neutral-800/60 border border-transparent text-neutral-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? palette.primary : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? palette.onPrimary || '#fff' : '#ffffff',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold truncate">{w.title}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{w.category}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details & Size Picker */}
          <div className="w-full sm:w-1/2 p-5 flex flex-col justify-between bg-neutral-950/60">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                  {currentTemplate.category}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{currentTemplate.title}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                  {currentTemplate.description}
                </p>
              </div>

              {/* Dimensions selection */}
              <div className="bg-neutral-900 p-3.5 rounded-2xl border border-neutral-800 space-y-3">
                <span className="text-xs font-semibold text-white block">Placement Dimensions</span>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Grid Width (Cols)</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColSpan(c)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold ${
                          colSpan === c ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Grid Height (Rows)</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRowSpan(r)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold ${
                          rowSpan === r ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white shadow-lg hover:opacity-95 transition-all mt-4"
              style={{ backgroundColor: palette.primary }}
            >
              <Plus size={16} />
              <span>Add Widget ({colSpan}x{rowSpan})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
