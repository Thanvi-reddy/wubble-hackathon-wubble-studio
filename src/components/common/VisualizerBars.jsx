import React from 'react';

/**
 * COMPONENT: VisualizerBars
 * Self-contained visual element for spectral audio animation.
 */
const VisualizerBars = ({ isPlaying }) => {
  return (
    <div className="visualizer-container">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className={`viz-bar ${isPlaying ? 'animating' : ''}`}
          style={{ 
            animationDelay: `${i * 0.1}s`, 
            height: `${20 + Math.random() * 60}%` 
          }}
        ></div>
      ))}
    </div>
  );
};

export default VisualizerBars;
