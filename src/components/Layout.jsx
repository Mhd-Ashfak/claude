import Background from "./Background.jsx";
import Navbar from "./Navbar.jsx";

// App shell used by every page: fixed background + sticky navbar + centered content.
export default function Layout({ children, wide = false }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className={`mx-auto ${wide ? "max-w-shell" : "max-w-shell"}`}>
          {children}
        </div>
      </main>
      <footer className="px-4 pb-6 pt-4">
        <div className="mx-auto max-w-shell border-t border-white/[0.06] pt-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} OMERO GYM · Discipline today, strength tomorrow.
        </div>
      </footer>
    </div>
  );
}

// Centered shell for auth pages (login / register) — no side content.
export function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
