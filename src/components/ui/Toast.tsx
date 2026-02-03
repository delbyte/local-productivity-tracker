'use client';

import { ToastItem } from '@/hooks/useToast';
import { useEffect, useState } from 'react';

const STYLES: Record<string, { bg: string; border: string; color: string }> = {
    success: { bg: 'var(--color-success-muted)', border: 'transparent', color: 'var(--color-success)' },
    error: { bg: 'var(--color-danger-muted)', border: 'transparent', color: 'var(--color-danger)' },
    info: { bg: 'var(--color-accent-muted)', border: 'transparent', color: 'var(--color-accent)' },
};

function Toast({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
    const [show, setShow] = useState(false);
    const s = STYLES[toast.type];

    useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

    return (
        <div
            className="flex items-center gap-2 px-3 h-[34px] rounded text-[13px] font-medium shadow-lg transition-all duration-150"
            style={{
                background: s.bg,
                color: s.color,
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(8px)',
            }}
        >
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => onRemove(toast.id)} className="opacity-60 hover:opacity-100">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
    if (toasts.length === 0) return null;
    return (
        <div className="fixed bottom-3 right-3 z-50 flex flex-col gap-1.5">
            {toasts.map((t) => <Toast key={t.id} toast={t} onRemove={onRemove} />)}
        </div>
    );
}
