// src/emotionState.js
// Zeyra Emotion Engine: mood state and sentiment analysis

let mood = 'neutral';

export function getMood() {
  return mood;
}

export function setMood(newMood) {
  mood = newMood;
}

// Optionally, persist mood to localStorage
export function saveMood() {
  window.localStorage.setItem('zeyra_mood', mood);
}

export function loadMood() {
  const stored = window.localStorage.getItem('zeyra_mood');
  if (stored) mood = stored;
}

// Analyze sentiment using OpenAI (fallback: simple local analysis)
import { callOpenAI } from './openai.js';

export async function analyzeSentiment(text) {
  try {
    const prompt = `Analyze the sentiment of this message and return one word (positive, neutral, negative, excited, sad, angry, etc):\n"${text}"`;
    const result = await callOpenAI(prompt);
    const sentiment = (result || '').toLowerCase().match(/positive|neutral|negative|excited|sad|angry/);
    return sentiment ? sentiment[0] : 'neutral';
  } catch {
    // Fallback: simple local analysis
    if (/\b(happy|great|awesome|love|excited|yay)\b/i.test(text)) return 'positive';
    if (/\b(sad|angry|hate|bad|upset|mad)\b/i.test(text)) return 'negative';
    return 'neutral';
  }
}
