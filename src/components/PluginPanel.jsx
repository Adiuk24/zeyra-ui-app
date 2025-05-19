import React, { useState, useEffect } from 'react';
import { getPlugins, enablePlugin, disablePlugin } from '../pluginLoader';

export const PluginPanel = () => {
  const [plugins, setPlugins] = useState({});

  useEffect(() => {
    setPlugins(getPlugins());
  }, []);

  const toggle = (name) => {
    plugins[name].enabled
      ? disablePlugin(name)
      : enablePlugin(name);
    setPlugins(getPlugins());
  };

  return (
    <div className="p-4 border rounded bg-black/80 text-white max-w-md">
      <h2 className="text-xl font-bold mb-3">🔌 Zeyra Plugins</h2>
      {Object.keys(plugins).length === 0 && <p>No plugins registered yet.</p>}
      <ul>
        {Object.entries(plugins).map(([name, { description, enabled }]) => (
          <li key={name} className="mb-2">
            <div className="flex justify-between items-center">
              <div>
                <strong>{name}</strong>
                <p className="text-sm opacity-70">{description}</p>
              </div>
              <button
                onClick={() => toggle(name)}
                className={`px-3 py-1 rounded text-sm ${
                  enabled ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
