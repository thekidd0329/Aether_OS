import React, { useState } from 'react';
import { MonetPalette } from '../../types';
import { Plus, Trash2, Pin, Tag, Search, Edit3 } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned?: boolean;
  date: string;
}

interface NotesAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({ palette, onClose }) => {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: '1',
      title: 'Launcher Design System',
      content: '• Configure custom icon shapes\n• Test high performance physics\n• Material You dynamic palette generation',
      color: '#e07a5f',
      pinned: true,
      date: 'Today, 2:15 PM',
    },
    {
      id: '2',
      title: 'App Ideas & Widgets',
      content: 'Add clock faces, system diagnostic monitors, and audio synthesizers for tactile UX.',
      color: '#6366f1',
      pinned: false,
      date: 'Yesterday',
    },
  ]);

  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNote = () => {
    audioEngine.playClick(900, 'sine', 0.04);
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      color: '#10b981',
      date: 'Just now',
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const handleSaveActive = (updates: Partial<NoteItem>) => {
    if (!activeNote) return;
    const updated = { ...activeNote, ...updates };
    setActiveNote(updated);
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleDelete = (id: string) => {
    audioEngine.playClick(400, 'sine', 0.05);
    setNotes(notes.filter((n) => n.id !== id));
    if (activeNote?.id === id) setActiveNote(null);
  };

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white select-none">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800">
        <span className="text-xs font-bold text-neutral-300">NovaX Notes</span>
        <button
          onClick={handleCreateNote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-950 transition-all hover:scale-105"
          style={{ backgroundColor: palette.primary }}
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>

      {activeNote ? (
        /* Edit Note View */
        <div className="flex-1 flex flex-col p-4 space-y-3 bg-neutral-900/60 overflow-y-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveNote(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              ← Back to Notes
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveActive({ pinned: !activeNote.pinned })}
                className={`p-1.5 rounded-lg ${activeNote.pinned ? 'text-amber-400' : 'text-neutral-500'}`}
              >
                <Pin size={16} />
              </button>
              <button
                onClick={() => handleDelete(activeNote.id)}
                className="p-1.5 rounded-lg text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <input
            type="text"
            value={activeNote.title}
            onChange={(e) => handleSaveActive({ title: e.target.value })}
            placeholder="Title"
            className="w-full bg-transparent text-lg font-bold text-white focus:outline-none"
          />

          <textarea
            value={activeNote.content}
            onChange={(e) => handleSaveActive({ content: e.target.value })}
            placeholder="Type your notes here..."
            className="flex-1 w-full bg-transparent text-sm text-neutral-200 focus:outline-none resize-none leading-relaxed min-h-[220px]"
          />
        </div>
      ) : (
        /* Note List View */
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 rounded-xl border border-neutral-800">
            <Search size={14} className="text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {filtered.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveNote(note);
                }}
                className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer flex flex-col justify-between min-h-[110px] transition-all hover:-translate-y-0.5"
                style={{ borderTop: `3px solid ${note.color}` }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{note.title}</h4>
                    {note.pinned && <Pin size={11} className="text-amber-400 flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-3 mt-1 leading-snug">
                    {note.content || 'Empty note'}
                  </p>
                </div>
                <span className="text-[9px] text-neutral-500 font-mono mt-2">{note.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
