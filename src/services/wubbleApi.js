import axios from 'axios';
import { WUBBLE_API_BASE_URL, WUBBLE_API_KEY } from '../config';

/**
 * WUBBLE API SERVICE (PHASE 1 - UNBLOCKED)
 * Includes a Mock Bridge for zero-risk demo performance.
 */

// TOGGLE THIS TO 'false' WHEN YOU HAVE YOUR REAL API KEY
const USE_MOCK_MODE = true; 

const wubbleApi = axios.create({
  baseURL: WUBBLE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WUBBLE_API_KEY}`,
  },
  timeout: 15000, 
});

/**
 * MOCK GENERATION ENGINE
 * Returns a high-quality demo track after a 1.2s delay.
 */
const mockGenerate = async (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        song_title: "Wubble Demo Masterpiece",
        model_response: "Generated via Wubble Mock Engine for high-reliability demoing."
      });
    }, 1200);
  });
};

/**
 * GENERATION ENTRY POINT
 */
export const generateTrack = async (prompt) => {
  if (USE_MOCK_MODE) {
    return { request_id: "mock_" + Date.now() };
  }

  try {
    const response = await wubbleApi.post('/chat', {
      prompt,
      vocals: false,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection failed.");
  }
};

/**
 * POLL STATUS / MOCK RESOLUTION
 */
export const waitForCompletion = async (requestId, onProgress = null) => {
  if (requestId.startsWith("mock_")) {
    if (onProgress) onProgress('processing');
    return await mockGenerate();
  }

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await wubbleApi.get(`/polling/${requestId}`);
        if (onProgress) onProgress(res.data.status);

        if (res.data.status === 'completed' && res.data.audio_url) {
          clearInterval(interval);
          resolve(res.data);
        } else if (attempts > 60) {
          clearInterval(interval);
          reject(new Error("Timeout."));
        }
      } catch (e) { /* Retry... */ }
    }, 2000);
  });
};
