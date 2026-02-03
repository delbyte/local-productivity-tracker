'use client';

import { DayStats } from '@/types';

interface WeeklyChartProps { data: DayStats[]; }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyChart({ data }: WeeklyChartProps) {
    const maxScore = Math.max(...data.map((d) => d.score), 1);

    return (
        <div className="card p-5">
            <div className="section-header mb-4">
                <h2>Weekly Overview</h2>
            </div>

            {/* Score bars */}
            <div className="flex items-end gap-[6px] h-[100px] mb-2">
                {data.map((day) => {
                    const pct = (day.score / maxScore) * 100;
                    const d = new Date(day.date);
                    const label = DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
                    return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums">{day.score}</span>
                            <div className="w-full flex justify-center" style={{ height: 72 }}>
                                <div
                                    className="w-full max-w-[28px] rounded-[2px] transition-all duration-300"
                                    style={{
                                        height: `${Math.max(pct * 0.72, 2)}px`,
                                        background: day.score > 0 ? 'var(--color-accent)' : 'var(--color-border)',
                                        alignSelf: 'flex-end',
                                    }}
                                />
                            </div>
                            <span className="text-[10px] text-[var(--color-text-muted)]">{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Mini metrics */}
            <div className="divider my-4" />
            <div className="grid grid-cols-2 gap-3">
                <MiniMetric label="Tasks Completed" data={data.map((d) => d.tasksCompleted)} color="var(--color-info)" />
                <MiniMetric label="Focus Minutes" data={data.map((d) => d.focusMinutes)} color="var(--color-warning)" />
            </div>
        </div>
    );
}

function MiniMetric({ label, data, color }: { label: string; data: number[]; color: string }) {
    const max = Math.max(...data, 1);
    return (
        <div className="p-2.5 rounded bg-[var(--color-bg-secondary)]">
            <p className="text-[11px] text-[var(--color-text-muted)] mb-2">{label}</p>
            <div className="flex items-end gap-[3px] h-[28px]">
                {data.map((v, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-[1px]"
                        style={{
                            height: `${Math.max((v / max) * 24, 1)}px`,
                            background: v > 0 ? color : 'var(--color-border)',
                            opacity: v > 0 ? 0.75 : 0.3,
                            alignSelf: 'flex-end',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
