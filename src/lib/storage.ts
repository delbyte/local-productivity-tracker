import {
    Task, FocusSession, DailyGoal, AppSettings, Category,
    DEFAULT_SETTINGS, DEFAULT_CATEGORIES, DayStats
} from '@/types';

// ─── Storage Keys ────────────────────────────────────────────────────────────

const KEYS = {
    tasks: 'lpt-tasks',
    sessions: 'lpt-sessions',
    goals: 'lpt-goals',
    settings: 'lpt-settings',
    categories: 'lpt-categories',
    onboarding: 'lpt-onboarding-seen',
} as const;

// ─── Generic Helpers ─────────────────────────────────────────────────────────

function getItem<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const getTasks = (): Task[] => getItem(KEYS.tasks, []);
export const saveTasks = (t: Task[]): void => setItem(KEYS.tasks, t);

// ─── Focus Sessions ─────────────────────────────────────────────────────────

export const getSessions = (): FocusSession[] => getItem(KEYS.sessions, []);
export const saveSessions = (s: FocusSession[]): void => setItem(KEYS.sessions, s);

// ─── Goals ───────────────────────────────────────────────────────────────────

export function getGoals(date?: string): DailyGoal[] {
    const all = getItem<DailyGoal[]>(KEYS.goals, []);
    return date ? all.filter((g) => g.date === date) : all;
}

export function saveGoals(goals: DailyGoal[]): void {
    setItem(KEYS.goals, goals);
}

export function saveGoalForDate(goal: DailyGoal): void {
    const all = getItem<DailyGoal[]>(KEYS.goals, []);
    const idx = all.findIndex((g) => g.id === goal.id);
    if (idx >= 0) all[idx] = goal;
    else all.push(goal);
    setItem(KEYS.goals, all);
}

export function removeGoal(id: string): void {
    const all = getItem<DailyGoal[]>(KEYS.goals, []);
    setItem(KEYS.goals, all.filter((g) => g.id !== id));
}

// ─── Settings ────────────────────────────────────────────────────────────────

export const getSettings = (): AppSettings => getItem(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (s: AppSettings): void => setItem(KEYS.settings, s);

// ─── Categories ──────────────────────────────────────────────────────────────

export const getCategories = (): Category[] => getItem(KEYS.categories, DEFAULT_CATEGORIES);
export const saveCategories = (c: Category[]): void => setItem(KEYS.categories, c);

// ─── Onboarding ──────────────────────────────────────────────────────────────

export const hasSeenOnboarding = (): boolean => getItem(KEYS.onboarding, false);
export const markOnboardingSeen = (): void => setItem(KEYS.onboarding, true);

// ─── Stats ───────────────────────────────────────────────────────────────────

export function getDayStats(date: string): DayStats {
    const tasks = getTasks();
    const sessions = getSessions();
    const goals = getGoals(date);
    const settings = getSettings();

    const completed = tasks.filter(
        (t) => t.completedAt && t.completedAt.startsWith(date)
    );
    const daySessions = sessions.filter(
        (s) => s.completedAt.startsWith(date) && s.type === 'work'
    );
    const focusMins = daySessions.reduce((s, x) => s + x.duration, 0);
    const goalsComplete = goals.filter((g) => g.completed).length;

    const taskScore = Math.min(completed.length / Math.max(settings.dailyTaskGoal, 1), 1) * 40;
    const focusScore = Math.min(focusMins / Math.max(settings.dailyFocusGoal, 1), 1) * 40;
    const goalScore = goals.length > 0 ? (goalsComplete / goals.length) * 20 : 20;

    return {
        date,
        tasksCompleted: completed.length,
        focusMinutes: focusMins,
        goalsCompleted: goalsComplete,
        totalGoals: goals.length,
        score: Math.round(taskScore + focusScore + goalScore),
    };
}

export function getWeekStats(endDate: string): DayStats[] {
    const stats: DayStats[] = [];
    const end = new Date(endDate);
    for (let i = 6; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        stats.push(getDayStats(d.toISOString().split('T')[0]));
    }
    return stats;
}

// ─── Bulk Data ───────────────────────────────────────────────────────────────

export function getAllData() {
    return {
        tasks: getTasks(),
        sessions: getSessions(),
        goals: getGoals(),
        settings: getSettings(),
        categories: getCategories(),
    };
}

export function importAllData(data: ReturnType<typeof getAllData>): void {
    if (data.tasks) saveTasks(data.tasks);
    if (data.sessions) saveSessions(data.sessions);
    if (data.goals) saveGoals(data.goals);
    if (data.settings) saveSettings(data.settings);
    if (data.categories) saveCategories(data.categories);
}

export function clearAllData(): void {
    Object.values(KEYS).forEach((k) => {
        if (typeof window !== 'undefined') localStorage.removeItem(k);
    });
}
