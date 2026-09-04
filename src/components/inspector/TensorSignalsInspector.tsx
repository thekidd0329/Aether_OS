import React from 'react';
import { MicroStateContext } from '../../types/concierge';
import {
  Cpu,
  Radio,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  Battery,
  MapPin,
  Flame,
  Activity,
} from 'lucide-react';

interface TensorSignalsInspectorProps {
  context: MicroStateContext;
  onClose: () => void;
}

export const TensorSignalsInspector: React.FC<TensorSignalsInspectorProps> = ({
  context,
  onClose,
}) => {
  const signalPipelines = [
    { name: 'Incoming Notifications', source: 'Android NotificationListener', weight: 'High (0.94)', activeItems: 14 },
    { name: 'Calendar Horizon Engine', source: 'Google Calendar Sync', weight: 'High (0.88)', activeItems: 3 },
    { name: 'Direct Message Resolver', source: 'Cross-App Identity Engine', weight: 'Critical (0.99)', activeItems: 6 },
    { name: 'Geofence & Mobility', source: 'Tensor Spatial Sensor Fusion', weight: 'Medium (0.65)', activeItems: 1 },
    { name: 'System & Battery Telemetry', source: 'Pixel 10 Pro Power Subsystem', weight: 'High (0.86)', activeItems: 1 },
    { name: 'Local File System Watcher', source: 'Downloads & Cloud Cache', weight: 'Normal (0.42)', activeItems: 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-sky-400/80 p-5 flex flex-col gap-4 text-sky-100 shadow-[0_0_50px_rgba(56,189,248,0.4)] max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-sky-500/30 pb-3">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold text-white uppercase font-mono">
                Tensor Micro-State Engine
              </h2>
            </div>
            <span className="text-xs text-sky-300/70 font-mono mt-0.5">
              Event-driven relevance matrix · 0.4ms cold-path latency
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-sky-300 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Diagnostics Pill Grid */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col">
            <span className="text-sky-400/70 text-[10px]">Processing Engine</span>
            <span className="text-white font-bold">Tensor G5 NPU</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col">
            <span className="text-sky-400/70 text-[10px]">Compute Latency</span>
            <span className="text-emerald-400 font-bold">{context.signalLatencyMs} ms</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col">
            <span className="text-sky-400/70 text-[10px]">Active Signals</span>
            <span className="text-sky-300 font-bold">{context.activeSignalsCount} Inputs</span>
          </div>
        </div>

        {/* Signal Graph Architecture Explanation */}
        <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/40 text-xs font-mono text-sky-200/90 leading-relaxed text-left flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sky-300 font-bold">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Zero Heavy LLM Unlock Cost</span>
          </div>
          <p>
            Unlike traditional voice assistants that freeze the UI while querying external cloud servers, Aether OS continuously computes a lightweight, 64-byte relevance state on-device whenever an event fires. When you unlock, the briefing renders instantaneously.
          </p>
        </div>

        {/* Active Signal Pipelines */}
        <div className="flex flex-col gap-2 text-left font-mono text-xs">
          <span className="text-[10px] text-sky-400/80 uppercase tracking-wider">
            Connected Event Pipelines
          </span>

          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto">
            {signalPipelines.map((pipe) => (
              <div
                key={pipe.name}
                className="p-2 rounded-xl bg-slate-950/80 border border-sky-500/20 flex items-center justify-between text-[11px]"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{pipe.name}</span>
                  <span className="text-[9px] text-sky-400/70">{pipe.source}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold">{pipe.weight}</span>
                  <span className="text-[9px] text-slate-400 block">{pipe.activeItems} inputs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono shadow-[0_0_15px_rgba(56,189,248,0.4)]"
        >
          Close Diagnostics
        </button>
      </div>
    </div>
  );
};
