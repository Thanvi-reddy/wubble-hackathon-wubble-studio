/**
 * SESSION ORCHESTRATOR
 * Pure logic for updating session state, history, and evolution trails.
 * Decouples "Data Flow" from "UI Rendering."
 */

/**
 * Creates a new session state based on a fresh track generation.
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
