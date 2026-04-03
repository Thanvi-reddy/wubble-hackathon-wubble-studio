import React from 'react';

/**
 * COMPONENT: SuggestionPanel
 * Pure UI to display guided AI exploration advice.
 */
const SuggestionPanel = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="suggestion-box">
      <p className="suggestion-text">
        <strong>{"AI Suggestion: "}</strong>
        {message}
      </p>
    </div>
  );
};

export default SuggestionPanel;
