import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Info,
  Ban,
  Backpack,
  Users,
  Timer,
} from "lucide-react";
import Layout from "../components/Layout.jsx";
import { SESSIONS, getSession, formatLKR } from "../data/sessions.js";
import { saveBooking } from "../data/bookings.js";

const TIME_BLOCKS = [
  "06:00 AM",
  "08:00 AM",
  "10:00 AM",
  "04:00 PM",
  "05:00 PM",
  "07:00 PM",
];

const STEPS = ["Pick a date", "Choose a time block", "Confirm"];

export default function Book() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselected = location.state?.sessionId || "";

  const [sessionId, setSessionId] = useState(preselected);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const session = useMemo(() => getSession(sessionId), [sessionId]);
  const step = !date ? 0 : !time ? 1 : 2;

  const todayStr = new Date().toISOString().split("T")[0];

  const confirm = () => {
    if (!session || !date || !time) return;
    saveBooking({
      sessionId: session.id,
      title: session.title,
      price: session.price,
      duration: session.duration,
      date,
      time,
    });
    navigate("/workouts");
  };

  return (
    <Layout>
      <section className="animate-fade-up">
        <span className="eyebrow">Reserve Your Spot</span>
        <h1 className="mt-3 font-display text-3xl font-700 sm:text-4xl">
          BOOK A TRAINING SLOT
        </h1>
        <p className="mt-2 text-sm text-muted">
          Pick a date and an open time block below — your session locks in
          instantly.
        </p>
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* ---- Left: booking flow ---- */}
        <div className="card p-5 sm:p-6">
          {/* Stepper */}
          <ol className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-5">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={`pill border ${
                  i === step
                    ? "border-accent bg-accent/15 text-accent"
                    : i < step
                    ? "border-white/10 bg-white/[0.04] text-white/70"
                    : "border-white/10 bg-transparent text-white/40"
                }`}
              >
                <span className="font-mono">{i + 1}</span> {label}
              </li>
            ))}
          </ol>

          {/* Session selector */}
          <div className="mt-6">
            <label htmlFor="session" className="field-label">
              Session / Class
            </label>
            <select
              id="session"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="field"
            >
              <option value="">Select a session…</option>
              {SESSIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} — {formatLKR(s.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="mt-5">
            <label htmlFor="date" className="field-label">
              1. Choose Booking Date
            </label>
            <input
              id="date"
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="field"
            />
          </div>

          {/* Time blocks */}
          <div className="mt-6">
            <label className="field-label">2. Choose a Time Block</label>
            {!date ? (
              <div className="mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-10 text-center">
                <CalendarDays size={26} className="text-white/25" />
                <p className="mt-3 text-sm text-white/40">
                  Select a date above to reveal live time-block availability.
                </p>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {TIME_BLOCKS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      time === t
                        ? "border-accent bg-accent text-white"
                        : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/25"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Confirm */}
          <button
            onClick={confirm}
            disabled={!session || !date || !time}
            className="btn-primary mt-7 w-full"
          >
            <CheckCircle2 size={16} /> Confirm Booking
          </button>
        </div>

        {/* ---- Right: summary + tips ---- */}
        <aside className="space-y-5">
          <div className="card overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-3.5">
              <h2 className="font-display text-sm font-600 uppercase tracking-[0.14em] text-white/90">
                Booking Summary
              </h2>
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-white/40">
                Selected Workout / Class
              </p>
              <p className="mt-1 font-display text-lg font-600 text-white">
                {session ? session.title : "Please pick a session card"}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <SummaryStat
                  icon={<Timer size={14} />}
                  label="Duration"
                  value={session ? `${session.duration} mins` : "—"}
                />
                <SummaryStat
                  icon={<Clock size={14} />}
                  label="Session Cost"
                  value={session ? formatLKR(session.price) : "—"}
                  accent
                />
              </div>

              {date && time && (
                <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-white/70">
                  <span className="text-white/40">Scheduled:</span> {date} ·{" "}
                  {time}
                </div>
              )}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
              <Info size={15} className="text-accent" />
              <h2 className="font-display text-sm font-600 uppercase tracking-[0.14em] text-white/90">
                Good to Know
              </h2>
            </div>
            <ul className="space-y-3 p-5 text-sm text-white/70">
              <Tip icon={<Info size={15} />}>
                Arrive at least 10 minutes early to badge in at reception.
              </Tip>
              <Tip icon={<Ban size={15} />}>
                Free cancellation up to 2 hours before your slot starts.
              </Tip>
              <Tip icon={<Backpack size={15} />}>
                Bring a towel and indoor shoes — lockers are available on-site.
              </Tip>
              <Tip icon={<Users size={15} />}>
                Slots are capacity-limited, so booked times can't be
                double-reserved.
              </Tip>
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

function SummaryStat({ icon, label, value, accent }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/40">
        {icon} {label}
      </p>
      <p
        className={`mt-1 font-display text-lg font-700 ${
          accent ? "text-accent" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Tip({ icon, children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 text-accent">{icon}</span>
      <span>{children}</span>
    </li>
  );
}
