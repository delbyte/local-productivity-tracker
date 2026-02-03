'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { StreakDisplay } from '@/components/analytics/StreakDisplay';
import { SessionHistory } from '@/components/timer/SessionHistory';
import { getWeekStats } from '@/lib/storage';
import { getToday, DayStats, formatDuration } from '@/types';

export default function AnalyticsPage() {
    const [week, setWeek] = useState<DayStats[]>([]);
    const [totals, setTotals] = useState({ focus: 0, tasks: 0, avg: 0 });

    useEffect(() => {
        const data = getWeekStats(getToday());
        setWeek(data);
        const focus = data.reduce((s, d) => s + d.focusMinutes, 0);
        const tasks = data.reduce((s, d) => s + d.tasksCompleted, 0);
        const scored = data.filter((d) => d.score > 0);
        const avg = scored.length ? Math.round(scored.reduce((s, d) => s + d.score, 0) / scored.length) : 0;
        setTotals({ focus, tasks, avg });
    }, []);

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1>Analytics</h1>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">Productivity trends and streaks</p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Focus this week', value: formatDuration(totals.focus), color: 'var(--color-accent)' },
                        { label: 'Tasks completed', value: String(totals.tasks), color: 'var(--color-info)' },
                        { label: 'Avg. score', value: String(totals.avg), color: 'var(--color-warning)' },
                    ].map((s, i) => (
                        <div key={i} className="card p-4 text-center">
                            <p className="text-[22px] font-semibold tracking-[-0.02em]" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <WeeklyChart data={week} />
                    <StreakDisplay />
                </div>

                <SessionHistory />
            </div>
        </AppShell>
    );
}
