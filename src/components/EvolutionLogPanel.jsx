import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';

export const EvolutionLogPanel = () => {
  const [log, setLog] = useState([]);

  useEffect(() => {
    const logPath = path.join(process.cwd(), 'evolution_log.json');
    const interval = setInterval(() => {
      try {
        const content = fs.readFileSync(logPath, 'utf-8');
        setLog(JSON.parse(content).slice(-10).reverse()); // Show latest 10
      } catch (err) {
        console.error('🛑 Log read error:', err.message);
      }
    }, 2000); // Update every 2s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-400 p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-2">🧬 Zeyra: Evolution Activity</h2>
      <ul className="text-sm space-y-1">
        {log.map((entry, idx) => (
          <li key={idx}>
            {entry.timestamp} → {entry.file || 'System'}: {entry.note}
          </li>
        ))}
      </ul>
    </div>
  );
};
