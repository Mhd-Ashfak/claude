import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut, UserRound, Menu, X } from "lucide-react";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const authedLinks = [
  { to: "/classes", label: "Classes & Sessions" },
  { to: "/book", label: "Book a Slot" },
  { to: "/workouts", label: "My Workouts" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="mx-auto flex max-w-shell items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-ink-900/80 px-4 py-2.5 backdrop-blur-md sm:px-5">
        <Link to={isAuthenticated ? "/classes" : "/login"} aria-label="OMERO GYM home">
          <Logo />
        </Link>

        {/* Desktop links */}
        {isAuthenticated ? (
          <ul className="hidden items-center gap-1 md:flex">
            {authedLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <span className="hidden md:block" />
        )}

        {/* Right actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <UserRound size={15} className="text-accent" />
                Hello, {user?.name}
              </span>
              <button onClick={handleLogout} className="btn-ghost !py-2">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link flex items-center gap-1.5">
                <LogIn size={15} /> Login
              </NavLink>
              <Link to="/register" className="btn-primary !py-2">
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="btn-ghost !p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mx-auto mt-2 max-w-shell rounded-2xl border border-white/[0.07] bg-ink-900/95 p-3 backdrop-blur-md md:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 px-2 py-2 text-sm text-white/60">
                <UserRound size={15} className="text-accent" />
                Hello, {user?.name}
              </span>
              {authedLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2.5 text-sm font-medium ${
                      isActive ? "bg-accent text-white" : "text-white/75 hover:bg-white/5"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="btn-ghost mt-1 w-full">
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <NavLink to="/login" onClick={() => setOpen(false)} className="btn-ghost w-full">
                <LogIn size={15} /> Login
              </NavLink>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
