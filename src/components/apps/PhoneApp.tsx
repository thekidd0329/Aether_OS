import React, { useState } from 'react';
import { MonetPalette } from '../../types';
import { Phone, PhoneCall, Delete, User, Clock, Star, PhoneOff } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface PhoneAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

const CONTACTS = [
  { id: '1', name: 'Alice Walker', number: '(555) 234-5678', avatar: 'A' },
  { id: '2', name: 'Devin Martinez', number: '(555) 876-5432', avatar: 'D' },
  { id: '3', name: 'Sarah Chen', number: '(555) 345-9876', avatar: 'S' },
  { id: '4', name: 'Tech Support', number: '1-800-NOVAX', avatar: 'T' },
];

export const PhoneApp: React.FC<PhoneAppProps> = ({ palette, onClose }) => {
  const [number, setNumber] = useState('');
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [tab, setTab] = useState<'keypad' | 'contacts' | 'recents'>('keypad');

  const handleDigit = (digit: string) => {
    audioEngine.playDtmf(digit);
    setNumber(number + digit);
  };

  const handleCall = (numToCall: string) => {
    if (!numToCall) return;
    audioEngine.playTone(440, 480, 0.4);
    setActiveCall(numToCall);
  };

  const handleEndCall = () => {
    audioEngine.playClick(300, 'sine', 0.1);
    setActiveCall(null);
  };

  const keypad = [
    { num: '1', sub: '' }, { num: '2', sub: 'ABC' }, { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' }, { num: '5', sub: 'JKL' }, { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' }, { num: '8', sub: 'TUV' }, { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' }, { num: '0', sub: '+' }, { num: '#', sub: '' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white select-none">
      {/* Calling Screen Overlay */}
      {activeCall ? (
        <div className="flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-neutral-900 to-neutral-950">
          <div className="flex flex-col items-center space-y-3 mt-8">
            <div className="w-24 h-24 rounded-full bg-indigo-600/30 border-2 border-indigo-400 flex items-center justify-center text-3xl font-bold text-white shadow-xl animate-pulse">
              <User size={44} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{activeCall}</h2>
            <span className="text-xs text-emerald-400 font-mono">Calling via HD Voice...</span>
          </div>

          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
          >
            <PhoneOff size={28} />
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-3.5 flex items-center justify-around border-b border-neutral-800 bg-neutral-900/60">
            <button
              onClick={() => setTab('keypad')}
              className={`text-xs font-semibold pb-1 transition-colors ${tab === 'keypad' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-neutral-400'}`}
            >
              Keypad
            </button>
            <button
              onClick={() => setTab('contacts')}
              className={`text-xs font-semibold pb-1 transition-colors ${tab === 'contacts' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-neutral-400'}`}
            >
              Contacts
            </button>
            <button
              onClick={() => setTab('recents')}
              className={`text-xs font-semibold pb-1 transition-colors ${tab === 'recents' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-neutral-400'}`}
            >
              Recents
            </button>
          </div>

          {tab === 'keypad' && (
            <div className="flex-1 flex flex-col justify-between p-4 pb-6">
              {/* Dial display */}
              <div className="flex items-center justify-center min-h-[60px] relative px-4">
                <span className="text-2xl font-bold font-mono tracking-wider text-white truncate">
                  {number}
                </span>
                {number && (
                  <button
                    onClick={() => setNumber(number.slice(0, -1))}
                    className="absolute right-2 p-2 text-neutral-400 hover:text-white"
                  >
                    <Delete size={20} />
                  </button>
                )}
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-3 px-4">
                {keypad.map((k) => (
                  <button
                    key={k.num}
                    onClick={() => handleDigit(k.num)}
                    className="h-16 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 flex flex-col items-center justify-center active:scale-95 transition-all"
                  >
                    <span className="text-xl font-bold font-mono text-white leading-none">{k.num}</span>
                    {k.sub && <span className="text-[9px] text-neutral-500 font-semibold tracking-widest mt-0.5">{k.sub}</span>}
                  </button>
                ))}
              </div>

              {/* Call button */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => handleCall(number)}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  <Phone size={26} />
                </button>
              </div>
            </div>
          )}

          {tab === 'contacts' && (
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {CONTACTS.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleCall(c.name)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-sm font-bold text-white">
                      {c.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{c.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{c.number}</div>
                    </div>
                  </div>
                  <Phone size={16} className="text-emerald-400" />
                </div>
              ))}
            </div>
          )}

          {tab === 'recents' && (
            <div className="flex-1 p-4 space-y-2 overflow-y-auto text-xs text-neutral-400">
              <div className="p-3 bg-neutral-900 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-white font-medium block">Alice Walker</span>
                  <span className="text-[10px] text-neutral-500">Incoming • Today, 1:45 PM</span>
                </div>
                <span className="text-emerald-400 text-[11px]">2m 14s</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
