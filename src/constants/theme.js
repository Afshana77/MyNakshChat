/**
 * Centralized theme constants
 * All colors, sizes, and design tokens in one place
 */

export const COLORS = {
  // Primary
  primary: '#FF8C42',
  secondary: '#E8F5E9',
  
  // Message colors
  userBubble: '#FF8C42',
  aiBubble: '#E8F5E9',
  humanBubble: '#FFF3E0',
  systemText: '#888',
  
  // UI Elements
  text: '#333',
  textLight: '#666',
  textMuted: '#999',
  border: '#e0e0e0',
  background: '#f5f5f5',
  white: '#fff',
  error: '#ff6b6b',
  success: '#4CAF50',
  warning: '#f44336',
  
  // Overlays
  backdrop: 'rgba(0, 0, 0, 0.5)',
  backdropDark: 'rgba(0, 0, 0, 0.6)',
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  
  // Border radius
  radiusSm: 6,
  radiusMd: 12,
  radiusLg: 16,
  
  // Font sizes
  fontXs: 11,
  fontSm: 12,
  fontMd: 14,
  fontLg: 15,
  fontXl: 18,
  fontXxl: 28,
};

export const ANIMATIONS = {
  swipeThreshold: 80, // pixels to trigger reply
  longPressDelay: 400, // milliseconds
  springConfig: {
    damping: 10,
    mass: 1,
    overshootClamping: false,
  },
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  EVENT: 'event',
  AI: 'ai',
  HUMAN: 'human',
};

export const SENDER_TYPES = {
  USER: 'user',
  SYSTEM: 'system',
  AI_ASTROLOGER: 'ai_astrologer',
  HUMAN_ASTROLOGER: 'human_astrologer',
};

export const FEEDBACK_OPTIONS = {
  LIKED: 'liked',
  DISLIKED: 'disliked',
};

export const FEEDBACK_CHIPS = ['Inaccurate', 'Too Vague', 'Too Long'];

export const EMOJI_SET = ['🙏', '✨', '🌙', '❤️', '👍', '🔥'];

export const ALERT_MESSAGES = {
  END_CHAT_TITLE: 'End Chat Session',
  END_CHAT_MESSAGE: 'Are you sure you want to end this session? You will be asked to rate.',
  RATING_THANK_YOU: 'Thank You!',
  RATING_MESSAGE: 'Your rating of {rating} star{plural} has been recorded. We appreciate your feedback!',
  RATING_QUESTION: 'How was your session?',
};

export const TEXT_PLACEHOLDER = 'Type your message...';
