import React, { useState } from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Edit3, Check } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface QuickNotesProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onUpdateNote?: (note: string) => void;
}

export const QuickNotesWidget: React.FC<QuickNotesProps> = ({
  widget,
  palette,
  onUpdateNote,
}) => {
  const [note, setNote] = useState(widget.settings.noteContent || '• Meeting at 3pm\n• Buy coffee\n• Build NovaX layout');
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateNote?.(note);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-0.5 text-white">
      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Edit3 size={13} style={{ color: palette.primary }} />
          <span>Quick Note</span>
        </span>
        <button
          onClick={() => {
            audioEngine.playClick(700, 'sine', 0.03);
            setIsEditing(!isEditing);
          }}
          className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full text-white/80 transition-colors"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="w-full h-full bg-black/30 text-white text-xs p-2 rounded-lg border border-white/20 focus:outline-none resize-none font-sans"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-full h-full text-xs text-white/80 whitespace-pre-line overflow-y-auto cursor-text leading-relaxed p-1"
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
};
