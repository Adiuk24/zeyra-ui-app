import React, { useState } from "react";
import { getRecentLogs } from "../memoryManager";

const LOG_TYPES = [
  { key: "autofix", label: "AutoFix Log" },
  { key: "evolution", label: "Evolution Log" },
  { key: "terminal", label: "Terminal Log" },
];

function formatEntry(entry) {
  return (
    <div style={{ borderBottom: "1px solid #eee", padding: 8 }}>
      <div style={{ fontSize: 12, color: "#888" }}>{entry.timestamp}</div>
      <div><b>File:</b> {entry.file || entry.command || "-"}</div>
      {entry.action && <div><b>Action:</b> {entry.action}</div>}
      {entry.note && <div><b>Note:</b> {entry.note}</div>}
      {entry.output && <div><b>Output:</b> <pre style={{ whiteSpace: "pre-wrap" }}>{entry.output}</pre></div>}
      {entry.error && <div style={{ color: "#c00" }}><b>Error:</b> {entry.error}</div>}
      {entry.suggestion && <div><b>AI Suggestion:</b> {entry.suggestion}</div>}
    </div>
  );
}

const LogsViewer = () => {
  const [tab, setTab] = useState(LOG_TYPES[0].key);
  const [filter, setFilter] = useState("");
  const logs = getRecentLogs(tab, 100).filter(
    (entry) =>
      !filter ||
      JSON.stringify(entry).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0001", padding: 16, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {LOG_TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "6px 16px",
              borderRadius: 4,
              border: tab === t.key ? "2px solid #007bff" : "1px solid #ccc",
              background: tab === t.key ? "#eaf4ff" : "#f7f7f7",
              fontWeight: tab === t.key ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter/search..."
          style={{ marginLeft: "auto", padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
        />
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto", background: "#fafbfc", borderRadius: 4 }}>
        {logs.length === 0 ? (
          <div style={{ color: "#888", padding: 16 }}>No log entries found.</div>
        ) : (
          logs.map((entry, idx) => <div key={idx}>{formatEntry(entry)}</div>)
        )}
      </div>
    </div>
  );
};

export default LogsViewer;
