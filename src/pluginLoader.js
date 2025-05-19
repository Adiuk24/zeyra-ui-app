const fs = window.localStorage;

const PLUGIN_KEY = 'zeyra_plugins';

export function registerPlugin(name, path, description) {
  const plugins = getPlugins();
  plugins[name] = { path, description, enabled: false };
  fs.setItem(PLUGIN_KEY, JSON.stringify(plugins));
}

export function getPlugins() {
  return JSON.parse(fs.getItem(PLUGIN_KEY)) || {};
}

export function enablePlugin(name) {
  const plugins = getPlugins();
  if (plugins[name]) {
    plugins[name].enabled = true;
    fs.setItem(PLUGIN_KEY, JSON.stringify(plugins));
  }
}

export function disablePlugin(name) {
  const plugins = getPlugins();
  if (plugins[name]) {
    plugins[name].enabled = false;
    fs.setItem(PLUGIN_KEY, JSON.stringify(plugins));
  }
}

export function getActivePlugins() {
  const plugins = getPlugins();
  return Object.entries(plugins).filter(([_, v]) => v.enabled);
}
