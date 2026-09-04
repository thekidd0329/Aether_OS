import React from 'react';
import { NavStyle, MonetPalette } from '../../types';
import { Circle, Square, ChevronLeft } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface NavigationBarProps {
  navStyle: NavStyle;
  palette: MonetPalette;
  onHome: () => void;
  onBack: () => void;
  onRecents: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  navStyle,
  palette,
  onHome,
  onBack,
  onRecents,
}) => {
  if (navStyle === 'hidden') return null;

  return (
    <div className="w-full h-8 flex items-center justify-center select-none z-30 pb-1">
      {navStyle === 'gesture_pill' ? (
        /* Gesture Pill Bar */
        <div
          onClick={() => {
            audioEngine.playClick(600, 'sine', 0.03);
            onHome();
          }}
          className="w-32 h-1.5 rounded-full bg-white/60 hover:bg-white active:scale-95 cursor-pointer transition-all shadow-sm"
        />
      ) : (
        /* 3-Button Navigation */
        <div className="w-full flex items-center justify-around text-white/70">
          <button
            onClick={() => {
              audioEngine.playClick(600, 'sine', 0.03);
              onBack();
            }}
            className="p-1.5 hover:text-white active:scale-90 transition-transform"
            title="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => {
              audioEngine.playClick(750, 'triangle', 0.04);
              onHome();
            }}
            className="p-1.5 hover:text-white active:scale-90 transition-transform"
            title="Home"
          >
            <Circle size={16} />
          </button>
          <button
            onClick={() => {
              audioEngine.playClick(850, 'sine', 0.03);
              onRecents();
            }}
            className="p-1.5 hover:text-white active:scale-90 transition-transform"
            title="Recents"
          >
            <Square size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
