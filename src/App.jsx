import React, { useEffect } from "react";
import ChatBox from "./ChatBox";
import ZeyraAvatar from "./components/ZeyraAvatar";
import { registerPlugin } from './pluginLoader';
import { enableSentientMode } from './zeyraSentience';
import { useZeyraState, ZeyraStateProvider } from './ZeyraStateContext.jsx';

function useSystemEvents() {
  useEffect(() => {
    // Battery
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        battery.onlevelchange = () => {
          if (battery.level < 0.15) {
            window.speechSynthesis.speak(new window.SpeechSynthesisUtterance("Warning: Battery is low."));
          }
        };
      });
    }
    // Network
    window.addEventListener('offline', () => {
      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance("Network connection lost."));
    });
    return () => {
      window.removeEventListener('offline', () => {});
    };
  }, []);
}

const App = () => {
  useEffect(() => {
    registerPlugin('Camera Vision', './cameraVision.js', 'Detects faces and unauthorized users');
    registerPlugin('AutoFix Engine', './autoFixEngine.js', 'Auto-updates code based on feedback');
    registerPlugin('Self-Evolver', './selfEvolver.js', 'Scans and improves itself');
    registerPlugin('Web Learner', './selfLearner.js', 'Learns from the web automatically');
    enableSentientMode(); // 🧬 Zeyra comes to life
  }, []);

  useSystemEvents();

  return (
    <ZeyraStateProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f7f8fa", padding: 32 }}>
        <ZeyraAvatar />
        <ChatBox />
      </div>
    </ZeyraStateProvider>
  );
};

export default App;
