// ─── Core Enums & Literals ───────────────────────────────────────────────────

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TimerMode = 'work' | 'break' | 'longBreak' | 'idle';

// ─── Data Models ─────────────────────────────────────────────────────────────

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    categoryId: string;
    createdAt: string;
    completedAt?: string;
    dueDate?: string;
}

export interface FocusSession {
    id: string;
    taskId?: string;
    duration: number;
    startedAt: string;
    completedAt: string;
    type: 'work' | 'break';
}

export interface DailyGoal {
    id: string;
    title: string;
    completed: boolean;
    date: string;
}

export interface DayStats {
    date: string;
    tasksCompleted: number;
    focusMinutes: number;
    goalsCompleted: number;
    totalGoals: number;
    score: number;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
    dailyTaskGoal: number;
    dailyFocusGoal: number;
    soundEnabled: boolean;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: AppSettings = {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    dailyTaskGoal: 5,
    dailyFocusGoal: 120,
    soundEnabled: true,
};

export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'work', name: 'Work', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', color: '#06d6a0' },
    { id: 'learning', name: 'Learning', color: '#f59e0b' },
    { id: 'health', name: 'Health', color: '#ef4444' },
];

// ─── Utility Types ───────────────────────────────────────────────────────────

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'completedAt'>;
export type CreateGoalInput = Omit<DailyGoal, 'id' | 'completed'>;

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

export function formatDuration(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`;
}

export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
