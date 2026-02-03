'use client';

import { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';

export function DailyGoals() {
    const { goals, addGoal, toggleGoal, removeGoal, completedCount } = useGoals();
    const [value, setValue] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        addGoal(value.trim());
        setValue('');
    };

    return (
        <div className="card p-5">
            <div className="section-header mb-3">
                <h2>Daily Goals</h2>
                <span className="text-[12px] text-[var(--color-text-muted)]">{completedCount}/{goals.length}</span>
            </div>

            <form onSubmit={handleAdd} className="flex gap-1.5 mb-3">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Add a goal..."
                    className="input flex-1"
                />
                <button type="submit" disabled={!value.trim()} className="btn-primary">+</button>
            </form>

            <div>
                {goals.length === 0 ? (
                    <p className="text-[13px] text-[var(--color-text-muted)] text-center py-6">No goals set for today</p>
                ) : (
                    goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="group flex items-center gap-2.5 h-[32px] px-1 hover:bg-[var(--color-bg-surface-hover)] rounded transition-colors duration-75"
                        >
                            <button
                                onClick={() => toggleGoal(goal.id)}
                                className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center shrink-0 transition-all duration-100 ${goal.completed
                                        ? 'bg-[var(--color-success)] border-[var(--color-success)]'
                                        : 'border-[var(--color-text-muted)] hover:border-[var(--color-success)]'
                                    }`}
                            >
                                {goal.completed && (
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                            <span className={`flex-1 text-[13px] ${goal.completed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                                {goal.title}
                            </span>
                            <button
                                onClick={() => removeGoal(goal.id)}
                                className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-opacity duration-75"
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
