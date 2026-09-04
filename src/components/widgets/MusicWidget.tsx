import React, { useState, useEffect } from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Play, Pause, SkipForward, SkipBack, Disc, Volume2 } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface MusicWidgetProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onOpenMusic?: () => void;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({
  widget,
  palette,
  onOpenMusic,
}) => {
  const [musicState, setMusicState] = useState(audioEngine.getMusicState());

  useEffect(() => {
    const unsub = audioEngine.subscribe(setMusicState);
    return () => unsub();
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.toggleMusic(musicState.track || 'Lofi Study');
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tracks = ['Lofi Study', 'Cyber Chill', 'Synthwave Sunset', 'Ambient Focus'];
    const nextIdx = (tracks.indexOf(musicState.track) + 1) % tracks.length;
    audioEngine.startMusic(tracks[nextIdx]);
  };

  return (
    <div
      onClick={onOpenMusic}
      className="w-full h-full flex flex-col justify-between cursor-pointer p-0.5"
    >
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="flex items-center gap-1.5 font-medium">
          <Disc
            size={14}
            className={`text-pink-400 ${musicState.isPlaying ? 'animate-spin' : ''}`}
            style={{ animationDuration: '4s' }}
          />
          <span className="truncate max-w-[120px]">{musicState.track}</span>
        </span>
        <span className="text-[10px] tracking-wider uppercase font-semibold text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
          Synth Lo-Fi
        </span>
      </div>

      {/* Center audio visualizer bars */}
      <div className="flex items-center justify-between gap-3 my-auto">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md relative overflow-hidden flex-shrink-0">
          <Disc size={24} className="text-white/80" />
          {musicState.isPlaying && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </div>

        {/* Animated wave bars */}
        <div className="flex items-center gap-1 h-8 flex-1 justify-center">
          {[40, 75, 90, 50, 85, 60, 95, 30, 70, 45].map((h, idx) => (
            <div
              key={idx}
              className="w-1 rounded-full transition-all duration-300"
              style={{
                height: musicState.isPlaying ? `${Math.max(15, (h * ((musicState.progress + idx * 10) % 100)) / 100)}%` : '20%',
                backgroundColor: idx % 2 === 0 ? palette.primary : palette.accent,
                opacity: musicState.isPlaying ? 0.9 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress & Controls */}
      <div className="space-y-1.5">
        <div className="w-full bg-white/15 h-1 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${musicState.progress}%`,
              backgroundColor: palette.primary,
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="text-[10px] text-white/50 font-mono">
            0:{musicState.progress.toString().padStart(2, '0')} / 1:00
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-neutral-900 hover:scale-105 active:scale-95 transition-transform shadow-md"
            >
              {musicState.isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
            </button>
            <button
              onClick={handleSkip}
              className="p-1 text-white/70 hover:text-white transition-colors"
            >
              <SkipForward size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
