import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, LogIn } from "lucide-react";
import { AuthLayout } from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email: form.email });
    navigate("/classes");
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fade-up">
        <div className="card p-7 sm:p-8">
          {/* Brand mark */}
          <div className="flex flex-col items-center text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-white shadow-[0_8px_24px_-8px_rgba(224,36,52,0.9)]">
              <Dumbbell size={24} strokeWidth={2.5} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-700 tracking-wide">
              OMERO GYM PORTAL
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Log in to secure your workout schedule &amp; classes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="field-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                className="field"
                placeholder="athlete@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={update("password")}
                className="field"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              <LogIn size={16} /> Sign In
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            New to OMERO GYM?{" "}
            <Link to="/register" className="font-semibold text-accent hover:text-accent-soft">
              Create an Account Here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
