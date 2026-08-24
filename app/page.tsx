"use client";

import { useEffect, useState } from "react";

type Session = { id: string; label: string; start: number; end: number | null };
const STORE_KEY = "time-tracker-v2";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch { /* Keep the in-memory fallback when storage is unavailable. */ }
    setReady(true);
  }, [key]);
  useEffect(() => { if (ready) window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]);
  return [value, setValue] as const;
}

function formatDuration(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining].map((part) => String(part).padStart(2, "0")).join(":");
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(timestamp);
}

export default function Home() {
  const [sessions, setSessions] = useLocalStorage<Session[]>(STORE_KEY, []);
  const [label, setLabel] = useState("Deep work");
  const [now, setNow] = useState(Date.now());
  const active = sessions.find((session) => session.end === null) ?? null;
  useEffect(() => { const ticker = window.setInterval(() => setNow(Date.now()), 500); return () => window.clearInterval(ticker); }, []);
  const total = sessions.reduce((sum, session) => sum + ((session.end ?? now) - session.start), 0);
  const start = () => { if (!active) setSessions((current) => [{ id: crypto.randomUUID(), label: label.trim() || "Untitled", start: Date.now(), end: null }, ...current]); };
  const stop = () => { if (active) setSessions((current) => current.map((session) => session.id === active.id ? { ...session, end: Date.now() } : session)); };

  return (
    <main className="time-room">
      <header className="station-bar"><div className="station-mark">B/06</div><div className="station-name"><strong>TIME CARD ROOM</strong><span>LOCAL WORK SESSION REGISTER</span></div><div className="station-state"><i /> {active ? "CLOCK RUNNING" : "READY TO CLOCK IN"}</div></header>
      <section className="time-hero"><div><p className="section-kicker">BOOKCHAOWALIT / DAILY REGISTER</p><h1>Clock in.<br /><em>Keep the day.</em></h1><p className="hero-note">A small, honest stopwatch for the work in front of you. The register stays on this device.</p></div><div className="punch-stamp" aria-label="Local browser timer"><span>REGISTER</span><strong>LOCAL</strong><b>NO SYNC</b></div></section>
      <section className="clock-sheet" aria-label="Active timer">
        <div className="clock-face"><div className="clock-rings" aria-hidden="true"><span /><span /><span /></div><p>{active ? "CURRENT SESSION" : "NEXT SESSION"}</p><strong>{active ? formatDuration(now - active.start) : "00:00:00"}</strong><span>{active ? active.label : "No active timer"}</span></div>
        <div className="clock-controls"><label><span>SESSION LABEL</span><input value={label} onChange={(event) => setLabel(event.target.value)} disabled={Boolean(active)} /></label><div className="control-line">{active ? <button className="stop-button" onClick={stop}>Stop session <b>■</b></button> : <button className="start-button" onClick={start}>Start session <b>↗</b></button>}<p>Label before you clock in. Stop when the work is done.</p></div></div>
        <aside className="day-total"><span>TOTAL LOGGED</span><strong>{formatDuration(total)}</strong><small>{sessions.length} {sessions.length === 1 ? "entry" : "entries"} in this register</small></aside>
      </section>
      <section className="ledger-section" aria-label="Session history"><div className="ledger-heading"><div><p className="section-kicker">PUNCH CARD LEDGER</p><h2>What the day held.</h2></div><span>{sessions.length ? "LOCAL HISTORY" : "EMPTY REGISTER"}</span></div>{sessions.length === 0 ? <div className="empty-ledger"><span>—</span><p>No sessions yet. Start the first card above.</p></div> : <div className="ledger-list">{sessions.map((session, index) => <article className={`ledger-row ${session.end === null ? "is-live" : ""}`} key={session.id}><span className="row-number">{String(index + 1).padStart(2, "0")}</span><div className="row-copy"><strong>{session.label}</strong><span>{formatDate(session.start)}{session.end ? ` → ${formatDate(session.end)}` : " · still running"}</span></div><b className="row-duration">{formatDuration((session.end ?? now) - session.start)}</b><button className="delete-button" onClick={() => setSessions((current) => current.filter((item) => item.id !== session.id))}>Remove</button></article>)}</div>}{sessions.length > 0 && <button className="clear-button" onClick={() => setSessions([])}>Clear register</button>}</section>
      <footer className="time-footer"><span>BOOKCHAOWALIT / TIME TRACKER</span><span>BROWSER STATE · DEMO-GRADE</span></footer>
    </main>
  );
}
