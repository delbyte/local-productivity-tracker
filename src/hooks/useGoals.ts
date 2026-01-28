'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyGoal, generateId, getToday } from '@/types';
import { getGoals, saveGoalForDate, removeGoal as removeGoalFromStorage } from '@/lib/storage';

export function useGoals(date?: string) {
    const targetDate = date || getToday();
    const [goals, setGoals] = useState<DailyGoal[]>([]);

    const refresh = useCallback(() => {
        setGoals(getGoals(targetDate));
    }, [targetDate]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addGoal = useCallback(
        (title: string) => {
            const goal: DailyGoal = {
                id: generateId(),
                title,
                completed: false,
                date: targetDate,
            };
            saveGoalForDate(goal);
            refresh();
            return goal;
        },
        [targetDate, refresh]
    );

    const toggleGoal = useCallback(
        (id: string) => {
            const goal = goals.find((g) => g.id === id);
            if (goal) {
                saveGoalForDate({ ...goal, completed: !goal.completed });
                refresh();
            }
        },
        [goals, refresh]
    );

    const removeGoal = useCallback(
        (id: string) => {
            removeGoalFromStorage(id);
            refresh();
        },
        [refresh]
    );

    const completedCount = goals.filter((g) => g.completed).length;
    const progress = goals.length > 0 ? completedCount / goals.length : 0;

    return {
        goals,
        addGoal,
        toggleGoal,
        removeGoal,
        completedCount,
        progress,
    };
}
