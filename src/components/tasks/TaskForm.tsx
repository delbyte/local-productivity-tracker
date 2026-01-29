'use client';

import { useState } from 'react';
import { Priority, CreateTaskInput, DEFAULT_CATEGORIES } from '@/types';

interface TaskFormProps {
    onSubmit: (input: CreateTaskInput) => void;
    onCancel?: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORIES[0].id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), description: description.trim(), priority, status: 'todo', categoryId });
        setTitle('');
        setDescription('');
        setPriority('medium');
    };

    return (
        <form onSubmit={handleSubmit} className="card p-4 space-y-3 animate-in">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="input"
                autoFocus
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="textarea"
            />

            <div className="flex gap-3 items-end">
                {/* Priority */}
                <div className="flex-1">
                    <label className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-[0.04em] mb-1 block">Priority</label>
                    <div className="flex gap-1">
                        {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p)}
                                className={`flex-1 h-[28px] text-[11px] font-medium capitalize rounded transition-all duration-100 border ${priority === p
                                        ? p === 'high'
                                            ? 'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-transparent'
                                            : p === 'medium'
                                                ? 'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-transparent'
                                                : 'bg-[var(--color-info-muted)] text-[var(--color-info)] border-transparent'
                                        : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-border-active)]'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category */}
                <div className="flex-1">
                    <label className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-[0.04em] mb-1 block">Category</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="select">
                        {DEFAULT_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                <button type="submit" disabled={!title.trim()} className="btn-primary">Add Task</button>
                {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
            </div>
        </form>
    );
}
