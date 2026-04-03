import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

// Layered Architecture
import { applyRemix } from './utils/promptEngine';
import { getContextualSuggestion } from './utils/suggestionEngine';
import { useAudio } from './hooks/useAudio';
import { useWubble } from './hooks/useWubble';

// Dumb Component Library
import PromptInput from './components/PromptInput';
import RemixConsole from './components/RemixConsole';
import AudioPlayerSection from './components/AudioPlayerSection';
import HistorySidebar from './components/HistorySidebar';

import './App.css';

/**
 * MAIN ORCHESTRATOR: Wubble Studio
 * High-level orchestration of UI, Hooks, and Engines.
 */
function App() {
  // Central Session State
  const [session, setSession] = useState({
    prompt: '',
    currentTrack: null,
    history: [],
    evolution: [],
    suggestion: null
  });

  // Specialized Hooks
  const { isGenerating, statusMessage, error, generate } = useWubble();
  const { isPlaying, compareMode, setTrack, play, pause, toggleCompare, audioRef } = useAudio();

  /**
   * SUGGESTION FLOW
   * The suggestion engine runs whenever the current track is updated. 
   */
  useEffect(() => {
    if (session.currentTrack && !isGenerating) {
      const suggestion = getContextualSuggestion(session.currentTrack.prompt);
      setSession(prev => ({ ...prev, suggestion }));
    }
  }, [session.currentTrack, isGenerating]);

  /**
   * GENERATION HANDLER
   */
  const handleGenerate = async (overriddenPrompt = null) => {
    const activePrompt = overriddenPrompt || session.prompt;
    const result = await generate(activePrompt);
    
    if (result) {
      const newTrack = { ...result, prompt: activePrompt };

      // Update Audio Controller
      setTrack(newTrack.audio_url, session.currentTrack?.audio_url);

      // System State Logic: History, Current, and Evolution Path
      setSession(prev => ({
        ...prev,
        history: prev.currentTrack ? [prev.currentTrack, ...prev.history] : prev.history,
        currentTrack: newTrack,
        evolution: [...prev.evolution, activePrompt.split(' ').slice(0, 2).join(' ')]
      }));
    }
  };

  /**
   * REMIX TRANSFORMATION HANDLER
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
        <p>Intelligent AI Music Experience | System-Driven Build</p>
      </header>

      <div className="wubble-layout">
        <main className="wubble-main">
          
          <PromptInput 
            value={session.prompt}
            onChange={(val) => setSession(prev => ({ ...prev, prompt: val }))}
            onGenerate={handleGenerate}
            disabled={isGenerating}
          />

          <div className="wubble-card glass main-glow">
            {/* Contextual Evolution Line */}
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

            {error && <p className="error-text">{error}</p>}

            {/* Remix and Suggestion Logic (Decoupled UI) */}
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
            setTrack(h.audio_url);
            setSession(prev => ({ ...prev, currentTrack: h }));
          }} 
        />
      </div>

      <footer className="wubble-footer">
        <p>Built for the Wubble Hackathon | State-of-the-art Implementation by Thanvi Reddy</p>
      </footer>
    </div>
  );
}

export default App;
