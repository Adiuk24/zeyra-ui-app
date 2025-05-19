// src/emotionalMemory.js
// Stores user text and mood logs for Zeyra

const LOG_KEY = 'zeyra_emotional_memory';

export function logEmotion(userText, mood) {
  const log = getEmotionalMemory();
  log.push({ userText, mood, timestamp: new Date().toISOString() });
  window.localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(-50)));
}

export function getEmotionalMemory() {
  try {
    return JSON.parse(window.localStorage.getItem(LOG_KEY)) || [];
  } catch {
    return [];
  }
}

export function getRecentEmotions(n = 5) {
  const log = getEmotionalMemory();
  return log.slice(-n);
}
