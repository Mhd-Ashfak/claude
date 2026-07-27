import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { CATEGORIES, SESSIONS, formatLKR } from "../data/sessions.js";

function SessionCard({ session, onBook }) {
  return (
    <article className="card card-hover flex flex-col p-5 sm:p-6">
      <h3 className="font-display text-base font-600 uppercase tracking-wide text-white">
        {session.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {session.description}
      </p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-2xl font-700 text-white">
            {formatLKR(session.price)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
            <Clock size={13} />
            {session.duration} mins
          </div>
        </div>
        <button onClick={() => onBook(session)} className="btn-primary">
          Book Slot <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

export default function Classes() {
  const navigate = useNavigate();
  const [active, setActive] = useState("all");

  const goBook = (session) =>
    navigate("/book", { state: { sessionId: session.id } });

  const visibleCategories = useMemo(
    () => (active === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === active)),
    [active]
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="animate-fade-up text-center">
        <span className="eyebrow">OMERO GYM — Session Catalog</span>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-700 leading-[1.05] sm:text-5xl">
          PICK YOUR SLOT.
          <br />
          <span className="text-accent">OWN THE FLOOR.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Book premium floor access, group classes, and personal training
          sessions at OMERO GYM.
        </p>

        {/* Category filter pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <FilterPill active={active === "all"} onClick={() => setActive("all")}>
            All
          </FilterPill>
          {CATEGORIES.map((c) => (
            <FilterPill
              key={c.id}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            >
              {c.filter}
            </FilterPill>
          ))}
        </div>
      </section>

      {/* Grouped session sections */}
      <div className="mt-12 space-y-12">
        {visibleCategories.map((cat) => {
          const items = SESSIONS.filter((s) => s.category === cat.id);
          if (!items.length) return null;
          return (
            <section key={cat.id}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <h2 className="font-display text-sm font-600 uppercase tracking-[0.18em] text-white/90">
                  {cat.label}
                </h2>
                <span className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((s) => (
                  <SessionCard key={s.id} session={s} onBook={goBook} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Layout>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`pill border transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
