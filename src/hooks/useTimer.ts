'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, generateId, AppSettings } from '@/types';
import { getSettings, getSessions, saveSessions } from '@/lib/storage';

export function useTimer() {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [mode, setMode] = useState<TimerMode>('idle');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCount, setSessions] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<string>('');

    useEffect(() => {
        const s = getSettings();
        setSettings(s);
        setTimeLeft(s.workDuration * 60);
    }, []);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return clearTimer;
    }, [clearTimer]);

    useEffect(() => {
        if (!isRunning || !settings) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    handleSessionComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return clearTimer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, settings]);

    const handleSessionComplete = useCallback(() => {
        if (!settings) return;

        const now = new Date().toISOString();
        const duration =
            mode === 'work'
                ? settings.workDuration
                : mode === 'break'
                    ? settings.breakDuration
                    : settings.longBreakDuration;

        // Log the session
        const session = {
            id: generateId(),
            duration,
            startedAt: startTimeRef.current,
            completedAt: now,
            type: (mode === 'work' ? 'work' : 'break') as 'work' | 'break',
        };
        const allSessions = getSessions();
        saveSessions([...allSessions, session]);

        // Transition to next mode
        if (mode === 'work') {
            const newCount = sessionsCount + 1;
            setSessions(newCount);
            if (newCount % settings.sessionsBeforeLongBreak === 0) {
                setMode('longBreak');
                setTimeLeft(settings.longBreakDuration * 60);
            } else {
                setMode('break');
                setTimeLeft(settings.breakDuration * 60);
            }
        } else {
            setMode('work');
            setTimeLeft(settings.workDuration * 60);
        }
    }, [mode, settings, sessionsCount]);

    const start = useCallback(() => {
        if (mode === 'idle' && settings) {
            setMode('work');
            setTimeLeft(settings.workDuration * 60);
        }
        startTimeRef.current = new Date().toISOString();
        setIsRunning(true);
    }, [mode, settings]);

    const pause = useCallback(() => {
        setIsRunning(false);
        clearTimer();
    }, [clearTimer]);

    const reset = useCallback(() => {
        setIsRunning(false);
        clearTimer();
        setMode('idle');
        setSessions(0);
        if (settings) setTimeLeft(settings.workDuration * 60);
    }, [clearTimer, settings]);

    const skip = useCallback(() => {
        setIsRunning(false);
        clearTimer();
        handleSessionComplete();
    }, [clearTimer, handleSessionComplete]);

    const totalDuration = settings
        ? mode === 'work'
            ? settings.workDuration * 60
            : mode === 'break'
                ? settings.breakDuration * 60
                : mode === 'longBreak'
                    ? settings.longBreakDuration * 60
                    : settings.workDuration * 60
        : 0;

    const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

    return {
        mode,
        timeLeft,
        isRunning,
        sessionsCount,
        progress,
        start,
        pause,
        reset,
        skip,
    };
}
