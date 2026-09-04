import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Wifi,
  WifiOff,
  Activity,
  Terminal,
  Search,
  Filter,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Globe,
  ArrowDownRight,
  ArrowUpRight,
  X,
  Play,
  Pause,
  Sliders,
  CheckCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';

export interface NetworkAppRule {
  id: string;
  name: string;
  packageName: string;
  category: string;
  wifiAllowed: boolean;
  cellularAllowed: boolean;
  backgroundAllowed: boolean;
  adBlockShield: boolean;
  totalPackets: number;
  blockedPackets: number;
  currentRateKbps: number;
}

export interface NetworkPacketLog {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  protocol: 'TCP' | 'UDP' | 'TLS 1.3' | 'QUIC' | 'DNS' | 'HTTP/2';
  appId: string;
  appName: string;
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  sizeBytes: number;
  status: 'allowed' | 'dropped' | 'filtered';
  geoCountry: string;
  threatScore: number; // 0-100
  hexPayload: string;
}

interface SentinelFirewallAndSyslogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SentinelFirewallAndSyslog: React.FC<SentinelFirewallAndSyslogProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'traffic' | 'firewall_rules' | 'syslog' | 'oscilloscope'>('traffic');
  const [isFirewallActive, setIsFirewallActive] = useState<boolean>(true);
  const [globalKillSwitch, setGlobalKillSwitch] = useState<boolean>(false);
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);
  const [selectedPacket, setSelectedPacket] = useState<NetworkPacketLog | null>(null);

  // Per-App Rules State
  const [appRules, setAppRules] = useState<NetworkAppRule[]>([
    {
      id: 'chrome',
      name: 'Google Chrome',
      packageName: 'com.android.chrome',
      category: 'Browser',
      wifiAllowed: true,
      cellularAllowed: true,
      backgroundAllowed: false,
      adBlockShield: true,
      totalPackets: 1842,
      blockedPackets: 124,
      currentRateKbps: 42.8,
    },
    {
      id: 'messages',
      name: 'Messages SMS/RCS',
      packageName: 'com.google.android.apps.messaging',
      category: 'Communication',
      wifiAllowed: true,
      cellularAllowed: true,
      backgroundAllowed: true,
      adBlockShield: false,
      totalPackets: 420,
      blockedPackets: 0,
      currentRateKbps: 1.2,
    },
    {
      id: 'play_services',
      name: 'Google Play Services',
      packageName: 'com.google.android.gms',
      category: 'System Core',
      wifiAllowed: true,
      cellularAllowed: true,
      backgroundAllowed: true,
      adBlockShield: true,
      totalPackets: 3200,
      blockedPackets: 89,
      currentRateKbps: 8.4,
    },
    {
      id: 'telemetry_daemon',
      name: 'External Analytics Tracker',
      packageName: 'com.thirdparty.telemetry',
      category: 'Telemetry / Scraper',
      wifiAllowed: false,
      cellularAllowed: false,
      backgroundAllowed: false,
      adBlockShield: true,
      totalPackets: 890,
      blockedPackets: 890,
      currentRateKbps: 0.0,
    },
    {
      id: 'youtube',
      name: 'YouTube Media',
      packageName: 'com.google.android.youtube',
      category: 'Media',
      wifiAllowed: true,
      cellularAllowed: false,
      backgroundAllowed: false,
      adBlockShield: true,
      totalPackets: 5120,
      blockedPackets: 310,
      currentRateKbps: 180.5,
    },
    {
      id: 'spotify',
      name: 'Spotify Music',
      packageName: 'com.spotify.music',
      category: 'Media',
      wifiAllowed: true,
      cellularAllowed: true,
      backgroundAllowed: true,
      adBlockShield: true,
      totalPackets: 2190,
      blockedPackets: 42,
      currentRateKbps: 96.0,
    },
    {
      id: 'terminal',
      name: 'Termux Terminal Shell',
      packageName: 'com.termux',
      category: 'Developer',
      wifiAllowed: true,
      cellularAllowed: true,
      backgroundAllowed: true,
      adBlockShield: false,
      totalPackets: 760,
      blockedPackets: 0,
      currentRateKbps: 4.1,
    },
  ]);

  // Live Traffic Packet Log State
  const [packets, setPackets] = useState<NetworkPacketLog[]>([
    {
      id: 'pkt_1',
      timestamp: '08:14:22.401',
      direction: 'inbound',
      protocol: 'TLS 1.3',
      appId: 'chrome',
      appName: 'Google Chrome',
      sourceIp: '142.250.190.46',
      sourcePort: 443,
      destIp: '192.168.1.108',
      destPort: 52410,
      sizeBytes: 1420,
      status: 'allowed',
      geoCountry: 'US (Mountain View)',
      threatScore: 0,
      hexPayload: '17 03 03 00 40 8b f2 1a 99 44 e3 20 8a ff 12 b4',
    },
    {
      id: 'pkt_2',
      timestamp: '08:14:22.210',
      direction: 'outbound',
      protocol: 'DNS',
      appId: 'telemetry_daemon',
      appName: 'External Analytics Tracker',
      sourceIp: '192.168.1.108',
      sourcePort: 54100,
      destIp: '185.199.108.153',
      destPort: 53,
      sizeBytes: 84,
      status: 'dropped',
      geoCountry: 'RO (Bucharest)',
      threatScore: 88,
      hexPayload: '00 01 01 00 00 01 00 00 00 00 00 00 07 74 72 61',
    },
    {
      id: 'pkt_3',
      timestamp: '08:14:21.890',
      direction: 'inbound',
      protocol: 'QUIC',
      appId: 'youtube',
      appName: 'YouTube Media',
      sourceIp: '172.217.16.206',
      sourcePort: 443,
      destIp: '192.168.1.108',
      destPort: 49822,
      sizeBytes: 1380,
      status: 'allowed',
      geoCountry: 'US (San Jose)',
      threatScore: 2,
      hexPayload: 'c0 00 00 01 08 3f 2a 89 12 77 4b 00 00 45 10 99',
    },
  ]);

  // Syslog Terminal State
  const [syslogCategory, setSyslogCategory] = useState<string>('ALL');
  const [syslogFilterText, setSyslogFilterText] = useState<string>('');
  const [syslogs, setSyslogs] = useState<{ id: string; time: string; facility: string; level: 'info' | 'warn' | 'error' | 'sec'; message: string }[]>([
    { id: 's1', time: '08:14:22', facility: 'NETFILTER', level: 'sec', message: 'DROP outbound DNS query from UID 10182 (com.thirdparty.telemetry) -> 185.199.108.153:53' },
    { id: 's2', time: '08:14:21', facility: 'KERNEL', level: 'info', message: 'aether_npu: Tensor G5 pipeline context switch: 64 TOPS loaded with 0 latency' },
    { id: 's3', time: '08:14:20', facility: 'SELINUX', level: 'info', message: 'avc: granted { read open } for pid=2910 path="/data/user/0/enclave.db"' },
    { id: 's4', time: '08:14:19', facility: 'APPOPS', level: 'info', message: 'Permission verified: SMS_READ / CALL_PHONE routed inside local AetherOS enclave' },
    { id: 's5', time: '08:14:18', facility: 'GNSS', level: 'info', message: 'Mock location vector injected: 37.422000, -122.084100 (HPE 0.8m)' },
    { id: 's6', time: '08:14:17', facility: 'IPTABLES', level: 'warn', message: 'Firewall ruleset updated: 7 app policies synchronized across all interfaces' },
  ]);

  // Live Packet Stream Generation Loop
  useEffect(() => {
    let interval: any;
    if (isFirewallActive && !isStreamPaused) {
      interval = setInterval(() => {
        const randomApp = appRules[Math.floor(Math.random() * appRules.length)];
        const isDropped = globalKillSwitch || (!randomApp.wifiAllowed && !randomApp.cellularAllowed);
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');

        const newPacket: NetworkPacketLog = {
          id: `pkt_${Date.now()}`,
          timestamp: timeStr,
          direction: Math.random() > 0.4 ? 'inbound' : 'outbound',
          protocol: ['TLS 1.3', 'TCP', 'QUIC', 'DNS', 'HTTP/2'][Math.floor(Math.random() * 5)] as any,
          appId: randomApp.id,
          appName: randomApp.name,
          sourceIp: isDropped ? '192.168.1.108' : `142.250.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          sourcePort: Math.floor(Math.random() * 50000) + 1024,
          destIp: isDropped ? '185.220.101.5' : '192.168.1.108',
          destPort: 443,
          sizeBytes: Math.floor(Math.random() * 1400) + 64,
          status: isDropped ? 'dropped' : 'allowed',
          geoCountry: isDropped ? 'Blocked Host' : 'US / EU CDN',
          threatScore: isDropped ? 92 : Math.floor(Math.random() * 10),
          hexPayload: '45 00 00 3c 1a 2b 40 00 40 06 b2 c3 c0 a8 01 6c',
        };

        setPackets((prev) => [newPacket, ...prev.slice(0, 45)]);

        // Update app packet counts
        setAppRules((prev) =>
          prev.map((app) =>
            app.id === randomApp.id
              ? {
                  ...app,
                  totalPackets: app.totalPackets + 1,
                  blockedPackets: isDropped ? app.blockedPackets + 1 : app.blockedPackets,
                }
              : app
          )
        );

        if (isDropped) {
          audioEngine.playFirewallAlert();
          setSyslogs((prev) => [
            {
              id: `s_${Date.now()}`,
              time: now.toTimeString().split(' ')[0],
              facility: 'NETFILTER',
              level: 'sec',
              message: `BLOCKED unauthorized ${newPacket.protocol} packet from ${randomApp.name} (${randomApp.packageName})`,
            },
            ...prev.slice(0, 40),
          ]);
        }
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isFirewallActive, isStreamPaused, globalKillSwitch, appRules]);

  // Toggle App Network Permission
  const handleToggleAppRule = (appId: string, field: 'wifiAllowed' | 'cellularAllowed' | 'backgroundAllowed' | 'adBlockShield') => {
    audioEngine.playOrbitalTick(900);
    setAppRules((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, [field]: !app[field] } : app))
    );
  };

  const filteredSyslogs = syslogs.filter((log) => {
    const matchesCat = syslogCategory === 'ALL' || log.facility === syslogCategory;
    const matchesText = log.message.toLowerCase().includes(syslogFilterText.toLowerCase());
    return matchesCat && matchesText;
  });

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/96 backdrop-blur-2xl text-slate-100 select-none animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* 1. TOP FIREWALL HEADER */}
      <div className="p-4 border-b border-sky-500/20 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Shield className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-bold tracking-wider text-sky-200 uppercase">
                Aether Sentinel Firewall & Syslog
              </h2>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                globalKillSwitch
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : isFirewallActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {globalKillSwitch ? 'KILLSWITCH ACTIVE' : isFirewallActive ? 'FILTERING ACTIVE' : 'BYPASS'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-sky-400/80">
              Per-App iptables Sandbox · Zero-Token DPI Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 1-Tap Emergency Kill Switch */}
          <button
            onClick={() => {
              audioEngine.playFirewallAlert();
              setGlobalKillSwitch(!globalKillSwitch);
            }}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border transition-all ${
              globalKillSwitch
                ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-slate-800 hover:bg-rose-950 text-rose-400 border-rose-500/30'
            }`}
            title="Cut off all device network connections immediately"
          >
            {globalKillSwitch ? 'KILLSWITCH ON' : 'BLOCK ALL'}
          </button>

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
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-950 border-b border-sky-500/15 overflow-x-auto no-scrollbar">
        {[
          { id: 'traffic', label: 'Live Traffic Flow', icon: Activity },
          { id: 'firewall_rules', label: 'App Rules Matrix (7)', icon: Sliders },
          { id: 'syslog', label: 'System Kernel Syslog', icon: Terminal },
          { id: 'oscilloscope', label: 'Bandwidth Oscilloscope', icon: Radio },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                audioEngine.playOrbitalTick(850);
                setActiveTab(t.id as any);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/80 text-sky-300/70 border border-sky-500/15 hover:text-sky-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* ------------------------------------------------------------- */}
        {/* A. LIVE TRAFFIC STREAM TAB                                    */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'traffic' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-300 font-bold uppercase">
                Real-Time Socket Inspections ({packets.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStreamPaused(!isStreamPaused)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 hover:text-white"
                >
                  {isStreamPaused ? 'Resume Stream' : 'Pause Stream'}
                </button>
                <button
                  onClick={() => setPackets([])}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Packet Table Stream */}
            <div className="space-y-2">
              {packets.map((pkt) => (
                <div
                  key={pkt.id}
                  onClick={() => setSelectedPacket(pkt)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                    pkt.status === 'dropped'
                      ? 'bg-rose-950/40 border-rose-500/40 hover:bg-rose-950/60'
                      : 'bg-slate-900/80 border-sky-500/20 hover:border-sky-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pkt.appName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        pkt.direction === 'inbound'
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {pkt.direction === 'inbound' ? '↓ RX' : '↑ TX'}
                      </span>
                      <span className="text-sky-400/70">{pkt.protocol}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      pkt.status === 'dropped'
                        ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {pkt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{pkt.sourceIp}:{pkt.sourcePort} ➔ {pkt.destIp}:{pkt.destPort}</span>
                    <span>{pkt.sizeBytes} B · {pkt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Packet Deep Inspection Modal */}
            {selectedPacket && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-sky-500/40 rounded-3xl w-full max-w-sm p-4 space-y-3 text-left">
                  <div className="flex justify-between items-center border-b border-sky-500/20 pb-2">
                    <h4 className="text-xs font-mono font-bold text-sky-300 uppercase">
                      Deep Packet Inspection (DPI)
                    </h4>
                    <button onClick={() => setSelectedPacket(null)} className="text-slate-400 hover:text-white">
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <p><span className="text-sky-400">App:</span> {selectedPacket.appName}</p>
                    <p><span className="text-sky-400">Protocol:</span> {selectedPacket.protocol}</p>
                    <p><span className="text-sky-400">Source:</span> {selectedPacket.sourceIp}:{selectedPacket.sourcePort}</p>
                    <p><span className="text-sky-400">Destination:</span> {selectedPacket.destIp}:{selectedPacket.destPort}</p>
                    <p><span className="text-sky-400">Geo Location:</span> {selectedPacket.geoCountry}</p>
                    <p><span className="text-sky-400">Threat Score:</span> {selectedPacket.threatScore} / 100</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-sky-400/80 block mb-1">HEX PAYLOAD DUMP</span>
                    <div className="p-2.5 rounded-xl bg-black font-mono text-[11px] text-emerald-400 border border-slate-800 break-all">
                      {selectedPacket.hexPayload}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPacket(null)}
                    className="w-full py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-mono font-bold hover:bg-sky-400"
                  >
                    Close Packet Inspector
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* B. PER-APP FIREWALL RULES MATRIX                              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'firewall_rules' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-300 font-bold uppercase">
                Per-Application Network Policies
              </span>
              <span className="text-[10px] text-slate-400">
                Independent Wi-Fi & Cellular Isolation
              </span>
            </div>

            <div className="space-y-2.5">
              {appRules.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/20 flex flex-col gap-2.5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.name}</h4>
                      <p className="text-[10px] font-mono text-sky-400/70">{app.packageName}</p>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <span className="text-slate-400">{app.totalPackets} pkts</span>
                      {app.blockedPackets > 0 && (
                        <span className="text-rose-400 ml-1.5 font-bold">({app.blockedPackets} blocked)</span>
                      )}
                    </div>
                  </div>

                  {/* Network Control Switches */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-sky-500/10">
                    {/* Wi-Fi Switch */}
                    <button
                      onClick={() => handleToggleAppRule(app.id, 'wifiAllowed')}
                      className={`p-1.5 rounded-xl flex flex-col items-center gap-0.5 border text-[9px] font-mono font-bold transition-all ${
                        app.wifiAllowed
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <span>Wi-Fi</span>
                      <span>{app.wifiAllowed ? 'ALLOW' : 'DROP'}</span>
                    </button>

                    {/* Cellular Switch */}
                    <button
                      onClick={() => handleToggleAppRule(app.id, 'cellularAllowed')}
                      className={`p-1.5 rounded-xl flex flex-col items-center gap-0.5 border text-[9px] font-mono font-bold transition-all ${
                        app.cellularAllowed
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <span>Cellular</span>
                      <span>{app.cellularAllowed ? 'ALLOW' : 'DROP'}</span>
                    </button>

                    {/* Background Switch */}
                    <button
                      onClick={() => handleToggleAppRule(app.id, 'backgroundAllowed')}
                      className={`p-1.5 rounded-xl flex flex-col items-center gap-0.5 border text-[9px] font-mono font-bold transition-all ${
                        app.backgroundAllowed
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <span>Background</span>
                      <span>{app.backgroundAllowed ? 'YES' : 'NO'}</span>
                    </button>

                    {/* Ad Block Shield */}
                    <button
                      onClick={() => handleToggleAppRule(app.id, 'adBlockShield')}
                      className={`p-1.5 rounded-xl flex flex-col items-center gap-0.5 border text-[9px] font-mono font-bold transition-all ${
                        app.adBlockShield
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <span>Ad Shield</span>
                      <span>{app.adBlockShield ? 'ACTIVE' : 'OFF'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* C. REAL-TIME SYSTEM KERNEL SYSLOG                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'syslog' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-300 font-bold uppercase">
                /dev/kmsg & dmesg System Kernel Log
              </span>
              <button
                onClick={() => setSyslogs([])}
                className="text-[10px] font-mono text-sky-400 hover:text-white"
              >
                Clear Terminal
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-sky-500/20">
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <input
                  type="text"
                  value={syslogFilterText}
                  onChange={(e) => setSyslogFilterText(e.target.value)}
                  placeholder="Filter kernel events (e.g. DROP, NPU)..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Terminal Viewport */}
            <div className="p-3.5 rounded-2xl bg-black border border-sky-500/30 font-mono text-[11px] h-72 overflow-y-auto space-y-1.5 select-text text-left">
              {filteredSyslogs.map((log) => (
                <div key={log.id} className="leading-relaxed hover:bg-slate-900/60 p-1 rounded flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">{log.time}</span>
                  <span className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                    log.level === 'sec'
                      ? 'bg-rose-900 text-rose-200'
                      : log.level === 'warn'
                      ? 'bg-amber-900 text-amber-200'
                      : 'bg-sky-950 text-sky-300'
                  }`}>
                    [{log.facility}]
                  </span>
                  <span className={`${log.level === 'sec' ? 'text-rose-300' : 'text-slate-200'}`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* D. BANDWIDTH OSCILLOSCOPE                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'oscilloscope' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-sky-300 uppercase">
                  Real-Time Throughput Oscilloscope
                </span>
                <span className="text-[10px] font-mono text-emerald-400">100 ms Refresh</span>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="h-44 w-full bg-black rounded-xl border border-sky-500/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Simulated SVG Oscilloscope waves */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Inbound RX Wave (Emerald) */}
                  <path
                    d="M 0 90 Q 60 20, 120 90 T 240 90 T 360 40 T 480 90"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.5"
                    className="animate-pulse"
                  />
                  {/* Outbound TX Wave (Sky) */}
                  <path
                    d="M 0 110 Q 80 150, 160 110 T 320 80 T 480 120"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                </svg>

                <div className="absolute top-2 left-3 flex gap-4 text-[10px] font-mono">
                  <span className="text-emerald-400">● Inbound (RX): 328.4 KB/s</span>
                  <span className="text-sky-400">● Outbound (TX): 64.1 KB/s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
