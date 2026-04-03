/**
 * REMIX ENGINE (PHASE 2)
 */

export const REMIX_VARIATIONS = {
  energy: [
    "with fast tempo and dynamic rhythm",
    "increasing energy for focus",
    "with high-energy driving percussion"
  ],
  bass: [
    "adding deep bass for depth",
    "with strong low-end presence",
    "rich textured bass layers"
  ],
  cinematic: [
    "with orchestral strings and cinematic sweep",
    "epic cinematic soundtrack vibe",
    "grand orchestral theme"
  ]
};

/**
 * Applies a specific remix transformation to the prompt.
 */
export const applyRemix = (prompt, type) => {
  const pool = REMIX_VARIATIONS[type];
  if (!pool) return prompt;
  
  const variation = pool[Math.floor(Math.random() * pool.length)];
  return `${prompt}, ${variation}`;
};

/**
 * Specialized individual handlers for each remix type.
 */
export const addBass = (prompt) => applyRemix(prompt, 'bass');
export const addEnergy = (prompt) => applyRemix(prompt, 'energy');
export const addCinematic = (prompt) => applyRemix(prompt, 'cinematic');
