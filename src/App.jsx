import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

// STAGE 12: Elite System Architecture (Final Stabilization)
import { applyRemix } from './utils/remixEngine';
import { getContextualSuggestion } from './utils/suggestionEngine';
import { 
  orchestrateNewTrack, 
  updatePrompt, 
  orchestrateError, 
  canGenerate,
  resolvePrompt
} from './utils/sessionOrchestrator';

// STAGE 12: High-Tier Controller Hooks
import { useAudioController } from './hooks/useAudioController';
import { useWubble } from './hooks/useWubble';

// STAGE 12: Pure UI Component Library (Final Branding)
import PromptInput from './components/PromptInput';
import RemixConsole from './components/RemixConsole';
import AudioPlayerSection from './components/AudioPlayerSection';
import HistorySidebar from './components/HistorySidebar';

import './App.css';

/**
 * ELITE ORCHESTRATOR: Wubble Studio (Stage 12 - FINAL)
 * Final architectural stabilization and industrial-tier orchestration.
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

  // 2. Specialized System Controllers (Stage 12 stabilized)
  const { isGenerating, statusMessage, generate } = useWubble();
  const { isPlaying, compareMode, setTrack, play, pause, stopAll, toggleCompare, audioRef } = useAudioController();

  // 3. Flow Engine: Automatic Contextual Suggestion Execution
  useEffect(() => {
    if (session.currentTrack && !isGenerating) {
      const suggestion = getContextualSuggestion(session.currentTrack.prompt);
      setSession(prev => ({ ...prev, suggestion }));
    }
  }, [session.currentTrack, isGenerating]);

  /**
   * ACTION: Music Generation Flow (Engineered Lifecycle)
   */
  const handleGenerate = async (overriddenPrompt = null) => {
    const activePrompt = resolvePrompt(session.prompt, overriddenPrompt);
    if (!canGenerate(activePrompt, isGenerating)) return;

    // UX Safeguard: Silent Audio Reset
    stopAll();

    const response = await generate(activePrompt);
    
    if (response?.success) {
      const newTrack = { ...response.data, prompt: activePrompt };

      // HIGH-TIER: Eager Preloading for instant switch demo
      setTrack(newTrack.audio_url, session.currentTrack?.audio_url);

      // System Orchestration: Pure logic decoupled from UI
      setSession(prev => orchestrateNewTrack(prev, newTrack));
    } else if (response?.error) {
       setSession(prev => orchestrateError(prev, response.error));
    }
  };

  /**
   * ACTION: Evolution Remix Transformation
   */
  const handleRemix = (type) => {
    const newPrompt = applyRemix(session.currentTrack.prompt, type);
    setSession(prev => updatePrompt(prev, newPrompt));
    handleGenerate(newPrompt);
  };

  return (
    <div className="wubble-container">
      <header className="wubble-header">
        <motion.div className="logo-section" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Sparkles className="logo-icon" />
          <h1>Wubble Studio</h1>
        </motion.div>
        <p className="hook-subtitle">Intelligent AI Music System | Stage 12 Final Mastery Build</p>
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
            {/* Visual Evolution Trail Mapping */}
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
                disabled={!canGenerate(session.prompt, isGenerating)}
              >
                {isGenerating ? 'AI ENGINE — THINKING...' : 'GENERATE MUSIC'}
              </button>
              
              <AnimatePresence>
                {isGenerating && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="status-msg">
                    {statusMessage}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {session.error && (
              <p className="error-text">{"⚠️ Error: " + session.error}</p>
            )}

            {/* Strategic Branding Logic Engines */}
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
        <p>Architected for the Wubble Hackathon | End-to-End Master Stabilization by Thanvi Reddy</p>
      </footer>
    </div>
  );
}

export default App;
