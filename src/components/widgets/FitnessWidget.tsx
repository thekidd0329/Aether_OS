import React from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Flame, Footprints, Heart, Timer } from 'lucide-react';

interface FitnessWidgetProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onOpenFitness?: () => void;
}

export const FitnessWidget: React.FC<FitnessWidgetProps> = ({
  widget,
  palette,
  onOpenFitness,
}) => {
  const steps = 7420;
  const goal = 10000;
  const progressPercent = Math.min(100, Math.round((steps / goal) * 100));

  return (
    <div
      onClick={onOpenFitness}
      className="w-full h-full flex flex-col justify-between cursor-pointer p-0.5 text-white"
    >
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="flex items-center gap-1.5 font-medium">
          <Heart size={13} className="text-red-400" />
          <span>Daily Movement</span>
        </span>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
          {progressPercent}% Goal
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 my-auto">
        {/* Step Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeWidth="3.5"
              strokeDasharray={`${progressPercent}, 100`}
              strokeLinecap="round"
              stroke={palette.primary || '#10b981'}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <Footprints size={14} style={{ color: palette.primary }} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold tracking-tight font-mono">
              {steps.toLocaleString()}
            </span>
            <span className="text-[10px] text-white/50 uppercase">/ 10k steps</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px] text-white/70">
            <div className="flex items-center gap-1">
              <Flame size={11} className="text-orange-400" />
              <span>420 kcal</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer size={11} className="text-cyan-400" />
              <span>38 mins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%`, backgroundColor: palette.primary }}
        />
      </div>
    </div>
  );
};
