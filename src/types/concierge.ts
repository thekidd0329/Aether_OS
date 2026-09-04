export type AnchorCategory = 'TASKS' | 'FILES' | 'TOOLS' | 'PEOPLE';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface BriefingItem {
  id: string;
  category: 'calendar' | 'message' | 'task' | 'commute' | 'system' | 'file' | 'project';
  title: string;
  subtitle: string;
  timestamp: string;
  urgency: 'critical' | 'high' | 'medium' | 'normal';
  priorityScore: number; // 0 - 100, higher places closer to 6 o'clock thumb zone
  targetAnchor: AnchorCategory;
  actionLabel: string;
  secondaryActionLabel?: string;
  provider: string;
  iconName: string;
  deepPayload?: {
    personId?: string;
    fileId?: string;
    taskId?: string;
    toolId?: string;
    extraNote?: string;
  };
}

export interface MicroStateContext {
  timeOfDay: TimeOfDay;
  greeting: string;
  attentionCount: number;
  attentionSummary: string;
  location: string;
  batteryLevel: number;
  batteryState: 'charging' | 'discharging' | 'optimal';
  weatherTemp: string;
  weatherCondition: string;
  networkBand: string;
  signalLatencyMs: number;
  activeSignalsCount: number;
  isSimulatedEmergency?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  context: string;
  dueTime: string;
  priority: 'p1' | 'p2' | 'p3';
  completed: boolean;
  category: 'academic' | 'work' | 'financial' | 'communication' | 'personal';
  actionType: 'navigate' | 'pay' | 'reply' | 'code' | 'call' | 'upload' | 'review';
  provider: string;
  deepLinkName: string;
  estimatedMinutes?: number;
}

export interface DigitalObject {
  id: string;
  name: string;
  extension: 'pdf' | 'fig' | 'png' | 'mp4' | 'ts' | 'wav' | 'csv' | 'zip' | 'docx';
  size: string;
  modified: string;
  sourceProvider: 'Google Drive' | 'Local Downloads' | 'WhatsApp Media' | 'Figma Cloud' | 'Aether Voice Memos' | 'GitHub Repos' | 'Slack Export';
  tags: string[];
  thumbnailType: 'document' | 'image' | 'code' | 'audio' | 'archive' | 'vector';
  contentSnippet?: string;
  associatedPerson?: string;
  fileDataUrl?: string;
}

export interface InstalledTool {
  id: string;
  name: string;
  providerApp: string;
  category: string;
  iconName: string;
  isInteractiveMiniApp: boolean;
  description: string;
  recentUse: string;
  quickActionTitle: string;
}

export interface ToolCluster {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  totalInstalledAppsInCluster: number;
  tools: InstalledTool[];
  clusterAccent: string;
}

export interface BarometerTelemetry {
  pressureHpa: number;
  altitudeMeters: number;
  pressureTrend: 'rising' | 'steady' | 'falling';
  deltaElevMeters: number;
}

export interface MagnetometerTelemetry {
  xMicroTesla: number;
  yMicroTesla: number;
  zMicroTesla: number;
  totalFlux: number;
  headingAzimuth: number;
  compassBearing: string;
  accuracy: 'high' | 'medium' | 'uncalibrated';
}

export interface MotionTelemetry {
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  gForce: number;
  pitchDeg: number;
  rollDeg: number;
}

export interface RamTelemetry {
  totalGb: number;
  usedGb: number;
  freeGb: number;
  cachedGb: number;
  dirtyPagesMb: number;
  timeSeries: number[];
}

export interface ThermalTelemetry {
  cpuClusterPrimeC: number;
  cpuClusterMidC: number;
  cpuClusterEfficiencyC: number;
  gpuC: number;
  tpuNpuC: number;
  batteryC: number;
  throttlingState: 'optimal' | 'moderate' | 'throttled';
  thermalHeadroomPercent: number;
}

export interface SystemProcessNode {
  pid: number;
  name: string;
  cpuPercent: number;
  ramMb: number;
  priority: string;
  threadsCount: number;
  state: 'running' | 'sleeping' | 'isolated';
}

export interface FileSecurityPermissionState {
  status: 'granted' | 'scoped_saf' | 'revoked';
  tokenAccessRevoked: boolean;
  zeroCloudTelemetry: boolean;
  scopedDirectory: string;
  noCombingVerified: boolean;
  isolationLevel: 'Hardware Enclave' | 'App Sandbox' | 'Unrestricted';
}


export interface PersonIdentityResolver {
  messenger?: string;
  sms?: string;
  snapchat?: string;
  discord?: string;
  email?: string;
  instagram?: string;
  signal?: string;
  phone?: string;
  github?: string;
}

export interface InteractionRecord {
  id: string;
  channel: 'Messenger' | 'SMS' | 'Discord' | 'Email' | 'Phone' | 'Snapchat' | 'Signal';
  direction: 'inbound' | 'outbound';
  timestamp: string;
  snippet: string;
  mediaType?: 'text' | 'image' | 'audio' | 'file';
  badge?: string;
}

export interface PersonProfile {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarColor: string;
  avatarUrl?: string;
  initials: string;
  affinityScore: number;
  status: 'online' | 'busy' | 'offline' | 'traveling';
  statusMessage: string;
  identities: PersonIdentityResolver;
  recentInteractions: InteractionRecord[];
  pendingAction?: string;
}
