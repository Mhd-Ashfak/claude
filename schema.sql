-- ============================================================================
-- OMERO GYM — MySQL schema + seed data
-- The server runs this automatically on startup (see server/db.js),
-- so you normally don't need to import it by hand. You can also run it
-- manually:  mysql -u root -p < schema.sql
-- ============================================================================

CREATE DATABASE IF NOT EXISTS omero_gym
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE omero_gym;

-- ----------------------------- users -----------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  phone         VARCHAR(40),
  password_hash VARCHAR(255) NOT NULL,          -- bcrypt hash, never the raw password
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------- sessions ----------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id          VARCHAR(40) PRIMARY KEY,
  category    VARCHAR(40)  NOT NULL,
  title       VARCHAR(160) NOT NULL,
  description TEXT         NOT NULL,
  price       INT          NOT NULL,            -- price in LKR
  duration    INT          NOT NULL             -- minutes
);

-- --------------------------- bookings ----------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id           VARCHAR(20) PRIMARY KEY,          -- e.g. OM-5512
  user_id      INT          NOT NULL,
  session_id   VARCHAR(40)  NOT NULL,
  booking_date DATE         NOT NULL,
  time_block   VARCHAR(20)  NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'Confirmed',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- ------------------------ seed the catalog -----------------------
INSERT INTO sessions (id, category, title, description, price, duration) VALUES
  ('peak-floor',    'floor',    'Peak Hours Floor Pass',
   'Reservation for dynamic weight training and cardio equipment during premium high-energy intervals.', 1500, 90),
  ('offpeak-floor', 'floor',    'Off-Peak Floor Pass',
   'Perfect for crowd-free workouts with total accessibility to all lifting racks and fitness gear.', 1000, 120),
  ('hiit-blast',    'classes',  'High Intensity HIIT Blast',
   'Metabolic conditioning, functional intervals, and explosive plyometrics orchestrated by elite instructors.', 2500, 60),
  ('elite-power',   'personal', 'Elite Power & Strength Coaching',
   'Custom programming focusing heavily on biomechanics, heavy lifting form, and progressive overloading vectors.', 5000, 60)
ON DUPLICATE KEY UPDATE
  category=VALUES(category), title=VALUES(title), description=VALUES(description),
  price=VALUES(price), duration=VALUES(duration);
