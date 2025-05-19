// src/memoryManager.js
// Secure memory and log management for Zeyra

import fs from 'fs';
import path from 'path';

const memoryFile = 'zeyra_memory.json';
const logFiles = {
  autofix: 'autofix_log.json',
  evolution: 'evolution_log.json',
  terminal: 'terminal_log.json',
};

// Helper: sanitize key
function safeKey(key) {
  return String(key).replace(/[^a-zA-Z0-9_\-]/g, '_');
}

// Save memory (by key)
export function saveMemory(key, data) {
  const safe = safeKey(key);
  let mem = {};
  if (fs.existsSync(memoryFile)) {
    try { mem = JSON.parse(fs.readFileSync(memoryFile)); } catch { mem = {}; }
  }
  mem[safe] = data;
  fs.writeFileSync(memoryFile, JSON.stringify(mem, null, 2));
}

// Recall memory (by key)
export function recallMemory(key) {
  const safe = safeKey(key);
  if (!fs.existsSync(memoryFile)) return null;
  try {
    const mem = JSON.parse(fs.readFileSync(memoryFile));
    return mem[safe] || null;
  } catch {
    return null;
  }
}

// Fuzzy search memory
export function searchMemory(query) {
  if (!fs.existsSync(memoryFile)) return [];
  try {
    const mem = JSON.parse(fs.readFileSync(memoryFile));
    const q = String(query).toLowerCase();
    return Object.entries(mem)
      .filter(([k, v]) => k.toLowerCase().includes(q) || JSON.stringify(v).toLowerCase().includes(q))
      .map(([k, v]) => ({ key: k, value: v }));
  } catch {
    return [];
  }
}

// Get recent logs (safe, parsed)
export function getRecentLogs(logType, limit = 50) {
  const file = logFiles[logType];
  if (!file || !fs.existsSync(file)) return [];
  try {
    const log = JSON.parse(fs.readFileSync(file));
    return Array.isArray(log) ? log.slice(-limit).reverse() : [];
  } catch {
    return [];
  }
}

export function logPhaseCompletion(phaseName) {
  const logPath = 'zeyra_phase_log.json';
  const entry = {
    phase: phaseName,
    completedAt: new Date().toISOString(),
    context: 'Automatic logging from DevelopmentPhases UI',
  };

  let log = [];
  if (fs.existsSync(logPath)) {
    log = JSON.parse(fs.readFileSync(logPath));
  }
  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}
