import React from 'react';
import { audioEngine } from '../../utils/audioEngine';
import {
  Wifi,
  Bluetooth,
  Moon,
  BatteryCharging,
  Cpu,
  Shield,
  Volume2,
  Sliders,
  Bell,
  X,
  Radio,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Smartphone,
} from 'lucide-react';

interface QuickSettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  npuActive: boolean;
  onToggleNpu: () => void;
  onOpenApkModal?: () => void;
}

export const QuickSettingsOverlay: React.FC<QuickSettingsOverlayProps> = ({
  isOpen,
  onClose,
  npuActive,
  onToggleNpu,
  onOpenApkModal,
}) => {
  const [wifi, setWifi] = React.useState(true);
  const [bluetooth, setBluetooth] = React.useState(true);
  const [airplane, setAirplane] = React.useState(false);
  const [darkEnclave, setDarkEnclave] = React.useState(true);
  const [spatialAudio, setSpatialAudio] = React.useState(true);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/92 backdrop-blur-xl animate-in slide-in-from-top duration-300 text-sky-100 p-4 select-none">
      {/* Top Handle & Dismiss */}
      <div className="flex items-center justify-between border-b border-sky-500/30 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-sky-200">
            Pixel 10 Pro Quick Settings
          </span>
        </div>
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(600);
            onClose();
          }}
          className="w-7 h-7 rounded-full bg-slate-900 border border-sky-500/30 flex items-center justify-center text-sky-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Settings Grid */}
      <div className="grid grid-cols-2 gap-2.5 my-4">
        {/* Wi-Fi 7 Tile */}
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(900);
            setWifi(!wifi);
          }}
          className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
            wifi
              ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
              : 'bg-slate-900/80 text-sky-400/60 border-sky-500/20'
          }`}
        >
          <Wifi className="w-5 h-5" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight">Wi-Fi 7 BE</span>
            <span className="text-[10px] opacity-80 font-mono truncate">
              {wifi ? 'QuantumMesh_5G' : 'Disconnected'}
            </span>
          </div>
        </button>

        {/* Tensor G5 NPU Tile */}
        <button
          onClick={() => {
            audioEngine.playActionExecute();
            onToggleNpu();
          }}
          className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
            npuActive
              ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
              : 'bg-slate-900/80 text-emerald-400/60 border-emerald-500/20'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight">Tensor NPU</span>
            <span className="text-[10px] opacity-80 font-mono truncate">
              {npuActive ? '64 TOPS Active' : 'Low Power'}
            </span>
          </div>
        </button>

        {/* Bluetooth 5.4 Tile */}
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(850);
            setBluetooth(!bluetooth);
          }}
          className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
            bluetooth
              ? 'bg-sky-500 text-slate-950 border-sky-400'
              : 'bg-slate-900/80 text-sky-400/60 border-sky-500/20'
          }`}
        >
          <Bluetooth className="w-5 h-5" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight">Bluetooth 5.4</span>
            <span className="text-[10px] opacity-80 font-mono truncate">
              {bluetooth ? 'Pixel Buds Pro 2' : 'Off'}
            </span>
          </div>
        </button>

        {/* DUHBLE Spatial Audio */}
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(1100);
            setSpatialAudio(!spatialAudio);
          }}
          className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
            spatialAudio
              ? 'bg-indigo-400 text-slate-950 border-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.4)]'
              : 'bg-slate-900/80 text-indigo-400/60 border-indigo-500/20'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight">Spatial Audio</span>
            <span className="text-[10px] opacity-80 font-mono truncate">
              {spatialAudio ? 'DUHBLE 3D Head' : 'Stereo'}
            </span>
          </div>
        </button>

        {/* Enclave Security Sandbox */}
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(950);
            setDarkEnclave(!darkEnclave);
          }}
          className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
            darkEnclave
              ? 'bg-sky-400 text-slate-950 border-sky-300'
              : 'bg-slate-900/80 text-sky-400/60 border-sky-500/20'
          }`}
        >
          <Shield className="w-5 h-5" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight">Zero-Token Enclave</span>
            <span className="text-[10px] opacity-80 font-mono truncate">
              {darkEnclave ? 'Titan M3 Secure' : 'Standard'}
            </span>
          </div>
        </button>

        {/* Battery Share */}
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(750);
          }}
          className="p-3 rounded-2xl flex items-center gap-3 border bg-slate-900/80 text-sky-200 border-sky-500/20 text-left"
        >
          <BatteryCharging className="w-5 h-5 text-emerald-400" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight">Battery Share</span>
            <span className="text-[10px] text-sky-400/80 font-mono truncate">
              88% · Qi2 Reverse
            </span>
          </div>
        </button>
      </div>

      {/* Brightness Slider Simulation */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-sky-500/30 flex flex-col gap-2">
        <div className="flex justify-between text-xs font-mono text-sky-300">
          <span>OLED Panel Brightness</span>
          <span>1,850 nits (HDR)</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 relative overflow-hidden">
          <div className="w-[78%] h-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
        </div>
      </div>

      {/* APK Packaging & Deployment Hub Shortcut */}
      {onOpenApkModal && (
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(950);
            onClose();
            onOpenApkModal();
          }}
          className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-sky-500/20 border border-emerald-500/40 hover:border-emerald-300 flex items-center justify-between text-left transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-200">Package to Android APK</div>
              <div className="text-[10px] text-emerald-300/70 font-mono">Turnkey launcher setup script & manifest</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
            npm run setup:apk
          </span>
        </button>
      )}

      {/* Bottom Dismiss */}
      <button
        onClick={onClose}
        className="mt-auto py-2 text-center text-xs font-mono text-sky-400/70 hover:text-sky-300"
      >
        Tap or swipe up to close shade
      </button>
    </div>
  );
};

interface SystemNotificationsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResolveItem: (id: string) => void;
}

export const SystemNotificationsOverlay: React.FC<SystemNotificationsOverlayProps> = ({
  isOpen,
  onClose,
  onResolveItem,
}) => {
  const [notifications, setNotifications] = React.useState([
    {
      id: 'notif_1',
      title: 'Akira Tanaka',
      app: 'Encrypted Chat',
      time: '2m ago',
      body: 'Can you review the updated Tensor pipeline before our 10:00 AM call?',
      priority: 'high',
    },
    {
      id: 'notif_2',
      title: 'Flight DL 842 Gate Update',
      app: 'Travel Concierge',
      time: '14m ago',
      body: 'Gate changed to B28. Boarding commences in 42 minutes.',
      priority: 'urgent',
    },
    {
      id: 'notif_3',
      title: 'GitHub CI Pipeline',
      app: 'DevOps Node',
      time: '1h ago',
      body: 'aether-os-launcher build passed all 48 unit and telemetry checks.',
      priority: 'normal',
    },
  ]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-bottom duration-300 text-sky-100 p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sky-500/30 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-sky-200">
            System Notifications ({notifications.length})
          </span>
        </div>
        <button
          onClick={() => {
            audioEngine.playOrbitalTick(600);
            onClose();
          }}
          className="w-7 h-7 rounded-full bg-slate-900 border border-sky-500/30 flex items-center justify-center text-sky-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-2.5 my-4 overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-sky-400/60 font-mono text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
            <span>All notifications cleared.</span>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/30 flex flex-col gap-1.5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-sky-400 font-semibold">{notif.app}</span>
                <span className="text-sky-400/60">{notif.time}</span>
              </div>
              <span className="text-xs font-bold text-white">{notif.title}</span>
              <p className="text-xs text-sky-200/80">{notif.body}</p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sky-500/15">
                <button
                  onClick={() => {
                    audioEngine.playOrbitalTick(1000);
                    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-[10px] font-mono text-sky-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Clear All */}
      {notifications.length > 0 && (
        <button
          onClick={() => {
            audioEngine.playActionExecute();
            setNotifications([]);
          }}
          className="w-full py-2.5 rounded-xl bg-slate-900 border border-sky-500/30 text-xs font-mono text-sky-300 hover:text-sky-100"
        >
          Clear All Notifications
        </button>
      )}
    </div>
  );
};
