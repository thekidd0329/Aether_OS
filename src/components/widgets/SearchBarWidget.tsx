import React, { useState } from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Search, Mic, Camera, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface SearchBarProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onSearch?: (query: string) => void;
  onOpenAssistant?: () => void;
  onOpenLens?: () => void;
}

export const SearchBarWidget: React.FC<SearchBarProps> = ({
  widget,
  palette,
  onSearch,
  onOpenAssistant,
  onOpenLens,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      audioEngine.playClick(850, 'sine', 0.04);
      onSearch?.(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex items-center justify-between px-3.5 py-1 text-white"
    >
      <div className="flex items-center gap-2.5 flex-1 mr-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
          style={{ backgroundColor: palette.primary, color: palette.onPrimary || '#000000' }}
        >
          G
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search apps, web, & more..."
          className="w-full bg-transparent text-xs text-white placeholder-white/50 focus:outline-none tracking-wide"
        />
      </div>

      <div className="flex items-center gap-2 text-white/70">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            audioEngine.playClick(600, 'sine', 0.05);
            onOpenAssistant?.();
          }}
          className="p-1 hover:text-white transition-colors"
          title="Voice search"
        >
          <Mic size={15} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            audioEngine.playClick(600, 'sine', 0.05);
            onOpenLens?.();
          }}
          className="p-1 hover:text-white transition-colors"
          title="Google Lens"
        >
          <Camera size={15} />
        </button>
      </div>
    </form>
  );
};
