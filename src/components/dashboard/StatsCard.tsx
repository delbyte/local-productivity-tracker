'use client';

interface StatsCardProps {
    label: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    color?: string;
}

export function StatsCard({ label, value, change, icon, color = 'var(--color-accent)' }: StatsCardProps) {
    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-medium text-[var(--color-text-muted)] uppercase tracking-[0.04em]">{label}</span>
                <span className="text-[var(--color-text-muted)]">{icon}</span>
            </div>
            <p className="text-[22px] font-semibold tracking-[-0.02em] leading-none">{value}</p>
            {change && (
                <p className="text-[11px] mt-1.5" style={{ color }}>{change}</p>
            )}
        </div>
    );
}
