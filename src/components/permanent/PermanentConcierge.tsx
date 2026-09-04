import React, { useState } from 'react';
import {
  AnchorCategory,
  TaskItem,
  DigitalObject,
  ToolCluster,
  PersonProfile,
  MicroStateContext,
  InstalledTool,
} from '../../types/concierge';
import { TasksAnchorView } from './TasksAnchorView';
import { FilesAnchorView } from './FilesAnchorView';
import { ToolsAnchorView } from './ToolsAnchorView';
import { PeopleAnchorView } from './PeopleAnchorView';
import { RealConciergeRelevanceRenderer } from '../ephemeral/RealConciergeRelevanceRenderer';
import { SynthesizedRelevanceFeed, RawContextBundle } from '../../types/realContext';
import { audioEngine } from '../../utils/audioEngine';
import {
  Sparkles,
  CheckSquare,
  FolderClosed,
  Wrench,
  Users,
  ChevronDown,
  Command,
  Search,
  Bell,
  Cpu,
} from 'lucide-react';

interface PermanentConciergeProps {
  activeAnchor: AnchorCategory;
  context: MicroStateContext;
  tasks: TaskItem[];
  files: DigitalObject[];
  toolClusters: ToolCluster[];
  people: PersonProfile[];
  relevanceFeed?: SynthesizedRelevanceFeed;
  rawContext?: RawContextBundle;
  onRefreshRelevance?: () => void;
  isRefreshingRelevance?: boolean;
  onSelectAnchor: (anchor: AnchorCategory) => void;
  onPullDownBriefing: () => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Partial<TaskItem>) => void;
  onExecuteDeepAction: (task: TaskItem) => void;
  onSelectFile: (file: DigitalObject) => void;
  onShareToPerson: (file: DigitalObject, personName: string) => void;
  onLaunchTool: (tool: InstalledTool) => void;
  onSendMessage: (personId: string, text: string, channel: string) => void;
  onOpenSignalsInspector: () => void;
  onSwipeUpNotifications?: () => void;
  onSwipeDownQuickSettings?: () => void;
  onOpenGoogleSuite?: () => void;
  onOpenMockGps?: () => void;
  onOpenFirewall?: () => void;
  onOpenPermissions?: () => void;
}

export const PermanentConcierge: React.FC<PermanentConciergeProps> = ({
  activeAnchor,
  context,
  tasks,
  files,
  toolClusters,
  people,
  relevanceFeed,
  rawContext,
  onRefreshRelevance,
  isRefreshingRelevance = false,
  onSelectAnchor,
  onPullDownBriefing,
  onToggleTask,
  onAddTask,
  onExecuteDeepAction,
  onSelectFile,
  onShareToPerson,
  onLaunchTool,
  onSendMessage,
  onOpenSignalsInspector,
  onSwipeUpNotifications,
  onSwipeDownQuickSettings,
  onOpenGoogleSuite,
  onOpenMockGps,
  onOpenFirewall,
  onOpenPermissions,
}) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Swipe gesture detection:
  // Swipe down from top header -> Quick Settings
  // Swipe up from bottom nav / dock -> System Notifications
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;

    if (diff > 60 && onSwipeUpNotifications) {
      // Swiped up from bottom -> Trigger Notifications Overlay
      audioEngine.playOrbitalTick(1200);
      onSwipeUpNotifications();
      setTouchStartY(null);
    } else if (diff < -60 && onSwipeDownQuickSettings) {
      // Swiped down from top -> Trigger Quick Settings
      audioEngine.playOrbitalTick(600);
      onSwipeDownQuickSettings();
      setTouchStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  const anchors: { key: AnchorCategory; label: string; icon: any; count: number }[] = [
    { key: 'CONCIERGE', label: 'Concierge', icon: Sparkles, count: relevanceFeed ? relevanceFeed.now.length : 0 },
    { key: 'TASKS', label: 'Tasks', icon: CheckSquare, count: tasks.filter((t) => !t.completed).length },
    { key: 'FILES', label: 'Files', icon: FolderClosed, count: files.length },
    { key: 'TOOLS', label: 'Tools', icon: Wrench, count: 182 },
    { key: 'PEOPLE', label: 'People', icon: Users, count: people.length },
  ];

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* 1. Top Minimalist Telemetry & Pull-Down Briefing Bar */}
      <div className="relative z-10 px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-sky-500/20 bg-slate-950/60 backdrop-blur-md">
        
        {/* Pull Down Ephemeral Briefing Aperture Button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              audioEngine.playBloomOpen();
              onPullDownBriefing();
            }}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 hover:border-sky-400 text-sky-200 transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-[11px] font-mono font-medium tracking-wide">
              Briefing
            </span>
            <ChevronDown className="w-3 h-3 text-sky-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Direct G-Suite Shortcut */}
          {onOpenGoogleSuite && (
            <button
              onClick={() => {
                audioEngine.playOrbitalTick(950);
                onOpenGoogleSuite();
              }}
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-sky-500/30 text-[10px] font-mono text-white hover:border-sky-400"
              title="Open Google Messages, Phone, Maps"
            >
              G-Suite
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mark GPS button */}
          {onOpenMockGps && (
            <button
              onClick={() => {
                audioEngine.playRadarPing();
                onOpenMockGps();
              }}
              className="px-2 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 hover:border-emerald-400"
              title="Mark GPS Spoofer"
            >
              GPS
            </button>
          )}

          {/* Firewall button */}
          {onOpenFirewall && (
            <button
              onClick={() => {
                audioEngine.playOrbitalTick(850);
                onOpenFirewall();
              }}
              className="px-2 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-[10px] font-mono text-sky-300 hover:border-sky-400"
              title="Firewall & Syslog"
            >
              Firewall
            </button>
          )}

          {/* Quick Notifications Button */}
          {onSwipeUpNotifications && (
            <button
              onClick={onSwipeUpNotifications}
              className="p-1 rounded-xl bg-slate-900/80 border border-sky-500/30 text-sky-300 hover:text-sky-100 hover:border-sky-400 transition-colors"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-sky-400" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Active Anchor Viewport */}
      <div className="relative z-10 flex-1 overflow-hidden">
        {activeAnchor === 'CONCIERGE' && relevanceFeed && rawContext && (
          <RealConciergeRelevanceRenderer
            feed={relevanceFeed}
            rawContext={rawContext}
            onRefresh={onRefreshRelevance || (() => {})}
            isRefreshing={isRefreshingRelevance}
          />
        )}

        {activeAnchor === 'TASKS' && (
          <TasksAnchorView
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onExecuteDeepAction={onExecuteDeepAction}
          />
        )}

        {activeAnchor === 'FILES' && (
          <FilesAnchorView
            files={files}
            onSelectFile={onSelectFile}
            onShareToPerson={onShareToPerson}
          />
        )}

        {activeAnchor === 'TOOLS' && (
          <ToolsAnchorView
            clusters={toolClusters}
            onLaunchTool={onLaunchTool}
          />
        )}

        {activeAnchor === 'PEOPLE' && (
          <PeopleAnchorView
            people={people}
            onSendMessage={onSendMessage}
          />
        )}
      </div>

      {/* 3. The Permanent Anchor Pillars Navigation Dock */}
      <div className="relative z-10 px-2 py-2 border-t border-sky-500/20 bg-slate-950/90 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1">
          {anchors.map((item) => {
            const isActive = activeAnchor === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => {
                  audioEngine.playCategorySwitch();
                  onSelectAnchor(item.key);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/20 border border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-100'
                    : 'text-sky-300/60 hover:text-sky-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sky-300' : 'text-slate-400'}`} />
                  {item.count > 0 && (
                    <span
                      className={`absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-mono leading-tight ${
                        isActive
                          ? 'bg-sky-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-sky-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-wider mt-1 ${isActive ? 'font-bold text-sky-200' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
