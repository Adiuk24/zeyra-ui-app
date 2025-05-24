import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from './services/index';
import { speakAndAnimate } from './speechSync';
import { analyzeSentiment, setMood } from './emotionState';
import { logEmotion } from './emotionalMemory';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isTyping]);

  // Log chat to localStorage (or could be to JSON backend)
  useEffect(() => {
    localStorage.setItem('zeyra_chat_history', JSON.stringify(conversation));
  }, [conversation]);

  // Voice-to-text handler
  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      alert('Voice recognition error: ' + event.error);
    };
    recognition.start();
  };

  // Send message handler
  const handleSend = async (prompt) => {
    if (!prompt.trim()) return;
    const userMood = await analyzeSentiment(prompt);
    setMood(userMood);
    logEmotion(prompt, userMood);
    setConversation((prev) => [...prev, { role: 'user', text: prompt }]);
    setInput('');
    setIsTyping(true);
    try {
      const replyObj = await sendMessage(prompt);
      const reply = replyObj.message;
      const zeyraMood = await analyzeSentiment(reply);
      setMood(zeyraMood);
      logEmotion(reply, zeyraMood);
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', text: reply }
      ]);
      speakAndAnimate(reply);
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        { role: 'assistant', text: '⚠️ Error: Unable to respond.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-box" style={{ maxWidth: 500, margin: '0 auto', border: '1px solid #ccc', borderRadius: 8, padding: 16, background: '#fff' }}>
      <div className="chat-messages" style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', marginBottom: 12 }}>
        {conversation.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`} style={{ margin: '8px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Zeyra'}:</strong> {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="chat-message assistant" style={{ margin: '8px 0', textAlign: 'left', color: '#888' }}>
            <strong>Zeyra:</strong> <em>typing…</em>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input" style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Type or speak to Zeyra..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button onClick={() => handleSend(input)} style={{ padding: '8px 16px' }}>Send</button>
        <button onClick={handleMic} style={{ padding: '8px 12px' }}>{isListening ? '🎙️ Listening...' : '🎤 Mic'}</button>
      </div>
    </div>
  );
};

export default ChatBox;
