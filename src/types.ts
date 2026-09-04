export type IconShape = 'circle' | 'squircle' | 'rounded' | 'square' | 'teardrop' | 'pebble' | 'hexagon';

export type IconPack = 
  | 'material_you' 
  | 'pixel_minimal' 
  | 'cyberpunk' 
  | 'glass' 
  | 'retro_pixel' 
  | 'nothing_os' 
  | 'mono_dark' 
  | 'pastel';

export type ThemeMode = 'dark' | 'light' | 'amoled' | 'cyberpunk' | 'solarized';

export type NavStyle = 'gesture_pill' | '3_button' | 'hidden';

export type StatusBarStyle = 'default' | 'minimal' | 'bold' | 'dynamic_island';

export type PageTransition = 'slide' | 'cube' | 'stack' | 'fade' | 'zoom' | 'accordion';

export type AppCategory = 'All' | 'Favorites' | 'Productivity' | 'Media' | 'Tools' | 'Social' | 'Games' | 'System';

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: AppCategory;
  iconName: string; // lucide icon identifier
  defaultColor: string;
  badgeCount?: number;
  hidden?: boolean;
  customLabel?: string;
  customColor?: string;
  customIcon?: string;
}

export type WidgetType = 
  | 'at_a_glance'
  | 'analog_clock'
  | 'digital_clock'
  | 'weather_forecast'
  | 'music_player'
  | 'system_monitor'
  | 'quick_notes'
  | 'quick_tasks'
  | 'search_bar'
  | 'step_fitness'
  | 'quote_card'
  | 'app_folder'
  | 'custom_photo';

export interface WidgetItem {
  id: string;
  type: WidgetType;
  title: string;
  colSpan: number;
  rowSpan: number;
  x: number;
  y: number;
  pageIndex: number;
  settings: {
    bgOpacity?: number;
    blur?: number;
    borderRadius?: number;
    accentColor?: string;
    textColor?: string;
    showTitle?: boolean;
    clockFace?: 'modern' | 'minimal' | 'bauhaus' | 'material_flower';
    noteContent?: string;
    tasks?: { id: string; text: string; completed: boolean }[];
    folderAppIds?: string[];
    photoUrl?: string;
    quoteText?: string;
    quoteAuthor?: string;
  };
}

export interface GridItemPlacement {
  id: string;
  type: 'app' | 'widget' | 'folder';
  appId?: string;
  widgetId?: string;
  folderId?: string;
  pageIndex: number;
  x: number;
  y: number;
  colSpan: number;
  rowSpan: number;
}

export interface FolderItem {
  id: string;
  name: string;
  appIds: string[];
  color?: string;
  iconName?: string;
}

export interface WallpaperPreset {
  id: string;
  name: string;
  category: 'Abstract' | 'Minimal' | 'Cyberpunk' | 'Nature' | 'AMOLED' | 'Anime' | 'Gradient';
  url: string;
  thumbnail: string;
  monetSeed: string;
  isLive?: boolean;
  liveType?: 'particles' | 'mesh_gradient' | 'cyber_matrix' | 'aurora';
}

export interface MonetPalette {
  seed: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  surface: string;
  surfaceContainer: string;
  onSurface: string;
  outline: string;
  accent: string;
}

export interface LauncherConfig {
  // Grid
  gridColumns: number; // 3 - 7
  gridRows: number; // 4 - 9
  gridPadding: number; // 0 - 32px
  allowSubgrid: boolean;

  // Dock
  dockEnabled: boolean;
  dockColumns: number; // 3 - 7
  dockAppIds: string[];
  dockGlassBackground: boolean;
  dockScale: number; // 0.8 - 1.2

  // Icons
  iconSize: number; // 60 - 150 (%)
  iconShape: IconShape;
  iconPack: IconPack;
  showLabels: boolean;
  labelFontSize: number; // 10 - 16 (px)
  labelColor: string;
  labelShadow: boolean;
  fontFamily: 'Outfit' | 'Plus Jakarta Sans' | 'Space Grotesk' | 'JetBrains Mono';
  badgeStyle: 'numeric' | 'dots' | 'none';
  badgeColor: string;

  // Theme & Wallpaper
  themeMode: ThemeMode;
  monetSeed: string;
  wallpaperId: string;
  customWallpaperUrl?: string;
  wallpaperBlur: number; // 0 - 30px
  wallpaperDim: number; // 0 - 80%
  liveWallpaper: boolean;
  liveWallpaperType: 'particles' | 'mesh_gradient' | 'cyber_matrix' | 'aurora' | 'none';

  // Gestures & Animations
  pageTransition: PageTransition;
  swipeDownAction: 'quick_settings' | 'search' | 'notifications';
  swipeUpAction: 'app_drawer';
  doubleTapAction: 'screen_lock' | 'settings' | 'camera';
  hapticFeedback: boolean;
  soundEffects: boolean;

  // System UI
  showStatusBar: boolean;
  statusBarStyle: StatusBarStyle;
  showBatteryPercentage: boolean;
  networkType: '5G' | 'Wi-Fi' | 'LTE';
  navStyle: NavStyle;

  // Chassis / Device Simulator
  deviceChassis: 'pixel9_obsidian' | 'pixel9_porcelain' | 'galaxy_titanium' | 'iphone_midnight' | 'fullscreen';
  deviceScale: number;
}

export interface PresetProfile {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  config: Partial<LauncherConfig>;
  widgets?: WidgetItem[];
  placements?: GridItemPlacement[];
  folders?: FolderItem[];
}
