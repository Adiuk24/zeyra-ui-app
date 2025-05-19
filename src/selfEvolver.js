import fs from 'fs';
import path from 'path';
import { fixFile } from './autoFixEngine.js';

const projectRoot = './src';

export async function scanForOutdatedFiles() {
  const files = fs.readdirSync(projectRoot).filter(f => f.endsWith('.js'));
  return files.map(f => path.join(projectRoot, f));
}

export function generateImprovementPlan(fileList) {
  return fileList.map(file => ({
    file,
    reason: 'Periodic maintenance or quality improvement recommended.',
  }));
}

export async function executeSelfUpdate(plan) {
  for (const { file } of plan) {
    await fixFile(file);
    logEvolutionStep(file);
  }
}

export function logEvolutionStep(filePath) {
  const logPath = 'evolution_log.json';
  const entry = {
    file: filePath,
    timestamp: new Date().toISOString(),
    note: 'Self-update triggered by Zeyra AI.',
  };

  let log = [];
  if (fs.existsSync(logPath)) {
    log = JSON.parse(fs.readFileSync(logPath));
  }
  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}
