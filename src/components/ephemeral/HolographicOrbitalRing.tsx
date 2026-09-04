import React, { useState, useEffect, useRef } from 'react';
import { BriefingItem } from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import {
  MessageSquare,
  GraduationCap,
  BatteryWarning,
  Calendar,
  Users,
  Layers,
  Download,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface HolographicOrbitalRingProps {
  items: BriefingItem[];
  selectedItem: BriefingItem | null;
  onSelectItem: (item: BriefingItem) => void;
  onResolveItem: (itemId: string) => void;
}

const getCategoryIcon = (name: string) => {
  switch (name) {
    case 'MessageSquare':
      return MessageSquare;
    case 'GraduationCap':
      return GraduationCap;
    case 'BatteryWarning':
      return BatteryWarning;
    case 'Calendar':
      return Calendar;
    case 'Users':
      return Users;
    case 'Layers':
      return Layers;
    case 'Download':
      return Download;
    default:
      return Zap;
  }
};

export const HolographicOrbitalRing: React.FC<HolographicOrbitalRingProps> = ({
  items,
  selectedItem,
  onSelectItem,
  onResolveItem,
}) => {
  // Sort items by priority score so highest priority is at 6 o'clock
  const sortedItems = [...items].sort((a, b) => b.priorityScore - a.priorityScore);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const startAngleRef = useRef<number>(0);

  // Auto slow ambient orbital rotation when not interacting
  useEffect(() => {
    if (isDragging || selectedItem) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.15) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isDragging, selectedItem]);

  // Touch & Drag Handling for physical rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startAngleRef.current = rotationAngle;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newAngle = (startAngleRef.current + deltaX * 0.75 + 3600) % 360;
    setRotationAngle(newAngle);
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      audioEngine.playOrbitalTick(900);
    }
  };

  const totalItems = sortedItems.length;
  // Radius of orbit in pixels
  const radiusX = 135;
  const radiusY = 58;

  return (
    <div
      className="relative w-full h-80 flex items-center justify-center select-none perspective-1200 cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 1. Background Holographic Concentric Grid & Ticks */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer subtle orbital ring */}
        <div className="w-72 h-72 rounded-full border border-sky-500/20 animate-[spin_60s_linear_infinite]" />
        
        {/* Inner holographic reticle with dashed cyan border */}
        <div className="absolute w-56 h-56 rounded-full border border-dashed border-sky-400/30 animate-[spin_30s_linear_infinite_reverse]" />
        
        {/* Horizontal & Vertical subtle telemetry crosshairs */}
        <div className="absolute w-64 h-[1px] bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
        <div className="absolute h-64 w-[1px] bg-gradient-to-b from-transparent via-sky-500/30 to-transparent" />

        {/* Center glowing core sensor */}
        <div className="absolute w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
          <div className="w-3 h-3 rounded-full bg-sky-400 animate-ping opacity-75" />
          <div className="absolute w-2 h-2 rounded-full bg-sky-200" />
        </div>

        {/* 3D Holographic Elliptical Orbit Track */}
        <div
          className="absolute w-[300px] h-[130px] rounded-[100%] border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          style={{
            transform: 'rotateX(62deg)',
          }}
        />
      </div>

      {/* 2. Orbiting Nodes positioned on 3D Z-Planes */}
      <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
        {sortedItems.map((item, index) => {
          // Angle offset: Highest priority sits naturally near 90deg (6 o'clock thumb zone)
          const baseAngle = 90 + (index * (360 / totalItems));
          const currentAngle = (baseAngle + rotationAngle) % 360;
          const rad = (currentAngle * Math.PI) / 180;

          // Elliptical coordinates with 3D depth
          const x = Math.cos(rad) * radiusX;
          const y = Math.sin(rad) * radiusY;
          // Z depth: items near 6 o'clock (sin > 0) come forward, items near 12 o'clock recede
          const zDepth = Math.sin(rad); // -1 (back) to +1 (front)
          const scale = 0.78 + (zDepth + 1) * 0.18; // scale from 0.78 to 1.14
          const opacity = 0.45 + (zDepth + 1) * 0.28; // opacity 0.45 to 1.0
          const isAtThumbZone = zDepth > 0.65;
          const isSelected = selectedItem?.id === item.id;
          const IconComponent = getCategoryIcon(item.iconName);

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                audioEngine.playBloomOpen();
                onSelectItem(item);
              }}
              style={{
                transform: `translate3d(${x}px, ${y}px, ${zDepth * 80}px) scale(${scale})`,
                zIndex: Math.round((zDepth + 1) * 50),
                opacity: isSelected ? 1 : opacity,
              }}
              className={`absolute cursor-pointer transition-all duration-150 group`}
            >
              {/* Node Card */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
                  isAtThumbZone
                    ? 'bg-sky-950/80 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.45)] text-sky-100 ring-1 ring-sky-400/40'
                    : 'bg-slate-950/60 border-sky-500/30 hover:border-sky-400/70 text-slate-300'
                } ${isSelected ? 'ring-2 ring-sky-300 scale-110 shadow-[0_0_30px_rgba(56,189,248,0.7)]' : ''}`}
              >
                {/* Node Icon Pill */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    item.urgency === 'critical'
                      ? 'bg-sky-500/30 text-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                      : item.urgency === 'high'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-sky-400'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>

                {/* Node Label */}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold tracking-wide whitespace-nowrap text-sky-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    {item.title}
                  </span>
                  {isAtThumbZone && (
                    <span className="text-[10px] text-sky-400 font-mono tracking-tight whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  )}
                </div>

                {/* Direct Action Quick Bloom Chevron */}
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-sky-400 group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Holographic Projection Stem Line towards Center */}
              {isAtThumbZone && (
                <div
                  className="absolute left-1/2 -top-4 w-[1px] h-4 bg-gradient-to-t from-sky-400 to-transparent pointer-events-none"
                  style={{ transform: 'translateX(-50%)' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Thumb Zone Focus Indicator (6 o'clock) */}
      <div className="absolute bottom-2 flex flex-col items-center pointer-events-none opacity-85">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-[10px] text-sky-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>6 o'clock Thumb Zone · Drag to rotate</span>
        </div>
      </div>
    </div>
  );
};
