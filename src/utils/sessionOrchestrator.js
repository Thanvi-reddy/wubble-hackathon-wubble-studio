/**
 * SESSION ORCHESTRATOR (Stage 10 - Elite)
 * Pure logic for updating session state, history, and evolution trails.
 * Handles final lifecycle logic away from UI components.
 */

/**
 * Validates if the system is ready to generate.
 */
export const canGenerate = (prompt, isGenerating) => {
  return prompt.trim().length > 0 && !isGenerating;
};

/**
 * Returns the resolved prompt for a generation request.
 */
export const resolvePrompt = (currentPrompt, overriddenPrompt = null) => {
  return overriddenPrompt || currentPrompt;
};

/**
 * Orchestrates a fresh track generation into the session state.
 */
export const orchestrateNewTrack = (prevSession, newTrack) => {
  return {
    ...prevSession,
    history: prevSession.currentTrack ? [prevSession.currentTrack, ...prevSession.history] : prevSession.history,
    currentTrack: newTrack,
    evolution: [...prevSession.evolution, newTrack.prompt.split(' ').slice(0, 2).join(' ')]
  };
};

/**
 * Updates the prompt in the session.
 */
export const updatePrompt = (prevSession, newPrompt) => {
  return {
    ...prevSession,
    prompt: newPrompt,
    error: null
  };
};

/**
 * Handles errors and resets session status.
 */
export const orchestrateError = (prevSession, errorMessage) => {
  return {
    ...prevSession,
    error: errorMessage,
    isGenerating: false
  };
};
