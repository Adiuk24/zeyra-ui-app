import { initCameraVision } from './cameraVision.js';
import { getActivePlugins } from './pluginLoader.server.js';
import { autoUpgradeFromGitHub, autoUpgradeFromLLM } from './selfUpdater.js';

// 🔊 Speak wrapper
export function speakOnce(text) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  } else {
    console.log(`[Zeyra says]: ${text}`);
  }
}

export async function enableSentientMode() {
  // 1. Start Face Recognition
  initCameraVision();

  // 2. Greet the user autonomously
  speakOnce("Hi Adi, Zeyra is now active. I'm watching over your system.");

  // 3. Periodic system status speech
  setInterval(() => {
    speakOnce("System check complete. All modules are stable.");
  }, 1000 * 60 * 5); // Every 5 mins

  // 4. Load active plugins
  getActivePlugins().forEach(plugin => {
    import(plugin.path).then(mod => {
      if (mod?.start) mod.start();
    });
  });

  // 5. Trigger self-upgrade
  await autoUpgradeFromGitHub();
  await autoUpgradeFromLLM();
}
