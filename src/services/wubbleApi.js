import axios from 'axios';
import { WUBBLE_API_BASE_URL, WUBBLE_API_KEY } from '../config';

/**
 * WUBBLE API SERVICE (ENGINEERING V2)
 * Isolated service for interacting with Wubble AI's music generation endpoints.
 */

const wubbleApi = axios.create({
  baseURL: WUBBLE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WUBBLE_API_KEY}`,
  },
  timeout: 15000, // 15s timeout for initial request
});

/**
 * Sends a generation request to Wubble.
 * @param {string} prompt - The descriptive prompt for the music.
 * @returns {Promise<{request_id: string, session_id: string}>}
 */
export const generateTrack = async (prompt) => {
  try {
    const response = await wubbleApi.post('/chat', {
      prompt,
      vocals: false, // Defaulting for hackathon demo
    });
    
    if (!response.data || !response.data.request_id) {
      throw new Error("Invalid API response: Missing request_id.");
    }
    
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Failed to connect to Wubble.";
    console.error('[Wubble API] Generation failed:', msg);
    throw new Error(msg);
  }
};

/**
 * Polls for the current status of a track request.
 */
export const pollStatus = async (requestId) => {
  try {
    const response = await wubbleApi.get(`/polling/${requestId}`);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Polling connection lost.";
    console.warn('[Wubble API] Polling warning:', msg);
    throw new Error(msg);
  }
};

/**
 * High-level helper to wait until a track is ready.
 * Handles interval logic and final completion payload.
 */
export const waitForCompletion = async (requestId, onProgress = null) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 60; // Max 2 minutes (2s * 60)

    const interval = setInterval(async () => {
      attempts++;
      
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
          reject(new Error("AI generation failed. Please try a different prompt."));
        } else if (attempts > maxAttempts) {
          clearInterval(interval);
          reject(new Error("Request timed out. The server is taking too long."));
        }
      } catch (error) {
        // We handle network blips by continuing to poll unless it's a fatal error
        console.warn(`[Wubble API] Retry attempt ${attempts}: ${error.message}`);
      }
    }, 2000);
  });
};
