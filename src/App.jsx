import { useState, useRef } from 'react'
import { generateTrack, waitForCompletion } from './services/wubbleApi'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [audioUrl, setAudioUrl] = useState(null)
  const [trackTitle, setTrackTitle] = useState('')
  
  const audioRef = useRef(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setIsGenerating(true)
      setStatusMessage('Initializing...')
      setAudioUrl(null)
      
      const { request_id } = await generateTrack(prompt)
      
      setStatusMessage('Wubble is crafting your music...')
      
      const result = await waitForCompletion(request_id, (status) => {
        if (status === 'processing') {
          setStatusMessage('Processing audio waveform...')
        }
      })

      setAudioUrl(result.audio_url)
      setTrackTitle(result.song_title)
      setStatusMessage('')
      
    } catch (error) {
      console.error(error)
      setStatusMessage('Error generating music. Please check your API key.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="wubble-container">
      <header>
        <h1>Wubble Studio</h1>
        <p>Interactive AI Music Experience</p>
      </header>

      <main className="wubble-card">
        <textarea
          className="wubble-input"
          placeholder="Describe the music you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          rows={3}
        />

        <div className="button-group">
          <button 
            className="wubble-button" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? 'GENERATING...' : 'GENERATE MUSIC'}
          </button>
          
          {isGenerating && (
            <span className="status-indicator pulse">
              {statusMessage}
            </span>
          )}
        </div>

        {audioUrl && (
          <div className="wubble-audio-player">
            <h3 style={{ marginBottom: '1rem', color: '#00BFFF' }}>
              {trackTitle}
            </h3>
            <audio 
              ref={audioRef}
              controls 
              src={audioUrl} 
              autoPlay
              style={{ width: '100%' }}
            />
          </div>
        )}
      </main>
      
      <footer>
        <p className="read-the-docs">
          Built with Wubble AI & React
        </p>
      </footer>
    </div>
  )
}

export default App
