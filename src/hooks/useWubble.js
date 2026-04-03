import { useState } from 'react';
import { generateTrack, waitForCompletion } from '../services/wubbleApi';

/**
 * CUSTOM HOOK: useWubble
 * Orchestrates the full music generation lifecycle.
 */
export const useWubble = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  /**
   * Triggers the generation flow: Generate -> Wait -> Result.
   */
  const generate = async (prompt) => {
    if (!prompt.trim()) return null;

    setIsGenerating(true);
    setStatusMessage('Wubble is thinking...');
    setError(null);

    try {
      // 700ms "Psychology" Delay
      await new Promise(r => setTimeout(r, 700));

      const { request_id } = await generateTrack(prompt);
      
      const result = await waitForCompletion(request_id, (status) => {
        if (status === 'processing') {
          setStatusMessage('Reworking soundscape...');
        }
      });

      setIsGenerating(false);
      setStatusMessage('');
      return { ...result, id: request_id };
      
    } catch (err) {
      setIsGenerating(false);
      setStatusMessage('');
      setError(err.message);
      return null;
    }
  };

  return {
    isGenerating,
    statusMessage,
    error,
    generate
  };
};
