import React, { useState, useEffect, useMemo } from 'react';
import {
  AnchorCategory,
  BriefingItem,
  MicroStateContext,
  TaskItem,
  DigitalObject,
  ToolCluster,
  PersonProfile,
  InstalledTool,
  TimeOfDay,
} from './types/concierge';
import {
  INITIAL_MICRO_CONTEXT,
  DEFAULT_BRIEFING_ITEMS,
  INITIAL_TASKS,
  INITIAL_FILES,
  INITIAL_TOOL_CLUSTERS,
  INITIAL_PEOPLE,
} from './data/conciergeData';
import { audioEngine } from './utils/audioEngine';

import { Pixel10ProShell } from './components/chassis/Pixel10ProShell';
import { LockscreenView } from './components/lock/LockscreenView';
import { BriefingAperture } from './components/ephemeral/BriefingAperture';
import { PermanentConcierge } from './components/permanent/PermanentConcierge';
import { TensorSignalsInspector } from './components/inspector/TensorSignalsInspector';
import { QuickSettingsOverlay, SystemNotificationsOverlay } from './components/system/QuickSettingsAndNotifications';
import { GoogleSuitePortal } from './components/google/GoogleSuitePortal';
import { MarkGpsEngine } from './components/tools/MarkGpsEngine';
import { SentinelFirewallAndSyslog } from './components/tools/SentinelFirewallAndSyslog';
import { PermissionsAuditBroker } from './components/system/PermissionsAuditBroker';
import { CyberDeveloperHudOverlay } from './components/effects/CyberDeveloperHudOverlay';
import { ApkPackagingModal } from './components/system/ApkPackagingModal';

import { collectRawContext } from './services/deviceContextCollector';
import { synthesizeContextWithGemini, buildLocalHeuristicRelevance } from './services/relevanceSynthesizer';
import { RawContextBundle, SynthesizedRelevanceFeed } from './types/realContext';

const STORAGE_KEY_TASKS = 'aether_os_tasks_v1';
const STORAGE_KEY_FILES = 'aether_os_files_v1';
const STORAGE_KEY_PEOPLE = 'aether_os_people_v1';

export default function App() {
  // Runtime State
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isEphemeralBriefing, setIsEphemeralBriefing] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('evening');
  const [activeAnchor, setActiveAnchor] = useState<AnchorCategory>('CONCIERGE');
  const [isSignalsInspectorOpen, setIsSignalsInspectorOpen] = useState<boolean>(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [npuActive, setNpuActive] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // New In-OS Overlays & Modals
  const [isGoogleSuiteOpen, setIsGoogleSuiteOpen] = useState<boolean>(false);
  const [googleSuiteInitialTab, setGoogleSuiteInitialTab] = useState<'messages' | 'phone' | 'maps' | 'gmail' | 'drive' | 'keep' | 'youtube' | 'meet'>('messages');
  const [isMockGpsOpen, setIsMockGpsOpen] = useState<boolean>(false);
  const [isFirewallOpen, setIsFirewallOpen] = useState<boolean>(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState<boolean>(false);
  const [isCyberHudActive, setIsCyberHudActive] = useState<boolean>(true);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);

  // Micro-state context derived from time of day
  const context = useMemo(() => {
    return INITIAL_MICRO_CONTEXT[timeOfDay];
  }, [timeOfDay]);

  // Briefing items
  const [briefingItems, setBriefingItems] = useState<BriefingItem[]>(DEFAULT_BRIEFING_ITEMS);

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });

  // Files state
  const [files, setFiles] = useState<DigitalObject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FILES;
  });

  // People state
  const [people, setPeople] = useState<PersonProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PEOPLE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PEOPLE;
  });

  // Real Android Context & AICore Synthesis State
  const [rawContext, setRawContext] = useState<RawContextBundle | null>(null);
  const [relevanceFeed, setRelevanceFeed] = useState<SynthesizedRelevanceFeed | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const fetchAndSynthesizeRelevance = async () => {
    try {
      setIsSynthesizing(true);
      const raw = await collectRawContext();
      setRawContext(raw);
      const feed = await synthesizeContextWithGemini(raw, tasks);
      setRelevanceFeed(feed);
    } catch (err) {
      console.warn('Relevance synthesis error:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  useEffect(() => {
    fetchAndSynthesizeRelevance();
    const interval = setInterval(fetchAndSynthesizeRelevance, 30000); // 30s background scan
    return () => clearInterval(interval);
  }, [tasks]);

  // Persist modifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
    } catch {}
  }, [files]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PEOPLE, JSON.stringify(people));
    } catch {}
  }, [people]);

  // Audio mute sync
  useEffect(() => {
    audioEngine.setEnabled(isSoundEnabled);
  }, [isSoundEnabled]);

  // Handler: Lock / Unlock phone
  const handleToggleLock = () => {
    if (isLocked) {
      audioEngine.playUnlock();
      setIsLocked(false);
      setIsEphemeralBriefing(true);
      setIsQuickSettingsOpen(false);
      setIsNotificationsOpen(false);
    } else {
      audioEngine.playLockSound();
      setIsLocked(true);
      setIsQuickSettingsOpen(false);
      setIsNotificationsOpen(false);
    }
  };

  // Handler: Unlock from lockscreen
  const handleUnlockFromLockscreen = () => {
    setIsLocked(false);
    setIsEphemeralBriefing(true);
    setIsQuickSettingsOpen(false);
    setIsNotificationsOpen(false);
  };

  // Handler: Dismiss Briefing Aperture to Permanent Layer
  const handleDismissBriefing = () => {
    setIsEphemeralBriefing(false);
  };

  // Handler: Pull down Briefing Aperture from Permanent Layer
  const handlePullDownBriefing = () => {
    setIsEphemeralBriefing(true);
  };

  // Handler: Swipe down to open quick settings
  const handleOpenQuickSettings = () => {
    audioEngine.playOrbitalTick(600);
    setIsQuickSettingsOpen(true);
  };

  // Handler: Swipe up from drawer to open system notifications
  const handleOpenNotifications = () => {
    audioEngine.playOrbitalTick(1200);
    setIsNotificationsOpen(true);
  };

  // Handler: Resolve / complete briefing item
  const handleResolveBriefingItem = (itemId: string) => {
    setBriefingItems((prev) => prev.filter((b) => b.id !== itemId));
  };

  // Handler: Navigate directly from briefing to one of the 4 anchors
  const handleNavigateToAnchor = (anchor: AnchorCategory) => {
    setActiveAnchor(anchor);
    setIsEphemeralBriefing(false);
  };

  // Handler: Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Handler: Add task
  const handleAddTask = (newTask: Partial<TaskItem>) => {
    setTasks((prev) => [newTask as TaskItem, ...prev]);
  };

  // Handler: Execute Deep Action on Task
  const handleExecuteDeepAction = (task: TaskItem) => {
    audioEngine.playActionExecute();
    if (task.category === 'academic') {
      setActiveAnchor('TOOLS');
    } else if (task.category === 'communication') {
      setActiveAnchor('PEOPLE');
    } else if (task.category === 'financial') {
      setActiveAnchor('TOOLS');
    }
  };

  // Handler: Share file to person
  const handleShareToPerson = (file: DigitalObject, personName: string) => {
    const targetPerson = people.find((p) => p.name.includes(personName)) || people[0];
    const newInteraction = {
      id: `int_${Date.now()}`,
      channel: 'Messenger' as const,
      direction: 'outbound' as const,
      timestamp: 'Just now',
      snippet: `Shared digital object: ${file.name} (${file.size})`,
      mediaType: 'file' as const,
    };

    setPeople((prev) =>
      prev.map((p) =>
        p.id === targetPerson.id
          ? { ...p, recentInteractions: [newInteraction, ...p.recentInteractions] }
          : p
      )
    );
    setActiveAnchor('PEOPLE');
  };

  // Handler: Send Message to Person
  const handleSendMessage = (personId: string, text: string, channel: string) => {
    const newInteraction = {
      id: `int_${Date.now()}`,
      channel: channel as any,
      direction: 'outbound' as const,
      timestamp: 'Just now',
      snippet: text,
      mediaType: 'text' as const,
    };

    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId
          ? { ...p, recentInteractions: [newInteraction, ...p.recentInteractions] }
          : p
      )
    );

    setTimeout(() => {
      const replyInteraction = {
        id: `int_reply_${Date.now()}`,
        channel: channel as any,
        direction: 'inbound' as const,
        timestamp: 'Just now',
        snippet: `Received on ${channel}. Tensor vector verified.`,
        mediaType: 'text' as const,
      };

      setPeople((prev) =>
        prev.map((p) =>
          p.id === personId
            ? { ...p, recentInteractions: [replyInteraction, ...p.recentInteractions] }
            : p
        )
      );
      audioEngine.playOrbitalTick(1400);
    }, 2000);
  };

  // Handler: Launch Tools (intercepts Google Suite, GPS spoofer, Firewall, etc.)
  const handleLaunchTool = (tool: InstalledTool) => {
    audioEngine.playActionExecute();
    if (tool.id === 'tool_google_messages') {
      setGoogleSuiteInitialTab('messages');
      setIsGoogleSuiteOpen(true);
    } else if (tool.id === 'tool_google_phone') {
      setGoogleSuiteInitialTab('phone');
      setIsGoogleSuiteOpen(true);
    } else if (tool.id === 'tool_google_maps') {
      setGoogleSuiteInitialTab('maps');
      setIsGoogleSuiteOpen(true);
    } else if (tool.id === 'tool_gmail_inbox') {
      setGoogleSuiteInitialTab('gmail');
      setIsGoogleSuiteOpen(true);
    } else if (tool.id === 'tool_mark_gps_spoofer' || tool.id === 'tool_gnss_satellites') {
      setIsMockGpsOpen(true);
    } else if (tool.id === 'tool_sentinel_firewall' || tool.id === 'tool_kernel_syslog') {
      setIsFirewallOpen(true);
    }
  };

  const handleOpenGoogleSuite = (tab?: 'messages' | 'phone' | 'maps' | 'gmail' | 'drive' | 'keep' | 'youtube' | 'meet') => {
    if (tab) setGoogleSuiteInitialTab(tab);
    setIsGoogleSuiteOpen(true);
  };

  return (
    <Pixel10ProShell
      isLocked={isLocked}
      isEphemeralBriefing={isEphemeralBriefing}
      timeOfDay={timeOfDay}
      isSoundEnabled={isSoundEnabled}
      isFullscreen={isFullscreen}
      onToggleLock={handleToggleLock}
      onToggleBriefing={() => setIsEphemeralBriefing(!isEphemeralBriefing)}
      onChangeTimeOfDay={(tod) => {
        audioEngine.playCategorySwitch();
        setTimeOfDay(tod);
      }}
      onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
      onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      onOpenSignalsInspector={() => setIsSignalsInspectorOpen(true)}
      onOpenGoogleSuite={() => handleOpenGoogleSuite('messages')}
      onOpenMockGps={() => setIsMockGpsOpen(true)}
      onOpenFirewall={() => setIsFirewallOpen(true)}
      onOpenPermissions={() => setIsPermissionsOpen(true)}
      onOpenApkModal={() => setIsApkModalOpen(true)}
      onToggleCyberHud={() => setIsCyberHudActive(!isCyberHudActive)}
      isCyberHudActive={isCyberHudActive}
    >
      {/* 1. LOCKSCREEN LAYER */}
      {isLocked ? (
        <LockscreenView
          context={context}
          onUnlock={handleUnlockFromLockscreen}
        />
      ) : isEphemeralBriefing ? (
        /* 2. EPHEMERAL LAYER: THE UNLOCK BRIEFING APERTURE */
        <BriefingAperture
          context={context}
          items={briefingItems}
          onDismissToConcierge={handleDismissBriefing}
          onNavigateToAnchor={handleNavigateToAnchor}
          onResolveItem={handleResolveBriefingItem}
          onOpenSignalsInspector={() => setIsSignalsInspectorOpen(true)}
          onSwipeDownQuickSettings={handleOpenQuickSettings}
        />
      ) : (
        /* 3. PERMANENT LAYER: TASKS · FILES · TOOLS · PEOPLE · CONCIERGE */
        <PermanentConcierge
          activeAnchor={activeAnchor}
          context={context}
          tasks={tasks}
          files={files}
          toolClusters={INITIAL_TOOL_CLUSTERS}
          people={people}
          relevanceFeed={relevanceFeed || undefined}
          rawContext={rawContext || undefined}
          onRefreshRelevance={fetchAndSynthesizeRelevance}
          isRefreshingRelevance={isSynthesizing}
          onSelectAnchor={setActiveAnchor}
          onPullDownBriefing={handlePullDownBriefing}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onExecuteDeepAction={handleExecuteDeepAction}
          onSelectFile={() => {}}
          onShareToPerson={handleShareToPerson}
          onLaunchTool={handleLaunchTool}
          onSendMessage={handleSendMessage}
          onOpenSignalsInspector={() => setIsSignalsInspectorOpen(true)}
          onSwipeUpNotifications={handleOpenNotifications}
          onSwipeDownQuickSettings={handleOpenQuickSettings}
          onOpenGoogleSuite={() => handleOpenGoogleSuite('messages')}
          onOpenMockGps={() => setIsMockGpsOpen(true)}
          onOpenFirewall={() => setIsFirewallOpen(true)}
          onOpenPermissions={() => setIsPermissionsOpen(true)}
        />
      )}

      {/* 4. QUICK SETTINGS OVERLAY (SWIPE DOWN GESTURE) */}
      <QuickSettingsOverlay
        isOpen={isQuickSettingsOpen}
        onClose={() => setIsQuickSettingsOpen(false)}
        npuActive={npuActive}
        onToggleNpu={() => setNpuActive(!npuActive)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* 5. SYSTEM NOTIFICATIONS OVERLAY (DOUBLE-SWIPE UP GESTURE) */}
      <SystemNotificationsOverlay
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onResolveItem={handleResolveBriefingItem}
      />

      {/* 6. TENSOR MICRO-STATE RELEVANCE ENGINE INSPECTOR */}
      {isSignalsInspectorOpen && (
        <TensorSignalsInspector
          context={context}
          onClose={() => setIsSignalsInspectorOpen(false)}
        />
      )}

      {/* 7. UNIFIED GOOGLE APPS SUITE (SMS, PHONE, MAPS, GMAIL, DRIVE, KEEP) */}
      <GoogleSuitePortal
        isOpen={isGoogleSuiteOpen}
        onClose={() => setIsGoogleSuiteOpen(false)}
        initialTab={googleSuiteInitialTab}
      />

      {/* 8. MARK GPS & GNSS TELEMETRY SPOOFER */}
      <MarkGpsEngine
        isOpen={isMockGpsOpen}
        onClose={() => setIsMockGpsOpen(false)}
      />

      {/* 9. SENTINEL FIREWALL, DPI PACKET INSPECTOR & SYSLOG */}
      <SentinelFirewallAndSyslog
        isOpen={isFirewallOpen}
        onClose={() => setIsFirewallOpen(false)}
      />

      {/* 10. SYSTEM PERMISSIONS AUDIT BROKER */}
      <PermissionsAuditBroker
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />

      {/* 11. CYBER DEVELOPER HUD OVERLAY */}
      <CyberDeveloperHudOverlay
        isVisible={isCyberHudActive}
        onToggle={() => setIsCyberHudActive(!isCyberHudActive)}
        onOpenGoogleSuite={() => handleOpenGoogleSuite('messages')}
        onOpenMockGps={() => setIsMockGpsOpen(true)}
        onOpenFirewall={() => setIsFirewallOpen(true)}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* 12. APK PACKAGING & TURNKEY LAUNCHER HUB */}
      <ApkPackagingModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </Pixel10ProShell>
  );
}

