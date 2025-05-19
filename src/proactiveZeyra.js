// src/proactiveZeyra.js
// Proactive AI Companion: background loop, presence detection, and voice prompts
import { detectUserVideo, loadKnownDescriptor } from './faceWatcher.js';
import { lockMacScreen } from './systemControl.js';
import { speak } from './voiceEngine.js';

let lastCheck = Date.now();

export async function runZeyraLoop(videoEl) {
  // Load known face descriptor once at start
  await loadKnownDescriptor('/your-face.png');
  setInterval(async () => {
    const who = await detectUserVideo(videoEl);
    if (who === 'authorized') {
      const now = Date.now();
      if (now - lastCheck > 1000 * 60 * 30) {
        speak("Hey Adi, do you need anything?");
        lastCheck = now;
      }
    } else if (who === 'unauthorized') {
      speak("⚠️ You're not authorized to use Adi's laptop.");
      lockMacScreen();
    }
  }, 10000);
}
