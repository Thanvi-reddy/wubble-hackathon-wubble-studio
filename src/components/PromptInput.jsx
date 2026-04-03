import React from 'react';

const PRESETS = [
  { id: 'study', name: '🎧 Study', prompt: 'lofi study music with soft rain' },
  { id: 'cinematic', name: '🎬 Cinematic', prompt: 'cinematic orchestral epic theme' },
  { id: 'gaming', name: '🎮 Gaming', prompt: 'cyberpunk synthwave driving beat' },
  { id: 'chill', name: '🌧️ Chill', prompt: 'ambient peaceful chill soundscape' }
];

/**
 * COMPONENT: PromptInput
 * Handles prompt entry and quick presets.
 */
const PromptInput = ({ value, onChange, onGenerate, disabled }) => {
  return (
    <div className="prompt-section">
      <div className="presets-bar">
        {PRESETS.map(p => (
          <button 
            key={p.id} 
            onClick={() => onGenerate(p.prompt)} 
            className="preset-btn"
            disabled={disabled}
          >
            {p.name}
          </button>
        ))}
      </div>

      <textarea
        className="wubble-input"
        placeholder="What should we create today?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
      />
    </div>
  );
};

export default PromptInput;
