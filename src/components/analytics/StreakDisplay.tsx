'use client';

import { useEffect, useState } from 'react';
import { getStreakData, StreakData, getHeatmapData } from '@/lib/streaks';

const LEVELS = ['var(--color-border)', '#1e3a2f', '#26604a', '#30a46c', '#3dd68c'];

export function StreakDisplay() {
    const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, todayComplete: false });
    const [heatmap, setHeatmap] = useState<{ date: string; level: number }[]>([]);

    useEffect(() => {
        setStreak(getStreakData());
        setHeatmap(getHeatmapData(28));
    }, []);

    return (
        <div className="card p-5">
            <div className="section-header mb-4">
                <h2>Streaks</h2>
                <span className={`badge ${streak.todayComplete ? 'bg-[var(--color-success-muted)] text-[var(--color-success)]' : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]'}`}>
                    {streak.todayComplete ? 'Today ✓' : 'Today ○'}
                </span>
            </div>

            <div className="flex gap-8 mb-5">
                <div>
                    <p className="text-[28px] font-semibold tracking-[-0.03em]" style={{ color: 'var(--color-accent)' }}>{streak.current}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Current</p>
                </div>
                <div>
                    <p className="text-[28px] font-semibold tracking-[-0.03em]">{streak.longest}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Longest</p>
                </div>
            </div>

            {/* Heatmap */}
            <p className="text-[11px] text-[var(--color-text-muted)] mb-2">Last 28 days</p>
            <div className="grid grid-cols-7 gap-[3px]">
                {heatmap.map((day) => (
                    <div
                        key={day.date}
                        className="aspect-square rounded-[2px]"
                        style={{ background: LEVELS[day.level] }}
                        title={`${day.date}`}
                    />
                ))}
            </div>
        </div>
    );
}
