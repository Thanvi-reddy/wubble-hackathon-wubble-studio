/**
 * SUGGESTION ENGINE
 * Decoupled logic for guided AI exploration.
 */

const REMIX_DATA = {
  energy: { 
    text: 'This track feels light — try adding energy for more focus.',
    type: 'energy'
  },
  bass: { 
    text: 'The mix is airy — adding bass will give it more depth.',
    type: 'bass'
  },
  cinematic: { 
    text: 'Looking for a story? Cinematic elements will make it feel epic.',
    type: 'cinematic'
  }
};

/**
 * Returns a contextual suggestion based on the prompt content.
 * @param {string} prompt 
 */
export const getContextualSuggestion = (prompt) => {
  const p = prompt.toLowerCase();
  
  if (p.includes('lofi') || p.includes('ambient') || p.includes('chill')) {
    return REMIX_DATA.energy;
  }
  
  if (p.includes('orchestral') || p.includes('cinematic') || p.includes('strings')) {
    return REMIX_DATA.bass;
  }
  
  return REMIX_DATA.cinematic;
};
