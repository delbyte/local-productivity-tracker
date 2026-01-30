'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { FocusTimer } from '@/components/timer/FocusTimer';
import { DailyGoals } from '@/components/goals/DailyGoals';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { ToastContainer } from '@/components/ui/Toast';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/useToast';
import { getDayStats, hasSeenOnboarding } from '@/lib/storage';
import { getToday, formatDuration } from '@/types';
import { getStreakData } from '@/lib/streaks';

export default function DashboardPage() {
    const { tasks, completedToday, addTask, toggleTask, deleteTask } = useTasks();
    const { toasts, addToast, removeToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [stats, setStats] = useState({ tasksCompleted: 0, focusMinutes: 0, score: 0, goalsCompleted: 0, totalGoals: 0 });
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        setShowOnboarding(!hasSeenOnboarding());
        const s = getDayStats(getToday());
        setStats(s);
        setStreak(getStreakData().current);
    }, []);

    useEffect(() => {
        setStats(getDayStats(getToday()));
    }, [tasks]);

    const handleAdd = (input: Parameters<typeof addTask>[0]) => {
        addTask(input);
        setShowForm(false);
        addToast('Task created', 'success');
    };

    const handleToggle = (id: string) => {
        toggleTask(id);
        addToast('Task updated', 'info');
    };

    return (
        <AppShell>
            {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

            <div className="space-y-6">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Dashboard</h1>
                        <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                    <StatsCard label="Tasks" value={completedToday.length}
                        change={`of ${tasks.filter(t => t.status !== 'done').length + completedToday.length} total`}
                        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>}
                        color="var(--color-info)"
                    />
                    <StatsCard label="Focus" value={formatDuration(stats.focusMinutes)}
                        change="today"
                        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                        color="var(--color-warning)"
                    />
                    <StatsCard label="Goals" value={`${stats.goalsCompleted}/${stats.totalGoals || 0}`}
                        change="daily goals"
                        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>}
                        color="var(--color-success)"
                    />
                    <StatsCard label="Streak" value={`${streak}d`}
                        change="consecutive"
                        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                        color="var(--color-accent)"
                    />
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
                    {/* Left — Tasks */}
                    <div>
                        <div className="section-header">
                            <h2>Tasks</h2>
                            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                New
                            </button>
                        </div>
                        {showForm && <div className="mb-3"><TaskForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} /></div>}
                        <TaskList tasks={tasks} onToggle={handleToggle} onDelete={deleteTask} />
                    </div>

                    {/* Right — Sidebar widgets */}
                    <div className="space-y-3">
                        <div className="card p-4 flex flex-col items-center">
                            <ProgressRing progress={stats.score / 100} size={100} strokeWidth={4} label="Score" sublabel={`${stats.score}/100`} color="var(--color-accent)" />
                        </div>
                        <FocusTimer />
                        <DailyGoals />
                    </div>
                </div>
            </div>

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </AppShell>
    );
}
