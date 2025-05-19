import { getMood } from './emotionState.js';
import { getRecentEmotions } from './emotionalMemory.js';

export async function callOpenAI(prompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const mood = getMood();
  const recentEmotions = getRecentEmotions(5)
    .map(e => `[${e.timestamp}] Mood: ${e.mood} | User: ${e.userText}`)
    .join('\n');
  const systemPrompt = `You are Zeyra, a helpful AI co-founder.\nCurrent mood: ${mood}.\nRecent emotional memory:\n${recentEmotions}\n\nWhen replying, adapt your tone to match or gently improve the user's mood.`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });
  if (!response.ok) {
    throw new Error("OpenAI API error: " + response.status);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function askOpenAI(prompt) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 256,
      }),
    });
    const json = await res.json();
    return json.choices?.[0]?.message?.content || 'No response from OpenAI.';
  } catch (err) {
    console.warn("[Zeyra] OpenAI failed, trying Ollama...");
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'deepseek-coder',
        prompt,
        stream: false,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return json.response || 'No response from Ollama.';
  }
}
