import React from 'react';

/**
 * COMPONENT: CompareToggle (Top 3 Tier)
 * Strategic UI for the A/B Compare Engine.
 */
const CompareToggle = ({ active, onToggle, disabled }) => {
  if (disabled) return null;

  return (
    <button 
      className={`compare-toggle ${active ? 'active' : ''}`} 
      onClick={onToggle}
    >
      {active ? 'BACK TO CURRENT' : 'A/B COMPARE ENGINE'}
    </button>
  );
};

export default CompareToggle;
