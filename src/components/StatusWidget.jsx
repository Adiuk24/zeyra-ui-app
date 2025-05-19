import React, { useEffect, useState } from 'react';

export const StatusWidget = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/zeyra-status')
        .then(res => res.json())
        .then(setStatus)
        .catch(() => setStatus({ error: 'Status unavailable' }));
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="p-4 text-sm text-gray-400">Loading Zeyra status...</div>;
  if (status.error) return <div className="p-4 text-sm text-red-500">{status.error}</div>;

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(status, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zeyra-status.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl p-4 shadow-lg bg-black text-white space-y-2 border border-gray-800">
      <h2 className="text-xl font-bold">🧠 Zeyra Status</h2>
      <div>🔄 Uptime: {status.uptime}</div>
      <div>📦 Plugins: {status.plugins?.join(', ') || 'None'}</div>
      <div>🧩 Active: {status.activePlugins}</div>
      <div>🛠️ Last Fix: {status.lastFix || 'N/A'}</div>
      <div>🧬 Last Evolution: {status.lastEvo || 'N/A'}</div>
      <div>📂 Memory Logs: {status.memory ? '🟢' : '🔴'}</div>
      <div>👤 User: {status.user || 'N/A'}</div>
      <button onClick={downloadJSON} style={{marginTop:8, padding:'6px 16px', borderRadius:6, background:'#222', color:'#fff', border:'1px solid #444', cursor:'pointer'}}>Report as JSON</button>
    </div>
  );
};
