import React from 'react';
import { BriefingItem } from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import {
  X,
  CheckCircle2,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Share2,
  ChevronRight,
  MessageSquare,
  FileCode,
  Zap,
} from 'lucide-react';

interface BloomItemModalProps {
  item: BriefingItem;
  onClose: () => void;
  onResolve: (itemId: string) => void;
  onNavigateToAnchor: (anchor: 'TASKS' | 'FILES' | 'TOOLS' | 'PEOPLE') => void;
}

export const BloomItemModal: React.FC<BloomItemModalProps> = ({
  item,
  onClose,
  onResolve,
  onNavigateToAnchor,
}) => {
  const handlePrimaryAction = () => {
    audioEngine.playActionExecute();
    onResolve(item.id);
    onClose();
  };

  const handleJumpToAnchor = () => {
    audioEngine.playCategorySwitch();
    onNavigateToAnchor(item.targetAnchor);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Holographic Glowing Frame */}
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900/95 via-sky-950/70 to-slate-950/95 border border-sky-400/60 p-5 shadow-[0_0_40px_rgba(56,189,248,0.35)] flex flex-col gap-4 text-sky-100">
        
        {/* Holographic Scanline bar */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-sky-300 to-transparent" />

        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
              {item.category} · {item.urgency.toUpperCase()}
            </span>
            <span className="text-[11px] text-sky-400/80 font-mono">
              Score {item.priorityScore}
            </span>
          </div>

          <button
            onClick={() => {
              audioEngine.playBloomClose();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-sky-300 flex items-center justify-center border border-sky-500/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Title & Subtitle */}
        <div className="flex flex-col gap-1.5 text-left">
          <h2 className="text-xl font-semibold tracking-tight text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            {item.title}
          </h2>
          <p className="text-sm text-sky-200/90 leading-relaxed font-normal">
            {item.subtitle}
          </p>
        </div>

        {/* Provider Context Card */}
        <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-sky-300">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Provider: {item.provider}</span>
          </div>
          <span className="text-sky-400/70">{item.timestamp}</span>
        </div>

        {/* Action Resolution Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {/* 1. Primary Action */}
          <button
            onClick={handlePrimaryAction}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.5)] active:scale-[0.98] transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{item.actionLabel}</span>
          </button>

          {/* 2. Secondary Action if available */}
          {item.secondaryActionLabel && (
            <button
              onClick={() => {
                audioEngine.playActionExecute();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-sky-500/40 text-sky-200 text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>{item.secondaryActionLabel}</span>
            </button>
          )}

          {/* 3. Deep link into one of the 4 permanent anchors */}
          <button
            onClick={handleJumpToAnchor}
            className="w-full py-2 px-4 rounded-xl text-[11px] text-sky-400/80 hover:text-sky-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open in {item.targetAnchor} Anchor</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
