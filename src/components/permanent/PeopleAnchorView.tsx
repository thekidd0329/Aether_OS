import React, { useState } from 'react';
import { PersonProfile, InteractionRecord } from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import {
  MessageSquare,
  Phone,
  Share2,
  Video,
  Send,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  X,
  Plus,
  ShieldCheck,
  Radio,
  PhoneCall,
  PhoneOff,
} from 'lucide-react';

interface PeopleAnchorViewProps {
  people: PersonProfile[];
  onSendMessage: (personId: string, text: string, channel: string) => void;
  onOpenGoogleMessages?: () => void;
  onOpenGooglePhone?: () => void;
}

export const PeopleAnchorView: React.FC<PeopleAnchorViewProps> = ({
  people,
  onSendMessage,
  onOpenGoogleMessages,
  onOpenGooglePhone,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<PersonProfile | null>(people[0]);
  const [activeChannel, setActiveChannel] = useState<string>('Discord');
  const [messageInput, setMessageInput] = useState<string>('');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);

  const filteredPeople = people.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedPerson) return;
    audioEngine.playActionExecute();
    onSendMessage(selectedPerson.id, messageInput.trim(), activeChannel);
    setMessageInput('');
  };

  const handleStartCall = () => {
    audioEngine.playActionExecute();
    setIsCalling(true);
    setCallDuration(0);
  };

  const handleEndCall = () => {
    audioEngine.playLockSound();
    setIsCalling(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-3 gap-4 text-sky-100">
      {/* Header */}
      <div className="flex flex-col text-left">
        <h2 className="text-lg font-light tracking-tight text-white flex items-center justify-between">
          <span>Identity Resolver</span>
          <span className="text-xs font-mono text-sky-400/80">
            Person-First Architecture
          </span>
        </h2>
        <p className="text-xs text-sky-300/70 font-mono">
          Person → Action → Provider (Flips the traditional app model)
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/60" />
        <input
          type="text"
          placeholder="Resolve contact, identity handle, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-sky-500/30 text-xs text-sky-100 placeholder:text-sky-400/40 focus:outline-none focus:border-sky-400"
        />
      </div>

      {/* Horizontal People Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {filteredPeople.map((person) => {
          const isSelected = selectedPerson?.id === person.id;
          return (
            <button
              key={person.id}
              onClick={() => {
                audioEngine.playBloomOpen();
                setSelectedPerson(person);
              }}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-sky-950/80 border border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-105'
                  : 'bg-slate-900/60 border border-sky-500/20 hover:border-sky-400/50 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                  style={{ backgroundColor: person.avatarColor }}
                >
                  {person.initials}
                </div>
                {person.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                )}
              </div>
              <span className="text-xs font-semibold text-sky-100 truncate w-16 text-center">
                {person.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Person's Unified Identity Profile (The Exact Feature Requested) */}
      {selectedPerson && (
        <div className="p-4 rounded-3xl bg-slate-900/85 border border-sky-400/50 flex flex-col gap-4 text-left shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          
          {/* Top Identity Header */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)] shrink-0"
              style={{ backgroundColor: selectedPerson.avatarColor }}
            >
              {selectedPerson.initials}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight truncate">
                  {selectedPerson.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Affinity {selectedPerson.affinityScore}%
                </span>
              </div>
              <span className="text-xs text-sky-300/80 truncate">
                {selectedPerson.role}
              </span>
              <span className="text-[10px] text-sky-400/70 font-mono">
                {selectedPerson.statusMessage}
              </span>
            </div>
          </div>

          {/* Primary Action Triad: [ Message ] [ Call ] [ Share ] */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                if (onOpenGoogleMessages) {
                  audioEngine.playOrbitalTick(900);
                  onOpenGoogleMessages();
                } else {
                  audioEngine.playCategorySwitch();
                  setActiveChannel('Discord');
                }
              }}
              className="py-2.5 px-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)] active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS / RCS</span>
            </button>

            <button
              onClick={() => {
                if (onOpenGooglePhone) {
                  audioEngine.playActionExecute();
                  onOpenGooglePhone();
                } else {
                  handleStartCall();
                }
              }}
              className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-sky-500/40 text-sky-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>In-OS Call</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playActionExecute();
              }}
              className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-sky-500/40 text-sky-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Share Object</span>
            </button>
          </div>

          {/* Connected App Providers Resolved for this Person */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-sky-400/80 uppercase tracking-wider">
              Connected Provider Targets (Direct Links)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
              {Object.entries(selectedPerson.identities).map(([provider, handleVal]) => (
                <button
                  key={provider}
                  onClick={() => {
                    audioEngine.playCategorySwitch();
                    setActiveChannel(provider);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left border flex flex-col transition-all ${
                    activeChannel.toLowerCase() === provider.toLowerCase()
                      ? 'bg-sky-950 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.3)] font-semibold'
                      : 'bg-slate-950/60 border-sky-500/20 text-sky-400/70 hover:border-sky-500/50'
                  }`}
                >
                  <span className="uppercase text-sky-300 font-bold">{provider}</span>
                  <span className="text-[9px] text-slate-400 truncate">{handleVal}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Unified Recent Interactions Timeline */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-sky-400/80 uppercase tracking-wider">
              Unified Cross-Platform Interaction Stream
            </span>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {selectedPerson.recentInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-sky-500/20 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-sky-400/80">
                    <span className="flex items-center gap-1 font-bold text-sky-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      {interaction.channel} · {interaction.direction === 'inbound' ? 'Received' : 'Sent'}
                    </span>
                    <span>{interaction.timestamp}</span>
                  </div>
                  <p className="text-sky-100/90 leading-relaxed text-xs">
                    {interaction.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Cross-Channel Message Composer */}
          <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-sky-500/20">
            <input
              type="text"
              placeholder={`Send message to ${selectedPerson.name} via ${activeChannel}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-sky-500/40 text-xs text-sky-100 placeholder:text-sky-500/40 focus:outline-none focus:border-sky-300"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Interactive Holographic Call Simulator Modal */}
      {isCalling && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 to-sky-950 border border-sky-400/80 p-6 flex flex-col items-center gap-6 text-sky-100 shadow-[0_0_50px_rgba(56,189,248,0.5)]">
            
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.6)] animate-pulse"
                style={{ backgroundColor: selectedPerson.avatarColor }}
              >
                {selectedPerson.initials}
              </div>
              <h3 className="text-xl font-bold text-white">{selectedPerson.name}</h3>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-spin" />
                <span>Pixel 10 Tensor HD Voice Active</span>
              </span>
            </div>

            {/* Audio Waveform Visualization */}
            <div className="flex items-center gap-1.5 h-12 w-full justify-center">
              {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-sky-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(56,189,248,0.8)]"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)] active:scale-95 transition-all"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
