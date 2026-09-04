import React from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { WidgetContainer } from './WidgetContainer';
import { AtAGlanceWidget } from './AtAGlanceWidget';
import { AnalogClockWidget } from './AnalogClockWidget';
import { DigitalClockWidget } from './DigitalClockWidget';
import { WeatherWidget } from './WeatherWidget';
import { MusicWidget } from './MusicWidget';
import { SystemMonitorWidget } from './SystemMonitorWidget';
import { QuickNotesWidget } from './QuickNotesWidget';
import { QuickTasksWidget } from './QuickTasksWidget';
import { SearchBarWidget } from './SearchBarWidget';
import { FitnessWidget } from './FitnessWidget';
import { QuoteWidget } from './QuoteWidget';

interface WidgetRendererProps {
  widget: WidgetItem;
  palette: MonetPalette;
  isEditMode?: boolean;
  onDelete?: () => void;
  onResize?: () => void;
  onOpenApp?: (appId: string) => void;
  onSearch?: (query: string) => void;
  onUpdateNote?: (note: string) => void;
  onUpdateTasks?: (tasks: { id: string; text: string; completed: boolean }[]) => void;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  palette,
  isEditMode = false,
  onDelete,
  onResize,
  onOpenApp,
  onSearch,
  onUpdateNote,
  onUpdateTasks,
}) => {
  const renderContent = () => {
    switch (widget.type) {
      case 'at_a_glance':
        return (
          <AtAGlanceWidget
            widget={widget}
            palette={palette}
            onOpenWeather={() => onOpenApp?.('weather')}
            onOpenCalendar={() => onOpenApp?.('calendar')}
          />
        );
      case 'analog_clock':
        return (
          <AnalogClockWidget
            widget={widget}
            palette={palette}
            onOpenClock={() => onOpenApp?.('clock')}
          />
        );
      case 'digital_clock':
        return (
          <DigitalClockWidget
            widget={widget}
            palette={palette}
            onOpenClock={() => onOpenApp?.('clock')}
          />
        );
      case 'weather_forecast':
        return (
          <WeatherWidget
            widget={widget}
            palette={palette}
            onOpenWeather={() => onOpenApp?.('weather')}
          />
        );
      case 'music_player':
        return (
          <MusicWidget
            widget={widget}
            palette={palette}
            onOpenMusic={() => onOpenApp?.('music')}
          />
        );
      case 'system_monitor':
        return (
          <SystemMonitorWidget
            widget={widget}
            palette={palette}
          />
        );
      case 'quick_notes':
        return (
          <QuickNotesWidget
            widget={widget}
            palette={palette}
            onUpdateNote={onUpdateNote}
          />
        );
      case 'quick_tasks':
        return (
          <QuickTasksWidget
            widget={widget}
            palette={palette}
            onUpdateTasks={onUpdateTasks}
          />
        );
      case 'search_bar':
        return (
          <SearchBarWidget
            widget={widget}
            palette={palette}
            onSearch={onSearch}
            onOpenAssistant={() => onOpenApp?.('settings')}
            onOpenLens={() => onOpenApp?.('camera')}
          />
        );
      case 'step_fitness':
        return (
          <FitnessWidget
            widget={widget}
            palette={palette}
            onOpenFitness={() => onOpenApp?.('fitness')}
          />
        );
      case 'quote_card':
        return (
          <QuoteWidget
            widget={widget}
            palette={palette}
          />
        );
      default:
        return (
          <div className="text-xs text-white/70 p-2">
            Widget: {widget.title}
          </div>
        );
    }
  };

  return (
    <WidgetContainer
      widget={widget}
      palette={palette}
      isEditMode={isEditMode}
      onDelete={onDelete}
      onResize={onResize}
    >
      {renderContent()}
    </WidgetContainer>
  );
};
