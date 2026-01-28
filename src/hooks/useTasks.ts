'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskInput, generateId, getToday } from '@/types';
import { getTasks, saveTasks } from '@/lib/storage';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        setTasks(getTasks());
    }, []);

    const persist = useCallback((updated: Task[]) => {
        setTasks(updated);
        saveTasks(updated);
    }, []);

    const addTask = useCallback(
        (input: CreateTaskInput) => {
            const task: Task = {
                ...input,
                id: generateId(),
                createdAt: new Date().toISOString(),
            };
            persist([task, ...getTasks()]);
            return task;
        },
        [persist]
    );

    const updateTask = useCallback(
        (id: string, updates: Partial<Task>) => {
            const all = getTasks().map((t) =>
                t.id === id ? { ...t, ...updates } : t
            );
            persist(all);
        },
        [persist]
    );

    const toggleTask = useCallback(
        (id: string) => {
            const all = getTasks().map((t) => {
                if (t.id !== id) return t;
                const isDone = t.status === 'done';
                return {
                    ...t,
                    status: isDone ? ('todo' as const) : ('done' as const),
                    completedAt: isDone ? undefined : new Date().toISOString(),
                };
            });
            persist(all);
        },
        [persist]
    );

    const deleteTask = useCallback(
        (id: string) => {
            persist(getTasks().filter((t) => t.id !== id));
        },
        [persist]
    );

    // Derived data
    const todaysTasks = tasks.filter((t) => {
        const today = getToday();
        return t.createdAt.startsWith(today) || (t.dueDate && t.dueDate === today);
    });

    const activeTasks = tasks.filter((t) => t.status !== 'done');
    const completedToday = tasks.filter(
        (t) => t.completedAt && t.completedAt.startsWith(getToday())
    );

    return {
        tasks,
        todaysTasks,
        activeTasks,
        completedToday,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
    };
}
