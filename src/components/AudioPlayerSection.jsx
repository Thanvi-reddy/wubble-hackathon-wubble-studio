import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * COMPONENT: AudioPlayerSection
 * Handles the main playback window and comparison layout.
 */
const AudioPlayerSection = ({ 
  track, 
  isPlaying, 
  compareMode, 
  hasHistory, 
  onToggleCompare, 
  onPlay, 
  onPause, 
  audioRef 
}) => {
  if (!track) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="player-card glass"
      >
        <div className="player-header">
          <div>
            <span className="badge">
              {compareMode ? 'PREVIOUS VERSION' : 'CURRENT VERSION'}
            </span>
            <h3>{track.song_title || track.title}</h3>
          </div>
          
          {hasHistory && (
            <button 
              className={`compare-toggle ${compareMode ? 'active' : ''}`} 
              onClick={onToggleCompare}
            >
              {compareMode ? 'BACK TO NEW' : 'COMPARE v1 vs v2'}
            </button>
          )}
        </div>

        {/* Visualizer Spectrogram (Fake) */}
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
        
        <audio 
          ref={audioRef}
          controls 
          src={track.audio_url || track.url} 
          autoPlay
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onPause}
          className="wubble-player"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioPlayerSection;
