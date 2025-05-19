import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { getImprovementSuggestions, fixFile } from './autoFixEngine.js';
import { askOpenAI } from './openai.js';

const git = simpleGit();

export async function autoUpgradeFromGitHub() {
  try {
    console.log("[Zeyra] 🔄 Pulling updates from GitHub...");
    await git.pull('origin', 'main');
    console.log("[Zeyra] ✅ Codebase updated.");
  } catch (err) {
    console.error("[Zeyra] ❌ Git pull failed:", err.message);
  }
}

async function askOllama(prompt) {
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3', prompt })
    });
    const data = await res.json();
    return data.response || data.output || JSON.stringify(data);
  } catch (err) {
    return `Ollama error: ${err.message}`;
  }
}

export async function autoUpgradeFromLLM() {
  const files = fs.readdirSync('./src').filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join('./src', file);
    const code = fs.readFileSync(filePath, 'utf-8');
    const prompt = `This is a JavaScript module from an autonomous AI assistant named Zeyra. Please suggest cleanups, upgrades, or improvements for long-term maintainability:\n\n${code}`;
    let suggestions;
    try {
      suggestions = await askOpenAI(prompt);
    } catch (err) {
      console.warn('[Zeyra] OpenAI unavailable, falling back to Ollama.');
      suggestions = await askOllama(prompt);
    }
    console.log(`\n[Zeyra] ✨ Suggestions for ${file}:`);
    console.log(suggestions);
    await fixFile(filePath); // Auto-apply improvements
  }
  console.log("[Zeyra] ✅ LLM-based upgrade complete.");
}
