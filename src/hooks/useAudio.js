import { useState, useRef, useEffect } from 'react';

/**
 * CUSTOM HOOK: useAudio
 * Manages the play/pause, preloading, and track switching logic 
 * for a specialized A/B Comparison demo.
 */
export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const audioRef = useRef(new Audio());
  const prevAudioRef = useRef(new Audio());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      prevAudioRef.current.pause();
    };
  }, []);

  /**
   * Sets up or switches the current track.
   */
  const setTrack = (url, previousUrl = null) => {
    // Current
    audioRef.current.pause();
    audioRef.current.src = url;
    audioRef.current.load();

    // Preload Previous (for instant A/B switch)
    if (previousUrl) {
      prevAudioRef.current.pause();
      prevAudioRef.current.src = previousUrl;
      prevAudioRef.current.load();
    }
  };

  const play = () => {
    const active = compareMode ? prevAudioRef.current : audioRef.current;
    active.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    prevAudioRef.current.pause();
    setIsPlaying(false);
  };

  const toggleCompare = () => {
    if (compareMode) {
      // Switching BACK to New
      prevAudioRef.current.pause();
      audioRef.current.currentTime = prevAudioRef.current.currentTime;
      if (isPlaying) audioRef.current.play();
      setCompareMode(false);
    } else {
      // Switching TO Previous
      audioRef.current.pause();
      prevAudioRef.current.currentTime = audioRef.current.currentTime;
      if (isPlaying) prevAudioRef.current.play();
      setCompareMode(true);
    }
  };

  return {
    isPlaying,
    compareMode,
    setTrack,
    play,
    pause,
    toggleCompare,
    setIsPlaying,
    audioRef,
    prevAudioRef
  };
};
