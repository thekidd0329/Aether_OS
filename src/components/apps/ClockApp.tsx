import React, { useState, useEffect } from 'react';
import { MonetPalette } from '../../types';
import { Clock, Play, Pause, RotateCcw, Timer, Flag, AlarmClock } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface ClockAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

export const ClockApp: React.FC<ClockAppProps> = ({ palette, onClose }) => {
  const [tab, setTab] = useState<'clock' | 'stopwatch' | 'timer'>('clock');
  const [time, setTime] = useState(new Date());

  // Stopwatch state
  const [swRunning, setSwRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (swRunning) {
      interval = setInterval(() => {
        setSwTime((t) => t + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((s) => {
          if (s <= 1) {
            audioEngine.playTone(880, 1200, 0.8);
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatStopwatch = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white select-none">
      {/* Header Tabs */}
      <div className="p-3 flex items-center justify-around border-b border-neutral-800 bg-neutral-900/60">
        <button
          onClick={() => setTab('clock')}
          className={`flex items-center gap-1.5 text-xs font-semibold pb-1 ${
            tab === 'clock' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400'
          }`}
        >
          <Clock size={13} />
          <span>Clock</span>
        </button>
        <button
          onClick={() => setTab('stopwatch')}
          className={`flex items-center gap-1.5 text-xs font-semibold pb-1 ${
            tab === 'stopwatch' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400'
          }`}
        >
          <Timer size={13} />
          <span>Stopwatch</span>
        </button>
        <button
          onClick={() => setTab('timer')}
          className={`flex items-center gap-1.5 text-xs font-semibold pb-1 ${
            tab === 'timer' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-neutral-400'
          }`}
        >
          <AlarmClock size={13} />
          <span>Timer</span>
        </button>
      </div>

      {/* CLOCK TAB */}
      {tab === 'clock' && (
        <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <div className="text-5xl font-extrabold tracking-tight font-mono text-white">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-sm font-medium text-neutral-400 mt-1">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="w-full max-w-xs bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
              World Clocks
            </span>
            <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-800">
              <span className="font-semibold">Tokyo</span>
              <span className="font-mono text-neutral-300">
                {new Date(time.getTime() + 16 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-800">
              <span className="font-semibold">London</span>
              <span className="font-mono text-neutral-300">
                {new Date(time.getTime() + 8 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs py-1">
              <span className="font-semibold">New York</span>
              <span className="font-mono text-neutral-300">
                {new Date(time.getTime() + 3 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STOPWATCH TAB */}
      {tab === 'stopwatch' && (
        <div className="flex-1 p-6 flex flex-col justify-between items-center">
          <div className="flex-1 flex items-center justify-center">
            <span className="text-5xl font-extrabold font-mono tracking-tight text-white">
              {formatStopwatch(swTime)}
            </span>
          </div>

          {/* Laps */}
          <div className="w-full max-h-36 overflow-y-auto space-y-1 my-2">
            {laps.map((lap, i) => (
              <div key={i} className="flex justify-between text-xs font-mono p-1.5 bg-neutral-900 rounded-lg text-neutral-300">
                <span>Lap {laps.length - i}</span>
                <span>{formatStopwatch(lap)}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="w-full flex items-center justify-around mt-4">
            <button
              onClick={() => {
                audioEngine.playClick();
                setSwRunning(false);
                setSwTime(0);
                setLaps([]);
              }}
              className="p-3.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={() => {
                audioEngine.playClick(swRunning ? 600 : 900, 'triangle', 0.04);
                setSwRunning(!swRunning);
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center text-neutral-950 font-bold shadow-lg"
              style={{ backgroundColor: palette.primary }}
            >
              {swRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>

            <button
              onClick={() => {
                if (swRunning) {
                  audioEngine.playClick();
                  setLaps([swTime, ...laps]);
                }
              }}
              disabled={!swRunning}
              className={`p-3.5 rounded-full bg-neutral-800 ${swRunning ? 'text-white' : 'text-neutral-600'}`}
            >
              <Flag size={20} />
            </button>
          </div>
        </div>
      )}

      {/* TIMER TAB */}
      {tab === 'timer' && (
        <div className="flex-1 p-6 flex flex-col justify-between items-center">
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <span className="text-6xl font-extrabold font-mono tracking-tight" style={{ color: palette.primary }}>
              {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </span>

            {/* Presets */}
            <div className="flex gap-2">
              {[30, 60, 300, 600].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    audioEngine.playClick();
                    setTimerSeconds(sec);
                    setTimerRunning(false);
                  }}
                  className="px-2.5 py-1 rounded-full bg-neutral-800 text-xs text-neutral-300 hover:text-white"
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-around">
            <button
              onClick={() => {
                audioEngine.playClick();
                setTimerRunning(false);
                setTimerSeconds(60);
              }}
              className="p-3.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={() => {
                audioEngine.playClick(timerRunning ? 600 : 900, 'triangle', 0.04);
                setTimerRunning(!timerRunning);
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center text-neutral-950 font-bold shadow-lg"
              style={{ backgroundColor: palette.primary }}
            >
              {timerRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
