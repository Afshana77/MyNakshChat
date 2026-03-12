import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useChatStore } from '../../../store/chatStore';
import {
  COLORS,
  SIZES,
  FEEDBACK_CHIPS,
  FEEDBACK_OPTIONS,
} from '../../constants/theme';

export default function FeedbackSection({ messageId }) {
  const {
    selectedFeedback,
    expandedFeedback,
    setMessageFeedback,
    addFeedbackChip,
    removeFeedbackChip,
    selectedFeedbackChips,
  } = useChatStore();

  const feedback = selectedFeedback[messageId];
  const chips = selectedFeedbackChips[messageId] || [];

  /**
   * Generic handler for feedback selection
   * Single source of truth for like/dislike logic
   */
  const handleFeedback = (feedbackType) => {
    setMessageFeedback(messageId, feedbackType);
  };

  /**
   * Generic handler for chip toggling
   * Eliminates duplicate chip logic
   */
  const handleChipToggle = (chip) => {
    if (chips.includes(chip)) {
      removeFeedbackChip(messageId, chip);
    } else {
      addFeedbackChip(messageId, chip);
    }
  };

  return (
    <View style={styles.container}>
      {/* Like / Dislike Buttons */}
      <View style={styles.feedbackButtons}>
        <TouchableOpacity
          style={[
            styles.button,
            feedback === FEEDBACK_OPTIONS.LIKED && styles.activeButton,
          ]}
          onPress={() => handleFeedback(FEEDBACK_OPTIONS.LIKED)}
        >
          <Text style={styles.buttonText}>👍 Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            feedback === FEEDBACK_OPTIONS.DISLIKED && styles.dislikedButton,
          ]}
          onPress={() => handleFeedback(FEEDBACK_OPTIONS.DISLIKED)}
        >
          <Text style={styles.buttonText}>👎 Dislike</Text>
        </TouchableOpacity>
      </View>

      {/* Expandable Feedback Chips */}
      {feedback === FEEDBACK_OPTIONS.DISLIKED && (
        <View style={styles.chipsContainer}>
          {FEEDBACK_CHIPS.map((chip) => (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                chips.includes(chip) && styles.selectedChip,
              ]}
              onPress={() => handleChipToggle(chip)}
            >
              <Text
                style={[
                  styles.chipText,
                  chips.includes(chip) && styles.selectedChipText,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: SIZES.md,
    marginTop: SIZES.md,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  button: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeButton: {
    backgroundColor: COLORS.aiBubble,
    borderColor: COLORS.success,
  },
  dislikedButton: {
    backgroundColor: '#FFEBEE',
    borderColor: COLORS.warning,
  },
  buttonText: {
    fontSize: SIZES.fontSm,
    fontWeight: '500',
    color: COLORS.text,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: SIZES.xs,
    marginTop: SIZES.xs,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedChip: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  chipText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textLight,
  },
  selectedChipText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
