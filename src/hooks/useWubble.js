import { useState } from 'react';
import { generateTrack, waitForCompletion } from '../services/wubbleApi';

/**
 * CUSTOM HOOK: useWubble (Stage 15 - Full Flow Sync)
 * Orchestrates the music generation lifecycle with exact user-requested messaging.
 */
export const useWubble = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  const generate = async (prompt, isRemix = false) => {
    if (!prompt.trim()) return null;

    setIsGenerating(true);
    // PHASE 15: Exact Word Flow Alignment
    setStatusMessage(isRemix ? '🎧 Reworking your track...' : '🎧 Generating your track...');
    setError(null);

    try {
      await new Promise(r => setTimeout(r, 800)); // Psychology Delay

      const { request_id } = await generateTrack(prompt);
      
      const result = await waitForCompletion(request_id, (status) => {
        if (status === 'processing') {
          setStatusMessage(isRemix ? '🎧 Refining sound layers...' : '🎧 Mapping soundscape...');
        }
      });

      setIsGenerating(false);
      setStatusMessage('');
      return { success: true, data: { ...result, id: request_id } };
      
    } catch (err) {
      const msg = err.message || "Something went wrong. Please try again.";
      setIsGenerating(false);
      setStatusMessage('');
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return { isGenerating, statusMessage, error, generate };
};
