// src/commandExecutor.js
// 🤖 Module 6: Command Executor
// Description: Runs safe terminal commands, captures output, and logs everything.

import { exec } from 'child_process';
import fs from 'fs';

const logFile = 'terminal_log.json';

// 1. Dangerous patterns (won't execute these)
const bannedPatterns = ['rm', 'shutdown', 'reboot', 'sudo', ':(){', 'mkfs', 'dd', '>:'];

// 2. Run a command safely
export async function runCommand(cmd) {
  for (const pattern of bannedPatterns) {
    if (cmd.includes(pattern)) {
      return { error: `❌ Command contains unsafe pattern: ${pattern}` };
    }
  }

  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      const result = {
        command: cmd,
        timestamp: new Date().toISOString(),
        output: stdout,
        error: error ? stderr : null,
      };

      logCommand(result);

      resolve(result);
    });
  });
}

// 3. Log to command_log.json
function logCommand(entry) {
  let log = [];
  if (fs.existsSync(logFile)) {
    log = JSON.parse(fs.readFileSync(logFile));
  }

  log.push(entry);
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}

export async function testVercelBuild() {
  const { exec } = await import('child_process');
  exec('vercel build', (err, stdout, stderr) => {
    if (err) {
      console.log('🔴 Vercel Build Failed:', stderr);
    } else {
      console.log('✅ Vercel Build Passed:', stdout);
    }
  });
}
