import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Music } from 'lucide-react';

// STAGE 15: Full-Flow System Harmony
import { applyRemix } from './utils/remixEngine';
import { getContextualSuggestion } from './utils/suggestionEngine';
import { 
  orchestrateNewTrack, 
  updatePrompt, 
  orchestrateError, 
  canGenerate,
  resolvePrompt
} from './utils/sessionOrchestrator';

import { useAudioController } from './hooks/useAudioController';
import { useWubble } from './hooks/useWubble';

import PromptInput from './components/PromptInput';
import RemixConsole from './components/RemixConsole';
import AudioPlayerSection from './components/AudioPlayerSection';
import HistorySidebar from './components/HistorySidebar';

import './App.css';

/**
 * FULL FLOW ORCHESTRATOR: Wubble Studio (Stage 15)
 * Industrial user-flow following the 10-step master blueprint.
 */
function App() {
  const [session, setSession] = useState({
    prompt: '',
    currentTrack: null,
    history: [],
    evolution: [],
    suggestion: null,
    error: null
  });

  const { isGenerating, statusMessage, generate } = useWubble();
  const { isPlaying, compareMode, setTrack, play, pause, stopAll, toggleCompare, audioRef } = useAudioController();

  useEffect(() => {
    if (session.currentTrack && !isGenerating) {
      const suggestion = getContextualSuggestion(session.currentTrack.prompt);
      setSession(prev => ({ ...prev, suggestion }));
    }
  }, [session.currentTrack, isGenerating]);

  /**
   * ACTION: Unified Logic Flow (Step 3 & 5 Sync)
   */
  const handleGenerate = async (overriddenPrompt = null, isRemix = false) => {
    const activePrompt = resolvePrompt(session.prompt, overriddenPrompt);
    if (!canGenerate(activePrompt, isGenerating)) return;

    // UX Safeguard: Silent Session Cleanup
    stopAll();

    const response = await generate(activePrompt, isRemix);
    
    if (response?.success) {
      const newTrack = { ...response.data, prompt: activePrompt };
      setTrack(newTrack.audio_url, session.currentTrack?.audio_url);
      setSession(prev => orchestrateNewTrack(prev, newTrack));
    } else if (response?.error) {
       setSession(prev => orchestrateError(prev, response.error));
    }
  };

  /**
   * ACTION: Sound Evolution (Step 5 Sync)
   */
  const handleRemix = (type) => {
    const newPrompt = applyRemix(session.currentTrack.prompt, type);
    setSession(prev => updatePrompt(prev, newPrompt));
    // Step 5 Branding: Pass isRemix=true for unique status messages
    handleGenerate(newPrompt, true); 
  };

  return (
    <div className="wubble-container">
      <header className="wubble-header">
        <motion.div className="logo-section" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Sparkles className="logo-icon" />
          <h1>Wubble Studio</h1>
        </motion.div>
        <p className="hook-subtitle">Generate, evolve, and compare AI music in real-time</p>
      </header>

      <div className="wubble-layout">
        <main className="wubble-main">
          
          <div className="input-orchestrator">
            <PromptInput 
              value={session.prompt}
              onChange={(val) => setSession(prev => updatePrompt(prev, val))}
              onSelectPreset={(p) => handleGenerate(p, false)}
              disabled={isGenerating}
            />
            <p className="ux-hint">Start by selecting a preset or typing a creative prompt above</p>
          </div>

          <div className="wubble-card glass main-glow">
            <AnimatePresence mode="wait">
              {!session.currentTrack && !isGenerating ? (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="placeholder-state">
                  <div className="placeholder-icon-wrap"><Music className="placeholder-icon" size={48} /></div>
                  <h2>Ready to Create?</h2>
                  <p>Your unique AI soundscape will appear here once you hit Generate.</p>
                </motion.div>
              ) : null}

              {/* Step 6: Visual Evolution Map */}
              {session.evolution.length > 0 && !isGenerating && (
                <motion.div key="evolution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="evolution-line">
                  {session.evolution.map((step, i) => (
                    <span key={i} className="path-step">
                      {step} {i < session.evolution.length - 1 && <ArrowRight size={14} />}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="action-row">
              <button 
                className={`generate-btn ${isGenerating ? 'pulse' : ''} ${canGenerate(session.prompt, isGenerating) ? 'btn-ready' : ''}`}
                onClick={() => handleGenerate()}
                disabled={!canGenerate(session.prompt, isGenerating)}
              >
                {isGenerating ? 'ENGINE — THINKING...' : 'GENERATE MUSIC'}
              </button>
              
              <AnimatePresence>
                {isGenerating && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="status-msg">
                    {statusMessage || '🎧 Syncing sound layers...'}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {session.error && (
              <p className="error-text">{"⚠️ Error: " + session.error}</p>
            )}

            {/* Step 4: Intelligent Context Engine */}
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
        <p>Architected for the Wubble Hackathon | Full-Flow Mastery by Thanvi Reddy</p>
      </footer>
    </div>
  );
}

export default App;
