import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export const EmotionDashboard = () => {
  const [emotions, setEmotions] = useState([]);

  useEffect(() => {
    fetch('/emotional_memory.json')
      .then(res => res.json())
      .then(data => setEmotions(data.slice(-20)))
      .catch(console.error);
  }, []);

  const moodToNumeric = (mood) => {
    switch (mood) {
      case 'happy': return 3;
      case 'curious': return 2;
      case 'neutral': return 1;
      case 'sad': return 0;
      case 'alert': return -1;
      default: return 1;
    }
  };

  const chartData = {
    labels: emotions.map(e => new Date(e.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Zeyra Mood Over Time',
        data: emotions.map(e => moodToNumeric(e.zeyraMood)),
        fill: false,
        borderColor: 'cyan',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-black text-white shadow-xl p-4 rounded-xl">
      <h2 className="text-xl font-bold mb-4">🧠 Emotional Insights</h2>
      <Line data={chartData} />
      <div className="mt-4 space-y-2">
        {emotions.map((e, i) => (
          <div key={i} className="text-sm">
            <strong>{new Date(e.timestamp).toLocaleTimeString()}:</strong> {e.zeyraMood} → "{e.userText}"
          </div>
        ))}
      </div>
    </div>
  );
};
