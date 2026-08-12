"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Local mini-app · state in this browser
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Data is stored in localStorage on this origin only. Portfolio demo — not a multi-user product.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

function uid() {
  return crypto.randomUUID();
}

type Session = { id: string; label: string; start: number; end: number | null };

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function Home() {
  const [sessions, setSessions] = useLocalStorage<Session[]>("time-tracker-v1", []);
  const [label, setLabel] = useState("Deep work");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  const active = sessions.find((s) => s.end == null) ?? null;

  const start = () => {
    if (active) return;
    setSessions((prev) => [{ id: uid(), label: label.trim() || "Untitled", start: Date.now(), end: null }, ...prev]);
  };

  const stop = () => {
    if (!active) return;
    setSessions((prev) => prev.map((s) => (s.id === active.id ? { ...s, end: Date.now() } : s)));
  };

  const total = sessions.reduce((acc, s) => acc + ((s.end ?? now) - s.start), 0);

  return (
    <Shell title="Time Tracker" subtitle="Start a timer, label the session, stop when done. History stays on this device.">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-center">
          <div className="font-mono text-5xl tabular-nums tracking-tight">
            {active ? fmt(now - active.start) : "00:00:00"}
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {active ? `Tracking: ${active.label}` : "No active timer"}
          </p>
        </div>
        <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-end gap-2">
          <div className="min-w-[12rem] flex-1">
            <label className="mb-1 block text-xs text-zinc-500">Label</label>
            <input className={inputClass} value={label} onChange={(e) => setLabel(e.target.value)} disabled={!!active} />
          </div>
          {!active ? (
            <Button onClick={start}>Start</Button>
          ) : (
            <Button variant="danger" onClick={stop}>
              Stop
            </Button>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">Total logged: {fmt(total)}</p>
      </div>

      <h2 className="mb-2 mt-8 text-lg font-medium">Sessions</h2>
      <ul className="space-y-2">
        {sessions.length === 0 ? (
          <li className="text-sm text-zinc-500">No sessions yet.</li>
        ) : (
          sessions.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div>
                <div className="font-medium">
                  {s.label} {s.end == null ? <span className="text-xs text-emerald-600">live</span> : null}
                </div>
                <div className="text-xs text-zinc-500">
                  {new Date(s.start).toLocaleString()}
                  {s.end ? ` → ${new Date(s.end).toLocaleString()}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums">{fmt((s.end ?? now) - s.start)}</span>
                <Button variant="ghost" onClick={() => setSessions((prev) => prev.filter((x) => x.id !== s.id))}>
                  Delete
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
      {sessions.length ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={() => setSessions([])}>
            Clear history
          </Button>
        </div>
      ) : null}
    </Shell>
  );
}
