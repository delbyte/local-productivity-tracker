'use client';

import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-[1200px] mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
