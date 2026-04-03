import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

// Stage 7: Engineered Architecture
import { applyRemix } from './utils/promptEngine';
import { getContextualSuggestion } from './utils/suggestionEngine';
import { useAudio } from './hooks/useAudio';
import { useWubble } from './hooks/useWubble';

// Stage 7: Pure UI Component Library
import PromptInput from './components/PromptInput';
import RemixConsole from './components/RemixConsole';
import AudioPlayerSection from './components/AudioPlayerSection';
import HistorySidebar from './components/HistorySidebar';

import './App.css';

/**
 * FINAL ORCHESTRATOR: Wubble Studio
 * Zero-compromise high-end engineering build.
 */
function App() {
  // 1. Central Session State (Engineered)
  const [session, setSession] = useState({
    prompt: '',
    currentTrack: null,
    history: [],
    evolution: [],
    suggestion: null
  });

  // 2. High-Tier Service Hooks
  const { isGenerating, statusMessage, error, generate } = useWubble();
  const { isPlaying, compareMode, setTrack, play, pause, stopAll, toggleCompare, audioRef } = useAudio();

  // 3. Engine Orchestration: Re-compute Intelligent Suggestions
  useEffect(() => {
    if (session.currentTrack && !isGenerating) {
      const suggestion = getContextualSuggestion(session.currentTrack.prompt);
      setSession(prev => ({ ...prev, suggestion }));
    }
  }, [session.currentTrack, isGenerating]);

  /**
   * ACTION: Generate (Mastery Implementation)
   */
  const handleGenerate = async (overriddenPrompt = null) => {
    const activePrompt = overriddenPrompt || session.prompt;
    if (!activePrompt.trim() || isGenerating) return;

    // UX SAFEGUARD: Cleanup Audio before fresh generation
    stopAll();

    const result = await generate(activePrompt);
    
    if (result) {
      const newTrack = { ...result, prompt: activePrompt };

      // HIGH-TIER: Eagerly preload current and previous for instant compare
      setTrack(newTrack.audio_url, session.currentTrack?.audio_url);

      // SESSION LOGIC
      setSession(prev => ({
        ...prev,
        history: prev.currentTrack ? [prev.currentTrack, ...prev.history] : prev.history,
        currentTrack: newTrack,
        evolution: [...prev.evolution, activePrompt.split(' ').slice(0, 2).join(' ')],
      }));
    }
  };

  /**
   * ACTION: Remix Transformation
   */
  const handleRemix = (type) => {
    const newPrompt = applyRemix(session.currentTrack.prompt, type);
    setSession(prev => ({ ...prev, prompt: newPrompt }));
    handleGenerate(newPrompt);
  };

  return (
    <div className="wubble-container">
      <header className="wubble-header">
        <div className="logo-section">
          <Sparkles className="logo-icon" />
          <h1>Wubble Studio</h1>
        </div>
        <p>Interactive AI Music Experience | Zero-Compromise Build</p>
      </header>

      <div className="wubble-layout">
        <main className="wubble-main">
          
          <PromptInput 
            value={session.prompt}
            onChange={(val) => setSession(prev => ({ ...prev, prompt: val }))}
            onSelectPreset={handleGenerate}
            disabled={isGenerating}
          />

          <div className="wubble-card glass main-glow">
            {/* Visual Evolution Trail */}
            {session.evolution.length > 0 && !isGenerating && (
              <div className="evolution-line">
                {session.evolution.map((step, i) => (
                  <span key={i} className="path-step">
                    {step} {i < session.evolution.length - 1 && <ArrowRight size={14} />}
                  </span>
                ))}
              </div>
            )}

            <div className="action-row">
              <button 
                className={`generate-btn ${isGenerating ? 'pulse' : ''}`}
                onClick={() => handleGenerate()}
                disabled={isGenerating || !session.prompt.trim()}
              >
                {isGenerating ? 'AI THINKING...' : 'GENERATE MUSIC'}
              </button>
              
              <AnimatePresence>
                {isGenerating && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="status-msg">
                    {statusMessage}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {error && <p className="error-text">{"⚠️ " + error}</p>}

            {/* Remix and Guided Suggestion Engine */}
            {session.currentTrack && !isGenerating && (
              <RemixConsole 
                onRemix={handleRemix}
                suggestion={session.suggestion}
                disabled={isGenerating}
              />
            )}
          </div>

          <AudioPlayerSection 
            track={session.currentTrack}
            isPlaying={isPlaying}
            compareMode={compareMode}
            hasHistory={session.history.length > 0}
            onToggleCompare={toggleCompare}
            onPlay={play}
            onPause={pause}
            audioRef={audioRef}
          />
        </main>

        <HistorySidebar 
          history={session.history} 
          onSelect={(h) => {
            stopAll();
            setTrack(h.audio_url);
            setSession(prev => ({ ...prev, currentTrack: h }));
          }} 
        />
      </div>

      <footer className="wubble-footer">
        <p>Pure Engineered Build for Wubble Hackathon | Thanvi Reddy</p>
      </footer>
    </div>
  );
}

export default App;
