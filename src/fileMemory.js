// src/fileMemory.js
// File memory module: summarizes .js/.py files and stores summaries in SQLite (with JSON fallback)

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

const DB_PATH = path.join(__dirname, '../file_memory.db');
const JSON_PATH = path.join(__dirname, '../file_memory.json');

// Try to open SQLite DB, fallback to JSON if error
let db;
try {
  db = new sqlite3.Database(DB_PATH);
  db.run(`CREATE TABLE IF NOT EXISTS file_summaries (
    filename TEXT PRIMARY KEY,
    summary TEXT
  )`);
} catch (e) {
  db = null;
}

// Helper: summarize file (dummy AI, replace with real AI call)
async function summarizeFile(filepath) {
  const content = await promisify(fs.readFile)(filepath, 'utf8');
  // Replace this with a real AI summary call
  return `Summary of ${path.basename(filepath)}: ${content.slice(0, 100)}...`;
}

// Store summary in SQLite or JSON
async function storeSummary(filename, summary) {
  if (db) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO file_summaries (filename, summary) VALUES (?, ?)',
        [filename, summary],
        (err) => (err ? reject(err) : resolve())
      );
    });
  } else {
    let json = {};
    if (fs.existsSync(JSON_PATH)) {
      json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    }
    json[filename] = summary;
    fs.writeFileSync(JSON_PATH, JSON.stringify(json, null, 2));
  }
}

// Recall summary by filename
async function recallSummary(filename) {
  if (db) {
    return await new Promise((resolve, reject) => {
      db.get('SELECT summary FROM file_summaries WHERE filename = ?', [filename], (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.summary : null);
      });
    });
  } else {
    if (!fs.existsSync(JSON_PATH)) return null;
    const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    return json[filename] || null;
  }
}

// Summarize all .js/.py files in the project
async function summarizeAllFiles(rootDir) {
  const files = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (f.endsWith('.js') || f.endsWith('.py')) files.push(full);
    }
  }
  walk(rootDir);
  for (const file of files) {
    const summary = await summarizeFile(file);
    await storeSummary(file, summary);
  }
}

module.exports = {
  summarizeAllFiles,
  recallSummary,
  storeSummary,
};
