import React from 'react';

const PRESETS = [
  { id: 'study', name: '🎧 Study', prompt: 'lofi study music with soft rain' },
  { id: 'cinematic', name: '🎬 Cinematic', prompt: 'cinematic orchestral epic theme' },
  { id: 'gaming', name: '🎮 Gaming', prompt: 'cyberpunk synthwave driving beat' },
  { id: 'chill', name: '🌧️ Chill', prompt: 'ambient peaceful chill soundscape' }
];

/**
 * COMPONENT: PresetButtons
 * Pure presentational buttons for quick starts.
 */
const PresetButtons = ({ onSelect, disabled }) => {
  return (
    <div className="presets-bar">
      {PRESETS.map(p => (
        <button 
          key={p.id} 
          onClick={() => onSelect(p.prompt)} 
          className="preset-btn"
          disabled={disabled}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
};

export default PresetButtons;
