import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { ASSET_SEEDS, CHECKLIST_SEEDS, DEFAULT_SETTINGS } from "./memo-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "portfolio.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  init(db);
  _db = db;
  return db;
}

function init(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      block TEXT NOT NULL,
      target_pct REAL NOT NULL DEFAULT 0,
      ai_factor INTEGER NOT NULL DEFAULT 0,
      buy_low REAL, buy_high REAL,
      tp1_low REAL, tp1_high REAL,
      obj_low REAL, obj_high REAL,
      stop_price REAL,
      stop_kind TEXT NOT NULL DEFAULT 'none',
      stop_note TEXT,
      timing TEXT,
      thesis TEXT,
      risk TEXT,
      notes TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
      kind TEXT NOT NULL CHECK (kind IN ('buy','sell')),
      date TEXT NOT NULL,
      qty REAL NOT NULL,
      price REAL NOT NULL,
      fees REAL NOT NULL DEFAULT 0,
      note TEXT
    );
    CREATE TABLE IF NOT EXISTS quotes (
      ticker TEXT PRIMARY KEY,
      price REAL,
      prev_close REAL,
      change_pct REAL,
      day_low REAL, day_high REAL,
      week52_low REAL, week52_high REAL,
      ma50 REAL, ma200 REAL,
      market_state TEXT,
      updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS history (
      ticker TEXT NOT NULL,
      date TEXT NOT NULL,
      close REAL NOT NULL,
      PRIMARY KEY (ticker, date)
    );
    CREATE TABLE IF NOT EXISTS checklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      category TEXT,
      due TEXT,
      done INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mc_cache (
      ticker TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Seed initial (une seule fois, si la table est vide)
  const count = db.prepare("SELECT COUNT(*) AS n FROM assets").get() as { n: number };
  if (count.n === 0) {
    const insert = db.prepare(`
      INSERT INTO assets (ticker, name, block, target_pct, ai_factor,
        buy_low, buy_high, tp1_low, tp1_high, obj_low, obj_high,
        stop_price, stop_kind, stop_note, timing, thesis, risk, sort_order)
      VALUES (@ticker, @name, @block, @targetPct, @aiFactor,
        @buyLow, @buyHigh, @tp1Low, @tp1High, @objLow, @objHigh,
        @stopPrice, @stopKind, @stopNote, @timing, @thesis, @risk, @sortOrder)
    `);
    const tx = db.transaction(() => {
      ASSET_SEEDS.forEach((a, i) => {
        insert.run({
          ticker: a.ticker, name: a.name, block: a.block, targetPct: a.targetPct,
          aiFactor: a.aiFactor ? 1 : 0,
          buyLow: a.buyLow ?? null, buyHigh: a.buyHigh ?? null,
          tp1Low: a.tp1Low ?? null, tp1High: a.tp1High ?? null,
          objLow: a.objLow ?? null, objHigh: a.objHigh ?? null,
          stopPrice: a.stopPrice ?? null, stopKind: a.stopKind,
          stopNote: a.stopNote ?? null, timing: a.timing ?? null,
          thesis: a.thesis, risk: a.risk, sortOrder: i,
        });
      });
    });
    tx();
  }

  const chkCount = db.prepare("SELECT COUNT(*) AS n FROM checklist").get() as { n: number };
  if (chkCount.n === 0) {
    const insert = db.prepare("INSERT INTO checklist (label, category, due) VALUES (?, ?, ?)");
    const tx = db.transaction(() => {
      for (const c of CHECKLIST_SEEDS) insert.run(c.label, c.category, c.due ?? null);
    });
    tx();
  }

  const setStmt = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) setStmt.run(k, v);
}

export interface AssetRow {
  id: number;
  ticker: string;
  name: string;
  block: string;
  target_pct: number;
  ai_factor: number;
  buy_low: number | null;
  buy_high: number | null;
  tp1_low: number | null;
  tp1_high: number | null;
  obj_low: number | null;
  obj_high: number | null;
  stop_price: number | null;
  stop_kind: string;
  stop_note: string | null;
  timing: string | null;
  thesis: string | null;
  risk: string | null;
  notes: string | null;
  sort_order: number;
  active: number;
}

export interface TransactionRow {
  id: number;
  asset_id: number;
  kind: "buy" | "sell";
  date: string;
  qty: number;
  price: number;
  fees: number;
  note: string | null;
}

export interface QuoteRow {
  ticker: string;
  price: number | null;
  prev_close: number | null;
  change_pct: number | null;
  day_low: number | null;
  day_high: number | null;
  week52_low: number | null;
  week52_high: number | null;
  ma50: number | null;
  ma200: number | null;
  market_state: string | null;
  updated_at: string | null;
}
