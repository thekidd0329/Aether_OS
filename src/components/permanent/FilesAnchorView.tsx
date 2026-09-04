import React, { useState } from 'react';
import { DigitalObject, FileSecurityPermissionState } from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import {
  FileText,
  FileCode,
  FileArchive,
  Music,
  Image,
  Layers,
  Search,
  Share2,
  Download,
  Eye,
  Tag,
  ExternalLink,
  X,
  Send,
  ShieldCheck,
  Lock,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from 'lucide-react';

interface FilesAnchorViewProps {
  files: DigitalObject[];
  onSelectFile: (file: DigitalObject) => void;
  onShareToPerson: (file: DigitalObject, personName: string) => void;
}

const getFileIcon = (ext: string, type: string) => {
  switch (type) {
    case 'code':
      return FileCode;
    case 'archive':
      return FileArchive;
    case 'audio':
      return Music;
    case 'vector':
      return Layers;
    case 'image':
      return Image;
    default:
      return FileText;
  }
};

export const FilesAnchorView: React.FC<FilesAnchorViewProps> = ({
  files,
  onSelectFile,
  onShareToPerson,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [previewingFile, setPreviewingFile] = useState<DigitalObject | null>(null);
  const [isSecurityBrokerOpen, setIsSecurityBrokerOpen] = useState<boolean>(false);

  // Zero-Token Scoped Storage Permission State (Android SAF / Non-rooted sandbox)
  const [permissionState, setPermissionState] = useState<FileSecurityPermissionState>({
    status: 'scoped_saf',
    tokenAccessRevoked: true,
    zeroCloudTelemetry: true,
    scopedDirectory: '/storage/emulated/0/AetherVault',
    noCombingVerified: true,
    isolationLevel: 'Hardware Enclave',
  });

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.sourceProvider.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTypeFilter === 'all') return true;
    return f.thumbnailType === activeTypeFilter;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-3 gap-3.5 text-sky-100">
      {/* Header with Zero-Token Enclave Safety Badge */}
      <div className="flex flex-col text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-light tracking-tight text-white flex items-center gap-1.5">
            <span>Digital Objects</span>
          </h2>
          <button
            onClick={() => {
              audioEngine.playOrbitalTick(900);
              setIsSecurityBrokerOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono hover:bg-emerald-900/80 transition-all shadow-[0_0_10px_rgba(52,211,153,0.2)]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Token Sandboxed</span>
          </button>
        </div>
        <p className="text-xs text-sky-300/70 font-mono mt-0.5">
          Permission-based SAF · Decoupled from cloud combing APIs
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-sky-500/25 flex items-center justify-between text-left text-[11px] font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-sky-200/90 truncate">
            No cloud tokens · Direct Android Permission Broker
          </span>
        </div>
        <button
          onClick={() => setIsSecurityBrokerOpen(true)}
          className="text-sky-400 hover:text-sky-200 shrink-0 underline ml-2 text-[10px]"
        >
          Verify
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/60" />
        <input
          type="text"
          placeholder="Search objects, tags, providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-sky-500/30 text-xs text-sky-100 placeholder:text-sky-400/40 focus:outline-none focus:border-sky-400"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        {['all', 'document', 'code', 'archive', 'audio', 'vector'].map((t) => (
          <button
            key={t}
            onClick={() => {
              audioEngine.playCategorySwitch();
              setActiveTypeFilter(t);
            }}
            className={`px-3 py-1 rounded-xl uppercase tracking-wider transition-all shrink-0 ${
              activeTypeFilter === t
                ? 'bg-sky-400 text-slate-950 font-semibold shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                : 'bg-slate-900/60 border border-sky-500/20 text-sky-300/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {filteredFiles.map((file) => {
          const IconComp = getFileIcon(file.extension, file.thumbnailType);
          return (
            <div
              key={file.id}
              onClick={() => {
                audioEngine.playBloomOpen();
                setPreviewingFile(file);
              }}
              className="group p-3 rounded-2xl bg-slate-900/70 hover:bg-sky-950/40 border border-sky-500/30 hover:border-sky-400 transition-all duration-200 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* File Extension Glyph */}
                <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-400/40 flex flex-col items-center justify-center shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                  <IconComp className="w-5 h-5 text-sky-300 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-mono uppercase text-sky-400/80 font-bold">
                    {file.extension}
                  </span>
                </div>

                {/* File Details */}
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-semibold text-sky-100 group-hover:text-white truncate">
                    {file.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-sky-400/70 mt-0.5">
                    <span>{file.size}</span>
                    <span>·</span>
                    <span>{file.sourceProvider}</span>
                    <span>·</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEngine.playBloomOpen();
                    setPreviewingFile(file);
                  }}
                  className="w-8 h-8 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. File Preview Modal */}
      {previewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-sky-400/70 p-5 flex flex-col gap-4 text-sky-100 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  {previewingFile.extension} · {previewingFile.sourceProvider}
                </span>
                <span className="text-[10px] text-sky-400 font-mono">{previewingFile.size}</span>
              </div>
              <button
                onClick={() => setPreviewingFile(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-sky-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col text-left">
              <h3 className="text-base font-semibold text-white break-all">
                {previewingFile.name}
              </h3>
              <p className="text-xs text-sky-300/80 font-mono mt-1">
                Modified {previewingFile.modified}
              </p>
            </div>

            {/* Content Preview Box */}
            <div className="p-3 rounded-xl bg-slate-950/90 border border-sky-500/30 text-xs font-mono text-sky-300/90 leading-relaxed max-h-36 overflow-y-auto">
              {previewingFile.contentSnippet || 'Digital object payload compiled and verified.'}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {previewingFile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/30 text-[10px] text-sky-300 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  audioEngine.playActionExecute();
                  onShareToPerson(previewingFile, 'Akira');
                  setPreviewingFile(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share to Akira</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playActionExecute();
                  setPreviewingFile(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 text-xs font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Zero-Token Scoped Permission Security Broker Modal */}
      {isSecurityBrokerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-emerald-400/70 p-5 flex flex-col gap-3.5 text-sky-100 shadow-[0_0_40px_rgba(52,211,153,0.3)] text-left">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-white font-mono uppercase">
                  Zero-Token Permission Broker
                </span>
              </div>
              <button
                onClick={() => setIsSecurityBrokerOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-sky-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-emerald-300">
                  <span className="font-bold">Privacy Policy Enforcement:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-300">
                    PASSING
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-sky-200/80">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>100% Zero Token Access:</strong> No cloud auth tokens shared for file access.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>No API Combing:</strong> Bypasses Google Files API cloud harvesting.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Scoped SAF Enclave:</strong> Direct Android Storage Access Framework sandboxing.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-sky-500/20 text-[10px] text-sky-300/80 space-y-1">
                <div>Scoped Vault: <span className="text-white font-mono">{permissionState.scopedDirectory}</span></div>
                <div>Isolation Level: <span className="text-emerald-400 font-semibold">{permissionState.isolationLevel}</span></div>
              </div>
            </div>

            <button
              onClick={() => {
                audioEngine.playActionExecute();
                setIsSecurityBrokerOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono shadow-[0_0_15px_rgba(52,211,153,0.4)]"
            >
              Acknowledge & Confirm Sandbox
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

