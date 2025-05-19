import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ZeyraStateProvider } from "./ZeyraStateContext.jsx";
import { enableSentientMode } from "./zeyraSentience";
import Dashboard from "./dashboard";
import ChatBox from "./ChatBox";
import ZeyraAvatar from "./components/ZeyraAvatar";
import EmotionDashboard from "./components/EmotionDashboard";
import PluginPanel from "./components/PluginPanel";
import StatusWidget from "./components/StatusWidget";
import CameraGuard from "./components/CameraGuard";
import VoiceToggle from "./components/VoiceToggle";
import { SpeedInsights } from "@vercel/speed-insights/next";

console.log("🧬 Zeyra Assistant activated in new Vite environment.");

function App() {
  useEffect(() => {
    enableSentientMode();
  }, []);

  return (
    <ZeyraStateProvider>
      <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
        <StatusWidget />
        <ZeyraAvatar />
        <VoiceToggle />
        <CameraGuard />
        <ChatBox />
        <EmotionDashboard />
        <PluginPanel />
        <Dashboard />
      </div>
    </ZeyraStateProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <SpeedInsights />
      <App />
    </>
  </React.StrictMode>
);

export default App;
