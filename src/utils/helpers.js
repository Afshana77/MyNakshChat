/**
 * Utility functions for common operations
 * Eliminates code duplication across components
 */

/**
 * Format timestamp to HH:MM format
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time string (e.g., "14:30")
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Determine message bubble style based on sender type
 * @param {string} sender - Message sender type
 * @param {string} messageType - Message type
 * @returns {object} Object with senderType booleans
 */
export const getMessageType = (sender, messageType) => ({
  isSystemMessage: messageType === 'event',
  isUserMessage: sender === 'user',
  isAIMessage: sender === 'ai_astrologer',
  isHumanMessage: sender === 'human_astrologer',
});

/**
 * Create new message object with optional reply
 * @param {string} text - Message text
 * @param {number} messageCount - Total message count (for ID generation)
 * @param {string|null} replyTo - Optional reply-to message ID
 * @returns {object} Message object
 */
export const createUserMessage = (text, messageCount, replyTo = null) => ({
  id: String(messageCount + 1),
  sender: 'user',
  text,
  timestamp: Date.now(),
  type: 'text',
  ...(replyTo && { replyTo }),
});

/**
 * Update mapping with toggle logic
 * Useful for reactions and selections that can be toggled
 * @param {object} mapping - Current state mapping { id: value }
 * @param {string} id - Item ID to toggle
 * @param {any} value - Value to add/toggle
 * @returns {object} Updated mapping
 */
export const toggleMapping = (mapping, id, value) => {
  const items = mapping[id] || [];
  const exists = items.includes(value);
  const updated = exists
    ? items.filter((item) => item !== value)
    : [...items, value];
  
  return {
    ...mapping,
    [id]: updated.length > 0 ? updated : undefined,
  };
};

/**
 * Update array mapping with item
 * Useful for adding items to collections
 * @param {object} mapping - Current state mapping { id: [] }
 * @param {string} id - Item ID
 * @param {any} item - Item to add
 * @returns {object} Updated mapping
 */
export const addToMapping = (mapping, id, item) => {
  const items = mapping[id] || [];
  return {
    ...mapping,
    [id]: [...items, item],
  };
};

/**
 * Update array mapping by removing item
 * Useful for removing items from collections
 * @param {object} mapping - Current state mapping { id: [] }
 * @param {string} id - Item ID
 * @param {any} item - Item to remove
 * @returns {object} Updated mapping
 */
export const removeFromMapping = (mapping, id, item) => {
  const items = mapping[id] || [];
  return {
    ...mapping,
    [id]: items.filter((i) => i !== item),
  };
};

/**
 * Format rating text with proper pluralization
 * @param {number} rating - Rating value
 * @returns {string} Formatted rating message
 */
export const formatRatingMessage = (rating) => {
  const plural = rating > 1 ? 's' : '';
  return `Your rating of ${rating} star${plural} has been recorded. We appreciate your feedback!`;
};

/**
 * Validate if message has enough content to send
 * @param {string} text - Message text
 * @returns {boolean} True if message is valid
 */
export const isValidMessage = (text) => text.trim().length > 0;

/**
 * Scroll to end of list with timeout
 * @param {React.RefObject} ref - FlatList ref
 * @param {number} delay - Delay before scrolling (default 100ms)
 */
export const scrollToEnd = (ref, delay = 100) => {
  setTimeout(() => {
    ref.current?.scrollToEnd({ animated: true });
  }, delay);
};
