import React, { useState } from 'react';
import { BriefingItem, MicroStateContext, AnchorCategory } from '../../types/concierge';
import { HolographicOrbitalRing } from './HolographicOrbitalRing';
import { BloomItemModal } from './BloomItemModal';
import { audioEngine } from '../../utils/audioEngine';
import {
  ChevronUp,
  Sparkles,
  MapPin,
  Cpu,
  Radio,
  Layers,
  CheckCircle,
  ArrowRight,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface BriefingApertureProps {
  context: MicroStateContext;
  items: BriefingItem[];
  onDismissToConcierge: () => void;
  onNavigateToAnchor: (anchor: AnchorCategory) => void;
  onResolveItem: (itemId: string) => void;
  onOpenSignalsInspector: () => void;
  onSwipeDownQuickSettings?: () => void;
}

export const BriefingAperture: React.FC<BriefingApertureProps> = ({
  context,
  items,
  onDismissToConcierge,
  onNavigateToAnchor,
  onResolveItem,
  onOpenSignalsInspector,
  onSwipeDownQuickSettings,
}) => {
  const [selectedItem, setSelectedItem] = useState<BriefingItem | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Swipe gesture detection (Up = App Drawer / Permanent, Down = Quick Settings)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;
    
    if (diff > 50) {
      // Swiped upward! Dismiss to Permanent Concierge
      audioEngine.playDismissBriefing();
      onDismissToConcierge();
      setTouchStartY(null);
    } else if (diff < -50 && onSwipeDownQuickSettings) {
      // Swiped downward! Open Quick Settings shade
      audioEngine.playOrbitalTick(600);
      onSwipeDownQuickSettings();
      setTouchStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };


  return (
    <div
      className="relative w-full h-full flex flex-col justify-between p-4 overflow-hidden select-none bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Holographic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep blue radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-sky-600/10 blur-[90px]" />
        
        {/* Fine holographic scanline grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />

        {/* Top subtle blue laser beam accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      </div>

      {/* 1. Header: Valet Greeting & Micro-State Status */}
      <div className="relative z-10 flex flex-col gap-1.5 pt-3">
        <div className="flex items-center justify-between text-xs font-mono text-sky-400/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="tracking-wider uppercase">Aether Concierge</span>
          </div>

          <button
            onClick={onOpenSignalsInspector}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-300 hover:border-sky-400 text-[10px] transition-colors"
          >
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>Tensor NPU · {context.signalLatencyMs}ms</span>
          </button>
        </div>

        {/* The Exact Briefing Prompt Hook */}
        <div className="flex flex-col mt-1">
          <h1 className="text-2xl font-light tracking-tight text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            {context.greeting}
          </h1>
          <p className="text-sm font-normal text-sky-200/80">
            {context.attentionSummary}
          </p>
        </div>

        {/* Contextual telemetry badges */}
        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-sky-400/70">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-400" />
            {context.location}
          </span>
          <span>·</span>
          <span>{context.weatherTemp}</span>
        </div>
      </div>

      {/* 2. Centerpiece: 3D Rotating Blue-Outline Holographic Orbital Ring */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <HolographicOrbitalRing
          items={items}
          selectedItem={selectedItem}
          onSelectItem={(item) => setSelectedItem(item)}
          onResolveItem={onResolveItem}
        />
      </div>

      {/* 3. Bottom Layer: Ephemeral Dismiss Handle & 4-Anchor Entry */}
      <div className="relative z-10 flex flex-col items-center gap-2 pb-2">
        {/* Tap or Swipe upward prompt */}
        <button
          onClick={() => {
            audioEngine.playDismissBriefing();
            onDismissToConcierge();
          }}
          className="group w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-sky-950/80 border border-sky-400/40 hover:border-sky-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-between transition-all duration-300 active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 group-hover:scale-110 transition-transform">
              <ChevronUp className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-sky-100 tracking-wide">
                Swipe up or tap to dismiss
              </span>
              <span className="text-[10px] font-mono text-sky-400/80">
                Enter TASKS · FILES · TOOLS · PEOPLE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-sky-300 group-hover:translate-x-1 transition-transform">
            <span>Unlock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* 4-Anchor Quick Tabs Preview */}
        <div className="grid grid-cols-4 gap-1.5 w-full">
          {(['TASKS', 'FILES', 'TOOLS', 'PEOPLE'] as AnchorCategory[]).map((anchor) => (
            <button
              key={anchor}
              onClick={() => {
                audioEngine.playCategorySwitch();
                onNavigateToAnchor(anchor);
              }}
              className="py-1.5 px-1 rounded-xl bg-slate-950/60 border border-sky-500/20 hover:border-sky-400/50 text-[10px] font-mono tracking-wider text-sky-300/80 hover:text-sky-200 transition-colors"
            >
              {anchor}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Blooming Resolution Modal when an orbital node is clicked */}
      {selectedItem && (
        <BloomItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onResolve={onResolveItem}
          onNavigateToAnchor={onNavigateToAnchor}
        />
      )}
    </div>
  );
};
