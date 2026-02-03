'use client';

import { FocusSession, formatDuration } from '@/types';
import { getSessions } from '@/lib/storage';
import { useState, useEffect } from 'react';

export function SessionHistory() {
    const [sessions, setSessions] = useState<FocusSession[]>([]);

    useEffect(() => {
        setSessions(
            getSessions()
                .filter((s) => s.type === 'work')
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 10)
        );
    }, []);

    if (sessions.length === 0) {
        return (
            <div className="card p-5 text-center text-[13px] text-[var(--color-text-muted)]">
                No focus sessions yet
            </div>
        );
    }

    return (
        <div className="card p-5">
            <div className="section-header"><h2>Recent Sessions</h2></div>
            <div className="border border-[var(--color-border)] rounded-md overflow-hidden">
                {/* Header row */}
                <div className="flex items-center h-[32px] px-3 bg-[var(--color-bg-secondary)] text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-[0.04em] border-b border-[var(--color-border)]">
                    <span className="flex-1">Duration</span>
                    <span className="w-[120px] text-right">Date</span>
                    <span className="w-[80px] text-right">Time</span>
                </div>
                {sessions.map((s, i) => {
                    const d = new Date(s.completedAt);
                    return (
                        <div key={s.id} className={`flex items-center h-[36px] px-3 text-[13px] hover:bg-[var(--color-bg-surface-hover)] transition-colors duration-75 ${i > 0 ? 'border-t border-[var(--color-border-subtle)]' : ''}`}>
                            <span className="flex-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                                {formatDuration(s.duration)}
                            </span>
                            <span className="w-[120px] text-right text-[var(--color-text-muted)]">{d.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                            <span className="w-[80px] text-right text-[var(--color-text-muted)]">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
