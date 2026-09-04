import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import {
  MessageSquare,
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneForwarded,
  MapPin,
  Mail,
  HardDrive,
  Calendar as CalendarIcon,
  FileText,
  Image as ImageIcon,
  PlaySquare,
  Video,
  Search,
  Plus,
  Send,
  Trash2,
  Star,
  Archive,
  Volume2,
  Mic,
  MicOff,
  Check,
  CheckCheck,
  ChevronLeft,
  Share2,
  Clock,
  Compass,
  Navigation,
  Sparkles,
  Sliders,
  Shield,
  Layers,
  Smile,
  Paperclip,
  Radio,
  X,
  Play,
  Pause,
  SkipForward,
  Info,
  Maximize2,
  RefreshCw,
  Folder,
  File,
  Eye,
  Edit3,
} from 'lucide-react';

export type GoogleAppTab =
  | 'messages'
  | 'phone'
  | 'maps'
  | 'gmail'
  | 'drive'
  | 'calendar'
  | 'keep'
  | 'photos'
  | 'youtube'
  | 'meet';

interface GoogleSuitePortalProps {
  initialTab?: GoogleAppTab;
  onClose: () => void;
  onOpenMockGps?: () => void;
}

export const GoogleSuitePortal: React.FC<GoogleSuitePortalProps> = ({
  initialTab = 'messages',
  onClose,
  onOpenMockGps,
}) => {
  const [activeTab, setActiveTab] = useState<GoogleAppTab>(initialTab);

  // -------------------------------------------------------------
  // 1. MESSAGES (SMS & RCS) STATE
  // -------------------------------------------------------------
  const [conversations, setConversations] = useState([
    {
      id: 'c1',
      name: 'Dr. Evelyn Vance',
      number: '+1 (555) 438-9021',
      avatarColor: 'bg-indigo-600',
      unread: 0,
      protocol: 'RCS (End-to-End Encrypted)',
      messages: [
        { id: 'm1', text: 'Tensor G5 quantum calibration models are compiled.', sender: 'them', time: '10:14 AM', status: 'read' },
        { id: 'm2', text: 'Excellent. Transmitting the neural telemetry packets.', sender: 'me', time: '10:15 AM', status: 'delivered' },
        { id: 'm3', text: 'Ready for the zero-token benchmark?', sender: 'them', time: '10:18 AM', status: 'read' },
      ],
    },
    {
      id: 'c2',
      name: 'Akira Tanaka',
      number: '+81 90-5551-8892',
      avatarColor: 'bg-emerald-600',
      unread: 2,
      protocol: 'SMS (Carrier Network)',
      messages: [
        { id: 'm4', text: 'Flight DL 842 landed in Tokyo.', sender: 'them', time: '8:45 AM', status: 'read' },
        { id: 'm5', text: 'Will rendezvous at Shibuya station 19:00.', sender: 'them', time: '9:00 AM', status: 'read' },
      ],
    },
    {
      id: 'c3',
      name: 'Server Alert System',
      number: '88002',
      avatarColor: 'bg-amber-600',
      unread: 0,
      protocol: 'SMS (Shortcode)',
      messages: [
        { id: 'm6', text: 'Aether Node 04: CPU thermal headroom optimal (38°C). No anomalies detected.', sender: 'them', time: '07:30 AM', status: 'read' },
      ],
    },
  ]);
  const [selectedConvoId, setSelectedConvoId] = useState<string>('c1');
  const [messageInput, setMessageInput] = useState('');

  const activeConvo = conversations.find((c) => c.id === selectedConvoId) || conversations[0];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    audioEngine.playActionExecute();
    const newMsg = {
      id: `m_${Date.now()}`,
      text: messageInput.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === selectedConvoId ? { ...c, messages: [...c.messages, newMsg] } : c))
    );
    setMessageInput('');

    // Auto smart-reply simulation
    setTimeout(() => {
      const autoReply = {
        id: `m_rep_${Date.now()}`,
        text: 'Acknowledged. Processing securely in Aether OS Enclave.',
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConvoId ? { ...c, messages: [...c.messages, autoReply] } : c))
      );
      audioEngine.playOrbitalTick(1400);
    }, 1500);
  };

  // -------------------------------------------------------------
  // 2. PHONE & IN-CALL HUD STATE
  // -------------------------------------------------------------
  const [dialedNumber, setDialedNumber] = useState('');
  const [activeCall, setActiveCall] = useState<{
    contactName: string;
    number: string;
    durationSec: number;
    isMuted: boolean;
    isSpeaker: boolean;
    isHold: boolean;
    isRecording: boolean;
  } | null>(null);

  useEffect(() => {
    let timer: any;
    if (activeCall) {
      timer = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, durationSec: prev.durationSec + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall]);

  const handleDialPress = (digit: string) => {
    audioEngine.playDtmf(digit);
    setDialedNumber((prev) => prev + digit);
  };

  const handleStartCall = (name: string, num: string) => {
    audioEngine.playActionExecute();
    setActiveCall({
      contactName: name || num,
      number: num,
      durationSec: 0,
      isMuted: false,
      isSpeaker: true,
      isHold: false,
      isRecording: true,
    });
  };

  const handleEndCall = () => {
    audioEngine.playLockSound();
    setActiveCall(null);
  };

  // -------------------------------------------------------------
  // 3. MAPS & NAVIGATION STATE
  // -------------------------------------------------------------
  const [mapSearch, setMapSearch] = useState('Googleplex, Mountain View, CA');
  const [mapZoom, setMapZoom] = useState(15);
  const [mapLayer, setMapLayer] = useState<'vector' | 'satellite' | 'traffic'>('vector');
  const [isNavigating, setIsNavigating] = useState(false);
  const [navStep, setNavStep] = useState(0);

  const navigationSteps = [
    { instruction: 'Head north on Charleston Rd toward Shoreline Blvd', dist: '400 m', time: '1 min' },
    { instruction: 'Turn right onto US-101 N toward San Francisco', dist: '12.4 km', time: '11 min' },
    { instruction: 'Take exit 398B for Embarcadero Rd', dist: '650 m', time: '2 min' },
    { instruction: 'Arrive at destination on the right', dist: '100 m', time: '30 sec' },
  ];

  // -------------------------------------------------------------
  // 4. GMAIL STATE
  // -------------------------------------------------------------
  const [emails, setEmails] = useState([
    {
      id: 'e1',
      sender: 'Dr. Julian Sterling',
      email: 'j.sterling@neural-lab.org',
      subject: 'Review: Quantum Tensor G5 Matrix Execution Spec',
      snippet: 'We successfully ran 10,000 parallel tensor pipelines with 0% memory fragmentation...',
      time: '11:20 AM',
      read: false,
      starred: true,
      category: 'Primary',
    },
    {
      id: 'e2',
      sender: 'Google Developer Console',
      email: 'no-reply@google.com',
      subject: 'Pixel 10 Pro AetherOS Native Enclave Verified',
      snippet: 'Your application has satisfied zero-token cloud isolation and local storage safety...',
      time: '9:15 AM',
      read: true,
      starred: false,
      category: 'Updates',
    },
    {
      id: 'e3',
      sender: 'Flight DL 842 Concierge',
      email: 'updates@delta.com',
      subject: 'Your Gate & Boarding Pass Details',
      snippet: 'Boarding commences at Gate B28. Upgraded to Delta One Suite.',
      time: 'Yesterday',
      read: true,
      starred: true,
      category: 'Primary',
    },
  ]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // 5. GOOGLE DRIVE STATE
  // -------------------------------------------------------------
  const [driveFiles] = useState([
    { name: 'Pixel10Pro_Architecture_Schematic.pdf', size: '14.8 MB', modified: '2 hours ago', icon: 'pdf' },
    { name: 'ZeroToken_Enclave_Policy_v4.docx', size: '2.1 MB', modified: 'Yesterday', icon: 'doc' },
    { name: 'Tensor_G5_Neural_Benchmarks.csv', size: '890 KB', modified: '3 days ago', icon: 'sheet' },
    { name: 'Aether_Holographic_Assets.zip', size: '184 MB', modified: 'Aug 29', icon: 'archive' },
  ]);

  // -------------------------------------------------------------
  // 6. KEEP NOTES STATE
  // -------------------------------------------------------------
  const [notes, setNotes] = useState([
    { id: 'n1', title: 'Mark GPS Coordinates', body: '37.4220° N, 122.0841° W (Silicon Valley Node)', color: 'bg-amber-950/70 border-amber-500/40', pinned: true },
    { id: 'n2', title: 'Firewall Whitelist Rules', body: 'Permit local socket IPC on 127.0.0.1:3000. Drop all non-encrypted HTTP packets.', color: 'bg-emerald-950/70 border-emerald-500/40', pinned: true },
    { id: 'n3', title: 'Tokyo Rendezvous', body: 'Meet Akira at Shibuya Sky at 19:00 JST.', color: 'bg-sky-950/70 border-sky-500/40', pinned: false },
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteBody, setNewNoteBody] = useState('');

  // -------------------------------------------------------------
  // 7. YOUTUBE MUSIC STATE
  // -------------------------------------------------------------
  const [ytPlaying, setYtPlaying] = useState(true);
  const [ytProgress, setYtProgress] = useState(38);
  const [ytCurrentTrack] = useState({
    title: 'Cyberpunk Synthwave 2088 - Neural Beats',
    artist: 'Aether Soundscapes & Tensor Audio Lab',
    duration: '3:45',
  });

  const appTabs: { id: GoogleAppTab; label: string; icon: any; color: string }[] = [
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'phone', label: 'Phone', icon: Phone, color: 'text-emerald-400' },
    { id: 'maps', label: 'Maps', icon: MapPin, color: 'text-green-400' },
    { id: 'gmail', label: 'Gmail', icon: Mail, color: 'text-red-400' },
    { id: 'drive', label: 'Drive', icon: HardDrive, color: 'text-yellow-400' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, color: 'text-sky-400' },
    { id: 'keep', label: 'Keep', icon: FileText, color: 'text-amber-400' },
    { id: 'photos', label: 'Photos', icon: ImageIcon, color: 'text-purple-400' },
    { id: 'youtube', label: 'YouTube', icon: PlaySquare, color: 'text-rose-500' },
    { id: 'meet', label: 'Meet', icon: Video, color: 'text-teal-400' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none animate-in fade-in duration-200 overflow-hidden font-sans">
      
      {/* 1. TOP HEADER & APP SELECTOR BAR */}
      <div className="px-3 pt-3 pb-2 border-b border-sky-500/20 bg-slate-900/90 backdrop-blur-xl flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 via-red-500 to-amber-500 flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">G</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold tracking-wider text-sky-200 uppercase">
              Google Unified Suite
            </span>
            <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-[9px] font-mono text-sky-300 border border-sky-500/30">
              In-OS Native
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenMockGps && (
              <button
                onClick={onOpenMockGps}
                className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center gap-1 hover:bg-emerald-500/30"
              >
                <Compass className="w-3 h-3" />
                <span>Mark GPS</span>
              </button>
            )}

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
        </div>

        {/* Scrollable Google Apps Pill Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {appTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playOrbitalTick(900);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN VIEWPORT FOR ACTIVE GOOGLE APP */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-950">
        
        {/* ------------------------------------------------------------- */}
        {/* A. GOOGLE MESSAGES (SMS & RCS)                                */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'messages' && (
          <div className="w-full h-full flex flex-col">
            {/* Conversation Header */}
            <div className="px-4 py-2.5 bg-slate-900/60 border-b border-sky-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${activeConvo.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                  {activeConvo.name[0]}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {activeConvo.name}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-sky-300/80 font-mono">
                    {activeConvo.protocol} · {activeConvo.number}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('phone');
                    handleStartCall(activeConvo.name, activeConvo.number);
                  }}
                  className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                  title="Direct In-App Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
              {activeConvo.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[78%] flex flex-col ${
                    m.sender === 'me' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'me'
                        ? 'bg-sky-500 text-slate-950 font-medium rounded-br-xs shadow-[0_2px_10px_rgba(56,189,248,0.3)]'
                        : 'bg-slate-900 border border-sky-500/20 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1 text-[9px] font-mono text-slate-400">
                    <span>{m.time}</span>
                    {m.sender === 'me' && <CheckCheck className="w-3 h-3 text-sky-400" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick SMS / RCS Composer */}
            <div className="p-3 bg-slate-900/80 border-t border-sky-500/20 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="RCS message (stay inside OS)..."
                className="flex-1 bg-slate-950 border border-sky-500/30 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-2.5 rounded-2xl bg-sky-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-400 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* B. GOOGLE PHONE & IN-CALL HUD                                 */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'phone' && (
          <div className="w-full h-full flex flex-col">
            {activeCall ? (
              /* ACTIVE ONGOING CALL SCREEN */
              <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 items-center text-center">
                <div className="space-y-2 mt-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.4)] animate-pulse">
                    <PhoneCall className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{activeCall.contactName}</h2>
                  <p className="text-xs font-mono text-emerald-400">
                    Active Call ·{' '}
                    {Math.floor(activeCall.durationSec / 60)}:
                    {(activeCall.durationSec % 60).toString().padStart(2, '0')}
                  </p>
                  <p className="text-[10px] font-mono text-sky-400/80">HD Voice 5G VoNR · Zero-Token Scoped</p>
                </div>

                {/* Real-Time Speech Waveform Visualizer */}
                <div className="w-full max-w-xs h-14 bg-slate-900/80 border border-sky-500/30 rounded-2xl p-2 flex items-center justify-center gap-1">
                  {[40, 75, 90, 60, 30, 85, 100, 70, 45, 95, 60, 80, 40, 70, 90].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-emerald-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(10, (h * (0.5 + Math.sin(Date.now() / 300 + i) * 0.5)))}%`,
                        animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Call Control Matrix */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  <button
                    onClick={() => setActiveCall({ ...activeCall, isMuted: !activeCall.isMuted })}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                      activeCall.isMuted
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-slate-900 border-sky-500/20 text-sky-200'
                    }`}
                  >
                    {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span className="text-[10px] font-mono">Mute</span>
                  </button>

                  <button
                    onClick={() => setActiveCall({ ...activeCall, isSpeaker: !activeCall.isSpeaker })}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                      activeCall.isSpeaker
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-900 border-sky-500/20 text-slate-400'
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="text-[10px] font-mono">Speaker</span>
                  </button>

                  <button
                    onClick={() => setActiveCall({ ...activeCall, isRecording: !activeCall.isRecording })}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                      activeCall.isRecording
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-900 border-sky-500/20 text-slate-400'
                    }`}
                  >
                    <Radio className="w-5 h-5" />
                    <span className="text-[10px] font-mono">Record</span>
                  </button>
                </div>

                {/* Hang up button */}
                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.6)] mb-2"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
              </div>
            ) : (
              /* DIALPAD & RECENT CALLS */
              <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
                {/* Number Display */}
                <div className="h-14 flex items-center justify-center border-b border-sky-500/20">
                  <span className="text-xl font-mono tracking-widest text-sky-200">
                    {dialedNumber || 'Dial a Number'}
                  </span>
                  {dialedNumber && (
                    <button
                      onClick={() => setDialedNumber(dialedNumber.slice(0, -1))}
                      className="ml-3 text-xs text-sky-400 hover:text-white"
                    >
                      ⌫
                    </button>
                  )}
                </div>

                {/* DTMF Dialpad Grid */}
                <div className="grid grid-cols-3 gap-2.5 my-2 max-w-xs mx-auto w-full">
                  {[
                    ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
                    ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
                    ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
                    ['*', ''], ['0', '+'], ['#', ''],
                  ].map(([digit, letters]) => (
                    <button
                      key={digit}
                      onClick={() => handleDialPress(digit)}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/20 hover:border-sky-400 hover:bg-slate-800 flex flex-col items-center justify-center transition-all active:scale-95"
                    >
                      <span className="text-lg font-bold text-white leading-none">{digit}</span>
                      {letters && <span className="text-[8px] font-mono text-sky-400/70 tracking-widest">{letters}</span>}
                    </button>
                  ))}
                </div>

                {/* Call Button */}
                <div className="flex justify-center pb-2">
                  <button
                    onClick={() => handleStartCall('Direct Dial', dialedNumber || '+1 (555) 019-2834')}
                    className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.6)]"
                  >
                    <Phone className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* C. GOOGLE MAPS & NAVIGATION                                   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'maps' && (
          <div className="w-full h-full flex flex-col relative bg-slate-950">
            {/* Search and Navigation Bar */}
            <div className="p-3 bg-slate-900/90 border-b border-sky-500/20 flex flex-col gap-2 z-10">
              <div className="flex items-center gap-2 bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-1.5">
                <Search className="w-4 h-4 text-sky-400" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => setIsNavigating(!isNavigating)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 ${
                    isNavigating ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  <Navigation className="w-3 h-3" />
                  <span>{isNavigating ? 'Stop Nav' : 'Start Nav'}</span>
                </button>
              </div>

              {/* Map Layers & Mock GPS link */}
              <div className="flex items-center justify-between text-[10px] font-mono text-sky-300">
                <div className="flex items-center gap-1">
                  {(['vector', 'satellite', 'traffic'] as const).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setMapLayer(layer)}
                      className={`px-2 py-0.5 rounded capitalize ${
                        mapLayer === layer ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-slate-800'
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>

                {onOpenMockGps && (
                  <button
                    onClick={onOpenMockGps}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Spoof GPS Target</span>
                  </button>
                )}
              </div>
            </div>

            {/* Vector Map Canvas / HUD Map */}
            <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

              {/* Roads / Simulated Vector Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 50 300 Q 150 180, 220 220 T 360 120"
                  fill="none"
                  stroke="rgba(56,189,248,0.3)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 50 300 Q 150 180, 220 220 T 360 120"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Location Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-sky-400 border-2 border-white shadow-[0_0_20px_rgba(56,189,248,0.8)] flex items-center justify-center animate-bounce">
                  <div className="w-2 h-2 rounded-full bg-slate-950" />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-sky-500/40 text-[10px] font-mono text-sky-200">
                  Googleplex Core
                </span>
              </div>

              {/* Turn by Turn Navigation Overlay */}
              {isNavigating && (
                <div className="absolute top-4 left-4 right-4 p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                      ⮑
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{navigationSteps[navStep].instruction}</p>
                      <span className="text-[10px] font-mono text-emerald-400">
                        In {navigationSteps[navStep].dist} · ETA {navigationSteps[navStep].time}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setNavStep((prev) => (prev + 1) % navigationSteps.length)}
                    className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-sky-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* D. GMAIL INBOX & VIEWER                                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'gmail' && (
          <div className="w-full h-full flex flex-col">
            {selectedEmailId ? (
              /* Email Reader */
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                <button
                  onClick={() => setSelectedEmailId(null)}
                  className="flex items-center gap-1 text-xs font-mono text-sky-400 hover:text-white self-start"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Inbox
                </button>
                {(() => {
                  const email = emails.find((e) => e.id === selectedEmailId)!;
                  return (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/20 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold text-white">{email.subject}</h3>
                          <p className="text-xs text-sky-400">{email.sender} &lt;{email.email}&gt;</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{email.time}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed pt-2 border-t border-slate-800">
                        {email.snippet}
                        <br /><br />
                        This email was verified inside the AetherOS Enclave. All cryptographic certificates and SPF records passed.
                      </p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Email List */
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
                {emails.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => setSelectedEmailId(e.id)}
                    className="p-3.5 hover:bg-slate-900/70 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                        {e.sender[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{e.sender}</span>
                          {!e.read && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                        </div>
                        <p className="text-xs text-slate-300 font-medium truncate">{e.subject}</p>
                        <p className="text-[10px] text-slate-500 truncate">{e.snippet}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{e.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* E. GOOGLE DRIVE & CLOUD DOCS                                  */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'drive' && (
          <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-sky-300 font-bold uppercase">Cloud & Enclave Files</span>
              <span className="text-[10px] font-mono text-slate-400">18.2 GB of 2 TB used</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {driveFiles.map((file, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-sky-500/20 flex flex-col justify-between h-28 hover:border-sky-400 transition-all text-left cursor-pointer"
                >
                  <File className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                    <p className="text-[9px] font-mono text-slate-400">{file.size} · {file.modified}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* F. GOOGLE KEEP NOTES                                          */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'keep' && (
          <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-amber-300 font-bold uppercase">Google Keep Notes</span>
              <span className="text-[10px] font-mono text-slate-400">{notes.length} Notes</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border ${n.color} flex flex-col gap-1 text-left`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    {n.pinned && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-200">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* G. YOUTUBE MUSIC & MEDIA                                      */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'youtube' && (
          <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-slate-900 to-slate-950">
            {/* Player Card */}
            <div className="w-full h-44 rounded-2xl bg-slate-950 border border-rose-500/30 relative overflow-hidden flex flex-col items-center justify-center text-center p-4 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
              {/* Spectrum Bars */}
              <div className="flex items-end gap-1.5 h-16 mb-2">
                {[30, 60, 95, 45, 80, 100, 50, 75, 40, 85, 60, 90, 35].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                    style={{
                      height: ytPlaying ? `${h}%` : '15%',
                      animationDuration: `${0.3 + (idx % 4) * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <h3 className="text-xs font-bold text-white truncate max-w-xs">{ytCurrentTrack.title}</h3>
              <p className="text-[10px] font-mono text-rose-400">{ytCurrentTrack.artist}</p>
            </div>

            {/* Playback Controls */}
            <div className="space-y-3">
              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" style={{ width: `${ytProgress}%` }} />
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => {
                    audioEngine.playOrbitalTick(700);
                    setYtPlaying(!ytPlaying);
                  }}
                  className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                >
                  {ytPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* H. GOOGLE MEET VIDEO CALL                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'meet' && (
          <div className="w-full h-full flex flex-col p-4 bg-slate-950">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-teal-300 font-bold uppercase">Google Meet Room</span>
              <span className="text-[10px] font-mono text-emerald-400">● Live 1080p60</span>
            </div>

            {/* Video Matrix Grid */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="rounded-2xl bg-slate-900 border border-teal-500/30 flex flex-col items-center justify-center p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-600/30 text-teal-300 border border-teal-400 flex items-center justify-center font-bold text-sm mb-1">
                  EV
                </div>
                <span className="text-xs font-bold text-white">Dr. Evelyn Vance</span>
                <span className="text-[9px] text-teal-400 font-mono">Audio Active</span>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-sky-500/30 flex flex-col items-center justify-center p-3 text-center">
                <div className="w-12 h-12 rounded-full bg-sky-600/30 text-sky-300 border border-sky-400 flex items-center justify-center font-bold text-sm mb-1">
                  AT
                </div>
                <span className="text-xs font-bold text-white">Akira Tanaka</span>
                <span className="text-[9px] text-sky-400 font-mono">Tokyo Feed</span>
              </div>
            </div>

            {/* Meet Controls */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-800">
              <button className="p-3 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-3 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-3 rounded-full bg-rose-600 text-white">
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* I. GOOGLE CALENDAR & PHOTOS FALLBACKS                         */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === 'calendar' || activeTab === 'photos') && (
          <div className="w-full h-full flex flex-col p-4 overflow-y-auto text-left">
            <span className="text-xs font-mono text-sky-300 font-bold uppercase mb-2">
              {activeTab === 'calendar' ? 'Google Calendar Schedule' : 'Google Photos Neural Gallery'}
            </span>
            <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/20 space-y-2">
              <p className="text-xs text-slate-200">
                {activeTab === 'calendar'
                  ? 'All 6 agenda items and Google Meet conference links are synchronized with the Aether Enclave.'
                  : 'AI Magic Eraser and HDR+ Neural pipelines are pre-cached in the Tensor G5 TPU.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
