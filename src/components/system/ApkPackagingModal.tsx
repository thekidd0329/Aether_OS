import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Settings,
  X,
  FileCode,
  Layers,
  ArrowRight,
  Radio,
  Cpu,
} from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface ApkPackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkPackagingModal: React.FC<ApkPackagingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedQuickCommand, setCopiedQuickCommand] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'quickstart' | 'manifest' | 'config' | 'guide'>('quickstart');

  if (!isOpen) return null;

  const quickCommand = `npm run setup:apk`;
  const buildCommand = `npm run build:apk`;

  const handleCopy = (text: string, isQuick: boolean = false) => {
    audioEngine.playOrbitalTick(900);
    navigator.clipboard.writeText(text);
    if (isQuick) {
      setCopiedQuickCommand(true);
      setTimeout(() => setCopiedQuickCommand(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const manifestSnippet = `<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <!-- Android System Permissions -->
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_MOCK_LOCATION" />
  <uses-permission android:name="android.permission.SEND_SMS" />
  <uses-permission android:name="android.permission.CALL_PHONE" />
  <uses-permission android:name="android.permission.VIBRATE" />

  <application android:theme="@style/AppTheme.NoActionBar">
    <activity
      android:name=".MainActivity"
      android:launchMode="singleTask"
      android:stateNotNeeded="true"
      android:exported="true">
      
      <!-- Primary Android Home Launcher Intent -->
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.HOME" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
  </application>
</manifest>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900/95 border border-sky-500/40 rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.25)] flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-sky-500/20 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">AetherOS APK Packaging Center</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-medium">
                  Ready to Pack
                </span>
              </div>
              <p className="text-xs text-sky-300/70">Turnkey compilation script & Android Launcher configuration</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioEngine.playCategorySwitch();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-sky-500/20 flex items-center gap-2 bg-slate-950/30 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'quickstart'
                ? 'border-sky-400 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1-Click Setup Script</span>
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'manifest'
                ? 'border-sky-400 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>AndroidManifest.xml</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'guide'
                ? 'border-sky-400 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Default Launcher Guide</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm">
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              {/* Ready Status Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 space-y-1">
                  <p className="font-semibold text-emerald-300">Automated Setup Engine Created</p>
                  <p className="text-emerald-200/80 leading-relaxed">
                    The turnkey script (<code className="font-mono text-emerald-300 bg-emerald-950/40 px-1 py-0.5 rounded">setup-apk.sh</code> / <code className="font-mono text-emerald-300 bg-emerald-950/40 px-1 py-0.5 rounded">scripts/setup-apk.mjs</code>) automates Capacitor installation, production Vite builds, Android container creation, launcher intent injection, and APK compilation.
                  </p>
                </div>
              </div>

              {/* Quick Command Card */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-sky-300 uppercase tracking-wider">Run on your machine:</span>
                <div className="p-3 bg-slate-950 rounded-2xl border border-sky-500/30 flex items-center justify-between font-mono text-xs text-sky-200">
                  <span>{quickCommand}</span>
                  <button
                    onClick={() => handleCopy(quickCommand, true)}
                    className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedQuickCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuickCommand ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Build Option */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-sky-300 uppercase tracking-wider">Or build APK directly via Gradle:</span>
                <div className="p-3 bg-slate-950 rounded-2xl border border-sky-500/30 flex items-center justify-between font-mono text-xs text-sky-200">
                  <span>{buildCommand}</span>
                  <button
                    onClick={() => handleCopy(buildCommand, false)}
                    className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Architecture Validation Matrix */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">APK Compatibility Checklist:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-sky-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pure Web Audio DTMF (No audio assets needed)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-sky-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Offline LocalStorage State Engine</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-sky-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Android Home Launcher Category</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-sky-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>120Hz Hardware Accelerated Motion</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                The setup script automatically writes these Android system permissions and intent filters into <code className="text-sky-300">android/app/src/main/AndroidManifest.xml</code> so Android recognizes AetherOS as a genuine Home Launcher app:
              </p>
              <div className="relative p-3 bg-slate-950 rounded-2xl border border-sky-500/30 overflow-x-auto text-[11px] font-mono text-sky-200">
                <pre>{manifestSnippet}</pre>
                <button
                  onClick={() => handleCopy(manifestSnippet, false)}
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs flex items-center gap-1"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-950 border border-sky-500/20 space-y-2">
                <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                  <span>Step 1: Install APK onto Android Device</span>
                </h4>
                <p>
                  Plug your Android phone into your computer with USB Debugging enabled, and run:
                </p>
                <code className="block p-2 bg-slate-900 rounded-xl text-sky-200 font-mono">
                  adb install -r android/app/build/outputs/apk/debug/app-debug.apk
                </code>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-sky-500/20 space-y-2">
                <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                  <span>Step 2: Set as Default Home App</span>
                </h4>
                <p>
                  On your Android device, open:
                </p>
                <div className="p-2 bg-slate-900 rounded-xl text-amber-200 font-mono text-[11px]">
                  Settings &gt; Apps &gt; Default Apps &gt; Home App &gt; Select "AetherOS"
                </div>
                <p className="text-slate-400 text-[11px]">
                  Whenever you tap the physical Home button or swipe up from the bottom bar, AetherOS will appear instantaneously!
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-sky-500/20 space-y-2">
                <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                  <span>Step 3: Enable Mock Location (For Mark GPS)</span>
                </h4>
                <p>
                  To let AetherOS spoof real GPS coordinates across third-party apps:
                </p>
                <div className="p-2 bg-slate-900 rounded-xl text-emerald-200 font-mono text-[11px]">
                  Settings &gt; Developer Options &gt; Select mock location app &gt; Select "AetherOS"
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-sky-500/20 flex items-center justify-between bg-slate-950/80">
          <div className="text-[11px] text-slate-400 font-mono">
            Files created: <span className="text-sky-300">capacitor.config.ts</span>, <span className="text-sky-300">setup-apk.sh</span>, <span className="text-sky-300">scripts/setup-apk.mjs</span>
          </div>
          <button
            onClick={() => {
              audioEngine.playActionExecute();
              handleCopy(quickCommand, true);
            }}
            className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)] active:scale-95 transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Copy Setup Command</span>
          </button>
        </div>

      </div>
    </div>
  );
};
