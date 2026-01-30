'use client';

interface ProgressRingProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    label?: string;
    sublabel?: string;
    color?: string;
}

export function ProgressRing({
    progress,
    size = 120,
    strokeWidth = 8,
    label,
    sublabel,
    color = 'var(--color-accent)',
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - Math.min(progress, 1) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="progress-ring-circle"
                        style={{
                            filter: `drop-shadow(0 0 6px ${color}40)`,
                        }}
                    />
                </svg>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">
                        {Math.round(progress * 100)}%
                    </span>
                </div>
            </div>
            {label && (
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {label}
                </p>
            )}
            {sublabel && (
                <p className="text-xs text-[var(--color-text-muted)]">{sublabel}</p>
            )}
        </div>
    );
}
