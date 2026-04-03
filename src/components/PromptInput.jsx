import React from 'react';
import PresetButtons from './common/PresetButtons';

/**
 * COMPONENT: PromptInput (Dumb)
 * Orchestrates the prompt entry area and presets.
 */
const PromptInput = ({ value, onChange, onSelectPreset, disabled }) => {
  return (
    <div className="prompt-section">
      <PresetButtons 
        onSelect={onSelectPreset} 
        disabled={disabled} 
      />

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
