// src/voiceEngine.js
// Voice engine for Zeyra: speak() and proactive prompts

export function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.voice = synth.getVoices().find(v => v.name.includes("Jenny") || v.default);
  synth.speak(utter);
}

const motivationalQuotes = [
  "Keep going, Adi! You're doing great.",
  "Remember to take a break and hydrate.",
  "Every step forward is progress.",
  "Stay focused and positive!",
  "You are building something amazing."
];

export function getRandomPrompt() {
  const now = new Date();
  if (now.getHours() === 15) return "Reminder: 3PM investor call.";
  if (Math.random() < 0.5) return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  return "Hey Adi, are you okay? Want me to summarize today’s logs?";
}
