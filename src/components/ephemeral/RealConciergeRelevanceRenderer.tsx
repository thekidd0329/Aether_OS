import React, { useState } from 'react';
import { SynthesizedRelevanceFeed, RawContextBundle } from '../../types/realContext';
import { launchNativeApp, AetherContextBridge } from '../../services/deviceContextCollector';
import { audioEngine } from '../../utils/audioEngine';
import {
  Sparkles,
  Clock,
  Calendar,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface RealConciergeRelevanceRendererProps {
  feed: SynthesizedRelevanceFeed;
  rawContext: RawContextBundle;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const RealConciergeRelevanceRenderer: React.FC<RealConciergeRelevanceRendererProps> = ({
  feed,
  rawContext,
  onRefresh,
  isRefreshing,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'now' | 'next' | 'tasks' | 'people'>('all');

  const handleAction = (item: any) => {
    audioEngine.playActionExecute();
    if (item.packageName) {
      launchNativeApp(item.packageName);
    }
  };

  const handleGrantNotificationListener = async () => {
    try {
      await AetherContextBridge.openNotificationListenerSettings();
    } catch (e) {
      console.warn('Could not open settings', e);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/90 text-slate-100 backdrop-blur-xl overflow-y-auto no-scrollbar">
      {/* Top Telemetry & AI Synthesis Badge */}
      <div className="p-4 border-b border-sky-500/20 bg-slate-900/60 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-wider text-sky-400 uppercase">
                {feed.engine === 'AICore-Gemini-Nano' ? 'AICore · Gemini Nano' : 'Aether Relevance Engine'}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400">
              {feed.rawSignalCount} raw signals ranked · {new Date(feed.synthesizedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-xl bg-slate-800/80 border border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400 transition-all ${
            isRefreshing ? 'animate-spin opacity-50' : ''
          }`}
          title="Re-run AICore relevance ranking"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Notification Listener Warning if not granted */}
      {!rawContext.notificationListenerActive && (
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-[11px] text-amber-200">
              Enable Notification Listener for live real-time Android ranking.
            </p>
          </div>
          <button
            onClick={handleGrantNotificationListener}
            className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-bold tracking-wider hover:bg-amber-400"
          >
            Grant
          </button>
        </div>
      )}

      {/* Structured Executive Synthesis Content */}
      <div className="p-4 space-y-6">
        {/* 1. NOW SECTION */}
        {(activeTab === 'all' || activeTab === 'now') && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase">NOW</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Immediate Attention</span>
            </div>

            <div className="space-y-2">
              {feed.now.map((item, idx) => (
                <div
                  key={`now_${idx}`}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.urgency === 'critical'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                      : 'bg-slate-900/70 border-sky-500/20 text-slate-200 hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-800 text-sky-400 border border-slate-700">
                          {item.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{item.subtitle}</p>
                    </div>

                    {item.actionLabel && (
                      <button
                        onClick={() => handleAction(item)}
                        className="px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/50 hover:bg-sky-500 hover:text-slate-950 text-sky-300 text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. NEXT SECTION */}
        {(activeTab === 'all' || activeTab === 'next') && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase">NEXT</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Upcoming Agenda</span>
            </div>

            <div className="space-y-2">
              {feed.next.map((item, idx) => (
                <div
                  key={`next_${idx}`}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 text-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <span className="text-[11px] font-mono text-amber-400 font-bold">
                        {item.timeDelta}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.subtitle}</p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800/80 text-amber-300 border border-amber-500/30">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. DON'T FORGET SECTION */}
        {(activeTab === 'all' || activeTab === 'tasks') && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase">DON'T FORGET</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Obligations & Deadlines</span>
            </div>

            <div className="space-y-2">
              {feed.dontForget.map((item, idx) => (
                <div
                  key={`forget_${idx}`}
                  className="p-3 rounded-2xl bg-slate-900/50 border border-emerald-500/20 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.context}</p>
                  </div>
                  {item.dueDate && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex-shrink-0">
                      {item.dueDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. PEOPLE SECTION */}
        {(activeTab === 'all' || activeTab === 'people') && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase">PEOPLE</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Conversations & Relationships</span>
            </div>

            <div className="space-y-2">
              {feed.people.map((p, idx) => (
                <div
                  key={`people_${idx}`}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-sky-500/20 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 flex items-center justify-center font-bold text-sky-300 text-sm">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                      <p className="text-xs text-slate-400">{p.context}</p>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-xl bg-slate-800 text-[10px] font-mono text-sky-400 border border-slate-700">
                    {p.channel}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
