import fs from 'fs';
import path from 'path';
import { searchDuckDuckGo } from './webSearch.js';

const topicsFile = 'topics_to_learn.json';
const memoryFile = 'knowledge_base.json';

// 1. Load or initialize the topics list
function loadTopics() {
  if (fs.existsSync(topicsFile)) {
    return JSON.parse(fs.readFileSync(topicsFile));
  }
  return [];
}

// 2. Save topic list back
function saveTopics(topics) {
  fs.writeFileSync(topicsFile, JSON.stringify(topics, null, 2));
}

// 3. Add a topic
export function addTopic(topic) {
  const topics = loadTopics();
  if (!topics.includes(topic)) {
    topics.push(topic);
    saveTopics(topics);
    console.log(`✅ Topic added: ${topic}`);
  } else {
    console.log(`⚠️ Topic already exists: ${topic}`);
  }
}

// 4. Learn next topic
export async function learnNextTopic() {
  const topics = loadTopics();
  if (topics.length === 0) {
    console.log('🎉 No topics left to learn.');
    return;
  }

  const topic = topics.shift();
  console.log(`🔍 Learning about: ${topic}`);

  const summary = await searchDuckDuckGo(topic);

  // Save to memory
  const memory = fs.existsSync(memoryFile)
    ? JSON.parse(fs.readFileSync(memoryFile))
    : {};

  memory[topic] = {
    summary,
    learnedAt: new Date().toISOString(),
  };

  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
  saveTopics(topics);

  console.log(`🧠 Learned and saved: ${topic}`);
}
