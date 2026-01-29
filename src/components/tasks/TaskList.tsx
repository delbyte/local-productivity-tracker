'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

type Filter = 'all' | 'active' | 'done';

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
    const [filter, setFilter] = useState<Filter>('all');

    const filtered = tasks.filter((t) => {
        if (filter === 'active') return t.status !== 'done';
        if (filter === 'done') return t.status === 'done';
        return true;
    });

    const counts = {
        all: tasks.length,
        active: tasks.filter((t) => t.status !== 'done').length,
        done: tasks.filter((t) => t.status === 'done').length,
    };

    return (
        <div>
            {/* Filter bar */}
            <div className="flex items-center gap-0.5 mb-3">
                {(['all', 'active', 'done'] as Filter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`h-[26px] px-2.5 text-[12px] font-medium capitalize rounded transition-all duration-100 ${filter === f
                                ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                            }`}
                    >
                        {f} ({counts[f]})
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="border border-[var(--color-border)] rounded-md overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-10 text-center text-[13px] text-[var(--color-text-muted)]">
                        {filter === 'done' ? 'No completed tasks' : 'No tasks yet'}
                    </div>
                ) : (
                    filtered.map((task, i) => (
                        <div key={task.id} className={i > 0 ? 'border-t border-[var(--color-border-subtle)]' : ''}>
                            <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
