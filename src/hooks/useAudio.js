import { useState, useRef, useEffect } from 'react';

/**
 * HOOK: useAudio (Stage 7 - High-Precision)
 * Zero-compromise lifecycle and preloading for instant A/B Comparison.
 */
export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  
  // High-performance refs for audio nodes
  const currentAudio = useRef(new Audio());
  const previousAudio = useRef(new Audio());

  // Cleanup effect
  useEffect(() => {
    return () => {
      currentAudio.current.pause();
      previousAudio.current.pause();
    };
  }, []);

  /**
   * Eagerly preloads audio into memory for instant playback.
   */
  const setTrack = (url, lastUrl = null) => {
    // 1. Full stop of any active audio
    stopAll();

    // 2. Load NEW audio
    currentAudio.current.src = url;
    currentAudio.current.load(); // Eager preload

    // 3. Load PREVIOUS audio (for instant contrast mode)
    if (lastUrl) {
      previousAudio.current.src = lastUrl;
      previousAudio.current.load(); // Eager preload
    }
  };

  const play = () => {
    const active = compareMode ? previousAudio.current : currentAudio.current;
    active.play();
    setIsPlaying(true);
  };

  const pause = () => {
    currentAudio.current.pause();
    previousAudio.current.pause();
    setIsPlaying(false);
  };

  const stopAll = () => {
    currentAudio.current.pause();
    currentAudio.current.currentTime = 0;
    previousAudio.current.pause();
    previousAudio.current.currentTime = 0;
    setIsPlaying(false);
  };

  /**
   * Sub-millisecond instant switch between current and previous versions.
   */
  const toggleCompare = () => {
    if (compareMode) {
      // Switching BACK to NEW
      const time = previousAudio.current.currentTime;
      previousAudio.current.pause();
      currentAudio.current.currentTime = time;
      if (isPlaying) currentAudio.current.play();
      setCompareMode(false);
    } else {
      // Switching TO PREVIOUS
      const time = currentAudio.current.currentTime;
      currentAudio.current.pause();
      previousAudio.current.currentTime = time;
      if (isPlaying) previousAudio.current.play();
      setCompareMode(true);
    }
  };

  return {
    isPlaying,
    compareMode,
    setTrack,
    play,
    pause,
    stopAll,
    toggleCompare,
    setIsPlaying,
    currentAudio
  };
};
