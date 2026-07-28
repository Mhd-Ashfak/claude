// ============================================================================
// db.js — MySQL connection pool + one-time schema/seed bootstrap.
// Reads credentials from environment variables (see .env / .env.example).
// ============================================================================
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME || "omero_gym";

// base connection settings (without a database — used to create it if missing)
const baseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

// the pool used by the app for all queries
const pool = mysql.createPool({
  ...baseConfig,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
});

// Runs schema.sql (creates database, tables and seeds the catalog).
async function initDb() {
  const sql = fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8");
  const conn = await mysql.createConnection({ ...baseConfig, multipleStatements: true });
  await conn.query(sql);
  await conn.end();
}

module.exports = { pool, initDb };
