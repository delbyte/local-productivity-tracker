'use client';

import { formatTime, TimerMode } from '@/types';
import { useTimer } from '@/hooks/useTimer';

const MODE_CONFIG: Record<TimerMode, { label: string; color: string }> = {
    idle: { label: 'Ready', color: 'var(--color-text-muted)' },
    work: { label: 'Focus', color: 'var(--color-accent)' },
    break: { label: 'Break', color: 'var(--color-success)' },
    longBreak: { label: 'Long Break', color: 'var(--color-warning)' },
};

export function FocusTimer() {
    const { mode, timeLeft, isRunning, sessionsCount, progress, start, pause, reset, skip } = useTimer();
    const config = MODE_CONFIG[mode];

    const r = 70;
    const circ = 2 * Math.PI * r;
    const offset = circ - progress * circ;

    return (
        <div className="card p-5">
            <div className="section-header mb-4">
                <h2>Focus Timer</h2>
                <span className="text-[12px] text-[var(--color-text-muted)]">Session {sessionsCount}</span>
            </div>

            <div className="flex flex-col items-center gap-4">
                {/* Timer display */}
                <div className="relative" style={{ width: 160, height: 160 }}>
                    <svg width="160" height="160" className="transform -rotate-90">
                        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--color-border)" strokeWidth="3" />
                        <circle
                            cx="80" cy="80" r={r} fill="none"
                            stroke={config.color} strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={circ} strokeDashoffset={offset}
                            className="progress-ring-track"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[28px] font-semibold tracking-[-0.03em] tabular-nums" style={{ color: config.color }}>
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-[0.06em] mt-0.5">
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-1.5">
                    {!isRunning ? (
                        <button onClick={start} className="btn-primary" style={{ background: config.color }}>
                            {mode === 'idle' ? 'Start' : 'Resume'}
                        </button>
                    ) : (
                        <button onClick={pause} className="btn-secondary">Pause</button>
                    )}
                    {mode !== 'idle' && (
                        <>
                            <button onClick={skip} className="btn-ghost">Skip</button>
                            <button onClick={reset} className="btn-ghost hover:!text-[var(--color-danger)]">Reset</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
