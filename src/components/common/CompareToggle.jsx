import React from 'react';

/**
 * COMPONENT: CompareToggle
 * High-visibility switch for A/B comparison demo.
 */
const CompareToggle = ({ active, onToggle, disabled }) => {
  if (disabled) return null;

  return (
    <button 
      className={`compare-toggle ${active ? 'active' : ''}`} 
      onClick={onToggle}
    >
      {active ? 'BACK TO CURRENT' : 'COMPARE v1 vs v2'}
    </button>
  );
};

export default CompareToggle;
