import { useState } from 'react';
import { generateTrack, waitForCompletion } from '../services/wubbleApi';

/**
 * CUSTOM HOOK: useWubble (Stage 12 - Final Stabilization)
 * Orchestrates the full music generation lifecycle with instant error feedback.
 */
export const useWubble = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  /**
   * Triggers the generation flow.
   * Returns: { success: true, data: track } OR { success: false, error: msg }
   */
  const generate = async (prompt) => {
    if (!prompt.trim()) return null;

    setIsGenerating(true);
    setStatusMessage('Wubble is thinking...');
    setError(null);

    try {
      // 700ms Psychology Thinking Delay
      await new Promise(r => setTimeout(r, 700));

      const { request_id } = await generateTrack(prompt);
      
      const result = await waitForCompletion(request_id, (status) => {
        if (status === 'processing') {
          setStatusMessage('Reworking soundscape...');
        }
      });

      setIsGenerating(false);
      setStatusMessage('');
      return { success: true, data: { ...result, id: request_id } };
      
    } catch (err) {
      const msg = err.message || "Failed to generate track.";
      setIsGenerating(false);
      setStatusMessage('');
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return {
    isGenerating,
    statusMessage,
    error,
    generate
  };
};
