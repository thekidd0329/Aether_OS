import React, { useState, useRef, useEffect } from 'react';
import { MonetPalette } from '../../types';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface TerminalAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ palette, onClose }) => {
  const [history, setHistory] = useState<string[]>([
    'Android Terminal Emulator [Version 14.0.0_r28]',
    'NovaX High Performance Android Kernel 6.1.75-android14-perf',
    'Type "help" to view available shell commands.',
    '',
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    audioEngine.playClick(900, 'triangle', 0.03);
    const cmd = input.trim();
    const newHistory = [...history, `$ ${cmd}`];

    switch (cmd.toLowerCase()) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  neofetch      - Display device system info & logo',
          '  getprop       - List core system properties',
          '  top           - Display live process loads',
          '  uname -a      - Print Linux kernel architecture',
          '  pm list       - List installed Android packages',
          '  clear         - Clear terminal screen',
          '  whoami        - Print current user session'
        );
        break;
      case 'neofetch':
        newHistory.push(
          '   _  _ ____ _  _ ____ _  _',
          '   |\\ | |  | |  | |__|  \\/',
          '   | \\| |__|  \\/  |  | _/\\_',
          '   OS: NovaX Android 14 (Vanilla Ice Cream)',
          '   Host: Google Pixel 9 Pro / Galaxy S24 Ultra',
          '   Kernel: Linux 6.1.75-perf-aarch64',
          '   Uptime: 4 days, 12 hours, 38 mins',
          '   Packages: 24 (apk)',
          '   Shell: mksh (Android POSIX)',
          '   Resolution: 1440x3120 @ 120Hz LTPO OLED',
          '   Memory: 4.8GiB / 12GiB (LPDDR5X)'
        );
        break;
      case 'uname':
      case 'uname -a':
        newHistory.push('Linux localhost 6.1.75-android14-perf #1 SMP PREEMPT aarch64 Android');
        break;
      case 'whoami':
        newHistory.push('u0_a189 (uid=10189 gid=10189)');
        break;
      case 'top':
        newHistory.push(
          'PID USER     PR  NI VIRT  RES  SHR S[%CPU] %MEM   TIME+ ARGS',
          ' 420 system   20   0 1.8G 180M  92M S 12.4   1.5  4:12.18 surfaceflinger',
          ' 819 system   20   0 4.2G 420M 140M S  8.2   3.5 12:45.02 system_server',
          '1089 u0_a189  20   0 2.1G 160M  85M S  4.5   1.3  1:02.11 com.novax.launcher'
        );
        break;
      case 'pm list':
      case 'pm list packages':
        newHistory.push(
          'package:com.novax.launcher.settings',
          'package:com.novax.music',
          'package:com.google.android.GoogleCamera',
          'package:com.google.android.apps.messaging',
          'package:com.android.chrome',
          'package:com.google.android.keep',
          'package:com.termux'
        );
        break;
      case 'getprop':
        newHistory.push(
          '[ro.build.version.release]: [14]',
          '[ro.product.model]: [NovaX Custom Pro]',
          '[ro.hardware]: [qcom]',
          '[persist.sys.theme]: [material_you]'
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHistory.push(`sh: command not found: ${cmd}`);
    }

    newHistory.push('');
    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-emerald-400 font-mono text-xs select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 font-sans">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <TerminalIcon size={14} className="text-emerald-400" />
          <span>NovaX Terminal (sh)</span>
        </div>
        <button
          onClick={() => setHistory([])}
          className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-800"
        >
          Clear
        </button>
      </div>

      {/* Terminal log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command prompt input */}
      <form onSubmit={handleCommand} className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'help' or 'neofetch'..."
          autoFocus
          className="flex-1 bg-transparent text-emerald-300 focus:outline-none font-mono text-xs"
        />
        <button type="submit" className="p-1 text-emerald-400 hover:text-white">
          <CornerDownLeft size={14} />
        </button>
      </form>
    </div>
  );
};
