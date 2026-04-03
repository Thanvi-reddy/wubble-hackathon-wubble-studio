import React from 'react';
import { Zap, Volume2, Film } from 'lucide-react';
import SuggestionPanel from './common/SuggestionPanel';

const REMIX_CONFIG = {
  energy: { label: 'Energy', icon: <Zap size={18} /> },
  bass: { label: 'Bass', icon: <Volume2 size={18} /> },
  cinematic: { label: 'Cinematic', icon: <Film size={18} /> }
};

/**
 * COMPONENT: RemixConsole (Dumb)
 * Orchestrates remix buttons and AI guidance.
 */
const RemixConsole = ({ onRemix, suggestion, disabled }) => {
  return (
    <div className="remix-section">
      <h4>AI Recommended Evolution:</h4>
      
      <div className="remix-grid">
        {Object.entries(REMIX_CONFIG).map(([type, opt]) => (
          <button 
            key={type} 
            className={`remix-btn ${suggestion?.type === type ? 'highlight' : ''}`}
            onClick={() => onRemix(type)}
            disabled={disabled}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      <SuggestionPanel message={suggestion?.text} />
    </div>
  );
};

export default RemixConsole;
