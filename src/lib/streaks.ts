import { getDayStats } from './storage';

export interface StreakData {
    current: number;
    longest: number;
    todayComplete: boolean;
}

/**
 * A day counts as "productive" if the user completed at least 1 task
 * or logged at least 15 minutes of focus time.
 */
function isDayProductive(date: string): boolean {
    const stats = getDayStats(date);
    return stats.tasksCompleted >= 1 || stats.focusMinutes >= 15;
}

/**
 * Calculate the current streak (consecutive productive days ending today or yesterday)
 * and the longest ever streak within the last 365 days.
 */
export function getStreakData(): StreakData {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = today.toISOString().split('T')[0];
    const todayComplete = isDayProductive(todayStr);

    // Count current streak backwards from today
    let current = 0;
    const cursor = new Date(today);

    // If today isn't productive yet, start counting from yesterday
    if (!todayComplete) {
        cursor.setDate(cursor.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
        const dateStr = cursor.toISOString().split('T')[0];
        if (isDayProductive(dateStr)) {
            current++;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            break;
        }
    }

    // Calculate longest streak over last 365 days
    let longest = 0;
    let running = 0;
    const scanner = new Date(today);
    scanner.setDate(scanner.getDate() - 364);

    for (let i = 0; i < 365; i++) {
        const dateStr = scanner.toISOString().split('T')[0];
        if (isDayProductive(dateStr)) {
            running++;
            longest = Math.max(longest, running);
        } else {
            running = 0;
        }
        scanner.setDate(scanner.getDate() + 1);
    }

    return { current, longest, todayComplete };
}

/**
 * Get a heatmap-style array for the last N days
 * Returns { date, level } where level is 0-4 based on productivity score
 */
export function getHeatmapData(days: number = 30): { date: string; level: number }[] {
    const result: { date: string; level: number }[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const stats = getDayStats(dateStr);

        let level = 0;
        if (stats.score >= 80) level = 4;
        else if (stats.score >= 60) level = 3;
        else if (stats.score >= 30) level = 2;
        else if (stats.score > 0) level = 1;

        result.push({ date: dateStr, level });
    }

    return result;
}
