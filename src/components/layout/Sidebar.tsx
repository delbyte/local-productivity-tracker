'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
    {
        href: '/',
        label: 'Dashboard',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="8" height="8" rx="1" />
                <rect x="13" y="3" width="8" height="8" rx="1" />
                <rect x="3" y="13" width="8" height="8" rx="1" />
                <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>
        ),
    },
    {
        href: '/analytics',
        label: 'Analytics',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-8" />
            </svg>
        ),
    },
    {
        href: '/settings',
        label: 'Settings',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m17.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.73 0l-1.41-1.41M6.34 6.34L4.93 4.93" />
            </svg>
        ),
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[200px] h-screen flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0 select-none">
            {/* Brand */}
            <div className="h-[52px] flex items-center px-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                    <div className="w-[22px] h-[22px] rounded bg-[var(--color-accent)] flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    </div>
                    <span className="text-[13px] font-semibold tracking-[-0.01em]">Flowstate</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-2 px-2">
                {NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 h-[30px] px-2 rounded text-[13px] font-medium no-underline transition-all duration-100 ${active
                                    ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-hover)]'
                                }`}
                        >
                            <span className={active ? 'text-[var(--color-accent)]' : ''}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-[var(--color-border)]">
                <p className="text-[11px] text-[var(--color-text-muted)]">All data stored locally</p>
            </div>
        </aside>
    );
}
