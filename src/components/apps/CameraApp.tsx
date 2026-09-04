import React, { useState, useRef, useEffect } from 'react';
import { MonetPalette } from '../../types';
import { Camera, Zap, RefreshCw, Image, Video, Sparkles, Check } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface CameraAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ palette, onClose }) => {
  const [flash, setFlash] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<'photo' | 'video' | 'portrait'>('photo');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [justSnapped, setJustSnapped] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // user denied or no camera, will show simulated viewfinder
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    audioEngine.playShutter();
    setJustSnapped(true);
    setTimeout(() => setJustSnapped(false), 200);

    // Save snapshot placeholder
    const sample = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80';
    setCapturedPhotos([sample, ...capturedPhotos]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-white select-none overflow-hidden relative">
      {/* Flash overlay animation */}
      {justSnapped && <div className="absolute inset-0 z-50 bg-white animate-fade-out" />}

      {/* Top Toolbar */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => {
            audioEngine.playClick();
            setFlash(!flash);
          }}
          className={`p-2 rounded-full ${flash ? 'bg-amber-400 text-black' : 'bg-black/40 text-white'}`}
        >
          <Zap size={18} />
        </button>

        <span className="text-xs font-mono uppercase tracking-widest text-white/70">
          RAW 50MP
        </span>

        <button
          onClick={() => {
            audioEngine.playClick();
            setZoom(zoom === 1 ? 2 : zoom === 2 ? 5 : 1);
          }}
          className="px-2.5 py-1 rounded-full bg-black/40 border border-white/20 text-xs font-mono text-white"
        >
          {zoom}x
        </button>
      </div>

      {/* Viewfinder */}
      <div className="relative flex-1 bg-neutral-900 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Framing Grid overlay */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10 opacity-30">
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
        </div>

        {/* Center Focus Reticle */}
        <div className="absolute w-16 h-16 border-2 border-amber-400/80 rounded-lg pointer-events-none animate-pulse" />
      </div>

      {/* Bottom Mode Switcher & Shutter */}
      <div className="bg-black/90 p-5 flex flex-col items-center space-y-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-6 text-xs font-medium text-white/50">
          {(['portrait', 'photo', 'video'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`capitalize transition-colors ${mode === m ? 'text-amber-400 font-bold' : 'hover:text-white'}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Shutter Bar */}
        <div className="w-full flex items-center justify-between px-6">
          {/* Gallery thumbnail */}
          <div className="w-11 h-11 rounded-full bg-neutral-800 border-2 border-white/30 overflow-hidden flex items-center justify-center">
            {capturedPhotos.length > 0 ? (
              <img src={capturedPhotos[0]} alt="Recent" className="w-full h-full object-cover" />
            ) : (
              <Image size={18} className="text-white/40" />
            )}
          </div>

          {/* Shutter Button */}
          <button
            onClick={handleCapture}
            className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-white hover:bg-neutral-200 transition-colors" />
          </button>

          {/* Flip camera */}
          <button
            onClick={() => audioEngine.playClick()}
            className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center text-white/80 hover:text-white"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
