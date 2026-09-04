import React, { useState, useEffect } from 'react';
import { MonetPalette } from '../../types';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, Disc, Heart } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface MusicAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

const TRACKS = [
  { id: '1', title: 'Lofi Study', artist: 'Nova Chillwave', duration: '1:00', cover: 'from-indigo-600 to-purple-800' },
  { id: '2', title: 'Cyber Chill', artist: 'Neon Pulse', duration: '1:00', cover: 'from-cyan-500 to-blue-700' },
  { id: '3', title: 'Synthwave Sunset', artist: 'Retro Future', duration: '1:00', cover: 'from-pink-500 to-rose-700' },
  { id: '4', title: 'Ambient Focus', artist: 'Deep Zenith', duration: '1:00', cover: 'from-emerald-500 to-teal-800' },
];

export const MusicApp: React.FC<MusicAppProps> = ({ palette, onClose }) => {
  const [musicState, setMusicState] = useState(audioEngine.getMusicState());
  const [liked, setLiked] = useState<Record<string, boolean>>({ '1': true });

  useEffect(() => {
    const unsub = audioEngine.subscribe(setMusicState);
    return () => unsub();
  }, []);

  const currentTrackObj = TRACKS.find((t) => t.title === musicState.track) || TRACKS[0];

  const handlePlayPause = () => {
    audioEngine.toggleMusic(musicState.track || 'Lofi Study');
  };

  const handleNext = () => {
    const idx = TRACKS.findIndex((t) => t.title === musicState.track);
    const nextTrack = TRACKS[(idx + 1) % TRACKS.length];
    audioEngine.startMusic(nextTrack.title);
  };

  const handlePrev = () => {
    const idx = TRACKS.findIndex((t) => t.title === musicState.track);
    const prevTrack = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
    audioEngine.startMusic(prevTrack.title);
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white select-none overflow-y-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800">
        <span className="text-xs font-bold text-neutral-300">NovaX Music Player</span>
        <div className="flex items-center gap-1.5 text-xs text-pink-400 font-medium">
          <Disc size={14} className={musicState.isPlaying ? 'animate-spin' : ''} />
          <span>Live Audio Synth</span>
        </div>
      </div>

      {/* Album Artwork */}
      <div className="p-6 flex flex-col items-center">
        <div
          className={`w-48 h-48 rounded-3xl bg-gradient-to-tr ${currentTrackObj.cover} flex items-center justify-center shadow-2xl relative overflow-hidden transition-transform duration-500 ${
            musicState.isPlaying ? 'scale-105 shadow-pink-500/20' : 'scale-95 opacity-85'
          }`}
        >
          <Disc size={80} className="text-white/30" />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          <div className="relative z-10 text-center p-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/70 block mb-1">Synthesizer</span>
            <span className="text-lg font-extrabold text-white block">{currentTrackObj.title}</span>
          </div>
        </div>

        {/* Track info & Like */}
        <div className="w-full flex items-center justify-between mt-6 px-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{currentTrackObj.title}</h3>
            <p className="text-xs text-neutral-400 font-medium">{currentTrackObj.artist}</p>
          </div>
          <button
            onClick={() => setLiked({ ...liked, [currentTrackObj.id]: !liked[currentTrackObj.id] })}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
          >
            <Heart
              size={20}
              className={liked[currentTrackObj.id] ? 'text-red-500 fill-red-500' : ''}
            />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-4 space-y-1.5 px-2">
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${musicState.progress}%`, backgroundColor: palette.primary }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
            <span>0:{musicState.progress.toString().padStart(2, '0')}</span>
            <span>1:00</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button onClick={handlePrev} className="p-2 text-neutral-400 hover:text-white transition-colors">
            <SkipBack size={22} />
          </button>
          <button
            onClick={handlePlayPause}
            className="w-14 h-14 rounded-full flex items-center justify-center text-neutral-950 font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg"
            style={{ backgroundColor: palette.primary }}
          >
            {musicState.isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button onClick={handleNext} className="p-2 text-neutral-400 hover:text-white transition-colors">
            <SkipForward size={22} />
          </button>
        </div>
      </div>

      {/* Playlist Strip */}
      <div className="px-4 pb-6 space-y-2">
        <span className="text-[11px] uppercase font-bold text-neutral-500 block px-1 tracking-wider">
          Preset Audio Loops
        </span>
        {TRACKS.map((t) => {
          const isCurrent = t.title === musicState.track;
          return (
            <div
              key={t.id}
              onClick={() => audioEngine.startMusic(t.title)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                isCurrent ? 'bg-neutral-800 border border-neutral-700 text-white' : 'hover:bg-neutral-900 text-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${t.cover} flex items-center justify-center`}>
                  <Disc size={14} className="text-white" />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-neutral-300'}`}>{t.title}</div>
                  <div className="text-[10px] text-neutral-500">{t.artist}</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">{t.duration}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
