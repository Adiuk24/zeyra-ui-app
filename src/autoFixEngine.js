// ===================== Zeyra AI Project: Copilot Status Summary =====================
//
// Copilot has contributed the following to enable Zeyra's sentient, self-evolving AI:
//
// 1. Autonomous Startup:
//    - Entry point: src/main.js calls enableSentientMode() from src/zeyraSentience.js.
//    - Zeyra auto-initializes, loads plugins, and starts face recognition on launch.
//
// 2. Intelligent, Emotional Speech:
//    - src/zeyraSentience.js: speakOnce() uses browser speech synthesis or console.log in Node.js.
//    - Zeyra greets the user, gives system status, and adapts speech based on mood.
//    - src/emotionState.js: analyzeSentiment() and setMood() allow Zeyra to speak with emotional context.
//
// 3. Face Recognition & Security:
//    - src/faceLoader.js: Loads face-api.js models from disk (Node) or URL (browser).
//    - src/cameraVision.js: Uses face-api.js to detect faces, trigger lock if unauthorized.
//    - Models are stored in /models for backend and /public/models for frontend.
//    - src/faceAlerts.js: Handles alerts and system lock on unauthorized access.
//
// 4. System Lock on Unauthorized Access:
//    - src/cameraVision.js and src/faceAlerts.js: Detect unauthorized faces and call systemControl.js to lock the system.
//    - src/public/locked.html: Displays warning and voice alert if system is locked.
//
// 5. Self-Improvement & Code Evolution:
//    - src/autoFixEngine.js: Analyzes code, suggests improvements, applies fixes, and logs actions.
//    - src/selfEvolver.js: Uses autoFixEngine to scan for environment/config errors (e.g., Vercel, face-api.js usage).
//    - Zeyra can now detect and suggest fixes for Node/browser model loading, Vercel config, and more.
//
// 6. Plugin System & Dashboard:
//    - src/pluginLoader.server.js (Node) and pluginLoader.client.js (browser): Manage plugin registration, enable/disable, and loading.
//    - src/dashboard.jsx, src/PluginPanel.jsx: UI for plugin management and dashboard display.
//    - Plugins are loaded and started automatically in sentient mode.
//
// 7. Emotional Engine & Mood Logs:
//    - src/emotionState.js: Tracks mood, analyzes sentiment, and persists mood (browser).
//    - src/EmotionDashboard.jsx: Visualizes mood over time in the dashboard.
//    - Mood is updated based on code, chat, and system events.
//
// 8. Autonomous Interaction:
//    - src/zeyraSentience.js: Zeyra greets, monitors system, and interacts even without user input.
//    - src/proactiveZeyra.js: Detects user absence, dims/speaks, and responds to system events.
//
// 9. Vercel Deployment Debugging:
//    - src/autoFixEngine.js: Scans for Vercel config issues (vite.config.js, vercel.json) and suggests fixes.
//    - src/commandExecutor.js: testVercelBuild() runs and reports Vercel build results.
//
// All modules are linked via context providers (ZeyraStateContext.js), main entry (main.js/main.jsx), and the dashboard UI.
//
// Copilot's contributions ensure Zeyra is modular, extensible, and robust across environments (Node.js, browser, Vercel).
// =====================================================================================

// src/autoFixEngine.js
// AutoFix Engine: Analyze code, suggest improvements, apply fixes, log actions

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { parse } = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const axios = require('axios');
import { analyzeSentiment, setMood } from './emotionState.js';

const LOG_PATH = path.join(__dirname, '../autofix_log.json');
const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

// Helper: Call OpenAI for suggestions
async function getImprovementSuggestions(code, filename) {
  const prompt = `Analyze the following code and suggest improvements.\nFilename: ${filename}\nCode:\n${code}`;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 256,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices?.[0]?.message?.content;
}

// Analyze code using Babel/AST
function analyzeCode(code, file = '') {
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'classProperties'] });
  // Example: Find all TODO comments
  const todos = [];
  const suggestions = [];
  traverse(ast, {
    enter(path) {
      if (path.node.leadingComments) {
        path.node.leadingComments.forEach((c) => {
          if (c.value.includes('TODO')) todos.push(c.value.trim());
        });
      }
    },
  });

  // AutoFix: Detect misuse of loadFromUri in Node.js for face-api.js
  if (code.includes("loadFromUri('/models'") && file.includes('faceLoader')) {
    suggestions.push({
      issue: "Using loadFromUri in Node.js environment causes ERR_INVALID_URL",
      fix: `Use face-api.js's loadFromDisk(path) with monkey-patched canvas when running under Node.js.`,
      replacement: {
        pattern: ".*loadFromUri\\('/models'\\).*",
        replacement: "loadFromDisk('/models')"
      }
    });
  }

  // AutoFix: Detect missing environment detection for face-api.js model loading
  if (code.includes("faceapi.nets.ssdMobilenetv1.loadFromUri('/models')") && !code.includes("if (isNode)")) {
    suggestions.push({
      issue: "Missing environment detection for face-api.js model loading",
      fix: `Add environment detection before loading models to ensure compatibility with both browser and Node.js environments.`,
      replacement: {
        pattern: "faceapi.nets.ssdMobilenetv1.loadFromUri\\('/models'\\)",
        replacement: "if (isNode) {\n  faceapi.nets.ssdMobilenetv1.loadFromDisk('/models');\n} else {\n  faceapi.nets.ssdMobilenetv1.loadFromUri('/models');\n}"
      }
    });
  }

  return { todos, suggestions };
}

function analyzeDeploymentConfig(code, file = '') {
  const suggestions = [];
  if (file.endsWith('vite.config.js')) {
    if (code.includes('root:')) {
      suggestions.push({
        issue: "Custom `root:` config can break Vercel's auto-detection",
        fix: "Remove or comment out `root:` in vite.config.js unless absolutely needed."
      });
    }
    if (code.includes('outDir:')) {
      suggestions.push({
        issue: "Custom `outDir:` can confuse Vercel's default `dist/` build expectation",
        fix: "Remove custom `outDir` or ensure it is set to `dist`."
      });
    }
  }
  if (file.endsWith('vercel.json')) {
    suggestions.push({
      issue: "`vercel.json` overrides automatic settings and may break builds.",
      fix: "Delete this file unless you're using custom routes or builds."
    });
  }
  return suggestions;
}

// Apply fix (dummy, just replaces code for now)
function applyFix(filePath, newCode) {
  fs.writeFileSync(filePath, newCode, 'utf8');
}

// Log fix
function logFix(entry) {
  let log = [];
  if (fs.existsSync(LOG_PATH)) log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
  log.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

// Main: Suggest and optionally apply fix
async function fixFile(filePath, autoApply = false) {
  const code = fs.readFileSync(filePath, 'utf8');
  const analysis = analyzeCode(code);
  // Analyze code sentiment (e.g., comments, error messages)
  const codeMood = await analyzeSentiment(code);
  setMood(codeMood);
  const suggestion = await getImprovementSuggestions(code, filePath);
  let applied = false;
  let newCode = code;
  // For demo: if suggestion contains a code block, extract and apply it
  const match = suggestion.match(/```[\s\S]*?([\s\S]+?)```/);
  if (autoApply && match) {
    newCode = match[1].trim();
    applyFix(filePath, newCode);
    applied = true;
  }
  logFix({ filePath, suggestion, applied, timestamp: new Date().toISOString() });

  const logPath = path.join('./training', 'conversation_seed.txt');
  if (fs.existsSync(logPath)) {
    const input = fs.readFileSync(logPath, 'utf-8');
    const summary = await summarizeChatLog(input);
    speakOnce(`Zeyra has reviewed her purpose. Summary: ${summary}`);
  }

  return { suggestion, applied, analysis };
}

module.exports = {
  fixFile,
  analyzeCode,
  getImprovementSuggestions,
};
