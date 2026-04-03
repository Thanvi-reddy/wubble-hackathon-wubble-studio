import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

// STAGE 8: System-Driven Architecture
import { generateTrack, waitForCompletion } from './services/wubbleApi';
import { applyRemix } from './utils/remixEngine';
import { getContextualSuggestion } from './utils/suggestionEngine';
import { orchestrateNewTrack, updatePrompt, orchestrateError } from './utils/sessionOrchestrator';

// STAGE 8: High-Tier Controller Hooks
import { useAudioController } from './hooks/useAudioController';
import { useWubble } from './hooks/useWubble';

// STAGE 8: Standardized UI Component Library
import PromptInput from './components/PromptInput';
import RemixConsole from './components/RemixConsole';
import AudioPlayerSection from './components/AudioPlayerSection';
import HistorySidebar from './components/HistorySidebar';

import './App.css';

/**
 * SYSTEM ORCHESTRATOR: Wubble Studio
 * High-end architectural implementation with zero-compromise logic separation.
 */
function App() {
  // 1. Centralized Engineered Session State
  const [session, setSession] = useState({
    prompt: '',
    currentTrack: null,
    history: [],
    evolution: [],
    suggestion: null,
    error: null
  });

  // 2. Industrial-Grade Logic Controllers
  const { isGenerating, statusMessage, error, generate } = useWubble();
  const { isPlaying, compareMode, setTrack, play, pause, stopAll, toggleCompare, audioRef } = useAudioController();

  // 3. Intelligence Flow: Automatic Suggestion Orchestration
  useEffect(() => {
    if (session.currentTrack && !isGenerating) {
      const suggestion = getContextualSuggestion(session.currentTrack.prompt);
      setSession(prev => ({ ...prev, suggestion }));
    }
  }, [session.currentTrack, isGenerating]);

  /**
   * HANDLER: Music Generation (Lifecycle Engineered)
   */
  const handleGenerate = async (overriddenPrompt = null) => {
    const activePrompt = overriddenPrompt || session.prompt;
    if (!activePrompt.trim() || isGenerating) return;

    // UX SAFEGUARD: Reset and Silent Audio Cleanup
    stopAll();

    const result = await generate(activePrompt);
    
    if (result) {
      const newTrack = { ...result, prompt: activePrompt };

      // HIGH-TIER: Eager Preloading for instant switch demo
      setTrack(newTrack.audio_url, session.currentTrack?.audio_url);

      // System Orchestration: Update Logic decoupled from UI
      setSession(prev => orchestrateNewTrack(prev, newTrack));
    } else if (error) {
       setSession(prev => orchestrateError(prev, error));
    }
  };

  /**
   * HANDLER: Sound Remix / Evolution
   */
  const handleRemix = (type) => {
    const newPrompt = applyRemix(session.currentTrack.prompt, type);
    setSession(prev => updatePrompt(prev, newPrompt));
    handleGenerate(newPrompt);
  };

  return (
    <div className="wubble-container">
      <header className="wubble-header">
        <div className="logo-section"  initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Sparkles className="logo-icon" />
          <h1>Wubble Studio</h1>
        </div>
        <p>Interactive AI Music Experience | Industrial System Build</p>
      </header>

      <div className="wubble-layout">
        <main className="wubble-main">
          
          <PromptInput 
            value={session.prompt}
            onChange={(val) => setSession(prev => updatePrompt(prev, val))}
            onSelectPreset={handleGenerate}
            disabled={isGenerating}
          />

          <div className="wubble-card glass main-glow">
            {/* Evolution Trail: Dynamic Creation Path */}
            {session.evolution.length > 0 && !isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="evolution-line">
                {session.evolution.map((step, i) => (
                  <span key={i} className="path-step">
                    {step} {i < session.evolution.length - 1 && <ArrowRight size={14} />}
                  </span>
                ))}
              </motion.div>
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

            {(session.error || error) && (
              <p className="error-text">{"⚠️ Error: " + (session.error || error)}</p>
            )}

            {/* Decoupled Remix Engine & Suggestion Panel */}
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
        <p>Architected for the Wubble Hackathon | Industrial Mastery by Thanvi Reddy</p>
      </footer>
    </div>
  );
}

export default App;
