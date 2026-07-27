import { Dumbbell } from "lucide-react";

// OMERO GYM wordmark + dumbbell badge.
export default function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white shadow-[0_4px_14px_-4px_rgba(224,36,52,0.8)]">
        <Dumbbell size={18} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="font-display text-lg font-700 tracking-wide leading-none">
          <span className="text-white">OMERO</span>{" "}
          <span className="text-accent">GYM</span>
        </span>
      )}
    </span>
  );
}
