// ============================================================================
// server.js — OMERO GYM API + static frontend host.
//   * Serves the pages in /public
//   * Provides a JSON API backed by MySQL
//   * Passwords hashed with bcrypt; sessions authenticated with JWT
// Run with:  npm start   (after `npm install` and setting up .env)
// ============================================================================
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { pool, initDb } = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

app.use(cors());
app.use(express.json());

// ------------------------------ auth middleware ------------------------------
function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired, please log in again" });
  }
}

function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// ================================= AUTH =================================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    if (String(password).length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
      [name || "Dedicated Athlete", email, phone || null, hash]
    );
    const user = { id: result.insertId, name: name || "Dedicated Athlete", email };
    res.status(201).json({ token: signToken(user), user });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "That email is already registered" });
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid email or password" });

    const u = rows[0];
    const ok = await bcrypt.compare(String(password || ""), u.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const user = { id: u.id, name: u.name, email: u.email };
    res.json({ token: signToken(user), user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================== SESSIONS ===============================
app.get("/api/sessions", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, category, title, description, price, duration
         FROM sessions
        ORDER BY FIELD(category, 'floor', 'classes', 'personal'), price`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================== BOOKINGS ===============================
app.get("/api/bookings", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.session_id AS sessionId, s.title, s.price, s.duration,
              b.booking_date AS date, b.time_block AS time, b.status
         FROM bookings b
         JOIN sessions s ON s.id = b.session_id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC, b.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/bookings", authRequired, async (req, res) => {
  try {
    const { sessionId, date, time } = req.body || {};
    if (!sessionId || !date || !time) return res.status(400).json({ error: "sessionId, date and time are required" });

    const [s] = await pool.query("SELECT id FROM sessions WHERE id = ?", [sessionId]);
    if (!s.length) return res.status(404).json({ error: "Session not found" });

    const id = "OM-" + Math.floor(1000 + Math.random() * 9000);
    await pool.query(
      "INSERT INTO bookings (id, user_id, session_id, booking_date, time_block, status) VALUES (?, ?, ?, ?, ?, 'Confirmed')",
      [id, req.user.id, sessionId, date, time]
    );
    res.status(201).json({ id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/bookings/:id", authRequired, async (req, res) => {
  try {
    await pool.query("DELETE FROM bookings WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// =========================== STATIC FRONTEND ===========================
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", (_req, res) => res.redirect("/login.html"));

// =============================== STARTUP ===============================
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`OMERO GYM running at http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Could not initialise the database:", e.message);
    console.error("Check your MySQL server is running and .env credentials are correct.");
    process.exit(1);
  });
