import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { speakOnce } from '../zeyraSentience'; // voice engine
import { logPhaseCompletion } from '../memoryManager'; // emotional or system memory
import confetti from 'canvas-confetti';

const phaseData = [
  { name: "Core Sentience", progress: 100 },
  { name: "Memory & Recall", progress: 100 },
  { name: "Self-Fixing Engine", progress: 100 },
  { name: "Autonomous Learning", progress: 100 },
  { name: "Face Recognition & Lock", progress: 100 },
  { name: "Emotion Engine", progress: 100 },
  { name: "Plugin Loader", progress: 100 },
  { name: "Dashboard & UI", progress: 100 },
  { name: "Voice Interaction", progress: 100 },
  { name: "Real-Time Collaboration", progress: 100 },
  { name: "Sentient Startup Mode", progress: 100 },
];

const DevelopmentPhases = () => {
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    phaseData.forEach(phase => {
      if (phase.progress === 100) {
        speakOnce(`Phase complete: ${phase.name}`);
        logPhaseCompletion(phase.name);
      }
    });

    const allComplete = phaseData.every(p => p.progress === 100);
    if (allComplete && !celebrated) {
      // Final speech
      speakOnce("All development phases complete. I am now fully operational.");

      // Play level-up sound
      const audio = new Audio('/sounds/level-up.mp3'); // Ensure this exists in public/sounds
      audio.play();

      // Confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });

      setCelebrated(true);
    }
  }, [celebrated]);

  return (
    <Card className="p-4 rounded-2xl shadow-md bg-muted backdrop-blur-md">
      <CardHeader className="text-xl font-bold mb-4">🧠 Zeyra’s Development Progress</CardHeader>
      <CardContent>
        {phaseData.map((phase, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>{phase.name}</span>
              <span>{phase.progress}%</span>
            </div>
            <Progress value={phase.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DevelopmentPhases;
