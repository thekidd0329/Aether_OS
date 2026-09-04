import React, { useState } from 'react';
import { TaskItem } from '../../types/concierge';
import { audioEngine } from '../../utils/audioEngine';
import {
  CheckCircle2,
  Circle,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  CreditCard,
  Code,
  Calendar,
  MessageSquare,
  Filter,
  Check,
} from 'lucide-react';

interface TasksAnchorViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Partial<TaskItem>) => void;
  onExecuteDeepAction: (task: TaskItem) => void;
}

export const TasksAnchorView: React.FC<TasksAnchorViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onExecuteDeepAction,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskCategory, setNewTaskCategory] = useState<'work' | 'academic' | 'financial' | 'personal'>('work');
  const [newTaskPriority, setNewTaskPriority] = useState<'p1' | 'p2' | 'p3'>('p1');

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'pending') return !t.completed;
    if (filterCategory === 'completed') return t.completed;
    return t.category === filterCategory;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    audioEngine.playActionExecute();
    onAddTask({
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      context: 'User created executive agenda item',
      dueTime: 'Today, EOD',
      priority: newTaskPriority,
      completed: false,
      category: newTaskCategory,
      actionType: 'review',
      provider: 'Aether Tasks Engine',
      deepLinkName: 'Execute Task',
      estimatedMinutes: 15,
    });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-3 gap-4 text-sky-100">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left">
          <h2 className="text-lg font-light tracking-tight text-white flex items-center gap-2">
            <span>Actionable Vector</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {pendingCount} Pending
            </span>
          </h2>
          <p className="text-xs text-sky-300/70 font-mono">
            Direct action triggers · Zero application friction
          </p>
        </div>

        <button
          onClick={() => setIsAddingTask(true)}
          className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-300 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        {['all', 'pending', 'academic', 'financial', 'work', 'communication', 'completed'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              audioEngine.playCategorySwitch();
              setFilterCategory(cat);
            }}
            className={`px-3 py-1 rounded-xl uppercase tracking-wider transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-sky-400 text-slate-950 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                : 'bg-slate-900/60 border border-sky-500/20 text-sky-300/70 hover:border-sky-400/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`group p-3.5 rounded-2xl border transition-all duration-200 flex flex-col gap-2.5 ${
              task.completed
                ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                : 'bg-slate-900/70 hover:bg-sky-950/40 border-sky-500/30 hover:border-sky-400 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox Trigger */}
              <button
                onClick={() => {
                  audioEngine.playActionExecute();
                  onToggleTask(task.id);
                }}
                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                  task.completed
                    ? 'bg-sky-500 border-sky-400 text-slate-950'
                    : 'border-sky-400/50 hover:border-sky-300 hover:bg-sky-500/10'
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              {/* Content */}
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span
                  className={`text-sm font-medium tracking-tight ${
                    task.completed
                      ? 'line-through text-slate-400'
                      : 'text-sky-100 group-hover:text-white'
                  }`}
                >
                  {task.title}
                </span>

                <span className="text-xs text-sky-300/70 line-clamp-1 mt-0.5">
                  {task.context}
                </span>

                <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-sky-400/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    {task.dueTime}
                  </span>
                  <span>·</span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-300 uppercase">
                    {task.category}
                  </span>
                  <span>·</span>
                  <span>{task.provider}</span>
                </div>
              </div>
            </div>

            {/* Direct Deep Execution Action Button */}
            {!task.completed && (
              <div className="flex items-center justify-between pt-2 border-t border-sky-500/20">
                <span className="text-[10px] text-sky-400/70 font-mono">
                  {task.estimatedMinutes}m runtime
                </span>

                <button
                  onClick={() => onExecuteDeepAction(task)}
                  className="px-3 py-1 rounded-xl bg-sky-500/20 hover:bg-sky-500/40 border border-sky-400/50 text-sky-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                >
                  <span>{task.deepLinkName}</span>
                  <ArrowUpRight className="w-3 h-3 text-sky-300" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Task Modal Sheet */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-sm rounded-3xl bg-slate-900 border border-sky-400/60 p-5 flex flex-col gap-3 shadow-[0_0_35px_rgba(56,189,248,0.3)] text-sky-100"
          >
            <h3 className="text-base font-semibold text-white">Create New Task Directive</h3>

            <input
              type="text"
              autoFocus
              placeholder="e.g. Wireframe Aether OS Widget aperture..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-sky-500/40 text-sm text-sky-100 placeholder:text-sky-500/50 focus:outline-none focus:border-sky-300"
            />

            <div className="flex items-center justify-between text-xs font-mono text-sky-300">
              <span>Category:</span>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="px-2 py-1 rounded bg-slate-950 border border-sky-500/40 text-sky-200"
              >
                <option value="work">Work</option>
                <option value="academic">Academic (UVU)</option>
                <option value="financial">Financial</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-sky-300">
              <span>Priority Vector:</span>
              <div className="flex items-center gap-1.5">
                {(['p1', 'p2', 'p3'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewTaskPriority(p)}
                    className={`px-2.5 py-1 rounded text-xs font-mono uppercase ${
                      newTaskPriority === p
                        ? 'bg-sky-400 text-slate-950 font-bold'
                        : 'bg-slate-950 border border-sky-500/30 text-sky-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-sky-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-semibold shadow-[0_0_15px_rgba(56,189,248,0.4)]"
              >
                Add Vector
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
