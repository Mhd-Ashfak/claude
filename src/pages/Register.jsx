import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { AuthLayout } from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ name: form.name, email: form.email });
    navigate("/classes");
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fade-up">
        <div className="card p-7 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-white shadow-[0_8px_24px_-8px_rgba(224,36,52,0.9)]">
              <UserPlus size={24} strokeWidth={2.5} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-700 tracking-wide">
              CREATE ACCOUNT
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Join us to instantly unlock interactive capacity slots
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="name" className="field-label">
                Full Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={update("name")}
                className="field"
                placeholder="John Doe"
              />
            </div>
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
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="field-label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                className="field"
                placeholder="+94 7X XXX XXXX"
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
                minLength={6}
                value={form.password}
                onChange={update("password")}
                className="field"
                placeholder="Minimum 6 characters"
              />
              <p className="mt-1.5 text-xs text-white/40">
                Passwords are hashed securely using bcrypt in our system.
              </p>
            </div>

            <button type="submit" className="btn-primary w-full">
              Register Now
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-accent hover:text-accent-soft">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
