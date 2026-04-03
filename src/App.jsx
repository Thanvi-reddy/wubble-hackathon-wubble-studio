import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ArrowRight, Sparkles } from 'lucide-react';

// Layered Architecture
import { generateTrack, waitForCompletion } from './services/wubbleApi';
import { applyRemix, getAISuggestion } from './utils/promptEngine';
import { useAudio } from './hooks/useAudio';

// Component Library
import PromptInput from './components/PromptInput';
import RemixConsole from './components/RemixConsole';
import AudioPlayerSection from './components/AudioPlayerSection';
import HistorySidebar from './components/HistorySidebar';

import './App.css';

/**
 * MAIN APPLICATION: Wubble Studio
 * Central state and control center.
 */
function App() {
  // Centralized "Engineered" State
  const [session, setSession] = useState({
    prompt: '',
    isGenerating: false,
    statusMessage: '',
    currentTrack: null,
    history: [],
    evolution: [],
    suggestion: null,
    error: null
  });

  const { 
    isPlaying, compareMode, setTrack, play, pause, toggleCompare, setIsPlaying, audioRef 
  } = useAudio();

  // Re-calculate AI Suggestions whenever the track updates
  useEffect(() => {
    if (session.currentTrack && !session.isGenerating) {
      const suggestType = getAISuggestion(session.currentTrack.prompt);
      setSession(prev => ({
        ...prev,
        suggestion: {
          type: suggestType,
          text: suggestType === 'energy' ? 'Track feels light — try adding energy for focus.' : 
                suggestType === 'bass' ? 'The mix is airy — adding bass will give it more depth.' : 
                'Looking for a grander vibe? Cinematic elements will make it feel epic.'
        }
      }));
    }
  }, [session.currentTrack, session.isGenerating]);

  /**
   * CORE GENERATION ENGINE
   */
  const handleGenerate = async (overriddenPrompt = null) => {
    const activePrompt = overriddenPrompt || session.prompt;
    if (!activePrompt.trim()) return;

    setSession(prev => ({ 
      ...prev, 
      isGenerating: true, 
      statusMessage: 'Wubble is thinking...', 
      error: null 
    }));

    try {
      // 700ms "Psychology" Thinking Delay
      await new Promise(r => setTimeout(r, 700));

      const { request_id } = await generateTrack(activePrompt);
      
      const result = await waitForCompletion(request_id, (status) => {
        if (status === 'processing') {
          setSession(prev => ({ ...prev, statusMessage: 'Thinking... Reworking soundscape...' }));
        }
      });

      const newTrack = {
        ...result,
        id: request_id, // For tracking
        prompt: activePrompt,
        timestamp: new Date().toLocaleTimeString()
      };

      // Set Track in Audio Controller Hook
      setTrack(newTrack.audio_url, session.currentTrack?.audio_url);

      // Update State Session
      setSession(prev => ({
        ...prev,
        history: prev.currentTrack ? [prev.currentTrack, ...prev.history] : prev.history,
        currentTrack: newTrack,
        evolution: [...prev.evolution, activePrompt.split(' ').slice(0, 2).join(' ')],
        isGenerating: false,
        statusMessage: ''
      }));

    } catch (err) {
      setSession(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message,
        statusMessage: ''
      }));
    }
  };

  /**
   * REMIX TRANSFORMATION ENGINE
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
        <p>Intelligent AI Music Experience | Engineered Build</p>
      </header>

      <div className="wubble-layout">
        <main className="wubble-main">
          
          <PromptInput 
            value={session.prompt}
            onChange={(val) => setSession(prev => ({ ...prev, prompt: val }))}
            onGenerate={handleGenerate}
            disabled={session.isGenerating}
          />

          <div className="wubble-card glass main-glow">
            {/* Evolution path breadcrumbs */}
            {session.evolution.length > 0 && !session.isGenerating && (
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
                className={`generate-btn ${session.isGenerating ? 'pulse' : ''}`}
                onClick={() => handleGenerate()}
                disabled={session.isGenerating || !session.prompt.trim()}
              >
                {session.isGenerating ? 'AI THINKING...' : 'GENERATE MUSIC'}
              </button>
              
              <AnimatePresence>
                {session.isGenerating && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="status-msg">
                    {session.statusMessage}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {session.error && <p className="error-text">{session.error}</p>}

            {/* Smart Remix Logic Section */}
            {session.currentTrack && !session.isGenerating && (
              <RemixConsole 
                onRemix={handleRemix}
                suggestion={session.suggestion}
                disabled={session.isGenerating}
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
        <p>Built for the Wubble Hackathon | Architecture & Implementation by Thanvi Reddy</p>
      </footer>
    </div>
  );
}

export default App;
