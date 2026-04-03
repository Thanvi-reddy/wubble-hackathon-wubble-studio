import React from 'react';

/**
 * COMPONENT: CompareToggle (Stage 15 - Full Flow)
 * Providing explicit v1 vs v2 labeling for the Hero A/B Engine.
 */
const CompareToggle = ({ active, onToggle, disabled }) => {
  if (disabled) return null;

  return (
    <div className="compare-engine-wrap">
      <span className="compare-label">COMPARE</span>
      <button 
        className={`compare-toggle-btn ${active ? 'active' : ''}`} 
        onClick={onToggle}
      >
        <div className={`switch-pill ${active ? 'v2' : 'v1'}`}>
          {active ? '[ v2 ]' : '[ v1 ]'}
        </div>
      </button>
    </div>
  );
};

export default CompareToggle;
