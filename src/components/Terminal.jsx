import React, { useState, useRef, useEffect } from "react";
import { runCommand } from "../commandExecutor";

const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [output, setOutput] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (!input.trim()) return;
      setHistory((prev) => [...prev, input]);
      setHistoryIndex(null);
      setOutput((prev) => [...prev, { type: "cmd", text: input }]);
      setInput("");
      const result = await runCommand(input);
      setOutput((prev) => [
        ...prev,
        { type: result.error ? "err" : "out", text: result.error || result.output || "" },
      ]);
    } else if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      setHistoryIndex((idx) => {
        const newIdx = idx === null ? history.length - 1 : Math.max(0, idx - 1);
        setInput(history[newIdx]);
        return newIdx;
      });
    } else if (e.key === "ArrowDown") {
      if (history.length === 0) return;
      setHistoryIndex((idx) => {
        if (idx === null) return null;
        const newIdx = Math.min(history.length - 1, idx + 1);
        setInput(history[newIdx] || "");
        return newIdx === history.length ? null : newIdx;
      });
    }
  };

  return (
    <div style={{ background: "#181818", color: "#e0e0e0", borderRadius: 8, padding: 16, fontFamily: "monospace", width: 600, maxWidth: "100%", minHeight: 300 }}>
      <div style={{ minHeight: 200, maxHeight: 300, overflowY: "auto", marginBottom: 8 }}>
        {output.map((line, idx) => (
          <div key={idx} style={{ whiteSpace: "pre-wrap", color: line.type === "err" ? "#ff5555" : line.type === "cmd" ? "#8be9fd" : "#f1fa8c" }}>
            {line.type === "cmd" ? "$ " : ""}{line.text}
          </div>
        ))}
        <div ref={outputRef} />
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        style={{ width: "100%", background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: 8, fontFamily: "monospace" }}
        placeholder="Type a command and press Enter..."
        autoFocus
      />
    </div>
  );
};

export default Terminal;
