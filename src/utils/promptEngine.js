/**
 * VARIATIONS FOR REMIX OPTIONS
 * These allow the AI to feel more "organic" by picking random descriptors 
 * instead of just appending a static string.
 */
export const REMIX_VARIATIONS = {
  energy: [
    "with fast tempo and dynamic rhythm",
    "with high-energy percussion",
    "with upbeat driving beats",
    "with powerful rhythmic intensity"
  ],
  bass: [
    "with deep bass layers",
    "with strong low-end presence",
    "with powerful sub-bass",
    "with rich textured bass response"
  ],
  cinematic: [
    "with orchestral strings and cinematic sweep",
    "with grand epic cinematic soundtrack vibe",
    "with atmospheric filmic textures",
    "with heroic cinematic brass and intensity"
  ]
};

/**
 * Applies a remix transformation to a prompt.
 * @param {string} prompt - The original prompt.
 * @param {string} type - 'energy', 'bass', or 'cinematic'.
 * @returns {string} The transformed prompt.
 */
export const applyRemix = (prompt, type) => {
  const pool = REMIX_VARIATIONS[type];
  if (!pool) return prompt;
  
  const variation = pool[Math.floor(Math.random() * pool.length)];
  return `${prompt} ${variation}`;
};

/**
 * Determines the next AI Suggestion based on current prompt content.
 * @param {string} prompt 
 * @returns {string} remix type ('energy', 'bass', or 'cinematic')
 */
export const getAISuggestion = (prompt) => {
  const p = prompt.toLowerCase();
  
  if (p.includes('lofi') || p.includes('ambient') || p.includes('chill')) {
    return 'energy';
  }
  
  if (p.includes('orchestral') || p.includes('cinematic') || p.includes('strings')) {
    return 'bass';
  }
  
  return 'cinematic';
};
