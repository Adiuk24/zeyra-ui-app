import { exec } from 'child_process';
import os from 'os';
import { currentMood } from './emotionState.js';
import { getActivePlugins } from './pluginLoader.js';

export function lockMacScreen() {
  exec('pmset displaysleepnow', (err) => {
    if (err) console.error("Lock failed:", err);
  });
}

export async function getSystemStatus() {
  return {
    uptime: process.uptime(),
    platform: os.platform(),
    memoryUsed: process.memoryUsage().heapUsed,
    mood: currentMood || 'neutral',
    plugins: getActivePlugins ? getActivePlugins() : [],
    timestamp: new Date().toISOString(),
  };
}
