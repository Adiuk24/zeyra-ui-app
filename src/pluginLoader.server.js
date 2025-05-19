import fs from 'fs';

const CONFIG_FILE = 'zeyra_plugins.json';

export function registerPlugin(name, path, description) {
  const config = loadConfig();
  config[name] = { path, description, enabled: false };
  saveConfig(config);
}

export function enablePlugin(name) {
  const config = loadConfig();
  if (config[name]) {
    config[name].enabled = true;
    saveConfig(config);
  }
}

export function disablePlugin(name) {
  const config = loadConfig();
  if (config[name]) {
    config[name].enabled = false;
    saveConfig(config);
  }
}

export function getActivePlugins() {
  const config = loadConfig();
  return Object.entries(config)
    .filter(([_, p]) => p.enabled)
    .map(([name, p]) => ({ name, ...p }));
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

function saveConfig(data) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}
