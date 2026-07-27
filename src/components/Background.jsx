// Minimal dark gym backdrop with faint side "DISCIPLINE / STRENGTH" watermarks.
// No heavy red gradients — just a deep charcoal base with one soft accent glow.
function SideWords({ side }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 hidden h-full w-[15%] select-none flex-col justify-center gap-6 px-4 lg:flex ${
        side === "left" ? "left-0 items-start" : "right-0 items-end text-right"
      }`}
    >
      {["DISCIPLINE", "TODAY", "STRENGTH", "TOMORROW"].map((word, i) => (
        <span
          key={word}
          className={`font-display font-700 uppercase leading-none tracking-tight ${
            i === 3 ? "text-accent/15" : "text-white/[0.05]"
          } text-3xl xl:text-4xl`}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

export default function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* base texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(224,36,52,0.10),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_30%)]" />
      {/* faint grid to add gym-floor depth without noise */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 30%, black, transparent 75%)",
        }}
      />
      <SideWords side="left" />
      <SideWords side="right" />
    </div>
  );
}
