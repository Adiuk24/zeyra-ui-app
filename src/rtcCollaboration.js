// src/rtcCollaboration.js
// WebRTC + WebSocket for real-time code/text sharing

let ws = null;
let peers = {};
let userId = null;
let room = "default";
let onReceiveHandler = null;

export function initRTCConnection(_userId, _room = "default") {
  userId = _userId;
  room = _room;
  ws = new WebSocket(`wss://your-collab-server.example/ws/${room}`);
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.userId !== userId && onReceiveHandler) onReceiveHandler(data);
  };
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join", userId, room }));
  };
}

export function broadcastChange(data) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ ...data, userId, room }));
  }
}

export function receiveChanges(handler) {
  onReceiveHandler = handler;
}

export function getConnectedUsers() {
  // This would require server support for user lists
  return Object.keys(peers);
}
