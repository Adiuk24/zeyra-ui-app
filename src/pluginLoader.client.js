const STORAGE_KEY = 'zeyra_plugins';

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
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveConfig(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
