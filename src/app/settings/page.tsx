'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { AppSettings, DEFAULT_SETTINGS } from '@/types';
import { getSettings, saveSettings, clearAllData } from '@/lib/storage';
import { exportData, importData } from '@/lib/dataExport';

export default function SettingsPage() {
    const [settings, setLocal] = useState<AppSettings>(DEFAULT_SETTINGS);
    const { toasts, addToast, removeToast } = useToast();
    const [confirmClear, setConfirmClear] = useState(false);

    useEffect(() => { setLocal(getSettings()); }, []);

    const update = (key: keyof AppSettings, v: number | boolean) => {
        const next = { ...settings, [key]: v };
        setLocal(next);
        saveSettings(next);
        addToast('Saved', 'success');
    };

    return (
        <AppShell>
            <div className="space-y-6 max-w-xl">
                <div>
                    <h1>Settings</h1>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">Configure your workspace</p>
                </div>

                {/* Timer */}
                <div className="card p-5">
                    <div className="section-header"><h2>Timer</h2></div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Work (min)" value={settings.workDuration} onChange={(v) => update('workDuration', v)} />
                        <Field label="Break (min)" value={settings.breakDuration} onChange={(v) => update('breakDuration', v)} />
                        <Field label="Long break (min)" value={settings.longBreakDuration} onChange={(v) => update('longBreakDuration', v)} />
                        <Field label="Sessions before long break" value={settings.sessionsBeforeLongBreak} onChange={(v) => update('sessionsBeforeLongBreak', v)} />
                    </div>
                </div>

                {/* Targets */}
                <div className="card p-5">
                    <div className="section-header"><h2>Daily Targets</h2></div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Task target" value={settings.dailyTaskGoal} onChange={(v) => update('dailyTaskGoal', v)} />
                        <Field label="Focus target (min)" value={settings.dailyFocusGoal} onChange={(v) => update('dailyFocusGoal', v)} />
                    </div>
                </div>

                {/* Data */}
                <div className="card p-5">
                    <div className="section-header"><h2>Data</h2></div>
                    <p className="text-[13px] text-[var(--color-text-muted)] mb-3">All data is stored in your browser&apos;s localStorage.</p>
                    <div className="flex gap-2">
                        <button onClick={() => { exportData(); addToast('Exported', 'success'); }} className="btn-secondary">Export</button>
                        <button onClick={async () => { const ok = await importData(); addToast(ok ? 'Imported' : 'Failed', ok ? 'success' : 'error'); if (ok) setLocal(getSettings()); }} className="btn-secondary">Import</button>
                    </div>
                </div>

                {/* Danger */}
                <div className="card p-5 border-[var(--color-danger)]/20">
                    <div className="section-header"><h2 className="!text-[var(--color-danger)]">Danger Zone</h2></div>
                    {!confirmClear ? (
                        <button onClick={() => setConfirmClear(true)} className="btn-secondary !border-[var(--color-danger)]/30 !text-[var(--color-danger)]">Clear All Data</button>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-[13px] text-[var(--color-danger)]">This permanently deletes everything. Cannot be undone.</p>
                            <div className="flex gap-2">
                                <button onClick={() => { clearAllData(); setLocal(DEFAULT_SETTINGS); setConfirmClear(false); addToast('Data cleared', 'info'); }}
                                    className="btn-primary !bg-[var(--color-danger)]">Delete Everything</button>
                                <button onClick={() => setConfirmClear(false)} className="btn-secondary">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </AppShell>
    );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div>
            <label className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-[0.04em] mb-1 block">{label}</label>
            <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} min={1} className="input" />
        </div>
    );
}
