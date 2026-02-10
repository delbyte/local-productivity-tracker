# ⚡ Flowstate — Local Productivity Tracker

A beautiful, local-first productivity tracker built with Next.js 15. Set goals, manage tasks, track focus sessions with a Pomodoro timer, and visualize your productivity — all stored privately in your browser.

## Features

- **📋 Task Management** — Create, organize, and track tasks with priorities and categories
- **⏱️ Focus Timer** — Pomodoro-style timer with work/break/long-break cycles
- **🎯 Daily Goals** — Set daily objectives and track completion
- **📊 Analytics** — Weekly charts, productivity scores, and streak tracking
- **🗂️ Data Management** — Export/import your data as JSON backups
- **🖥️ 100% Local** — All data stored in localStorage, nothing leaves your browser

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Storage**: Browser localStorage
- **Font**: Inter (via next/font)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── analytics/         # Analytics page
│   └── settings/          # Settings page
├── components/
│   ├── layout/            # Sidebar, AppShell
│   ├── dashboard/         # StatsCard, ProgressRing
│   ├── tasks/             # TaskForm, TaskList, TaskItem
│   ├── timer/             # FocusTimer, SessionHistory
│   ├── goals/             # DailyGoals
│   ├── analytics/         # WeeklyChart, StreakDisplay
│   ├── onboarding/        # Onboarding flow
│   └── ui/                # Toast
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (storage, streaks, export)
└── types/                 # TypeScript type definitions
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New task |
| `T` | Toggle timer |
| `Esc` | Close modals |

## License

MIT
