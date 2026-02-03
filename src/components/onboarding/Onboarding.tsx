'use client';

import { useState } from 'react';
import { markOnboardingSeen } from '@/lib/storage';

interface OnboardingProps { onComplete: () => void; }

const STEPS = [
    { title: 'Welcome to Flowstate', desc: 'Your local productivity command center. Tasks, focus sessions, goals — all stored in your browser.', color: 'var(--color-accent)' },
    { title: 'Manage Tasks', desc: 'Create tasks with priorities and categories. Track progress at a glance.', color: 'var(--color-info)' },
    { title: 'Deep Focus', desc: 'Pomodoro timer with automatic work/break cycles to maximize your concentration.', color: 'var(--color-success)' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(0);
    const s = STEPS[step];

    const next = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
        else { markOnboardingSeen(); onComplete(); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="card max-w-sm w-full mx-4 p-6 text-center animate-in">
                {/* Dots */}
                <div className="flex justify-center gap-1.5 mb-5">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`h-[3px] rounded-full transition-all duration-200 ${i === step ? 'w-5' : 'w-1.5'}`}
                            style={{ background: i === step ? s.color : 'var(--color-border)' }}
                        />
                    ))}
                </div>

                <h3 className="text-[16px] font-semibold mb-2">{s.title}</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-6">{s.desc}</p>

                <div className="flex gap-2 justify-center">
                    <button onClick={() => { markOnboardingSeen(); onComplete(); }} className="btn-ghost">Skip</button>
                    <button onClick={next} className="btn-primary">{step < STEPS.length - 1 ? 'Next' : 'Get Started'}</button>
                </div>
            </div>
        </div>
    );
}
