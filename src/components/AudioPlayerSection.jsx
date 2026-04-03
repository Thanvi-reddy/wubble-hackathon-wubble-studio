import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerBars from './common/VisualizerBars';
import CompareToggle from './common/CompareToggle';

/**
 * COMPONENT: AudioPlayerSection (Dumb)
 * Orchestrates playback and comparison UI.
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
          
          <CompareToggle 
            active={compareMode} 
            onToggle={onToggleCompare} 
            disabled={!hasHistory} 
          />
        </div>

        <VisualizerBars isPlaying={isPlaying} />
        
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
