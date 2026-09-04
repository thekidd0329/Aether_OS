import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import {
  Compass,
  MapPin,
  Navigation,
  Radio,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Globe,
  Satellite,
  X,
  Crosshair,
  Layers,
  FastForward,
  Terminal,
} from 'lucide-react';

interface MockLocationPreset {
  id: string;
  name: string;
  locationName: string;
  lat: number;
  lng: number;
  altMeters: number;
  accuracyMeters: number;
  description: string;
}

const PRESETS: MockLocationPreset[] = [
  {
    id: 'tokyo_shibuya',
    name: 'Neo Tokyo · Shibuya Crossing',
    locationName: 'Shibuya, Tokyo, Japan',
    lat: 35.6595,
    lng: 139.7004,
    altMeters: 42.0,
    accuracyMeters: 1.2,
    description: 'Dense metropolitan multipath with dual-band L1/L5 GNSS lock.',
  },
  {
    id: 'silicon_valley',
    name: 'Silicon Valley · Googleplex Core',
    locationName: 'Mountain View, California, USA',
    lat: 37.4220,
    lng: -122.0841,
    altMeters: 14.5,
    accuracyMeters: 0.8,
    description: 'Quantum Tensor headquarters ground node.',
  },
  {
    id: 'cern_switzerland',
    name: 'CERN · Large Hadron Collider',
    locationName: 'Geneva, Switzerland',
    lat: 46.2330,
    lng: 6.0557,
    altMeters: 440.0,
    accuracyMeters: 0.5,
    description: 'Subterranean particle accelerator reference benchmark.',
  },
  {
    id: 'london_westminster',
    name: 'London · Westminster Matrix',
    locationName: 'London, United Kingdom',
    lat: 51.4994,
    lng: -0.1248,
    altMeters: 12.0,
    accuracyMeters: 1.5,
    description: 'High-precision European Galileo satellite anchor.',
  },
  {
    id: 'iss_orbit',
    name: 'ISS · Low Earth Orbit (LEO)',
    locationName: '408 km Altitude Orbit',
    lat: -12.4501,
    lng: 45.3219,
    altMeters: 408000.0,
    accuracyMeters: 0.2,
    description: 'Orbital velocity 27,600 km/h Doppler shift simulation.',
  },
];

interface MarkGpsEngineProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLocation?: (lat: number, lng: number, locationName: string) => void;
}

export const MarkGpsEngine: React.FC<MarkGpsEngineProps> = ({
  isOpen,
  onClose,
  onApplyLocation,
}) => {
  // Coordinates State
  const [lat, setLat] = useState<number>(37.4220);
  const [lng, setLng] = useState<number>(-122.0841);
  const [altitude, setAltitude] = useState<number>(14.5);
  const [accuracy, setAccuracy] = useState<number>(1.2);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [bearingDeg, setBearingDeg] = useState<number>(142);
  const [isMockActive, setIsMockActive] = useState<boolean>(true);

  // Route Simulation State
  const [isRouteSimulating, setIsRouteSimulating] = useState<boolean>(false);
  const [routeSpeedMultiplier, setRouteSpeedMultiplier] = useState<number>(1);
  const [activePresetId, setActivePresetId] = useState<string>('silicon_valley');
  const [activeTab, setActiveTab] = useState<'coordinates' | 'satellites' | 'nmea' | 'route'>('coordinates');

  // Simulated GNSS Satellites in Sky
  const [satellites] = useState([
    { prn: 'G03', system: 'GPS (USA)', azimuth: 45, elevation: 62, snr: 44, locked: true },
    { prn: 'G14', system: 'GPS (USA)', azimuth: 120, elevation: 78, snr: 48, locked: true },
    { prn: 'G22', system: 'GPS (USA)', azimuth: 210, elevation: 34, snr: 39, locked: true },
    { prn: 'E08', system: 'Galileo (EU)', azimuth: 85, elevation: 55, snr: 46, locked: true },
    { prn: 'E19', system: 'Galileo (EU)', azimuth: 310, elevation: 42, snr: 41, locked: true },
    { prn: 'R07', system: 'GLONASS (RU)', azimuth: 160, elevation: 68, snr: 43, locked: true },
    { prn: 'B02', system: 'BeiDou (CN)', azimuth: 280, elevation: 80, snr: 49, locked: true },
    { prn: 'Q01', system: 'QZSS (JP)', azimuth: 195, elevation: 85, snr: 51, locked: true },
  ]);

  // NMEA Stream Logs
  const [nmeaLogs, setNmeaLogs] = useState<string[]>([]);

  // Simulation tick loop
  useEffect(() => {
    let interval: any;
    if (isMockActive) {
      interval = setInterval(() => {
        const now = new Date();
        const timeStr = now.toISOString().replace(/[-:T]/g, '').slice(8, 14) + '.00';
        const latNmea = `${Math.abs(lat).toFixed(4)},${lat >= 0 ? 'N' : 'S'}`;
        const lngNmea = `${Math.abs(lng).toFixed(4)},${lng >= 0 ? 'E' : 'W'}`;

        const gpgga = `$GPGGA,${timeStr},${latNmea},${lngNmea},1,08,0.9,${altitude.toFixed(1)},M,46.9,M,,*47`;
        const gprmc = `$GPRMC,${timeStr},A,${latNmea},${lngNmea},${(speedKmh * 0.539957).toFixed(1)},${bearingDeg.toFixed(1)},020926,,,A*73`;
        const gpvtg = `$GPVTG,${bearingDeg.toFixed(1)},T,,M,${(speedKmh * 0.539957).toFixed(1)},N,${speedKmh.toFixed(1)},K,A*32`;

        setNmeaLogs((prev) => [gpgga, gprmc, gpvtg, ...prev.slice(0, 30)]);

        // If route simulation is active, drift coordinates in direction of bearing
        if (isRouteSimulating) {
          const delta = (speedKmh || 45) * 0.000002 * routeSpeedMultiplier;
          const rad = (bearingDeg * Math.PI) / 180;
          setLat((prev) => prev + Math.cos(rad) * delta);
          setLng((prev) => prev + Math.sin(rad) * delta);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMockActive, isRouteSimulating, lat, lng, altitude, speedKmh, bearingDeg, routeSpeedMultiplier]);

  const handleSelectPreset = (p: MockLocationPreset) => {
    audioEngine.playRadarPing();
    setActivePresetId(p.id);
    setLat(p.lat);
    setLng(p.lng);
    setAltitude(p.altMeters);
    setAccuracy(p.accuracyMeters);
    if (onApplyLocation) {
      onApplyLocation(p.lat, p.lng, p.name);
    }
  };

  const handleNudge = (dLat: number, dLng: number) => {
    audioEngine.playOrbitalTick(1100);
    setLat((prev) => +(prev + dLat).toFixed(6));
    setLng((prev) => +(prev + dLng).toFixed(6));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/96 backdrop-blur-2xl text-slate-100 select-none animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* 1. TOP HEADER & INJECTION STATUS */}
      <div className="p-4 border-b border-sky-500/20 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono font-bold tracking-wider text-emerald-300 uppercase">
                Mark GPS & GNSS Engine
              </h2>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                isMockActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isMockActive ? 'SPOOF ACTIVE' : 'REAL GNSS'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-sky-400/80">
              L1/L5 Carrier Phase Synthesizer · 8 Satellites Locked
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            audioEngine.playOrbitalTick(600);
            onClose();
          }}
          className="w-7 h-7 rounded-full bg-slate-800 border border-sky-500/30 flex items-center justify-center text-sky-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. TAB CONTROLS */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-950 border-b border-sky-500/15 overflow-x-auto no-scrollbar">
        {[
          { id: 'coordinates', label: 'Coordinates Spoofer', icon: Crosshair },
          { id: 'satellites', label: 'GNSS Constellation (8)', icon: Satellite },
          { id: 'route', label: 'Route Simulator', icon: Navigation },
          { id: 'nmea', label: 'NMEA 0183 Stream', icon: Terminal },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                audioEngine.playOrbitalTick(850);
                setActiveTab(t.id as any);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                  : 'bg-slate-900/80 text-sky-300/70 border border-sky-500/15 hover:text-sky-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB VIEWPORTS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* A. COORDINATES TAB */}
        {activeTab === 'coordinates' && (
          <div className="space-y-4">
            {/* Live Spoofed Coordinates Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  Broadcasted Location Vectors
                </span>
                <button
                  onClick={() => {
                    audioEngine.playActionExecute();
                    setIsMockActive(!isMockActive);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    isMockActive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isMockActive ? 'Injecting to OS' : 'Disabled'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-sky-500/20">
                  <span className="text-[10px] text-sky-400/70 block">LATITUDE</span>
                  <span className="text-sm font-bold text-white">{lat.toFixed(6)}°</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-sky-500/20">
                  <span className="text-[10px] text-sky-400/70 block">LONGITUDE</span>
                  <span className="text-sm font-bold text-white">{lng.toFixed(6)}°</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-sky-500/20">
                  <span className="text-[10px] text-sky-400/70 block">ALTITUDE</span>
                  <span className="text-sm font-bold text-white">{altitude.toFixed(1)} m</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-sky-500/20">
                  <span className="text-[10px] text-sky-400/70 block">ACCURACY (HPE)</span>
                  <span className="text-sm font-bold text-emerald-400">±{accuracy.toFixed(1)} m</span>
                </div>
              </div>

              {/* D-PAD Joystick Nudge Buttons */}
              <div className="pt-2 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono text-sky-400/70">FINE-TUNE JOYSTICK NUDGE</span>
                <button
                  onClick={() => handleNudge(0.0002, 0)}
                  className="w-12 h-8 rounded-lg bg-slate-800 hover:bg-emerald-500/30 border border-sky-500/30 text-xs font-mono font-bold text-sky-200 flex items-center justify-center"
                >
                  ▲ N
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNudge(0, -0.0002)}
                    className="w-12 h-8 rounded-lg bg-slate-800 hover:bg-emerald-500/30 border border-sky-500/30 text-xs font-mono font-bold text-sky-200 flex items-center justify-center"
                  >
                    ◀ W
                  </button>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[10px] font-mono text-emerald-300">
                    GPS
                  </div>
                  <button
                    onClick={() => handleNudge(0, 0.0002)}
                    className="w-12 h-8 rounded-lg bg-slate-800 hover:bg-emerald-500/30 border border-sky-500/30 text-xs font-mono font-bold text-sky-200 flex items-center justify-center"
                  >
                    E ▶
                  </button>
                </div>
                <button
                  onClick={() => handleNudge(-0.0002, 0)}
                  className="w-12 h-8 rounded-lg bg-slate-800 hover:bg-emerald-500/30 border border-sky-500/30 text-xs font-mono font-bold text-sky-200 flex items-center justify-center"
                >
                  ▼ S
                </button>
              </div>
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-sky-300 font-bold uppercase tracking-wider block">
                Target Location Presets
              </span>
              <div className="grid grid-cols-1 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      activePresetId === p.id
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                        : 'bg-slate-900/80 border-sky-500/15 hover:border-sky-400/50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-sky-300/70 font-mono mt-0.5">
                        {p.lat.toFixed(4)}°, {p.lng.toFixed(4)}° · {p.locationName}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1">{p.description}</p>
                    </div>
                    {activePresetId === p.id && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* B. SATELLITES TAB */}
        {activeTab === 'satellites' && (
          <div className="space-y-4">
            {/* Polar Sky Map */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30 flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-sky-300 uppercase mb-3">
                Polar Sky View Constellation
              </span>
              <div className="relative w-48 h-48 rounded-full border border-sky-500/30 bg-slate-950 flex items-center justify-center">
                {/* Concentric rings */}
                <div className="absolute w-36 h-36 rounded-full border border-sky-500/20" />
                <div className="absolute w-24 h-24 rounded-full border border-sky-500/20" />
                <div className="absolute w-12 h-12 rounded-full border border-sky-500/20" />
                {/* Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-sky-500/20" />
                  <div className="h-full w-[1px] bg-sky-500/20 absolute" />
                </div>
                {/* Simulated satellite blips */}
                {satellites.map((s, idx) => {
                  const rad = (s.azimuth * Math.PI) / 180;
                  const dist = ((90 - s.elevation) / 90) * 80;
                  const x = Math.cos(rad) * dist;
                  const y = Math.sin(rad) * dist;
                  return (
                    <div
                      key={idx}
                      className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 border border-slate-950 flex items-center justify-center text-[7px] font-mono font-bold text-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                      title={`${s.prn} (${s.system})`}
                    >
                      {s.prn.slice(1)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Satellite Signal SNR Bars */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-sky-300 font-bold uppercase tracking-wider block">
                Carrier-to-Noise Ratio (C/N0 dB-Hz)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {satellites.map((s) => (
                  <div key={s.prn} className="p-2.5 rounded-xl bg-slate-900 border border-sky-500/20 text-xs font-mono">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-bold text-white">{s.prn} · {s.system}</span>
                      <span className="text-emerald-400">{s.snr} dB-Hz</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${(s.snr / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* C. ROUTE SIMULATOR TAB */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30 space-y-3">
              <span className="text-xs font-mono font-bold text-sky-300 uppercase">
                Dynamic Waypoint Motion Generator
              </span>
              <p className="text-xs text-slate-300">
                Simulates real walking or vehicular navigation with continuous velocity, Doppler shift, and turn angles.
              </p>

              {/* Speed & Multiplier Controls */}
              <div className="space-y-2 pt-2 border-t border-sky-500/20">
                <div className="flex justify-between text-xs font-mono">
                  <span>Simulation Speed</span>
                  <span className="text-emerald-400">{speedKmh} km/h ({(speedKmh * 0.621371).toFixed(1)} mph)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={speedKmh}
                  onChange={(e) => setSpeedKmh(+e.target.value)}
                  className="w-full accent-emerald-400"
                />

                <div className="flex justify-between text-xs font-mono pt-2">
                  <span>Heading Bearing</span>
                  <span className="text-sky-300">{bearingDeg}° Azimuth</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={bearingDeg}
                  onChange={(e) => setBearingDeg(+e.target.value)}
                  className="w-full accent-sky-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={() => {
                    audioEngine.playActionExecute();
                    setIsRouteSimulating(!isRouteSimulating);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 ${
                    isRouteSimulating
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                  }`}
                >
                  {isRouteSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isRouteSimulating ? 'Pause Route Simulation' : 'Start Path Simulation'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* D. NMEA TERMINAL TAB */}
        {activeTab === 'nmea' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-300 font-bold uppercase">
                Raw GNSS NMEA 0183 Serial Stream
              </span>
              <button
                onClick={() => setNmeaLogs([])}
                className="text-[10px] font-mono text-sky-400 hover:text-white"
              >
                Clear Stream
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-emerald-500/40 font-mono text-[11px] text-emerald-400 h-64 overflow-y-auto space-y-1 select-text">
              {nmeaLogs.map((line, i) => (
                <div key={i} className="leading-tight hover:bg-emerald-950/40 px-1 rounded">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
