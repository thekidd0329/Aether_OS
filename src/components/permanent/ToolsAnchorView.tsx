import React, { useState } from 'react';
import { ToolCluster, InstalledTool } from '../../types/concierge';
import { HardwareTelemetryDashboard } from './HardwareTelemetryDashboard';
import { audioEngine } from '../../utils/audioEngine';
import {
  Terminal,
  Calculator,
  Camera,
  Music,
  Compass,
  Sparkles,
  Cpu,
  Layers,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Play,
  Pause,
  Sliders,
  Maximize2,
  X,
  Send,
  RefreshCw,
  Activity,
  Grid,
} from 'lucide-react';

interface ToolsAnchorViewProps {
  clusters: ToolCluster[];
  onLaunchTool: (tool: InstalledTool) => void;
}

export const ToolsAnchorView: React.FC<ToolsAnchorViewProps> = ({
  clusters,
  onLaunchTool,
}) => {
  const [activeSection, setActiveSection] = useState<'telemetry' | 'clusters'>('telemetry');
  const [activeClusterId, setActiveClusterId] = useState<string>(clusters[0]?.id || 'cl_dev');
  const [activeMiniApp, setActiveMiniApp] = useState<string | null>(null);

  // Terminal state for interactive shell
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Aether Kernel v5.10-tensor-g5-pro initialized.',
    'Ready. Type "help" or "tensor-status" for diagnostics.',
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');

  // Synth state
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);
  const [synthFrequency, setSynthFrequency] = useState<number>(432);

  // Calculator state
  const [calcDisplay, setCalcDisplay] = useState<string>('0');

  // Handle Terminal commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim().toLowerCase();
    const newHist = [...terminalHistory, `$ ${terminalInput}`];

    if (cmd === 'help') {
      newHist.push('Available commands: tensor-status, sensors, top, clear, uname, ps, duhble');
    } else if (cmd === 'tensor-status') {
      newHist.push('Tensor NPU TOPS: 64.2 TOPS · Latency: 0.38ms · Thermal: 36.4°C · Micro-state: Active');
    } else if (cmd === 'sensors') {
      newHist.push('Sensors Active: Barometer 1013.4 hPa, Altimeter +148m, Magnetometer 58.1 μT, 3-Axis Accel 1.0G');
    } else if (cmd === 'top') {
      newHist.push('PID 1042: aether_concierge (0.8% CPU, 120MB RAM) · PID 802: tensor_signal_fusion (1.1% CPU)');
    } else if (cmd === 'clear') {
      setTerminalHistory(['Aether Kernel Shell cleared.']);
      setTerminalInput('');
      return;
    } else if (cmd === 'uname') {
      newHist.push('Linux pixel10pro-tensor 6.1.0-aether-concierge-arm64');
    } else if (cmd === 'duhble') {
      newHist.push('Launching DUHBLE spatial audio shader canvas...');
    } else {
      newHist.push(`Command not found: "${cmd}". Type "help" for options.`);
    }

    setTerminalHistory(newHist);
    setTerminalInput('');
  };

  // Calculator button click
  const handleCalcBtn = (val: string) => {
    audioEngine.playOrbitalTick(750);
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (val === '=') {
      try {
        const sanitized = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      if (calcDisplay === '0' || calcDisplay === 'Error') {
        setCalcDisplay(val);
      } else {
        setCalcDisplay(calcDisplay + val);
      }
    }
  };

  const activeCluster = clusters.find((c) => c.id === activeClusterId) || clusters[0];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-3 gap-3.5 text-sky-100">
      {/* Primary Mode Switcher: Hardware Telemetry vs 182-App Clusters */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex flex-col text-left">
          <h2 className="text-lg font-light tracking-tight text-white flex items-center gap-2">
            <span>Aether Hardware & Tools</span>
          </h2>
          <p className="text-[11px] text-sky-300/70 font-mono">
            Direct Tensor Hardware Layer & Functional Clustered Tools
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-2xl border border-sky-500/30 text-xs font-mono">
          <button
            onClick={() => {
              audioEngine.playCategorySwitch();
              setActiveSection('telemetry');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSection === 'telemetry'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                : 'text-sky-300/80 hover:text-sky-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playCategorySwitch();
              setActiveSection('clusters');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSection === 'clusters'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                : 'text-sky-300/80 hover:text-sky-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Clusters (182)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CINEMATIC HARDWARE TELEMETRY SUITE */}
      {activeSection === 'telemetry' && (
        <div className="animate-in fade-in duration-200">
          <HardwareTelemetryDashboard />
        </div>
      )}

      {/* SECTION 2: FUNCTIONAL CLUSTERS & PROVIDER APPS */}
      {activeSection === 'clusters' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          {/* Cluster Navigation Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
            {clusters.map((cluster) => (
              <button
                key={cluster.id}
                onClick={() => {
                  audioEngine.playCategorySwitch();
                  setActiveClusterId(cluster.id);
                }}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeClusterId === cluster.id
                    ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    : 'bg-slate-900/70 border border-sky-500/20 text-sky-300/80 hover:border-sky-400/50'
                }`}
              >
                <span>{cluster.name}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({cluster.totalInstalledAppsInCluster})
                </span>
              </button>
            ))}
          </div>

          {/* Active Cluster Details */}
          {activeCluster && (
            <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex flex-col gap-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white tracking-wide">
                  {activeCluster.name}
                </span>
                <span className="text-[10px] font-mono text-sky-400/80">
                  {activeCluster.totalInstalledAppsInCluster} Deep Providers Available
                </span>
              </div>
              <p className="text-xs text-sky-300/80 font-mono">
                {activeCluster.subtitle}
              </p>
            </div>
          )}

          {/* High Frequency Tools In Active Cluster */}
          <div className="flex flex-col gap-2.5">
            {activeCluster?.tools.map((tool) => (
              <div
                key={tool.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-sky-950/50 border border-sky-500/30 hover:border-sky-400 transition-all flex flex-col gap-2.5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-sky-100">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-sky-400/70 font-mono">
                        Provider: {tool.providerApp} · {tool.recentUse}
                      </span>
                    </div>
                  </div>

                  {tool.isInteractiveMiniApp && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-sky-500/20 text-sky-300 border border-sky-400/40">
                      Interactive
                    </span>
                  )}
                </div>

                <p className="text-xs text-sky-200/80 leading-relaxed font-normal">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-sky-500/20">
                  <span className="text-[10px] font-mono text-sky-400/80">
                    1-Tap Intent: {tool.quickActionTitle}
                  </span>

                  <button
                    onClick={() => {
                      audioEngine.playBloomOpen();
                      setActiveMiniApp(tool.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/40 border border-sky-400/50 text-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                  >
                    <span>Launch Tool</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-sky-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Tool Modal Launchers */}
      {activeMiniApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-sky-400/70 p-5 flex flex-col gap-3 text-sky-100 shadow-[0_0_40px_rgba(56,189,248,0.4)] max-h-[85vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-sky-500/30 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-sm font-semibold text-white uppercase font-mono">
                  {activeMiniApp === 'tool_terminal'
                    ? 'Aether Terminal Shell'
                    : activeMiniApp === 'tool_calculator'
                    ? 'Math Engine Pro'
                    : activeMiniApp === 'tool_camera_lens'
                    ? 'Pixel 10 Computational Lens'
                    : activeMiniApp === 'tool_duhble_synth'
                    ? 'DUHBLE Audio Synthesizer'
                    : 'Aether Subsystem'}
                </span>
              </div>
              <button
                onClick={() => {
                  if (isSynthPlaying) {
                    audioEngine.toggleAmbientHum(false);
                    setIsSynthPlaying(false);
                  }
                  setActiveMiniApp(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-800 text-sky-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Terminal Shell Execution */}
            {activeMiniApp === 'tool_terminal' && (
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-2xl bg-black border border-sky-500/40 font-mono text-xs text-sky-300 h-56 overflow-y-auto flex flex-col gap-1 text-left">
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className="leading-tight">
                      {line}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleTerminalSubmit} className="flex gap-1.5">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter command (e.g. tensor-status, help)..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-sky-500/40 text-xs text-sky-200 font-mono focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold font-mono"
                  >
                    Run
                  </button>
                </form>
              </div>
            )}

            {/* 2. Calculator Mini-App */}
            {activeMiniApp === 'tool_calculator' && (
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-sky-500/40 text-right font-mono text-2xl text-white overflow-x-auto">
                  {calcDisplay}
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-sm">
                  {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map((k) => (
                    <button
                      key={k}
                      onClick={() => handleCalcBtn(k)}
                      className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                        k === '='
                          ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                          : k === 'C'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : ['÷', '×', '-', '+'].includes(k)
                          ? 'bg-sky-950 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Camera Computational Lens Viewfinder */}
            {activeMiniApp === 'tool_camera_lens' && (
              <div className="flex flex-col gap-3">
                <div className="relative w-full h-52 rounded-2xl bg-slate-950 border border-sky-400/50 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/80 via-slate-900 to-indigo-950/80 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-sky-400/40 border-dashed animate-[spin_20s_linear_infinite] flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-sky-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-sky-400 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 text-[10px] font-mono text-sky-400/80">
                    50MP RAW · 24mm f/1.68 · ISO 64 · 1/250s
                  </div>
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400">
                    Neural HDR+ Active
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      audioEngine.playActionExecute();
                    }}
                    className="w-14 h-14 rounded-full border-4 border-sky-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-400" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. DUHBLE Audio Synthesizer */}
            {activeMiniApp === 'tool_duhble_synth' && (
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/40 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    <Music className="w-8 h-8 animate-bounce" />
                  </div>
                  <span className="text-xs font-mono text-sky-300">
                    Binaural Focus Frequency: {synthFrequency} Hz
                  </span>

                  <button
                    onClick={() => {
                      const next = !isSynthPlaying;
                      setIsSynthPlaying(next);
                      audioEngine.toggleAmbientHum(next);
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                      isSynthPlaying
                        ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                        : 'bg-sky-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                    }`}
                  >
                    {isSynthPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isSynthPlaying ? 'Stop Synthesizer' : 'Start Harmonic Wave'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

