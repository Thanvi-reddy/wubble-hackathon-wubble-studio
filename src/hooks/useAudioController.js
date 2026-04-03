import { useState, useRef, useEffect } from 'react';

/**
 * HOOK: useAudioController (Stage 8 - Industrial Tier)
 * Specialized lifecycle and preloading for instant A/B Contrast Mode.
 */
export const useAudioController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  
  // Audio Nodes
  const currentAudio = useRef(new Audio());
  const previousAudio = useRef(new Audio());

  useEffect(() => {
    return () => {
      currentAudio.current.pause();
      previousAudio.current.pause();
    };
  }, []);

  /**
   * Eager Preloading for sub-millisecond track switching.
   */
  const setTrack = (url, lastUrl = null) => {
    stopAll();
    currentAudio.current.src = url;
    currentAudio.current.load();

    if (lastUrl) {
      previousAudio.current.src = lastUrl;
      previousAudio.current.load();
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

  const toggleCompare = () => {
    if (compareMode) {
      const time = previousAudio.current.currentTime;
      previousAudio.current.pause();
      currentAudio.current.currentTime = time;
      if (isPlaying) currentAudio.current.play();
      setCompareMode(false);
    } else {
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
    audioRef: currentAudio
  };
};
