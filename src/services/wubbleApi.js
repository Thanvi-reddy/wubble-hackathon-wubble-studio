import axios from 'axios';
import { WUBBLE_API_BASE_URL, WUBBLE_API_KEY } from '../config';

const wubbleApi = axios.create({
  baseURL: WUBBLE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WUBBLE_API_KEY}`,
  },
});

/**
 * Sends a generation request to Wubble.
 * @param {string} prompt - The descriptive prompt for the music.
 * @param {boolean} vocals - Whether to include vocals (default false).
 * @param {string} projectId - Optional context for sequels/variations.
 * @returns {Promise<{request_id: string, session_id: string}>}
 */
export const generateTrack = async (prompt, vocals = false, projectId = null) => {
  try {
    const response = await wubbleApi.post('/chat', {
      prompt,
      vocals,
      project_id: projectId,
    });
    return response.data;
  } catch (error) {
    console.error('Wubble API Error (Generate):', error);
    throw error;
  }
};

/**
 * Polls for completion of a request.
 * @param {string} requestId 
 * @returns {Promise<{status: string, audio_url?: string, song_title?: string}>}
 */
export const pollStatus = async (requestId) => {
  try {
    const response = await wubbleApi.get(`/polling/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Wubble API Error (Poll):', error);
    throw error;
  }
};

/**
 * Helper to wait until the track is ready.
 * @param {string} requestId 
 * @param {Function} onProgress - Optional callback for current status.
 * @returns {Promise<{audio_url: string, song_title: string}>}
 */
export const waitForCompletion = async (requestId, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const data = await pollStatus(requestId);
        if (onProgress) onProgress(data.status);

        if (data.status === 'completed' && data.audio_url) {
          clearInterval(interval);
          resolve({
            audio_url: data.audio_url,
            song_title: data.song_title || "Untitled Masterpiece",
            model_response: data.model_response,
          });
        } else if (data.status === 'failed') {
          clearInterval(interval);
          reject(new Error("Wubble AI failed to generate this track."));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 2000); // Poll every 2 seconds
  });
};
