// src/speechSync.js
// Synchronize Zeyra's spoken responses with a visual avatar (Lottie/D-ID)

import fs from 'fs';

const logFile = 'speech_log.json';
let muteMode = false;
let avatarRef = null;

// Set avatar ref (should have startTalking/stopTalking methods)
export function setAvatarRef(ref) {
  avatarRef = ref;
}

// Enable/disable mute mode
export function setMuteMode(mute) {
  muteMode = !!mute;
}

// Speak and animate
export function speakAndAnimate(text) {
  if (muteMode) return;
  if (!text) return;

  // Log speech
  logSpeech(text);

  // Web Speech API
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.onstart = () => {
      if (avatarRef && avatarRef.startTalking) avatarRef.startTalking();
    };
    utter.onend = () => {
      if (avatarRef && avatarRef.stopTalking) avatarRef.stopTalking();
    };
    window.speechSynthesis.speak(utter);
  } else {
    // Fallback: just trigger animation for a fixed time
    if (avatarRef && avatarRef.startTalking) avatarRef.startTalking();
    setTimeout(() => {
      if (avatarRef && avatarRef.stopTalking) avatarRef.stopTalking();
    }, Math.max(1500, text.length * 50));
  }
}

function logSpeech(text) {
  const entry = {
    text,
    timestamp: new Date().toISOString(),
  };
  let log = [];
  if (fs.existsSync(logFile)) {
    log = JSON.parse(fs.readFileSync(logFile));
  }
  log.push(entry);
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}
