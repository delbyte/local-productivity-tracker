'use client';

import { Task, DEFAULT_CATEGORIES } from '@/types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
    high: 'var(--color-danger)',
    medium: 'var(--color-warning)',
    low: 'var(--color-info)',
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const done = task.status === 'done';
    const cat = DEFAULT_CATEGORIES.find((c) => c.id === task.categoryId);

    return (
        <div className={`group flex items-center gap-3 px-3 h-[40px] transition-colors duration-75 hover:bg-[var(--color-bg-surface-hover)] ${done ? 'opacity-50' : ''}`}>
            {/* Checkbox */}
            <button
                onClick={() => onToggle(task.id)}
                className={`w-[16px] h-[16px] rounded-sm border flex items-center justify-center shrink-0 transition-all duration-100 ${done
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                        : 'border-[var(--color-text-muted)] hover:border-[var(--color-accent)]'
                    }`}
            >
                {done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </button>

            {/* Priority indicator */}
            <span
                className="w-[3px] h-[16px] rounded-full shrink-0"
                style={{ background: PRIORITY_COLORS[task.priority] || 'var(--color-border)' }}
            />

            {/* Title */}
            <span className={`flex-1 text-[13px] truncate ${done ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                {task.title}
            </span>

            {/* Category tag */}
            {cat && (
                <span
                    className="badge shrink-0"
                    style={{ background: `${cat.color}14`, color: cat.color }}
                >
                    {cat.name}
                </span>
            )}

            {/* Delete */}
            <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 shrink-0 w-[24px] h-[24px] flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)] transition-all duration-75"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}
