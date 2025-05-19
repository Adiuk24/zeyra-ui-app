import React, { useEffect, useState } from 'react';
import { PluginPanel } from './components/PluginPanel';
import DevelopmentPhases from './components/DevelopmentPhases';
import { EvolutionLogPanel } from './components/EvolutionLogPanel';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/zeyra-status');
        if (!res.ok) throw new Error('Status fetch failed');
        const data = await res.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError('Failed to load status');
      }
    };
    fetchStatus(); // Initial load
    const interval = setInterval(fetchStatus, 3000); // Update every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <DevelopmentPhases />
      <h1 className="text-3xl font-bold mb-6">🧠 Zeyra Control Center</h1>
      <div className="grid grid-cols-2 gap-4">
        <PluginPanel />
        <EvolutionLogPanel />
      </div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mt-4 hover:bg-purple-700"
        onClick={async () => {
          const res = await fetch('/api/self-evolve');
          const data = await res.json();
          alert(data.message || 'Evolution complete');
        }}
      >
        🧠 Trigger Self-Evolve
      </button>
      {/* Add other widgets: Logs, Camera Status, Terminal, etc */}
      {/* Example: Show live status */}
      {error && (
        <div className="mt-4 p-4 bg-red-900 rounded-xl text-red-300 font-bold">
          {error}
        </div>
      )}
      {status && (
        <div className="mt-4 p-4 bg-zinc-800 rounded-xl">
          <div className="font-bold text-green-400">Zeyra Status:</div>
          <p>🕒 Uptime: {Math.round(status.uptime)}s</p>
          <p>💾 Memory Used: {status.memoryUsed ? (status.memoryUsed / 1024 / 1024).toFixed(2) : '--'} MB</p>
          <p>🎭 Mood: <span className="font-semibold">{status.mood}</span></p>
          <p>⚙️ Platform: {status.platform}</p>
          <div>
            <p className="font-semibold">🔌 Active Plugins:</p>
            <ul className="list-disc ml-5">
              {status.plugins && status.plugins.length > 0 ? status.plugins.map((p, i) => (
                <li key={i}>{typeof p === 'string' ? p : p.name || JSON.stringify(p)}</li>
              )) : <li>None</li>}
            </ul>
          </div>
          <p className="text-xs text-gray-400">Last updated: {new Date(status.timestamp).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}
