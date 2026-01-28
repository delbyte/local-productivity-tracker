'use client';

import { useEffect } from 'react';

interface ShortcutMap {
    [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Ignore when typing in inputs
            const tag = (e.target as HTMLElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            const key = [
                e.ctrlKey && 'ctrl',
                e.shiftKey && 'shift',
                e.altKey && 'alt',
                e.key.toLowerCase(),
            ]
                .filter(Boolean)
                .join('+');

            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }

            // Also try without modifiers for simple key shortcuts
            if (shortcuts[e.key.toLowerCase()] && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                shortcuts[e.key.toLowerCase()]();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}
