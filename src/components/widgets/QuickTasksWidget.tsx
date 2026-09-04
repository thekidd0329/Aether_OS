import React, { useState } from 'react';
import { WidgetItem, MonetPalette } from '../../types';
import { CheckSquare, Square, Plus, Check } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface QuickTasksProps {
  widget: WidgetItem;
  palette: MonetPalette;
  onUpdateTasks?: (tasks: { id: string; text: string; completed: boolean }[]) => void;
}

export const QuickTasksWidget: React.FC<QuickTasksProps> = ({
  widget,
  palette,
  onUpdateTasks,
}) => {
  const [tasks, setTasks] = useState(widget.settings.tasks || [
    { id: '1', text: 'Customize launcher grid', completed: true },
    { id: '2', text: 'Set live wallpaper', completed: false },
    { id: '3', text: 'Test audio synthesizers', completed: false },
  ]);
  const [newText, setNewText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleTask = (id: string) => {
    audioEngine.playClick(900, 'triangle', 0.04);
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    onUpdateTasks?.(updated);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    audioEngine.playClick(1100, 'sine', 0.03);
    const updated = [...tasks, { id: Date.now().toString(), text: newText.trim(), completed: false }];
    setTasks(updated);
    setNewText('');
    setIsAdding(false);
    onUpdateTasks?.(updated);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-0.5 text-white">
      <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckSquare size={13} style={{ color: palette.primary }} />
          <span>Tasks ({tasks.filter(t => t.completed).length}/{tasks.length})</span>
        </span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-[10px] bg-white/10 hover:bg-white/20 p-1 rounded-full text-white/80 transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 max-h-[85px]">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
          >
            {task.completed ? (
              <div
                className="w-3.5 h-3.5 rounded flex items-center justify-center text-white"
                style={{ backgroundColor: palette.primary }}
              >
                <Check size={10} strokeWidth={3} />
              </div>
            ) : (
              <Square size={14} className="text-white/40 hover:text-white" />
            )}
            <span className={`truncate ${task.completed ? 'line-through text-white/40' : 'text-white/90'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={addTask} className="mt-1.5 flex gap-1">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add task..."
            autoFocus
            className="flex-1 bg-black/40 text-xs px-2 py-1 rounded border border-white/20 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-2 py-1 rounded text-xs text-black font-semibold"
            style={{ backgroundColor: palette.primary }}
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
};
