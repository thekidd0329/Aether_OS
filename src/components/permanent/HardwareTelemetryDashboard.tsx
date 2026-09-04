import React, { useState, useEffect, useRef } from 'react';
import {
  BarometerTelemetry,
  MagnetometerTelemetry,
  MotionTelemetry,
  RamTelemetry,
  ThermalTelemetry,
  SystemProcessNode,
} from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import {
  Activity,
  Cpu,
  Compass,
  Gauge,
  Thermometer,
  Zap,
  Layers,
  RotateCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const INITIAL_PROCESSES: SystemProcessNode[] = [
  { pid: 1042, name: 'aether_concierge.ui', cpuPercent: 1.2, ramMb: 142, priority: 'PRIO_TOP', threadsCount: 18, state: 'running' },
  { pid: 820, name: 'tensor_fusion_npu_daemon', cpuPercent: 2.8, ramMb: 380, priority: 'REALTIME', threadsCount: 32, state: 'running' },
  { pid: 412, name: 'surfaceflinger.pixel10', cpuPercent: 1.9, ramMb: 210, priority: 'HIGH', threadsCount: 14, state: 'running' },
  { pid: 189, name: 'system_server.core', cpuPercent: 3.4, ramMb: 520, priority: 'NORMAL', threadsCount: 88, state: 'running' },
  { pid: 1337, name: 'audio_dsp_spatial_engine', cpuPercent: 0.8, ramMb: 94, priority: 'REALTIME', threadsCount: 8, state: 'running' },
  { pid: 2104, name: 'location_fused_gnss', cpuPercent: 0.5, ramMb: 76, priority: 'LOW', threadsCount: 6, state: 'sleeping' },
  { pid: 3290, name: 'cached_media_provider', cpuPercent: 0.1, ramMb: 290, priority: 'BACKGROUND', threadsCount: 12, state: 'sleeping' },
  { pid: 4892, name: 'background_telemetry_stub', cpuPercent: 0.0, ramMb: 180, priority: 'IDLE', threadsCount: 4, state: 'isolated' },
];

export const HardwareTelemetryDashboard: React.FC = () => {
  // Environmental Sensor States
  const [barometer, setBarometer] = useState<BarometerTelemetry>({
    pressureHpa: 1013.42,
    altitudeMeters: 148.6,
    pressureTrend: 'steady',
    deltaElevMeters: 0.2,
  });

  const [magnetometer, setMagnetometer] = useState<MagnetometerTelemetry>({
    xMicroTesla: -18.2,
    yMicroTesla: 34.6,
    zMicroTesla: -42.8,
    totalFlux: 58.1,
    headingAzimuth: 284,
    compassBearing: 'WNW',
    accuracy: 'high',
  });

  const [motion, setMotion] = useState<MotionTelemetry>({
    accelX: 0.04,
    accelY: 0.12,
    accelZ: 9.81,
    gyroX: 0.01,
    gyroY: -0.02,
    gyroZ: 0.0,
    gForce: 1.0,
    pitchDeg: 12.4,
    rollDeg: -4.8,
  });

  // RAM Analytics
  const [ram, setRam] = useState<RamTelemetry>({
    totalGb: 16.0,
    usedGb: 9.4,
    freeGb: 3.2,
    cachedGb: 3.4,
    dirtyPagesMb: 48,
    timeSeries: [54, 56, 55, 58, 60, 59, 61, 58, 62, 59, 58, 59],
  });

  // SoC Thermals
  const [thermals, setThermals] = useState<ThermalTelemetry>({
    cpuClusterPrimeC: 37.4,
    cpuClusterMidC: 35.2,
    cpuClusterEfficiencyC: 32.8,
    gpuC: 36.6,
    tpuNpuC: 34.1,
    batteryC: 31.4,
    throttlingState: 'optimal',
    thermalHeadroomPercent: 94,
  });

  // Process list state
  const [processes, setProcesses] = useState<SystemProcessNode[]>(INITIAL_PROCESSES);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [reclaimedMb, setReclaimedMb] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'sensors' | 'analytics' | 'tasks'>('sensors');

  // Real-time sensor micro-fluctuations (Non-rooted SensorManager loop simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate barometer slightly
      setBarometer((prev) => {
        const delta = (Math.random() - 0.5) * 0.08;
        const newPress = Number((prev.pressureHpa + delta).toFixed(2));
        const newAlt = Number((prev.altitudeMeters - delta * 8.3).toFixed(1));
        return {
          ...prev,
          pressureHpa: newPress,
          altitudeMeters: newAlt,
          pressureTrend: delta > 0.02 ? 'rising' : delta < -0.02 ? 'falling' : 'steady',
          deltaElevMeters: Number((Math.random() * 0.4 - 0.2).toFixed(1)),
        };
      });

      // Fluctuate Magnetometer heading
      setMagnetometer((prev) => {
        const azimuthDelta = (Math.random() - 0.5) * 1.5;
        let newAzimuth = Math.round((prev.headingAzimuth + azimuthDelta + 360) % 360);
        let bearing = 'N';
        if (newAzimuth >= 22.5 && newAzimuth < 67.5) bearing = 'NE';
        else if (newAzimuth >= 67.5 && newAzimuth < 112.5) bearing = 'E';
        else if (newAzimuth >= 112.5 && newAzimuth < 157.5) bearing = 'SE';
        else if (newAzimuth >= 157.5 && newAzimuth < 202.5) bearing = 'S';
        else if (newAzimuth >= 202.5 && newAzimuth < 247.5) bearing = 'SW';
        else if (newAzimuth >= 247.5 && newAzimuth < 292.5) bearing = 'W';
        else if (newAzimuth >= 292.5 && newAzimuth < 337.5) bearing = 'NW';

        return {
          ...prev,
          headingAzimuth: newAzimuth,
          compassBearing: bearing,
          xMicroTesla: Number((prev.xMicroTesla + (Math.random() - 0.5) * 0.2).toFixed(1)),
          yMicroTesla: Number((prev.yMicroTesla + (Math.random() - 0.5) * 0.2).toFixed(1)),
        };
      });

      // Fluctuate Motion
      setMotion((prev) => {
        const ax = Number(((Math.random() - 0.5) * 0.1).toFixed(2));
        const ay = Number(((Math.random() - 0.5) * 0.1).toFixed(2));
        return {
          ...prev,
          accelX: ax,
          accelY: ay,
          pitchDeg: Number((prev.pitchDeg + (Math.random() - 0.5) * 0.4).toFixed(1)),
          rollDeg: Number((prev.rollDeg + (Math.random() - 0.5) * 0.4).toFixed(1)),
        };
      });

      // Update RAM time-series
      setRam((prev) => {
        const currentPct = Math.round((prev.usedGb / prev.totalGb) * 100);
        const jitter = Math.round((Math.random() - 0.5) * 2);
        const nextVal = Math.min(95, Math.max(30, currentPct + jitter));
        const newSeries = [...prev.timeSeries.slice(1), nextVal];
        return {
          ...prev,
          timeSeries: newSeries,
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // 1-Tap Cache & Background Thread Killswitch (TRIM_MEMORY_RUNNING_CRITICAL)
  const handleExecuteKillswitch = () => {
    setIsCleaning(true);
    audioEngine.playActionExecute();

    setTimeout(() => {
      // Simulate memory reclaimed
      const freedMb = 1420;
      setReclaimedMb(freedMb);

      // Kill background processes
      setProcesses((prev) =>
        prev.map((p) =>
          p.priority === 'BACKGROUND' || p.priority === 'IDLE'
            ? { ...p, ramMb: 12, cpuPercent: 0, state: 'isolated' }
            : p
        )
      );

      // Update RAM
      setRam((prev) => ({
        ...prev,
        usedGb: 7.9,
        freeGb: 4.7,
        cachedGb: 1.4,
        dirtyPagesMb: 6,
        timeSeries: [...prev.timeSeries.slice(1), 49],
      }));

      setIsCleaning(false);
      audioEngine.playOrbitalTick(1200);
    }, 700);
  };

  return (
    <div className="flex flex-col gap-3 text-sky-100 font-sans">
      
      {/* 1. Header & Navigation Sub-Tabs */}
      <div className="flex items-center justify-between pb-1 border-b border-sky-500/20">
        <div className="flex items-center gap-2 text-left">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
            Pixel 10 Pro Telemetry Matrix
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-sky-500/30 text-[10px] font-mono">
          <button
            onClick={() => {
              audioEngine.playOrbitalTick(700);
              setActiveTab('sensors');
            }}
            className={`px-2 py-1 rounded-lg transition-all ${
              activeTab === 'sensors'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                : 'text-sky-400/70 hover:text-sky-300'
            }`}
          >
            Sensors
          </button>

          <button
            onClick={() => {
              audioEngine.playOrbitalTick(850);
              setActiveTab('analytics');
            }}
            className={`px-2 py-1 rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                : 'text-sky-400/70 hover:text-sky-300'
            }`}
          >
            RAM & SoC
          </button>

          <button
            onClick={() => {
              audioEngine.playOrbitalTick(1000);
              setActiveTab('tasks');
            }}
            className={`px-2 py-1 rounded-lg transition-all ${
              activeTab === 'tasks'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                : 'text-sky-400/70 hover:text-sky-300'
            }`}
          >
            Tasks
          </button>
        </div>
      </div>

      {/* 2. SENSORS TAB: Barometer, Altimeter, Magnetometer, Gyroscope */}
      {activeTab === 'sensors' && (
        <div className="grid grid-cols-2 gap-2.5 animate-in fade-in duration-200">
          
          {/* A. Barometer & Altimeter Vector Card */}
          <div className="p-3 rounded-2xl bg-slate-900/85 border border-sky-500/30 flex flex-col justify-between text-left shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-sky-400" />
                <span className="text-[11px] font-mono text-sky-300 font-bold">Barometer</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase">
                {barometer.pressureTrend}
              </span>
            </div>

            <div className="my-2">
              <div className="text-xl font-light font-mono text-white tracking-tight">
                {barometer.pressureHpa} <span className="text-xs text-sky-400 font-normal">hPa</span>
              </div>
              <div className="text-[10px] font-mono text-sky-300/80 mt-0.5">
                Elevation: <span className="text-white font-semibold">{barometer.altitudeMeters}m</span> ({barometer.deltaElevMeters > 0 ? `+${barometer.deltaElevMeters}` : barometer.deltaElevMeters}m/s)
              </div>
            </div>

            {/* Pressure gradient bar */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-sky-500/20">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, ((barometer.pressureHpa - 980) / 60) * 100))}%` }}
              />
            </div>
          </div>

          {/* B. Magnetometer & 360° Compass Bearing */}
          <div className="p-3 rounded-2xl bg-slate-900/85 border border-sky-500/30 flex flex-col justify-between text-left shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400 animate-spin-slow" />
                <span className="text-[11px] font-mono text-sky-300 font-bold">Magnetometer</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                {magnetometer.accuracy}
              </span>
            </div>

            <div className="my-1.5 flex items-center justify-between">
              <div>
                <div className="text-xl font-light font-mono text-white tracking-tight">
                  {magnetometer.headingAzimuth}° <span className="text-xs text-sky-400">{magnetometer.compassBearing}</span>
                </div>
                <div className="text-[9px] font-mono text-sky-400/70">
                  Total Flux: {magnetometer.totalFlux} μT
                </div>
              </div>

              {/* Mini Digital Compass Rose Disc */}
              <div className="relative w-10 h-10 rounded-full border border-sky-400/50 bg-slate-950 flex items-center justify-center">
                <div
                  className="w-8 h-8 flex items-center justify-center transition-transform duration-500"
                  style={{ transform: `rotate(${magnetometer.headingAzimuth}deg)` }}
                >
                  <div className="w-1 h-3.5 bg-rose-500 rounded-t-full shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                  <div className="w-1 h-3.5 bg-sky-400 rounded-b-full opacity-60" />
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-sky-400/60 flex justify-between">
              <span>X: {magnetometer.xMicroTesla}</span>
              <span>Y: {magnetometer.yMicroTesla}</span>
              <span>Z: {magnetometer.zMicroTesla}</span>
            </div>
          </div>

          {/* C. Accelerometer & Gyroscope Vector Cluster (Full Width) */}
          <div className="col-span-2 p-3.5 rounded-2xl bg-slate-900/85 border border-sky-500/30 flex flex-col gap-2 text-left shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-sky-400" />
                <span className="text-[11px] font-mono text-sky-300 font-bold">
                  Accelerometer & Gyro Attitude
                </span>
              </div>
              <span className="text-[10px] font-mono text-sky-300">
                G-Force: <strong className="text-white">{motion.gForce.toFixed(2)} G</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-sky-500/20 flex flex-col">
                <span className="text-[9px] font-mono text-sky-400/70">Linear Accel (Z)</span>
                <span className="text-xs font-mono font-semibold text-white">{motion.accelZ} m/s²</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-sky-500/20 flex flex-col">
                <span className="text-[9px] font-mono text-sky-400/70">Pitch Tilt</span>
                <span className="text-xs font-mono font-semibold text-white">{motion.pitchDeg}°</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-sky-500/20 flex flex-col">
                <span className="text-[9px] font-mono text-sky-400/70">Roll Tilt</span>
                <span className="text-xs font-mono font-semibold text-white">{motion.rollDeg}°</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-sky-400/70 flex items-center justify-between border-t border-sky-500/20 pt-1.5">
              <span>Sensor Fusion: Android SensorManager API</span>
              <span className="text-emerald-400">Sampling Rate: 100 Hz</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ANALYTICS TAB: RAM Time Series Graph & Tensor SoC Thermals */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
          
          {/* A. RAM Dynamic Time-Series Vector Graph */}
          <div className="p-3.5 rounded-2xl bg-slate-900/85 border border-sky-500/30 flex flex-col gap-2 text-left shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <span className="text-[11px] font-mono text-sky-300 font-bold">
                  RAM Dynamic Time-Series
                </span>
              </div>
              <span className="text-[10px] font-mono text-sky-300 font-semibold">
                {ram.usedGb.toFixed(1)} / {ram.totalGb} GB LPDDR5X
              </span>
            </div>

            {/* Time series SVG visualizer */}
            <div className="h-20 w-full bg-slate-950/90 rounded-xl p-2 border border-sky-500/20 relative flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 110 50">
                <defs>
                  <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <polygon
                  points={`0,50 ${ram.timeSeries.map((val, idx) => `${idx * 10},${50 - (val / 100) * 45}`).join(' ')} 110,50`}
                  fill="url(#ramGrad)"
                />
                {/* Line path */}
                <polyline
                  points={ram.timeSeries.map((val, idx) => `${idx * 10},${50 - (val / 100) * 45}`).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute top-2 left-2 text-[9px] font-mono text-sky-400/80">
                Dirty Pages: {ram.dirtyPagesMb} MB · Cached: {ram.cachedGb} GB
              </div>
              <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400">
                {Math.round((ram.usedGb / ram.totalGb) * 100)}% Utilized
              </div>
            </div>

            {/* Memory breakdown pills */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-sky-500/20">
                <span className="text-sky-400/70 block text-[8px]">In-Use</span>
                <span className="text-white font-semibold">{ram.usedGb} GB</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-sky-500/20">
                <span className="text-sky-400/70 block text-[8px]">Cached/Buffer</span>
                <span className="text-white font-semibold">{ram.cachedGb} GB</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-sky-500/20">
                <span className="text-sky-400/70 block text-[8px]">Free Available</span>
                <span className="text-emerald-400 font-semibold">{ram.freeGb} GB</span>
              </div>
            </div>
          </div>

          {/* B. Tensor G5 SoC Multi-Cluster Thermals */}
          <div className="p-3.5 rounded-2xl bg-slate-900/85 border border-sky-500/30 flex flex-col gap-2 text-left shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-sky-400" />
                <span className="text-[11px] font-mono text-sky-300 font-bold">
                  Tensor G5 SoC & Battery Thermals
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                {thermals.throttlingState} ({thermals.thermalHeadroomPercent}% headroom)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl bg-slate-950/90 border border-sky-500/20">
                <span className="text-[9px] font-mono text-sky-400/70 block">Prime X4</span>
                <span className="text-xs font-mono font-bold text-white">{thermals.cpuClusterPrimeC}°C</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/90 border border-sky-500/20">
                <span className="text-[9px] font-mono text-sky-400/70 block">Mid A720</span>
                <span className="text-xs font-mono font-bold text-white">{thermals.cpuClusterMidC}°C</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/90 border border-sky-500/20">
                <span className="text-[9px] font-mono text-sky-400/70 block">TPU NPU</span>
                <span className="text-xs font-mono font-bold text-emerald-300">{thermals.tpuNpuC}°C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TASKS TAB: Thread Inspector & 1-Tap Cache Killswitch */}
      {activeTab === 'tasks' && (
        <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
          
          {/* 1-Tap Killswitch Action Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-950/90 via-slate-900 to-sky-950/90 border border-sky-400/40 flex items-center justify-between text-left shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Resource Killswitch & Memory Trim</span>
              </span>
              <span className="text-[10px] font-mono text-sky-300/80">
                Evicts zombie caches · Halts background thread drag
              </span>
            </div>

            <button
              onClick={handleExecuteKillswitch}
              disabled={isCleaning}
              className="px-3 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 active:scale-95 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(56,189,248,0.5)] disabled:opacity-50"
            >
              {isCleaning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Trimming...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Trim RAM</span>
                </>
              )}
            </button>
          </div>

          {reclaimedMb !== null && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono flex items-center justify-between animate-in zoom-in-95">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Memory Trim Completed</span>
              </span>
              <span className="font-bold">+{reclaimedMb} MB Reclaimed</span>
            </div>
          )}

          {/* Live Thread Inspector List */}
          <div className="p-3 rounded-2xl bg-slate-900/85 border border-sky-500/30 flex flex-col gap-2 text-left shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between text-[11px] font-mono text-sky-300 font-bold border-b border-sky-500/20 pb-1.5">
              <span>Active Kernel & App Threads</span>
              <span className="text-[10px] text-sky-400/80">{processes.length} Processes</span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {processes.map((proc) => (
                <div
                  key={proc.pid}
                  className="p-2 rounded-xl bg-slate-950/80 border border-sky-500/15 flex items-center justify-between text-[10px] font-mono"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-semibold flex items-center gap-1">
                      <span className="text-sky-400/70">PID {proc.pid}:</span> {proc.name}
                    </span>
                    <span className="text-[9px] text-sky-400/60">
                      {proc.threadsCount} threads · {proc.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sky-300">{proc.ramMb} MB</span>
                    <span className="px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-white font-semibold">
                      {proc.cpuPercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
