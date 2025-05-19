// src/voiceControl.js
// Real-time voice input using Web Speech API

let recognition = null;
let isListening = false;
let isMuted = false;
let hotword = "hey zeyra";
let hotwordEnabled = false;
let lastTranscript = "";
let onResultCallback = null;

export function startListening(callback, { hotwordMode = false } = {}) {
  if (typeof window === "undefined" || !window.SpeechRecognition && !window.webkitSpeechRecognition) return;
  if (isListening) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = hotwordMode;
  isListening = true;
  isMuted = false;
  hotwordEnabled = hotwordMode;
  onResultCallback = callback;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    lastTranscript = transcript;
    if (hotwordEnabled && !transcript.toLowerCase().includes(hotword)) return;
    if (onResultCallback) onResultCallback(transcript);
  };
  recognition.onend = () => {
    isListening = false;
    if (hotwordEnabled) startListening(callback, { hotwordMode: true });
  };
  recognition.onerror = () => { isListening = false; };
  recognition.start();
}

export function stopListening() {
  if (recognition) recognition.stop();
  isListening = false;
}

export function muteListening() {
  isMuted = true;
  stopListening();
}

export function getVoiceState() {
  return { isListening, isMuted, lastTranscript };
}

export function enableHotwordDetection(enable = true) {
  hotwordEnabled = enable;
}
