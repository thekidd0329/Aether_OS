/**
 * Aether OS Real Context Types & Interfaces
 * Captures live hardware telemetry, notification streams, calendar schedules,
 * file system objects, contacts, and AI relevance synthesized structure.
 */

export interface LiveDeviceState {
  batteryLevel: number;
  isCharging: boolean;
  networkType: string;
  isOnline: boolean;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  speedMps?: number;
}

export interface LiveNotificationItem {
  id: string;
  packageName: string;
  title: string;
  text: string;
  subText?: string;
  postTime: number;
  isOngoing: boolean;
  category?: string;
}

export interface LiveCalendarEvent {
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
  location?: string;
}

export interface LiveRecentFile {
  name: string;
  mimeType: string;
  dateModified: number;
  size: number;
}

export interface LiveContact {
  id: string;
  name: string;
  starred: boolean;
  phone?: string;
  email?: string;
}

export interface LiveAppUsage {
  packageName: string;
  lastUsed: number;
}

export interface LaunchableApp {
  packageName: string;
  label: string;
  iconDataUrl?: string;
}

export interface RawContextBundle {
  deviceState: LiveDeviceState;
  notificationListenerActive: boolean;
  notifications: LiveNotificationItem[];
  calendarEvents: LiveCalendarEvent[];
  recentFiles: LiveRecentFile[];
  contacts: LiveContact[];
  recentApps: LiveAppUsage[];
}

export interface SynthesizedRelevanceFeed {
  now: {
    title: string;
    subtitle: string;
    actionLabel?: string;
    source: 'notification' | 'calendar' | 'commute' | 'system' | 'task';
    urgency: 'critical' | 'high' | 'normal';
    packageName?: string;
  }[];
  next: {
    title: string;
    subtitle: string;
    timeDelta: string;
    source: string;
  }[];
  dontForget: {
    title: string;
    context: string;
    dueDate?: string;
  }[];
  people: {
    name: string;
    context: string;
    channel: string;
    packageName?: string;
  }[];
  summary: string;
  rawSignalCount: number;
  synthesizedAt: number;
  engine: 'AICore-Gemini-Nano' | 'Aether-Local-Heuristics';
}
