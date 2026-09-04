import React, { useState } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import {
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Phone,
  Compass,
  HardDrive,
  Radio,
  Camera,
  Mic,
  Bell,
  Eye,
  Lock,
  Unlock,
  Sliders,
  X,
  Sparkles,
} from 'lucide-react';

export interface SystemPermissionItem {
  id: string;
  name: string;
  manifestConstant: string;
  category: string;
  icon: any;
  status: 'granted' | 'revoked';
  reason: string;
  isCriticalForInOs: boolean;
}

interface PermissionsAuditBrokerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PermissionsAuditBroker: React.FC<PermissionsAuditBrokerProps> = ({
  isOpen,
  onClose,
}) => {
  const [permissions, setPermissions] = useState<SystemPermissionItem[]>([
    {
      id: 'sms',
      name: 'Full SMS & MMS Read/Write',
      manifestConstant: 'android.permission.READ_SMS | SEND_SMS',
      category: 'Core Communication',
      icon: MessageSquare,
      status: 'granted',
      reason: 'Keeps all SMS/RCS conversations natively inside AetherOS without external app handover.',
      isCriticalForInOs: true,
    },
    {
      id: 'phone_calls',
      name: 'Direct Phone Calls & Dialpad',
      manifestConstant: 'android.permission.CALL_PHONE | READ_CALL_LOG',
      category: 'Core Communication',
      icon: Phone,
      status: 'granted',
      reason: 'Powers the integrated in-call HUD and DTMF smart dialer directly inside the launcher.',
      isCriticalForInOs: true,
    },
    {
      id: 'mock_location',
      name: 'Mock GNSS Location Provider (Mark GPS)',
      manifestConstant: 'android.permission.ACCESS_MOCK_LOCATION',
      category: 'Hardware Telemetry',
      icon: Compass,
      status: 'granted',
      reason: 'Allows Mark GPS to broadcast spoofed coordinates to AetherOS and Google Maps.',
      isCriticalForInOs: true,
    },
    {
      id: 'raw_network_vpn',
      name: 'Network Packet Interception & Firewall',
      manifestConstant: 'android.permission.BIND_VPN_SERVICE | RAW_SOCKETS',
      category: 'Sentinel Security',
      icon: Radio,
      status: 'granted',
      reason: 'Enables real-time incoming/outgoing packet capture and per-app firewall blocking.',
      isCriticalForInOs: true,
    },
    {
      id: 'storage_saf',
      name: 'Zero-Token Storage Access Framework (SAF)',
      manifestConstant: 'android.permission.MANAGE_EXTERNAL_STORAGE',
      category: 'Storage Enclave',
      icon: HardDrive,
      status: 'granted',
      reason: 'Grants local encrypted file access with strict zero-cloud token harvesting.',
      isCriticalForInOs: true,
    },
    {
      id: 'microphone',
      name: 'HD Audio & Binaural Synthesizer',
      manifestConstant: 'android.permission.RECORD_AUDIO',
      category: 'Sensory Hardware',
      icon: Mic,
      status: 'granted',
      reason: 'Used by Phone calls, DUHBLE Spatial Audio synthesizer, and Google Meet.',
      isCriticalForInOs: false,
    },
    {
      id: 'camera',
      name: 'Ultra HDR+ Camera Pipeline',
      manifestConstant: 'android.permission.CAMERA',
      category: 'Sensory Hardware',
      icon: Camera,
      status: 'granted',
      reason: 'Powers the computational lens, QR scanning, and Google Meet video stream.',
      isCriticalForInOs: false,
    },
    {
      id: 'notifications',
      name: 'System Notification Listener & Interceptor',
      manifestConstant: 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
      category: 'Concierge Core',
      icon: Bell,
      status: 'granted',
      reason: 'Aggregates all device notifications into the AetherOS Briefing Aperture.',
      isCriticalForInOs: true,
    },
  ]);

  const handleToggle = (id: string) => {
    audioEngine.playOrbitalTick(900);
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'granted' ? 'revoked' : 'granted' } : p
      )
    );
  };

  const handleGrantAll = () => {
    audioEngine.playActionExecute();
    setPermissions((prev) => prev.map((p) => ({ ...p, status: 'granted' })));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/96 backdrop-blur-2xl text-slate-100 select-none animate-in slide-in-from-bottom duration-300 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-sky-500/20 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-emerald-300 uppercase">
              System Permissions Broker
            </h2>
            <p className="text-[10px] font-mono text-sky-400/80">
              In-OS Containment · SMS & Calls Ready
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            audioEngine.playOrbitalTick(600);
            onClose();
          }}
          className="w-7 h-7 rounded-full bg-slate-800 border border-sky-500/30 flex items-center justify-center text-sky-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Grant Banner */}
      <div className="p-3 bg-slate-900/60 border-b border-sky-500/15 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span>All 8 critical permissions are primed & active.</span>
        </div>
        <button
          onClick={handleGrantAll}
          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold hover:bg-emerald-400"
        >
          Grant All (Lock In-OS)
        </button>
      </div>

      {/* Permissions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {permissions.map((p) => {
          const Icon = p.icon;
          const isGranted = p.status === 'granted';
          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 ${
                isGranted
                  ? 'bg-slate-900/90 border-emerald-500/30'
                  : 'bg-rose-950/30 border-rose-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border mt-0.5 ${
                  isGranted
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    {p.isCriticalForInOs && (
                      <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[9px] font-mono">
                        IN-OS ONLY
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{p.manifestConstant}</p>
                  <p className="text-[10px] text-slate-300 mt-1">{p.reason}</p>
                </div>
              </div>

              <button
                onClick={() => handleToggle(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border shrink-0 transition-all ${
                  isGranted
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                    : 'bg-rose-600 text-white border-rose-400'
                }`}
              >
                {isGranted ? 'GRANTED' : 'REVOKED'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
