import React from 'react';
import { LauncherConfig } from '../../types';
import { Maximize2, Minimize2, Smartphone } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface DeviceShellProps {
  config: LauncherConfig;
  children: React.ReactNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const DeviceShell: React.FC<DeviceShellProps> = ({
  config,
  children,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-neutral-950 p-0 sm:p-4 overflow-hidden select-none font-sans">
      {/* Phone Chassis Container */}
      <div
        className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full rounded-none border-none shadow-none'
            : 'w-full max-w-[420px] h-full sm:h-[880px] max-h-screen sm:rounded-[48px] border-[6px] sm:border-[10px] border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10'
        }`}
        style={{
          backgroundColor: '#0a0a0c',
        }}
      >
        {/* Top Punch Hole Camera (Selfie sensor) */}
        {!isFullscreen && (
          <div className="absolute top-2.5 inset-x-0 z-50 flex justify-center pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-700/80 shadow-inner flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-neutral-900" />
            </div>
          </div>
        )}

        {/* Floating Quick Action: Fullscreen Toggle on Desktop */}
        <button
          onClick={() => {
            audioEngine.playClick();
            onToggleFullscreen();
          }}
          className="hidden sm:flex absolute top-3 right-4 z-50 p-1.5 rounded-full bg-black/40 hover:bg-black/80 text-white/60 hover:text-white backdrop-blur-md transition-colors border border-white/10 shadow"
          title={isFullscreen ? 'Windowed Device Frame' : 'Immersive Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>

        {/* Phone Content Surface */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
