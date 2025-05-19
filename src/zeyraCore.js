import { scanForOutdatedFiles, generateImprovementPlan, executeSelfUpdate } from './selfEvolver.js';

// Run the self-evolution process
export async function runSelfEvolution() {
  try {
    console.log('🧠 Zeyra Self-Evolution: Scanning for outdated files...');
    const files = await scanForOutdatedFiles();
    if (!files.length) {
      console.log('✅ No .js files found for evolution.');
      return;
    }
    console.log(`🔍 Found ${files.length} .js files.`);
    const plan = generateImprovementPlan(files);
    console.log('📝 Generated improvement plan:', plan);
    await executeSelfUpdate(plan);
    console.log('🚀 Self-evolution complete!');
  } catch (err) {
    console.error('❌ Self-evolution failed:', err.message || err);
  }
}

// Schedule evolution at intervals (ms)
export function scheduleEvolution(intervalMs) {
  console.log(`⏰ Scheduling self-evolution every ${intervalMs / 1000}s...`);
  setInterval(runSelfEvolution, intervalMs);
}

// CLI support
if (process.argv.includes('--evolve')) {
  runSelfEvolution();
}
