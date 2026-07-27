import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  History,
  X,
  RotateCcw,
  Dumbbell,
} from "lucide-react";
import Layout from "../components/Layout.jsx";
import { getBookings, cancelBooking } from "../data/bookings.js";
import { formatLKR } from "../data/sessions.js";

// A seeded past session so the log isn't empty on first visit.
const SEED_PAST = [
  {
    id: "OM-4112",
    title: "High Intensity HIIT Blast",
    date: "2026-06-12",
    time: "06:00 AM",
    price: 2500,
    status: "Attended",
  },
];

function StatusBadge({ status }) {
  const map = {
    Confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Attended: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    Cancelled: "bg-white/10 text-white/50 border-white/15",
  };
  return (
    <span className={`pill border ${map[status] || map.Cancelled}`}>
      {status}
    </span>
  );
}

export default function Workouts() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(() => getBookings());

  const today = new Date().toISOString().split("T")[0];

  const { upcoming, past } = useMemo(() => {
    const up = bookings.filter((b) => b.date >= today);
    const pastReal = bookings
      .filter((b) => b.date < today)
      .map((b) => ({ ...b, status: "Attended" }));
    return { upcoming: up, past: [...pastReal, ...SEED_PAST] };
  }, [bookings, today]);

  const handleCancel = (id) => setBookings(cancelBooking(id));

  return (
    <Layout>
      <section className="animate-fade-up flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent">
          <Dumbbell size={18} />
        </span>
        <h1 className="font-display text-2xl font-700 sm:text-3xl">
          MY WORKOUT DASHBOARD
        </h1>
      </section>

      {/* Upcoming */}
      <Panel
        className="mt-8"
        icon={<CalendarClock size={16} />}
        title="Upcoming Scheduled Slots"
      >
        {upcoming.length === 0 ? (
          <EmptyRow
            text="No upcoming slots yet."
            cta="Book a Slot"
            onClick={() => navigate("/book")}
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <Tr head>
                  <Th>Reservation ID</Th>
                  <Th>Class / Session</Th>
                  <Th>Scheduled Date &amp; Time</Th>
                  <Th>Cost</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </Tr>
              </thead>
              <tbody>
                {upcoming.map((b) => (
                  <Tr key={b.id}>
                    <Td className="font-mono text-accent">{b.id}</Td>
                    <Td className="font-medium text-white">{b.title}</Td>
                    <Td className="text-white/70">
                      {b.date} · {b.time}
                    </Td>
                    <Td className="text-white/70">{formatLKR(b.price)}</Td>
                    <Td>
                      <StatusBadge status={b.status} />
                    </Td>
                    <Td className="text-right">
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="btn-ghost !py-1.5 !px-3 text-xs"
                      >
                        <X size={13} /> Cancel
                      </button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {upcoming.map((b) => (
                <MobileCard key={b.id} b={b}>
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="btn-ghost !py-1.5 !px-3 text-xs"
                  >
                    <X size={13} /> Cancel
                  </button>
                </MobileCard>
              ))}
            </div>
          </>
        )}
      </Panel>

      {/* Past */}
      <Panel
        className="mt-6"
        icon={<History size={16} />}
        title="Past Session Logs"
      >
        {/* Desktop table */}
        <table className="hidden w-full text-left text-sm md:table">
          <thead>
            <Tr head>
              <Th>Reservation ID</Th>
              <Th>Session</Th>
              <Th>Date &amp; Time</Th>
              <Th>Cost</Th>
              <Th>Status</Th>
              <Th className="text-right">Shortcut</Th>
            </Tr>
          </thead>
          <tbody>
            {past.map((b) => (
              <Tr key={b.id}>
                <Td className="font-mono text-accent">{b.id}</Td>
                <Td className="font-medium text-white">{b.title}</Td>
                <Td className="text-white/70">
                  {b.date} · {b.time}
                </Td>
                <Td className="text-white/70">{formatLKR(b.price)}</Td>
                <Td>
                  <StatusBadge status="Attended" />
                </Td>
                <Td className="text-right">
                  <button
                    onClick={() => navigate("/book")}
                    className="btn-ghost !py-1.5 !px-3 text-xs"
                  >
                    <RotateCcw size={13} /> Book Again
                  </button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {past.map((b) => (
            <MobileCard key={b.id} b={b} status="Attended">
              <button
                onClick={() => navigate("/book")}
                className="btn-ghost !py-1.5 !px-3 text-xs"
              >
                <RotateCcw size={13} /> Book Again
              </button>
            </MobileCard>
          ))}
        </div>
      </Panel>
    </Layout>
  );
}

/* ---------- Small presentational helpers ---------- */

function Panel({ icon, title, children, className = "" }) {
  return (
    <section className={`card overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
        <span className="text-accent">{icon}</span>
        <h2 className="font-display text-sm font-600 uppercase tracking-[0.16em] text-white/90">
          {title}
        </h2>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Tr({ children, head }) {
  return (
    <tr className={head ? "" : "border-t border-white/[0.05]"}>{children}</tr>
  );
}
function Th({ children, className = "" }) {
  return (
    <th
      className={`pb-3 text-xs font-semibold uppercase tracking-wider text-white/40 ${className}`}
    >
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`py-3.5 pr-3 align-middle ${className}`}>{children}</td>;
}

function MobileCard({ b, children, status }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-accent">{b.id}</p>
          <p className="mt-0.5 font-medium text-white">{b.title}</p>
        </div>
        <StatusBadge status={status || b.status} />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-white/60">
        <span>
          {b.date} · {b.time}
        </span>
        <span className="text-white/80">{formatLKR(b.price)}</span>
      </div>
      <div className="mt-3 flex justify-end">{children}</div>
    </div>
  );
}

function EmptyRow({ text, cta, onClick }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <p className="text-sm text-white/40">{text}</p>
      <button onClick={onClick} className="btn-primary">
        {cta}
      </button>
    </div>
  );
}
