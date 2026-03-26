import { create } from 'zustand';

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'system',
    text: 'Your session with Astrologer Vikram has started.',
    timestamp: 1734681480000,
    type: 'event',
  },
  {
    id: '2',
    sender: 'user',
    text: 'Namaste. I am feeling very anxious about my current job. Can you look at my chart?',
    timestamp: 1734681600000,
    type: 'text',
  },
  {
    id: '3',
    sender: 'ai_astrologer',
    text: 'Namaste! I am analyzing your birth details. Currently, you are running through Shani Mahadasha. This often brings pressure but builds resilience.',
    timestamp: 1734681660000,
    type: 'ai',
    hasFeedback: true,
    feedbackType: 'liked',
  },
  {
    id: '4',
    sender: 'human_astrologer',
    text: "I see the same. Look at your 6th house; Saturn is transiting there. This is why you feel the workload is heavy.",
    timestamp: 1734681720000,
    type: 'human',
  },
  {
    id: '5',
    sender: 'user',
    text: 'Is there any remedy for this? I find it hard to focus.',
    timestamp: 1734681780000,
    type: 'text',
    replyTo: '4',
  },
  {
    id: '6',
    sender: 'ai_astrologer',
    text: 'I suggest chanting the Shani Mantra 108 times on Saturdays. Would you like the specific mantra text?',
    timestamp: 1734681840000,
    type: 'ai',
    hasFeedback: false,
  },
];

export const useChatStore = create((set) => ({
  messages: INITIAL_MESSAGES,
  replyingTo: null,
  messageReactions: {}, // { messageId: ['🙏', '✨'] }
  selectedFeedback: {}, // { messageId: 'liked' | 'disliked' }
  expandedFeedback: {}, // { messageId: true/false }
  selectedFeedbackChips: {}, // { messageId: ['Inaccurate', 'Too Vague'] }
  sessionRated: false,
  sessionRating: 0,

  // Message actions
addMessage: (message) =>
  set((state) => {
    const exists = state.messages.some((msg) => msg.id === message.id);
    if (exists) return state;

    // 🔥 Ensure timestamp exists
    const messageWithTimestamp = {
      ...message,
      timestamp: message.timestamp || Date.now(),
    };

    const updatedMessages = [...state.messages, messageWithTimestamp].sort(
      (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
    );

    return {
      messages: updatedMessages,
    };
  }),
updateMessageStatus: (id, status) =>
  set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, status } : msg
    ),
  })),
  setReplyingTo: (messageId) =>
    set({
      replyingTo: messageId,
    }),

  clearReply: () =>
    set({
      replyingTo: null,
    }),

  // Reactions
  toggleReaction: (messageId, emoji) =>
    set((state) => {
      const currentReaction = state.messageReactions[messageId];
      const updated = currentReaction === emoji ? undefined : emoji;
      return {
        messageReactions: {
          ...state.messageReactions,
          [messageId]: updated,
        },
      };
    }),

  // AI Feedback
  setMessageFeedback: (messageId, feedbackType) =>
    set((state) => ({
      selectedFeedback: {
        ...state.selectedFeedback,
        [messageId]: feedbackType,
      },
      expandedFeedback:
        feedbackType === 'disliked'
          ? {
              ...state.expandedFeedback,
              [messageId]: true,
            }
          : state.expandedFeedback,
    })),

  toggleFeedbackExpanded: (messageId) =>
    set((state) => ({
      expandedFeedback: {
        ...state.expandedFeedback,
        [messageId]: !state.expandedFeedback[messageId],
      },
    })),

  addFeedbackChip: (messageId, chip) =>
    set((state) => {
      const chips = state.selectedFeedbackChips[messageId] || [];
      return {
        selectedFeedbackChips: {
          ...state.selectedFeedbackChips,
          [messageId]: [...chips, chip],
        },
      };
    }),

  removeFeedbackChip: (messageId, chip) =>
    set((state) => {
      const chips = state.selectedFeedbackChips[messageId] || [];
      return {
        selectedFeedbackChips: {
          ...state.selectedFeedbackChips,
          [messageId]: chips.filter((c) => c !== chip),
        },
      };
    }),

  // Session
  rateSession: (rating) =>
    set({
      sessionRated: true,
      sessionRating: rating,
    }),
 
  resetSession: () =>
    set({
      messages: INITIAL_MESSAGES,
      replyingTo: null,
      messageReactions: {},
      selectedFeedback: {},
      expandedFeedback: {},
      selectedFeedbackChips: {},
      sessionRated: false,
      sessionRating: 0,
    }),
}));


