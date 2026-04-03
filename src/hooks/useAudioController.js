import { useState, useRef, useEffect } from 'react';

/**
 * HOOK: useAudioController (Stage 15 - Elite A/B Compare Engine)
 * High-precision lifecycle and preloading for instant, zero-latency A/B switching.
 */
export const useAudioController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  
  // High-Tier: Dedicated Dual Nodes for Parallel Preloading
  const currentAudio = useRef(new Audio());
  const previousAudio = useRef(new Audio());

  useEffect(() => {
    return () => {
      currentAudio.current.pause();
      previousAudio.current.pause();
    };
  }, []);

  /**
   * EAGER PRELOADING (Rule #6 & #7)
   * Pre-loads the 'Last Version' into memory to eliminate switching delay.
   */
  const setTrack = (url, lastUrl = null) => {
    // Stage 9: Absolute Silence Reset
    stopAll();

    currentAudio.current.src = url;
    currentAudio.current.load();

    if (lastUrl) {
      previousAudio.current.src = lastUrl;
      previousAudio.current.load();
    }
  };

  const play = () => {
    const activeNode = compareMode ? previousAudio.current : currentAudio.current;
    activeNode.play();
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
   * ELITE SWITCHING LOGIC
   * Switches BETWEEN nodes while maintaining playback context (A/B Contrast).
   */
  const toggleCompare = () => {
    const active = currentAudio.current;
    const standby = previousAudio.current;

    // RULE #3 Behavior: INSTANT Switch
    if (compareMode) {
      // Switch back to CURRENT [v2]
      const time = standby.currentTime;
      standby.pause();
      active.currentTime = time;
      if (isPlaying) active.play();
      setCompareMode(false);
    } else {
      // Switch to PREVIOUS [v1]
      const time = active.currentTime;
      active.pause();
      standby.currentTime = time;
      if (isPlaying) standby.play();
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
