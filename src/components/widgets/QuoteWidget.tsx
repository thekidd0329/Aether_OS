import React from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { Quote, Sparkles } from 'lucide-react';

interface QuoteWidgetProps {
  widget: WidgetItem;
  palette: MonetPalette;
}

export const QuoteWidget: React.FC<QuoteWidgetProps> = ({
  widget,
  palette,
}) => {
  const text = widget.settings.quoteText || 'Design is not just what it looks like and feels like. Design is how it works.';
  const author = widget.settings.quoteAuthor || 'Steve Jobs';

  return (
    <div className="w-full h-full flex flex-col justify-between p-1 text-white">
      <div className="flex items-center gap-1.5 text-xs text-white/70">
        <Sparkles size={13} style={{ color: palette.primary }} />
        <span className="font-medium">Daily Wisdom</span>
      </div>

      <div className="my-auto flex items-start gap-2">
        <Quote size={16} className="text-white/40 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs italic text-white/90 font-serif leading-snug line-clamp-2">
            "{text}"
          </p>
          <p className="text-[10px] text-white/60 font-sans tracking-wide">
            — {author}
          </p>
        </div>
      </div>
    </div>
  );
};
