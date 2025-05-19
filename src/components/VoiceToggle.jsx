import React, { useState } from "react";
import { startListening, stopListening, getVoiceState } from "../voiceControl";

const VoiceToggle = ({ onTranscript }) => {
  const [listening, setListening] = useState(getVoiceState().isListening);

  const handleToggle = () => {
    if (listening) {
      stopListening();
      setListening(false);
    } else {
      startListening((transcript) => {
        setListening(false);
        if (onTranscript) onTranscript(transcript);
      });
      setListening(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        background: listening ? "#eaf4ff" : "#f7f7f7",
        color: listening ? "#007bff" : "#333",
        border: listening ? "2px solid #007bff" : "1px solid #ccc",
        borderRadius: "50%",
        width: 48,
        height: 48,
        fontSize: 24,
        boxShadow: listening ? "0 0 8px #007bff55" : "none",
        cursor: "pointer",
        outline: "none",
        margin: 8,
      }}
      title={listening ? "Listening..." : "Activate voice input"}
    >
      {listening ? "🎙️" : "🎤"}
    </button>
  );
};

export default VoiceToggle;
