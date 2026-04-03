import axios from 'axios';
import { WUBBLE_API_BASE_URL, WUBBLE_API_KEY } from '../config';

/**
 * WUBBLE API SERVICE (INDUSTRIAL TIER)
 * Isolated service for interacting with Wubble AI's music generation endpoints.
 */

const wubbleApi = axios.create({
  baseURL: WUBBLE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WUBBLE_API_KEY}`,
  },
  timeout: 15000, 
});

/**
 * Sends a generation request.
 */
export const generateTrack = async (prompt) => {
  try {
    const response = await wubbleApi.post('/chat', {
      prompt,
      vocals: false,
    });
    
    if (!response.data || !response.data.request_id) {
      throw new Error("Invalid API response: Missing request_id.");
    }
    
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Failed to connect to Wubble.";
    throw new Error(msg);
  }
};

/**
 * Polls status.
 */
export const pollStatus = async (requestId) => {
  try {
    const response = await wubbleApi.get(`/polling/${requestId}`);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Polling connection lost.";
    throw new Error(msg);
  }
};

/**
 * High-level orchestration helper.
 */
export const waitForCompletion = async (requestId, onProgress = null) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 60; 

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
          reject(new Error("AI generation failed."));
        } else if (attempts > maxAttempts) {
          clearInterval(interval);
          reject(new Error("Request timed out."));
        }
      } catch (error) {
        // Handling polling drops via retry interval
      }
    }, 2000);
  });
};
