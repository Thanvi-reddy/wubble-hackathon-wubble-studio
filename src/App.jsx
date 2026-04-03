import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateTrack, waitForCompletion } from './services/wubbleApi'
import { Music, Zap, Volume2, Film, History as HistoryIcon, ArrowRight, Play, Pause, Repeat, Sparkles } from 'lucide-react'
import './App.css'

const PRESETS = [
  { id: 'study', name: '🎧 Study', prompt: 'lofi study music with soft rain' },
  { id: 'cinematic', name: '🎬 Cinematic', prompt: 'cinematic orchestral epic theme' },
  { id: 'gaming', name: '🎮 Gaming', prompt: 'cyberpunk synthwave driving beat' },
  { id: 'chill', name: '🌧️ Chill', prompt: 'ambient peaceful chill soundscape' }
]

const REMIX_OPTIONS = {
  energy: { 
    label: 'Energy', 
    icon: <Zap size={18} />, 
    prompts: ['with energetic beats', 'with fast tempo', 'with high-energy rhythm'],
    suggestion: 'This track feels light — adding energy will make it more focused.'
  },
  bass: { 
    label: 'Bass', 
    icon: <Volume2 size={18} />, 
    prompts: ['with deep bass', 'with strong low-end', 'with powerful sub-bass'],
    suggestion: 'The mix is airy — adding bass will give it more depth.'
  },
  cinematic: { 
    label: 'Cinematic', 
    icon: <Film size={18} />, 
    prompts: ['add orchestral strings', 'make it cinematic', 'with epic soundtrack vibe'],
    suggestion: 'Looking for a story? Cinematic elements will make it feel grander.'
  }
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [currentTrack, setCurrentTrack] = useState(null)
  const [history, setHistory] = useState([])
  const [compareMode, setCompareMode] = useState(false)
  const [evolutionPath, setEvolutionPath] = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const audioRef = useRef(null)

  // Suggestion logic
  useEffect(() => {
    if (currentTrack && !isGenerating) {
      const p = currentTrack.prompt.toLowerCase()
      if (p.includes('lofi') || p.includes('ambient')) {
        setSuggestion(REMIX_OPTIONS.energy)
      } else if (p.includes('orchestral') || p.includes('cinematic')) {
        setSuggestion(REMIX_OPTIONS.bass)
      } else {
        setSuggestion(REMIX_OPTIONS.cinematic)
      }
    }
  }, [currentTrack, isGenerating])

  const handleGenerate = async (overriddenPrompt = null) => {
    const activePrompt = overriddenPrompt || prompt
    if (!activePrompt.trim()) return

    try {
      setIsGenerating(true)
      setStatusMessage('Wait... Wubble is thinking...')
      
      // Delay for psychology (700ms)
      await new Promise(r => setTimeout(r, 700))
      
      const { request_id } = await generateTrack(activePrompt)
      
      const result = await waitForCompletion(request_id, (status) => {
        if (status === 'processing') setStatusMessage('Reworking soundscape...')
      })

      const newTrack = {
        id: request_id,
        url: result.audio_url,
        title: result.song_title,
        prompt: activePrompt,
        timestamp: new Date().toLocaleTimeString()
      }

      if (currentTrack) {
        setHistory([currentTrack, ...history])
      }

      setCurrentTrack(newTrack)
      setEvolutionPath([...evolutionPath, activePrompt.split(' ').slice(0, 2).join(' ')])
      setStatusMessage('')
      setCompareMode(false)
      setIsPlaying(true)
      
    } catch (error) {
      console.error(error)
      setStatusMessage('Something went wrong. Check API Key.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRemix = (type) => {
    const variation = REMIX_OPTIONS[type].prompts[Math.floor(Math.random() * REMIX_OPTIONS[type].prompts.length)]
    const newPrompt = `${currentTrack.prompt} ${variation}`
    setPrompt(newPrompt)
    handleGenerate(newPrompt)
  }

  const toggleCompare = () => {
    if (!history.length) return
    if (!compareMode) {
      audioRef.current.pause()
      setCompareMode(true)
    } else {
      setCompareMode(false)
    }
  }

  return (
    <div className="wubble-container">
      <header className="wubble-header">
        <div className="logo-section">
          <Sparkles className="logo-icon" />
          <h1>Wubble Studio</h1>
        </div>
        <p>Intelligent AI Music Experience</p>
      </header>

      <div className="wubble-layout">
        <main className="wubble-main">
          {/* Presets */}
          <div className="presets-bar">
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => { setPrompt(p.prompt); handleGenerate(p.prompt); }} className="preset-btn">
                {p.name}
              </button>
            ))}
          </div>

          <div className="wubble-card glass main-glow">
            <textarea
              className="wubble-input"
              placeholder="What should we create today?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />

            {!isGenerating && currentTrack && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="evolution-line"
              >
                {evolutionPath.map((step, i) => (
                  <span key={i} className="path-step">
                    {step} {i < evolutionPath.length - 1 && <ArrowRight size={14} />}
                  </span>
                ))}
              </motion.div>
            )}

            <div className="action-row">
              <button 
                className={`generate-btn ${isGenerating ? 'pulse' : ''}`}
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? 'AI THINKING...' : 'GENERATE'}
              </button>
              
              <AnimatePresence>
                {isGenerating && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="status-msg"
                  >
                    {statusMessage}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Remix Section */}
            {currentTrack && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="remix-section"
              >
                <h4>Suggested Next:</h4>
                <div className="remix-grid">
                  {Object.entries(REMIX_OPTIONS).map(([type, opt]) => (
                    <button 
                      key={type} 
                      className={`remix-btn ${suggestion?.label === opt.label ? 'highlight' : ''}`}
                      onClick={() => handleRemix(type)}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
                {suggestion && (
                  <p className="suggestion-text">
                    {suggestion.suggestion}
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Audio Player Container */}
          <AnimatePresence>
            {currentTrack && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="player-card glass"
              >
                <div className="player-header">
                  <div>
                    <span className="badge">{compareMode ? 'PREVIOUS VERSION' : 'CURRENT VERSION'}</span>
                    <h3>{currentTrack.title}</h3>
                  </div>
                  {history.length > 0 && (
                    <button className={`compare-toggle ${compareMode ? 'active' : ''}`} onClick={toggleCompare}>
                      {compareMode ? 'BACK TO NEW' : 'COMPARE v1 vs v2'}
                    </button>
                  )}
                </div>

                <div className="visualizer-container">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`viz-bar ${isPlaying ? 'animating' : ''}`}
                      style={{ animationDelay: `${i * 0.1}s`, height: `${20 + Math.random() * 60}%` }}
                    ></div>
                  ))}
                </div>
                
                <audio 
                  ref={audioRef}
                  controls 
                  src={compareMode ? history[0].url : currentTrack.url} 
                  autoPlay
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="wubble-player"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <aside className="wubble-sidebar glass">
          <div className="sidebar-header">
            <HistoryIcon size={18} />
            <h3>History</h3>
          </div>
          <div className="history-list">
            <AnimatePresence>
              {history.map((h, i) => (
                <motion.div 
                  key={h.id + i}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="history-item" 
                  onClick={() => setCurrentTrack(h)}
                >
                  <Play size={14} />
                  <div>
                    <p className="h-title">{h.title}</p>
                    <p className="h-prompt">{h.prompt.substring(0, 40)}...</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {history.length === 0 && <p className="empty-msg">No history yet.</p>}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
