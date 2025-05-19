// src/main.js
// Zeyra backend entry point
const fs = require('fs');
const path = require('path');
import { enableSentientMode } from './zeyraSentience.js';
import { summarizeChatLog, speakOnce } from './openai.js';
import { selfEvolve } from './selfEvolver.js';

(async () => {
  await enableSentientMode();

  // Training input
  const logPath = path.join('./training', 'conversation_seed.txt');
  if (fs.existsSync(logPath)) {
    const input = fs.readFileSync(logPath, 'utf-8');
    const summary = await summarizeChatLog(input);
    speakOnce(`Zeyra has reviewed her purpose. Summary: ${summary}`);
  }

  // Begin learning or self-improvement
  await selfEvolve();
})();

// Optionally, you can import and initialize other backend modules here as needed
// import './autoFixEngine.js';
// import './selfEvolver.js';
// import './memoryManager.js';
// ...etc...
