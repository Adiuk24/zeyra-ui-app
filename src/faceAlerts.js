// src/faceAlerts.js
// Speak unauthorized warning
export function speakWarning() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const utter = new window.SpeechSynthesisUtterance("You are not authorized to use Adi's laptop.");
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  }
}
